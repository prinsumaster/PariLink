import { Module } from '@nestjs/common';
import { ApiAnalyticsService } from './api-analytics.service';
import { PrismaModule } from '../prisma/prisma.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ApiAnalyticsInterceptor } from '../api-platform/analytics/api-analytics.interceptor';

@Module({
  imports: [PrismaModule],
  providers: [
    ApiAnalyticsService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ApiAnalyticsInterceptor,
    },
  ],
  exports: [ApiAnalyticsService],
})
export class ApiAnalyticsModule {}
