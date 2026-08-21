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
exports.DispatchController = void 0;
var common_1 = require("@nestjs/common");
var jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
var permissions_guard_1 = require("../auth/guards/permissions.guard");
var permissions_decorator_1 = require("../auth/decorators/permissions.decorator");
var swagger_1 = require("@nestjs/swagger");
var DispatchController = function () {
    var _classDecorators = [(0, swagger_1.ApiTags)('dispatch'), (0, swagger_1.ApiBearerAuth)(), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard), (0, common_1.Controller)('dispatch')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _getBoardData_decorators;
    var _moveBoardCard_decorators;
    var DispatchController = _classThis = /** @class */ (function () {
        function DispatchController_1(dispatchService) {
            this.dispatchService = (__runInitializers(this, _instanceExtraInitializers), dispatchService);
        }
        DispatchController_1.prototype.getBoardData = function (user) {
            return this.dispatchService.getBoardData(user.companyId);
        };
        DispatchController_1.prototype.moveBoardCard = function (user, body) {
            return this.dispatchService.moveBoardCard(user.companyId, body.loadId, body.status, body.boardPosition);
        };
        return DispatchController_1;
    }());
    __setFunctionName(_classThis, "DispatchController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _getBoardData_decorators = [(0, common_1.Get)('board'), (0, permissions_decorator_1.RequirePermissions)('dispatch:read'), (0, swagger_1.ApiOperation)({ summary: 'Get aggregated dispatch board data' })];
        _moveBoardCard_decorators = [(0, common_1.Put)('board/move'), (0, permissions_decorator_1.RequirePermissions)('dispatch:update'), (0, swagger_1.ApiOperation)({ summary: 'Update load status via Kanban drag and drop' })];
        __esDecorate(_classThis, null, _getBoardData_decorators, { kind: "method", name: "getBoardData", static: false, private: false, access: { has: function (obj) { return "getBoardData" in obj; }, get: function (obj) { return obj.getBoardData; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _moveBoardCard_decorators, { kind: "method", name: "moveBoardCard", static: false, private: false, access: { has: function (obj) { return "moveBoardCard" in obj; }, get: function (obj) { return obj.moveBoardCard; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        DispatchController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return DispatchController = _classThis;
}();
exports.DispatchController = DispatchController;
