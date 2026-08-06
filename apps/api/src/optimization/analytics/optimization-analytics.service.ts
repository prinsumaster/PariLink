import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class OptimizationAnalyticsService {
  private readonly logger = new Logger(OptimizationAnalyticsService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Generates aggregated metrics for Executive Analytics dashboards.
   */
  async getExecutiveDashboardMetrics(companyId: string) {
    this.logger.log(
      `Generating ITOE Executive Analytics for company ${companyId}`,
    );

    // Aggregate savings and carbon reductions from generated recommendations
    const recommendationsAgg = await this.prisma.runAsTenant(
      companyId,
      async (tx) =>
        tx.optimizationRecommendation.aggregate({
          where: { companyId },
          _sum: {
            estimatedSavings: true,
            estimatedFuelSaved: true,
            estimatedTimeSaved: true,
            carbonReductionEstimate: true,
          },
          _avg: {
            confidenceScore: true,
          },
        }),
    );

    // Aggregate feedback actions to determine manual override / acceptance rates
    const feedbackCounts = await this.prisma.runAsTenant(
      companyId,
      async (tx) =>
        tx.optimizationFeedback.groupBy({
          by: ['action'],
          where: { companyId },
          _count: {
            _all: true,
          },
        }),
    );

    let accepted = 0;
    let modified = 0;
    let rejected = 0;
    let ignored = 0;

    for (const fb of feedbackCounts) {
      if (fb.action === 'ACCEPTED') accepted = fb._count._all;
      else if (fb.action === 'MODIFIED') modified = fb._count._all;
      else if (fb.action === 'REJECTED') rejected = fb._count._all;
      else if (fb.action === 'IGNORED') ignored = fb._count._all;
    }

    const totalFeedback = accepted + modified + rejected + ignored;
    const optimizationAcceptanceRate =
      totalFeedback > 0 ? (accepted / totalFeedback) * 100 : 0;
    const manualOverrideRate =
      totalFeedback > 0 ? (modified / totalFeedback) * 100 : 0;

    return {
      savingsGenerated: recommendationsAgg._sum.estimatedSavings || 0,
      fuelReductionLiters: recommendationsAgg._sum.estimatedFuelSaved || 0,
      timeSavedHours: recommendationsAgg._sum.estimatedTimeSaved || 0,
      carbonReductionKg: recommendationsAgg._sum.carbonReductionEstimate || 0,
      averageConfidenceScore: recommendationsAgg._avg.confidenceScore || 0,
      optimizationAcceptanceRate,
      manualOverrideRate,
      totalRecommendations: totalFeedback,
    };
  }
}
