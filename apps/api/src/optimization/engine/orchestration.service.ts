import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { PlanningService } from '../../dispatch/engine/planning.service';
import { EventStoreService } from '../../platform/digital-twin/event-store.service';

@Injectable()
export class OrchestrationService {
  private readonly logger = new Logger(OrchestrationService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly planning: PlanningService,
    private readonly eventStore: EventStoreService,
  ) {}

  /**
   * Accepts a generated optimization scenario and executes it.
   * This translates recommendations into Dispatch Plans and executes assignments.
   */
  async acceptScenario(companyId: string, scenarioId: string, userId: string) {
    const scenario = await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.optimizationScenario.findUnique({
        where: { id: scenarioId, companyId },
        include: { recommendations: true },
      }),
    );

    if (!scenario) throw new NotFoundException('Scenario not found');
    if (scenario.status !== 'GENERATED') {
      throw new BadRequestException(
        `Scenario is already in status ${scenario.status}`,
      );
    }

    // 1. Mark scenario as accepted
    await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.optimizationScenario.update({
        where: { id: scenarioId },
        data: { status: 'ACCEPTED' },
      }),
    );

    let successCount = 0;
    let failCount = 0;

    // 2. Execute each recommendation using the Dispatch Engine state machine
    for (const rec of scenario.recommendations) {
      try {
        // Step A: Create the Draft Dispatch Plan for the load
        const plan = await this.planning.createPlan(
          companyId,
          rec.loadId,
          userId,
        );

        // Step B: We already optimized, but the Dispatch Engine requires candidates to be generated.
        // We will mock the generation step to inject our exact recommendation as the only candidate.
        // For architectural purity, we create a single candidate and assign it.
        const candidate = await this.prisma.runAsTenant(companyId, async (tx) =>
          tx.dispatchCandidate.create({
            data: {
              planId: plan.planId,
              companyId,
              vehicleId: rec.vehicleId!,
              driverId: rec.driverId!,
              trailerId: rec.trailerId,
              totalScore: 100, // forced choice
              scoreBreakdown: { source: 'OPTIMIZATION_ENGINE', scenarioId },
            },
          }),
        );

        await this.prisma.runAsTenant(companyId, async (tx) =>
          tx.dispatchPlan.update({
            where: { id: plan.planId },
            data: { status: 'VALIDATED' }, // skip DRAFT straight to VALIDATED
          }),
        );

        await this.eventStore.append({
          tenantId: companyId,
          streamId: plan.planId,
          streamType: 'DISPATCH_PLAN',
          eventType: 'CandidatesGenerated',
          expectedVersion: 1,
          payload: { source: 'OPTIMIZATION_ENGINE', scenarioId },
          userId,
        });

        // Step C: Execute assignment (this handles resource locking, Trip creation, etc.)
        await this.planning.assign(
          companyId,
          plan.planId,
          userId,
          candidate.id,
          'Optimized bulk assignment',
        );

        successCount++;
        this.logger.debug(
          `Successfully orchestrated dispatch plan ${plan.planId} for load ${rec.loadId}`,
        );
      } catch (err: any) {
        failCount++;
        this.logger.error(
          `Failed to orchestrate load ${rec.loadId}: ${err.message}`,
        );
      }
    }

    this.logger.log(
      `Scenario ${scenarioId} orchestration complete: ${successCount} succeeded, ${failCount} failed.`,
    );

    return {
      success: true,
      scenarioId,
      executed: successCount,
      failed: failCount,
    };
  }
}
