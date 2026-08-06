import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PredictionService {
  private readonly logger = new Logger(PredictionService.name);

  constructor(private prisma: PrismaService) {}

  async predictEta(
    tripId: string,
    currentLat: number,
    currentLng: number,
    companyId: string,
  ) {
    // Deterministic rules first, ML second.
    // Stub implementation for predicting ETA based on telemetry
    this.logger.log(`Predicting ETA for trip ${tripId}`);

    // Calculate dummy prediction
    const predictedEta = new Date(Date.now() + 3600 * 1000 * 24); // 1 day from now

    // Save to IntelligencePrediction table
    return await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.intelligencePrediction.create({
        data: {
          companyId,
          entityId: tripId,
          entityType: 'TRIP',
          predictionType: 'ETA',
          predictedValue: { eta: predictedEta.toISOString() },
          confidenceScore: 0.85,
          featuresUsed: { lat: currentLat, lng: currentLng, weather: 'Clear' },
        },
      }),
    );
  }
}
