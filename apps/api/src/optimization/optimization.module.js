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
exports.OptimizationModule = void 0;
var common_1 = require("@nestjs/common");
var optimization_controller_1 = require("./optimization.controller");
var network_state_service_1 = require("./engine/network-state.service");
var cost_estimator_service_1 = require("./engine/cost-estimator.service");
var heuristic_optimizer_service_1 = require("./engine/heuristic-optimizer.service");
var orchestration_service_1 = require("./engine/orchestration.service");
var dispatch_module_1 = require("../dispatch/dispatch.module");
var vrp_solver_service_1 = require("./engine/vrp-solver.service");
var scoring_service_1 = require("./engine/scoring.service");
var simulation_service_1 = require("./engine/simulation.service");
var feedback_service_1 = require("./feedback/feedback.service");
var feedback_controller_1 = require("./feedback/feedback.controller");
var optimization_analytics_service_1 = require("./analytics/optimization-analytics.service");
var OptimizationModule = function () {
    var _classDecorators = [(0, common_1.Module)({
            imports: [dispatch_module_1.DispatchModule],
            controllers: [optimization_controller_1.OptimizationController, feedback_controller_1.FeedbackController],
            providers: [
                network_state_service_1.NetworkStateService,
                cost_estimator_service_1.CostEstimatorService,
                heuristic_optimizer_service_1.HeuristicOptimizerService,
                orchestration_service_1.OrchestrationService,
                vrp_solver_service_1.VrpSolverService,
                scoring_service_1.ScoringService,
                simulation_service_1.SimulationService,
                feedback_service_1.FeedbackService,
                optimization_analytics_service_1.OptimizationAnalyticsService,
            ],
            exports: [
                heuristic_optimizer_service_1.HeuristicOptimizerService,
                orchestration_service_1.OrchestrationService,
                simulation_service_1.SimulationService,
                optimization_analytics_service_1.OptimizationAnalyticsService,
            ],
        })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var OptimizationModule = _classThis = /** @class */ (function () {
        function OptimizationModule_1() {
        }
        return OptimizationModule_1;
    }());
    __setFunctionName(_classThis, "OptimizationModule");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        OptimizationModule = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return OptimizationModule = _classThis;
}();
exports.OptimizationModule = OptimizationModule;
