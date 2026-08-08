import {
  Controller,
  Post,
  Req,
  Headers,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import type { RawBodyRequest } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import type { Request } from 'express';
import { BillingService } from './billing.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import * as crypto from 'crypto';
import { SecretsService } from '../../platform/security/secrets/secrets.service';

@ApiTags('Razorpay Webhooks')
@Controller('webhooks/razorpay')
export class RazorpayWebhookController {
  private readonly logger = new Logger(RazorpayWebhookController.name);

  constructor(
    private readonly billingService: BillingService,
    private readonly secretsService: SecretsService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Razorpay webhook receiver' })
  @Throttle({ default: { limit: 600, ttl: 60000 } })
  async handleWebhook(
    @Req() req: RawBodyRequest<Request>,
    @Headers('x-razorpay-signature') signature: string,
  ) {
    if (!signature) {
      throw new BadRequestException('Missing x-razorpay-signature header');
    }

    const secret = await this.secretsService.retrieveIntegrationSecret(
      'SYSTEM',
      'RAZORPAY',
      'WEBHOOK_SECRET',
    );
    if (!secret) {
      throw new BadRequestException('Webhook secret not configured');
    }

    const rawBody = req.rawBody;
    if (!rawBody) {
      throw new BadRequestException(
        'Raw body missing. Ensure rawBody: true in NestFactory.',
      );
    }

    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(rawBody)
      .digest('hex');

    const expectedBuffer = Buffer.from(expectedSignature, 'hex');
    const signatureBuffer = Buffer.from(signature, 'hex');

    if (
      expectedBuffer.length !== signatureBuffer.length ||
      !crypto.timingSafeEqual(expectedBuffer, signatureBuffer)
    ) {
      throw new BadRequestException('Invalid Razorpay signature');
    }

    const event = req.body;
    await this.billingService.handleRazorpayWebhook(event);

    return { status: 'ok' };
  }
}
