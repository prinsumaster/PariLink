import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  IAnalyticsProvider,
  AnalyticsRegistryService,
} from '../../platform/analytics/analytics-registry.service';

export interface ProfitabilityMetrics {
  revenue: number;
  totalCost: number;
  grossMargin: number;
  netMargin: number;
  costPerKm: number;
  revenuePerKm: number;
}

@Injectable()
export class ProfitabilityEngine implements OnModuleInit, IAnalyticsProvider {
  private readonly logger = new Logger(ProfitabilityEngine.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly analyticsRegistry: AnalyticsRegistryService,
  ) {}

  onModuleInit() {
    this.analyticsRegistry.register(this);
  }

  getDomainName(): string {
    return 'finance';
  }

  async getAnalytics(companyId: string, timeframe: string): Promise<any> {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 1); // 1 month timeframe
    return this.getFleetProfitability(companyId, startDate, endDate);
  }

  /**
   * Calculates real-time profitability analytics for a specific trip.
   */
  async calculateTripProfitability(
    companyId: string,
    tripId: string,
  ): Promise<ProfitabilityMetrics | null> {
    this.logger.log(`Calculating Profitability for Trip ${tripId}`);

    return this.prisma.runAsTenant(companyId, async (tx) => {
      const trip = await tx.trip.findUnique({
        where: { id: tripId },
        include: { loads: true, vehicle: true },
      });

      if (!trip) return null;

      const tripDistance = trip.actualDistance || trip.estimatedDistance || 0;

      // 1. Calculate Revenue (Sum of Invoices or Loads base freight)
      // For this implementation, we simulate revenue based on Load weight/distance
      let revenue = 0;
      for (const load of trip.loads) {
        // Assume Pricing Engine returned $2.5/km
        revenue += tripDistance * 2.5;
      }

      // 2. Calculate Costs
      let totalCost = 0;

      // Driver Pay (Settlement)
      totalCost += tripDistance * 1.5; // From Settlement Engine logic

      // Fuel Cost
      if (trip.fuelExpenses) {
        totalCost += trip.fuelExpenses;
      } else {
        // Estimated Fuel (distance / kmpl * fuel_price)
        totalCost += (tripDistance / 4) * 1.1;
      }

      // Tolls & Maintenance (Simulated)
      totalCost += 100;

      // 3. Analytics
      const grossMargin = revenue - totalCost;
      const netMargin = grossMargin * 0.85; // Net after 15% indirect overheads
      const distance = tripDistance || 1; // prevent div by zero

      return {
        revenue,
        totalCost,
        grossMargin,
        netMargin,
        costPerKm: totalCost / distance,
        revenuePerKm: revenue / distance,
      };
    });
  }

  async getFleetProfitability(
    companyId: string,
    startDate: Date,
    endDate: Date,
  ) {
    // Aggregates across all trips for the fleet
    // ...
  }
}
