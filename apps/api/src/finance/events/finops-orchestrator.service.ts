import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { PrismaService } from '../../prisma/prisma.service';
import { PricingEngine } from '../pricing/pricing.engine';
import { SettlementEngine } from '../settlements/settlement.engine';
import { EventStoreService } from '../../platform/digital-twin/event-store.service';
import { InvoicesService } from '../../invoices/invoices.service';

/**
 * Enterprise Financial Operating Platform (FinOps) Orchestrator.
 * Event-Driven Finance Controller.
 */
@Injectable()
export class FinOpsOrchestratorService {
  private readonly logger = new Logger(FinOpsOrchestratorService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly pricingEngine: PricingEngine,
    private readonly settlementEngine: SettlementEngine,
    private readonly eventStore: EventStoreService,
    private readonly invoicesService: InvoicesService,
  ) {}

  @OnEvent('EventStore.*')
  async handleFinancialEvents(payload: any) {
    if (!payload || !payload.eventType) return;

    try {
      switch (payload.eventType) {
        // Operational Events Triggering Finance
        case 'LifecycleStateChangedToCOMPLETED':
          if (payload.streamType === 'TRIP') {
            await this.handleTripCompleted(
              payload.tenantId,
              payload.streamId,
              payload.userId,
            );
          }
          break;
        case 'PODUploaded':
          // POD Triggers final billing
          await this.handlePodUploaded(
            payload.tenantId,
            payload.streamId,
            payload.userId,
          );
          break;
        case 'PaymentReceived':
          // Auto-reconcile AR and settle AP
          await this.handlePaymentReceived(
            payload.tenantId,
            payload.streamId,
            payload.userId,
          );
          break;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      this.logger.error(
        `FinOps Orchestration Error: [${payload.eventType}] ${errorMessage}`,
      );
    }
  }

  private async handleTripCompleted(
    companyId: string,
    tripId: string,
    userId: string,
  ) {
    this.logger.log(`FinOps: Processing TripCompleted for ${tripId}`);

    // Auto-generate Driver Settlement
    const trip = await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.trip.findUnique({
        where: { id: tripId },
        include: { vehicle: true },
      }),
    );
    if (trip && trip.driverId) {
      await this.settlementEngine.generateSettlement({
        companyId,
        driverId: trip.driverId,
        tripIds: [tripId],
        advances: trip.fuelExpenses || 0,
      });

      await this.eventStore.append({
        tenantId: companyId,
        streamId: tripId,
        streamType: 'TRIP_FINANCE',
        eventType: 'SettlementAccrued',
        payload: { driverId: trip.driverId },
        userId,
      });
    }
  }

  private async handlePodUploaded(
    companyId: string,
    loadId: string,
    userId: string,
  ) {
    this.logger.log(`FinOps: Processing PODUploaded for Load ${loadId}`);

    // Call Pricing Engine
    const load = await (this.prisma as any).load.findUnique({
      where: { id: loadId },
    });
    if (!load) return;

    const pricing = await this.pricingEngine.calculatePrice({
      companyId,
      customerId: load.customerId,
      weightKg: load.weight,
      volumeM3: load.volume,
    });

    // Create Invoice with calculated price
    const invoice = await this.invoicesService.createInvoice(companyId, {
      customerId: load.customerId,
      loadId: load.id,
      amount: pricing.totalAmount,
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Net 30
      invoiceNumber: `INV-FINOPS-${Date.now()}`,
    });

    if (invoice) {
      await this.eventStore.append({
        tenantId: companyId,
        streamId: invoice.id,
        streamType: 'INVOICE',
        eventType: 'InvoiceGenerated',
        payload: { amount: pricing.totalAmount, breakdown: pricing },
        userId,
      });
    }
  }

  private async handlePaymentReceived(
    companyId: string,
    invoiceId: string,
    userId: string,
  ) {
    this.logger.log(
      `FinOps: Posting General Ledger Entries for Payment on Invoice ${invoiceId}`,
    );

    // Simulate GL Postings (Accounts Receivable Credit, Cash Debit)
    await this.eventStore.append({
      tenantId: companyId,
      streamId: invoiceId,
      streamType: 'LEDGER',
      eventType: 'JournalEntryPosted',
      payload: {
        debitAccount: 'CASH',
        creditAccount: 'ACCOUNTS_RECEIVABLE',
        reference: invoiceId,
      },
      userId,
    });
  }
}
