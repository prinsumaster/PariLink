import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CacheManagerService } from '../../platform/performance/cache-manager.service';

@Injectable()
export class ControlTowerService {
  private readonly logger = new Logger(ControlTowerService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly cache: CacheManagerService,
  ) {}

  /**
   * Generates a real-time aggregate of fleet operations for the Control Tower Dashboard.
   * Target execution: < 150ms
   */
  async getLiveDashboard(companyId: string) {
    const cacheKey = `control_tower:${companyId}:live`;
    const cached = await this.cache.get(cacheKey);
    if (cached) return cached;

    // Use parallel aggregations to prevent long blocks
    const [activeTrips, delayedTrips, idleVehicles, todayRevenue, todayCost] =
      await Promise.all([
        this.prisma.runAsTenant(companyId, async (tx) =>
          tx.trip.count({
            where: { companyId, status: 'IN_PROGRESS' },
          }),
        ),
        this.prisma.runAsTenant(companyId, async (tx) =>
          tx.trip.count({
            where: {
              companyId,
              status: 'IN_PROGRESS',
              eta: { lt: new Date() },
            },
          }),
        ),
        this.prisma.runAsTenant(companyId, async (tx) =>
          tx.vehicle.count({
            where: { companyId, status: 'AVAILABLE' },
          }),
        ),
        this.calculateTodayRevenue(companyId),
        this.calculateTodayCost(companyId),
      ]);

    const result = {
      activeTrips,
      delayedTrips,
      offlineVehicles: 0, // Requires telemetry ping aggregation
      idleVehicles,
      todayRevenue,
      todayCost,
      fleetUtilization: await this.calculateUtilization(companyId),
      timestamp: new Date().toISOString(),
    };

    // Cache briefly for high-frequency dashboards (e.g. refreshed every 2-5 seconds by client)
    await this.cache.set(cacheKey, result, 5); // 5 seconds

    return result;
  }

  async getActiveTripsWithDeviations(companyId: string) {
    // 1 query to get all in-progress trips, their GPS locations, and current delays
    const trips = await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.trip.findMany({
        where: { companyId, status: 'IN_PROGRESS' },
        include: {
          driver: true,
          vehicle: true,
          loads: true,
        },
        orderBy: { startDate: 'desc' },
        take: 100, // Limit for real-time board
      }),
    );

    return trips.map((trip) => {
      const isDelayed = trip.eta && new Date() > trip.eta;
      return {
        id: trip.id,
        tripNumber: trip.tripNumber,
        driver: trip.driver
          ? `${trip.driver.firstName} ${trip.driver.lastName}`
          : 'Unassigned',
        vehicle: trip.vehicle?.licensePlate || 'Unassigned',
        origin: trip.loads[0]?.originCity || 'Unknown',
        destination: trip.loads[0]?.destinationCity || 'Unknown',
        eta: trip.eta,
        isDelayed,
        status: trip.status,
      };
    });
  }

  private async calculateTodayRevenue(companyId: string): Promise<number> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const invoices = await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.invoice.aggregate({
        _sum: { amount: true },
        where: {
          companyId,
          createdAt: { gte: today },
          status: { not: 'CANCELLED' },
        },
      }),
    );

    return invoices._sum.amount || 0;
  }

  private async calculateTodayCost(companyId: string): Promise<number> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const trips = await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.trip.aggregate({
        _sum: { fuelExpenses: true, otherExpenses: true },
        where: { companyId, startDate: { gte: today } },
      }),
    );

    return (trips._sum.fuelExpenses || 0) + (trips._sum.otherExpenses || 0);
  }

  private async calculateUtilization(companyId: string): Promise<number> {
    const [totalVehicles, activeTrips] = await Promise.all([
      this.prisma.runAsTenant(companyId, async (tx) =>
        tx.vehicle.count({ where: { companyId } }),
      ),
      this.prisma.runAsTenant(companyId, async (tx) =>
        tx.trip.count({
          where: { companyId, status: 'IN_PROGRESS' },
        }),
      ),
    ]);

    if (totalVehicles === 0) return 0;
    return Math.round((activeTrips / totalVehicles) * 100);
  }
}
