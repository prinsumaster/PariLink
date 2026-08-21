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
exports.DigitalTwinModule = void 0;
var common_1 = require("@nestjs/common");
var event_store_service_1 = require("./event-store.service");
var twins_module_1 = require("./twins/twins.module");
var quality_engine_service_1 = require("./data-fabric/quality-engine.service");
var fusion_engine_service_1 = require("./data-fabric/fusion-engine.service");
var digital_twin_core_service_1 = require("./data-fabric/digital-twin-core.service");
var enterprise_graph_service_1 = require("./graph/enterprise-graph.service");
var twin_sync_service_1 = require("./sync/twin-sync.service");
var prediction_engine_1 = require("./prediction/prediction.engine");
var simulation_engine_1 = require("./simulation/simulation.engine");
var DigitalTwinModule = function () {
    var _classDecorators = [(0, common_1.Global)(), (0, common_1.Module)({
            imports: [twins_module_1.TwinsModule],
            providers: [
                event_store_service_1.EventStoreService,
                quality_engine_service_1.DataQualityEngine,
                fusion_engine_service_1.FusionEngineService,
                digital_twin_core_service_1.DigitalTwinCoreService,
                enterprise_graph_service_1.EnterpriseGraphService,
                twin_sync_service_1.TwinSyncService,
                prediction_engine_1.PredictionEngine,
                simulation_engine_1.SimulationEngine,
            ],
            exports: [
                event_store_service_1.EventStoreService,
                twins_module_1.TwinsModule,
                digital_twin_core_service_1.DigitalTwinCoreService,
                enterprise_graph_service_1.EnterpriseGraphService,
                twin_sync_service_1.TwinSyncService,
                prediction_engine_1.PredictionEngine,
                simulation_engine_1.SimulationEngine,
            ],
        })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var DigitalTwinModule = _classThis = /** @class */ (function () {
        function DigitalTwinModule_1() {
        }
        return DigitalTwinModule_1;
    }());
    __setFunctionName(_classThis, "DigitalTwinModule");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        DigitalTwinModule = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return DigitalTwinModule = _classThis;
}();
exports.DigitalTwinModule = DigitalTwinModule;
