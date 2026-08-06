import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CacheManagerService } from '../../platform/performance/cache-manager.service';
import { EventStoreService } from '../../platform/digital-twin/event-store.service';

@Injectable()
export class LiveFleetService {
  private readonly logger = new Logger(LiveFleetService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly cache: CacheManagerService,
    private readonly eventStore: EventStoreService,
  ) {}

  /**
   * Fast real-time fleet map API. Returns all active vehicles and their last known location.
   * Target execution: < 50ms
   */
  async getLiveMap(companyId: string) {
    const cacheKey = `fleet_map:${companyId}`;
    const cached = await this.cache.get(cacheKey);
    if (cached) return cached;

    // Fetch active trips and their assigned vehicles
    const activeTrips = await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.trip.findMany({
        where: { companyId, status: 'IN_PROGRESS' },
        include: {
          vehicle: true,
          driver: true,
          loads: { select: { originCity: true, destinationCity: true } },
        },
      }),
    );

    const activeVehiclesIds = activeTrips
      .map((t) => t.vehicleId)
      .filter(Boolean) as string[];

    // In a real high-throughput system, live location is read strictly from Redis,
    // not Postgres. The Telemetry Ingress should update Redis keys `vehicle_loc:${id}`.
    // Here we simulate the fast path by looking up locations.

    // Fallback: DB lookup if Redis is not populated
    const locations = await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.vehicleLocation.findMany({
        where: { companyId }, // We'd filter by vehicle ID if we had mapping, but providerVehicleId is used.
        orderBy: { gpsTimestamp: 'desc' },
        take: 500, // naive optimization for demonstration
      }),
    );

    // Map trips to locations based on vehicle ID mapping (assuming providerVehicleId = vehicle.registrationNumber for simplicity)
    const mapData = activeTrips.map((trip) => {
      const loc = locations.find(
        (l) => l.providerVehicleId === trip.vehicle?.licensePlate,
      );
      return {
        tripId: trip.id,
        vehicleId: trip.vehicleId,
        registration: trip.vehicle?.licensePlate,
        driverName: trip.driver
          ? `${trip.driver.firstName} ${trip.driver.lastName}`
          : 'Unassigned',
        origin: trip.loads[0]?.originCity,
        destination: trip.loads[0]?.destinationCity,
        latitude: loc?.latitude || 0,
        longitude: loc?.longitude || 0,
        speed: loc?.speed || 0,
        heading: loc?.heading || 0,
        lastUpdate: loc?.gpsTimestamp || trip.startDate,
        status: trip.status,
      };
    });

    await this.cache.set(cacheKey, mapData, 2); // 2 second cache TTL to meet GPS refresh < 2 sec target

    return mapData;
  }

  /**
   * Background task to detect geofence and idle violations on incoming telemetry
   */
  async evaluateTelemetryRules(
    companyId: string,
    vehicleId: string,
    latitude: number,
    longitude: number,
    speed: number,
  ) {
    if (speed === 0) {
      // Potentially idle, check cache
      const idleKey = `idle:${vehicleId}`;
      const idleStart = await this.cache.get(idleKey);
      if (!idleStart) {
        await this.cache.set(idleKey, Date.now(), 3600); // Set idle start
      } else {
        const idleDurationMs = Date.now() - (idleStart as number);
        if (idleDurationMs > 15 * 60 * 1000) {
          // 15 minutes
          // Fire idle alert
          await this.eventStore.append({
            tenantId: companyId,
            streamId: vehicleId,
            streamType: 'VEHICLE',
            eventType: 'ExcessiveIdlingDetected',
            payload: {
              durationMinutes: Math.round(idleDurationMs / 60000),
              location: { latitude, longitude },
            },
            userId: 'SYSTEM',
          });
          // clear cache to prevent spam
          await this.cache.delete(idleKey);
        }
      }
    } else {
      // Clear idle cache if moving
      await this.cache.delete(`idle:${vehicleId}`);
    }
  }
}
