import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { PrismaService } from '../../prisma/prisma.service';
import { SyncEngineService } from '../sync/sync.service';

@Injectable()
export class EventIntegrationService {
  private readonly logger = new Logger(EventIntegrationService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly syncService: SyncEngineService,
  ) {}

  /**
   * Listen to all internal DomainEvents and route them to interested external connectors.
   */
  @OnEvent('DomainEvent.**')
  async handleDomainEvent(eventPayload: any) {
    if (!eventPayload || !eventPayload.tenantId || !eventPayload.payload)
      return;

    // Check if any connector supports this event topic (e.g. 'InvoiceGenerated')
    const topic = eventPayload.payload.data?.eventType;
    if (!topic) return;

    // In a production system, this mapping would be heavily cached in Redis.
    const connections = await this.prisma.runAsSystem(async (tx) =>
      tx.integrationConnection.findMany({
        where: {
          companyId: eventPayload.tenantId,
          status: 'ENABLED',
        },
        include: { connector: true },
      }),
    );

    for (const conn of connections) {
      const supportedEvents = conn.connector.supportedEvents as string[];
      if (supportedEvents && supportedEvents.includes(topic)) {
        this.logger.log(
          `Routing Event ${topic} to External Connector: ${conn.connector.provider}`,
        );

        // Trigger a push sync to the external system
        await this.syncService.triggerSync(
          eventPayload.tenantId,
          conn.id,
          topic,
          eventPayload.payload.data,
        );
      }
    }
  }
}
