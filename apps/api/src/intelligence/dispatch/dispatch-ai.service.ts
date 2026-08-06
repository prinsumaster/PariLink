import { Injectable, Logger, Inject } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';

@Injectable()
export class DispatchAiService {
  private readonly logger = new Logger(DispatchAiService.name);

  constructor(
    private readonly prisma: PrismaService,
    @InjectQueue('ai-inference') private readonly aiQueue: Queue,
  ) {}

  async requestRecommendation(
    companyId: string,
    loadId: string,
    userId: string,
  ) {
    this.logger.log(
      `Requesting AI dispatch recommendation for load: ${loadId}`,
    );

    const load = await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.load.findUnique({
        where: { id: loadId, companyId },
        include: { customer: true },
      }),
    );
    if (!load) throw new Error('Load not found');

    // Generate a pending recommendation record
    const recommendation = await this.prisma.runAsTenant(
      companyId,
      async (tx) =>
        tx.aiRecommendation.create({
          data: {
            companyId,
            domainEntity: 'Dispatch',
            entityId: loadId,
            recommendation: 'Processing...',
            reasoning: 'Processing...',
            confidence: 0,
            status: 'PENDING',
          },
        }),
    );

    // Enqueue the heavy AI processing job
    await this.aiQueue.add('dispatch-match', {
      companyId,
      loadId,
      recommendationId: recommendation.id,
      userId,
    });

    return recommendation;
  }
}
