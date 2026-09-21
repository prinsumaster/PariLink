import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class WarehouseMasterService {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
  async createZone(companyId: string, warehouseId: string, data: any) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      // First verify the warehouse belongs to the tenant
      const warehouse = await tx.warehouse.findUnique({
        where: { id: warehouseId, companyId },
      });
      if (!warehouse) throw new NotFoundException('Warehouse not found');

      return tx.warehouseZone.create({
        data: {
          ...data,
          warehouseId,
        },
      });
    });
  }

  /**
   * Add a storage bin to a zone
   */
  async createBin(companyId: string, zoneId: string, data: any) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      // First verify the zone belongs to a warehouse of the tenant
      const zone = await tx.warehouseZone.findFirst({
        where: { 
          id: zoneId, 
          warehouse: { companyId },
        },
      });
      if (!zone) throw new NotFoundException('Zone not found');

      return tx.warehouseBin.create({
        data: {
          ...data,
          zoneId,
        },
      });
    });
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
