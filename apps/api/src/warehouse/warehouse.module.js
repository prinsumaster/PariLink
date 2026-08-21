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
exports.WarehouseModule = void 0;
var common_1 = require("@nestjs/common");
var warehouse_controller_1 = require("./warehouse.controller");
var warehouse_master_service_1 = require("./engine/warehouse-master.service");
var inventory_service_1 = require("./engine/inventory.service");
var inbound_service_1 = require("./engine/inbound.service");
var outbound_service_1 = require("./engine/outbound.service");
var dock_scheduler_service_1 = require("./engine/dock-scheduler.service");
var material_equipment_service_1 = require("./engine/material-equipment.service");
var inventory_optimizer_service_1 = require("./engine/inventory-optimizer.service");
var inventory_management_service_1 = require("./engine/inventory-management.service");
var inbound_outbound_engine_1 = require("./engine/inbound-outbound.engine");
var warehouse_analytics_service_1 = require("./engine/warehouse-analytics.service");
var wms_orchestrator_service_1 = require("./engine/wms-orchestrator.service");
var digital_twin_module_1 = require("../platform/digital-twin/digital-twin.module");
var platform_module_1 = require("../platform/platform.module");
var invoices_module_1 = require("../invoices/invoices.module");
var ai_module_1 = require("../ai/ai.module");
var workflow_module_1 = require("../workflow/workflow.module");
var WarehouseModule = function () {
    var _classDecorators = [(0, common_1.Module)({
            imports: [
                digital_twin_module_1.DigitalTwinModule,
                platform_module_1.PlatformModule,
                invoices_module_1.InvoicesModule,
                workflow_module_1.WorkflowModule,
                (0, common_1.forwardRef)(function () { return ai_module_1.AiModule; }),
            ],
            controllers: [warehouse_controller_1.WarehouseController],
            providers: [
                warehouse_master_service_1.WarehouseMasterService,
                inventory_service_1.InventoryService,
                inbound_service_1.InboundService,
                outbound_service_1.OutboundService,
                dock_scheduler_service_1.DockSchedulerService,
                material_equipment_service_1.MaterialEquipmentService,
                inventory_optimizer_service_1.InventoryOptimizerService,
                inventory_management_service_1.InventoryManagementService,
                inbound_outbound_engine_1.InboundOutboundEngine,
                warehouse_analytics_service_1.WarehouseAnalyticsService,
                wms_orchestrator_service_1.WmsOrchestratorService,
            ],
            exports: [
                warehouse_master_service_1.WarehouseMasterService,
                inventory_service_1.InventoryService,
                inbound_service_1.InboundService,
                outbound_service_1.OutboundService,
                warehouse_analytics_service_1.WarehouseAnalyticsService,
            ],
        })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var WarehouseModule = _classThis = /** @class */ (function () {
        function WarehouseModule_1() {
        }
        return WarehouseModule_1;
    }());
    __setFunctionName(_classThis, "WarehouseModule");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        WarehouseModule = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return WarehouseModule = _classThis;
}();
exports.WarehouseModule = WarehouseModule;
