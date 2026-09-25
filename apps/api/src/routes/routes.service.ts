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
   * Explicitly documented placeholder logic.
   * In the absence of a paid Maps API key, this uses a dictionary lookup for major hubs,
   * and falls back to a deterministic pseudo-random hash to generate a realistic distance.
   * Tolls are estimated at a flat rate of ₹2.0 per km.
   */
  private calculateHeuristicRoute(origin: string, destination: string) {
    const key = `${origin.toUpperCase()}:${destination.toUpperCase()}`;
    let distanceKm = this.KNOWN_DISTANCES[key];
    let estimateType = 'EXACT_DICTIONARY';

    if (!distanceKm) {
      // Deterministic heuristic for unknown routes
      const hash = crypto.createHash('md5').update(key).digest('hex');
      const hashInt = parseInt(hash.substring(0, 4), 16); // 0 to 65535
      // Map to 100km - 2500km
      distanceKm = 100 + (hashInt % 2400);
      estimateType = 'HEURISTIC_FALLBACK';
    }

    // Heavy commercial vehicle toll avg ₹2.0 / km
    const estimatedTolls = distanceKm * 2.0;
    
    // Average speed ~50km/h for trucks in India
    const estimatedHours = distanceKm / 50;

    return {
      distanceKm,
      estimatedTolls,
      estimatedHours,
      estimateType
    };
  }

  async getTollEstimate(companyId: string, originCity: string, destinationCity: string) {
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
          estimateType: 'DB_EXACT',
        };
      }

      // Fallback to heuristic
      const heuristic = this.calculateHeuristicRoute(originCity, destinationCity);
      return {
        originCity,
        destinationCity,
        fastagCost: heuristic.estimatedTolls,
        cashCost: heuristic.estimatedTolls * 1.1, // Cash is usually more expensive or no discount
        distanceKm: heuristic.distanceKm,
        estimateType: heuristic.estimateType,
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

  async createRoute(companyId: string, origin: string, destination: string, providedDistance?: number, providedTolls?: number) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      const heuristic = this.calculateHeuristicRoute(origin, destination);
      
      const distance = providedDistance || heuristic.distanceKm;
      const estimatedTolls = providedTolls || heuristic.estimatedTolls;

      return tx.route.create({
        data: {
          companyId,
          origin,
          destination,
          distance,
          estimatedTolls,
        },
      });
    });
  }

  async attachRouteToTrip(companyId: string, tripId: string, routeId: string) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      const route = await tx.route.findFirst({ where: { id: routeId, companyId } });
      if (!route) throw new NotFoundException('Route not found');
      
      const trip = await tx.trip.findFirst({ where: { id: tripId, companyId } });
      if (!trip) throw new NotFoundException('Trip not found');

      return tx.trip.update({
        where: { id: tripId },
        data: { route: JSON.parse(JSON.stringify(route)) }
      });
    });
  }
}
