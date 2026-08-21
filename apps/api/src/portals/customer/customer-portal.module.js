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
exports.CustomerPortalModule = void 0;
var common_1 = require("@nestjs/common");
var customer_loads_controller_1 = require("./loads/customer-loads.controller");
var customer_loads_service_1 = require("./loads/customer-loads.service");
var customer_finance_controller_1 = require("./finance/customer-finance.controller");
var customer_finance_service_1 = require("./finance/customer-finance.service");
var customer_analytics_controller_1 = require("./analytics/customer-analytics.controller");
var customer_analytics_service_1 = require("./analytics/customer-analytics.service");
var customer_tracking_controller_1 = require("./tracking/customer-tracking.controller");
var customer_tracking_service_1 = require("./tracking/customer-tracking.service");
var prisma_module_1 = require("../../prisma/prisma.module");
var CustomerPortalModule = function () {
    var _classDecorators = [(0, common_1.Module)({
            imports: [prisma_module_1.PrismaModule],
            controllers: [
                customer_loads_controller_1.CustomerLoadsController,
                customer_finance_controller_1.CustomerFinanceController,
                customer_analytics_controller_1.CustomerAnalyticsController,
                customer_tracking_controller_1.CustomerTrackingController,
            ],
            providers: [
                customer_loads_service_1.CustomerLoadsService,
                customer_finance_service_1.CustomerFinanceService,
                customer_analytics_service_1.CustomerAnalyticsService,
                customer_tracking_service_1.CustomerTrackingService,
            ],
            exports: [
                customer_loads_service_1.CustomerLoadsService,
                customer_finance_service_1.CustomerFinanceService,
                customer_analytics_service_1.CustomerAnalyticsService,
                customer_tracking_service_1.CustomerTrackingService,
            ],
        })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var CustomerPortalModule = _classThis = /** @class */ (function () {
        function CustomerPortalModule_1() {
        }
        return CustomerPortalModule_1;
    }());
    __setFunctionName(_classThis, "CustomerPortalModule");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        CustomerPortalModule = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return CustomerPortalModule = _classThis;
}();
exports.CustomerPortalModule = CustomerPortalModule;
