import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { createPaginationResponse } from '../platform/api/utils/pagination.util';

@Injectable()
export class ProfitabilityService {
  constructor(private prisma: PrismaService) {}

  async tripPnl(companyId: string, tripId: string) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      const trip = await tx.trip.findUnique({
        where: { id: tripId, companyId },
        select: {
          id: true,
          tripNumber: true,
          status: true,
          startDate: true,
          endDate: true,
          vehicleId: true,
          fuelExpenses: true,
          otherExpenses: true,
        },
      });

      if (!trip) {
        throw new NotFoundException(`Trip with ID ${tripId} not found`);
      }

      const firstLoad = await tx.load.findFirst({
        where: { tripId: trip.id, deletedAt: null },
        select: { originCity: true, destinationCity: true },
        orderBy: { createdAt: 'asc' },
      });

      const loadsAggr = await tx.load.aggregate({
        _sum: { rate: true },
        where: { tripId: trip.id, deletedAt: null },
      });
      const revenue = loadsAggr._sum.rate ?? 0;

      let fuel = 0;
      if (trip.vehicleId && trip.startDate) {
        const fuelAggr = await tx.fuelTransaction.aggregate({
          _sum: { totalCost: true },
          where: {
            vehicleId: trip.vehicleId,
            transactionTime: {
              gte: trip.startDate,
              ...(trip.endDate ? { lte: trip.endDate } : {}),
            },
          },
        });
        fuel = fuelAggr._sum.totalCost ?? (trip.fuelExpenses ?? 0);
      } else {
        fuel = trip.fuelExpenses ?? 0;
      }

      const tollAggr = await tx.tollTransaction.aggregate({
        _sum: { amount: true },
        where: { tripId: trip.id },
      });
      const toll = tollAggr._sum.amount ?? 0;

      const expensesAggr = await tx.expense.aggregate({
        _sum: { amount: true },
        where: {
          tripId: trip.id,
          type: { notIn: ['FUEL', 'TOLL', 'DIESEL', 'fuel', 'toll', 'diesel', 'Fuel', 'Toll', 'Diesel'] },
        },
      });
      const bhattaOther = (expensesAggr._sum.amount ?? 0) + (trip.otherExpenses ?? 0);

      const totalCost = fuel + toll + bhattaOther;
      const profit = revenue - totalCost;
      const marginPct = revenue > 0 ? Math.round((profit / revenue) * 1000) / 10 : 0;

      return {
        trip: {
          id: trip.id,
          number: trip.tripNumber,
          status: trip.status,
        },
        from: firstLoad?.originCity ?? null,
        to: firstLoad?.destinationCity ?? null,
        revenue,
        fuel,
        toll,
        bhattaOther,
        totalCost,
        profit,
        marginPct,
        profitable: profit >= 0,
      };
    });
  }

  async listTripPnl(companyId: string, page = 1, limit = 20) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      const skip = (page - 1) * limit;

      const [trips, total] = await Promise.all([
        tx.trip.findMany({
          where: { companyId },
          skip,
          take: limit,
          select: {
            id: true,
            tripNumber: true,
            status: true,
            startDate: true,
            endDate: true,
            vehicleId: true,
            fuelExpenses: true,
            otherExpenses: true,
          }
        }),
        tx.trip.count({ where: { companyId } }),
      ]);

      const data = await Promise.all(
        trips.map(async (trip) => {
          const firstLoad = await tx.load.findFirst({
            where: { tripId: trip.id, deletedAt: null },
            select: { originCity: true, destinationCity: true },
            orderBy: { createdAt: 'asc' },
          });

          const loadsAggr = await tx.load.aggregate({
            _sum: { rate: true },
            where: { tripId: trip.id, deletedAt: null },
          });
          const revenue = loadsAggr._sum.rate ?? 0;

          let fuel = 0;
          if (trip.vehicleId && trip.startDate) {
            const fuelAggr = await tx.fuelTransaction.aggregate({
              _sum: { totalCost: true },
              where: {
                vehicleId: trip.vehicleId,
                transactionTime: {
                  gte: trip.startDate,
                  ...(trip.endDate ? { lte: trip.endDate } : {}),
                },
              },
            });
            fuel = fuelAggr._sum.totalCost ?? (trip.fuelExpenses ?? 0);
          } else {
            fuel = trip.fuelExpenses ?? 0;
          }

          const tollAggr = await tx.tollTransaction.aggregate({
            _sum: { amount: true },
            where: { tripId: trip.id },
          });
          const toll = tollAggr._sum.amount ?? 0;

          const expensesAggr = await tx.expense.aggregate({
            _sum: { amount: true },
            where: {
              tripId: trip.id,
              type: { notIn: ['FUEL', 'TOLL', 'DIESEL', 'fuel', 'toll', 'diesel', 'Fuel', 'Toll', 'Diesel'] },
            },
          });
          const bhattaOther = (expensesAggr._sum.amount ?? 0) + (trip.otherExpenses ?? 0);

          const totalCost = fuel + toll + bhattaOther;
          const profit = revenue - totalCost;
          const marginPct = revenue > 0 ? Math.round((profit / revenue) * 1000) / 10 : 0;

          return {
            trip: {
              id: trip.id,
              number: trip.tripNumber,
              status: trip.status,
            },
            from: firstLoad?.originCity ?? null,
            to: firstLoad?.destinationCity ?? null,
            revenue,
            fuel,
            toll,
            bhattaOther,
            totalCost,
            profit,
            marginPct,
            profitable: profit >= 0,
          };
        }),
      );

      data.sort((a, b) => a.profit - b.profit);

      return createPaginationResponse(data, total, page, limit);
    });
  }

  async vehiclePnl(companyId: string, vehicleId: string) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      const trips = await tx.trip.findMany({
        where: { companyId, vehicleId },
        select: {
          id: true,
          startDate: true,
          endDate: true,
          fuelExpenses: true,
          otherExpenses: true,
        },
      });

      let totalRevenue = 0;
      let totalCost = 0;

      for (const trip of trips) {
        const loadsAggr = await tx.load.aggregate({
          _sum: { rate: true },
          where: { tripId: trip.id, deletedAt: null },
        });
        const revenue = loadsAggr._sum.rate ?? 0;
        totalRevenue += revenue;

        let fuel = 0;
        if (trip.startDate) {
          const fuelAggr = await tx.fuelTransaction.aggregate({
            _sum: { totalCost: true },
            where: {
              vehicleId,
              transactionTime: {
                gte: trip.startDate,
                ...(trip.endDate ? { lte: trip.endDate } : {}),
              },
            },
          });
          fuel = fuelAggr._sum.totalCost ?? (trip.fuelExpenses ?? 0);
        } else {
          fuel = trip.fuelExpenses ?? 0;
        }

        const tollAggr = await tx.tollTransaction.aggregate({
          _sum: { amount: true },
          where: { tripId: trip.id },
        });
        const toll = tollAggr._sum.amount ?? 0;

        const expensesAggr = await tx.expense.aggregate({
          _sum: { amount: true },
          where: {
            tripId: trip.id,
            type: { notIn: ['FUEL', 'TOLL', 'DIESEL', 'fuel', 'toll', 'diesel', 'Fuel', 'Toll', 'Diesel'] },
          },
        });
        const bhattaOther = (expensesAggr._sum.amount ?? 0) + (trip.otherExpenses ?? 0);

        totalCost += fuel + toll + bhattaOther;
      }

      const totalProfit = totalRevenue - totalCost;
      const avgMarginPct = totalRevenue > 0 ? Math.round((totalProfit / totalRevenue) * 1000) / 10 : 0;

      return {
        vehicleId,
        totalRevenue,
        totalCost,
        totalProfit,
        tripCount: trips.length,
        avgMarginPct,
      };
    });
  }

  async companySummary(companyId: string, from?: string, to?: string) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      // Set bounds if none provided (e.g. 90 days default)
      let startDateBound = from ? new Date(from) : null;
      if (!startDateBound) {
        startDateBound = new Date();
        startDateBound.setDate(startDateBound.getDate() - 90);
      }
      const endDateBound = to ? new Date(to) : null;

      const whereClause: any = { companyId, startDate: { gte: startDateBound } };
      if (endDateBound) {
        whereClause.startDate.lte = endDateBound;
      }

      const trips = await tx.trip.findMany({
        where: whereClause,
        select: {
          id: true,
          tripNumber: true,
          startDate: true,
          endDate: true,
          vehicleId: true,
          fuelExpenses: true,
          otherExpenses: true,
        },
      });

      const tripIds = trips.map(t => t.id);
      
      const [loadsRev, tollGroup, expGroup, firstLoads, fuelTxns] = await Promise.all([
        tx.load.groupBy({ by: ['tripId'], _sum: { rate: true }, where: { companyId, deletedAt: null, tripId: { in: tripIds } } }),
        tx.tollTransaction.groupBy({ by: ['tripId'], _sum: { amount: true }, where: { companyId, tripId: { in: tripIds } } }),
        tx.expense.groupBy({ by: ['tripId'], _sum: { amount: true }, where: { companyId, tripId: { in: tripIds }, type: { notIn: ['FUEL', 'TOLL', 'DIESEL', 'fuel', 'toll', 'diesel', 'Fuel', 'Toll', 'Diesel'] } } }),
        tx.load.findMany({ where: { companyId, deletedAt: null, tripId: { in: tripIds } }, select: { tripId: true, originCity: true, destinationCity: true }, orderBy: { createdAt: 'asc' } }),
        tx.fuelTransaction.findMany({ where: { companyId, transactionTime: { gte: startDateBound } } })
      ]);

      const revenueMap = new Map(loadsRev.map((l: any) => [l.tripId, l._sum.rate ? Number(l._sum.rate) : 0]));
      const tollMap = new Map(tollGroup.map((t: any) => [t.tripId, t._sum.amount ? Number(t._sum.amount) : 0]));
      const expMap = new Map(expGroup.map((e: any) => [e.tripId, e._sum.amount ? Number(e._sum.amount) : 0]));
      
      const routeMap = new Map();
      for (const l of firstLoads) {
        if (!routeMap.has(l.tripId)) {
          routeMap.set(l.tripId, `${l.originCity}→${l.destinationCity}`);
        }
      }

      let totalRevenue = 0;
      let totalCost = 0;
      
      const vehicleStats: Record<string, { revenue: number, cost: number, profit: number }> = {};
      const laneStats: Record<string, { revenue: number, cost: number, profit: number }> = {};

      for (const trip of trips) {
        const revenue = revenueMap.get(trip.id) ?? 0;
        totalRevenue += revenue;

        let fuel = 0;
         if (trip.vehicleId && trip.startDate) {
           fuel = fuelTxns
             .filter((f: any) => f.vehicleId === trip.vehicleId && f.transactionTime && trip.startDate && f.transactionTime >= trip.startDate && (!trip.endDate || f.transactionTime <= trip.endDate))
             .reduce((sum: number, f: any) => sum + Number(f.totalCost), 0);
        }
        if (fuel === 0 && trip.fuelExpenses) fuel = trip.fuelExpenses;

        const toll = tollMap.get(trip.id) ?? 0;
        const bhattaOther = (expMap.get(trip.id) ?? 0) + (trip.otherExpenses ?? 0);

        const tripCost = fuel + toll + bhattaOther;
        totalCost += tripCost;
        const tripProfit = revenue - tripCost;

        if (trip.vehicleId) {
          if (!vehicleStats[trip.vehicleId]) {
            vehicleStats[trip.vehicleId] = { revenue: 0, cost: 0, profit: 0 };
          }
          vehicleStats[trip.vehicleId].revenue += revenue;
          vehicleStats[trip.vehicleId].cost += tripCost;
          vehicleStats[trip.vehicleId].profit += tripProfit;
        }

        const lane = routeMap.get(trip.id);
        if (lane) {
          if (!laneStats[lane]) {
            laneStats[lane] = { revenue: 0, cost: 0, profit: 0 };
          }
          laneStats[lane].revenue += revenue;
          laneStats[lane].cost += tripCost;
          laneStats[lane].profit += tripProfit;
        }
      }

      const totalProfit = totalRevenue - totalCost;

      let bestTruck = null;
      let worstTruck = null;
      const vehicleEntries = Object.entries(vehicleStats).sort((a, b) => b[1].profit - a[1].profit);
      if (vehicleEntries.length > 0) {
        bestTruck = { vehicleId: vehicleEntries[0][0], profit: vehicleEntries[0][1].profit };
        worstTruck = { vehicleId: vehicleEntries[vehicleEntries.length - 1][0], profit: vehicleEntries[vehicleEntries.length - 1][1].profit };
      }

      let bestLane = null;
      let worstLane = null;
      const laneEntries = Object.entries(laneStats).sort((a, b) => b[1].profit - a[1].profit);
      if (laneEntries.length > 0) {
        bestLane = { lane: laneEntries[0][0], profit: laneEntries[0][1].profit };
        worstLane = { lane: laneEntries[laneEntries.length - 1][0], profit: laneEntries[laneEntries.length - 1][1].profit };
      }

      return {
        totalRevenue,
        totalCost,
        totalProfit,
        tripCount: trips.length,
        avgMarginPct: totalRevenue > 0 ? Math.round((totalProfit / totalRevenue) * 1000) / 10 : 0,
        bestTruck,
        worstTruck,
        bestLane,
        worstLane,
      };
    });
  }
}
