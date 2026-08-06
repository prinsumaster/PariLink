import { Module } from '@nestjs/common';
import { BillingController } from './billing.controller';
import { StripeWebhookController } from './stripe-webhook.controller';
import { BillingService } from './billing.service';
import { StripeIntegrationService } from './stripe-integration.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [BillingController, StripeWebhookController],
  providers: [BillingService, StripeIntegrationService],
  exports: [BillingService],
})
export class SaasBillingModule {}
