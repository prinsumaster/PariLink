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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeveloperPlatformController = void 0;
var common_1 = require("@nestjs/common");
var swagger_1 = require("@nestjs/swagger");
var jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
var permissions_guard_1 = require("../../auth/guards/permissions.guard");
var permissions_decorator_1 = require("../../auth/decorators/permissions.decorator");
var DeveloperPlatformController = function () {
    var _classDecorators = [(0, swagger_1.ApiTags)('Developer Portal & API Platform'), (0, common_1.Controller)('integration/developer')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _getOpenApiSchema_decorators;
    var _listApiVersions_decorators;
    var _generateSdkSnippet_decorators;
    var _generateSampleRequest_decorators;
    var _createOAuthClient_decorators;
    var _listOAuthClients_decorators;
    var _revokeOAuthClient_decorators;
    var _getAnalytics_decorators;
    var _rotateApiKey_decorators;
    var _testWebhook_decorators;
    var DeveloperPlatformController = _classThis = /** @class */ (function () {
        function DeveloperPlatformController_1(devPlatform) {
            this.devPlatform = (__runInitializers(this, _instanceExtraInitializers), devPlatform);
        }
        DeveloperPlatformController_1.prototype.getOpenApiSchema = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.devPlatform.getOpenApiSchema()];
                });
            });
        };
        DeveloperPlatformController_1.prototype.listApiVersions = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.devPlatform.listApiVersions()];
                });
            });
        };
        DeveloperPlatformController_1.prototype.generateSdkSnippet = function (language) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.devPlatform.generateSdkSnippet(language)];
                });
            });
        };
        DeveloperPlatformController_1.prototype.generateSampleRequest = function (endpoint, method) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.devPlatform.generateSampleRequest(endpoint || '/integration/events/publish', method || 'POST')];
                });
            });
        };
        DeveloperPlatformController_1.prototype.createOAuthClient = function (user, dto) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.devPlatform.createOAuthClient(user.companyId, user.userId, dto)];
                });
            });
        };
        DeveloperPlatformController_1.prototype.listOAuthClients = function (user) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.devPlatform.listOAuthClients(user.companyId)];
                });
            });
        };
        DeveloperPlatformController_1.prototype.revokeOAuthClient = function (user, clientId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.devPlatform.revokeOAuthClient(user.companyId, clientId, user.userId)];
                });
            });
        };
        DeveloperPlatformController_1.prototype.getAnalytics = function (user) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.devPlatform.getApiUsageAnalytics(user.companyId)];
                });
            });
        };
        DeveloperPlatformController_1.prototype.rotateApiKey = function (user, keyId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.devPlatform.rotateApiKey(user.companyId, keyId, user.userId)];
                });
            });
        };
        DeveloperPlatformController_1.prototype.testWebhook = function (user, dto) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.devPlatform.testWebhookSandbox(user.companyId, dto)];
                });
            });
        };
        return DeveloperPlatformController_1;
    }());
    __setFunctionName(_classThis, "DeveloperPlatformController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _getOpenApiSchema_decorators = [(0, common_1.Get)('openapi.json'), (0, swagger_1.ApiOperation)({
                summary: 'Get OpenAPI 3.0 specification for PariLink Enterprise Integration Hub',
            })];
        _listApiVersions_decorators = [(0, common_1.Get)('versions'), (0, swagger_1.ApiOperation)({
                summary: 'List API versions, release dates, and deprecation lifecycle status',
            })];
        _generateSdkSnippet_decorators = [(0, common_1.Get)('sdk/:language'), (0, swagger_1.ApiOperation)({
                summary: 'Generate client SDK code snippets in TypeScript, Python, cURL, etc.',
            })];
        _generateSampleRequest_decorators = [(0, common_1.Get)('sample'), (0, swagger_1.ApiOperation)({
                summary: 'Generate sample JSON request payload and headers for testing',
            })];
        _createOAuthClient_decorators = [(0, swagger_1.ApiBearerAuth)(), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard), (0, common_1.Post)('oauth/clients'), (0, permissions_decorator_1.RequirePermissions)('api:write'), (0, swagger_1.ApiOperation)({
                summary: 'Create an OAuth2 application client for third-party integration',
            })];
        _listOAuthClients_decorators = [(0, swagger_1.ApiBearerAuth)(), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard), (0, common_1.Get)('oauth/clients'), (0, permissions_decorator_1.RequirePermissions)('api:read'), (0, swagger_1.ApiOperation)({ summary: 'List registered OAuth2 application clients' })];
        _revokeOAuthClient_decorators = [(0, swagger_1.ApiBearerAuth)(), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard), (0, common_1.Delete)('oauth/clients/:id'), (0, permissions_decorator_1.RequirePermissions)('api:write'), (0, swagger_1.ApiOperation)({ summary: 'Revoke an OAuth2 application client' })];
        _getAnalytics_decorators = [(0, swagger_1.ApiBearerAuth)(), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard), (0, common_1.Get)('analytics'), (0, permissions_decorator_1.RequirePermissions)('api:read'), (0, swagger_1.ApiOperation)({
                summary: 'Get API usage analytics, quotas, throttle rates, and error frequencies',
            })];
        _rotateApiKey_decorators = [(0, swagger_1.ApiBearerAuth)(), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard), (0, common_1.Post)('keys/:id/rotate'), (0, permissions_decorator_1.RequirePermissions)('api:write'), (0, swagger_1.ApiOperation)({ summary: 'Rotate an API key securely without downtime' })];
        _testWebhook_decorators = [(0, swagger_1.ApiBearerAuth)(), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard), (0, common_1.Post)('webhook/test'), (0, permissions_decorator_1.RequirePermissions)('webhooks:write'), (0, swagger_1.ApiOperation)({
                summary: 'Test webhook endpoint delivery in sandbox mode with live telemetry',
            })];
        __esDecorate(_classThis, null, _getOpenApiSchema_decorators, { kind: "method", name: "getOpenApiSchema", static: false, private: false, access: { has: function (obj) { return "getOpenApiSchema" in obj; }, get: function (obj) { return obj.getOpenApiSchema; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _listApiVersions_decorators, { kind: "method", name: "listApiVersions", static: false, private: false, access: { has: function (obj) { return "listApiVersions" in obj; }, get: function (obj) { return obj.listApiVersions; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _generateSdkSnippet_decorators, { kind: "method", name: "generateSdkSnippet", static: false, private: false, access: { has: function (obj) { return "generateSdkSnippet" in obj; }, get: function (obj) { return obj.generateSdkSnippet; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _generateSampleRequest_decorators, { kind: "method", name: "generateSampleRequest", static: false, private: false, access: { has: function (obj) { return "generateSampleRequest" in obj; }, get: function (obj) { return obj.generateSampleRequest; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _createOAuthClient_decorators, { kind: "method", name: "createOAuthClient", static: false, private: false, access: { has: function (obj) { return "createOAuthClient" in obj; }, get: function (obj) { return obj.createOAuthClient; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _listOAuthClients_decorators, { kind: "method", name: "listOAuthClients", static: false, private: false, access: { has: function (obj) { return "listOAuthClients" in obj; }, get: function (obj) { return obj.listOAuthClients; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _revokeOAuthClient_decorators, { kind: "method", name: "revokeOAuthClient", static: false, private: false, access: { has: function (obj) { return "revokeOAuthClient" in obj; }, get: function (obj) { return obj.revokeOAuthClient; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getAnalytics_decorators, { kind: "method", name: "getAnalytics", static: false, private: false, access: { has: function (obj) { return "getAnalytics" in obj; }, get: function (obj) { return obj.getAnalytics; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _rotateApiKey_decorators, { kind: "method", name: "rotateApiKey", static: false, private: false, access: { has: function (obj) { return "rotateApiKey" in obj; }, get: function (obj) { return obj.rotateApiKey; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _testWebhook_decorators, { kind: "method", name: "testWebhook", static: false, private: false, access: { has: function (obj) { return "testWebhook" in obj; }, get: function (obj) { return obj.testWebhook; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        DeveloperPlatformController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return DeveloperPlatformController = _classThis;
}();
exports.DeveloperPlatformController = DeveloperPlatformController;
