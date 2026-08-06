import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class FleetIntelligenceService {
  private readonly logger = new Logger(FleetIntelligenceService.name);

  constructor(private readonly prisma: PrismaService) {}

  async getKpis(companyId: string) {
    this.logger.log(`Fetching Fleet AI KPIs for company: ${companyId}`);

    // In a real application, this might query an OLAP database or calculate aggregations dynamically
    // Here we fetch the latest snapshot for the executive dashboard
    const latestSnapshot = await this.prisma.runAsTenant(
      companyId,
      async (tx) =>
        tx.fleetKpiSnapshot.findFirst({
          where: { companyId },
          orderBy: { timestamp: 'desc' },
        }),
    );

    if (!latestSnapshot) {
      return {
        utilizationRate: 0,
        costPerKm: 0,
        idleVehicles: 0,
        timestamp: new Date(),
      };
    }

    return latestSnapshot;
  }
}
