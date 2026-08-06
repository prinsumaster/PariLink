import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { EventStoreService } from '../../platform/digital-twin/event-store.service';

@Injectable()
export class InboundService {
  private readonly logger = new Logger(InboundService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly eventStore: EventStoreService,
  ) {}

  /**
   * Create Advance Shipment Notice (ASN)
   * The ASN links directly to an inbound Load from the TMS
   */
  async createASN(
    companyId: string,
    warehouseId: string,
    data: {
      loadId: string;
      asnNumber: string;
      expectedDate: Date;
      items: { sku: string; expectedQty: number }[];
    },
  ) {
    return this.prisma.$transaction(async (tx) => {
      const receipt = await tx.inboundReceipt.create({
        data: {
          companyId,
          warehouseId,
          loadId: data.loadId,
          asnNumber: data.asnNumber,
          expectedDate: data.expectedDate,
          status: 'EXPECTED',
          items: {
            create: data.items.map((i) => ({
              sku: i.sku,
              expectedQty: i.expectedQty,
            })),
          },
        },
        include: { items: true },
      });

      await this.eventStore.append({
        tenantId: companyId,
        streamType: 'INBOUND_RECEIPT',
        streamId: receipt.id,
        eventType: 'AsnCreated',
        payload: { loadId: data.loadId, expectedDate: data.expectedDate },
        userId: 'SYSTEM',
      });

      return receipt;
    });
  }

  /**
   * Receive goods and automatically put them into a default staging bin
   */
  async receiveGoods(
    companyId: string,
    receiptId: string,
    stagingBinId: string,
    receivedItems: { itemId: string; qty: number; damagedQty: number }[],
    userId: string,
  ) {
    return this.prisma.$transaction(async (tx) => {
      const receipt = await tx.inboundReceipt.findUnique({
        where: { id: receiptId, companyId },
        include: { items: true },
      });

      if (!receipt || receipt.status !== 'EXPECTED') {
        throw new NotFoundException('Valid expected receipt not found');
      }

      for (const rxItem of receivedItems) {
        const itemRec = receipt.items.find((i) => i.id === rxItem.itemId);
        if (itemRec) {
          await tx.inboundReceiptItem.update({
            where: { id: rxItem.itemId },
            data: {
              receivedQty: rxItem.qty,
              damagedQty: rxItem.damagedQty,
            },
          });

          // Create inventory items
          if (rxItem.qty > 0) {
            await tx.inventoryItem.create({
              data: {
                companyId,
                warehouseId: receipt.warehouseId,
                binId: stagingBinId,
                sku: itemRec.sku,
                quantity: rxItem.qty - rxItem.damagedQty,
                status: 'AVAILABLE',
                receivedAt: new Date(),
              },
            });
          }
          if (rxItem.damagedQty > 0) {
            await tx.inventoryItem.create({
              data: {
                companyId,
                warehouseId: receipt.warehouseId,
                binId: stagingBinId,
                sku: itemRec.sku,
                quantity: rxItem.damagedQty,
                status: 'DAMAGED',
                receivedAt: new Date(),
              },
            });
          }
        }
      }

      const updatedReceipt = await tx.inboundReceipt.update({
        where: { id: receiptId },
        data: {
          status: 'RECEIVED',
          actualDate: new Date(),
        },
      });

      await this.eventStore.append({
        tenantId: companyId,
        streamType: 'INBOUND_RECEIPT',
        streamId: receipt.id,
        eventType: 'InventoryReceived',
        payload: { stagingBinId },
        userId,
      });

      return updatedReceipt;
    });
  }
}
