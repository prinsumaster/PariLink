import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as crypto from 'crypto';

@Injectable()
export class RoutesService {
  constructor(private readonly prisma: PrismaService) {}

  // Basic dictionary of known distances (in km) between major hubs
  private readonly KNOWN_DISTANCES: Record<string, number> = {
    'MUMBAI:PUNE': 150,
    'PUNE:MUMBAI': 150,
    'MUMBAI:DELHI': 1400,
    'DELHI:MUMBAI': 1400,
    'MUMBAI:BANGALORE': 980,
    'BANGALORE:MUMBAI': 980,
    'DELHI:BANGALORE': 2100,
    'BANGALORE:DELHI': 2100,
  };

  /**
   * Geocode a city name using Nominatim (OpenStreetMap).
   * Note: This is a free rate-limited API.
   */
  private async geocodeCity(
    city: string,
  ): Promise<{ lat: number; lon: number } | null> {
    try {
      // Nominatim requires a user agent
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(city + ', India')}&format=json&limit=1`,
        {
          headers: { 'User-Agent': 'PariLink-Enterprise/1.0' },
        },
      );
      if (!res.ok) return null;
      const data = await res.json();
      if (data && data.length > 0) {
        return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) };
      }
      return null;
    } catch (e) {
      return null;
    }
  }

  /**
   * Explicitly documented routing logic using OSRM public demo server.
   * If OSRM or Geocoding fails, it falls back to a deterministic pseudo-random hash.
   * Tolls are estimated at a flat rate of ₹3.0 per km.
   */
  private async calculateRouteInternal(origin: string, destination: string) {
    let distanceKm = 0;
    let distanceSource = 'HEURISTIC_FALLBACK';

    const originCoords = await this.geocodeCity(origin);
    const destCoords = await this.geocodeCity(destination);

    if (originCoords && destCoords) {
      try {
        const osrmUrl = `http://router.project-osrm.org/route/v1/driving/${originCoords.lon},${originCoords.lat};${destCoords.lon},${destCoords.lat}?overview=false`;
        const res = await fetch(osrmUrl);
        if (res.ok) {
          const data = await res.json();
          if (data.routes && data.routes.length > 0) {
            distanceKm = data.routes[0].distance / 1000; // OSRM returns meters
            distanceSource = 'OSRM_PUBLIC';
          }
        }
      } catch (e) {
        // Fallback below
      }
    }

    if (distanceKm === 0) {
      const key = `${origin.toUpperCase()}:${destination.toUpperCase()}`;
      distanceKm = this.KNOWN_DISTANCES[key];
      if (distanceKm) {
        distanceSource = 'EXACT_DICTIONARY';
      } else {
        // Deterministic heuristic for unknown routes
        const hash = crypto.createHash('md5').update(key).digest('hex');
        const hashInt = parseInt(hash.substring(0, 4), 16); // 0 to 65535
        // Map to 100km - 2500km
        distanceKm = 100 + (hashInt % 2400);
      }
    }

    // Heavy commercial vehicle toll avg ₹3.0 / km
    const estimatedTolls = distanceKm * 3.0;

    // Average speed ~50km/h for trucks in India
    const estimatedHours = distanceKm / 50;

    return {
      distanceKm,
      estimatedTolls,
      estimatedHours,
      distanceSource,
      tollEstimateType: 'CALCULATED_AVERAGE',
    };
  }

  async getTollEstimate(
    companyId: string,
    originCity: string,
    destinationCity: string,
  ) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      const dbRoute = await tx.routeTollRate.findFirst({
        where: {
          companyId,
          originCity: { equals: originCity, mode: 'insensitive' },
          destinationCity: { equals: destinationCity, mode: 'insensitive' },
        },
      });

      if (dbRoute) {
        return {
          originCity: dbRoute.originCity,
          destinationCity: dbRoute.destinationCity,
          fastagCost: dbRoute.fastagCost,
          cashCost: dbRoute.cashCost,
          distanceKm: dbRoute.distanceKm,
          distanceSource: 'DB_EXACT',
          tollEstimateType: 'DB_EXACT',
        };
      }

      // Fallback to routing API or heuristic
      const routeData = await this.calculateRouteInternal(
        originCity,
        destinationCity,
      );
      return {
        originCity,
        destinationCity,
        fastagCost: routeData.estimatedTolls,
        cashCost: routeData.estimatedTolls * 1.1, // Cash is usually more expensive or no discount
        distanceKm: routeData.distanceKm,
        distanceSource: routeData.distanceSource,
        tollEstimateType: routeData.tollEstimateType,
      };
    });
  }

  async getRoutes(companyId: string) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      return tx.route.findMany({
        where: { companyId },
        orderBy: { createdAt: 'desc' },
      });
    });
  }

  async createRoute(
    companyId: string,
    origin: string,
    destination: string,
    providedDistance?: number,
    providedTolls?: number,
  ) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      const routeData = await this.calculateRouteInternal(origin, destination);

      const distance = providedDistance || routeData.distanceKm;
      const estimatedTolls = providedTolls || routeData.estimatedTolls;
      const distanceSource = providedDistance
        ? 'USER_PROVIDED'
        : routeData.distanceSource;
      const tollEstimateType = providedTolls
        ? 'USER_PROVIDED'
        : routeData.tollEstimateType;

      return tx.route.create({
        data: {
          companyId,
          origin,
          destination,
          distance,
          estimatedTolls,
          distanceSource,
          tollEstimateType,
        },
      });
    });
  }

  async attachRouteToTrip(companyId: string, tripId: string, routeId: string) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      const route = await tx.route.findFirst({
        where: { id: routeId, companyId },
      });
      if (!route) throw new NotFoundException('Route not found');

      const trip = await tx.trip.findFirst({
        where: { id: tripId, companyId },
      });
      if (!trip) throw new NotFoundException('Trip not found');

      return tx.trip.update({
        where: { id: tripId },
        data: { route: JSON.parse(JSON.stringify(route)) },
      });
    });
  }
}
