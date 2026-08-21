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
exports.FleetModule = void 0;
var common_1 = require("@nestjs/common");
var vehicle_lifecycle_controller_1 = require("./lifecycle/vehicle-lifecycle.controller");
var vehicle_lifecycle_service_1 = require("./lifecycle/vehicle-lifecycle.service");
var fleet_maintenance_controller_1 = require("./maintenance/fleet-maintenance.controller");
var fleet_maintenance_service_1 = require("./maintenance/fleet-maintenance.service");
var iot_controller_1 = require("./iot/iot.controller");
var iot_service_1 = require("./iot/iot.service");
var prisma_module_1 = require("../prisma/prisma.module");
var iam_module_1 = require("../iam/iam.module");
var FleetModule = function () {
    var _classDecorators = [(0, common_1.Module)({
            imports: [prisma_module_1.PrismaModule, iam_module_1.IamModule],
            controllers: [
                vehicle_lifecycle_controller_1.VehicleLifecycleController,
                fleet_maintenance_controller_1.FleetMaintenanceController,
                iot_controller_1.IoTController,
            ],
            providers: [vehicle_lifecycle_service_1.VehicleLifecycleService, fleet_maintenance_service_1.FleetMaintenanceService, iot_service_1.IoTService],
            exports: [vehicle_lifecycle_service_1.VehicleLifecycleService, fleet_maintenance_service_1.FleetMaintenanceService, iot_service_1.IoTService],
        })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var FleetModule = _classThis = /** @class */ (function () {
        function FleetModule_1() {
        }
        return FleetModule_1;
    }());
    __setFunctionName(_classThis, "FleetModule");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        FleetModule = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return FleetModule = _classThis;
}();
exports.FleetModule = FleetModule;
