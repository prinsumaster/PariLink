import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PrismaService } from '../../prisma/prisma.service';

export interface StandardCloudEvent {
  id: string; // UUID
  source: string; // The bounded context, e.g. "parilink.logistics.tms"
  specversion: string; // "1.0"
  type: string; // e.g. "parilink.vehicle.location.received"
  datacontenttype: string; // "application/json"
  time: string; // ISO8601
  data: unknown; // The payload

  // Custom Extensions for Multi-Tenancy
  tenantId: string;
  userId?: string;
  correlationId?: string;
}

// Backward compatibility for legacy V4.0 modules
export interface PlatformEvent {
  tenantId: string;
  userId?: string;
  correlationId?: string;
  payload: unknown;
  timestamp?: Date;
}

@Injectable()
export class EventService {
  private readonly logger = new Logger(EventService.name);

  constructor(
    private prisma: PrismaService,
    private eventEmitter: EventEmitter2,
  ) {}

  publish(eventName: string, event: PlatformEvent) {
    this.logger.debug(
      `[EventBus] Publishing ${eventName} for tenant ${event.tenantId}`,
    );
    this.eventEmitter.emit(eventName, event);
  }

  publishAsync(eventName: string, event: PlatformEvent) {
    this.logger.debug(
      `[EventBus] Publishing async ${eventName} for tenant ${event.tenantId}`,
    );
    return this.eventEmitter.emitAsync(eventName, event);
  }

  /**
   * Publishes an event using the Transactional Outbox pattern.
   * This ensures the event is saved in the same transaction as the domain state change.
   * A separate Debezium/Kafka Connect process (or a polling worker) will tail this table
   * and push it to Apache Kafka.
   */
  async publishOutbox(event: StandardCloudEvent, prismaTx?: unknown) {
    this.logger.debug(
      `[EventBus/Outbox] Storing event ${event.type} for tenant ${event.tenantId}`,
    );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const db = (prismaTx as any) || this.prisma;

    return db.domainEvent.create({
      data: {
        id: event.id,
        eventType: event.type,
        streamId: event.source,
        streamType: 'System',
        companyId: event.tenantId,
        userId: event.userId,
        correlationId: event.correlationId,
        version: 1, // Will be managed via optimistic concurrency in future iterations
        payload: event.data,
        metadata: {
          specversion: event.specversion,
          datacontenttype: event.datacontenttype,
          time: event.time,
        },
      },
    });
  }
}
