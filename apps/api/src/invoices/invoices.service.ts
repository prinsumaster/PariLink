import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class InvoicesService {
  constructor(private prisma: PrismaService) {}

  async getInvoices(
    companyId: string,
    page = 1,
    limit = 50,
    sort = 'createdAt',
    order: 'asc' | 'desc' = 'desc',
  ) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      const skip = (page - 1) * limit;
      const where = { companyId };

      const [data, total] = await Promise.all([
        tx.invoice.findMany({
          where,
          orderBy: { [sort]: order },
          skip,
          take: limit,
          include: {
            customer: { select: { id: true, name: true } },
            load: { select: { id: true, referenceNumber: true } },
          },
        }),
        tx.invoice.count({ where }),
      ]);

      return {
        data,
        total,
        meta: {
          total,
          page,
          limit,
          lastPage: Math.ceil(total / limit) || 1,
        },
      };
    });
  }

  async getInvoiceById(companyId: string, id: string) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      const invoice = await tx.invoice.findFirst({
        where: { id, companyId },
        include: {
          customer: true,
          load: true,
          lineItems: true,
        },
      });
      if (!invoice) throw new NotFoundException('Invoice not found');
      return invoice;
    });
  }

  async createInvoice(companyId: string, payload: any) {
    const {
      customerId,
      loadId,
      invoiceNumber,
      amount,
      dueDate,
      notes,
      lineItems,
    } = payload;

    return this.prisma.runAsTenant(companyId, async (tx) => {
      const invoice = await tx.invoice.create({
        data: {
          companyId,
          customerId,
          loadId,
          invoiceNumber,
          amount,
          dueDate: dueDate ? new Date(dueDate) : null,
          notes,
          status: 'DRAFT',
        },
      });

      if (lineItems && lineItems.length > 0) {
        await tx.invoiceLineItem.createMany({
          data: lineItems.map((item: any) => ({
            invoiceId: invoice.id,
            description: item.description,
            quantity: item.quantity || 1,
            unitPrice: item.unitPrice,
            amount: (item.quantity || 1) * item.unitPrice,
            type: item.type || 'LINE_HAUL',
          })),
        });
      }

      return tx.invoice.findUnique({
        where: { id: invoice.id },
        include: { lineItems: true },
      });
    });
  }

  async updateInvoiceStatus(companyId: string, id: string, status: string) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      // Verify invoice belongs to this company before updating (prevents IDOR)
      const existing = await tx.invoice.findFirst({
        where: { id, companyId },
      });
      if (!existing) throw new NotFoundException('Invoice not found');

      return tx.invoice.update({
        where: { id },
        data: { status },
      });
    });
  }
}
