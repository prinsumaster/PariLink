import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ForecastEngineService {
  private readonly logger = new Logger(ForecastEngineService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Basic linear regression implementation for forecasting
   * y = mx + b
   */
  private linearRegression(data: number[]) {
    const n = data.length;
    if (n === 0) return { m: 0, b: 0 };
    if (n === 1) return { m: 0, b: data[0] };

    let sumX = 0,
      sumY = 0,
      sumXY = 0,
      sumXX = 0;
    for (let i = 0; i < n; i++) {
      sumX += i;
      sumY += data[i];
      sumXY += i * data[i];
      sumXX += i * i;
    }

    const m = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const b = (sumY - m * sumX) / n;

    return { m, b };
  }

  /**
   * Forecasts revenue for the next N days based on historical invoice data
   */
  async forecastRevenue(companyId: string, daysAhead: number = 30) {
    // 1. Get daily revenue for the last 90 days
    const now = new Date();
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(now.getDate() - 90);

    const invoices = await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.invoice.findMany({
        where: {
          companyId,
          createdAt: { gte: ninetyDaysAgo },
          status: { in: ['PAID', 'ISSUED'] },
        },
        select: { amount: true, createdAt: true },
        orderBy: { createdAt: 'asc' },
      }),
    );

    // Group by day index (0 to 89)
    const dailyData = new Array(90).fill(0);
    invoices.forEach((inv) => {
      const dayDiff = Math.floor(
        (inv.createdAt.getTime() - ninetyDaysAgo.getTime()) /
          (1000 * 60 * 60 * 24),
      );
      if (dayDiff >= 0 && dayDiff < 90) {
        dailyData[dayDiff] += inv.amount || 0;
      }
    });

    // 2. Perform regression
    const { m, b } = this.linearRegression(dailyData);

    // 3. Forecast future points
    const forecast = [];
    for (let i = 1; i <= daysAhead; i++) {
      const futureX = 89 + i; // Start right after the historical 90 days
      const predictedY = m * futureX + b;

      const futureDate = new Date(now);
      futureDate.setDate(now.getDate() + i);

      forecast.push({
        date: futureDate.toISOString().split('T')[0],
        projectedRevenue: Math.max(0, Math.round(predictedY * 100) / 100), // Ensure no negative revenue
      });
    }

    return {
      historicalTrend: m > 0 ? 'UP' : m < 0 ? 'DOWN' : 'FLAT',
      confidence: m !== 0 ? 0.75 : 0.5, // Naive confidence
      forecast,
    };
  }
}
