import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { EventService } from '../../platform/events/event.service';
import { GpsPingDto } from './gps.dto';

@Injectable()
export class GpsService {
  private readonly logger = new Logger(GpsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly eventService: EventService,
  ) {}

  async ingestPing(companyId: string, ping: GpsPingDto) {
    // 1. Validate vehicle exists and belongs to company
    const vehicle = await this.prisma.runAsSystem(async (tx) =>
      tx.vehicle.findUnique({
        where: { id: ping.vehicleId },
        select: { id: true, companyId: true },
      }),
    );

    if (!vehicle || vehicle.companyId !== companyId) {
      this.logger.warn(`Invalid GPS ping for vehicle ${ping.vehicleId}`);
      return;
    }

    const timestamp = new Date(ping.timestamp);

    // 2. Determine active trip for this vehicle (latest IN_PROGRESS trip)
    const activeTrip = await this.prisma.runAsSystem(async (tx) =>
      tx.trip.findFirst({
        where: {
          vehicleId: ping.vehicleId,
          companyId,
          status: 'IN_PROGRESS',
        },
        orderBy: { createdAt: 'desc' },
      }),
    );

    // 3. Persist Location History
    if (activeTrip && activeTrip.driverId) {
      await this.prisma.runAsSystem(async (tx) =>
        tx.locationHistory.create({
          data: {
            companyId,

            // Wait, LocationHistory does not have vehicleId, only tripId and driverId. We should link it to Trip.
            tripId: activeTrip.id,
            driverId: activeTrip.driverId as string,
            latitude: ping.latitude,
            longitude: ping.longitude,
            speed: ping.speed,
            heading: ping.heading,
            accuracy: ping.accuracy,
            timestamp,
          },
        }),
      );
    }

    // 4. Update Vehicle Telemetry (Latest State)
    await this.prisma.runAsSystem(async (tx) =>
      tx.vehicleTelemetry.create({
        data: {
          companyId,
          vehicleId: ping.vehicleId,
          odometer: ping.odometer,
          fuelLevel: ping.fuelLevel,
          ignition: ping.ignition,
          timestamp,
        },
      }),
    );

    // 5. Publish Event for Geofence/ETA/Alert Engines
    this.eventService.publish('GpsPing.Received', {
      tenantId: companyId,
      userId: 'SYSTEM', // Hardware event
      correlationId: `gps-${ping.vehicleId}-${timestamp.getTime()}`,
      payload: ping,
      timestamp,
    });

    return { success: true };
  }
}
