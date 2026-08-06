import { Module } from '@nestjs/common';
import { CustomerLoadsController } from './loads/customer-loads.controller';
import { CustomerLoadsService } from './loads/customer-loads.service';
import { CustomerFinanceController } from './finance/customer-finance.controller';
import { CustomerFinanceService } from './finance/customer-finance.service';
import { CustomerAnalyticsController } from './analytics/customer-analytics.controller';
import { CustomerAnalyticsService } from './analytics/customer-analytics.service';
import { CustomerTrackingController } from './tracking/customer-tracking.controller';
import { CustomerTrackingService } from './tracking/customer-tracking.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [
    CustomerLoadsController,
    CustomerFinanceController,
    CustomerAnalyticsController,
    CustomerTrackingController,
  ],
  providers: [
    CustomerLoadsService,
    CustomerFinanceService,
    CustomerAnalyticsService,
    CustomerTrackingService,
  ],
  exports: [
    CustomerLoadsService,
    CustomerFinanceService,
    CustomerAnalyticsService,
    CustomerTrackingService,
  ],
})
export class CustomerPortalModule {}
