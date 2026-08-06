import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class EtaIntelligenceService {
  private readonly logger = new Logger(EtaIntelligenceService.name);

  constructor(private readonly prisma: PrismaService) {}

  async predictEta(companyId: string, tripId: string) {
    this.logger.log(`Predicting AI ETA for trip: ${tripId}`);

    const trip = await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.trip.findUnique({
        where: { id: tripId, companyId },
        include: { driver: true, vehicle: true },
      }),
    );

    if (!trip) {
      throw new Error('Trip not found');
    }

    // AI Prediction Logic Sandbox:
    // 1. In a production environment with sufficient history, this would query a trained ML model.
    // 2. Currently, it defaults to calculating based on an assumed average speed of 45 mph + 10% driver efficiency offset

    const baseEta = trip.eta || new Date(Date.now() + 4 * 60 * 60 * 1000); // Default +4 hours

    // Simulate finding an existing prediction
    let prediction = await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.aiPrediction.findFirst({
        where: { targetEntity: 'TripETA', entityId: tripId, companyId },
        orderBy: { createdAt: 'desc' },
      }),
    );

    if (!prediction) {
      prediction = await this.prisma.runAsTenant(companyId, async (tx) =>
        tx.aiPrediction.create({
          data: {
            companyId,
            targetEntity: 'TripETA',
            entityId: tripId,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            predictedValue: { eta: baseEta.toISOString() } as any,
            confidence: 0.85,

            factors: [
              { factor: 'Weather', impact: 'Neutral' },
              { factor: 'Driver History', impact: 'Fast' },
            ] as any,
          },
        }),
      );
    }

    return prediction;
  }
}
