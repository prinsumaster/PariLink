import { Module, forwardRef } from '@nestjs/common';
import { AnalyticsController } from './analytics.controller';
import { MetricsEngineService } from './engine/metrics-engine.service';
import { ForecastEngineService } from './engine/forecast-engine.service';
import { AnalyticsCacheService } from './engine/analytics-cache.service';
import { AnalyticsETLProcessor } from './etl/analytics-etl.processor';
import { AnalyticsETLService } from './etl/analytics-etl.service';
import { KpiEngineService } from './engine/kpi-engine.service';
import { BullModule } from '@nestjs/bullmq';
import { PrismaModule } from '../prisma/prisma.module';
import { AiModule } from '../ai/ai.module';
import { PlatformModule } from '../platform/platform.module';

@Module({
  imports: [
    PrismaModule,
    PlatformModule,
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
    ...(process.env.RUN_WORKERS === 'true' ? [...(process.env.RUN_WORKERS === 'true' ? [AnalyticsETLProcessor] : [])] : []),
    AnalyticsETLService,
    KpiEngineService,
  ],
  exports: [
    MetricsEngineService,
    ForecastEngineService,
    AnalyticsCacheService,
    KpiEngineService,
  ],
})
export class AnalyticsModule {}
