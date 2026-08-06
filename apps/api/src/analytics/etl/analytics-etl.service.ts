import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AnalyticsETLService {
  private readonly logger = new Logger(AnalyticsETLService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Aggregates daily metrics and stores them in AnalyticsSnapshot
   */
  async runDailyAggregation(companyId: string) {
    this.logger.log(`Running ETL Aggregation for Company ${companyId}`);

    const now = new Date();
    const startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );
    const startOfYesterday = new Date(
      startOfToday.getTime() - 24 * 60 * 60 * 1000,
    );

    // 1. Aggregate Revenue
    const invoices = await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.invoice.aggregate({
        where: {
          companyId,
          createdAt: { gte: startOfYesterday, lt: startOfToday },
          status: { in: ['PAID', 'ISSUED'] },
        },
        _sum: { amount: true },
      }),
    );

    await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.analyticsSnapshot.create({
        data: {
          companyId,
          metricKey: 'DAILY_REVENUE',
          metricValue: invoices._sum.amount || 0,
          periodStart: startOfYesterday,
          periodEnd: startOfToday,
          resolution: 'DAILY',
        },
      }),
    );

    // 2. Aggregate Trip Count
    const completedTrips = await this.prisma.runAsTenant(
      companyId,
      async (tx) =>
        tx.trip.count({
          where: {
            companyId,
            updatedAt: { gte: startOfYesterday, lt: startOfToday },
            status: 'COMPLETED',
          },
        }),
    );

    await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.analyticsSnapshot.create({
        data: {
          companyId,
          metricKey: 'DAILY_TRIPS_COMPLETED',
          metricValue: completedTrips,
          periodStart: startOfYesterday,
          periodEnd: startOfToday,
          resolution: 'DAILY',
        },
      }),
    );

    this.logger.log(`ETL Aggregation completed for Company ${companyId}`);
  }
}
