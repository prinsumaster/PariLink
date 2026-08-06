import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AnalyticsCacheService } from './analytics-cache.service';

@Injectable()
export class MetricsEngineService {
  private readonly logger = new Logger(MetricsEngineService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly cache: AnalyticsCacheService,
  ) {}

  /**
   * Calculate Real-time KPI: Revenue
   */
  async getRevenueKPI(companyId: string, startDate: Date, endDate: Date) {
    const cacheKey = `kpi:revenue:${companyId}:${startDate.toISOString()}:${endDate.toISOString()}`;
    const cached = await this.cache.getCachedMetric(cacheKey);
    if (cached) return cached;

    const invoices = await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.invoice.findMany({
        where: {
          companyId,
          createdAt: { gte: startDate, lte: endDate },
          status: { in: ['PAID', 'ISSUED'] }, // Issued represents recognized revenue
        },
        select: { amount: true },
      }),
    );

    const totalRevenue = invoices.reduce(
      (acc, inv) => acc + (inv.amount || 0),
      0,
    );
    const result = { value: totalRevenue, currency: 'USD' };

    await this.cache.setCachedMetric(cacheKey, result, 300); // Cache for 5 mins
    return result;
  }

  /**
   * Calculate Real-time KPI: Fleet Utilization
   */
  async getFleetUtilization(companyId: string) {
    const cacheKey = `kpi:fleet_util:${companyId}`;
    const cached = await this.cache.getCachedMetric(cacheKey);
    if (cached) return cached;

    const totalVehicles = await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.vehicle.count({
        where: { companyId },
      }),
    );
    if (totalVehicles === 0) return { percentage: 0 };

    const activeVehicles = await this.prisma.runAsTenant(
      companyId,
      async (tx) =>
        tx.vehicle.count({
          where: { companyId, status: 'IN_TRANSIT' },
        }),
    );

    const util = (activeVehicles / totalVehicles) * 100;
    const result = {
      percentage: util,
      active: activeVehicles,
      total: totalVehicles,
    };

    await this.cache.setCachedMetric(cacheKey, result, 60); // Cache for 1 min
    return result;
  }

  /**
   * Get all core KPIs for the Command Center
   */
  async getCommandCenterMetrics(companyId: string) {
    const now = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(now.getDate() - 30);

    const [revenue, fleet, tripsCompleted, customers] = await Promise.all([
      this.getRevenueKPI(companyId, thirtyDaysAgo, now),
      this.getFleetUtilization(companyId),
      this.prisma.runAsTenant(companyId, async (tx) =>
        tx.trip.count({
          where: {
            companyId,
            status: 'COMPLETED',
            createdAt: { gte: thirtyDaysAgo },
          },
        }),
      ),
      this.prisma.runAsTenant(companyId, async (tx) =>
        tx.customer.count({ where: { companyId } }),
      ),
    ]);

    return {
      revenue,
      fleetUtilization: fleet,
      tripsCompleted30d: tripsCompleted,
      totalCustomers: customers,
    };
  }
}
