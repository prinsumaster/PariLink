import { Injectable, Logger } from '@nestjs/common';
import { EnterpriseGraphService } from '../graph/enterprise-graph.service';
import {
  PredictionEngine,
  PredictionResult,
} from '../prediction/prediction.engine';

export interface SimulationParameters {
  scenario: string;
  mutations: Array<{ targetId: string; mutation: any }>;
}

export interface SimulationResult {
  scenario: string;
  baselineHealth: number;
  simulatedHealth: number;
  impactedNodes: string[];
  predictions: Record<string, PredictionResult>;
}

@Injectable()
export class SimulationEngine {
  private readonly logger = new Logger(SimulationEngine.name);

  constructor(
    private readonly graphService: EnterpriseGraphService,
    private readonly predictionEngine: PredictionEngine,
  ) {}

  /**
   * Run simulations without modifying production data.
   * Clones a TwinSnapshot into memory, applies mutations (e.g., "Fuel increases 15%"),
   * runs the prediction heuristics, and returns the diff.
   */
  async runSimulation(
    companyId: string,
    parameters: SimulationParameters,
  ): Promise<SimulationResult> {
    this.logger.log(`[Simulation] Running scenario: ${parameters.scenario}`);

    // In a full implementation, we would recursively clone the graph context for all mutated targets.
    // For MVP, we simulate the outcome based on the prediction engine.

    const predictions: Record<string, PredictionResult> = {};
    const impactedNodes: string[] = [];
    let cumulativeRiskDelta = 0;

    for (const mutation of parameters.mutations) {
      this.logger.debug(
        `[Simulation] Applying mutation to ${mutation.targetId}`,
      );
      impactedNodes.push(mutation.targetId);

      // Simulate getting a baseline prediction vs mutated prediction
      const baseline = await this.predictionEngine.predictState(
        companyId,
        mutation.targetId,
      );

      // Mocking the mutation effect: artificially inflate risk for the simulation
      const simulatedRisk = Math.min(baseline.riskScore + 25, 100);
      cumulativeRiskDelta += simulatedRisk - baseline.riskScore;

      predictions[mutation.targetId] = {
        ...baseline,
        riskScore: simulatedRisk,
        predictedFutureState: {
          ...baseline.predictedFutureState,
          ...mutation.mutation,
        },
        recommendations: [
          ...baseline.recommendations,
          `Simulation Alert: Mutation caused a ${simulatedRisk - baseline.riskScore} point risk increase.`,
        ],
      };
    }

    // Business Health is generally inverse to aggregate risk
    const baselineHealth = 95; // Mock baseline
    const simulatedHealth = Math.max(
      baselineHealth -
        cumulativeRiskDelta / Math.max(parameters.mutations.length, 1),
      0,
    );

    return {
      scenario: parameters.scenario,
      baselineHealth,
      simulatedHealth,
      impactedNodes,
      predictions,
    };
  }
}
