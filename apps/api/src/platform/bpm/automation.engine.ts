import { Injectable, Logger } from '@nestjs/common';
import { LifecycleEngineService } from '../lifecycle/lifecycle-engine.service';
import { InvoicesService } from '../../invoices/invoices.service';
import { EventStoreService } from '../digital-twin/event-store.service';
import { BusinessRuleEngineService } from '../runtime/business-rule-engine.service';

/**
 * Automates cross-domain system tasks triggered by the Process Engine.
 */
@Injectable()
export class AutomationEngine {
  private readonly logger = new Logger(AutomationEngine.name);

  constructor(
    private readonly lifecycle: LifecycleEngineService,
    private readonly invoices: InvoicesService,
    private readonly eventStore: EventStoreService,
    private readonly rules: BusinessRuleEngineService,
  ) {}

  async executeSystemTask(
    companyId: string,
    actionType: string,
    variables: Record<string, unknown>,
  ): Promise<Record<string, unknown>> {
    this.logger.log(`Executing System Task: ${actionType}`);

    switch (actionType) {
      case 'DISPATCH_VEHICLE':
        // Integrates with ELOM / Dispatch
        await this.lifecycle.transitionState({
          companyId,
          entityType: 'Trip',
          entityId: variables.tripId as string,
          fromState: 'ALLOCATED',
          toState: 'IN_PROGRESS',
          userId: 'SYSTEM_AUTOMATION',
          reason: 'BPM Automated Dispatch',
        });
        return { dispatchStatus: 'SUCCESS' };

      case 'EVALUATE_CREDIT_LIMIT':
        // Integrate with Business Rules Engine
        const isApproved = await this.rules.evaluateRules({
          companyId,
          entityType: 'CREDIT_APPROVAL',
          payload: {
            customerId: variables.customerId,
            amount: variables.amount,
          },
        });
        return { creditApproved: isApproved };

      case 'GENERATE_INVOICE':
        // Integrate with Finance Platform
        const invoice = await this.invoices.createInvoice(companyId, {
          customerId: variables.customerId,
          loadId: variables.loadId,
          amount: variables.amount,
          dueDate: new Date(Date.now() + 30 * 24 * 3600 * 1000), // Net 30
          invoiceNumber: `INV-${Date.now()}`,
        });
        return { invoiceId: invoice?.id };

      case 'SEND_NOTIFICATION':
        // Simulate sending Email/SMS/WhatsApp via Event Platform
        await this.eventStore.append({
          tenantId: companyId,
          streamId: (variables.targetUserId || variables.customerId) as string,
          streamType: 'COMMUNICATION',
          eventType: 'NotificationDispatched',
          payload: { channel: variables.channel, message: variables.message },
          userId: 'SYSTEM',
        });
        return { notificationSent: true };

      default:
        this.logger.warn(`Unknown System Task Action: ${actionType}`);
        return {};
    }
  }
}
