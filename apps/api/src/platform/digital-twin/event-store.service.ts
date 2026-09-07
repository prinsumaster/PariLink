import { Injectable, Logger, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { EventService } from '../events/event.service';

export interface AppendEventParams {
  tenantId: string | null;
  streamId: string;
  streamType: string;
  eventType: string;
  payload: any;
  expectedVersion?: number;
  userId?: string;
  correlationId?: string;
}

@Injectable()
export class EventStoreService {
  private readonly logger = new Logger(EventStoreService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly eventService: EventService,
  ) {}

  async append(params: AppendEventParams, txClient?: any): Promise<void> {
    const {
      tenantId,
      streamId,
      streamType,
      eventType,
      payload,
      expectedVersion,
      userId,
      correlationId,
    } = params;

    const runOp = async (tx: any) => {
      // 1. Get current version of the stream
      const lastEvent = await tx.domainEvent.findFirst({
        where: { streamId, companyId: tenantId },
        orderBy: { version: 'desc' },
      });

      const currentVersion = lastEvent?.version || 0;
      const nextVersion = currentVersion + 1;

      // 2. Optimistic Concurrency Control
      if (expectedVersion !== undefined && expectedVersion !== currentVersion) {
        throw new ConflictException(
          `Concurrency conflict: Expected version ${expectedVersion}, got ${currentVersion}`,
        );
      }

      // 3. Append the new event
      const newEvent = await tx.domainEvent.create({
        data: {
          companyId: tenantId,
          streamId,
          streamType,
          eventType,
          version: nextVersion,
          payload,
          userId: userId || 'SYSTEM',
          correlationId,
        },
      });

      this.logger.debug(
        `Appended [${eventType}] to ${streamType}:${streamId} @ v${nextVersion}`,
      );

      // 4. Publish to Memory Bus for Live Projections to pick up
      this.eventService.publish(`DomainEvent.${streamType}.${eventType}`, {
        tenantId: tenantId || 'SYSTEM',
        correlationId: correlationId || `event-${newEvent.id}`,
        timestamp: newEvent.timestamp,
        payload: {
          streamId,
          version: nextVersion,
          data: payload,
          metadata: {
            eventId: newEvent.id,
            timestamp: newEvent.timestamp,
          },
        },
      });
    };

    if (txClient) {
      await runOp(txClient);
    } else {
      await this.prisma.runAsTenant(tenantId ?? 'SYSTEM', runOp);
    }
  }

  async getStream(tenantId: string, streamId: string, fromVersion = 0) {
    return await this.prisma.runAsTenant(tenantId, async (tx) =>
      tx.domainEvent.findMany({
        where: { companyId: tenantId, streamId, version: { gt: fromVersion } },
        orderBy: { version: 'asc' },
      }),
    );
  }
}
