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
exports.DispatchModule = void 0;
var common_1 = require("@nestjs/common");
var dispatch_service_1 = require("./dispatch.service");
var dispatch_controller_1 = require("./dispatch.controller");
var constraint_engine_1 = require("./engine/constraint.engine");
var scoring_engine_1 = require("./engine/scoring.engine");
var planning_service_1 = require("./engine/planning.service");
var exception_service_1 = require("./engine/exception.service");
var customer_promise_service_1 = require("./engine/customer-promise.service");
var dispatch_kpi_service_1 = require("./engine/dispatch-kpi.service");
var planning_controller_1 = require("./engine/planning.controller");
var control_tower_service_1 = require("./engine/control-tower.service");
var ai_operations_service_1 = require("./engine/ai-operations.service");
var live_fleet_service_1 = require("./engine/live-fleet.service");
var ai_module_1 = require("../ai/ai.module");
var platform_module_1 = require("../platform/platform.module");
var dispatch_operations_controller_1 = require("./dispatch-operations.controller");
var workflow_module_1 = require("../workflow/workflow.module");
var integrations_module_1 = require("../integrations/integrations.module");
var DispatchModule = function () {
    var _classDecorators = [(0, common_1.Module)({
            imports: [ai_module_1.AiModule, platform_module_1.PlatformModule, workflow_module_1.WorkflowModule, integrations_module_1.IntegrationsModule],
            controllers: [
                dispatch_controller_1.DispatchController,
                planning_controller_1.PlanningController,
                dispatch_operations_controller_1.DispatchOperationsController,
            ],
            providers: [
                dispatch_service_1.DispatchService,
                constraint_engine_1.ConstraintEngine,
                scoring_engine_1.ScoringEngine,
                planning_service_1.PlanningService,
                exception_service_1.ExceptionService,
                customer_promise_service_1.CustomerPromiseService,
                dispatch_kpi_service_1.DispatchKpiService,
                control_tower_service_1.ControlTowerService,
                ai_operations_service_1.AiOperationsService,
                live_fleet_service_1.LiveFleetService,
            ],
            exports: [
                planning_service_1.PlanningService,
                dispatch_kpi_service_1.DispatchKpiService,
                constraint_engine_1.ConstraintEngine,
                control_tower_service_1.ControlTowerService,
                ai_operations_service_1.AiOperationsService,
                live_fleet_service_1.LiveFleetService,
            ],
        })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var DispatchModule = _classThis = /** @class */ (function () {
        function DispatchModule_1() {
        }
        return DispatchModule_1;
    }());
    __setFunctionName(_classThis, "DispatchModule");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        DispatchModule = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return DispatchModule = _classThis;
}();
exports.DispatchModule = DispatchModule;
