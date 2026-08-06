import {
  Controller,
  Post,
  Req,
  Headers,
  BadRequestException,
} from '@nestjs/common';
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
  async handleWebhook(
    @Req() req: Request,
    @Headers('stripe-signature') signature: string,
  ) {
    if (!signature) {
      throw new BadRequestException('Missing stripe-signature header');
    }

    let event;
    try {
      // Need raw body for Stripe signature validation.
      // Assuming a raw body parser is configured, or we're using a specific interceptor.
      // For mock environments without raw body:
      const payload = req.body;
      event = this.stripeService.constructEvent(
        Buffer.isBuffer(req.body) ? req.body : JSON.stringify(req.body),
        signature,
      );
    } catch (err: any) {
      throw new BadRequestException(`Webhook Error: ${err.message}`);
    }

    await this.billingService.handleWebhook(event);

    return { received: true };
  }
}
