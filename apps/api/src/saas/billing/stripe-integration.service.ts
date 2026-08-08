import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import Stripe from 'stripe';
import { PrismaService } from '../../prisma/prisma.service';
import { SecretsService } from '../../platform/security/secrets/secrets.service';

@Injectable()
export class StripeIntegrationService {
  private readonly logger = new Logger(StripeIntegrationService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly secretsService: SecretsService,
  ) {}

  private async getClient(): Promise<Stripe> {
    const key = await this.secretsService.retrieveIntegrationSecret(
      'SYSTEM',
      'STRIPE',
      'SECRET_KEY',
    );
    if (!key) throw new Error('STRIPE_SECRET_KEY missing from SecretsService');
    return new Stripe(key, {
      apiVersion: '2025-01-27.acacia' as any,
    });
  }

  async createCustomer(companyId: string, email: string, name: string) {
    const stripe = await this.getClient();
    const customer = await stripe.customers.create({
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
    const stripe = await this.getClient();
    const session = await stripe.checkout.sessions.create({
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

  async constructEvent(
    payload: string | Buffer,
    signature: string,
  ): Promise<Stripe.Event> {
    const stripe = await this.getClient();
    const secret = await this.secretsService.retrieveIntegrationSecret(
      'SYSTEM',
      'STRIPE',
      'WEBHOOK_SECRET',
    );
    if (!secret)
      throw new Error('STRIPE_WEBHOOK_SECRET missing from SecretsService');
    return stripe.webhooks.constructEvent(payload, signature, secret);
  }
}
