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

      const mappedData = data.map((inv: any) => ({
        ...inv,
        customerName: inv.customer?.name,
      }));

      return {
        data: mappedData,
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
          payments: { orderBy: { paymentDate: 'desc' } },
        },
      });
      if (!invoice) throw new NotFoundException('Invoice not found');

      const totalPaid = invoice.payments?.reduce((sum, p) => sum + p.amount, 0) || (invoice.status === 'PAID' ? invoice.amount : 0);
      const subtotal = invoice.lineItems?.filter(i => i.type !== 'TAX').reduce((sum, i) => sum + i.amount, 0) || Math.round(invoice.amount / 1.05);
      const taxTotal = invoice.lineItems?.filter(i => i.type === 'TAX').reduce((sum, i) => sum + i.amount, 0) || (invoice.amount - subtotal);
      const balanceDue = invoice.status === 'PAID' ? 0 : Math.max(0, invoice.amount - totalPaid);

      return {
        ...invoice,
        customerName: invoice.customer?.name,
        subtotal,
        taxTotal,
        grandTotal: invoice.amount,
        amountPaid: totalPaid,
        balanceDue,
      };
    });
  }

  async recordPayment(
    companyId: string,
    invoiceId: string,
    payload: { amount: number; method?: string; referenceNumber?: string; paymentDate?: string; notes?: string },
    _userId?: string,
  ) {
    const { amount, method = 'NEFT', referenceNumber, paymentDate = new Date().toISOString(), notes } = payload;
    if (typeof amount !== 'number' || isNaN(amount) || amount <= 0) {
      throw new BadRequestException('Payment amount must be a positive number');
    }

    return this.prisma.runAsTenant(companyId, async (tx) => {
      const invoice = await tx.invoice.findFirst({
        where: { id: invoiceId, companyId },
        include: { payments: true },
      });
      if (!invoice) throw new NotFoundException('Invoice not found');

      const existingPaid = invoice.payments.reduce((sum, p) => sum + p.amount, 0);
      const newTotalPaid = existingPaid + amount;
      const newStatus = newTotalPaid >= invoice.amount ? 'PAID' : 'PARTIAL';

      const payment = await tx.payment.create({
        data: {
          companyId,
          invoiceId,
          amount,
          method,
          referenceNumber: referenceNumber || `PAY-${Date.now()}`,
          paymentDate: new Date(paymentDate),
          notes,
        },
      });

      await tx.invoice.update({
        where: { id: invoiceId },
        data: { status: newStatus },
      });

      // Post double entry journal
      let bankAcct = await tx.account.findFirst({ where: { companyId, code: '1000' } });
      if (!bankAcct) {
        bankAcct = await tx.account.create({ data: { companyId, code: '1000', name: 'HDFC Current Account', type: 'ASSET' } });
      }
      let arAcct = await tx.account.findFirst({ where: { companyId, code: '1200' } });
      if (!arAcct) {
        arAcct = await tx.account.create({ data: { companyId, code: '1200', name: 'Accounts Receivable', type: 'ASSET' } });
      }

      await tx.journalEntry.create({
        data: {
          companyId,
          referenceType: 'PAYMENT',
          referenceId: payment.id,
          description: `Payment of Rs.${amount} received for Invoice ${invoice.invoiceNumber}`,
          status: 'POSTED',
          lines: {
            create: [
              { companyId, accountId: bankAcct.id, debit: amount, credit: 0, description: 'Bank receipt' },
              { companyId, accountId: arAcct.id, debit: 0, credit: amount, description: 'AR reduction' },
            ],
          },
        },
      });

      await this.auditService.logEvent(
        {
          companyId,
          entity: 'Invoice',
          entityType: 'Invoice',
          entityId: invoiceId,
          action: 'RECORD_PAYMENT',
          details: { amount, method, status: newStatus },
          source: 'API',
        },
        null,
        tx,
      );

      return this.getInvoiceById(companyId, invoiceId);
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
