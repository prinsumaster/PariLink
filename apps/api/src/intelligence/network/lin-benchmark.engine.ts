import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class LinBenchmarkEngine {
  private readonly logger = new Logger(LinBenchmarkEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Periodically computes network-wide benchmarks from the anonymized event archive.
   * In a real system, this would be an offline batch job (e.g. Apache Spark) syncing
   * results back to the transactional database.
   */
  @Cron(CronExpression.EVERY_HOUR)
  async computeNetworkBenchmarks() {
    this.logger.log(`[LIN] Starting Network Benchmark computation...`);

    // 1. Compute AI Approval Rate Benchmark
    await this.computeAiApprovalRate();

    // 2. Compute Average Operational Health
    await this.computeAverageHealthScore();

    this.logger.log(`[LIN] Network Benchmark computation completed.`);
  }

  private async computeAiApprovalRate() {
    const events = await this.prisma.runAsSystem(async (tx) =>
      tx.linEventArchive.findMany({
        where: { eventType: 'anomaly.resolved' },
      }),
    );

    if (events.length === 0) return;

    const approvedCount = events.filter(
      (e: any) => e.anonymizedPayload.aiRecommendationUsed,
    ).length;
    const approvalRate = (approvedCount / events.length) * 100;

    await this.upsertBenchmark(
      'ai_approval_rate_avg',
      approvalRate,
      0.9,
      events.length,
    );
  }

  private async computeAverageHealthScore() {
    const events = await this.prisma.runAsSystem(async (tx) =>
      tx.linEventArchive.findMany({
        where: { eventType: 'business_health.updated' },
        orderBy: { timestamp: 'desc' },
        take: 1000, // Sample size of recent pulses across the network
      }),
    );

    if (events.length === 0) return;

    const sum = events.reduce(
      (acc, e: any) => acc + (e.anonymizedPayload.operationalScore || 0),
      0,
    );
    const avgScore = sum / events.length;

    await this.upsertBenchmark(
      'operational_health_avg',
      avgScore,
      0.85,
      events.length,
    );
  }

  private async upsertBenchmark(
    metricName: string,
    value: number,
    confidenceScore: number,
    sampleSize: number,
  ) {
    await this.prisma.runAsSystem(async (tx) =>
      tx.linBenchmark.upsert({
        where: { metricName },
        update: {
          value,
          confidenceScore,
          sampleSize,
        },
        create: {
          metricName,
          value,
          confidenceScore,
          sampleSize,
        },
      }),
    );
    this.logger.debug(
      `[LIN] Updated benchmark ${metricName} = ${value.toFixed(2)}`,
    );
  }
}
