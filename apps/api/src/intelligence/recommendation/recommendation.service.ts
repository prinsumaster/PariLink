import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class RecommendationService {
  private readonly logger = new Logger(RecommendationService.name);

  constructor(private prisma: PrismaService) {}

  async recommendDriverForLoad(loadId: string, companyId: string) {
    this.logger.log(`Recommending best driver for load ${loadId}`);
    return await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.intelligenceRecommendation.create({
        data: {
          companyId,
          contextType: 'DISPATCH',
          contextId: loadId,
          suggestedAction: {
            driverId: 'driver-123',
            reason: 'High efficiency score, proximity',
          },
          predictedImpact: { costSaving: 120, timeSaving: 45 },
        },
      }),
    );
  }
}
