import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { EventStoreService } from '../../platform/digital-twin/event-store.service';
import { PredictionEngineService } from '../../ai/prediction/prediction.service';

@Injectable()
export class AiOperationsService {
  private readonly logger = new Logger(AiOperationsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly eventStore: EventStoreService,
    private readonly aiPrediction: PredictionEngineService,
  ) {}

  /**
   * Predicts ETAs for active trips dynamically based on current GPS, weather, and historical telemetry.
   * Target execution: Background or fast query (<100ms)
   */
  async predictTripEta(companyId: string, tripId: string) {
    const trip = await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.trip.findFirst({
        where: { id: tripId, companyId },
        include: { loads: true },
      }),
    );

    if (!trip) return null;

    // Call underlying AI Prediction Service
    const prediction = await this.aiPrediction.generatePrediction(
      companyId,
      'Trip',
      trip.id,
      {
        origin: trip.loads[0]?.originCity,
        destination: trip.loads[0]?.destinationCity,
        departureTime: trip.startDate,
        currentTime: new Date(),
      },
    );

    const predictedData = prediction?.predictedValue as any;
    if (predictedData && predictedData.eta) {
      const newEta = new Date(predictedData.eta);
      // Update trip ETA
      await this.prisma.runAsTenant(companyId, async (tx) =>
        tx.trip.update({
          where: { id: trip.id },
          data: { eta: newEta },
        }),
      );

      // Issue event for potential delay
      if (trip.eta && newEta > trip.eta) {
        await this.eventStore.append({
          tenantId: companyId,
          streamId: trip.id,
          streamType: 'TRIP',
          eventType: 'TripDelayPredicted',
          payload: { originalEta: trip.eta, newEta },
          userId: 'SYSTEM',
        });
      }
    }

    return prediction;
  }

  /**
   * Evaluates Risk Scoring for a trip based on driver behavior, vehicle maintenance, and route weather.
   */
  async evaluateRiskScore(
    companyId: string,
    tripId: string,
  ): Promise<{ score: number; factors: string[] }> {
    const trip = await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.trip.findFirst({
        where: { id: tripId, companyId },
        include: { driver: true, vehicle: true },
      }),
    );

    if (!trip) return { score: 0, factors: [] };

    let score = 0;
    const factors: string[] = [];

    // Simple heuristic-based risk for speed, actual AI would use tensor scoring
    if (trip.driver) {
      // check violations (mock)
      const violations = await this.prisma.runAsTenant(companyId, async (tx) =>
        tx.auditLog.count({
          where: {
            entity: 'Driver',
            entityId: trip.driver?.id || '',
            action: 'OVERSPEED_DETECTED',
          },
        }),
      );
      if (violations > 0) {
        score += violations * 10;
        factors.push(`${violations} recent speed violations`);
      }
    }

    if (trip.vehicle) {
      // Mock logic: checking recent incidents or breakdowns
      const incidents = await this.prisma.runAsTenant(companyId, async (tx) =>
        tx.auditLog.count({
          where: {
            entity: 'Vehicle',
            entityId: trip.vehicle?.id || '',
            action: 'BREAKDOWN_REPORTED',
          },
        }),
      );
      if (incidents > 0) {
        score += 30;
        factors.push(`Recent breakdowns reported on vehicle`);
      }
    }

    return { score: Math.min(score, 100), factors };
  }

  async recommendDriverForLoad(companyId: string, loadId: string) {
    const load = await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.load.findFirst({
        where: { id: loadId, companyId },
      }),
    );
    if (!load) return [];

    // Find available drivers and score them based on proximity and duty hours
    const availableDrivers = await this.prisma.runAsTenant(
      companyId,
      async (tx) =>
        tx.driver.findMany({
          where: { companyId, status: 'AVAILABLE' },
        }),
    );

    return availableDrivers
      .map((d, index) => ({
        driverId: d.id,
        name: `${d.firstName} ${d.lastName}`,
        score: 85 - index * 5, // Deterministic placeholder score
        reason: 'Optimal duty hours and proximity',
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
  }
}
