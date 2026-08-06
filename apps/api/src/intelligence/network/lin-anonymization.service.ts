import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { PrismaService } from '../../prisma/prisma.service';
import type {
  StandardCloudEvent,
  PlatformEvent,
} from '../../platform/events/event.service';

@Injectable()
export class LinAnonymizationService {
  private readonly logger = new Logger(LinAnonymizationService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Listen to critical operational events and siphon them into the anonymized
   * Intelligence Network archive. In a true distributed system, this would listen
   * to a Kafka topic. Here we listen to the local event bus.
   */
  @OnEvent('trip.completed')
  async handleTripCompleted(event: PlatformEvent) {
    this.logger.debug(`[LIN] Anonymizing trip.completed event...`);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const payload = event.payload as Record<string, any>;

    // Strict Anonymization Map
    // Drops: tripNumber, driverId, vehicleId, precise locations
    // Keeps: duration, status, delays, fuel metrics (if any)
    const anonymizedPayload = {
      durationSeconds: payload.actualDurationSeconds || null,
      distanceMeters: payload.actualDistanceMeters || null,
      delayed: payload.status === 'DELAYED',
      region: this.generalizeLocation(payload.startLocation), // e.g. "US-West" instead of GPS
    };

    await this.archiveEvent('trip.completed', anonymizedPayload);
  }

  @OnEvent('BusinessHealth.Updated')
  async handleBusinessHealth(event: PlatformEvent) {
    this.logger.debug(`[LIN] Anonymizing BusinessHealth.Updated event...`);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const payload = event.payload as Record<string, any>;

    const anonymizedPayload = {
      operationalScore: payload.operationalScore,
      financialScore: payload.financialScore,
      timestamp: payload.timestamp,
    };

    await this.archiveEvent('business_health.updated', anonymizedPayload);
  }

  @OnEvent('anomaly.resolved')
  async handleAnomalyResolved(event: PlatformEvent) {
    this.logger.debug(`[LIN] Anonymizing anomaly.resolved event...`);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const payload = event.payload as Record<string, any>;

    const anonymizedPayload = {
      anomalyType: payload.type,
      resolutionTimeSeconds: payload.resolutionTimeSeconds,
      aiRecommendationUsed: payload.aiRecommendationUsed || false,
    };

    await this.archiveEvent('anomaly.resolved', anonymizedPayload);
  }

  private async archiveEvent(eventType: string, anonymizedPayload: any) {
    try {
      await this.prisma.runAsSystem(async (tx) =>
        tx.linEventArchive.create({
          data: {
            eventType,
            anonymizedPayload,
          },
        }),
      );
      this.logger.debug(
        `[LIN] Successfully archived anonymized event: ${eventType}`,
      );
    } catch (error) {
      this.logger.error(`[LIN] Failed to archive event: ${error.message}`);
    }
  }

  private generalizeLocation(location: any): string {
    // Stub implementation to generalize GPS into large geographic buckets
    return 'US-West';
  }
}
