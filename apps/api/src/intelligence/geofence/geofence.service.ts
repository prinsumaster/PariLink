import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { PrismaService } from '../../prisma/prisma.service';
import { EventService } from '../../platform/events/event.service';

@Injectable()
export class GeofenceService {
  private readonly logger = new Logger(GeofenceService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly eventService: EventService,
  ) {}

  // Haversine distance formula
  private getDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ): number {
    const R = 6371e3; // metres
    const φ1 = (lat1 * Math.PI) / 180; // φ, λ in radians
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // in metres
  }

  @OnEvent('GpsPing.Received')
  async handleGpsPing(event: any) {
    const { tenantId, payload, timestamp } = event;
    const { vehicleId, latitude, longitude } = payload;

    // 1. Fetch active geofences for this company
    // Optimisation: In a real system, you'd use PostGIS or Redis geospatial indexing (GEORADIUS)
    // rather than loading all geofences, but for the MVP we will filter in memory.
    const geofences = await this.prisma.runAsSystem(async (tx) =>
      tx.geofence.findMany({
        where: { companyId: tenantId, isActive: true },
      }),
    );

    for (const geofence of geofences) {
      // 2. Calculate distance
      const distance = this.getDistance(
        latitude,
        longitude,
        geofence.latitude,
        geofence.longitude,
      );
      const isInsideNow = distance <= geofence.radiusMeters;

      // 3. Check previous state (did we already enter/exit?)
      const lastEvent = await this.prisma.runAsSystem(async (tx) =>
        tx.geofenceEvent.findFirst({
          where: { vehicleId, geofenceId: geofence.id },
          orderBy: { timestamp: 'desc' },
        }),
      );

      const wasInsideBefore = lastEvent?.eventType === 'ENTER';

      if (isInsideNow && !wasInsideBefore) {
        // Trigger ENTER event
        await this.prisma.runAsSystem(async (tx) =>
          tx.geofenceEvent.create({
            data: {
              companyId: tenantId,
              geofenceId: geofence.id,
              vehicleId,
              eventType: 'ENTER',
              timestamp: new Date(timestamp),
            },
          }),
        );

        this.eventService.publish('Geofence.Entered', {
          tenantId,
          userId: 'SYSTEM',
          correlationId: event.correlationId,
          payload: {
            vehicleId,
            geofenceId: geofence.id,
            geofenceName: geofence.name,
          },
          timestamp: new Date(timestamp),
        });

        this.logger.debug(
          `Vehicle ${vehicleId} ENTERED geofence ${geofence.name}`,
        );
      } else if (!isInsideNow && wasInsideBefore) {
        // Trigger EXIT event
        const dwellTimeMs =
          new Date(timestamp).getTime() -
          new Date(lastEvent.timestamp).getTime();

        await this.prisma.runAsSystem(async (tx) =>
          tx.geofenceEvent.create({
            data: {
              companyId: tenantId,
              geofenceId: geofence.id,
              vehicleId,
              eventType: 'EXIT',
              timestamp: new Date(timestamp),
              metadata: { dwellTimeMs },
            },
          }),
        );

        this.eventService.publish('Geofence.Exited', {
          tenantId,
          userId: 'SYSTEM',
          correlationId: event.correlationId,
          payload: {
            vehicleId,
            geofenceId: geofence.id,
            geofenceName: geofence.name,
            dwellTimeMs,
          },
          timestamp: new Date(timestamp),
        });

        this.logger.debug(
          `Vehicle ${vehicleId} EXITED geofence ${geofence.name} (Dwell: ${Math.round(dwellTimeMs / 60000)}m)`,
        );
      }
    }
  }
}
