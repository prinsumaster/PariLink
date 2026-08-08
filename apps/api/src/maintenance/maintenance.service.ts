import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
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

    return this.prisma.runAsTenant(companyId, async (tx) => {
      const vehicle = await tx.vehicle.findFirst({
        where: { id: vehicleId, companyId },
      });
      if (!vehicle)
        throw new NotFoundException('Vehicle not found or unauthorized');

      let totalCost = 0;
      for (const item of data.items) {
        if (
          typeof item.cost !== 'number' ||
          isNaN(item.cost) ||
          item.cost < 0 ||
          !isFinite(item.cost)
        ) {
          throw new BadRequestException('Invalid item cost');
        }
        totalCost += item.cost;
      }

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
    return this.prisma.runAsTenant(companyId, async (tx) => {
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
    return this.prisma.runAsTenant(companyId, async (tx) => {
      const workOrder = await tx.workOrder.findFirst({
        where: { id: workOrderId, companyId },
      });
      if (!workOrder) throw new NotFoundException('WorkOrder not found');
      if (workOrder.status === 'COMPLETED') {
        throw new ConflictException('WorkOrder is already completed');
      }

      await tx.workOrder.updateMany({
        where: { id: workOrderId, companyId, status: { not: 'COMPLETED' } },
        data: {
          status: 'COMPLETED',
          completedDate: new Date(),
        },
      });

      return tx.workOrder.findFirst({ where: { id: workOrderId } });
    });
  }
}
