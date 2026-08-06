import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export interface ScoreFactors {
  fuelCostMetric: number; // e.g. estimated fuel cost in $
  slaProbability: number; // 0 to 1
  fleetUtilization: number; // 0 to 1
  driverPreference: number; // 0 to 1
  maintenanceRisk: number; // 0 to 1 (lower is better for risk, but scoring will invert this)
  carbonEmissionsKg: number; // Estimated kg of CO2
}

@Injectable()
export class ScoringService {
  private readonly logger = new Logger(ScoringService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Retrieves the custom weights for the company. Defaults to standard weights if not found.
   */
  async getWeights(companyId: string) {
    const config = await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.optimizationWeightConfig.findFirst({
        where: { companyId },
        orderBy: { createdAt: 'desc' },
      }),
    );

    if (config) {
      return config;
    }

    // Default V8 Weights
    return {
      fuelCostWeight: 0.3,
      slaWeight: 0.25,
      fleetUtilWeight: 0.2,
      driverPrefWeight: 0.1,
      maintenanceWeight: 0.1,
      carbonWeight: 0.05,
    };
  }

  /**
   * Calculates a normalized score (0.0 to 1.0) based on dynamic weights.
   * Higher score is better.
   */
  async calculateScore(
    companyId: string,
    factors: ScoreFactors,
  ): Promise<number> {
    const weights = await this.getWeights(companyId);

    // Normalize factors to 0-1 scale where 1 is best.

    // Fuel Cost: Lower is better. Assuming max reasonable cost for a trip is $2000 for normalization.
    const MAX_COST = 2000;
    const normFuel = Math.max(0, 1 - factors.fuelCostMetric / MAX_COST);

    // SLA: Higher probability is better. (0 to 1)
    const normSla = factors.slaProbability;

    // Fleet Util: Higher is better. (0 to 1)
    const normUtil = factors.fleetUtilization;

    // Driver Pref: Higher is better. (0 to 1)
    const normPref = factors.driverPreference;

    // Maintenance Risk: Lower risk is better.
    const normMaint = Math.max(0, 1 - factors.maintenanceRisk);

    // Carbon Emissions: Lower is better. Assuming max 1000kg for normalization.
    const MAX_CARBON = 1000;
    const normCarbon = Math.max(0, 1 - factors.carbonEmissionsKg / MAX_CARBON);

    // Calculate weighted sum
    const totalScore =
      normFuel * weights.fuelCostWeight +
      normSla * weights.slaWeight +
      normUtil * weights.fleetUtilWeight +
      normPref * weights.driverPrefWeight +
      normMaint * weights.maintenanceWeight +
      normCarbon * weights.carbonWeight;

    return Math.min(Math.max(totalScore, 0), 1.0); // Clamp between 0 and 1
  }
}
