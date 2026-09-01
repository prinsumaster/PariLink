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

    // Current position comes from VehicleCurrentPosition -- one row per
    // vehicle -- NOT from VehicleLocation history.
    //
    // The previous query was:
    //     vehicleLocation.findMany({ where: { companyId },
    //                                orderBy: { gpsTimestamp: 'desc' },
    //                                take: 500 })
    // which was wrong in two independent ways:
    //
    //  1. CORRECTNESS. History holds one row per ping. At 10,000 trucks
    //     pinging every 2 minutes, 500 rows is about 4 SECONDS of
    //     fleet-wide telemetry -- so the map silently showed only whichever
    //     ~500 trucks pinged most recently and dropped the rest. That breaks
    //     from roughly 600 trucks, well inside a single customer's fleet,
    //     and it fails silently: a short list looks like a quiet day.
    //
    //  2. PERFORMANCE. No index could serve it. The only candidate was
    //     [companyId, vehicleId, gpsTimestamp], and because vehicleId sits
    //     between the equality column and the sort column while being
    //     unconstrained here, Postgres could not walk it in gpsTimestamp
    //     order -- it read every row for the tenant and sorted.
    //
    // Reading current position instead makes the result exact (one row per
    // vehicle, no truncation) and bounded by fleet size rather than by ping
    // volume, so it does not degrade as history grows.
    const locations = await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.vehicleCurrentPosition.findMany({
        where: {
          companyId,
          ...(activeVehiclesIds.length > 0
            ? { OR: [{ vehicleId: { in: activeVehiclesIds } }, { vehicleId: null }] }
            : {}),
        },
      }),
    );

    // Map trips to locations based on vehicle ID mapping (assuming providerVehicleId = vehicle.registrationNumber for simplicity)
    const mapData = activeTrips.map((trip) => {
      // Match by vehicleId or licensePlate
      const loc = locations.find(
        (l) =>
          (l.vehicleId && l.vehicleId === trip.vehicleId) ||
          l.providerVehicleId === trip.vehicle?.licensePlate,
      );
      const isSimulated = loc?.provider === 'DEMO_TELEMETRY';
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
        isSimulated,
      };
    });

    await this.cache.set(cacheKey, mapData, 2); // 2 second cache TTL to meet GPS refresh < 2 sec target

    return mapData;
  }

  /**
   * Returns the last N fixes for a vehicle (for polyline rendering and 10× replay).
   */
  async getVehicleTrail(
    companyId: string,
    vehicleId: string,
    maxPoints = 90,
  ) {
    const locations = await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.vehicleLocation.findMany({
        where: {
          companyId,
          OR: [
            { vehicleId },
            // also match by providerVehicleId = licensePlate (backwards compat)
            { vehicleId: null, providerVehicleId: vehicleId },
          ],
        },
        orderBy: { gpsTimestamp: 'asc' },
        take: maxPoints,
        select: {
          latitude: true,
          longitude: true,
          speed: true,
          heading: true,
          gpsTimestamp: true,
          provider: true,
        },
      }),
    );

    const isSimulated = locations.some((l) => l.provider === 'DEMO_TELEMETRY');
    return { vehicleId, isSimulated, trail: locations };
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
