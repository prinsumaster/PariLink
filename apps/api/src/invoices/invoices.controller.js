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
exports.InvoicesController = void 0;
var common_1 = require("@nestjs/common");
var jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
var permissions_guard_1 = require("../auth/guards/permissions.guard");
var permissions_decorator_1 = require("../auth/decorators/permissions.decorator");
var swagger_1 = require("@nestjs/swagger");
var InvoicesController = function () {
    var _classDecorators = [(0, swagger_1.ApiTags)('invoices'), (0, swagger_1.ApiBearerAuth)(), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard), (0, common_1.Controller)('invoices')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _getInvoices_decorators;
    var _getInvoiceById_decorators;
    var _createInvoice_decorators;
    var _updateStatus_decorators;
    var InvoicesController = _classThis = /** @class */ (function () {
        function InvoicesController_1(invoicesService) {
            this.invoicesService = (__runInitializers(this, _instanceExtraInitializers), invoicesService);
        }
        InvoicesController_1.prototype.getInvoices = function (user, page, limit, sort, order) {
            return this.invoicesService.getInvoices(user.companyId, page ? parseInt(page, 10) : undefined, limit ? parseInt(limit, 10) : undefined, sort, order);
        };
        InvoicesController_1.prototype.getInvoiceById = function (user, id) {
            return this.invoicesService.getInvoiceById(user.companyId, id);
        };
        InvoicesController_1.prototype.createInvoice = function (user, payload) {
            return this.invoicesService.createInvoice(user.companyId, payload, user.id);
        };
        InvoicesController_1.prototype.updateStatus = function (user, id, body) {
            return this.invoicesService.updateInvoiceStatus(user.companyId, id, body.status, user.id);
        };
        return InvoicesController_1;
    }());
    __setFunctionName(_classThis, "InvoicesController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _getInvoices_decorators = [(0, common_1.Get)(), (0, permissions_decorator_1.RequirePermissions)('invoices:read'), (0, swagger_1.ApiOperation)({ summary: 'Get all invoices' })];
        _getInvoiceById_decorators = [(0, common_1.Get)(':id'), (0, permissions_decorator_1.RequirePermissions)('invoices:read'), (0, swagger_1.ApiOperation)({ summary: 'Get an invoice by ID' })];
        _createInvoice_decorators = [(0, common_1.Post)(), (0, permissions_decorator_1.RequirePermissions)('invoices:write'), (0, swagger_1.ApiOperation)({ summary: 'Create a new invoice' })];
        _updateStatus_decorators = [(0, common_1.Patch)(':id/status'), (0, permissions_decorator_1.RequirePermissions)('invoices:write'), (0, swagger_1.ApiOperation)({ summary: 'Update invoice status' })];
        __esDecorate(_classThis, null, _getInvoices_decorators, { kind: "method", name: "getInvoices", static: false, private: false, access: { has: function (obj) { return "getInvoices" in obj; }, get: function (obj) { return obj.getInvoices; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getInvoiceById_decorators, { kind: "method", name: "getInvoiceById", static: false, private: false, access: { has: function (obj) { return "getInvoiceById" in obj; }, get: function (obj) { return obj.getInvoiceById; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _createInvoice_decorators, { kind: "method", name: "createInvoice", static: false, private: false, access: { has: function (obj) { return "createInvoice" in obj; }, get: function (obj) { return obj.createInvoice; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _updateStatus_decorators, { kind: "method", name: "updateStatus", static: false, private: false, access: { has: function (obj) { return "updateStatus" in obj; }, get: function (obj) { return obj.updateStatus; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        InvoicesController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return InvoicesController = _classThis;
}();
exports.InvoicesController = InvoicesController;
