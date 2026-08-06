import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class InventoryOptimizerService {
  private readonly logger = new Logger(InventoryOptimizerService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Run basic ABC Analysis based on historical outbound movement
   * Returns suggested classifications for items
   */
  async runAbcAnalysis(companyId: string, warehouseId: string) {
    // 1. Get all outbound order items for the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const items = await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.outboundOrderItem.findMany({
        where: {
          order: {
            wave: {
              companyId,
              warehouseId,
            },
            status: 'DISPATCHED',
            updatedAt: { gte: thirtyDaysAgo },
          },
        },
      }),
    );

    // 2. Aggregate picked quantities by SKU
    const skuVolume: Record<string, number> = {};
    let totalVolume = 0;

    for (const item of items) {
      if (!skuVolume[item.sku]) skuVolume[item.sku] = 0;
      skuVolume[item.sku] += item.pickedQty;
      totalVolume += item.pickedQty;
    }

    // 3. Sort and assign A, B, C classifications
    const sortedSkus = Object.entries(skuVolume)
      .sort(([, a], [, b]) => b - a)
      .map(([sku, vol]) => ({
        sku,
        volume: vol,
        percentage: (vol / totalVolume) * 100,
      }));

    let cumulativePct = 0;
    return sortedSkus.map((s) => {
      cumulativePct += s.percentage;
      let classification = 'C';
      if (cumulativePct <= 70) classification = 'A';
      else if (cumulativePct <= 90) classification = 'B';

      return { ...s, cumulativePct, classification };
    });
  }

  /**
   * Identify Dead Stock (items not moved in X days)
   */
  async identifyDeadStock(
    companyId: string,
    warehouseId: string,
    thresholdDays: number = 90,
  ) {
    const thresholdDate = new Date();
    thresholdDate.setDate(thresholdDate.getDate() - thresholdDays);

    return this.prisma.runAsTenant(companyId, async (tx) =>
      tx.inventoryItem.findMany({
        where: {
          companyId,
          warehouseId,
          status: 'AVAILABLE',
          updatedAt: { lte: thresholdDate },
        },
      }),
    );
  }
}
