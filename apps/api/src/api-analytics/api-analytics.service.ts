import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ApiAnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  async getMetrics(companyId: string, startDate: Date, endDate: Date) {
    const logs = await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.apiAnalyticsLog.findMany({
        where: {
          companyId,
          timestamp: {
            gte: startDate,
            lte: endDate,
          },
        },
        select: {
          endpoint: true,
          method: true,
          statusCode: true,
          latencyMs: true,
        },
      }),
    );

    const totalRequests = logs.length;
    const errors = logs.filter((log) => log.statusCode >= 400).length;
    const averageLatency =
      totalRequests > 0
        ? logs.reduce((acc, log) => acc + log.latencyMs, 0) / totalRequests
        : 0;

    return {
      totalRequests,
      errorRate: totalRequests > 0 ? (errors / totalRequests) * 100 : 0,
      averageLatency,
      period: { startDate, endDate },
    };
  }
}
