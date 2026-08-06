import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export enum FeedbackAction {
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  MODIFIED = 'MODIFIED',
  IGNORED = 'IGNORED',
}

@Injectable()
export class FeedbackService {
  private readonly logger = new Logger(FeedbackService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Captures dispatcher feedback on an optimization recommendation.
   * This data forms the pipeline for future Machine Learning training.
   */
  async recordFeedback(
    companyId: string,
    recommendationId: string,
    userId: string,
    action: FeedbackAction,
    reason?: string,
  ) {
    this.logger.log(
      `Recording feedback ${action} for recommendation ${recommendationId} by user ${userId}`,
    );

    const feedback = await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.optimizationFeedback.create({
        data: {
          companyId,
          recommendationId,
          userId,
          action,
          reason,
        },
      }),
    );

    // Also update the recommendation status based on action if accepted or rejected
    if (
      action === FeedbackAction.ACCEPTED ||
      action === FeedbackAction.REJECTED
    ) {
      await this.prisma.runAsTenant(companyId, async (tx) =>
        tx.optimizationRecommendation.updateMany({
          where: { id: recommendationId, companyId },
          data: { reasonCodes: [action, ...(reason ? [reason] : [])] }, // Store status/reason loosely
        }),
      );
    }

    return feedback;
  }
}
