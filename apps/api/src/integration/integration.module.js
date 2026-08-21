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
exports.IntegrationModule = void 0;
var common_1 = require("@nestjs/common");
var registry_service_1 = require("./framework/registry.service");
var auth_service_1 = require("./auth/auth.service");
var webhook_service_1 = require("./webhook/webhook.service");
var mapping_service_1 = require("./mapping/mapping.service");
var sync_service_1 = require("./sync/sync.service");
var event_integration_service_1 = require("./events/event-integration.service");
var observability_service_1 = require("./observability/observability.service");
var gateway_controller_1 = require("./gateway/gateway.controller");
// Existing Connectors
var google_maps_connector_1 = require("./connectors/google-maps.connector");
var quickbooks_connector_1 = require("./connectors/quickbooks.connector");
var finance_connector_1 = require("./connectors/finance.connector");
var telematics_connector_1 = require("./connectors/telematics.connector");
// New ERP Connectors
var erp_connectors_1 = require("./connectors/erp.connectors");
// New Logistics Connectors
var logistics_connectors_1 = require("./connectors/logistics.connectors");
// Hub & Developer Platform Services and Controllers
var enterprise_integration_hub_service_1 = require("./hub/enterprise-integration-hub.service");
var enterprise_integration_hub_controller_1 = require("./hub/enterprise-integration-hub.controller");
var webhook_platform_service_1 = require("./webhook/webhook-platform.service");
var webhook_platform_controller_1 = require("./webhook/webhook-platform.controller");
var enterprise_event_bus_service_1 = require("./events/enterprise-event-bus.service");
var enterprise_event_bus_controller_1 = require("./events/enterprise-event-bus.controller");
var import_export_service_1 = require("./import-export/import-export.service");
var import_export_controller_1 = require("./import-export/import-export.controller");
var data_mapping_controller_1 = require("./mapping/data-mapping.controller");
var sync_scheduler_controller_1 = require("./sync/sync-scheduler.controller");
var developer_platform_service_1 = require("./developer/developer-platform.service");
var developer_platform_controller_1 = require("./developer/developer-platform.controller");
var IntegrationModule = function () {
    var _classDecorators = [(0, common_1.Module)({
            controllers: [
                gateway_controller_1.IntegrationGatewayController,
                enterprise_integration_hub_controller_1.EnterpriseIntegrationHubController,
                webhook_platform_controller_1.WebhookPlatformController,
                enterprise_event_bus_controller_1.EnterpriseEventBusController,
                import_export_controller_1.ImportExportController,
                data_mapping_controller_1.DataMappingController,
                sync_scheduler_controller_1.SyncSchedulerController,
                developer_platform_controller_1.DeveloperPlatformController,
            ],
            providers: [
                registry_service_1.ConnectorRegistryService,
                auth_service_1.IntegrationAuthService,
                webhook_service_1.WebhookEngineService,
                mapping_service_1.DataMappingService,
                sync_service_1.SyncEngineService,
                event_integration_service_1.EventIntegrationService,
                observability_service_1.IntegrationObservabilityService,
                enterprise_integration_hub_service_1.EnterpriseIntegrationHubService,
                webhook_platform_service_1.WebhookPlatformService,
                enterprise_event_bus_service_1.EnterpriseEventBusService,
                import_export_service_1.ImportExportService,
                developer_platform_service_1.DeveloperPlatformService,
                // Connectors
                google_maps_connector_1.GoogleMapsConnector,
                quickbooks_connector_1.QuickBooksConnector,
                finance_connector_1.AccountingSoftwareConnector,
                telematics_connector_1.SamsaraTelematicsConnector,
                erp_connectors_1.SapConnector,
                erp_connectors_1.OracleErpConnector,
                erp_connectors_1.Dynamics365Connector,
                erp_connectors_1.TallyConnector,
                erp_connectors_1.ZohoBooksConnector,
                erp_connectors_1.XeroConnector,
                logistics_connectors_1.GpsProviderConnector,
                logistics_connectors_1.FuelCardConnector,
                logistics_connectors_1.FastagConnector,
                logistics_connectors_1.EwayBillConnector,
                logistics_connectors_1.GstConnector,
                logistics_connectors_1.SmsGatewayConnector,
                logistics_connectors_1.EmailGatewayConnector,
                logistics_connectors_1.WhatsAppConnector,
                logistics_connectors_1.PaymentGatewayConnector,
            ],
            exports: [
                registry_service_1.ConnectorRegistryService,
                auth_service_1.IntegrationAuthService,
                webhook_service_1.WebhookEngineService,
                mapping_service_1.DataMappingService,
                sync_service_1.SyncEngineService,
                observability_service_1.IntegrationObservabilityService,
                enterprise_integration_hub_service_1.EnterpriseIntegrationHubService,
                webhook_platform_service_1.WebhookPlatformService,
                enterprise_event_bus_service_1.EnterpriseEventBusService,
                import_export_service_1.ImportExportService,
                developer_platform_service_1.DeveloperPlatformService,
            ],
        })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var IntegrationModule = _classThis = /** @class */ (function () {
        function IntegrationModule_1(registry, googleMaps, quickBooks, finance, telematics, sap, oracle, dynamics, tally, zoho, xero, gps, fuel, fastag, eway, gst, sms, email, whatsapp, payments) {
            this.registry = registry;
            this.googleMaps = googleMaps;
            this.quickBooks = quickBooks;
            this.finance = finance;
            this.telematics = telematics;
            this.sap = sap;
            this.oracle = oracle;
            this.dynamics = dynamics;
            this.tally = tally;
            this.zoho = zoho;
            this.xero = xero;
            this.gps = gps;
            this.fuel = fuel;
            this.fastag = fastag;
            this.eway = eway;
            this.gst = gst;
            this.sms = sms;
            this.email = email;
            this.whatsapp = whatsapp;
            this.payments = payments;
        }
        IntegrationModule_1.prototype.onModuleInit = function () {
            this.registry.registerConnector(this.googleMaps);
            this.registry.registerConnector(this.quickBooks);
            this.registry.registerConnector(this.finance);
            this.registry.registerConnector(this.telematics);
            this.registry.registerConnector(this.sap);
            this.registry.registerConnector(this.oracle);
            this.registry.registerConnector(this.dynamics);
            this.registry.registerConnector(this.tally);
            this.registry.registerConnector(this.zoho);
            this.registry.registerConnector(this.xero);
            this.registry.registerConnector(this.gps);
            this.registry.registerConnector(this.fuel);
            this.registry.registerConnector(this.fastag);
            this.registry.registerConnector(this.eway);
            this.registry.registerConnector(this.gst);
            this.registry.registerConnector(this.sms);
            this.registry.registerConnector(this.email);
            this.registry.registerConnector(this.whatsapp);
            this.registry.registerConnector(this.payments);
        };
        return IntegrationModule_1;
    }());
    __setFunctionName(_classThis, "IntegrationModule");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        IntegrationModule = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return IntegrationModule = _classThis;
}();
exports.IntegrationModule = IntegrationModule;
