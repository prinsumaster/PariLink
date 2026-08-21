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
exports.SsoController = void 0;
var common_1 = require("@nestjs/common");
var swagger_1 = require("@nestjs/swagger");
var SsoController = function () {
    var _classDecorators = [(0, swagger_1.ApiTags)('auth/sso'), (0, common_1.Controller)('auth/sso')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _initiateLogin_decorators;
    var _samlCallback_decorators;
    var _oidcCallback_decorators;
    var _oidcCallbackPost_decorators;
    var SsoController = _classThis = /** @class */ (function () {
        function SsoController_1(ssoService) {
            this.ssoService = (__runInitializers(this, _instanceExtraInitializers), ssoService);
        }
        SsoController_1.prototype.initiateLogin = function (idpId, res, req) {
            return __awaiter(this, void 0, void 0, function () {
                var redirectUrl;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.ssoService.generateLoginUrl(idpId, req)];
                        case 1:
                            redirectUrl = _a.sent();
                            return [2 /*return*/, res.redirect(redirectUrl)];
                    }
                });
            });
        };
        SsoController_1.prototype.samlCallback = function (idpId, body, res, req) {
            return __awaiter(this, void 0, void 0, function () {
                var result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.ssoService.handleSamlCallback(idpId, body, req)];
                        case 1:
                            result = _a.sent();
                            return [2 /*return*/, this.handleAuthResult(result, res)];
                    }
                });
            });
        };
        SsoController_1.prototype.oidcCallback = function (idpId, query, res, req) {
            return __awaiter(this, void 0, void 0, function () {
                var result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.ssoService.handleOidcCallback(idpId, query, req)];
                        case 1:
                            result = _a.sent();
                            return [2 /*return*/, this.handleAuthResult(result, res)];
                    }
                });
            });
        };
        SsoController_1.prototype.oidcCallbackPost = function (idpId, body, res, req) {
            return __awaiter(this, void 0, void 0, function () {
                var result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.ssoService.handleOidcCallback(idpId, body, req)];
                        case 1:
                            result = _a.sent();
                            return [2 /*return*/, this.handleAuthResult(result, res)];
                    }
                });
            });
        };
        SsoController_1.prototype.handleAuthResult = function (result, res) {
            if (result.error) {
                return res.redirect("/login?error=".concat(encodeURIComponent(result.error)));
            }
            if (result.requiresMfa) {
                // Need a way to pass the partial token to frontend. Usually URL params or cookie.
                res.cookie('mfa_token', result.mfaToken, {
                    domain: process.env.COOKIE_DOMAIN || undefined,
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'strict',
                    maxAge: 15 * 60 * 1000,
                });
                return res.redirect("/login/mfa?userId=".concat(result.user.id));
            }
            // Set refresh token
            res.cookie('refresh_token', result.refresh_token, {
                domain: process.env.COOKIE_DOMAIN || undefined,
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            });
            // Pass access token in URL fragment or a secure cookie. Standard is returning to a success page.
            return res.redirect("/sso-success?token=".concat(result.access_token));
        };
        return SsoController_1;
    }());
    __setFunctionName(_classThis, "SsoController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _initiateLogin_decorators = [(0, common_1.Get)('login/:idpId'), (0, swagger_1.ApiOperation)({ summary: 'Initiate SSO Login' })];
        _samlCallback_decorators = [(0, common_1.Post)('callback/saml/:idpId'), (0, swagger_1.ApiOperation)({ summary: 'SAML Callback URL' })];
        _oidcCallback_decorators = [(0, common_1.Get)('callback/oidc/:idpId'), (0, swagger_1.ApiOperation)({ summary: 'OIDC Callback URL' })];
        _oidcCallbackPost_decorators = [(0, common_1.Post)('callback/oidc/:idpId'), (0, swagger_1.ApiOperation)({ summary: 'OIDC Callback URL (POST)' })];
        __esDecorate(_classThis, null, _initiateLogin_decorators, { kind: "method", name: "initiateLogin", static: false, private: false, access: { has: function (obj) { return "initiateLogin" in obj; }, get: function (obj) { return obj.initiateLogin; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _samlCallback_decorators, { kind: "method", name: "samlCallback", static: false, private: false, access: { has: function (obj) { return "samlCallback" in obj; }, get: function (obj) { return obj.samlCallback; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _oidcCallback_decorators, { kind: "method", name: "oidcCallback", static: false, private: false, access: { has: function (obj) { return "oidcCallback" in obj; }, get: function (obj) { return obj.oidcCallback; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _oidcCallbackPost_decorators, { kind: "method", name: "oidcCallbackPost", static: false, private: false, access: { has: function (obj) { return "oidcCallbackPost" in obj; }, get: function (obj) { return obj.oidcCallbackPost; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        SsoController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return SsoController = _classThis;
}();
exports.SsoController = SsoController;
