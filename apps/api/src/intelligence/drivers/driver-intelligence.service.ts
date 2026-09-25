// @ts-nocheck
import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class DriverIntelligenceService {
  private readonly logger = new Logger(DriverIntelligenceService.name);

  constructor(private readonly prisma: PrismaService) {}

  async getDriverScore(companyId: string, driverId: string) {
    this.logger.log(`Fetching AI health score for driver: ${driverId}`);

    let score = await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.driverScore.findFirst({
        where: { driverId, companyId },
        orderBy: { createdAt: 'desc' },
      }),
    );

    if (!score) {
      // Initialize with default perfect score until telematics populates it
      score = await this.prisma.runAsTenant(companyId, async (tx) =>
        tx.driverScore.create({
          data: {
            companyId,
            driverId,
            tripId: 'system-init',
            total: 100,
            ratedBy: 'SYSTEM_INIT',
            ratedAt: new Date(),
          },
        }),
      );
    }

    return score;
  }
}
