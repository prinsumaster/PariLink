import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export interface ProfitabilityMetrics {
  revenue: number;
  directCost: number;
  grossProfit: number;
  marginPercentage: number;
}

@Injectable()
export class ProfitabilityService {
  private readonly logger = new Logger(ProfitabilityService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Calculates actual profitability for a completed Trip.
   * Pulls Invoices for Revenue, and Expenses + Settlements for Cost.
   */
  async calculateTripProfitability(
    companyId: string,
    tripId: string,
  ): Promise<ProfitabilityMetrics> {
    const trip = await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.trip.findUnique({
        where: { id: tripId, companyId },
        include: {
          loads: {
            include: {
              invoices: true, // We assume Load has invoices generated
            },
          },
          expenses: true,
        },
      }),
    );

    if (!trip) throw new NotFoundException('Trip not found');

    // 1. Calculate Revenue (Sum of Invoices for all loads in the trip)
    let totalRevenue = 0;
    if (trip.loads && trip.loads.length > 0) {
      for (const load of trip.loads) {
        const invoices = load.invoices || [];
        const loadRevenue = invoices.reduce(
          (sum, inv: any) => sum + inv.amount,
          0,
        );

        if (loadRevenue > 0) {
          totalRevenue += loadRevenue;
        } else if (load.rate) {
          totalRevenue += load.rate;
        }
      }
    }

    // 2. Calculate Costs
    let totalCost = 0;

    // 2a. Trip Expenses (Fuel, Tolls, Maintenance during trip)
    const expenses = await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.expense.findMany({
        where: { companyId, tripId },
      }),
    );
    totalCost += expenses.reduce((sum, exp) => sum + exp.amount, 0);

    // 2b. Driver Settlement for this trip (simplified: assuming we can extract trip-specific pay,
    // or we estimate driver cost based on duration). For V1 we just query expenses.
    // In a full ERP, Settlements have SettlementLines linked to Trips.

    const grossProfit = totalRevenue - totalCost;
    const marginPercentage =
      totalRevenue > 0 ? (grossProfit / totalRevenue) * 100 : 0;

    return {
      revenue: parseFloat(totalRevenue.toFixed(2)),
      directCost: parseFloat(totalCost.toFixed(2)),
      grossProfit: parseFloat(grossProfit.toFixed(2)),
      marginPercentage: parseFloat(marginPercentage.toFixed(2)),
    };
  }

  /**
   * Calculates aggregate profitability for a Customer across a time range.
   */
  async calculateCustomerProfitability(
    companyId: string,
    customerId: string,
    fromDate: Date,
    toDate: Date,
  ): Promise<ProfitabilityMetrics> {
    // 1. Get Invoices for Revenue
    const invoices = await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.invoice.findMany({
        where: {
          companyId,
          customerId,
          status: { notIn: ['DRAFT', 'CANCELLED'] },
          createdAt: { gte: fromDate, lte: toDate },
        },
        include: {
          load: true,
        },
      }),
    );

    let totalRevenue = 0;
    let totalCost = 0;
    const tripIds = new Set<string>();

    for (const inv of invoices) {
      totalRevenue += inv.amount;
      if (inv.load?.tripId) {
        tripIds.add(inv.load.tripId);
      }
    }

    if (tripIds.size > 0) {
      const expenses = await this.prisma.runAsTenant(companyId, async (tx) =>
        tx.expense.findMany({
          where: { companyId, tripId: { in: Array.from(tripIds) } },
        }),
      );
      totalCost += expenses.reduce((sum, exp) => sum + exp.amount, 0);
    }

    const grossProfit = totalRevenue - totalCost;
    const marginPercentage =
      totalRevenue > 0 ? (grossProfit / totalRevenue) * 100 : 0;

    return {
      revenue: parseFloat(totalRevenue.toFixed(2)),
      directCost: parseFloat(totalCost.toFixed(2)),
      grossProfit: parseFloat(grossProfit.toFixed(2)),
      marginPercentage: parseFloat(marginPercentage.toFixed(2)),
    };
  }
}
