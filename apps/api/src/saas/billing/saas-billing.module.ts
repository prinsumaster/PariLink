import { Module } from '@nestjs/common';
import { BillingController } from './billing.controller';
import { StripeWebhookController } from './stripe-webhook.controller';
import { RazorpayWebhookController } from './razorpay-webhook.controller';
import { BillingService } from './billing.service';
import { StripeIntegrationService } from './stripe-integration.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { IntegrationsModule } from '../../integrations/integrations.module';

@Module({
  imports: [PrismaModule, IntegrationsModule],
  controllers: [
    BillingController,
    StripeWebhookController,
    RazorpayWebhookController,
  ],
  providers: [BillingService, StripeIntegrationService],
  exports: [BillingService],
})
export class SaasBillingModule {}
