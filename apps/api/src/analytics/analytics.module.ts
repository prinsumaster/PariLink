import { Module, forwardRef } from '@nestjs/common';
import { AnalyticsController } from './analytics.controller';
import { MetricsEngineService } from './engine/metrics-engine.service';
import { ForecastEngineService } from './engine/forecast-engine.service';
import { AnalyticsCacheService } from './engine/analytics-cache.service';
import { AnalyticsETLProcessor } from './etl/analytics-etl.processor';
import { AnalyticsETLService } from './etl/analytics-etl.service';
import { BullModule } from '@nestjs/bullmq';
import { PrismaModule } from '../prisma/prisma.module';
import { AiModule } from '../ai/ai.module';

@Module({
  imports: [
    PrismaModule,
    forwardRef(() => AiModule),
    BullModule.registerQueue({
      name: 'analytics_etl',
    }),
  ],
  controllers: [AnalyticsController],
  providers: [
    MetricsEngineService,
    ForecastEngineService,
    AnalyticsCacheService,
    AnalyticsETLProcessor,
    AnalyticsETLService,
  ],
  exports: [MetricsEngineService, ForecastEngineService, AnalyticsCacheService],
})
export class AnalyticsModule {}
