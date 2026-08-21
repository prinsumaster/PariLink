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
exports.VendorSettlementsController = void 0;
var common_1 = require("@nestjs/common");
var swagger_1 = require("@nestjs/swagger");
var jwt_auth_guard_1 = require("../../../auth/guards/jwt-auth.guard");
var VendorSettlementsController = function () {
    var _classDecorators = [(0, swagger_1.ApiTags)('vendor-portal/settlements'), (0, swagger_1.ApiBearerAuth)(), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard), (0, common_1.Controller)('vendor-portal/settlements')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _getBills_decorators;
    var _getDashboardKpis_decorators;
    var VendorSettlementsController = _classThis = /** @class */ (function () {
        function VendorSettlementsController_1(vendorSettlementsService) {
            this.vendorSettlementsService = (__runInitializers(this, _instanceExtraInitializers), vendorSettlementsService);
        }
        VendorSettlementsController_1.prototype.getBills = function (user) {
            if (!user.vendorId)
                throw new common_1.UnauthorizedException('User is not associated with a Vendor account');
            return this.vendorSettlementsService.getBills(user.companyId, user.vendorId);
        };
        VendorSettlementsController_1.prototype.getDashboardKpis = function (user) {
            if (!user.vendorId)
                throw new common_1.UnauthorizedException('User is not associated with a Vendor account');
            return this.vendorSettlementsService.getDashboardKpis(user.companyId, user.vendorId);
        };
        return VendorSettlementsController_1;
    }());
    __setFunctionName(_classThis, "VendorSettlementsController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _getBills_decorators = [(0, common_1.Get)('bills'), (0, swagger_1.ApiOperation)({
                summary: 'Get all vendor bills (invoices submitted by vendor)',
            })];
        _getDashboardKpis_decorators = [(0, common_1.Get)('kpis'), (0, swagger_1.ApiOperation)({ summary: 'Get KPI summary for vendor settlements' })];
        __esDecorate(_classThis, null, _getBills_decorators, { kind: "method", name: "getBills", static: false, private: false, access: { has: function (obj) { return "getBills" in obj; }, get: function (obj) { return obj.getBills; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getDashboardKpis_decorators, { kind: "method", name: "getDashboardKpis", static: false, private: false, access: { has: function (obj) { return "getDashboardKpis" in obj; }, get: function (obj) { return obj.getDashboardKpis; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        VendorSettlementsController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return VendorSettlementsController = _classThis;
}();
exports.VendorSettlementsController = VendorSettlementsController;
