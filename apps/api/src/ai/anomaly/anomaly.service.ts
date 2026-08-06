import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { PrismaService } from '../../prisma/prisma.service';
import { MockAIProvider } from '../providers/mock-ai.provider';

@Injectable()
export class AnomalyDetectionService {
  private readonly logger = new Logger(AnomalyDetectionService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly aiProvider: MockAIProvider,
  ) {}

  /**
   * Subscribes to high-volume events and flags anomalies (e.g., GPS jumps)
   */
  @OnEvent('DomainEvent.**')
  async handleDomainEvent(eventPayload: any) {
    if (!eventPayload || !eventPayload.payload) return;

    // In production, this would batch events before sending to an anomaly detection model.
    // Random mock anomalies are disabled in production to prevent false alerts.
    const isAnomaly = false;

    if (isAnomaly) {
      this.logger.warn(
        `Anomaly Detected in Event: ${eventPayload.payload.data?.eventType}`,
      );

      await this.prisma.runAsSystem(async (tx) =>
        tx.aiAnomaly.create({
          data: {
            companyId: eventPayload.tenantId,
            category: 'Event Anomaly',
            severity: 'MEDIUM',
            description: `An unusual pattern was detected in event ${eventPayload.payload.data?.eventType}`,
            evidence: eventPayload.payload,
            status: 'UNRESOLVED',
          },
        }),
      );
    }
  }
}
