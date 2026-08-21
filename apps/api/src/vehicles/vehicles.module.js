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
exports.VehiclesModule = void 0;
var common_1 = require("@nestjs/common");
var vehicles_service_1 = require("./vehicles.service");
var vehicles_controller_1 = require("./vehicles.controller");
var maintenance_engine_1 = require("./fleet/maintenance.engine");
var maintenance_controller_1 = require("./maintenance/maintenance.controller");
var maintenance_service_1 = require("./maintenance/maintenance.service");
var fuel_management_service_1 = require("./fleet/fuel-management.service");
var fuel_controller_1 = require("./fuel/fuel.controller");
var fuel_service_1 = require("./fuel/fuel.service");
var tyre_controller_1 = require("./tyre/tyre.controller");
var tyre_service_1 = require("./tyre/tyre.service");
var compliance_engine_1 = require("./fleet/compliance.engine");
var compliance_controller_1 = require("./compliance/compliance.controller");
var compliance_service_1 = require("./compliance/compliance.service");
var tyre_management_service_1 = require("./fleet/tyre-management.service");
var fleet_orchestrator_service_1 = require("./fleet/fleet-orchestrator.service");
var fleet_analytics_service_1 = require("./fleet/fleet-analytics.service");
var platform_module_1 = require("../platform/platform.module");
var workflow_module_1 = require("../workflow/workflow.module");
var VehiclesModule = function () {
    var _classDecorators = [(0, common_1.Module)({
            imports: [platform_module_1.PlatformModule, workflow_module_1.WorkflowModule],
            controllers: [
                maintenance_controller_1.MaintenanceController,
                fuel_controller_1.FuelController,
                tyre_controller_1.TyreController,
                compliance_controller_1.ComplianceController,
                vehicles_controller_1.VehiclesController,
            ],
            providers: [
                vehicles_service_1.VehiclesService,
                maintenance_engine_1.MaintenanceEngine,
                maintenance_service_1.MaintenanceService,
                fuel_management_service_1.FuelManagementService,
                fuel_service_1.FuelService,
                tyre_service_1.TyreService,
                compliance_engine_1.ComplianceEngine,
                compliance_service_1.ComplianceService,
                tyre_management_service_1.TyreManagementService,
                fleet_orchestrator_service_1.FleetOrchestratorService,
                fleet_analytics_service_1.FleetAnalyticsService,
            ],
            exports: [
                vehicles_service_1.VehiclesService,
                fleet_analytics_service_1.FleetAnalyticsService,
                maintenance_service_1.MaintenanceService,
                fuel_service_1.FuelService,
                tyre_service_1.TyreService,
                compliance_service_1.ComplianceService,
            ],
        })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var VehiclesModule = _classThis = /** @class */ (function () {
        function VehiclesModule_1() {
        }
        return VehiclesModule_1;
    }());
    __setFunctionName(_classThis, "VehiclesModule");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        VehiclesModule = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return VehiclesModule = _classThis;
}();
exports.VehiclesModule = VehiclesModule;
