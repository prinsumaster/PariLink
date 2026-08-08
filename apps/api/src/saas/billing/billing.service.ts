import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { RazorpayService } from '../../integrations/razorpay.service';

@Injectable()
export class BillingService {
  private readonly logger = new Logger(BillingService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly razorpay: RazorpayService,
  ) {}

  async getSubscriptionPlans() {
    return this.prisma.runAsSystem((tx) =>
      tx.subscriptionPlan.findMany({
        orderBy: { price: 'asc' },
      }),
    );
  }

  async getCompanyBillingInfo(companyId: string) {
    const company = await this.prisma.runAsSystem((tx) =>
      tx.company.findUnique({
        where: { id: companyId },
        include: { subscriptionPlan: true },
      }),
    );
    return {
      subscriptionPlan: company?.subscriptionPlan,
      stripeCustomerId: company?.stripeCustomerId,
    };
  }

  async upgradePlan(
    companyId: string,
    planId: string,
    successUrl: string,
    cancelUrl: string,
  ) {
    const company = await this.prisma.runAsSystem((tx) =>
      tx.company.findUnique({ where: { id: companyId } }),
    );

    if (!company) throw new NotFoundException('Company not found');

    const plan = await this.prisma.runAsSystem((tx) =>
      tx.subscriptionPlan.findUnique({ where: { id: planId } }),
    );

    if (!plan || !plan.stripePriceId) {
      throw new NotFoundException(
        'Subscription Plan or Stripe Price ID missing',
      );
    }

    let customerId = company.stripeCustomerId;
    if (!customerId) {
      customerId = 'mock_stripe_cus_' + companyId;
      await this.prisma.runAsSystem((tx) =>
        tx.company.update({
          where: { id: companyId },
          data: { stripeCustomerId: customerId },
        }),
      );
    }

    // Create a razorpay subscription via the new adapter
    return this.razorpay.createSubscription(plan.stripePriceId, customerId, 12);
  }

  async handleWebhook(event: any) {
    this.logger.log(`Handling stripe webhook: ${event.type}`);
    try {
      await this.prisma.runAsSystem(async (tx) => {
        // Idempotency Check: Insert WebhookDelivery using event.id as primary key
        // If the event was already processed, Prisma will throw a P2002 Unique Constraint violation
        await tx.webhookDelivery.create({
          data: {
            id: event.id, // Enforce exact-once processing via DB primary key constraint
            companyId: 'SYSTEM', // Billing webhooks are cross-tenant
            direction: 'INCOMING',
            endpointUrl: '/api/v1/webhooks/stripe',
            eventTopic: event.type,
            payload: event,
            status: 'SUCCESS',
          },
        });

        if (event.type === 'checkout.session.completed') {
          const session = event.data.object;
          const companyId = session.metadata?.companyId;
          const subscriptionId = session.subscription;

          if (companyId && subscriptionId) {
            // Use updateMany to prevent P2025 errors and transaction rollback if companyId is invalid
            await tx.company.updateMany({
              where: { id: companyId },
              data: { stripeSubscriptionId: subscriptionId as string },
            });
          }
        }
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        this.logger.warn(
          `Idempotency Check Failed: Webhook event ${event.id} already processed. Ignoring.`,
        );
        return; // Gracefully acknowledge receipt without duplicate processing
      }
      this.logger.error(
        `Webhook processing failed for event ${event.id}:`,
        error,
      );
      throw error;
    }
  }

  async handleRazorpayWebhook(event: any) {
    this.logger.log(`Handling razorpay webhook: ${event.event}`);
    const uniqueId =
      event.id ||
      require('crypto')
        .createHash('md5')
        .update(JSON.stringify(event))
        .digest('hex');

    try {
      await this.prisma.runAsSystem(async (tx) => {
        // Idempotency Check: Insert WebhookDelivery using uniqueId as primary key
        await tx.webhookDelivery.create({
          data: {
            id: uniqueId,
            companyId: 'SYSTEM',
            direction: 'INCOMING',
            endpointUrl: '/api/v1/webhooks/razorpay',
            eventTopic: event.event,
            payload: event,
            status: 'SUCCESS',
          },
        });

        if (
          event.event === 'subscription.authenticated' ||
          event.event === 'subscription.charged'
        ) {
          const subscription = event.payload.subscription.entity;
          const companyId = subscription.notes?.companyId;
          const subscriptionId = subscription.id;

          if (companyId && subscriptionId) {
            // Use updateMany to prevent P2025 errors and transaction rollback if companyId is invalid
            await tx.company.updateMany({
              where: { id: companyId },
              data: { stripeSubscriptionId: subscriptionId },
            });
          }
        }
      });
    } catch (error: any) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        this.logger.warn(
          `Idempotency Check Failed: Webhook event ${uniqueId} already processed. Ignoring.`,
        );
        return;
      }
      this.logger.error(
        `Webhook processing failed for event ${uniqueId}:`,
        error,
      );
      throw error;
    }
  }
}
