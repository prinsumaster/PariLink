import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { BusinessHealthService } from './business-health.service';
import { BusinessHealthScheduler } from './business-health.scheduler';
import { PrismaModule } from '../../prisma/prisma.module';
import { AnalyticsModule } from '../../analytics/analytics.module';

@Module({
  imports: [
    PrismaModule,
    AnalyticsModule, // For MetricsEngineService
    ScheduleModule.forRoot(), // To enable the scheduler
  ],
  providers: [BusinessHealthService, BusinessHealthScheduler],
  exports: [BusinessHealthService],
})
export class BusinessHealthModule {}
