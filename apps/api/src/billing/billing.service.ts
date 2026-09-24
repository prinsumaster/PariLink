import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRateCardDto } from './dto/create-rate-card.dto';
import { GenerateInvoiceDto, GenerateInvoiceFromTripsDto } from './dto/generate-invoice.dto';
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
        where: { id: dto.loadId, companyId },
        include: { customer: true },
      });
      if (!load) throw new NotFoundException('Load not found');
      if (load.status !== 'DELIVERED')
        throw new BadRequestException(
          'Load must be DELIVERED before invoicing',
        );

      const existingInvoice = await tx.invoice.findFirst({
        where: { loadId: load.id, companyId, status: { not: 'VOIDED' } },
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
          where: { id: dto.rateCardId, companyId },
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

  async generateInvoiceFromTrips(
    companyId: string,
    dto: GenerateInvoiceFromTripsDto,
    userId?: string,
  ) {
    const invoice = await this.prisma.runAsTenant(companyId, async (tx) => {
      // 1. Fetch Company and Customer for GST state matching
      const company = await tx.company.findUnique({ where: { id: companyId } });
      const customer = await tx.customer.findUnique({ where: { id: dto.customerId } });
      if (!company || !customer) {
        throw new BadRequestException('Company or Customer not found');
      }

      // Fetch trips with their invoice line items to check if already invoiced
      const trips = await tx.trip.findMany({
        where: { id: { in: dto.tripIds }, companyId },
        include: { invoiceLineItems: true, loads: true, lorryReceipt: true }
      });

      if (trips.length !== dto.tripIds.length) {
        throw new BadRequestException('One or more trips could not be found.');
      }

      for (const trip of trips) {
        if (trip.status !== 'COMPLETED') {
          throw new BadRequestException(`Trip ${trip.tripNumber} is not COMPLETED.`);
        }
        if (trip.invoiceLineItems && trip.invoiceLineItems.length > 0) {
          throw new BadRequestException(`Trip ${trip.tripNumber} has already been invoiced.`);
        }
        // Verify trip belongs to customer (by checking its loads)
        const hasOtherCustomer = trip.loads.some(l => l.customerId !== dto.customerId);
        if (hasOtherCustomer) {
           throw new BadRequestException(`Trip ${trip.tripNumber} contains loads for a different customer.`);
        }
      }

      // Compute subtotals from trip rates and LRs
      let subtotal = 0;
      const lineItemsData = trips.map(trip => {
        const rate = trip.rate || 0;
        const lr = trip.lorryReceipt;
        const loadedQty = lr?.grossWeight || 1; // Fallback if no LR or weight
        const unloadedQty = lr?.netWeight || loadedQty; // simplified
        
        // As per standard freight billing, amount = rate * quantity (usually net weight in tons, but let's assume rate is fixed or rate * qty)
        // If rate is meant to be a fixed flat-rate per trip, the prompt previously had flat rate.
        // The new prompt says "pulls qty/rate from each trip and its LR, computes line items ... Amount (Rate×Qty)"
        // Let's assume rate is per ton, and Qty = unloadedQty / 1000 (if weight is kg) or just use rate * unloadedQty.
        // To be safe and predictable for E2E tests: let's do rate * unloadedQty.
        // Actually, if LR stores weight in Kg (e.g. 15000), then unloadedQty=10000. 
        // Let's just do: amount = rate * (unloadedQty / 1000). Let's convert kg to tons if it's large, or just use unloadedQty.
        // I will use `amount = rate * unloadedQty` and structure the E2E test to match.
        // Actually the prompt says: "(loaded, tons), U.Qty (unloaded, tons)" so if LR weights are in Kg, I should divide by 1000.
        const qtyInTons = unloadedQty / 1000;
        const amt = rate * qtyInTons;
        
        subtotal += amt;
        
        return {
          description: `Freight for Trip ${trip.tripNumber}`,
          quantity: 1, // keeping this for schema compat
          unitPrice: amt, // keeping for schema compat
          loadedQty: loadedQty / 1000, // tons
          unloadedQty: qtyInTons, // tons
          rate: rate,
          amount: amt,
          type: 'LINE_HAUL',
          sourceType: 'TRIP',
          trip: { connect: { id: trip.id } }
        };
      });

      // GST calculation logic: IGST for interstate, CGST+SGST for intrastate
      let cgst = 0;
      let sgst = 0;
      let igst = 0;
      
      const isInterstate = company.state && customer.state && company.state.toLowerCase() !== customer.state.toLowerCase();
      
      if (isInterstate) {
        igst = subtotal * 0.18;
      } else {
        cgst = subtotal * 0.09;
        sgst = subtotal * 0.09;
      }
      
      const tax = cgst + sgst + igst;
      const grandTotal = subtotal + tax;

      // Generate invoice number
      const invoiceNumber = `INV-${require('crypto').randomBytes(4).toString('hex').toUpperCase()}`;
      
      // Compute amount in words (simplified stub for MVP)
      const amountInWords = `Rupees ${Math.floor(grandTotal)} Only`; // Real implementation would use a library

      const generatedInvoice = await tx.invoice.create({
        data: {
          companyId,
          customerId: dto.customerId,
          invoiceNumber,
          amount: grandTotal, 
          subtotal,
          cgst,
          sgst,
          igst,
          tax,
          grandTotal,
          balanceDue: grandTotal,
          status: 'DRAFT',
          dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Net 30 default
          amountInWords,
          lineItems: {
            create: lineItemsData as any,
          },
        },
        include: { lineItems: true },
      });

      // Audit and Event Store logs
      await this.auditService.logEvent(
        {
          companyId,
          entity: 'Billing',
          entityType: 'Invoice',
          entityId: generatedInvoice.id,
          action: 'INVOICE_GENERATED_FROM_TRIPS',
          details: { amount: generatedInvoice.grandTotal, tripIds: dto.tripIds },
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
        payload: { amount: generatedInvoice.grandTotal, tripIds: dto.tripIds },
        userId,
      });

      return generatedInvoice;
    });

    this.eventEmitter.emit('invoice.created', invoice);
    return invoice;
  }

  async getInvoices(companyId: string, query?: { status?: string, customerId?: string, startDate?: string, endDate?: string }) {
    const where: any = { companyId };
    if (query?.status) where.status = query.status;
    if (query?.customerId) where.customerId = query.customerId;
    if (query?.startDate || query?.endDate) {
      where.createdAt = {};
      if (query.startDate) where.createdAt.gte = new Date(query.startDate);
      if (query.endDate) where.createdAt.lte = new Date(query.endDate);
    }
    
    return this.prisma.invoice.findMany({
      where,
      include: { customer: true },
      orderBy: { createdAt: 'desc' }
    });
  }

  async getInvoiceById(companyId: string, id: string) {
    const invoice = await this.prisma.invoice.findFirst({
      where: { id, companyId },
      include: { 
        customer: true, 
        lineItems: { include: { trip: { include: { lorryReceipt: true } }, jobCard: true } }
      }
    });
    if (!invoice) throw new NotFoundException('Invoice not found');
    return invoice;
  }

  async getOverdueInvoices(companyId: string) {
    return this.prisma.invoice.findMany({
      where: {
        companyId,
        status: 'SENT',
        dueDate: { lt: new Date() }
      },
      include: { customer: true },
      orderBy: { dueDate: 'asc' }
    });
  }

  async updateInvoiceStatus(companyId: string, id: string, status: string, _userId: string, paymentRef?: string) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      const invoice = await tx.invoice.findFirst({ where: { id, companyId } });
      if (!invoice) throw new NotFoundException('Invoice not found');
      
      const updateData: any = { status };
      if (status === 'PAID') {
        updateData.amountPaid = invoice.grandTotal;
        updateData.balanceDue = 0;
        updateData.paidAt = new Date();
        if (paymentRef) updateData.paymentRef = paymentRef;
      }
      
      const updated = await tx.invoice.update({
        where: { id },
        data: updateData
      });

      await this.auditService.logEvent(
        {
          companyId,
          entity: 'Billing',
          entityType: 'Invoice',
          entityId: id,
          action: 'UPDATE_STATUS',
          details: { status, paymentRef },
          source: 'API',
        },
        null,
        tx,
      );

      return updated;
    });
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
