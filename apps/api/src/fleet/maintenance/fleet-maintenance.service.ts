import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class FleetMaintenanceService {
  private readonly logger = new Logger(FleetMaintenanceService.name);

  constructor(private prisma: PrismaService) {}

  async getUpcomingMaintenance(companyId: string) {
    return await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.workOrder.findMany({
        where: {
          vehicle: { companyId },
          status: 'SCHEDULED',
        },
        include: {
          vehicle: { select: { licensePlate: true } },
        },
        orderBy: { scheduledDate: 'asc' },
        take: 20,
      }),
    );
  }

  async reportBreakdown(
    companyId: string,
    vehicleId: string,
    description: string,
  ) {
    return await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.workOrder.create({
        data: {
          companyId,
          vehicleId,
          type: 'BREAKDOWN',
          scheduledDate: new Date(),
          totalCost: 0,
          status: 'SCHEDULED',
          items: {
            create: [{ description, cost: 0 }],
          },
        },
      }),
    );
  }
}
