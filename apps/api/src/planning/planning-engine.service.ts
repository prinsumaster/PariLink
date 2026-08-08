import {
  Injectable,
  Logger,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { HeuristicOptimizerService } from '../optimization/engine/heuristic-optimizer.service';
import { LlmManagerService } from '../ai/platform/llm-manager.service';
import { EventService } from '../platform/events/event.service';

@Injectable()
export class PlanningEngineService {
  private readonly logger = new Logger(PlanningEngineService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly optimizer: HeuristicOptimizerService,
    private readonly llmManager: LlmManagerService,
    private readonly eventService: EventService,
  ) {}

  /**
   * Pipeline Step 1: Run optimization and augment exceptions.
   */
  async runPipeline(companyId: string) {
    this.logger.log(
      `Starting Morning Planning Pipeline for company ${companyId}`,
    );

    // Step 1: Trigger heuristic optimization (UTILIZATION_MAXIMIZATION)
    const scenarioIds = await this.optimizer.generateScenarios(companyId);

    if (scenarioIds.length === 0) {
      throw new BadRequestException(
        'Cannot run planning: No open loads or available vehicles found.',
      );
    }

    // Use the latest generated scenario for the plan
    const latestScenarioId = scenarioIds[scenarioIds.length - 1];

    const scenario = await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.optimizationScenario.findUnique({
        where: { id: latestScenarioId },
        include: { recommendations: true },
      }),
    );

    if (!scenario)
      throw new NotFoundException('Optimization Scenario failed to generate.');

    let autoPlanned = 0;
    let needsApproval = 0;
    let requiresHuman = 0;

    // Step 2 & 3: Segregate and Augment in Parallel
    const planItems = await Promise.all(
      scenario.recommendations.map(async (rec) => {
        let status = 'AUTO_PLANNED';
        let aiDecisionProposal = null;

        if (rec.confidenceScore < 0.7) {
          status = 'REQUIRES_HUMAN';
          requiresHuman++;
        } else if (rec.confidenceScore < 0.9) {
          status = 'NEEDS_APPROVAL';
          needsApproval++;
        } else {
          autoPlanned++;
        }

        // Step 3: Augment exceptions using AI
        if (status !== 'AUTO_PLANNED') {
          try {
            const aiResponse = await this.llmManager.generateResponse(
              `You are an expert logistics dispatcher. A heuristic optimization engine has recommended assigning load ${rec.loadId} to vehicle ${rec.vehicleId} but the confidence is ${rec.confidenceScore}. Generate a structured decision proposal explaining why this might be risky, the financial impact, and a rollback strategy. Return ONLY valid JSON matching this schema: { "category": "ASSIGNMENT", "actionIntent": "string", "riskLevel": "MEDIUM" | "HIGH", "confidenceScore": number, "businessImpact": "string", "costImpact": "string", "reasoning": "string", "alternativeOptions": ["string"], "expectedOutcome": "string", "rollbackStrategy": "string" }`,
              `Evaluate this dispatch recommendation.`,
              { recommendation: rec },
              'openai', // fallback/default
            );

            // Basic JSON extraction if LLM wrapped in markdown
            const jsonStr = aiResponse
              .replace(/```json/g, '')
              .replace(/```/g, '')
              .trim();
            aiDecisionProposal = JSON.parse(jsonStr);
            // ensure risk level maps to status
            aiDecisionProposal.riskLevel =
              status === 'REQUIRES_HUMAN' ? 'HIGH' : 'MEDIUM';
          } catch (e: any) {
            this.logger.error(
              `Failed to generate AI decision for exception: ${e.message}`,
            );
            aiDecisionProposal = {
              category: 'ASSIGNMENT',
              actionIntent: `Assign Load ${rec.loadId}`,
              riskLevel: status === 'REQUIRES_HUMAN' ? 'HIGH' : 'MEDIUM',
              confidenceScore: rec.confidenceScore,
              businessImpact: 'Manual review needed',
              costImpact: 'Unknown',
              reasoning: 'AI analysis failed. Please review manually.',
              alternativeOptions: [],
              expectedOutcome: 'Pending manual review',
              rollbackStrategy: 'Cancel dispatch',
            };
          }
        }

        return {
          loadId: rec.loadId,
          vehicleId: rec.vehicleId,
          driverId: rec.driverId,
          status,
          confidenceScore: rec.confidenceScore,
          expectedCost: rec.expectedCost,
          expectedRevenue: rec.expectedRevenue,
          aiDecisionProposal,
        };
      }),
    );

    // Create the Daily Plan
    const planDate = new Date();
    planDate.setHours(0, 0, 0, 0);

    const plan = await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.operationalPlan.create({
        data: {
          companyId,
          date: planDate,
          status: 'DRAFT',
          metrics: {
            totalSavings: scenario.margin, // using margin as proxy for savings
            fuelSaved: Math.round(scenario.margin * 0.1), // Mock metric
            onTimePercentage: scenario.confidenceScore * 100,
            totalRevenue: scenario.totalRevenue,
            autoPlanned,
            needsApproval,
            requiresHuman,
          },
          items: {
            create: planItems,
          },
        },
        include: { items: true },
      }),
    );

    this.logger.log(
      `Created OperationalPlan ${plan.id} for company ${companyId}`,
    );

    // Broadcast event
    this.eventService.publish('OperationalPlan.Generated', {
      tenantId: companyId,
      payload: {
        type: 'SYSTEM_NOTIFICATION',
        planId: plan.id,
        date: plan.date,
        metrics: plan.metrics,
      },
    });

    return plan;
  }

  async getLatestPlan(companyId: string) {
    const planDate = new Date();
    planDate.setHours(0, 0, 0, 0);

    const plan = await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.operationalPlan.findFirst({
        where: { companyId, date: planDate },
        include: { items: true },
        orderBy: { createdAt: 'desc' },
      }),
    );

    if (!plan) return null;
    return plan;
  }

  async approveItem(companyId: string, itemId: string) {
    const item = await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.operationalPlanItem.findFirst({
        where: { id: itemId, plan: { companyId } },
      }),
    );
    if (!item) throw new NotFoundException('Plan item not found.');

    await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.operationalPlanItem.update({
        where: { id: itemId },
        data: { status: 'AUTO_PLANNED' },
      }),
    );

    return {
      success: true,
      message: 'Item approved and moved to Auto Planned.',
    };
  }

  async rejectItem(companyId: string, itemId: string, reason: string) {
    const item = await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.operationalPlanItem.findFirst({
        where: { id: itemId, plan: { companyId } },
      }),
    );
    if (!item) throw new NotFoundException('Plan item not found.');

    await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.operationalPlanItem.update({
        where: { id: itemId },
        data: { status: 'REQUIRES_HUMAN' }, // Kick it back to manual
      }),
    );

    // In a real system, we'd log the rejection reason for AI retraining
    return { success: true, message: `Item rejected for reason: ${reason}` };
  }
}
