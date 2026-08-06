import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { PrismaService } from '../../prisma/prisma.service';
import { EventStoreService } from '../../platform/digital-twin/event-store.service';
import { LifecycleEngineService } from '../../platform/lifecycle/lifecycle-engine.service';
import { InvoicesService } from '../../invoices/invoices.service';

/**
 * Enterprise Logistics Operating Model (ELOM) Orchestrator.
 * Subscribes to cross-domain events and orchestrates automated business processes.
 */
@Injectable()
export class ElomOrchestratorService {
  private readonly logger = new Logger(ElomOrchestratorService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly eventStore: EventStoreService,
    private readonly lifecycle: LifecycleEngineService,
    private readonly invoicesService: InvoicesService,
  ) {}

  /**
   * Listen for Trip Completion -> Automatically generate Invoice
   */
  @OnEvent('EventStore.*')
  async handleGlobalEvents(payload: any) {
    if (!payload || !payload.eventType) return;

    try {
      switch (payload.eventType) {
        case 'LifecycleStateChangedToCOMPLETED':
          if (payload.streamType === 'TRIP') {
            await this.handleTripCompleted(
              payload.tenantId,
              payload.streamId,
              payload.userId,
            );
          }
          break;

        case 'InvoiceGenerated':
          // Auto-approve or schedule for payment depending on rules
          await this.handleInvoiceGenerated(
            payload.tenantId,
            payload.streamId,
            payload.userId,
          );
          break;

        case 'PaymentReceived':
          await this.handlePaymentReceived(
            payload.tenantId,
            payload.streamId,
            payload.userId,
          );
          break;

        case 'SettlementCompleted':
          this.logger.log(
            `ELOM: Settlement ${payload.streamId} completed. Pushing to external Accounting ledger.`,
          );
          // Stub: Call accounting integration (ERP)
          break;

        case 'VehicleYardEntry':
          // Trigger Dock Scheduling or Maintenance check
          await this.handleYardEntry(
            payload.tenantId,
            payload.streamId,
            payload.payload,
            payload.userId,
          );
          break;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      this.logger.error(
        `ELOM Orchestration failed for event ${payload.eventType} on ${payload.streamType} ${payload.streamId}: ${errorMessage}`,
      );
    }
  }

  private async handleTripCompleted(
    companyId: string,
    tripId: string,
    userId: string,
  ) {
    this.logger.log(
      `ELOM Orchestrating Post-Trip workflows for Trip ${tripId}`,
    );

    const trip = await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.trip.findUnique({
        where: { id: tripId },
        include: { loads: true },
      }),
    );

    if (!trip || !trip.loads.length) return;

    // 1. Transition all associated Loads to DELIVERED / COMPLETED
    for (const load of trip.loads) {
      await this.lifecycle.transitionState({
        companyId,
        entityType: 'Load',
        entityId: load.id,
        fromState: load.status,
        toState: 'COMPLETED',
        userId,
        reason: `Auto-completed due to Trip ${trip.tripNumber} completion`,
      });

      // 2. Automatically generate an invoice for each load (Billing Integration)
      // Assuming InvoicesService has a createInvoice method for loads
      try {
        const invoice = await this.invoicesService.createInvoice(companyId, {
          customerId: load.customerId,
          loadId: load.id,
          amount: trip.fuelExpenses ? trip.fuelExpenses * 1.2 : 500, // Dummy pricing engine hook
          dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Net 30
          invoiceNumber: `INV-${Date.now()}`,
        });

        if (invoice) {
          await this.eventStore.append({
            tenantId: companyId,
            streamId: invoice.id,
            streamType: 'INVOICE',
            eventType: 'InvoiceGenerated',
            payload: { loadId: load.id, amount: invoice.amount },
            userId,
          });
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        this.logger.warn(
          `Failed to auto-generate invoice for load ${load.id}: ${errorMessage}`,
        );
      }
    }
  }

  private async handleInvoiceGenerated(
    companyId: string,
    invoiceId: string,
    userId: string,
  ) {
    this.logger.log(`ELOM Auto-processing new Invoice ${invoiceId}`);
    // Transition invoice from DRAFT -> PENDING_APPROVAL automatically based on rules
    await this.lifecycle.transitionState({
      companyId,
      entityType: 'Invoice',
      entityId: invoiceId,
      fromState: 'DRAFT',
      toState: 'PENDING_APPROVAL',
      userId,
      reason: 'ELOM Auto-routing for financial approval',
    });
  }

  private async handlePaymentReceived(
    companyId: string,
    invoiceId: string,
    userId: string,
  ) {
    this.logger.log(
      `ELOM: Payment received for invoice ${invoiceId}, initiating settlement.`,
    );
    // Automatically transition to Settlement if payment is complete
    await this.eventStore.append({
      tenantId: companyId,
      streamId: invoiceId,
      streamType: 'SETTLEMENT',
      eventType: 'SettlementCompleted',
      payload: { invoiceId, status: 'PAID' },
      userId,
    });
  }

  private async handleYardEntry(
    companyId: string,
    vehicleId: string,
    data: any,
    userId: string,
  ) {
    this.logger.log(
      `ELOM: Vehicle ${vehicleId} entered Yard. Checking pending maintenance.`,
    );
    // In a full implementation, check if the vehicle is scheduled for maintenance and route to the shop.
    // E.g., transition vehicle state to 'MAINTENANCE' if due.
  }
}
