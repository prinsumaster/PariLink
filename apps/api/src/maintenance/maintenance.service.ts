import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MaintenanceService {
  private readonly logger = new Logger(MaintenanceService.name);

  constructor(private readonly prisma: PrismaService) {}

  async createWorkOrder(
    companyId: string,
    vehicleId: string,
    data: {
      type: string;
      scheduledDate: Date;
      items: { description: string; cost: number }[];
    },
  ) {
    this.logger.log(`Creating ${data.type} WorkOrder for vehicle ${vehicleId}`);

    return this.prisma.runAsTenant(companyId, async (tx: any) => {
      let totalCost = 0;
      data.items.forEach((item) => (totalCost += item.cost));

      return tx.workOrder.create({
        data: {
          companyId,
          vehicleId,
          type: data.type,
          scheduledDate: data.scheduledDate,
          totalCost,
          items: {
            create: data.items.map((item) => ({
              description: item.description,
              cost: item.cost,
            })),
          },
        },
        include: { items: true },
      });
    });
  }

  async getWorkOrders(companyId: string, vehicleId?: string) {
    return this.prisma.runAsTenant(companyId, async (tx: any) => {
      const where: any = { companyId };
      if (vehicleId) where.vehicleId = vehicleId;

      return tx.workOrder.findMany({
        where,
        include: { items: true },
        orderBy: { scheduledDate: 'desc' },
      });
    });
  }

  async completeWorkOrder(companyId: string, workOrderId: string) {
    return this.prisma.runAsTenant(companyId, async (tx: any) => {
      return tx.workOrder.update({
        where: { id: workOrderId, companyId },
        data: {
          status: 'COMPLETED',
          completedDate: new Date(),
        },
      });
    });
  }
}
