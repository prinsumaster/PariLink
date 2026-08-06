import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ContextEngineService } from '../context/context-engine.service';
import { MockAIProvider } from '../providers/mock-ai.provider';

@Injectable()
export class RecommendationEngineService {
  private readonly logger = new Logger(RecommendationEngineService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly contextEngine: ContextEngineService,
    private readonly aiProvider: MockAIProvider, // Abstract in Prod
  ) {}

  /**
   * Evaluates context and generates an explainable recommendation.
   * AI recommends. Humans decide.
   */
  async generateRecommendation(
    companyId: string,
    domainEntity: string,
    entityId: string,
    promptGoal: string,
  ) {
    this.logger.log(
      `Generating Recommendation for ${domainEntity} [${entityId}]`,
    );

    // 1. Build immutable context
    const context = await this.contextEngine.buildAiContext(
      companyId,
      domainEntity,
      entityId,
    );

    // 2. Generate structured recommendation
    const schema = {
      properties: {
        recommendation: { type: 'string' },
        reasoning: { type: 'string' },
        confidence: { type: 'number' },
        evidence: { type: 'array', items: { type: 'string' } },
        alternatives: { type: 'array', items: { type: 'string' } },
      },
    };

    const output = await this.aiProvider.structuredGenerate<any>(
      promptGoal,
      context,
      schema,
    );

    // 3. Save to Governance layer for review
    const recommendation = await this.prisma.runAsTenant(
      companyId,
      async (tx) =>
        tx.aiRecommendation.create({
          data: {
            companyId,
            domainEntity,
            entityId,
            recommendation: output.recommendation,
            reasoning: output.reasoning,
            confidence: output.confidence,
            evidence: output.evidence,
            alternatives: output.alternatives,
            status: 'PENDING',
          },
        }),
    );

    // 4. Log Observability Metrics
    await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.aiMetricsLog.create({
        data: {
          companyId,
          interactionId: recommendation.id,
          modelProvider: 'MockAI',
          modelVersion: '1.0',
          latencyMs: 150,
          promptTokens: context.length / 4, // estimate
          completionTokens: 50,
        },
      }),
    );

    return recommendation;
  }
}
