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
exports.DriverExpensesController = void 0;
var common_1 = require("@nestjs/common");
var swagger_1 = require("@nestjs/swagger");
var jwt_auth_guard_1 = require("../../../auth/guards/jwt-auth.guard");
var DriverExpensesController = function () {
    var _classDecorators = [(0, swagger_1.ApiTags)('driver-portal/expenses'), (0, swagger_1.ApiBearerAuth)(), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard), (0, common_1.Controller)('driver-portal/expenses')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _getExpenses_decorators;
    var _submitExpense_decorators;
    var DriverExpensesController = _classThis = /** @class */ (function () {
        function DriverExpensesController_1(driverExpensesService) {
            this.driverExpensesService = (__runInitializers(this, _instanceExtraInitializers), driverExpensesService);
        }
        DriverExpensesController_1.prototype.getExpenses = function (user) {
            var driverId = user.driverId || user.userId;
            return this.driverExpensesService.getExpenses(user.companyId, driverId);
        };
        DriverExpensesController_1.prototype.submitExpense = function (user, tripId, type, amount, date, documentUrl) {
            var driverId = user.driverId || user.userId;
            return this.driverExpensesService.submitExpense(user.companyId, driverId, tripId, type, amount, date, documentUrl);
        };
        return DriverExpensesController_1;
    }());
    __setFunctionName(_classThis, "DriverExpensesController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _getExpenses_decorators = [(0, common_1.Get)(), (0, swagger_1.ApiOperation)({ summary: 'Get recent expenses submitted by the driver' })];
        _submitExpense_decorators = [(0, common_1.Post)('trips/:id'), (0, swagger_1.ApiOperation)({ summary: 'Submit an expense for a specific trip' })];
        __esDecorate(_classThis, null, _getExpenses_decorators, { kind: "method", name: "getExpenses", static: false, private: false, access: { has: function (obj) { return "getExpenses" in obj; }, get: function (obj) { return obj.getExpenses; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _submitExpense_decorators, { kind: "method", name: "submitExpense", static: false, private: false, access: { has: function (obj) { return "submitExpense" in obj; }, get: function (obj) { return obj.submitExpense; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        DriverExpensesController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return DriverExpensesController = _classThis;
}();
exports.DriverExpensesController = DriverExpensesController;
