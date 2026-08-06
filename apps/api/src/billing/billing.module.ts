import { Module } from '@nestjs/common';
import { StripeBillingService } from './stripe.service';
import { StripeController } from './stripe.controller';
import { BillingController } from './billing.controller';
import { BillingService } from './billing.service';
import { WorkflowModule } from '../workflow/workflow.module';
import { PlatformModule } from '../platform/platform.module';

@Module({
  imports: [WorkflowModule, PlatformModule],
  controllers: [StripeController, BillingController],
  providers: [StripeBillingService, BillingService],
  exports: [StripeBillingService, BillingService],
})
export class BillingModule {}
