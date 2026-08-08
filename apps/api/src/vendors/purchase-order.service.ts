// @ts-nocheck
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PurchaseOrderService {
  constructor(private readonly prisma: PrismaService) {}

  async createPurchaseOrder(companyId: string, data: any) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      let totalAmount = 0;
      if (data.items && Array.isArray(data.items)) {
        totalAmount = data.items.reduce(
          (sum: number, item: any) => sum + item.quantity * item.unitPrice,
          0,
        );
      }

      return tx.purchaseOrder.create({
        data: {
          companyId,
          vendorId: data.vendorId,
          poNumber: data.poNumber,
          date: new Date(data.date),
          expectedDate: data.expectedDate
            ? new Date(data.expectedDate)
            : undefined,
          status: 'DRAFT',
          totalAmount,
          notes: data.notes,
          items: {
            create: (data.items || []).map((item: any) => ({
              companyId,
              description: item.description,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              totalPrice: item.quantity * item.unitPrice,
            })),
          },
        },
        include: { items: true },
      });
    });
  }

  async getPurchaseOrders(companyId: string, status?: string) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      const where: any = { companyId };
      if (status) where.status = status;
      return tx.purchaseOrder.findMany({
        where,
        include: { vendor: true },
        orderBy: { date: 'desc' },
      });
    });
  }

  async receivePurchaseOrderItems(
    companyId: string,
    poId: string,
    receivedItems: any[],
  ) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      const po = await tx.purchaseOrder.findUnique({
        where: { id: poId, companyId },
        include: { items: true },
      });

      if (!po) throw new NotFoundException('Purchase order not found');

      let allReceived = true;
      let anyReceived = false;

      for (const reqItem of receivedItems) {
        const item = po.items.find((i) => i.id === reqItem.itemId);
        if (item) {
          const newReceivedQty = item.receivedQty + reqItem.quantity;
          await tx.purchaseOrderItem.update({
            where: { id: item.id },
            data: { receivedQty: newReceivedQty },
          });

          if (newReceivedQty > 0) anyReceived = true;
          if (newReceivedQty < item.quantity) allReceived = false;
        }
      }

      // Check remaining items to determine status
      const updatedPoItems = await tx.purchaseOrderItem.findMany({
        where: { purchaseOrderId: poId },
      });
      const fullyReceived = updatedPoItems.every(
        (i) => i.receivedQty >= i.quantity,
      );

      const newStatus = fullyReceived
        ? 'RECEIVED'
        : anyReceived
          ? 'PARTIAL_RECEIVED'
          : po.status;

      return tx.purchaseOrder.update({
        where: { id: poId },
        data: { status: newStatus },
        include: { items: true },
      });
    });
  }
}
