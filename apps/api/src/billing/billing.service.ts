import { Prisma } from '@prisma/client';
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRateCardDto } from './dto/create-rate-card.dto';
import { GenerateInvoiceDto } from './dto/generate-invoice.dto';
import * as crypto from 'crypto';
import { WorkflowService } from '../workflow/workflow.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { AuditService } from '../platform/audit/audit.service';
import { EventStoreService } from '../platform/digital-twin/event-store.service';

@Injectable()
export class BillingService {
  constructor(
    private prisma: PrismaService,
    private workflow: WorkflowService,
    private eventEmitter: EventEmitter2,
    private auditService: AuditService,
    private readonly eventStore: EventStoreService,
  ) {}

  async createRateCard(
    companyId: string,
    dto: CreateRateCardDto,
    userId?: string,
  ) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      const rateCard = await tx.rateCard.create({
        data: {
          companyId,
          ...dto,
        },
      });

      await this.auditService.logEvent(
        {
          companyId,
          entity: 'Billing',
          entityType: 'RateCard',
          entityId: rateCard.id,
          action: 'CREATE',
          details: { customerId: dto.customerId, type: dto.type },
          source: 'API',
        },
        null,
        tx,
      );

      await this.eventStore.append({
        tenantId: companyId,
        streamType: 'RATE_CARD',
        streamId: rateCard.id,
        eventType: 'RateCardCreated',
        payload: { customerId: dto.customerId, type: dto.type },
        userId,
      });

      return rateCard;
    });
  }

  async getRateCards(companyId: string, customerId?: string) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      const where: any = { active: true };
      if (customerId) where.customerId = customerId;
      return tx.rateCard.findMany({ where, include: { customer: true } });
    });
  }

  async generateInvoice(
    companyId: string,
    dto: GenerateInvoiceDto,
    userId?: string,
  ) {
    const invoice = await this.prisma.runAsTenant(companyId, async (tx) => {
      const load = await tx.load.findFirst({
        where: { id: dto.loadId },
        include: { customer: true },
      });
      if (!load) throw new NotFoundException('Load not found');
      if (load.status !== 'DELIVERED')
        throw new BadRequestException(
          'Load must be DELIVERED before invoicing',
        );

      const existingInvoice = await tx.invoice.findFirst({
        where: { loadId: load.id, status: { not: 'VOIDED' } },
      });

      if (existingInvoice) {
        throw new BadRequestException(
          'An active invoice already exists for this load',
        );
      }

      let amount = dto.manualAmount || load.rate;
      let rateCard = null;

      if (dto.rateCardId) {
        rateCard = await tx.rateCard.findFirst({
          where: { id: dto.rateCardId },
        });
        if (rateCard) {
          if (rateCard.type === 'FLAT' || rateCard.type === 'ROUTE')
            amount = rateCard.rate;
          if (rateCard.type === 'DISTANCE')
            amount = rateCard.rate * (load.weight || 1);
          amount +=
            (rateCard.fuelSurcharge || 0) + (rateCard.tollSurcharge || 0);
        }
      }

      const invoiceNumber = `INV-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;

      const generatedInvoice = await tx.invoice.create({
        data: {
          companyId,
          customerId: load.customerId,
          loadId: load.id,
          invoiceNumber,
          amount,
          status: 'DRAFT',
          dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Net 30 default
          lineItems: {
            create: [
              {
                description: `Freight for Load ${load.referenceNumber}`,
                quantity: 1,
                unitPrice: amount,
                amount: amount,
                type: 'LINE_HAUL',
              },
            ],
          },
        },
        include: { lineItems: true },
      });

      // Rule Engine Integration
      const ruleResult = await this.workflow.evaluateRules(companyId, {
        entityType: 'INVOICE',
        trigger: 'INVOICE_GENERATED',
        entityData: generatedInvoice,
      });

      if (ruleResult.triggeredActions.some((a) => a.actionType === 'REJECT')) {
        throw new BadRequestException(
          'Invoice generation rejected by business rules.',
        );
      }

      await this.auditService.logEvent(
        {
          companyId,
          entity: 'Billing',
          entityType: 'Invoice',
          entityId: generatedInvoice.id,
          action: 'INVOICE_GENERATED',
          details: { amount: generatedInvoice.amount },
          source: 'BILLING_SERVICE',
        },
        null,
        tx,
      );

      await this.eventStore.append({
        tenantId: companyId,
        streamType: 'INVOICE',
        streamId: generatedInvoice.id,
        eventType: 'InvoiceGenerated',
        payload: { amount: generatedInvoice.amount, loadId: load.id },
        userId,
      });

      return generatedInvoice;
    });

    this.eventEmitter.emit('invoice.created', invoice);

    return invoice;
  }

  async approveInvoice(companyId: string, invoiceId: string, userId?: string) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      const invoice = await tx.invoice.findFirst({
        where: { id: invoiceId, companyId },
        include: { customer: true },
      });
      if (!invoice) throw new NotFoundException('Invoice not found');
      if (invoice.status !== 'DRAFT')
        throw new BadRequestException('Only DRAFT invoices can be approved');

      // Rule Engine Integration
      const ruleResult = await this.workflow.evaluateRules(companyId, {
        entityType: 'INVOICE',
        trigger: 'INVOICE_APPROVAL',
        entityData: invoice,
      });

      if (ruleResult.triggeredActions.some((a) => a.actionType === 'REJECT')) {
        throw new BadRequestException(
          'Invoice approval rejected by business rules.',
        );
      }

      const approvedInvoice = await tx.invoice.updateMany({
        where: { id: invoiceId, companyId, status: 'DRAFT' },
        data: { status: 'SENT' },
      });

      if (approvedInvoice.count === 0) {
        throw new BadRequestException(
          'Invoice is not in DRAFT status or already approved',
        );
      }

      // LEDGER INTEGRATION (Double Entry)
      const arAccount = await tx.account.upsert({
        where: { companyId_code: { companyId, code: '1200' } },
        update: {},
        create: {
          companyId,
          name: 'Accounts Receivable',
          code: '1200',
          type: 'ASSET',
        },
      });

      const revAccount = await tx.account.upsert({
        where: { companyId_code: { companyId, code: '4000' } },
        update: {},
        create: {
          companyId,
          name: 'Freight Revenue',
          code: '4000',
          type: 'REVENUE',
        },
      });

      await tx.journalEntry.create({
        data: {
          companyId,
          referenceType: 'INVOICE',
          referenceId: invoice.id,
          description: `Invoice ${invoice.invoiceNumber} for ${invoice.customer.name}`,
          status: 'POSTED',
          lines: {
            create: [
              {
                companyId,
                accountId: arAccount.id,
                debit: invoice.amount,
                credit: 0,
                description: 'AR',
              },
              {
                companyId,
                accountId: revAccount.id,
                debit: 0,
                credit: invoice.amount,
                description: 'Revenue',
              },
            ],
          },
        },
      });

      await this.auditService.logEvent(
        {
          companyId,
          entity: 'Billing',
          entityType: 'Invoice',
          entityId: invoice.id,
          action: 'APPROVE',
          details: { invoiceNumber: invoice.invoiceNumber },
          source: 'API',
        },
        null,
        tx,
      );

      await this.eventStore.append({
        tenantId: companyId,
        streamType: 'INVOICE',
        streamId: invoice.id,
        eventType: 'InvoiceApproved',
        payload: { invoiceNumber: invoice.invoiceNumber },
        userId,
      });

      return { ...invoice, status: 'SENT' };
    });
  }
}
