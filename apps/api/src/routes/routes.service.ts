import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RoutesService {
  constructor(private readonly prisma: PrismaService) {}

  async getTollEstimate(companyId: string, originCity: string, destinationCity: string) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      // NOTE: No real FASTag external API integration exists yet.
      // We rely on a seeded static toll-rate table for the interim.
      const route = await tx.routeTollRate.findFirst({
        where: {
          companyId,
          originCity,
          destinationCity,
        },
      });

      if (!route) {
        throw new NotFoundException(`Toll data missing for route: ${originCity} to ${destinationCity}`);
      }

      return {
        originCity: route.originCity,
        destinationCity: route.destinationCity,
        fastagCost: route.fastagCost,
        cashCost: route.cashCost,
        distanceKm: route.distanceKm,
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

  async createRoute(companyId: string, origin: string, destination: string, distance?: number, estimatedTolls?: number) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      return tx.route.create({
        data: {
          companyId,
          origin,
          destination,
          distance: distance || 1000,
          estimatedTolls: estimatedTolls || 50,
        },
      });
    });
  }
}
