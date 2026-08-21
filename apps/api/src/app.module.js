"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
var common_1 = require("@nestjs/common");
var nestjs_prometheus_1 = require("@willsoto/nestjs-prometheus");
var config_1 = require("@nestjs/config");
var cache_manager_1 = require("@nestjs/cache-manager");
var env_config_1 = require("./config/env.config");
var throttler_1 = require("@nestjs/throttler");
var throttler_storage_redis_1 = require("@nest-lab/throttler-storage-redis");
var nestjs_pino_1 = require("nestjs-pino");
var redis_manager_module_1 = require("./common/redis/redis-manager.module");
var health_module_1 = require("./health/health.module");
var timeout_interceptor_1 = require("./common/interceptors/timeout.interceptor");
var idempotency_interceptor_1 = require("./common/interceptors/idempotency.interceptor");
var core_1 = require("@nestjs/core");
// Removed duplicate ObservabilityInterceptor import
var global_exception_filter_1 = require("./platform/resilience/global-exception.filter");
var api_rate_limiter_middleware_1 = require("./platform/security/ratelimit/api-rate-limiter.middleware");
var prisma_module_1 = require("./prisma/prisma.module");
var auth_module_1 = require("./auth/auth.module");
var sso_module_1 = require("./auth/sso/sso.module");
var data_module_1 = require("./data/data.module");
var data_lifecycle_module_1 = require("./data-lifecycle/data-lifecycle.module");
var security_module_1 = require("./security.module");
var companies_module_1 = require("./companies/companies.module");
var branches_module_1 = require("./branches/branches.module");
var users_module_1 = require("./users/users.module");
var roles_module_1 = require("./roles/roles.module");
var vehicles_module_1 = require("./vehicles/vehicles.module");
var permits_module_1 = require("./vehicles/permits/permits.module");
var drivers_module_1 = require("./drivers/drivers.module");
var customers_module_1 = require("./customers/customers.module");
var loads_module_1 = require("./loads/loads.module");
var trips_module_1 = require("./trips/trips.module");
var dispatch_module_1 = require("./dispatch/dispatch.module");
var factoring_module_1 = require("./factoring/factoring.module");
var gps_module_1 = require("./intelligence/gps/gps.module");
var geofence_module_1 = require("./intelligence/geofence/geofence.module");
var alert_module_1 = require("./intelligence/alerts/alert.module");
var analytics_module_1 = require("./intelligence/analytics/analytics.module");
var rules_module_1 = require("./intelligence/rules/rules.module");
var occ_module_1 = require("./intelligence/occ/occ.module");
var business_health_module_1 = require("./intelligence/health/business-health.module");
var lin_module_1 = require("./intelligence/network/lin.module");
var execution_module_1 = require("./automation/execution/execution.module");
var mobile_module_1 = require("./mobile/mobile.module");
var tracking_module_1 = require("./tracking/tracking.module");
var documents_module_1 = require("./documents/documents.module");
var invoices_module_1 = require("./invoices/invoices.module");
var payments_module_1 = require("./payments/payments.module");
var reports_module_1 = require("./reports/reports.module");
// Removed duplicate AuditInterceptor import
var trailers_module_1 = require("./trailers/trailers.module");
var vendors_module_1 = require("./vendors/vendors.module");
var billing_module_1 = require("./billing/billing.module");
var ledger_module_1 = require("./ledger/ledger.module");
var finance_module_1 = require("./finance/finance.module");
var integrations_module_1 = require("./integrations/integrations.module");
var communications_module_1 = require("./communications/communications.module");
var admin_module_1 = require("./admin/admin.module");
var platform_module_1 = require("./platform/platform.module");
var plugin_module_1 = require("./platform/plugins/plugin.module");
var dashboard_module_1 = require("./dashboard/dashboard.module");
var wms_module_1 = require("./wms/wms.module");
var support_module_1 = require("./support/support.module");
var edi_module_1 = require("./edi/edi.module");
var workflow_module_1 = require("./workflow/workflow.module");
var integration_module_1 = require("./integration/integration.module");
var ai_module_1 = require("./ai/ai.module");
var api_platform_module_1 = require("./api-platform/api-platform.module");
var optimization_module_1 = require("./optimization/optimization.module");
var planning_module_1 = require("./planning/planning.module");
var commercial_module_1 = require("./commercial/commercial.module");
var warehouse_module_1 = require("./warehouse/warehouse.module");
var yard_module_1 = require("./yard/yard.module");
var telemetry_ingress_module_1 = require("./marketplace/telemetry-ingress/telemetry-ingress.module");
var marketplace_core_module_1 = require("./marketplace/core/marketplace-core.module");
var marketplace_webhooks_module_1 = require("./marketplace/webhooks/marketplace-webhooks.module");
var iam_module_1 = require("./iam/iam.module");
var tenant_module_1 = require("./saas/tenant/tenant.module");
var saas_billing_module_1 = require("./saas/billing/saas-billing.module");
var telemetry_module_1 = require("./telemetry/telemetry.module");
var fleet_module_1 = require("./fleet/fleet.module");
var elom_module_1 = require("./integration/elom/elom.module");
var search_module_1 = require("./search/search.module");
var exports_module_1 = require("./exports/exports.module");
var comments_module_1 = require("./comments/comments.module");
var chat_module_1 = require("./chat/chat.module");
var broker_module_1 = require("./broker/broker.module");
var localization_module_1 = require("./localization/localization.module");
var background_jobs_module_1 = require("./background-jobs/background-jobs.module");
var workspace_module_1 = require("./workspace/workspace.module");
var api_v2_module_1 = require("./api-platform/v2/api-v2.module");
var analytics_module_2 = require("./analytics/analytics.module");
var developer_module_1 = require("./developer/developer.module");
var api_analytics_module_1 = require("./api-analytics/api-analytics.module");
var lifecycle_module_1 = require("./lifecycle/lifecycle.module");
var sdk_module_1 = require("./sdk/sdk.module");
var sandbox_module_1 = require("./sandbox/sandbox.module");
var bullmq_1 = require("@nestjs/bullmq");
var event_emitter_1 = require("@nestjs/event-emitter");
var operations_module_1 = require("./operations/operations.module");
var crm_module_1 = require("./crm/crm.module");
var gst_module_1 = require("./gst/gst.module");
var fastag_module_1 = require("./fastag/fastag.module");
var dispatch_ai_module_1 = require("./intelligence/dispatch/dispatch-ai.module");
var driver_intelligence_module_1 = require("./intelligence/drivers/driver-intelligence.module");
var fleet_intelligence_module_1 = require("./intelligence/fleet/fleet-intelligence.module");
var eta_intelligence_module_1 = require("./intelligence/eta/eta-intelligence.module");
var maintenance_module_1 = require("./maintenance/maintenance.module");
var portals_module_1 = require("./portals/portals.module");
// Phase 3 AI Intelligence Modules
var prediction_module_1 = require("./intelligence/prediction/prediction.module");
var risk_module_1 = require("./intelligence/risk/risk.module");
var recommendation_module_1 = require("./intelligence/recommendation/recommendation.module");
var feature_store_module_1 = require("./intelligence/feature-store/feature-store.module");
var scheduler_module_1 = require("./intelligence/scheduler/scheduler.module");
var telemetry_processor_module_1 = require("./intelligence/telemetry-processor/telemetry-processor.module");
var reporting_module_1 = require("./reporting/reporting.module");
var AppModule = function () {
    var _classDecorators = [(0, common_1.Module)({
            imports: [
                reporting_module_1.ReportingModule,
                dispatch_ai_module_1.DispatchAiModule,
                driver_intelligence_module_1.DriverIntelligenceModule,
                fleet_intelligence_module_1.FleetIntelligenceModule,
                eta_intelligence_module_1.EtaIntelligenceModule,
                prediction_module_1.PredictionEngineModule,
                risk_module_1.RiskEngineModule,
                recommendation_module_1.RecommendationEngineModule,
                feature_store_module_1.MlFeatureStoreModule,
                scheduler_module_1.AiSchedulerModule,
                telemetry_processor_module_1.TelemetryProcessorModule,
                data_module_1.DataModule,
                data_lifecycle_module_1.DataLifecycleModule,
                security_module_1.SecurityModule,
                redis_manager_module_1.RedisManagerModule,
                nestjs_prometheus_1.PrometheusModule.register({
                    path: '/metrics',
                    defaultMetrics: {
                        enabled: true,
                    },
                }),
                config_1.ConfigModule.forRoot({
                    validate: env_config_1.validate,
                    isGlobal: true,
                }),
                throttler_1.ThrottlerModule.forRootAsync({
                    imports: [redis_manager_module_1.RedisManagerModule],
                    inject: [require('./common/redis/redis-manager.service').RedisManagerService],
                    useFactory: function (redisManager) { return ({
                        storage: new throttler_storage_redis_1.ThrottlerStorageRedisService(redisManager.getClient()),
                        throttlers: [
                            {
                                name: 'default',
                                ttl: (0, throttler_1.seconds)(60),
                                limit: process.env.NODE_ENV === 'test' ? 1000 : 100,
                            },
                        ],
                    }); },
                }),
                nestjs_pino_1.LoggerModule.forRoot({
                    pinoHttp: {
                        level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
                        transport: process.env.NODE_ENV !== 'production'
                            ? { target: 'pino-pretty' }
                            : undefined,
                        autoLogging: false,
                    },
                }),
                event_emitter_1.EventEmitterModule.forRoot({
                    wildcard: true,
                    delimiter: '.',
                }),
                bullmq_1.BullModule.forRoot({
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
                cache_manager_1.CacheModule.registerAsync({
                    isGlobal: true,
                    useFactory: function () { return __awaiter(void 0, void 0, void 0, function () {
                        var redisStore;
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    if (process.env.NODE_ENV === 'test') {
                                        return [2 /*return*/, { ttl: 60000 }];
                                    }
                                    return [4 /*yield*/, Promise.resolve().then(function () { return __importStar(require('cache-manager-redis-yet')); })];
                                case 1:
                                    redisStore = (_b.sent()).redisStore;
                                    _a = {};
                                    return [4 /*yield*/, redisStore({
                                            url: process.env.REDIS_URL || 'redis://localhost:6379',
                                            ttl: 60000,
                                        })];
                                case 2: return [2 /*return*/, (_a.store = _b.sent(),
                                        _a)];
                            }
                        });
                    }); },
                }),
                bullmq_1.BullModule.registerQueue({
                    name: 'webhooks',
                    defaultJobOptions: {
                        attempts: 10,
                        backoff: { type: 'exponential', delay: 5000 },
                    },
                }, {
                    name: 'background_jobs',
                }),
                prisma_module_1.PrismaModule,
                auth_module_1.AuthModule,
                sso_module_1.SsoModule,
                companies_module_1.CompaniesModule,
                branches_module_1.BranchesModule,
                users_module_1.UsersModule,
                roles_module_1.RolesModule,
                permits_module_1.PermitsModule,
                vehicles_module_1.VehiclesModule,
                drivers_module_1.DriversModule,
                warehouse_module_1.WarehouseModule,
                broker_module_1.BrokerModule,
                localization_module_1.LocalizationModule,
                customers_module_1.CustomersModule,
                loads_module_1.LoadsModule,
                trips_module_1.TripsModule,
                dispatch_module_1.DispatchModule,
                factoring_module_1.FactoringModule,
                wms_module_1.WmsModule,
                support_module_1.SupportModule,
                gps_module_1.GpsModule,
                geofence_module_1.GeofenceModule,
                alert_module_1.AlertModule,
                analytics_module_1.AnalyticsModule,
                rules_module_1.RulesModule,
                occ_module_1.OccModule,
                business_health_module_1.BusinessHealthModule,
                lin_module_1.LinModule,
                execution_module_1.ExecutionModule,
                mobile_module_1.MobileModule,
                tracking_module_1.TrackingModule,
                documents_module_1.DocumentsModule,
                invoices_module_1.InvoicesModule,
                payments_module_1.PaymentsModule,
                reports_module_1.ReportsModule,
                trailers_module_1.TrailersModule,
                vendors_module_1.VendorsModule,
                billing_module_1.BillingModule,
                ledger_module_1.LedgerModule,
                finance_module_1.FinanceModule,
                integrations_module_1.IntegrationsModule,
                communications_module_1.CommunicationsModule,
                workspace_module_1.WorkspaceModule,
                admin_module_1.AdminModule,
                platform_module_1.PlatformModule,
                plugin_module_1.PluginModule,
                dashboard_module_1.DashboardModule,
                edi_module_1.EdiModule,
                workflow_module_1.WorkflowModule,
                integration_module_1.IntegrationModule,
                ai_module_1.AiModule,
                api_platform_module_1.ApiPlatformModule,
                optimization_module_1.OptimizationModule,
                planning_module_1.PlanningModule,
                api_v2_module_1.ApiV2Module,
                commercial_module_1.CommercialModule,
                yard_module_1.YardModule,
                marketplace_core_module_1.MarketplaceCoreModule,
                marketplace_webhooks_module_1.MarketplaceWebhooksModule,
                telemetry_ingress_module_1.TelemetryIngressModule,
                elom_module_1.ElomModule,
                search_module_1.SearchModule,
                exports_module_1.ExportsModule,
                comments_module_1.CommentsModule,
                chat_module_1.ChatModule,
                background_jobs_module_1.BackgroundJobsModule,
                iam_module_1.IamModule,
                analytics_module_2.AnalyticsModule,
                developer_module_1.DeveloperModule,
                api_analytics_module_1.ApiAnalyticsModule,
                lifecycle_module_1.LifecycleModule,
                sdk_module_1.SdkModule,
                sandbox_module_1.SandboxModule,
                health_module_1.HealthModule,
                operations_module_1.OperationsModule,
                crm_module_1.CrmModule,
                gst_module_1.GstModule,
                fastag_module_1.FastagModule,
                maintenance_module_1.MaintenanceModule,
                portals_module_1.PortalsModule,
                tenant_module_1.TenantModule,
                saas_billing_module_1.SaasBillingModule,
                telemetry_module_1.TelemetryModule,
                fleet_module_1.FleetModule,
            ],
            providers: [
                api_rate_limiter_middleware_1.ApiRateLimiterMiddleware,
                {
                    provide: core_1.APP_INTERCEPTOR,
                    useClass: timeout_interceptor_1.TimeoutInterceptor,
                },
                {
                    provide: core_1.APP_INTERCEPTOR,
                    useClass: idempotency_interceptor_1.IdempotencyInterceptor, // Safe retry semantics
                },
                {
                    provide: core_1.APP_FILTER,
                    useClass: global_exception_filter_1.GlobalExceptionFilter, // Catch all unhandled exceptions
                },
            ],
        })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var AppModule = _classThis = /** @class */ (function () {
        function AppModule_1() {
        }
        AppModule_1.prototype.configure = function (consumer) {
            consumer.apply(api_rate_limiter_middleware_1.ApiRateLimiterMiddleware).forRoutes('*');
        };
        return AppModule_1;
    }());
    __setFunctionName(_classThis, "AppModule");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AppModule = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AppModule = _classThis;
}();
exports.AppModule = AppModule;
