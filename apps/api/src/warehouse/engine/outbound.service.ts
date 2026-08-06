import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { EventStoreService } from '../../platform/digital-twin/event-store.service';

@Injectable()
export class OutboundService {
  private readonly logger = new Logger(OutboundService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly eventStore: EventStoreService,
  ) {}

  /**
   * Create an Outbound Order linked to a Load
   */
  async createOutboundOrder(
    companyId: string,
    loadId: string,
    orderNumber: string,
    items: { sku: string; requestedQty: number }[],
  ) {
    return this.prisma.runAsTenant(companyId, async (tx) =>
      tx.outboundOrder.create({
        data: {
          loadId,
          orderNumber,
          status: 'PENDING',
          items: {
            create: items.map((i) => ({
              sku: i.sku,
              requestedQty: i.requestedQty,
            })),
          },
        },
        include: { items: true },
      }),
    );
  }

  /**
   * Pick items for an order, reducing available inventory
   */
  async pickOrder(
    companyId: string,
    orderId: string,
    picks: { orderItemId: string; inventoryItemId: string; qty: number }[],
    userId: string,
  ) {
    return this.prisma.$transaction(async (tx) => {
      const order = await tx.outboundOrder.findUnique({
        where: { id: orderId },
        include: { items: true },
      });

      if (
        !order ||
        (order.status !== 'PENDING' && order.status !== 'PICKING')
      ) {
        throw new NotFoundException('Order not valid for picking');
      }

      const inventoryItemIds = picks.map((p) => p.inventoryItemId);
      const inventoryItems = await tx.inventoryItem.findMany({
        where: { id: { in: inventoryItemIds }, companyId },
      });
      const inventoryItemMap = new Map(
        inventoryItems.map((item) => [item.id, item]),
      );

      for (const pick of picks) {
        const invItem = inventoryItemMap.get(pick.inventoryItemId);
        if (
          !invItem ||
          invItem.quantity < pick.qty ||
          invItem.status !== 'AVAILABLE'
        ) {
          throw new BadRequestException(
            `Insufficient inventory for item ${pick.inventoryItemId}`,
          );
        }
      }

      // Execute updates sequentially to safely reuse the single transaction connection and prevent deadlocks
      for (const pick of picks) {
        const invItem = inventoryItemMap.get(pick.inventoryItemId)!;
        // Deduct inventory
        await tx.inventoryItem.update({
          where: { id: pick.inventoryItemId },
          data: { quantity: invItem.quantity - pick.qty },
        });

        // Update picked qty on order
        const orderItem = order.items.find((i) => i.id === pick.orderItemId);
        if (orderItem) {
          await tx.outboundOrderItem.update({
            where: { id: pick.orderItemId },
            data: { pickedQty: orderItem.pickedQty + pick.qty },
          });
        }

        // Emit picking event
        await this.eventStore.append({
          tenantId: companyId,
          streamType: 'INVENTORY',
          streamId: pick.inventoryItemId,
          eventType: 'InventoryPicked',
          payload: { orderId, qty: pick.qty },
          userId,
        });
      }

      const updatedOrder = await tx.outboundOrder.update({
        where: { id: orderId },
        data: { status: 'STAGED' },
        include: { items: true },
      });

      await this.eventStore.append({
        tenantId: companyId,
        streamType: 'OUTBOUND_ORDER',
        streamId: orderId,
        eventType: 'OrderStaged',
        payload: {},
        userId,
      });

      return updatedOrder;
    });
  }

  /**
   * Dispatch the order and confirm loading onto truck
   */
  async dispatchOrder(
    companyId: string,
    orderId: string,
    dockId: string,
    userId: string,
  ) {
    const order = await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.outboundOrder.update({
        where: { id: orderId },
        data: { status: 'DISPATCHED', stagedAtDockId: dockId },
      }),
    );

    await this.eventStore.append({
      tenantId: companyId,
      streamType: 'OUTBOUND_ORDER',
      streamId: orderId,
      eventType: 'OrderDispatched',
      payload: { dockId },
      userId,
    });

    return order;
  }
}
