import { Injectable, Logger } from '@nestjs/common';
import type { Load, Vehicle, Driver } from '@prisma/client';

export interface CostEstimationResult {
  estimatedCost: number;
  estimatedRevenue: number;
  expectedMargin: number;
  confidenceScore: number;
  distanceKm: number;
  durationHours: number;
}

@Injectable()
export class CostEstimatorService {
  private readonly logger = new Logger(CostEstimatorService.name);

  // Default metric constants (in production, read from RateCard or TenantConfiguration)
  private readonly DEFAULT_FUEL_COST_PER_KM = 0.45;
  private readonly DEFAULT_DRIVER_COST_PER_HOUR = 25.0;
  private readonly DEFAULT_MAINTENANCE_COST_PER_KM = 0.15;
  private readonly DEFAULT_SPEED_KMH = 65.0; // average speed

  /**
   * Estimates cost and revenue for a specific assignment (Vehicle + Load).
   */
  estimate(
    load: Load,
    vehicle: Vehicle,
    driver?: Driver,
    vehicleState?: any,
  ): CostEstimationResult {
    // 1. Calculate rough distance (Heuristic: in reality use Google Maps/Mapbox API)
    // We mock distance using a stable hash based on origin and destination strings to be deterministic.
    const distanceKm = this.mockDeterministicDistance(
      load.originCity,
      load.destinationCity,
    );

    // Add deadhead distance if vehicle GPS is known from state
    let deadheadDistance = 0;
    if (vehicleState?.location?.latitude && vehicleState?.location?.longitude) {
      // Mocked deadhead distance
      deadheadDistance = 50;
    }
    const totalDistance = distanceKm + deadheadDistance;

    // 2. Estimate duration
    const durationHours = totalDistance / this.DEFAULT_SPEED_KMH;

    // 3. Estimate Costs
    const fuelCost = totalDistance * this.DEFAULT_FUEL_COST_PER_KM;
    const maintenanceCost =
      totalDistance * this.DEFAULT_MAINTENANCE_COST_PER_KM;
    const driverCost = durationHours * this.DEFAULT_DRIVER_COST_PER_HOUR;

    // Additional heuristics: apply penalty if vehicle idle for long
    let idlePenalty = 0;
    if (vehicleState?.idleDays && vehicleState.idleDays > 3) {
      // We want to reward taking idle vehicles, so we effectively reduce cost internally?
      // No, cost is financial. We might adjust the objective function later.
      // But actually, long idle vehicles might require a minor prep cost.
      idlePenalty = 50;
    }

    const estimatedCost = fuelCost + maintenanceCost + driverCost + idlePenalty;

    // 4. Determine Revenue
    // Realistically, Load rate might already be set. If not, use a basic markup.
    let estimatedRevenue = load.rate;
    if (!estimatedRevenue || estimatedRevenue <= 0) {
      estimatedRevenue = estimatedCost * 1.3; // 30% margin default
    }

    const expectedMargin = estimatedRevenue - estimatedCost;

    // 5. Confidence Score
    // Decreases if we are missing real driver assignment or if deadhead is high
    let confidenceScore = 1.0;
    if (!driver) confidenceScore -= 0.2;
    if (deadheadDistance > 200) confidenceScore -= 0.1;

    return {
      estimatedCost: parseFloat(estimatedCost.toFixed(2)),
      estimatedRevenue: parseFloat(estimatedRevenue.toFixed(2)),
      expectedMargin: parseFloat(expectedMargin.toFixed(2)),
      confidenceScore: Math.max(0, confidenceScore),
      distanceKm: totalDistance,
      durationHours: parseFloat(durationHours.toFixed(1)),
    };
  }

  /**
   * Deterministic mock distance for stable testing without an external API.
   */
  private mockDeterministicDistance(
    origin: string,
    destination: string,
  ): number {
    const str = `${origin}-${destination}`.toLowerCase();
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
    }
    // Return a pseudo-random distance between 100 and 1500 km
    return 100 + (Math.abs(hash) % 1400);
  }
}
