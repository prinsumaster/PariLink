import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../platform/audit/audit.service';
import { EventStoreService } from '../platform/digital-twin/event-store.service';

@Injectable()
export class InvoicesService {
  constructor(
    private prisma: PrismaService,
    private readonly auditService: AuditService,
    private readonly eventStore: EventStoreService,
  ) {}

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

  async createInvoice(companyId: string, payload: any, userId?: string) {
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
      if (
        typeof amount !== 'number' ||
        isNaN(amount) ||
        amount < 0 ||
        !isFinite(amount)
      ) {
        throw new BadRequestException('Invalid invoice amount');
      }

      const customer = await tx.customer.findFirst({
        where: { id: customerId, companyId },
      });
      if (!customer)
        throw new NotFoundException('Customer not found or unauthorized');

      if (loadId) {
        const load = await tx.load.findFirst({
          where: { id: loadId, companyId },
        });
        if (!load)
          throw new NotFoundException('Load not found or unauthorized');
      }

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
        const validatedLineItems = lineItems.map((item: any) => {
          const qty = item.quantity || 1;
          const unitPrice = item.unitPrice;
          if (
            typeof qty !== 'number' ||
            isNaN(qty) ||
            qty <= 0 ||
            !isFinite(qty)
          ) {
            throw new BadRequestException('Invalid line item quantity');
          }
          if (
            typeof unitPrice !== 'number' ||
            isNaN(unitPrice) ||
            unitPrice < 0 ||
            !isFinite(unitPrice)
          ) {
            throw new BadRequestException('Invalid line item unit price');
          }
          return {
            invoiceId: invoice.id,
            description: item.description,
            quantity: qty,
            unitPrice: unitPrice,
            amount: qty * unitPrice,
            type: item.type || 'LINE_HAUL',
          };
        });
        await tx.invoiceLineItem.createMany({
          data: validatedLineItems,
        });
      }

      const newInvoice = await tx.invoice.findUnique({
        where: { id: invoice.id },
        include: { lineItems: true },
      });

      await this.auditService.logEvent(
        {
          companyId,
          entity: 'Invoice',
          entityType: 'Invoice',
          entityId: invoice.id,
          action: 'CREATE',
          details: { invoiceNumber, amount },
          source: 'API',
        },
        null,
        tx,
      );

      await this.eventStore.append({
        tenantId: companyId,
        streamType: 'INVOICE',
        streamId: invoice.id,
        eventType: 'InvoiceCreated',
        payload: { invoiceNumber, amount, customerId },
        userId,
      });

      return newInvoice;
    });
  }

  async updateInvoiceStatus(
    companyId: string,
    id: string,
    status: string,
    userId?: string,
  ) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      // Verify invoice belongs to this company before updating (prevents IDOR)
      const existing = await tx.invoice.findFirst({
        where: { id, companyId },
      });
      if (!existing) throw new NotFoundException('Invoice not found');

      if (existing.status === 'PAID' && status !== 'PAID') {
        throw new ConflictException('Cannot transition away from PAID status');
      }
      if (existing.status === 'CANCELLED') {
        throw new ConflictException(
          'Cannot transition away from CANCELLED status',
        );
      }

      const updated = await tx.invoice.update({
        where: { id: existing.id },
        data: { status },
      });

      await this.auditService.logEvent(
        {
          companyId,
          entity: 'Invoice',
          entityType: 'Invoice',
          entityId: id,
          action: 'UPDATE_STATUS',
          beforeValue: { status: existing.status },
          afterValue: { status },
          source: 'API',
        },
        null,
        tx,
      );

      await this.eventStore.append({
        tenantId: companyId,
        streamType: 'INVOICE',
        streamId: id,
        eventType: 'InvoiceStatusUpdated',
        payload: { oldStatus: existing.status, newStatus: status },
        userId,
      });

      return updated;
    });
  }
}
