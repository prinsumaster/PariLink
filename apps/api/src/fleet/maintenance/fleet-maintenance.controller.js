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
exports.FleetMaintenanceController = void 0;
var common_1 = require("@nestjs/common");
var swagger_1 = require("@nestjs/swagger");
var jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
var FleetMaintenanceController = function () {
    var _classDecorators = [(0, swagger_1.ApiTags)('fleet/maintenance'), (0, swagger_1.ApiBearerAuth)(), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard), (0, common_1.Controller)('fleet/maintenance')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _getUpcomingMaintenance_decorators;
    var _reportBreakdown_decorators;
    var FleetMaintenanceController = _classThis = /** @class */ (function () {
        function FleetMaintenanceController_1(fleetMaintenanceService) {
            this.fleetMaintenanceService = (__runInitializers(this, _instanceExtraInitializers), fleetMaintenanceService);
        }
        FleetMaintenanceController_1.prototype.getUpcomingMaintenance = function (user) {
            return this.fleetMaintenanceService.getUpcomingMaintenance(user.companyId);
        };
        FleetMaintenanceController_1.prototype.reportBreakdown = function (user, vehicleId, description) {
            return this.fleetMaintenanceService.reportBreakdown(user.companyId, vehicleId, description);
        };
        return FleetMaintenanceController_1;
    }());
    __setFunctionName(_classThis, "FleetMaintenanceController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _getUpcomingMaintenance_decorators = [(0, common_1.Get)('upcoming'), (0, swagger_1.ApiOperation)({ summary: 'Get upcoming scheduled maintenance for the fleet' })];
        _reportBreakdown_decorators = [(0, common_1.Post)('breakdown'), (0, swagger_1.ApiOperation)({ summary: 'Report a sudden vehicle breakdown' })];
        __esDecorate(_classThis, null, _getUpcomingMaintenance_decorators, { kind: "method", name: "getUpcomingMaintenance", static: false, private: false, access: { has: function (obj) { return "getUpcomingMaintenance" in obj; }, get: function (obj) { return obj.getUpcomingMaintenance; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _reportBreakdown_decorators, { kind: "method", name: "reportBreakdown", static: false, private: false, access: { has: function (obj) { return "reportBreakdown" in obj; }, get: function (obj) { return obj.reportBreakdown; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        FleetMaintenanceController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return FleetMaintenanceController = _classThis;
}();
exports.FleetMaintenanceController = FleetMaintenanceController;
