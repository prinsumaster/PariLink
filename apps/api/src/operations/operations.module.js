"use strict";
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
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OperationsModule = void 0;
var common_1 = require("@nestjs/common");
var schedule_1 = require("@nestjs/schedule");
// Health
var enterprise_health_service_1 = require("./health/enterprise-health.service");
var enterprise_health_controller_1 = require("./health/enterprise-health.controller");
// Metrics
var metrics_platform_service_1 = require("./metrics/metrics-platform.service");
var metrics_platform_controller_1 = require("./metrics/metrics-platform.controller");
// Tracing
var distributed_tracing_service_1 = require("./tracing/distributed-tracing.service");
var distributed_tracing_controller_1 = require("./tracing/distributed-tracing.controller");
// Logging
var logging_platform_service_1 = require("./logging/logging-platform.service");
var logging_platform_controller_1 = require("./logging/logging-platform.controller");
// Alerts
var alert_engine_service_1 = require("./alerts/alert-engine.service");
var alert_engine_controller_1 = require("./alerts/alert-engine.controller");
// Incidents
var incident_management_service_1 = require("./incidents/incident-management.service");
var incident_management_controller_1 = require("./incidents/incident-management.controller");
// Backup & Recovery
var backup_recovery_service_1 = require("./backup/backup-recovery.service");
var backup_recovery_controller_1 = require("./backup/backup-recovery.controller");
// Disaster Recovery
var disaster_recovery_service_1 = require("./dr/disaster-recovery.service");
var disaster_recovery_controller_1 = require("./dr/disaster-recovery.controller");
// Performance
var performance_platform_service_1 = require("./performance/performance-platform.service");
var performance_platform_controller_1 = require("./performance/performance-platform.controller");
// Dashboard
var operations_dashboard_service_1 = require("./dashboard/operations-dashboard.service");
var operations_dashboard_controller_1 = require("./dashboard/operations-dashboard.controller");
// Background Scheduler
var operations_scheduler_1 = require("./operations.scheduler");
var OperationsModule = function () {
    var _classDecorators = [(0, common_1.Module)({
            imports: [schedule_1.ScheduleModule.forRoot()],
            controllers: [
                enterprise_health_controller_1.EnterpriseHealthController,
                metrics_platform_controller_1.MetricsPlatformController,
                distributed_tracing_controller_1.DistributedTracingController,
                logging_platform_controller_1.LoggingPlatformController,
                alert_engine_controller_1.AlertEngineController,
                incident_management_controller_1.IncidentManagementController,
                backup_recovery_controller_1.BackupRecoveryController,
                disaster_recovery_controller_1.DisasterRecoveryController,
                performance_platform_controller_1.PerformancePlatformController,
                operations_dashboard_controller_1.OperationsDashboardController,
            ],
            providers: [
                enterprise_health_service_1.EnterpriseHealthService,
                metrics_platform_service_1.MetricsPlatformService,
                distributed_tracing_service_1.DistributedTracingService,
                logging_platform_service_1.LoggingPlatformService,
                alert_engine_service_1.AlertEngineService,
                incident_management_service_1.IncidentManagementService,
                backup_recovery_service_1.BackupRecoveryService,
                disaster_recovery_service_1.DisasterRecoveryService,
                performance_platform_service_1.PerformancePlatformService,
                operations_dashboard_service_1.OperationsDashboardService,
                operations_scheduler_1.OperationsScheduler,
            ],
            exports: [
                enterprise_health_service_1.EnterpriseHealthService,
                metrics_platform_service_1.MetricsPlatformService,
                distributed_tracing_service_1.DistributedTracingService,
                logging_platform_service_1.LoggingPlatformService,
                alert_engine_service_1.AlertEngineService,
                incident_management_service_1.IncidentManagementService,
                backup_recovery_service_1.BackupRecoveryService,
                disaster_recovery_service_1.DisasterRecoveryService,
                performance_platform_service_1.PerformancePlatformService,
                operations_dashboard_service_1.OperationsDashboardService,
            ],
        })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var OperationsModule = _classThis = /** @class */ (function () {
        function OperationsModule_1() {
        }
        return OperationsModule_1;
    }());
    __setFunctionName(_classThis, "OperationsModule");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        OperationsModule = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return OperationsModule = _classThis;
}();
exports.OperationsModule = OperationsModule;
