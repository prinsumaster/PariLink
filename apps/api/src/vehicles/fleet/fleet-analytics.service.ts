import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  IAnalyticsProvider,
  AnalyticsRegistryService,
} from '../../platform/analytics/analytics-registry.service';

export interface FleetAnalyticsResult {
  fleetUtilizationPercentage: number;
  downtimeHours: number;
  maintenanceCost: number;
  fuelEfficiencyKmpl: number;
  costPerKm: number;
  breakdownFrequency: number;
  vehicleAvailabilityPercentage: number;
}

@Injectable()
export class FleetAnalyticsService implements OnModuleInit, IAnalyticsProvider {
  private readonly logger = new Logger(FleetAnalyticsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly analyticsRegistry: AnalyticsRegistryService,
  ) {}

  onModuleInit() {
    this.analyticsRegistry.register(this);
  }

  getDomainName(): string {
    return 'fleet';
  }

  async getAnalytics(companyId: string, timeframe: string): Promise<any> {
    return this.getVehicleAnalytics(companyId, timeframe, 1);
  }

  /**
   * Generates comprehensive asset ROI and performance analytics.
   */
  async getVehicleAnalytics(
    companyId: string,
    vehicleId: string,
    periodDays = 30,
  ): Promise<FleetAnalyticsResult | null> {
    this.logger.log(
      `Calculating Fleet Analytics for Vehicle ${vehicleId} over ${periodDays} days`,
    );

    return this.prisma.runAsTenant(companyId, async (tx) => {
      // Mock metrics generation. In a real system, these would aggregate `EventStore` streams
      // or `Trip` / `Expense` / `Maintenance` records over the requested period.

      const vehicle = await tx.vehicle.findUnique({ where: { id: vehicleId } });
      if (!vehicle) return null;

      // Mock aggregation logic to satisfy the Enterprise requirements
      const totalPossibleHours = periodDays * 24;

      // Assume 2 breakdowns per month on average
      const breakdowns = 2;
      const downtimeHours = breakdowns * 48; // 48 hrs per breakdown

      // Maintenance & Fuel Costs
      const maintenanceCost = 1500; // Mock $1500
      const totalFuelVolume = 500; // Liters/Gallons
      const totalDistance = 2500; // KM/Miles
      const fuelCost = totalFuelVolume * 1.1;
      const driverCost = totalDistance * 1.5;

      const totalCost = maintenanceCost + fuelCost + driverCost;

      // Derived Metrics
      const fuelEfficiencyKmpl = totalDistance / (totalFuelVolume || 1);
      const costPerKm = totalCost / (totalDistance || 1);
      const availabilityPercentage =
        ((totalPossibleHours - downtimeHours) / totalPossibleHours) * 100;

      // Simulated Utilization (hours driven / available hours)
      const drivingHours = totalDistance / 50; // assuming avg 50 km/h
      const fleetUtilizationPercentage =
        (drivingHours / (totalPossibleHours - downtimeHours)) * 100;

      return {
        fleetUtilizationPercentage: parseFloat(
          fleetUtilizationPercentage.toFixed(2),
        ),
        downtimeHours,
        maintenanceCost,
        fuelEfficiencyKmpl: parseFloat(fuelEfficiencyKmpl.toFixed(2)),
        costPerKm: parseFloat(costPerKm.toFixed(2)),
        breakdownFrequency: breakdowns,
        vehicleAvailabilityPercentage: parseFloat(
          availabilityPercentage.toFixed(2),
        ),
      };
    });
  }
}
