import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class WarehouseMasterService {
  private readonly logger = new Logger(WarehouseMasterService.name);

  constructor(private readonly prisma: PrismaService) {}

  async getWarehouses(companyId: string) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      const warehouses = await tx.warehouse.findMany({
        where: { companyId },
      });
      return { data: warehouses, total: warehouses.length };
    });
  }

  /**
   * Create a new warehouse facility
   */
  async createWarehouse(companyId: string, data: any) {
    return this.prisma.runAsTenant(companyId, async (tx) =>
      tx.warehouse.create({
        data: {
          ...data,
          companyId,
        },
      }),
    );
  }

  /**
   * Add a zone to a warehouse
   */
  async createZone(warehouseId: string, data: any) {
    return this.prisma.runAsSystem(async (tx) =>
      tx.warehouseZone.create({
        data: {
          ...data,
          warehouseId,
        },
      }),
    );
  }

  /**
   * Add a storage bin to a zone
   */
  async createBin(zoneId: string, data: any) {
    return this.prisma.runAsSystem(async (tx) =>
      tx.warehouseBin.create({
        data: {
          ...data,
          zoneId,
        },
      }),
    );
  }

  /**
   * Get full warehouse topology (Warehouse -> Zones -> Bins)
   */
  async getTopology(warehouseId: string, companyId: string) {
    const warehouse = await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.warehouse.findUnique({
        where: { id: warehouseId, companyId },
        include: {
          zones: {
            include: {
              bins: true,
            },
          },
        },
      }),
    );

    if (!warehouse) throw new NotFoundException('Warehouse not found');
    return warehouse;
  }
}
