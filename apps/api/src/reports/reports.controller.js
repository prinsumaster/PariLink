"use strict";
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
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
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportsController = void 0;
var common_1 = require("@nestjs/common");
var jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
var permissions_guard_1 = require("../auth/guards/permissions.guard");
var permissions_decorator_1 = require("../auth/decorators/permissions.decorator");
var swagger_1 = require("@nestjs/swagger");
var ReportsController = function () {
    var _classDecorators = [(0, swagger_1.ApiTags)('reports'), (0, swagger_1.ApiBearerAuth)(), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard), (0, common_1.Controller)('reports')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _getDashboardMetrics_decorators;
    var _getCustomerReport_decorators;
    var _getDriverReport_decorators;
    var _getVehicleReport_decorators;
    var ReportsController = _classThis = /** @class */ (function () {
        function ReportsController_1(reportsService) {
            this.reportsService = (__runInitializers(this, _instanceExtraInitializers), reportsService);
        }
        ReportsController_1.prototype.getDashboardMetrics = function (user) {
            return this.reportsService.getDashboardMetrics(user.companyId);
        };
        ReportsController_1.prototype.getCustomerReport = function (user) {
            return this.reportsService.getCustomerReport(user.companyId);
        };
        ReportsController_1.prototype.getDriverReport = function (user) {
            return this.reportsService.getDriverReport(user.companyId);
        };
        ReportsController_1.prototype.getVehicleReport = function (user) {
            return this.reportsService.getVehicleReport(user.companyId);
        };
        return ReportsController_1;
    }());
    __setFunctionName(_classThis, "ReportsController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _getDashboardMetrics_decorators = [(0, common_1.Get)('dashboard'), (0, permissions_decorator_1.RequirePermissions)('reports:read'), (0, swagger_1.ApiOperation)({ summary: 'Get overview dashboard metrics' })];
        _getCustomerReport_decorators = [(0, common_1.Get)('customers'), (0, permissions_decorator_1.RequirePermissions)('reports:read'), (0, swagger_1.ApiOperation)({ summary: 'Get customer-wise report' })];
        _getDriverReport_decorators = [(0, common_1.Get)('drivers'), (0, permissions_decorator_1.RequirePermissions)('reports:read'), (0, swagger_1.ApiOperation)({ summary: 'Get driver-wise report' })];
        _getVehicleReport_decorators = [(0, common_1.Get)('vehicles'), (0, permissions_decorator_1.RequirePermissions)('reports:read'), (0, swagger_1.ApiOperation)({ summary: 'Get vehicle-wise report' })];
        __esDecorate(_classThis, null, _getDashboardMetrics_decorators, { kind: "method", name: "getDashboardMetrics", static: false, private: false, access: { has: function (obj) { return "getDashboardMetrics" in obj; }, get: function (obj) { return obj.getDashboardMetrics; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getCustomerReport_decorators, { kind: "method", name: "getCustomerReport", static: false, private: false, access: { has: function (obj) { return "getCustomerReport" in obj; }, get: function (obj) { return obj.getCustomerReport; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getDriverReport_decorators, { kind: "method", name: "getDriverReport", static: false, private: false, access: { has: function (obj) { return "getDriverReport" in obj; }, get: function (obj) { return obj.getDriverReport; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getVehicleReport_decorators, { kind: "method", name: "getVehicleReport", static: false, private: false, access: { has: function (obj) { return "getVehicleReport" in obj; }, get: function (obj) { return obj.getVehicleReport; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ReportsController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ReportsController = _classThis;
}();
exports.ReportsController = ReportsController;
