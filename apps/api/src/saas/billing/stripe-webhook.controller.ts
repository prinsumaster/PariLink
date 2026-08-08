import {
  Controller,
  Post,
  Req,
  Headers,
  BadRequestException,
} from '@nestjs/common';
import type { RawBodyRequest } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import type { Request } from 'express';
import { StripeIntegrationService } from './stripe-integration.service';
import { BillingService } from './billing.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Stripe Webhooks')
@Controller('webhooks/stripe')
export class StripeWebhookController {
  constructor(
    private readonly stripeService: StripeIntegrationService,
    private readonly billingService: BillingService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Stripe webhook receiver' })
  @Throttle({ default: { limit: 600, ttl: 60000 } })
  async handleWebhook(
    @Req() req: RawBodyRequest<Request>,
    @Headers('stripe-signature') signature: string,
  ) {
    if (!signature) {
      throw new BadRequestException('Missing stripe-signature header');
    }

    let event;
    try {
      const payload = req.rawBody;
      if (!payload) {
        throw new BadRequestException(
          'Raw body is missing. Ensure rawBody: true is configured in NestFactory.',
        );
      }

      event = await this.stripeService.constructEvent(payload, signature);
    } catch (err: any) {
      throw new BadRequestException(`Webhook Error: ${err.message}`);
    }

    await this.billingService.handleWebhook(event);

    return { received: true };
  }
}
