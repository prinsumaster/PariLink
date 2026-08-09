import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { ConfigModule } from '@nestjs/config';
import { CacheModule, CacheInterceptor } from '@nestjs/cache-manager';
import { validate } from './config/env.config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ThrottlerModule, ThrottlerGuard, seconds } from '@nestjs/throttler';
import { ThrottlerStorageRedisService } from '@nest-lab/throttler-storage-redis';
import { LoggerModule } from 'nestjs-pino';
import { RedisManagerModule } from './common/redis/redis-manager.module';
import { HealthModule } from './health/health.module';
import { TimeoutInterceptor } from './common/interceptors/timeout.interceptor';
import { IdempotencyInterceptor } from './common/interceptors/idempotency.interceptor';
import { APP_GUARD, APP_INTERCEPTOR, APP_FILTER } from '@nestjs/core';
// Removed duplicate ObservabilityInterceptor import
import { GlobalExceptionFilter } from './platform/resilience/global-exception.filter';
import { ApiRateLimiterMiddleware } from './platform/security/ratelimit/api-rate-limiter.middleware';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { SsoModule } from './auth/sso/sso.module';
import { DataModule } from './data/data.module';
import { DataLifecycleModule } from './data-lifecycle/data-lifecycle.module';
import { SecurityModule } from './security.module';
import { CompaniesModule } from './companies/companies.module';
import { BranchesModule } from './branches/branches.module';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { VehiclesModule } from './vehicles/vehicles.module';
import { PermitsModule } from './vehicles/permits/permits.module';
import { DriversModule } from './drivers/drivers.module';
import { CustomersModule } from './customers/customers.module';
import { LoadsModule } from './loads/loads.module';
import { TripsModule } from './trips/trips.module';
import { DispatchModule } from './dispatch/dispatch.module';
import { FactoringModule } from './factoring/factoring.module';
import { GpsModule } from './intelligence/gps/gps.module';
import { GeofenceModule } from './intelligence/geofence/geofence.module';
import { AlertModule } from './intelligence/alerts/alert.module';
import { AnalyticsModule as IntelligenceAnalyticsModule } from './intelligence/analytics/analytics.module';
import { RulesModule } from './intelligence/rules/rules.module';
import { OccModule } from './intelligence/occ/occ.module';
import { BusinessHealthModule } from './intelligence/health/business-health.module';
import { LinModule } from './intelligence/network/lin.module';
import { ExecutionModule } from './automation/execution/execution.module';

import { MobileModule } from './mobile/mobile.module';
import { TrackingModule } from './tracking/tracking.module';
import { DocumentsModule } from './documents/documents.module';
import { InvoicesModule } from './invoices/invoices.module';
import { PaymentsModule } from './payments/payments.module';
import { ReportsModule } from './reports/reports.module';
// Removed duplicate AuditInterceptor import
import { TrailersModule } from './trailers/trailers.module';
import { VendorsModule } from './vendors/vendors.module';
import { BillingModule } from './billing/billing.module';
import { LedgerModule } from './ledger/ledger.module';
import { FinanceModule } from './finance/finance.module';
import { IntegrationsModule } from './integrations/integrations.module';
import { CommunicationsModule } from './communications/communications.module';
import { AdminModule } from './admin/admin.module';
import { PlatformModule } from './platform/platform.module';
import { PluginModule } from './platform/plugins/plugin.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { WmsModule } from './wms/wms.module';
import { SupportModule } from './support/support.module';
import { EdiModule } from './edi/edi.module';
import { WorkflowModule } from './workflow/workflow.module';
import { IntegrationModule } from './integration/integration.module';
import { AiModule } from './ai/ai.module';
import { ApiPlatformModule } from './api-platform/api-platform.module';
import { OptimizationModule } from './optimization/optimization.module';
import { PlanningModule } from './planning/planning.module';
import { CommercialModule } from './commercial/commercial.module';
import { WarehouseModule } from './warehouse/warehouse.module';
import { YardModule } from './yard/yard.module';
import { TelemetryIngressModule } from './marketplace/telemetry-ingress/telemetry-ingress.module';
import { MarketplaceCoreModule } from './marketplace/core/marketplace-core.module';
import { MarketplaceWebhooksModule } from './marketplace/webhooks/marketplace-webhooks.module';
import { IamModule } from './iam/iam.module';
import { TenantModule } from './saas/tenant/tenant.module';
import { SaasBillingModule } from './saas/billing/saas-billing.module';
import { TelemetryModule } from './telemetry/telemetry.module';
import { FleetModule } from './fleet/fleet.module';

import { ElomModule } from './integration/elom/elom.module';
import { SearchModule } from './search/search.module';
import { ExportsModule } from './exports/exports.module';
import { CommentsModule } from './comments/comments.module';
import { ChatModule } from './chat/chat.module';
import { BrokerModule } from './broker/broker.module';
import { LocalizationModule } from './localization/localization.module';
import { BackgroundJobsModule } from './background-jobs/background-jobs.module';
import { WorkspaceModule } from './workspace/workspace.module';
import { ApiV2Module } from './api-platform/v2/api-v2.module';
import { SimulatorModule } from './simulator/simulator.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { DeveloperModule } from './developer/developer.module';
import { ApiAnalyticsModule } from './api-analytics/api-analytics.module';
import { LifecycleModule } from './lifecycle/lifecycle.module';
import { SdkModule } from './sdk/sdk.module';
import { SandboxModule } from './sandbox/sandbox.module';
import { BullModule } from '@nestjs/bullmq';
import Redis from 'ioredis';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { OperationsModule } from './operations/operations.module';
import { CrmModule } from './crm/crm.module';
import { GstModule } from './gst/gst.module';
import { FastagModule } from './fastag/fastag.module';

import { DispatchAiModule } from './intelligence/dispatch/dispatch-ai.module';
import { DriverIntelligenceModule } from './intelligence/drivers/driver-intelligence.module';
import { FleetIntelligenceModule } from './intelligence/fleet/fleet-intelligence.module';
import { EtaIntelligenceModule } from './intelligence/eta/eta-intelligence.module';
import { MaintenanceModule } from './maintenance/maintenance.module';
import { PortalsModule } from './portals/portals.module';

// Phase 3 AI Intelligence Modules
import { PredictionEngineModule } from './intelligence/prediction/prediction.module';
import { RiskEngineModule } from './intelligence/risk/risk.module';
import { RecommendationEngineModule } from './intelligence/recommendation/recommendation.module';
import { MlFeatureStoreModule } from './intelligence/feature-store/feature-store.module';
import { AiSchedulerModule } from './intelligence/scheduler/scheduler.module';
import { TelemetryProcessorModule } from './intelligence/telemetry-processor/telemetry-processor.module';
import { ReportingModule } from './reporting/reporting.module';

@Module({
  imports: [
    ReportingModule,
    DispatchAiModule,

    DriverIntelligenceModule,
    FleetIntelligenceModule,
    EtaIntelligenceModule,
    PredictionEngineModule,
    RiskEngineModule,
    RecommendationEngineModule,
    MlFeatureStoreModule,
    AiSchedulerModule,
    TelemetryProcessorModule,
    DataModule,
    DataLifecycleModule,
    SecurityModule,
    RedisManagerModule,
    PrometheusModule.register({
      path: '/metrics',
      defaultMetrics: {
        enabled: true,
      },
    }),
    ConfigModule.forRoot({
      validate,
      isGlobal: true,
    }),
    ThrottlerModule.forRootAsync({
      imports: [RedisManagerModule],
      inject: [require('./common/redis/redis-manager.service').RedisManagerService],
      useFactory: (redisManager: any) => ({
        storage: new ThrottlerStorageRedisService(redisManager.getClient()),
        throttlers: [
          {
            name: 'default',
            ttl: seconds(60),
            limit: process.env.NODE_ENV === 'test' ? 1000 : 100,
          },
        ],
      }),
    }),
    LoggerModule.forRoot({
      pinoHttp: {
        level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
        transport:
          process.env.NODE_ENV !== 'production'
            ? { target: 'pino-pretty' }
            : undefined,
        autoLogging: false,
      },
    }),
    EventEmitterModule.forRoot({
      wildcard: true,
      delimiter: '.',
    }),
    BullModule.forRoot({
      connection: {
        url: process.env.REDIS_URL || 'redis://localhost:6379',
        maxRetriesPerRequest: null,
      },
      defaultJobOptions: {
        attempts: 5,
        backoff: { type: 'exponential', delay: 1000 },
        removeOnComplete: {
          age: 3600, // keep for 1 hour
          count: 1000, // keep max 1000 completed jobs
        },
        removeOnFail: {
          age: 7 * 24 * 3600, // DLQ: keep failed jobs for 7 days
          count: 5000, // DLQ max size: keep max 5000 failed jobs
        },
      },
    }),

    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async () => {
        if (process.env.NODE_ENV === 'test') {
          return { ttl: 60000 };
        }
        const { redisStore } = await import('cache-manager-redis-yet');
        return {
          store: await redisStore({
            url: process.env.REDIS_URL || 'redis://localhost:6379',
            ttl: 60000,
          }),
        };
      },
    }),
    BullModule.registerQueue(
      {
        name: 'webhooks',
        defaultJobOptions: {
          attempts: 10,
          backoff: { type: 'exponential', delay: 5000 },
        },
      },
      {
        name: 'background_jobs',
      },
    ),

    PrismaModule,
    AuthModule,
    SsoModule,
    CompaniesModule,
    BranchesModule,
    UsersModule,
    RolesModule,
    PermitsModule,
    VehiclesModule,
    DriversModule,
    WarehouseModule,
    BrokerModule,
    LocalizationModule,
    CustomersModule,
    LoadsModule,
    TripsModule,
    DispatchModule,
    FactoringModule,
    WmsModule,
    SupportModule,
    GpsModule,
    GeofenceModule,
    AlertModule,
    IntelligenceAnalyticsModule,
    RulesModule,
    OccModule,
    BusinessHealthModule,
    LinModule,
    ExecutionModule,
    MobileModule,
    TrackingModule,
    DocumentsModule,
    InvoicesModule,
    PaymentsModule,
    ReportsModule,
    TrailersModule,
    VendorsModule,
    BillingModule,
    LedgerModule,
    FinanceModule,
    IntegrationsModule,
    CommunicationsModule,
    WorkspaceModule,
    AdminModule,
    PlatformModule,
    PluginModule,
    DashboardModule,
    EdiModule,
    WorkflowModule,
    IntegrationModule,
    AiModule,
    ApiPlatformModule,
    OptimizationModule,
    PlanningModule,
    ApiV2Module,
    CommercialModule,
    YardModule,
    MarketplaceCoreModule,
    MarketplaceWebhooksModule,
    TelemetryIngressModule,
    ElomModule,
    SearchModule,
    ExportsModule,
    CommentsModule,
    ChatModule,
    BackgroundJobsModule,
    IamModule,
    AnalyticsModule,
    DeveloperModule,
    ApiAnalyticsModule,
    LifecycleModule,
    SdkModule,
    SandboxModule,
    HealthModule,
    OperationsModule,
    CrmModule,
    GstModule,
    FastagModule,
    MaintenanceModule,
    PortalsModule,
    TenantModule,
    SaasBillingModule,
    TelemetryModule,
    FleetModule,
  ],
  providers: [
    ApiRateLimiterMiddleware,
    {
      provide: APP_INTERCEPTOR,
      useClass: TimeoutInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: IdempotencyInterceptor, // Safe retry semantics
    },
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter, // Catch all unhandled exceptions
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ApiRateLimiterMiddleware).forRoutes('*');
  }
}
