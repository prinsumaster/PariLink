import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { MockAIProvider } from '../providers/mock-ai.provider';

@Injectable()
export class PredictionEngineService {
  private readonly logger = new Logger(PredictionEngineService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly aiProvider: MockAIProvider,
  ) {}

  /**
   * Generates a prediction (e.g. ETA) and tracks its accuracy over time
   */
  async generatePrediction(
    companyId: string,
    targetEntity: string,
    entityId: string,
    features: any,
  ) {
    this.logger.log(`Generating Prediction for ${targetEntity}`);

    const context = JSON.stringify(features);
    const schema = {
      properties: {
        predictedValue: { type: 'object' },
        confidence: { type: 'number' },
        factors: { type: 'array', items: { type: 'string' } },
      },
    };

    const output = await this.aiProvider.structuredGenerate<any>(
      'Predict future state',
      context,
      schema,
    );

    const prediction = await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.aiPrediction.create({
        data: {
          companyId,
          targetEntity,
          entityId,
          predictedValue: output.predictedValue,
          confidence: output.confidence,
          factors: output.factors,
        },
      }),
    );

    return prediction;
  }
}
