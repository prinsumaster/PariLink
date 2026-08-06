import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { PrismaService } from '../../../prisma/prisma.service';

export interface DomainEventPayload {
  tenantId: string;
  payload: {
    streamId: string;
    version: number;
    data: Record<string, unknown>;
  };
  metadata?: { eventId?: string };
}

@Injectable()
export class VehicleTwinService {
  private readonly logger = new Logger(VehicleTwinService.name);

  constructor(private readonly prisma: PrismaService) {}

  @OnEvent('DomainEvent.VEHICLE.*')
  async handleVehicleEvent(event: DomainEventPayload) {
    const { tenantId, payload } = event;
    const { streamId, data, version } = payload;

    // Determine the event type from the routing key
    const eventType = event.metadata?.eventId ? 'Unknown' : 'Unknown'; // We need the eventName.
    // NestJS wildcard events pass the event name as the 2nd arg or we can inject it.
    // Instead of relying on wildcard string parsing here, let's just use the strict payload we designed.

    // Let's implement specific listeners for clarity instead of wildcards for state machines.
  }

  @OnEvent('DomainEvent.VEHICLE.GpsUpdated')
  async handleGpsUpdated(event: DomainEventPayload) {
    // The twin updates telemetry read-model
    const { tenantId, payload } = event;
    const { streamId, data, version } = payload;

    await this.prisma.runAsSystem(async (tx) =>
      tx.vehicleTelemetry.create({
        data: {
          companyId: tenantId,
          vehicleId: streamId,
          odometer: data.odometer as number,
          fuelLevel: data.fuelLevel as number,
          ignition: data.ignition as boolean,
          timestamp: new Date(), // Normally from event metadata
        },
      }),
    );

    // Snapshot the twin
    await this.saveSnapshot(tenantId, streamId, version, {
      status: 'MOVING',
      ...data,
    });
    this.logger.debug(
      `VehicleTwin [${streamId}] updated via GpsUpdated v${version}`,
    );
  }

  @OnEvent('DomainEvent.VEHICLE.DriverAssigned')
  async handleDriverAssigned(event: DomainEventPayload) {
    const { tenantId, payload } = event;
    const { streamId, data, version } = payload;

    // Projection update: Not natively supported on Vehicle schema to have a 'currentDriver',
    // it usually relies on Trip. But for a Digital Twin, we snapshot the combined state.
    await this.saveSnapshot(tenantId, streamId, version, {
      currentDriverId: data.driverId,
    });
    this.logger.debug(
      `VehicleTwin [${streamId}] updated via DriverAssigned v${version}`,
    );
  }

  private async saveSnapshot(
    tenantId: string,
    twinId: string,
    version: number,
    partialState: Record<string, unknown>,
  ) {
    // Upsert the snapshot
    const existing = await this.prisma.runAsSystem(async (tx) =>
      tx.twinSnapshot.findUnique({
        where: { twinId_twinType: { twinId, twinType: 'VEHICLE' } },
      }),
    );

    const mergedState = existing
      ? { ...(existing.state as Record<string, unknown>), ...partialState }
      : partialState;

    await this.prisma.runAsSystem(async (tx) =>
      tx.twinSnapshot.upsert({
        where: { twinId_twinType: { twinId, twinType: 'VEHICLE' } },
        create: {
          companyId: tenantId,
          twinId,
          twinType: 'VEHICLE',
          version,
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
          state: mergedState as object,
        },
        update: {
          version,
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
          state: mergedState as object,
          timestamp: new Date(),
        },
      }),
    );
  }
}
