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
exports.TrackingController = void 0;
var common_1 = require("@nestjs/common");
var jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
var permissions_guard_1 = require("../auth/guards/permissions.guard");
var permissions_decorator_1 = require("../auth/decorators/permissions.decorator");
var swagger_1 = require("@nestjs/swagger");
var TrackingController = function () {
    var _classDecorators = [(0, swagger_1.ApiTags)('tracking'), (0, swagger_1.ApiBearerAuth)(), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard), (0, common_1.Controller)('tracking')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _getLiveTracking_decorators;
    var _logLocation_decorators;
    var TrackingController = _classThis = /** @class */ (function () {
        function TrackingController_1(trackingService) {
            this.trackingService = (__runInitializers(this, _instanceExtraInitializers), trackingService);
        }
        TrackingController_1.prototype.getLiveTracking = function (user) {
            return this.trackingService.getLiveTracking(user.companyId);
        };
        TrackingController_1.prototype.logLocation = function (user, logLocationDto) {
            return this.trackingService.logLocation(user.companyId, logLocationDto);
        };
        return TrackingController_1;
    }());
    __setFunctionName(_classThis, "TrackingController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _getLiveTracking_decorators = [(0, common_1.Get)('live'), (0, permissions_decorator_1.RequirePermissions)('tracking:read'), (0, swagger_1.ApiOperation)({ summary: 'Get live tracking data for all active trips' })];
        _logLocation_decorators = [(0, common_1.Post)('location'), (0, permissions_decorator_1.RequirePermissions)('tracking:create'), (0, swagger_1.ApiOperation)({ summary: 'Log GPS locations (supports offline sync arrays)' })];
        __esDecorate(_classThis, null, _getLiveTracking_decorators, { kind: "method", name: "getLiveTracking", static: false, private: false, access: { has: function (obj) { return "getLiveTracking" in obj; }, get: function (obj) { return obj.getLiveTracking; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _logLocation_decorators, { kind: "method", name: "logLocation", static: false, private: false, access: { has: function (obj) { return "logLocation" in obj; }, get: function (obj) { return obj.logLocation; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        TrackingController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return TrackingController = _classThis;
}();
exports.TrackingController = TrackingController;
