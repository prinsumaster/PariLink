import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class RiskService {
  private readonly logger = new Logger(RiskService.name);

  constructor(private prisma: PrismaService) {}

  async assessTripRisk(tripId: string, companyId: string) {
    this.logger.log(`Assessing risk for trip ${tripId}`);

    // Deterministic rules first.
    return await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.intelligenceRiskAssessment.create({
        data: {
          companyId,
          entityId: tripId,
          entityType: 'TRIP',
          riskType: 'LATE_DELIVERY',
          riskScore: 0.45,
          severity: 'MEDIUM',
          contributingFactors: { weather: 'Rain', driverFatigue: 'Low' },
        },
      }),
    );
  }
}
