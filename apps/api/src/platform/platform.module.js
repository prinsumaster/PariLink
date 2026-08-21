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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlatformModule = void 0;
var common_1 = require("@nestjs/common");
var event_emitter_1 = require("@nestjs/event-emitter");
var event_service_1 = require("./events/event.service");
var audit_service_1 = require("./audit/audit.service");
var crypto_platform_service_1 = require("./encryption/crypto-platform.service");
var platform_data_module_1 = require("./data/platform-data.module");
var api_platform_module_1 = require("./api/api-platform.module");
var file_module_1 = require("./files/file.module");
var digital_twin_module_1 = require("./digital-twin/digital-twin.module");
var realtime_module_1 = require("./realtime/realtime.module");
var runtime_module_1 = require("./runtime/runtime.module");
var mdm_module_1 = require("./mdm/mdm.module");
var bpm_module_1 = require("./bpm/bpm.module");
var security_service_1 = require("./security/security.service");
var circuit_breaker_service_1 = require("./resilience/circuit-breaker.service");
var cache_manager_service_1 = require("./performance/cache-manager.service");
var feature_toggle_service_1 = require("./feature-management/feature-toggle.service");
var health_service_1 = require("./api/health.service");
var platform_controller_1 = require("./api/platform.controller");
var envelope_encryption_service_1 = require("./encryption/envelope/envelope-encryption.service");
var iam_policy_engine_service_1 = require("./iam/iam-policy-engine.service");
var license_service_1 = require("./licensing/license.service");
var data_governance_service_1 = require("./data-governance/data-governance.service");
var lifecycle_engine_service_1 = require("./lifecycle/lifecycle-engine.service");
var exception_management_service_1 = require("./resilience/exception-management.service");
var analytics_registry_service_1 = require("./analytics/analytics-registry.service");
var pii_encryption_service_1 = require("./encryption/pii-encryption.service");
var secrets_service_1 = require("./security/secrets/secrets.service");
var PLATFORM_SERVICES = [
    event_service_1.EventService,
    audit_service_1.AuditService,
    crypto_platform_service_1.CryptoPlatformService,
    security_service_1.SecurityContextService,
    circuit_breaker_service_1.CircuitBreakerService,
    cache_manager_service_1.CacheManagerService,
    feature_toggle_service_1.FeatureToggleService,
    health_service_1.HealthService,
    envelope_encryption_service_1.EnvelopeEncryptionService,
    iam_policy_engine_service_1.IamPolicyEngineService,
    license_service_1.LicenseService,
    data_governance_service_1.DataGovernanceService,
    lifecycle_engine_service_1.LifecycleEngineService,
    exception_management_service_1.ExceptionManagementService,
    analytics_registry_service_1.AnalyticsRegistryService,
    pii_encryption_service_1.PiiEncryptionService,
    secrets_service_1.SecretsService,
];
var PlatformModule = function () {
    var _classDecorators = [(0, common_1.Global)(), (0, common_1.Module)({
            imports: [
                event_emitter_1.EventEmitterModule.forRoot({
                    wildcard: true,
                    delimiter: '.',
                    newListener: false,
                    removeListener: false,
                    maxListeners: 20,
                    verboseMemoryLeak: true,
                    ignoreErrors: false,
                }),
                platform_data_module_1.PlatformDataModule,
                api_platform_module_1.ApiPlatformModule,
                file_module_1.FilePlatformModule,
                digital_twin_module_1.DigitalTwinModule,
                realtime_module_1.RealtimeModule,
                runtime_module_1.RuntimeModule,
                mdm_module_1.MdmModule,
                bpm_module_1.BpmModule,
            ],
            controllers: [platform_controller_1.PlatformController],
            providers: PLATFORM_SERVICES,
            exports: __spreadArray(__spreadArray([], PLATFORM_SERVICES, true), [
                platform_data_module_1.PlatformDataModule,
                api_platform_module_1.ApiPlatformModule,
                file_module_1.FilePlatformModule,
                digital_twin_module_1.DigitalTwinModule,
                realtime_module_1.RealtimeModule,
                runtime_module_1.RuntimeModule,
                mdm_module_1.MdmModule,
                bpm_module_1.BpmModule,
            ], false),
        })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var PlatformModule = _classThis = /** @class */ (function () {
        function PlatformModule_1() {
        }
        return PlatformModule_1;
    }());
    __setFunctionName(_classThis, "PlatformModule");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        PlatformModule = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return PlatformModule = _classThis;
}();
exports.PlatformModule = PlatformModule;
