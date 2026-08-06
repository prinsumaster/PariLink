import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { LogLocationDto } from './dto/log-location.dto';

@Injectable()
export class TrackingService {
  constructor(private prisma: PrismaService) {}

  async getLiveTracking(companyId: string) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      const activeTrips = await tx.trip.findMany({
        where: {
          companyId,
          status: { in: ['IN_PROGRESS', 'DISPATCHED'] },
        },
        include: {
          driver: true,
          vehicle: true,
          loads: {
            include: { customer: true },
          },
        },
      });

      const tripIds = activeTrips.map((t) => t.id);

      let latestLocations: any[] = [];
      if (tripIds.length > 0) {
        latestLocations = await tx.$queryRaw<any[]>`
          SELECT DISTINCT ON ("companyId", "tripId") * FROM "LocationHistory" 
          WHERE "companyId" = ${companyId} AND "tripId" = ANY(${tripIds}) 
          ORDER BY "companyId", "tripId", "timestamp" DESC
        `;
      }

      const locationMap = new Map(
        latestLocations.map((loc) => [loc.tripId, loc]),
      );

      const trackingData = activeTrips.map((trip) => {
        const lastLocation = locationMap.get(trip.id);

        return {
          tripId: trip.id,
          tripNumber: trip.tripNumber,
          status: trip.status,
          driver: trip.driver
            ? {
                id: trip.driver.id,
                name: `${trip.driver.firstName} ${trip.driver.lastName}`,
                phone: trip.driver.phone,
              }
            : null,
          vehicle: trip.vehicle
            ? { id: trip.vehicle.id, licensePlate: trip.vehicle.licensePlate }
            : null,
          loads: trip.loads.map((l) => ({
            id: l.id,
            referenceNumber: l.referenceNumber,
            origin: `${l.originCity}, ${l.originState}`,
            destination: `${l.destinationCity}, ${l.destinationState}`,
          })),
          lastLocation: lastLocation
            ? {
                latitude: lastLocation.latitude,
                longitude: lastLocation.longitude,
                speed: lastLocation.speed,
                heading: lastLocation.heading,
                timestamp: lastLocation.timestamp,
              }
            : null,
        };
      });

      return {
        activeVehiclesCount: activeTrips.length,
        trackingData,
      };
    });
  }

  async logLocation(companyId: string, logLocationDto: LogLocationDto) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      const locations = logLocationDto.locations.map((loc) => ({
        ...loc,
        companyId,
        timestamp: loc.timestamp ? new Date(loc.timestamp) : new Date(),
      }));

      await tx.locationHistory.createMany({
        data: locations,
        skipDuplicates: true, // In case of retry
      });

      return { success: true, count: locations.length };
    });
  }
}
