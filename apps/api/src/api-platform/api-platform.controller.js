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
exports.ApiPlatformController = void 0;
var common_1 = require("@nestjs/common");
var jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
var permissions_guard_1 = require("../auth/guards/permissions.guard");
var permissions_decorator_1 = require("../auth/decorators/permissions.decorator");
var swagger_1 = require("@nestjs/swagger");
var ApiPlatformController = function () {
    var _classDecorators = [(0, swagger_1.ApiTags)('api-platform'), (0, swagger_1.ApiBearerAuth)(), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard), (0, common_1.Controller)('api-platform')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _createApiKey_decorators;
    var _getApiKeys_decorators;
    var _registerWebhook_decorators;
    var _getWebhooks_decorators;
    var ApiPlatformController = _classThis = /** @class */ (function () {
        function ApiPlatformController_1(apiPlatformService) {
            this.apiPlatformService = (__runInitializers(this, _instanceExtraInitializers), apiPlatformService);
        }
        ApiPlatformController_1.prototype.createApiKey = function (user, dto) {
            return this.apiPlatformService.createApiKey(user.companyId, dto);
        };
        ApiPlatformController_1.prototype.getApiKeys = function (user) {
            return this.apiPlatformService.getApiKeys(user.companyId);
        };
        ApiPlatformController_1.prototype.registerWebhook = function (user, dto) {
            return this.apiPlatformService.registerWebhook(user.companyId, dto);
        };
        ApiPlatformController_1.prototype.getWebhooks = function (user) {
            return this.apiPlatformService.getWebhooks(user.companyId);
        };
        return ApiPlatformController_1;
    }());
    __setFunctionName(_classThis, "ApiPlatformController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _createApiKey_decorators = [(0, common_1.Post)('keys'), (0, permissions_decorator_1.RequirePermissions)('api:write'), (0, swagger_1.ApiOperation)({ summary: 'Generate a new API key' })];
        _getApiKeys_decorators = [(0, common_1.Get)('keys'), (0, permissions_decorator_1.RequirePermissions)('api:read'), (0, swagger_1.ApiOperation)({ summary: 'Get active API keys' })];
        _registerWebhook_decorators = [(0, common_1.Post)('webhooks'), (0, permissions_decorator_1.RequirePermissions)('api:write'), (0, swagger_1.ApiOperation)({ summary: 'Register a webhook endpoint' })];
        _getWebhooks_decorators = [(0, common_1.Get)('webhooks'), (0, permissions_decorator_1.RequirePermissions)('api:read'), (0, swagger_1.ApiOperation)({ summary: 'Get registered webhooks' })];
        __esDecorate(_classThis, null, _createApiKey_decorators, { kind: "method", name: "createApiKey", static: false, private: false, access: { has: function (obj) { return "createApiKey" in obj; }, get: function (obj) { return obj.createApiKey; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getApiKeys_decorators, { kind: "method", name: "getApiKeys", static: false, private: false, access: { has: function (obj) { return "getApiKeys" in obj; }, get: function (obj) { return obj.getApiKeys; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _registerWebhook_decorators, { kind: "method", name: "registerWebhook", static: false, private: false, access: { has: function (obj) { return "registerWebhook" in obj; }, get: function (obj) { return obj.registerWebhook; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getWebhooks_decorators, { kind: "method", name: "getWebhooks", static: false, private: false, access: { has: function (obj) { return "getWebhooks" in obj; }, get: function (obj) { return obj.getWebhooks; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ApiPlatformController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ApiPlatformController = _classThis;
}();
exports.ApiPlatformController = ApiPlatformController;
