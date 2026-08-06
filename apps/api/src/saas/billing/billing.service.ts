import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { StripeIntegrationService } from './stripe-integration.service';

@Injectable()
export class BillingService {
  private readonly logger = new Logger(BillingService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly stripe: StripeIntegrationService,
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
      customerId = await this.stripe.createCustomer(
        companyId,
        company.email || 'billing@example.com',
        company.name,
      );
      await this.prisma.runAsSystem((tx) =>
        tx.company.update({
          where: { id: companyId },
          data: { stripeCustomerId: customerId },
        }),
      );
    }

    return this.stripe.createCheckoutSession(
      companyId,
      customerId,
      plan.stripePriceId,
      successUrl,
      cancelUrl,
    );
  }

  async handleWebhook(event: any) {
    this.logger.log(`Handling stripe webhook: ${event.type}`);

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const companyId = session.metadata?.companyId;
      const subscriptionId = session.subscription;

      if (companyId && subscriptionId) {
        await this.prisma.runAsSystem((tx) =>
          tx.company.update({
            where: { id: companyId },
            data: { stripeSubscriptionId: subscriptionId as string },
          }),
        );
      }
    }
  }
}
