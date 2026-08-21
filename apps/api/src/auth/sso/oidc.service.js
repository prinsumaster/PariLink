"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
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
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.OidcService = void 0;
var common_1 = require("@nestjs/common");
var openid_client_1 = require("openid-client");
var crypto = __importStar(require("crypto"));
var OidcService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var OidcService = _classThis = /** @class */ (function () {
        function OidcService_1() {
        }
        OidcService_1.prototype.getClient = function (idp) {
            return __awaiter(this, void 0, void 0, function () {
                var issuer;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!idp.issuer || !idp.clientId || !idp.clientSecret) {
                                throw new common_1.BadRequestException('OIDC configuration incomplete');
                            }
                            return [4 /*yield*/, openid_client_1.Issuer.discover(idp.issuer).catch(function () {
                                    // Fallback if discovery fails but endpoints are provided manually
                                    return new openid_client_1.Issuer({
                                        issuer: idp.issuer,
                                        authorization_endpoint: idp.authorizationEndpoint,
                                        token_endpoint: idp.tokenEndpoint,
                                        userinfo_endpoint: idp.userinfoEndpoint,
                                        jwks_uri: idp.jwksUri,
                                    });
                                })];
                        case 1:
                            issuer = _a.sent();
                            return [2 /*return*/, new issuer.Client({
                                    client_id: idp.clientId,
                                    client_secret: idp.clientSecret,
                                    redirect_uris: [
                                        "".concat(process.env.APP_URL || 'http://localhost:3000', "/api/v1/auth/sso/callback/oidc/").concat(idp.id),
                                    ],
                                    response_types: ['code'],
                                })];
                    }
                });
            });
        };
        OidcService_1.prototype.generateLoginUrl = function (idp, req) {
            return __awaiter(this, void 0, void 0, function () {
                var client, nonce, state, url;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.getClient(idp)];
                        case 1:
                            client = _a.sent();
                            nonce = crypto.randomUUID();
                            state = req.query.state || crypto.randomUUID();
                            // Store nonce and state in session for callback validation
                            req.session = req.session || {};
                            req.session.oidcNonce = nonce;
                            req.session.oidcState = state;
                            url = client.authorizationUrl({
                                scope: 'openid email profile',
                                state: state,
                                nonce: nonce,
                            });
                            return [2 /*return*/, url];
                    }
                });
            });
        };
        OidcService_1.prototype.validateCallback = function (idp, input, req) {
            return __awaiter(this, void 0, void 0, function () {
                var client, params, sessionNonce, tokenSet, claims;
                var _a, _b, _c;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0: return [4 /*yield*/, this.getClient(idp)];
                        case 1:
                            client = _d.sent();
                            params = client.callbackParams(req);
                            sessionNonce = (_a = req.session) === null || _a === void 0 ? void 0 : _a.oidcNonce;
                            if (!sessionNonce) {
                                throw new common_1.BadRequestException('OIDC session state missing — possible CSRF');
                            }
                            return [4 /*yield*/, client.callback("".concat(process.env.APP_URL || 'http://localhost:3000', "/api/v1/auth/sso/callback/oidc/").concat(idp.id), params, { nonce: sessionNonce })];
                        case 2:
                            tokenSet = _d.sent();
                            // Clear session nonce after use (one-time use)
                            delete req.session.oidcNonce;
                            delete req.session.oidcState;
                            claims = tokenSet.claims();
                            return [2 /*return*/, {
                                    id: claims.sub,
                                    email: claims.email,
                                    firstName: claims.given_name || ((_b = claims.name) === null || _b === void 0 ? void 0 : _b.split(' ')[0]),
                                    lastName: claims.family_name || ((_c = claims.name) === null || _c === void 0 ? void 0 : _c.split(' ')[1]),
                                    sessionId: claims.sid || tokenSet.session_state,
                                    groups: claims.groups || claims.roles, // Entra ID/Okta usually puts this in roles or groups claim
                                }];
                    }
                });
            });
        };
        return OidcService_1;
    }());
    __setFunctionName(_classThis, "OidcService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        OidcService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return OidcService = _classThis;
}();
exports.OidcService = OidcService;
