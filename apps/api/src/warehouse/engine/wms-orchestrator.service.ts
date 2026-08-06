import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { PrismaService } from '../../prisma/prisma.service';
import { EventStoreService } from '../../platform/digital-twin/event-store.service';
import { LifecycleEngineService } from '../../platform/lifecycle/lifecycle-engine.service';
import { InvoicesService } from '../../invoices/invoices.service';

/**
 * Enterprise Warehouse Management System (WMS) Orchestrator.
 * Event-Driven integration between WMS, Finance, Dispatch, and ELOM.
 */
@Injectable()
export class WmsOrchestratorService {
  private readonly logger = new Logger(WmsOrchestratorService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly eventStore: EventStoreService,
    private readonly lifecycle: LifecycleEngineService,
    private readonly invoicesService: InvoicesService,
  ) {}

  @OnEvent('EventStore.*')
  async handleWmsEvents(payload: any) {
    if (!payload || !payload.eventType) return;

    try {
      switch (payload.eventType) {
        case 'ShipmentDispatched':
          await this.handleShipmentDispatched(
            payload.tenantId,
            payload.streamId,
            payload.userId,
          );
          break;

        case 'InventoryAdjusted':
          // Triggers Finance Journal Entries (Write-offs)
          await this.handleInventoryAdjustment(
            payload.tenantId,
            payload.streamId,
            payload.payload,
            payload.userId,
          );
          break;

        case 'InventoryReceived':
          // Triggers Finance AP Integration for Vendor Billing
          await this.handleInventoryReceived(
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
        `WMS Orchestration Error: [${payload.eventType}] ${errorMessage}`,
      );
    }
  }

  private async handleShipmentDispatched(
    companyId: string,
    shipmentId: string,
    userId: string,
  ) {
    this.logger.log(`WMS: Processing ShipmentDispatched for ${shipmentId}`);

    // Automatically transition the dispatch/load to 'IN_PROGRESS' since it just left the warehouse dock
    // Mock the entity ID mapping here
    const loadId = shipmentId;

    await this.lifecycle.transitionState({
      companyId,
      entityType: 'Load',
      entityId: loadId,
      fromState: 'ALLOCATED',
      toState: 'IN_PROGRESS',
      userId,
      reason: 'WMS Dispatch Confirmation',
    });
  }

  private async handleInventoryAdjustment(
    companyId: string,
    sku: string,
    data: any,
    userId: string,
  ) {
    this.logger.log(`WMS: Processing InventoryAdjustment for ${sku}`);

    // Auto-generate Journal Entries for Inventory Write-Offs
    if (data.reason === 'DAMAGE' || data.reason === 'EXPIRY') {
      await this.eventStore.append({
        tenantId: companyId,
        streamId: sku,
        streamType: 'LEDGER',
        eventType: 'JournalEntryPosted',
        payload: {
          debitAccount: 'INVENTORY_WRITE_OFF_EXPENSE',
          creditAccount: 'INVENTORY_ASSET',
          amount: data.financialValue || 0,
        },
        userId,
      });
    }
  }

  private async handleInventoryReceived(
    companyId: string,
    asnId: string,
    data: any,
    userId: string,
  ) {
    this.logger.log(`WMS: Processing InventoryReceived for ASN ${asnId}`);
    // Generate Vendor Billing / Storage Charges

    // Example: 3PL Storage Billing Trigger
    if (data.is3PL) {
      await this.eventStore.append({
        tenantId: companyId,
        streamId: asnId,
        streamType: 'BILLING',
        eventType: 'StorageChargeAccrued',
        payload: { customerId: data.ownerId, amount: data.volume * 0.5 }, // 50 cents per unit
        userId,
      });
    }
  }
}
