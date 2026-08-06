import { Injectable, Logger } from '@nestjs/common';
import {
  EnterpriseGraphService,
  TwinNode,
} from '../graph/enterprise-graph.service';
import { PrismaService } from '../../../prisma/prisma.service';

export interface PredictionResult {
  predictedFutureState: Record<string, unknown>;
  riskScore: number; // 0-100, where 100 is critical risk
  confidence: number; // 0-100
  timelineEvents: Record<string, unknown>[]; // Predicted future events
  recommendations: string[];
}

@Injectable()
export class PredictionEngine {
  private readonly logger = new Logger(PredictionEngine.name);

  constructor(
    private readonly graphService: EnterpriseGraphService,
    private readonly prisma: PrismaService,
  ) {}

  /**
   * Evaluates the current state of a node and its dependencies against historical rules
   * to attach a predictedFutureState and riskScore.
   */
  async predictState(
    companyId: string,
    twinId: string,
  ): Promise<PredictionResult> {
    this.logger.debug(`[Prediction] Analyzing future state for ${twinId}`);

    // 1. Traverse Graph Context
    const context = await this.graphService.traverseContext(
      companyId,
      twinId,
      1,
    );
    if (context.length === 0) {
      return this.defaultPrediction();
    }

    const rootNode = context[0];

    // 2. Apply Risk Heuristics
    // In a production environment, this calls a Python microservice running ML models (Prophet/XGBoost).
    // For this implementation, we apply a rules-based heuristic using the graph context.
    let riskScore = 10;
    const recommendations: string[] = [];

    // Example Heuristic: If a trip is dependent on a vehicle that recently had a maintenance anomaly
    const vehicleNodes = context.filter((n) => n.type === 'VEHICLE');
    if (vehicleNodes.some((v) => v.state?.status === 'MAINTENANCE_REQUIRED')) {
      riskScore += 60;
      recommendations.push(
        'Reassign Trip to a healthy vehicle immediately to avoid SLA breach.',
      );
    }

    return {
      predictedFutureState: {
        ...rootNode.state,
        estimatedDelayMinutes: riskScore > 50 ? 120 : 0,
      },
      riskScore: Math.min(riskScore, 100),
      confidence: 85,
      timelineEvents: [
        { type: 'PREDICTED_DELAY', timestamp: new Date(Date.now() + 3600000) },
      ],
      recommendations,
    };
  }

  private defaultPrediction(): PredictionResult {
    return {
      predictedFutureState: {},
      riskScore: 0,
      confidence: 0,
      timelineEvents: [],
      recommendations: [],
    };
  }
}
