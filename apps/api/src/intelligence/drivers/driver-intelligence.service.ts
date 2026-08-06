import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class DriverIntelligenceService {
  private readonly logger = new Logger(DriverIntelligenceService.name);

  constructor(private readonly prisma: PrismaService) {}

  async getDriverScore(companyId: string, driverId: string) {
    this.logger.log(`Fetching AI health score for driver: ${driverId}`);

    let score = await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.driverScore.findUnique({
        where: { driverId, companyId },
      }),
    );

    if (!score) {
      // Initialize with default perfect score until telematics populates it
      score = await this.prisma.runAsTenant(companyId, async (tx) =>
        tx.driverScore.create({
          data: {
            companyId,
            driverId,
            safetyScore: 100,
            efficiencyScore: 100,
            onTimePercent: 100,
            healthScore: 100,
          },
        }),
      );
    }

    return score;
  }
}
