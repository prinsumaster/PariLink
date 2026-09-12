import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

// ---------------------------------------------------------------------------
// Cause definitions
// ---------------------------------------------------------------------------
export type RootCause = 'DRIVER' | 'MECHANICAL' | 'ROUTE' | 'INVESTIGATE' | 'INSUFFICIENT_DATA' | 'NORMAL';

export interface RootCauseEntry {
  fuelEntryId: string;
  tripId: string;
  driverId: string;
  driverName: string;
  vehicleId: string;
  licensePlate: string;
  routeKey: string | null;
  litres: number;
  expectedLitres: number | null;
  variancePct: number | null;
  rootCause: RootCause;
  confidence: 'HIGH' | 'LOW';
  comparisonGroupSize: number;
  explanation: string;
}

@Injectable()
export class FuelIntelligenceService {
  constructor(private readonly prisma: PrismaService) {}

  // ---------------------------------------------------------------------------
  // Existing anomaly feed (unchanged)
  // ---------------------------------------------------------------------------
  async getAnomalies(companyId: string) {
    return this.prisma.runAsTenant(companyId, async (tx: any) => {
      const recentDate = new Date();
      recentDate.setDate(recentDate.getDate() - 30);

      const entries = await tx.fuelEntry.findMany({
        where: { companyId, filledAt: { gte: recentDate } },
        include: {
          vehicle: { select: { id: true, licensePlate: true, type: true } },
          driver: { select: { id: true, firstName: true, lastName: true } },
          trip: { select: { id: true, tripNumber: true } },
        },
      });

      const anomalies: any[] = [];

      entries.forEach((entry: any) => {
        if (entry.variancePct > 25) {
          anomalies.push({
            entityType: 'TRIP',
            entityId: entry.tripId,
            entityName: `Trip ${entry.trip?.tripNumber || 'Unknown'}`,
            variancePct: Number(entry.variancePct.toFixed(1)),
            cause: 'INVESTIGATE',
            description: `Trip ${entry.trip?.tripNumber} used ${entry.variancePct.toFixed(1)}% over expected fuel.`,
            severity: 'HIGH',
          });
        }
      });

      const truckMap = new Map<string, { name: string; variances: number[]; drivers: Set<string> }>();
      const driverMap = new Map<string, { name: string; variances: number[]; trucks: Set<string> }>();

      entries.forEach((entry: any) => {
        if (!entry.vehicleId || !entry.driverId) return;

        if (!truckMap.has(entry.vehicleId)) {
          truckMap.set(entry.vehicleId, {
            name: entry.vehicle?.licensePlate || entry.vehicleId,
            variances: [],
            drivers: new Set(),
          });
        }
        truckMap.get(entry.vehicleId)!.variances.push(entry.variancePct);
        truckMap.get(entry.vehicleId)!.drivers.add(entry.driverId);

        if (!driverMap.has(entry.driverId)) {
          driverMap.set(entry.driverId, {
            name: `${entry.driver?.firstName || ''} ${entry.driver?.lastName || ''}`.trim() || entry.driverId,
            variances: [],
            trucks: new Set(),
          });
        }
        driverMap.get(entry.driverId)!.variances.push(entry.variancePct);
        driverMap.get(entry.driverId)!.trucks.add(entry.vehicleId);
      });

      truckMap.forEach((data, vehicleId) => {
        const avgVariance =
          data.variances.reduce((a: number, b: number) => a + b, 0) / data.variances.length;
        if (avgVariance > 15 && data.drivers.size > 0) {
          anomalies.push({
            entityType: 'TRUCK',
            entityId: vehicleId,
            entityName: data.name,
            variancePct: Number(avgVariance.toFixed(1)),
            cause: 'MECHANICAL',
            description: `Truck ${data.name} used ${avgVariance.toFixed(1)}% over expected across ${data.variances.length} trips (different drivers). Likely mechanical.`,
            severity: avgVariance > 25 ? 'HIGH' : 'MEDIUM',
          });
        }
      });

      driverMap.forEach((data, driverId) => {
        const avgVariance =
          data.variances.reduce((a: number, b: number) => a + b, 0) / data.variances.length;
        if (avgVariance > 15 && data.trucks.size > 0) {
          anomalies.push({
            entityType: 'DRIVER',
            entityId: driverId,
            entityName: data.name,
            variancePct: Number(avgVariance.toFixed(1)),
            cause: 'DRIVER PILFERAGE',
            description: `Driver ${data.name} used ${avgVariance.toFixed(1)}% over expected across ${data.variances.length} trips. Potential pilferage.`,
            severity: avgVariance > 25 ? 'HIGH' : 'MEDIUM',
          });
        }
      });

      anomalies.sort((a: any, b: any) => b.variancePct - a.variancePct);
      return anomalies;
    });
  }

  async getSummary(companyId: string) {
    const anomalies = await this.getAnomalies(companyId);
    return {
      worstTrucks: anomalies.filter((a: any) => a.entityType === 'TRUCK').slice(0, 5),
      worstDrivers: anomalies.filter((a: any) => a.entityType === 'DRIVER').slice(0, 5),
      criticalTrips: anomalies.filter((a: any) => a.entityType === 'TRIP').slice(0, 5),
      totalAnomalies: anomalies.length,
    };
  }

  // ---------------------------------------------------------------------------
  // NEW: Root-cause attribution engine
  //
  // Isolation logic:
  //   DRIVER    → same (vehicleId + routeKey), different driverIds, ≥2 entries
  //               Entry with highest variance in that group = DRIVER behaviour
  //   MECHANICAL→ same (driverId + routeKey), different vehicleIds, ≥2 entries
  //               Vehicle with consistently higher variance = MECHANICAL issue
  //   ROUTE     → same (driverId + vehicleId), different routeKeys, ≥2 entries
  //               Route with higher variance = ROUTE difficulty
  //   INVESTIGATE→ variance >15% but only 1 entry in every comparison group
  //   INSUFFICIENT_DATA → <15% variance AND no comparison group to confirm
  // ---------------------------------------------------------------------------
  async getRootCause(companyId: string): Promise<RootCauseEntry[]> {
    return this.prisma.runAsTenant(companyId, async (tx: any) => {
      const entries = await tx.fuelEntry.findMany({
        where: { companyId },
        include: {
          vehicle: { select: { id: true, licensePlate: true } },
          driver: { select: { id: true, firstName: true, lastName: true } },
        },
        orderBy: { filledAt: 'desc' },
      });

      if (entries.length === 0) return [];

      // Build lookup indexes for fast group access
      // key = vehicleId:routeKey  -> [entries]
      const byVehicleRoute = new Map<string, any[]>();
      // key = driverId:routeKey   -> [entries]
      const byDriverRoute = new Map<string, any[]>();
      // key = driverId:vehicleId  -> [entries]
      const byDriverVehicle = new Map<string, any[]>();

      for (const e of entries) {
        const routeKey = e.originCity && e.destinationCity
          ? `${e.originCity}:${e.destinationCity}`
          : null;

        const vk = `${e.vehicleId}:${routeKey ?? 'UNKNOWN_ROUTE'}`;
        const dk = `${e.driverId}:${routeKey ?? 'UNKNOWN_ROUTE'}`;
        const dvk = `${e.driverId}:${e.vehicleId}`;

        if (!byVehicleRoute.has(vk)) byVehicleRoute.set(vk, []);
        byVehicleRoute.get(vk)!.push(e);

        if (!byDriverRoute.has(dk)) byDriverRoute.set(dk, []);
        byDriverRoute.get(dk)!.push(e);

        if (!byDriverVehicle.has(dvk)) byDriverVehicle.set(dvk, []);
        byDriverVehicle.get(dvk)!.push(e);
      }

      const results: RootCauseEntry[] = entries.map((e: any) => {
        const routeKey = e.originCity && e.destinationCity
          ? `${e.originCity}:${e.destinationCity}`
          : null;

        const driverName =
          `${e.driver?.firstName ?? ''} ${e.driver?.lastName ?? ''}`.trim() || e.driverId;
        const licensePlate = e.vehicle?.licensePlate || e.vehicleId;
        const variancePct = e.variancePct ?? null;

        // Check isolation groups
        const vk = `${e.vehicleId}:${routeKey ?? 'UNKNOWN_ROUTE'}`;
        const dk = `${e.driverId}:${routeKey ?? 'UNKNOWN_ROUTE'}`;
        const dvk = `${e.driverId}:${e.vehicleId}`;

        const vehicleRouteGroup = byVehicleRoute.get(vk)!;
        const driverRouteGroup = byDriverRoute.get(dk)!;
        const driverVehicleGroup = byDriverVehicle.get(dvk)!;

        const uniqueDriversOnVehicleRoute = new Set(vehicleRouteGroup.map((x: any) => x.driverId));
        const uniqueVehiclesOnDriverRoute = new Set(driverRouteGroup.map((x: any) => x.vehicleId));
        const uniqueRoutesForDriverVehicle = new Set(
          driverVehicleGroup
            .filter((x: any) => x.originCity && x.destinationCity)
            .map((x: any) => `${x.originCity}:${x.destinationCity}`),
        );

        // ── DRIVER isolation: same vehicle+route, multiple drivers
        if (uniqueDriversOnVehicleRoute.size >= 2 && routeKey) {
          const groupVariances = vehicleRouteGroup.map((x: any) => x.variancePct ?? 0);
          const avgGroupVariance =
            groupVariances.reduce((a: number, b: number) => a + b, 0) / groupVariances.length;
          const eVariance = variancePct ?? 0;
          const isHighDriver = eVariance > avgGroupVariance + 5;

          return {
            fuelEntryId: e.id,
            tripId: e.tripId,
            driverId: e.driverId,
            driverName,
            vehicleId: e.vehicleId,
            licensePlate,
            routeKey,
            litres: e.litres,
            expectedLitres: e.expectedLitres,
            variancePct,
            rootCause: isHighDriver ? 'DRIVER' : 'NORMAL',
            confidence: 'HIGH',
            comparisonGroupSize: vehicleRouteGroup.length,
            explanation: isHighDriver
              ? `Driver ${driverName} used ${eVariance.toFixed(1)}% variance vs group avg ${avgGroupVariance.toFixed(1)}% on route ${routeKey} with vehicle ${licensePlate}. Same vehicle, same route, different driver — behaviour isolated.`
              : `On route ${routeKey} with ${licensePlate}, ${uniqueDriversOnVehicleRoute.size} drivers. ${driverName}'s variance (${eVariance.toFixed(1)}%) is within normal group range (avg ${avgGroupVariance.toFixed(1)}%).`,
          } as RootCauseEntry;
        }

        // ── MECHANICAL isolation: same driver+route, multiple vehicles
        if (uniqueVehiclesOnDriverRoute.size >= 2 && routeKey) {
          const groupVariances = driverRouteGroup.map((x: any) => x.variancePct ?? 0);
          const avgGroupVariance =
            groupVariances.reduce((a: number, b: number) => a + b, 0) / groupVariances.length;
          const eVariance = variancePct ?? 0;
          const isHighMechanical = eVariance > avgGroupVariance + 5;

          return {
            fuelEntryId: e.id,
            tripId: e.tripId,
            driverId: e.driverId,
            driverName,
            vehicleId: e.vehicleId,
            licensePlate,
            routeKey,
            litres: e.litres,
            expectedLitres: e.expectedLitres,
            variancePct,
            rootCause: isHighMechanical ? 'MECHANICAL' : 'NORMAL',
            confidence: 'HIGH',
            comparisonGroupSize: driverRouteGroup.length,
            explanation: isHighMechanical
              ? `Vehicle ${licensePlate} used ${eVariance.toFixed(1)}% variance vs group avg ${avgGroupVariance.toFixed(1)}%. Same driver, same route, different vehicle — mechanical issue isolated.`
              : `Driver ${driverName} on route ${routeKey} drove ${uniqueVehiclesOnDriverRoute.size} vehicles. ${licensePlate}'s variance (${eVariance.toFixed(1)}%) within normal range.`,
          } as RootCauseEntry;
        }

        // ── ROUTE isolation: same driver+vehicle, multiple routes
        if (uniqueRoutesForDriverVehicle.size >= 2 && routeKey) {
          const groupVariances = driverVehicleGroup.map((x: any) => x.variancePct ?? 0);
          const avgGroupVariance =
            groupVariances.reduce((a: number, b: number) => a + b, 0) / groupVariances.length;
          const eVariance = variancePct ?? 0;
          const isHighRoute = eVariance > avgGroupVariance + 5;

          return {
            fuelEntryId: e.id,
            tripId: e.tripId,
            driverId: e.driverId,
            driverName,
            vehicleId: e.vehicleId,
            licensePlate,
            routeKey,
            litres: e.litres,
            expectedLitres: e.expectedLitres,
            variancePct,
            rootCause: isHighRoute ? 'ROUTE' : 'NORMAL',
            confidence: 'HIGH',
            comparisonGroupSize: driverVehicleGroup.length,
            explanation: isHighRoute
              ? `Route ${routeKey} shows ${eVariance.toFixed(1)}% variance vs this driver+vehicle avg of ${avgGroupVariance.toFixed(1)}%. Same driver, same vehicle, different route — route difficulty isolated.`
              : `Driver ${driverName} + ${licensePlate} across ${uniqueRoutesForDriverVehicle.size} routes. Route ${routeKey} variance (${eVariance.toFixed(1)}%) within normal range.`,
          } as RootCauseEntry;
        }

        // ── INSUFFICIENT_DATA: only 1 entry in every comparison group
        const hasHighVariance = (variancePct ?? 0) > 15;
        return {
          fuelEntryId: e.id,
          tripId: e.tripId,
          driverId: e.driverId,
          driverName,
          vehicleId: e.vehicleId,
          licensePlate,
          routeKey,
          litres: e.litres,
          expectedLitres: e.expectedLitres,
          variancePct,
          rootCause: hasHighVariance ? 'INVESTIGATE' : 'INSUFFICIENT_DATA',
          confidence: 'LOW',
          comparisonGroupSize: 1,
          explanation: hasHighVariance
            ? `Variance of ${(variancePct ?? 0).toFixed(1)}% is above 15% threshold but no comparison group exists to isolate cause. More trips on this vehicle/driver/route combination needed.`
            : `Only 1 data point for this vehicle+route+driver combination. Cannot isolate cause without a comparison group.`,
        } as RootCauseEntry;
      });

      // Sort: highest variance first, then by cause specificity
      const causePriority: Record<RootCause, number> = {
        DRIVER: 0,
        MECHANICAL: 1,
        ROUTE: 2,
        INVESTIGATE: 3,
        INSUFFICIENT_DATA: 4,
        NORMAL: 5,
      };
      results.sort((a, b) => {
        if (a.rootCause !== b.rootCause) {
          return causePriority[a.rootCause] - causePriority[b.rootCause];
        }
        return (b.variancePct ?? 0) - (a.variancePct ?? 0);
      });

      return results;
    });
  }
}
