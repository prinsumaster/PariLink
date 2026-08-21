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
exports.OAuth2Service = void 0;
var common_1 = require("@nestjs/common");
var crypto = __importStar(require("crypto"));
var OAuth2Service = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var OAuth2Service = _classThis = /** @class */ (function () {
        function OAuth2Service_1(prisma, audit) {
            this.prisma = prisma;
            this.audit = audit;
        }
        OAuth2Service_1.prototype.hashSecret = function (secret) {
            return crypto.createHash('sha256').update(secret).digest('hex');
        };
        OAuth2Service_1.prototype.generateClientCredentials = function () {
            return {
                clientId: "client_".concat(crypto.randomBytes(16).toString('hex')),
                clientSecret: "secret_".concat(crypto.randomBytes(32).toString('hex')),
            };
        };
        OAuth2Service_1.prototype.registerClient = function (companyId_1, name_1, description_1) {
            return __awaiter(this, arguments, void 0, function (companyId, name, description, scopes) {
                var _a, clientId, clientSecret, clientSecretHash, client;
                var _this = this;
                if (scopes === void 0) { scopes = []; }
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _a = this.generateClientCredentials(), clientId = _a.clientId, clientSecret = _a.clientSecret;
                            clientSecretHash = this.hashSecret(clientSecret);
                            return [4 /*yield*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.oAuthClient.create({
                                                data: {
                                                    companyId: companyId,
                                                    clientId: clientId,
                                                    clientSecret: clientSecretHash,
                                                    name: name,
                                                    description: description,
                                                    scopes: scopes,
                                                    grantTypes: ['client_credentials'],
                                                },
                                            })];
                                    });
                                }); })];
                        case 1:
                            client = _b.sent();
                            return [4 /*yield*/, this.audit.logEvent({
                                    companyId: companyId,
                                    entity: 'OAuthClient',
                                    entityId: client.id,
                                    action: 'CREATE',
                                    details: { name: name, scopes: scopes },
                                    source: 'IAM',
                                })];
                        case 2:
                            _b.sent();
                            // Return client secret only once
                            return [2 /*return*/, {
                                    id: client.id,
                                    clientId: clientId,
                                    clientSecret: clientSecret, // Plain text secret to be shown only once
                                    name: client.name,
                                    scopes: scopes,
                                }];
                    }
                });
            });
        };
        OAuth2Service_1.prototype.issueClientCredentialsToken = function (clientId_1, clientSecret_1) {
            return __awaiter(this, arguments, void 0, function (clientId, clientSecret, requestedScopes) {
                var secretHash, client, allowedScopes, grantedScopes, expiresIn, token, tokenHash, expiresAt;
                var _this = this;
                if (requestedScopes === void 0) { requestedScopes = []; }
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            secretHash = this.hashSecret(clientSecret);
                            return [4 /*yield*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.oAuthClient.findFirst({
                                                where: { clientId: clientId, clientSecret: secretHash, isActive: true },
                                                include: { company: true },
                                            })];
                                    });
                                }); })];
                        case 1:
                            client = _a.sent();
                            if (!client) {
                                throw new common_1.UnauthorizedException('Invalid client credentials');
                            }
                            allowedScopes = client.scopes || [];
                            grantedScopes = requestedScopes.length > 0
                                ? requestedScopes.filter(function (scope) { return allowedScopes.includes(scope); })
                                : allowedScopes;
                            expiresIn = 3600;
                            token = crypto.randomBytes(48).toString('base64url');
                            tokenHash = this.hashSecret(token);
                            expiresAt = new Date();
                            expiresAt.setSeconds(expiresAt.getSeconds() + expiresIn);
                            return [4 /*yield*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.oAuthToken.create({
                                                data: {
                                                    clientId: client.id,
                                                    tokenHash: tokenHash,
                                                    scopes: grantedScopes,
                                                    expiresAt: expiresAt,
                                                },
                                            })];
                                    });
                                }); })];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, this.audit.logEvent({
                                    companyId: client.companyId,
                                    entity: 'OAuthToken',
                                    entityId: client.id,
                                    action: 'CREATE',
                                    details: { scopes: grantedScopes },
                                    source: 'IAM',
                                })];
                        case 3:
                            _a.sent();
                            return [2 /*return*/, {
                                    access_token: token,
                                    token_type: 'Bearer',
                                    expires_in: expiresIn,
                                    scope: grantedScopes.join(' '),
                                }];
                    }
                });
            });
        };
        OAuth2Service_1.prototype.validateToken = function (token) {
            return __awaiter(this, void 0, void 0, function () {
                var tokenHash, oauthToken;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            tokenHash = this.hashSecret(token);
                            return [4 /*yield*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.oAuthToken.findUnique({
                                                where: { tokenHash: tokenHash },
                                                include: { client: { include: { company: true } } },
                                            })];
                                    });
                                }); })];
                        case 1:
                            oauthToken = _a.sent();
                            if (!oauthToken ||
                                oauthToken.revokedAt ||
                                oauthToken.expiresAt < new Date()) {
                                throw new common_1.UnauthorizedException('Invalid or expired token');
                            }
                            if (!oauthToken.client.isActive) {
                                throw new common_1.UnauthorizedException('OAuth Client is disabled');
                            }
                            return [2 /*return*/, oauthToken];
                    }
                });
            });
        };
        OAuth2Service_1.prototype.revokeToken = function (token) {
            return __awaiter(this, void 0, void 0, function () {
                var tokenHash, oauthToken;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            tokenHash = this.hashSecret(token);
                            return [4 /*yield*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.oAuthToken.findUnique({
                                                where: { tokenHash: tokenHash },
                                                include: { client: true },
                                            })];
                                    });
                                }); })];
                        case 1:
                            oauthToken = _a.sent();
                            if (!oauthToken) {
                                throw new common_1.NotFoundException('Token not found');
                            }
                            return [4 /*yield*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.oAuthToken.update({
                                                where: { id: oauthToken.id },
                                                data: { revokedAt: new Date() },
                                            })];
                                    });
                                }); })];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, this.audit.logEvent({
                                    companyId: oauthToken.client.companyId,
                                    entity: 'OAuthToken',
                                    entityId: oauthToken.id,
                                    action: 'REVOKE',
                                    source: 'IAM',
                                })];
                        case 3:
                            _a.sent();
                            return [2 /*return*/, { success: true }];
                    }
                });
            });
        };
        return OAuth2Service_1;
    }());
    __setFunctionName(_classThis, "OAuth2Service");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        OAuth2Service = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return OAuth2Service = _classThis;
}();
exports.OAuth2Service = OAuth2Service;
