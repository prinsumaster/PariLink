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
exports.BillingController = void 0;
var common_1 = require("@nestjs/common");
var jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
var permissions_guard_1 = require("../auth/guards/permissions.guard");
var permissions_decorator_1 = require("../auth/decorators/permissions.decorator");
var swagger_1 = require("@nestjs/swagger");
var BillingController = function () {
    var _classDecorators = [(0, swagger_1.ApiTags)('billing'), (0, swagger_1.ApiBearerAuth)(), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard), (0, common_1.Controller)('billing')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _createRateCard_decorators;
    var _getRateCards_decorators;
    var _generateInvoice_decorators;
    var _approveInvoice_decorators;
    var BillingController = _classThis = /** @class */ (function () {
        function BillingController_1(billingService) {
            this.billingService = (__runInitializers(this, _instanceExtraInitializers), billingService);
        }
        BillingController_1.prototype.createRateCard = function (user, dto) {
            return this.billingService.createRateCard(user.companyId, dto, user.id);
        };
        BillingController_1.prototype.getRateCards = function (user, customerId) {
            return this.billingService.getRateCards(user.companyId, customerId);
        };
        BillingController_1.prototype.generateInvoice = function (user, dto) {
            return this.billingService.generateInvoice(user.companyId, dto, user.id);
        };
        BillingController_1.prototype.approveInvoice = function (user, id) {
            return this.billingService.approveInvoice(user.companyId, id, user.id);
        };
        return BillingController_1;
    }());
    __setFunctionName(_classThis, "BillingController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _createRateCard_decorators = [(0, common_1.Post)('rate-cards'), (0, permissions_decorator_1.RequirePermissions)('billing:write'), (0, swagger_1.ApiOperation)({ summary: 'Create a rate card for a customer' })];
        _getRateCards_decorators = [(0, common_1.Get)('rate-cards'), (0, permissions_decorator_1.RequirePermissions)('billing:read'), (0, swagger_1.ApiOperation)({ summary: 'Get active rate cards' })];
        _generateInvoice_decorators = [(0, common_1.Post)('invoices'), (0, permissions_decorator_1.RequirePermissions)('billing:write'), (0, swagger_1.ApiOperation)({ summary: 'Generate a draft invoice from a delivered load' })];
        _approveInvoice_decorators = [(0, common_1.Patch)('invoices/:id/approve'), (0, permissions_decorator_1.RequirePermissions)('billing:write'), (0, swagger_1.ApiOperation)({ summary: 'Approve an invoice and post to ledger' })];
        __esDecorate(_classThis, null, _createRateCard_decorators, { kind: "method", name: "createRateCard", static: false, private: false, access: { has: function (obj) { return "createRateCard" in obj; }, get: function (obj) { return obj.createRateCard; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getRateCards_decorators, { kind: "method", name: "getRateCards", static: false, private: false, access: { has: function (obj) { return "getRateCards" in obj; }, get: function (obj) { return obj.getRateCards; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _generateInvoice_decorators, { kind: "method", name: "generateInvoice", static: false, private: false, access: { has: function (obj) { return "generateInvoice" in obj; }, get: function (obj) { return obj.generateInvoice; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _approveInvoice_decorators, { kind: "method", name: "approveInvoice", static: false, private: false, access: { has: function (obj) { return "approveInvoice" in obj; }, get: function (obj) { return obj.approveInvoice; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        BillingController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return BillingController = _classThis;
}();
exports.BillingController = BillingController;
