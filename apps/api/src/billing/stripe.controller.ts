import { Controller, Post, Req, Res, Headers, Logger } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { SecretsService } from '../platform/security/secrets/secrets.service';
import type { RawBodyRequest } from '@nestjs/common';
import type { Request } from 'express';
import Stripe from 'stripe';

@ApiTags('Billing')
@Controller('billing/stripe')
export class StripeController {
  private readonly logger = new Logger(StripeController.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly secretsService: SecretsService,
  ) {}

  @Post('webhook')
  async handleWebhook(
    @Req() req: RawBodyRequest<Request>,
    @Res() res: any,
    @Headers('stripe-signature') signature: string,
  ) {
    if (!signature) {
      return res.status(400).send({ error: 'Missing stripe-signature header' });
    }

    const secret = await this.secretsService.retrieveIntegrationSecret(
      'SYSTEM',
      'STRIPE',
      'WEBHOOK_SECRET',
    );
    if (!secret) {
      this.logger.error('Stripe webhook secret not configured');
      return res.status(500).send({ error: 'Webhook secret not configured' });
    }

    const rawBody = req.rawBody;
    if (!rawBody) {
      this.logger.error(
        'Raw body missing. Ensure rawBody: true in NestFactory.',
      );
      return res.status(400).send({ error: 'Raw body missing' });
    }

    let event: Stripe.Event;
    try {
      const stripeApiKey =
        (await this.secretsService.retrieveIntegrationSecret(
          'SYSTEM',
          'STRIPE',
          'API_KEY',
        )) || 'dummy_key';
      const stripe = new Stripe(stripeApiKey, {
        apiVersion: '2025-01-27.acacia' as any,
      });
      event = stripe.webhooks.constructEvent(rawBody, signature, secret);
    } catch (err: any) {
      this.logger.error(`Stripe signature verification failed: ${err.message}`);
      return res.status(400).send({ error: 'Invalid signature' });
    }

    try {
      await this.prisma.runAsSystem(async (tx) => {
        // Enforce Idempotency Lock
        await tx.webhookDelivery.create({
          data: {
            id: event.id || `mock_${Date.now()}_${Math.random()}`,
            companyId: 'SYSTEM',
            direction: 'INCOMING',
            endpointUrl: '/api/v1/billing/stripe/webhook',
            eventTopic: event.type,
            payload: event as any,
            status: 'SUCCESS',
          },
        });

        switch (event.type) {
          case 'invoice.paid':
            this.logger.log('Invoice paid event processed');
            break;
          case 'invoice.payment_failed':
            this.logger.log('Invoice payment failed event processed');
            break;
          case 'customer.subscription.updated':
            this.logger.log('Subscription updated event processed');
            break;
          case 'customer.subscription.deleted':
            this.logger.log('Subscription deleted event processed');
            break;
          default:
            this.logger.warn(`Unhandled Stripe event type: ${event.type}`);
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
        return res.status(200).send({ received: true });
      }
      this.logger.error(
        `Webhook processing failed for event ${event.id}:`,
        error,
      );
      return res.status(500).send({ error: 'Internal Server Error' });
    }

    return res.status(200).send({ received: true });
  }
}
