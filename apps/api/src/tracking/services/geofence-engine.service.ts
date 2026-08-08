import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditService } from '../../platform/audit/audit.service';
import { CreateGeofenceDto } from '../dto/telematics.dto';

@Injectable()
export class GeofenceEngineService {
  private readonly logger = new Logger(GeofenceEngineService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  async createGeofence(
    companyId: string,
    userId: string,
    dto: CreateGeofenceDto,
  ) {
    const geofence = await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.geofence.create({
        data: {
          companyId,
          name: dto.name,
          description: dto.description || null,
          type: dto.type,
          latitude: dto.latitude,
          longitude: dto.longitude,
          radiusMeters: dto.radiusMeters || 100,
          polygon: dto.polygon ? (dto.polygon as any) : undefined,
          isActive: dto.isActive !== undefined ? dto.isActive : true,
        },
      }),
    );

    await this.audit.logEvent({
      action: 'geofence:create',
      entity: 'Geofence',
      entityId: geofence.id,
      userId,
      companyId,
      details: {
        name: geofence.name,
        type: geofence.type,
        radiusMeters: geofence.radiusMeters,
      },
    });

    return geofence;
  }

  async getGeofences(companyId: string, type?: string) {
    return this.prisma.runAsTenant(companyId, async (tx) =>
      tx.geofence.findMany({
        where: {
          companyId,
          type: type || undefined,
          isActive: true,
        },
        orderBy: { name: 'asc' },
      }),
    );
  }

  async getGeofenceById(companyId: string, id: string) {
    const geofence = await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.geofence.findUnique({
        where: { id },
        include: {
          events: {
            orderBy: { timestamp: 'desc' },
            take: 10,
          },
        },
      }),
    );
    if (!geofence || geofence.companyId !== companyId) {
      throw new NotFoundException('Geofence not found');
    }
    return geofence;
  }

  async deleteGeofence(companyId: string, id: string, userId: string) {
    const geofence = await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.geofence.findFirst({ where: { id, companyId } }),
    );
    if (!geofence || geofence.companyId !== companyId) {
      throw new NotFoundException('Geofence not found');
    }

    await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.geofence.deleteMany({
        where: { id, companyId },
      }),
    );

    await this.audit.logEvent({
      action: 'geofence:delete',
      entity: 'Geofence',
      entityId: id,
      userId,
      companyId,
      details: { name: geofence.name },
    });

    return { success: true, id };
  }

  // Haversine formula to calculate distance in meters between two lat/lng points
  private calculateDistanceMeters(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ): number {
    const R = 6371e3; // Earth radius in meters
    const phi1 = (lat1 * Math.PI) / 180;
    const phi2 = (lat2 * Math.PI) / 180;
    const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
    const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
      Math.cos(phi1) *
        Math.cos(phi2) *
        Math.sin(deltaLambda / 2) *
        Math.sin(deltaLambda / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  }

  // Real-time Geospatial Geofence Boundary Transition Engine
  async evaluateLocationAgainstGeofences(
    companyId: string,
    vehicleId: string,
    latitude: number,
    longitude: number,
    timestamp: Date = new Date(),
  ) {
    const geofences = await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.geofence.findMany({
        where: { companyId, isActive: true },
      }),
    );

    const eventsCreated: any[] = [];

    for (const fence of geofences) {
      const distance = this.calculateDistanceMeters(
        latitude,
        longitude,
        fence.latitude,
        fence.longitude,
      );
      const isInside = distance <= fence.radiusMeters;

      // Check last event for this vehicle in this geofence
      const lastEvent = await this.prisma.runAsTenant(companyId, async (tx) =>
        tx.geofenceEvent.findFirst({
          where: { geofenceId: fence.id, vehicleId },
          orderBy: { timestamp: 'desc' },
        }),
      );

      const wasInside = lastEvent?.eventType === 'ENTER';

      if (isInside && !wasInside) {
        // TRANSITION: ENTER
        const enterEvent = await this.prisma.runAsTenant(
          companyId,
          async (tx) =>
            tx.geofenceEvent.create({
              data: {
                companyId,
                geofenceId: fence.id,
                vehicleId,
                eventType: 'ENTER',
                timestamp,
                metadata: { distanceMeters: Math.round(distance) },
              },
            }),
        );

        await this.audit.logEvent({
          action: 'geofence:transition:enter',
          entity: 'GeofenceEvent',
          entityId: enterEvent.id,
          userId: undefined,
          companyId,
          details: {
            geofenceName: fence.name,
            vehicleId,
            geofenceId: fence.id,
          },
        });

        eventsCreated.push(enterEvent);
      } else if (!isInside && wasInside) {
        // TRANSITION: EXIT (calculate dwell time)
        const enterTime = lastEvent.timestamp.getTime();
        const exitTime = timestamp.getTime();
        const dwellMinutes = Math.max(
          1,
          Math.round((exitTime - enterTime) / 60000),
        );

        const exitEvent = await this.prisma.runAsTenant(companyId, async (tx) =>
          tx.geofenceEvent.create({
            data: {
              companyId,
              geofenceId: fence.id,
              vehicleId,
              eventType: 'EXIT',
              timestamp,
              metadata: {
                dwellMinutes,
                enteredAt: lastEvent.timestamp.toISOString(),
                exitedAt: timestamp.toISOString(),
                distanceMeters: Math.round(distance),
              },
            },
          }),
        );

        await this.audit.logEvent({
          action: 'geofence:transition:exit',
          entity: 'GeofenceEvent',
          entityId: exitEvent.id,
          userId: undefined,
          companyId,
          details: { geofenceName: fence.name, vehicleId, dwellMinutes },
        });

        eventsCreated.push(exitEvent);
      }
    }

    return { evaluatedCount: geofences.length, eventsCreated };
  }

  async getGeofenceEvents(
    companyId: string,
    geofenceId?: string,
    vehicleId?: string,
  ) {
    return this.prisma.runAsTenant(companyId, async (tx) =>
      tx.geofenceEvent.findMany({
        where: {
          companyId,
          geofenceId: geofenceId || undefined,
          vehicleId: vehicleId || undefined,
        },
        include: {
          geofence: { select: { name: true, type: true } },
          vehicle: { select: { licensePlate: true } },
        },
        orderBy: { timestamp: 'desc' },
        take: 50,
      }),
    );
  }
}
