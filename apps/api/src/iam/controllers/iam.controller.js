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
exports.IamController = void 0;
var common_1 = require("@nestjs/common");
var swagger_1 = require("@nestjs/swagger");
var jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
var IamController = function () {
    var _classDecorators = [(0, swagger_1.ApiTags)('Enterprise IAM'), (0, common_1.Controller)('iam')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _createApiKey_decorators;
    var _revokeApiKey_decorators;
    var _createOAuthClient_decorators;
    var _createPat_decorators;
    var _revokePat_decorators;
    var _issueToken_decorators;
    var IamController = _classThis = /** @class */ (function () {
        function IamController_1(apiKeyService, oauth2Service, patService) {
            this.apiKeyService = (__runInitializers(this, _instanceExtraInitializers), apiKeyService);
            this.oauth2Service = oauth2Service;
            this.patService = patService;
        }
        IamController_1.prototype.createApiKey = function (dto, req) {
            return __awaiter(this, void 0, void 0, function () {
                var user;
                return __generator(this, function (_a) {
                    user = req.user;
                    return [2 /*return*/, this.apiKeyService.createApiKey(user.companyId, dto.name, dto.scopes, dto.userId, dto.environment, dto.expiresInDays)];
                });
            });
        };
        IamController_1.prototype.revokeApiKey = function (id, req) {
            return __awaiter(this, void 0, void 0, function () {
                var user;
                return __generator(this, function (_a) {
                    user = req.user;
                    return [2 /*return*/, this.apiKeyService.revokeApiKey(id, user.companyId, user.userId)];
                });
            });
        };
        IamController_1.prototype.createOAuthClient = function (dto, req) {
            return __awaiter(this, void 0, void 0, function () {
                var user;
                return __generator(this, function (_a) {
                    user = req.user;
                    return [2 /*return*/, this.oauth2Service.registerClient(user.companyId, dto.name, dto.description, dto.scopes)];
                });
            });
        };
        IamController_1.prototype.createPat = function (dto, req) {
            return __awaiter(this, void 0, void 0, function () {
                var user;
                return __generator(this, function (_a) {
                    user = req.user;
                    return [2 /*return*/, this.patService.createPat(user.userId, user.companyId, dto.name, dto.scopes, dto.expiresInDays)];
                });
            });
        };
        IamController_1.prototype.revokePat = function (id, req) {
            return __awaiter(this, void 0, void 0, function () {
                var user;
                return __generator(this, function (_a) {
                    user = req.user;
                    return [2 /*return*/, this.patService.revokePat(id, user.userId, user.companyId)];
                });
            });
        };
        IamController_1.prototype.issueToken = function (body) {
            return __awaiter(this, void 0, void 0, function () {
                var client_id, client_secret, scope, requestedScopes;
                return __generator(this, function (_a) {
                    client_id = body.client_id, client_secret = body.client_secret, scope = body.scope;
                    requestedScopes = scope ? scope.split(' ') : [];
                    return [2 /*return*/, this.oauth2Service.issueClientCredentialsToken(client_id, client_secret, requestedScopes)];
                });
            });
        };
        return IamController_1;
    }());
    __setFunctionName(_classThis, "IamController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _createApiKey_decorators = [(0, common_1.Post)('api-keys'), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard), (0, swagger_1.ApiBearerAuth)('JWT-auth'), (0, swagger_1.ApiOperation)({ summary: 'Create a new API Key' })];
        _revokeApiKey_decorators = [(0, common_1.Delete)('api-keys/:id'), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard), (0, swagger_1.ApiBearerAuth)('JWT-auth'), (0, swagger_1.ApiOperation)({ summary: 'Revoke an API Key' })];
        _createOAuthClient_decorators = [(0, common_1.Post)('oauth-clients'), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard), (0, swagger_1.ApiBearerAuth)('JWT-auth'), (0, swagger_1.ApiOperation)({ summary: 'Register a new OAuth2 Client' })];
        _createPat_decorators = [(0, common_1.Post)('pats'), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard), (0, swagger_1.ApiBearerAuth)('JWT-auth'), (0, swagger_1.ApiOperation)({ summary: 'Create a new Personal Access Token' })];
        _revokePat_decorators = [(0, common_1.Delete)('pats/:id'), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard), (0, swagger_1.ApiBearerAuth)('JWT-auth'), (0, swagger_1.ApiOperation)({ summary: 'Revoke a Personal Access Token' })];
        _issueToken_decorators = [(0, common_1.Post)('oauth/token'), (0, swagger_1.ApiOperation)({ summary: 'Get an OAuth2 Client Credentials Token' })];
        __esDecorate(_classThis, null, _createApiKey_decorators, { kind: "method", name: "createApiKey", static: false, private: false, access: { has: function (obj) { return "createApiKey" in obj; }, get: function (obj) { return obj.createApiKey; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _revokeApiKey_decorators, { kind: "method", name: "revokeApiKey", static: false, private: false, access: { has: function (obj) { return "revokeApiKey" in obj; }, get: function (obj) { return obj.revokeApiKey; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _createOAuthClient_decorators, { kind: "method", name: "createOAuthClient", static: false, private: false, access: { has: function (obj) { return "createOAuthClient" in obj; }, get: function (obj) { return obj.createOAuthClient; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _createPat_decorators, { kind: "method", name: "createPat", static: false, private: false, access: { has: function (obj) { return "createPat" in obj; }, get: function (obj) { return obj.createPat; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _revokePat_decorators, { kind: "method", name: "revokePat", static: false, private: false, access: { has: function (obj) { return "revokePat" in obj; }, get: function (obj) { return obj.revokePat; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _issueToken_decorators, { kind: "method", name: "issueToken", static: false, private: false, access: { has: function (obj) { return "issueToken" in obj; }, get: function (obj) { return obj.issueToken; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        IamController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return IamController = _classThis;
}();
exports.IamController = IamController;
