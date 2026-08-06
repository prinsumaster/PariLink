import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { PrismaService } from '../../../prisma/prisma.service';

/**
 * Ensures the Twin always reflects reality by mutating the materialized TwinSnapshot
 * in response to actual operational events on the Event Bus.
 */
@Injectable()
export class TwinSyncService {
  private readonly logger = new Logger(TwinSyncService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Catches all relevant execution and operational events.
   * e.g., 'trip.completed', 'invoice.generated', 'execution.stepUpdated'
   */
  @OnEvent('DomainEvent.**') // Catch all events
  async handleDomainEvent(event: Record<string, unknown>) {
    if (!event.companyId || !event.entityId) return;

    this.logger.debug(
      `[TwinSync] Syncing state for ${event.type as string} on entity ${event.entityId as string}`,
    );

    // Fetch the latest state to bump the version
    const latestSnapshot = await this.prisma.runAsSystem(async (tx) =>
      tx.twinSnapshot.findFirst({
        where: {
          companyId: event.companyId as string,
          twinId: event.entityId as string,
        },
        orderBy: { version: 'desc' },
      }),
    );

    const currentVersion = latestSnapshot ? latestSnapshot.version : 0;
    const currentState = latestSnapshot
      ? (latestSnapshot.state as Record<string, unknown>)
      : {};

    // Merge the event payload into the Twin state.
    // In a production system, this would use CQRS projections to carefully mutate specific properties.
    const newState = {
      ...currentState,
      ...(event.payload as Record<string, unknown>),
      lastUpdatedByEvent: event.type as string,
      updatedAt: event.timestamp as string,
    };

    // Maintain historical states by inserting a new immutable record
    await this.prisma.runAsSystem(async (tx) =>
      tx.twinSnapshot.create({
        data: {
          companyId: event.companyId as string,
          twinId: event.entityId as string,
          twinType: event.entityType as string,
          version: currentVersion + 1,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          state: newState as any,
          timestamp: (event.timestamp as string) || new Date(),
        },
      }),
    );
  }
}
