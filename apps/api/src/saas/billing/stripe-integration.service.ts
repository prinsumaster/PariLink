import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import Stripe from 'stripe';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class StripeIntegrationService {
  private readonly logger = new Logger(StripeIntegrationService.name);
  private stripe: Stripe;

  constructor(private readonly prisma: PrismaService) {
    if (!process.env.STRIPE_SECRET_KEY)
      throw new Error('STRIPE_SECRET_KEY missing');
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-01-27.acacia' as any,
    });
  }

  async createCustomer(companyId: string, email: string, name: string) {
    const customer = await this.stripe.customers.create({
      email,
      name,
      metadata: { companyId },
    });

    return customer.id;
  }

  async createCheckoutSession(
    companyId: string,
    stripeCustomerId: string,
    stripePriceId: string,
    successUrl: string,
    cancelUrl: string,
  ) {
    const session = await this.stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: stripePriceId,
          quantity: 1,
        },
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        companyId,
      },
    });

    return { url: session.url };
  }

  constructEvent(payload: string | Buffer, signature: string): Stripe.Event {
    const secret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!secret) throw new Error('STRIPE_WEBHOOK_SECRET missing');
    return this.stripe.webhooks.constructEvent(payload, signature, secret);
  }
}
