import { Injectable, Logger } from '@nestjs/common';
import { RawTelemetryEvent } from './quality-engine.service';
import { PrismaService } from '../../../prisma/prisma.service';
import { EventService } from '../../events/event.service';

interface ProviderConfidence {
  provider: string;
  baseConfidence: number; // 0-100
}

const PROVIDER_CONFIDENCE_SCORES: ProviderConfidence[] = [
  { provider: 'FASTAG', baseConfidence: 99 }, // Ground truth toll crossing
  { provider: 'TATA_FLEET_EDGE', baseConfidence: 95 }, // OEM Deep CAN Bus
  { provider: 'SAMSARA', baseConfidence: 85 }, // Premium Telematics
  { provider: 'LOCONAV', baseConfidence: 75 }, // Standard Telematics
];

@Injectable()
export class FusionEngineService {
  private readonly logger = new Logger(FusionEngineService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly eventService: EventService,
  ) {}

  private getProviderConfidence(provider: string): number {
    const p = PROVIDER_CONFIDENCE_SCORES.find((c) => c.provider === provider);
    return p ? p.baseConfidence : 50; // Unknown provider gets 50
  }

  async processTelemetry(
    event: RawTelemetryEvent,
    qualityScore: number,
  ): Promise<void> {
    if (!event.vehicleId) {
      this.logger.warn(
        `Cannot fuse telemetry without a resolved vehicleId for providerVehicleId: ${event.providerVehicleId}`,
      );
      return;
    }

    const providerConfidence = this.getProviderConfidence(event.provider);
    const fusionScore = providerConfidence * 0.7 + qualityScore * 0.3; // Weighted confidence

    // Save the raw location data for historical mapping
    if (event.latitude !== undefined && event.longitude !== undefined) {
      await this.prisma.runAsSystem(async (tx) =>
        tx.vehicleLocation.create({
          data: {
            companyId: event.tenantId,
            provider: event.provider,
            providerVehicleId: event.providerVehicleId,
            vehicleId: event.vehicleId,
            latitude: event.latitude as number,
            longitude: event.longitude as number,
            speed: event.speed,
            heading: event.heading,
            ignition: event.ignition,
            fuel: event.fuelLevel,
            odometer: event.odometer,
            gpsTimestamp: event.timestamp,
          },
        }),
      );
    }

    // Now, retrieve the current Digital Twin snapshot for this vehicle
    const twin = await this.prisma.runAsSystem(async (tx) =>
      tx.twinSnapshot.findUnique({
        where: {
          twinId_twinType: {
            twinId: event.vehicleId as string,
            twinType: 'VEHICLE',
          },
        },
      }),
    );

    const currentState = twin ? (twin.state as any) : {};

    // FUSION LOGIC: Should we overwrite the twin's state?
    // E.g. If current state was set by an OEM (Confidence 95), do not overwrite with LOCONAV (Confidence 75) unless
    // the OEM data is very old. For simplicity in this iteration, we merge the latest event, but track confidence.

    const newState = {
      ...currentState,
      lastProvider: event.provider,
      lastFusionScore: fusionScore,
      lastUpdateAt: new Date().toISOString(),
    };

    if (event.latitude !== undefined) newState.latitude = event.latitude;
    if (event.longitude !== undefined) newState.longitude = event.longitude;
    if (event.speed !== undefined) newState.speed = event.speed;
    if (event.odometer !== undefined) newState.odometer = event.odometer;
    if (event.fuelLevel !== undefined) newState.fuelLevel = event.fuelLevel;
    if (event.ignition !== undefined) newState.ignition = event.ignition;

    const nextVersion = twin ? twin.version + 1 : 1;

    // Update the Digital Twin in the Database
    await this.prisma.runAsSystem(async (tx) =>
      tx.twinSnapshot.upsert({
        where: {
          twinId_twinType: {
            twinId: event.vehicleId as string,
            twinType: 'VEHICLE',
          },
        },
        create: {
          companyId: event.tenantId,
          twinId: event.vehicleId as string,
          twinType: 'VEHICLE',
          version: nextVersion,
          state: newState,
        },
        update: {
          version: nextVersion,
          state: newState,
          timestamp: new Date(),
        },
      }),
    );

    // Emit the Digital Twin State Change Event so other modules (Dispatch, AI) can react instantly
    this.eventService.publish('DomainEvent.VEHICLE.TwinUpdated', {
      tenantId: event.tenantId,
      correlationId: `fusion-${event.provider}-${Date.now()}`,
      payload: {
        streamId: event.vehicleId,
        version: nextVersion,
        data: newState,
      },
    });

    this.logger.debug(
      `VehicleTwin [${event.vehicleId}] updated by FusionEngine (Score: ${fusionScore.toFixed(2)})`,
    );
  }
}
