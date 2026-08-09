import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CacheManagerService,
  CacheTTL,
} from '../platform/performance/cache-manager.service';

@Injectable()
export class ReportsService {
  constructor(
    private prisma: PrismaService,
    private cache: CacheManagerService,
  ) {}

  async getDashboardMetrics(companyId: string) {
    const cacheKey = `reports:dashboard:${companyId}`;
    const cached = await this.cache.get(cacheKey);
    if (cached) return cached;

    return this.prisma.runAsTenant(companyId, async (tx) => {
      const [
        paidInvoicesResult,
        unpaidInvoicesResult,
        deliveredLoadsCount,
        activeTripsCount,
      ] = await Promise.all([
        tx.invoice.aggregate({
          where: { status: 'PAID' },
          _sum: { amount: true },
        }),
        tx.invoice.aggregate({
          where: {
            status: { in: ['DRAFT', 'SENT', 'OVERDUE'] },
          },
          _sum: { amount: true },
        }),
        tx.load.count({
          where: { status: 'DELIVERED' },
        }),
        tx.trip.count({
          where: { status: { in: ['IN_PROGRESS', 'DISPATCHED'] } },
        }),
      ]);

      const partialPaymentsResult = await tx.payment.aggregate({
        where: {
          invoice: {
            status: { in: ['DRAFT', 'SENT', 'OVERDUE'] },
          },
        },
        _sum: { amount: true },
      });

      const totalRevenue = paidInvoicesResult._sum.amount || 0;
      const grossUnpaid = unpaidInvoicesResult._sum.amount || 0;
      const partialPayments = partialPaymentsResult._sum.amount || 0;
      const outstandingReceivables = Math.max(0, grossUnpaid - partialPayments);

      const result = {
        totalRevenue,
        outstandingReceivables,
        deliveredLoadsCount,
        activeTripsCount,
      };

      await this.cache.set(cacheKey, result, CacheTTL.WARM, ['reports']);
      return result;
    });
  }

  async getCustomerReport(companyId: string) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      const customers = await tx.customer.findMany({
        take: 1000,
        select: {
          id: true,
          name: true,
          _count: {
            select: { loads: {} },
          },
        },
      });

      const invoiceAgg = await tx.invoice.groupBy({
        by: ['customerId'],
        _sum: { amount: true },
      });

      const revenueMap = new Map(
        invoiceAgg.map((agg) => [agg.customerId, agg._sum.amount || 0]),
      );

      return customers.map((c) => ({
        customerId: c.id,
        name: c.name,
        totalRevenue: revenueMap.get(c.id) || 0,
        totalLoads: c._count.loads,
      }));
    });
  }

  async getDriverReport(companyId: string) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      const drivers = await tx.driver.findMany({
        take: 1000,
        select: {
          id: true,
          firstName: true,
          lastName: true,
          _count: { select: { trips: true } },
        },
      });

      const expenseAgg = await tx.expense.groupBy({
        by: ['driverId'],
        _sum: { amount: true },
        where: { driverId: { not: null } },
      });
      const expenseMap = new Map(
        expenseAgg.map((agg) => [agg.driverId, agg._sum.amount || 0]),
      );

      const settlementAgg = await tx.settlement.groupBy({
        by: ['driverId'],
        _sum: { amount: true },
      });
      const settlementMap = new Map(
        settlementAgg.map((agg) => [agg.driverId, agg._sum.amount || 0]),
      );

      return drivers.map((d) => ({
        driverId: d.id,
        name: `${d.firstName} ${d.lastName}`,
        totalTrips: d._count.trips,
        totalExpenses: expenseMap.get(d.id) || 0,
        totalSettlements: settlementMap.get(d.id) || 0,
      }));
    });
  }

  async getVehicleReport(companyId: string) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      const vehicles = await tx.vehicle.findMany({
        take: 1000,
        select: {
          id: true,
          licensePlate: true,
          _count: { select: { tripsVehicle: true, tripsTrailer: true } },
        },
      });
      return vehicles.map((v) => ({
        vehicleId: v.id,
        licensePlate: v.licensePlate,
        totalTrips: v._count.tripsVehicle + v._count.tripsTrailer,
      }));
    });
  }
}
