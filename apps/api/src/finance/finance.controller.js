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
exports.FinanceController = void 0;
var common_1 = require("@nestjs/common");
var jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
var permissions_guard_1 = require("../auth/guards/permissions.guard");
var permissions_decorator_1 = require("../auth/decorators/permissions.decorator");
var swagger_1 = require("@nestjs/swagger");
var FinanceController = function () {
    var _classDecorators = [(0, swagger_1.ApiTags)('finance'), (0, swagger_1.ApiBearerAuth)(), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard), (0, common_1.Controller)('finance')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _getInvoices_decorators;
    var _getExpenses_decorators;
    var _createExpense_decorators;
    var _createSettlement_decorators;
    var _createVendorBill_decorators;
    var _recordPayment_decorators;
    var FinanceController = _classThis = /** @class */ (function () {
        function FinanceController_1(financeService) {
            this.financeService = (__runInitializers(this, _instanceExtraInitializers), financeService);
        }
        FinanceController_1.prototype.getInvoices = function (user, req) {
            return this.financeService.getInvoices(user.companyId, req.query);
        };
        FinanceController_1.prototype.getExpenses = function (user, req) {
            return this.financeService.getExpenses(user.companyId, req.query);
        };
        FinanceController_1.prototype.createExpense = function (user, dto) {
            return this.financeService.createExpense(user.companyId, dto, user.id);
        };
        FinanceController_1.prototype.createSettlement = function (user, dto) {
            return this.financeService.createSettlement(user.companyId, dto, user.id);
        };
        FinanceController_1.prototype.createVendorBill = function (user, dto) {
            return this.financeService.createVendorBill(user.companyId, dto, user.id);
        };
        FinanceController_1.prototype.recordPayment = function (user, dto) {
            return this.financeService.recordPayment(user.companyId, dto, user.id);
        };
        return FinanceController_1;
    }());
    __setFunctionName(_classThis, "FinanceController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _getInvoices_decorators = [(0, common_1.Get)('invoices'), (0, permissions_decorator_1.RequirePermissions)('finance:read'), (0, swagger_1.ApiOperation)({ summary: 'Get invoices' })];
        _getExpenses_decorators = [(0, common_1.Get)('expenses'), (0, permissions_decorator_1.RequirePermissions)('finance:read'), (0, swagger_1.ApiOperation)({ summary: 'Get expenses' })];
        _createExpense_decorators = [(0, common_1.Post)('expenses'), (0, permissions_decorator_1.RequirePermissions)('finance:write'), (0, swagger_1.ApiOperation)({ summary: 'Log an expense' })];
        _createSettlement_decorators = [(0, common_1.Post)('settlements'), (0, permissions_decorator_1.RequirePermissions)('finance:write'), (0, swagger_1.ApiOperation)({ summary: 'Create driver settlement' })];
        _createVendorBill_decorators = [(0, common_1.Post)('vendor-bills'), (0, permissions_decorator_1.RequirePermissions)('finance:write'), (0, swagger_1.ApiOperation)({ summary: 'Create vendor bill' })];
        _recordPayment_decorators = [(0, common_1.Post)('payments'), (0, permissions_decorator_1.RequirePermissions)('finance:write'), (0, swagger_1.ApiOperation)({ summary: 'Record customer payment and post to ledger' })];
        __esDecorate(_classThis, null, _getInvoices_decorators, { kind: "method", name: "getInvoices", static: false, private: false, access: { has: function (obj) { return "getInvoices" in obj; }, get: function (obj) { return obj.getInvoices; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getExpenses_decorators, { kind: "method", name: "getExpenses", static: false, private: false, access: { has: function (obj) { return "getExpenses" in obj; }, get: function (obj) { return obj.getExpenses; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _createExpense_decorators, { kind: "method", name: "createExpense", static: false, private: false, access: { has: function (obj) { return "createExpense" in obj; }, get: function (obj) { return obj.createExpense; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _createSettlement_decorators, { kind: "method", name: "createSettlement", static: false, private: false, access: { has: function (obj) { return "createSettlement" in obj; }, get: function (obj) { return obj.createSettlement; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _createVendorBill_decorators, { kind: "method", name: "createVendorBill", static: false, private: false, access: { has: function (obj) { return "createVendorBill" in obj; }, get: function (obj) { return obj.createVendorBill; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _recordPayment_decorators, { kind: "method", name: "recordPayment", static: false, private: false, access: { has: function (obj) { return "recordPayment" in obj; }, get: function (obj) { return obj.recordPayment; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        FinanceController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return FinanceController = _classThis;
}();
exports.FinanceController = FinanceController;
