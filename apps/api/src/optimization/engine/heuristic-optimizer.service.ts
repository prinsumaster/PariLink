import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  NetworkStateService,
  NetworkStateContext,
} from './network-state.service';
import { CostEstimatorService } from './cost-estimator.service';
import { ConstraintEngine } from '../../dispatch/engine/constraint.engine';

export enum OptimizationObjective {
  COST_MINIMIZATION = 'COST_MINIMIZATION',
  TIME_MINIMIZATION = 'TIME_MINIMIZATION',
  UTILIZATION_MAXIMIZATION = 'UTILIZATION_MAXIMIZATION',
}

@Injectable()
export class HeuristicOptimizerService {
  private readonly logger = new Logger(HeuristicOptimizerService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly networkState: NetworkStateService,
    private readonly costEstimator: CostEstimatorService,
    private readonly constraintEngine: ConstraintEngine,
  ) {}

  /**
   * Generates optimization scenarios for the current network state.
   */
  async generateScenarios(companyId: string): Promise<string[]> {
    const context = await this.networkState.buildOptimizationContext(companyId);

    if (context.openLoads.length === 0) {
      this.logger.log(`No open loads to optimize for company ${companyId}.`);
      return [];
    }

    const scenarioIds: string[] = [];

    // Generate Scenario 1: Cost Minimization
    const costScenario = await this.runScenario(
      context,
      OptimizationObjective.COST_MINIMIZATION,
    );
    if (costScenario) scenarioIds.push(costScenario);

    // Generate Scenario 2: Time Minimization (Fastest Delivery)
    const timeScenario = await this.runScenario(
      context,
      OptimizationObjective.TIME_MINIMIZATION,
    );
    if (timeScenario) scenarioIds.push(timeScenario);

    return scenarioIds;
  }

  private async runScenario(
    context: NetworkStateContext,
    objective: OptimizationObjective,
  ): Promise<string | null> {
    // Clone available vehicles so we can remove them as they get assigned
    const pool = [...context.availableVehicles];

    let totalCost = 0;
    let totalRevenue = 0;
    let totalMargin = 0;
    let sumConfidence = 0;
    let assignedCount = 0;

    const recommendationsToInsert: any[] = [];

    // Simple heuristic: process loads in order of pickup date
    for (const load of context.openLoads) {
      let bestCandidate: (typeof pool)[0] | null = null;
      let bestMetric =
        objective === OptimizationObjective.UTILIZATION_MAXIMIZATION
          ? -Infinity
          : Infinity;
      let bestEstimation: ReturnType<
        typeof this.costEstimator.estimate
      > | null = null;
      let bestCandidateIndex = -1;

      for (let i = 0; i < pool.length; i++) {
        const candidate = pool[i];

        // 1. Hard Constraints (reuse dispatch engine logic)
        const { violations } = this.constraintEngine.evaluate({
          load,
          vehicle: candidate.vehicle,
          driver: candidate.driver || { id: 'UNASSIGNED', status: 'AVAILABLE' },
        });

        const hasFatal = violations.some((v: any) => v.isFatal);
        if (hasFatal) continue; // skip infeasible

        // 2. Estimate Costs & Metrics
        const estimation = this.costEstimator.estimate(
          load,
          candidate.vehicle,
          candidate.driver,
          candidate.state,
        );

        // 3. Evaluate objective
        let metric = 0;
        if (objective === OptimizationObjective.COST_MINIMIZATION) {
          metric = estimation.estimatedCost;
          if (metric < bestMetric) {
            bestMetric = metric;
            bestCandidate = candidate;
            bestEstimation = estimation;
            bestCandidateIndex = i;
          }
        } else if (objective === OptimizationObjective.TIME_MINIMIZATION) {
          metric = estimation.durationHours;
          if (metric < bestMetric) {
            bestMetric = metric;
            bestCandidate = candidate;
            bestEstimation = estimation;
            bestCandidateIndex = i;
          }
        } else if (
          objective === OptimizationObjective.UTILIZATION_MAXIMIZATION
        ) {
          metric = estimation.expectedMargin; // maximize margin
          if (metric > bestMetric) {
            bestMetric = metric;
            bestCandidate = candidate;
            bestEstimation = estimation;
            bestCandidateIndex = i;
          }
        }
      }

      // 4. Create recommendation if a feasible candidate was found
      if (bestCandidate && bestEstimation) {
        recommendationsToInsert.push({
          loadId: load.id,
          vehicleId: bestCandidate.vehicle.id,
          driverId: bestCandidate.driver?.id || null,
          trailerId: null, // simplification
          expectedCost: bestEstimation.estimatedCost,
          expectedRevenue: bestEstimation.estimatedRevenue,
          confidenceScore: bestEstimation.confidenceScore,
          reasonCodes: ['HEURISTIC_SELECTION'],
        });

        totalCost += bestEstimation.estimatedCost;
        totalRevenue += bestEstimation.estimatedRevenue;
        totalMargin += bestEstimation.expectedMargin;
        sumConfidence += bestEstimation.confidenceScore;
        assignedCount++;

        // Remove from pool to prevent double-assignment in this scenario
        pool.splice(bestCandidateIndex, 1);
      }
    }

    if (recommendationsToInsert.length === 0) {
      this.logger.debug(
        `Scenario ${objective} yielded no feasible assignments.`,
      );
      return null;
    }

    // 5. Persist Scenario & Recommendations transactionally
    const avgConfidence = sumConfidence / assignedCount;

    const scenario = await this.prisma.$transaction(async (tx) => {
      const created = await tx.optimizationScenario.create({
        data: {
          companyId: context.companyId,
          objective,
          status: 'GENERATED',
          totalCost,
          totalRevenue,
          margin: totalMargin,
          confidenceScore: avgConfidence,
          explanation: `Heuristic assignment of ${assignedCount} loads prioritizing ${objective}.`,
        },
      });

      await tx.optimizationRecommendation.createMany({
        data: recommendationsToInsert.map((r) => ({
          ...r,
          scenarioId: created.id,
          companyId: context.companyId,
        })),
      });

      return created;
    });

    this.logger.log(
      `Generated Scenario ${scenario.id} [${objective}] for company ${context.companyId}`,
    );
    return scenario.id;
  }
}
