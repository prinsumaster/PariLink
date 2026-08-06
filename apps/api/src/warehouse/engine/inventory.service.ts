import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { EventStoreService } from '../../platform/digital-twin/event-store.service';
import { WorkflowService } from '../../workflow/workflow.service';

@Injectable()
export class InventoryService {
  private readonly logger = new Logger(InventoryService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly eventStore: EventStoreService,
    private readonly workflow: WorkflowService,
  ) {}

  /**
   * Adjust inventory quantity and emit an event
   */
  async adjustInventory(
    companyId: string,
    itemId: string,
    adjustmentQty: number,
    reason: string,
  ) {
    return this.prisma.$transaction(async (tx) => {
      const item = await tx.inventoryItem.findUnique({
        where: { id: itemId, companyId },
      });

      if (!item) throw new NotFoundException('Inventory item not found');

      const newQty = item.quantity + adjustmentQty;
      if (newQty < 0) throw new BadRequestException('Insufficient inventory');

      const updated = await tx.inventoryItem.update({
        where: { id: itemId },
        data: { quantity: newQty },
      });

      // Rule Engine Integration
      const ruleResult = await this.workflow.evaluateRules(companyId, {
        entityType: 'INVENTORY',
        trigger: 'INVENTORY_ADJUSTED',
        entityData: { item: updated, adjustmentQty, reason },
      });

      if (ruleResult.triggeredActions.some((a) => a.actionType === 'REJECT')) {
        throw new BadRequestException(
          'Inventory adjustment rejected by business rules.',
        );
      }

      await this.eventStore.append({
        tenantId: companyId,
        streamType: 'INVENTORY',
        streamId: itemId,
        eventType: 'InventoryAdjusted',
        payload: {
          previousQuantity: item.quantity,
          newQuantity: newQty,
          adjustment: adjustmentQty,
          reason,
        },
        userId: 'SYSTEM', // In real app, this should be the user ID
      });

      return updated;
    });
  }

  /**
   * Move inventory to a new bin
   */
  async moveInventory(
    companyId: string,
    itemId: string,
    targetBinId: string,
    userId: string,
  ) {
    return this.prisma.$transaction(async (tx) => {
      const item = await tx.inventoryItem.findUnique({
        where: { id: itemId, companyId },
      });

      if (!item) throw new NotFoundException('Inventory item not found');

      const targetBin = await tx.warehouseBin.findUnique({
        where: { id: targetBinId },
      });

      if (!targetBin || targetBin.status !== 'AVAILABLE') {
        throw new BadRequestException('Target bin is invalid or unavailable');
      }

      const updated = await tx.inventoryItem.update({
        where: { id: itemId },
        data: { binId: targetBinId },
      });

      // Rule Engine Integration
      const ruleResult = await this.workflow.evaluateRules(companyId, {
        entityType: 'INVENTORY',
        trigger: 'INVENTORY_MOVED',
        entityData: { item: updated, targetBinId, userId },
      });

      if (ruleResult.triggeredActions.some((a) => a.actionType === 'REJECT')) {
        throw new BadRequestException(
          'Inventory move rejected by business rules.',
        );
      }

      await this.eventStore.append({
        tenantId: companyId,
        streamType: 'INVENTORY',
        streamId: itemId,
        eventType: 'InventoryMoved',
        payload: {
          previousBinId: item.binId,
          newBinId: targetBinId,
        },
        userId,
      });

      return updated;
    });
  }

  /**
   * Get all inventory for a specific warehouse
   */
  async getWarehouseInventory(companyId: string, warehouseId: string) {
    return this.prisma.runAsTenant(companyId, async (tx) =>
      tx.inventoryItem.findMany({
        where: { companyId, warehouseId },
        include: {
          bin: {
            include: { zone: true },
          },
        },
      }),
    );
  }
}
