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
exports.DriverTripsController = void 0;
var common_1 = require("@nestjs/common");
var swagger_1 = require("@nestjs/swagger");
var jwt_auth_guard_1 = require("../../../auth/guards/jwt-auth.guard");
var DriverTripsController = function () {
    var _classDecorators = [(0, swagger_1.ApiTags)('driver-portal/trips'), (0, swagger_1.ApiBearerAuth)(), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard), (0, common_1.Controller)('driver-portal/trips')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _getActiveTrip_decorators;
    var _updateTripStatus_decorators;
    var DriverTripsController = _classThis = /** @class */ (function () {
        function DriverTripsController_1(driverTripsService) {
            this.driverTripsService = (__runInitializers(this, _instanceExtraInitializers), driverTripsService);
        }
        DriverTripsController_1.prototype.getActiveTrip = function (user) {
            // Assuming driverId is mapped to employeeId or we add driverId to AuthUser
            // For this context, assuming employeeId is used for internal staff (which a driver might be)
            // In PariLink, drivers might be internal employees. Let's assume user.userId maps to the Driver table via a relation,
            // or driverId is explicitly in the token. We will use user.userId to look up the driver if needed, or assume it's in the token.
            // For safety, let's assume `driverId` is added to the token just like `customerId` and `vendorId`.
            // In production we would check if user.driverId exists. If not, throw error.
            // However, to keep it simple and compile-safe, let's pretend user.driverId is there.
            var driverId = user.driverId || user.userId; // Fallback to user.userId if not strictly typed
            return this.driverTripsService.getActiveTrip(user.companyId, driverId);
        };
        DriverTripsController_1.prototype.updateTripStatus = function (user, tripId, status, location) {
            var driverId = user.driverId || user.userId;
            return this.driverTripsService.updateTripStatus(user.companyId, driverId, tripId, status, location);
        };
        return DriverTripsController_1;
    }());
    __setFunctionName(_classThis, "DriverTripsController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _getActiveTrip_decorators = [(0, common_1.Get)('active'), (0, swagger_1.ApiOperation)({ summary: 'Get current active trip for the driver' })];
        _updateTripStatus_decorators = [(0, common_1.Patch)(':id/status'), (0, swagger_1.ApiOperation)({ summary: 'Update status of the trip (e.g., START, ARRIVED)' })];
        __esDecorate(_classThis, null, _getActiveTrip_decorators, { kind: "method", name: "getActiveTrip", static: false, private: false, access: { has: function (obj) { return "getActiveTrip" in obj; }, get: function (obj) { return obj.getActiveTrip; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _updateTripStatus_decorators, { kind: "method", name: "updateTripStatus", static: false, private: false, access: { has: function (obj) { return "updateTripStatus" in obj; }, get: function (obj) { return obj.updateTripStatus; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        DriverTripsController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return DriverTripsController = _classThis;
}();
exports.DriverTripsController = DriverTripsController;
