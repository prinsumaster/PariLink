import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class OccService {
  constructor(private readonly prisma: PrismaService) {}

  async getFleetTree(companyId: string) {
    const branches = await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.branch.findMany({
        where: { companyId },
        take: 500,
      }),
    );

    const drivers = await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.driver.findMany({
        where: { companyId },
        take: 500,
      }),
    );

    const vehicles = await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.vehicle.findMany({
        where: { companyId },
        take: 500,
      }),
    );

    return {
      branches,
      drivers,
      vehicles,
    };
  }

  async getAnomalies(companyId: string) {
    return this.prisma.runAsTenant(companyId, async (tx) =>
      tx.operationalAnomaly.findMany({
        where: { companyId, status: 'OPEN' },
        orderBy: { createdAt: 'desc' },
        take: 50,
      }),
    );
  }

  async getTimeline(companyId: string) {
    return this.prisma.runAsTenant(companyId, async (tx) =>
      tx.eventTimeline.findMany({
        where: { companyId },
        orderBy: { timestamp: 'desc' },
        take: 100,
      }),
    );
  }
}
