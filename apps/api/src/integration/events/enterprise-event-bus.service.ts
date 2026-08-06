import {
  Injectable,
  Logger,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { AuditService } from '../../platform/audit/audit.service';
import * as crypto from 'crypto';

@Injectable()
export class EnterpriseEventBusService {
  private readonly logger = new Logger(EnterpriseEventBusService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2,
    private readonly audit: AuditService,
  ) {}

  async publishEvent(
    companyId: string,
    userId: string,
    dto: {
      streamId: string;
      streamType: string;
      eventType: string;
      payload: any;
      metadata?: any;
      correlationId?: string;
    },
  ) {
    if (!dto.streamId || !dto.streamType || !dto.eventType || !dto.payload) {
      throw new BadRequestException(
        'streamId, streamType, eventType, and payload are required',
      );
    }

    return this.prisma.runAsTenant(companyId, async (tx) => {
      // Optimistic concurrency: find latest version for stream
      const lastEvent = await tx.domainEvent.findFirst({
        where: { streamId: dto.streamId },
        orderBy: { version: 'desc' },
      });
      const nextVersion = lastEvent ? lastEvent.version + 1 : 1;

      const eventRecord = await tx.domainEvent.create({
        data: {
          companyId,
          streamId: dto.streamId,
          streamType: dto.streamType.toUpperCase(),
          eventType: dto.eventType,
          version: nextVersion,
          payload: dto.payload,
          metadata: dto.metadata || {},
          correlationId: dto.correlationId || crypto.randomUUID(),
          userId,
        },
      });

      // Emit to internal bus for integration routing and digital twin updates
      const topic = `DomainEvent.${eventRecord.streamType}.${eventRecord.eventType}`;
      this.eventEmitter.emit(topic, {
        tenantId: companyId,
        eventId: eventRecord.id,
        streamId: eventRecord.streamId,
        version: eventRecord.version,
        payload: {
          data: {
            eventType: eventRecord.eventType,
            ...dto.payload,
          },
        },
      });

      this.logger.log(
        `Published event ${topic} (v${nextVersion}) for stream ${dto.streamId}`,
      );

      await this.audit.logEvent({
        companyId,
        userId,
        entity: 'DomainEvent',
        entityId: eventRecord.id,
        action: 'PUBLISH_EVENT',
        details: {
          streamId: dto.streamId,
          eventType: dto.eventType,
          version: nextVersion,
        },
      });

      return eventRecord;
    });
  }

  async getEventHistory(
    companyId: string,
    query: {
      streamType?: string;
      streamId?: string;
      eventType?: string;
      limit?: number;
      offset?: number;
    },
  ) {
    const where: any = { companyId };
    if (query.streamType) where.streamType = query.streamType.toUpperCase();
    if (query.streamId) where.streamId = query.streamId;
    if (query.eventType) where.eventType = query.eventType;

    const [events, total] = await Promise.all([
      this.prisma.runAsTenant(companyId, async (tx) =>
        tx.domainEvent.findMany({
          where,
          take: query.limit || 50,
          skip: query.offset || 0,
          orderBy: { timestamp: 'desc' },
        }),
      ),
      this.prisma.runAsTenant(companyId, async (tx) =>
        tx.domainEvent.count({ where }),
      ),
    ]);

    return {
      events,
      total,
      limit: query.limit || 50,
      offset: query.offset || 0,
    };
  }

  async replayEvents(
    companyId: string,
    streamId: string,
    fromVersion: number,
    toVersion: number,
    userId: string,
  ) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      const events = await tx.domainEvent.findMany({
        where: {
          companyId,
          streamId,
          version: {
            gte: fromVersion,
            lte: toVersion,
          },
        },
        orderBy: { version: 'asc' },
      });

      if (events.length === 0) {
        throw new NotFoundException(
          `No domain events found for stream ${streamId} in the specified version range.`,
        );
      }

      let replayedCount = 0;
      for (const ev of events) {
        const topic = `DomainEvent.${ev.streamType}.${ev.eventType}`;
        this.eventEmitter.emit(topic, {
          tenantId: companyId,
          eventId: ev.id,
          streamId: ev.streamId,
          version: ev.version,
          isReplay: true,
          payload: {
            data: {
              eventType: ev.eventType,
              ...(ev.payload as any),
            },
          },
        });
        replayedCount++;
      }

      this.logger.log(
        `Replayed ${replayedCount} events for stream ${streamId}`,
      );

      await this.audit.logEvent({
        companyId,
        userId,
        entity: 'DomainEvent',
        entityId: streamId,
        action: 'REPLAY_STREAM_EVENTS',
        details: { fromVersion, toVersion, replayedCount },
      });

      return { streamId, replayedCount, status: 'REPLAYED' };
    });
  }
}
