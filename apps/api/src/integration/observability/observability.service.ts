import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class IntegrationObservabilityService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Generates observability metrics for the Integration Dashboard
   */
  async getMetrics(companyId: string) {
    const totalConnections = await this.prisma.runAsTenant(
      companyId,
      async (tx) =>
        tx.integrationConnection.count({
          where: { companyId },
        }),
    );

    const syncJobs = await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.syncJob.findMany({
        where: { companyId },
        orderBy: { createdAt: 'desc' },
        take: 1000, // Sample size
      }),
    );

    const successfulSyncs = syncJobs.filter(
      (s) => s.status === 'COMPLETED',
    ).length;
    const failedSyncs = syncJobs.filter((s) => s.status === 'FAILED').length;

    let avgDuration = 0;
    if (successfulSyncs > 0) {
      const totalDuration = syncJobs
        .filter((s) => s.status === 'COMPLETED' && s.completedAt && s.startedAt)
        .reduce(
          (sum, s) => sum + (s.completedAt!.getTime() - s.startedAt.getTime()),
          0,
        );
      avgDuration = totalDuration / successfulSyncs;
    }

    const webhookDeliveries = await this.prisma.runAsTenant(
      companyId,
      async (tx) =>
        tx.webhookDelivery.findMany({
          where: { companyId },
          orderBy: { createdAt: 'desc' },
          take: 1000,
        }),
    );

    const failedWebhooks = webhookDeliveries.filter(
      (w) => w.status === 'FAILED' || w.status === 'DEAD_LETTER',
    ).length;

    return {
      activeConnections: totalConnections,
      syncHealth: {
        successRate: syncJobs.length
          ? ((successfulSyncs / syncJobs.length) * 100).toFixed(2)
          : 0,
        failedJobs: failedSyncs,
        avgDurationMs: avgDuration,
      },
      webhookHealth: {
        failureRate: webhookDeliveries.length
          ? ((failedWebhooks / webhookDeliveries.length) * 100).toFixed(2)
          : 0,
        deadLetterCount: webhookDeliveries.filter(
          (w) => w.status === 'DEAD_LETTER',
        ).length,
      },
    };
  }
}
