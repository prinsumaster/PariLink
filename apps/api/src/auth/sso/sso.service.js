"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.SsoService = void 0;
var common_1 = require("@nestjs/common");
var crypto = __importStar(require("crypto"));
var SsoService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var SsoService = _classThis = /** @class */ (function () {
        function SsoService_1(auditService, prisma, authService, oidcService, samlService) {
            this.auditService = auditService;
            this.prisma = prisma;
            this.authService = authService;
            this.oidcService = oidcService;
            this.samlService = samlService;
            this.logger = new common_1.Logger(SsoService.name);
        }
        // ---------------------------------------------------------
        // Admin Operations
        // ---------------------------------------------------------
        SsoService_1.prototype.listProviders = function (companyId) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                return [2 /*return*/, tx.identityProvider.findMany({
                                        where: { companyId: companyId },
                                    })];
                            });
                        }); })];
                });
            });
        };
        SsoService_1.prototype.createProvider = function (companyId, payload, adminUserId) {
            return __awaiter(this, void 0, void 0, function () {
                var idp;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    return [2 /*return*/, tx.identityProvider.create({
                                            data: __assign(__assign({}, payload), { companyId: companyId }),
                                        })];
                                });
                            }); })];
                        case 1:
                            idp = _a.sent();
                            if (!adminUserId) return [3 /*break*/, 3];
                            return [4 /*yield*/, this.logAudit(companyId, adminUserId, 'IdentityProvider', idp.id, 'CREATE', { name: idp.name })];
                        case 2:
                            _a.sent();
                            _a.label = 3;
                        case 3: return [2 /*return*/, idp];
                    }
                });
            });
        };
        SsoService_1.prototype.updateProvider = function (companyId, idpId, payload, adminUserId) {
            return __awaiter(this, void 0, void 0, function () {
                var idp;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    return [2 /*return*/, tx.identityProvider.update({
                                            where: { id: idpId, companyId: companyId },
                                            data: payload,
                                        })];
                                });
                            }); })];
                        case 1:
                            idp = _a.sent();
                            if (!adminUserId) return [3 /*break*/, 3];
                            return [4 /*yield*/, this.logAudit(companyId, adminUserId, 'IdentityProvider', idp.id, 'UPDATE', { name: idp.name })];
                        case 2:
                            _a.sent();
                            _a.label = 3;
                        case 3: return [2 /*return*/, idp];
                    }
                });
            });
        };
        SsoService_1.prototype.deleteProvider = function (companyId, idpId, adminUserId) {
            return __awaiter(this, void 0, void 0, function () {
                var idp;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    return [2 /*return*/, tx.identityProvider.update({
                                            where: { id: idpId, companyId: companyId },
                                            data: { status: 'INACTIVE', deletedAt: new Date() },
                                        })];
                                });
                            }); })];
                        case 1:
                            idp = _a.sent();
                            if (!adminUserId) return [3 /*break*/, 3];
                            return [4 /*yield*/, this.logAudit(companyId, adminUserId, 'IdentityProvider', idp.id, 'DELETE', { name: idp.name })];
                        case 2:
                            _a.sent();
                            _a.label = 3;
                        case 3: return [2 /*return*/, { success: true }];
                    }
                });
            });
        };
        // ---------------------------------------------------------
        // Auth Flows
        // ---------------------------------------------------------
        SsoService_1.prototype.generateLoginUrl = function (idpId, req) {
            return __awaiter(this, void 0, void 0, function () {
                var idp;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.getProvider(idpId)];
                        case 1:
                            idp = _a.sent();
                            if (idp.type === 'OIDC') {
                                return [2 /*return*/, this.oidcService.generateLoginUrl(idp, req)];
                            }
                            else if (idp.type === 'SAML') {
                                return [2 /*return*/, this.samlService.generateLoginUrl(idp, req)];
                            }
                            throw new common_1.BadRequestException('Invalid IdP type');
                    }
                });
            });
        };
        SsoService_1.prototype.handleSamlCallback = function (idpId, body, req) {
            return __awaiter(this, void 0, void 0, function () {
                var idp, profile;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.getProvider(idpId)];
                        case 1:
                            idp = _a.sent();
                            return [4 /*yield*/, this.samlService.validateResponse(idp, body.SAMLResponse, req)];
                        case 2:
                            profile = _a.sent();
                            return [2 /*return*/, this.processSsoLogin(idp, profile, req)];
                    }
                });
            });
        };
        SsoService_1.prototype.handleOidcCallback = function (idpId, queryOrBody, req) {
            return __awaiter(this, void 0, void 0, function () {
                var idp, profile;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.getProvider(idpId)];
                        case 1:
                            idp = _a.sent();
                            return [4 /*yield*/, this.oidcService.validateCallback(idp, queryOrBody, req)];
                        case 2:
                            profile = _a.sent();
                            return [2 /*return*/, this.processSsoLogin(idp, profile, req)];
                    }
                });
            });
        };
        SsoService_1.prototype.getProvider = function (idpId) {
            return __awaiter(this, void 0, void 0, function () {
                var idp;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, tx.identityProvider.findUnique({ where: { id: idpId } })];
                            }); }); })];
                        case 1:
                            idp = _a.sent();
                            if (!idp || idp.status !== 'ACTIVE') {
                                throw new common_1.NotFoundException('Identity Provider not found or inactive');
                            }
                            return [2 /*return*/, idp];
                    }
                });
            });
        };
        SsoService_1.prototype.processSsoLogin = function (idp, profile, req) {
            return __awaiter(this, void 0, void 0, function () {
                var providerUserId, userIdentity, user, domains, emailDomain, mapping, _loop_1, this_1, _i, _a, group, state_1, ip, userAgent;
                var _this = this;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            providerUserId = profile.id;
                            return [4 /*yield*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.userIdentity.findUnique({
                                                where: {
                                                    identityProviderId_providerUserId: {
                                                        identityProviderId: idp.id,
                                                        providerUserId: providerUserId,
                                                    },
                                                },
                                                include: { user: true },
                                            })];
                                    });
                                }); })];
                        case 1:
                            userIdentity = _b.sent();
                            if (!!userIdentity) return [3 /*break*/, 8];
                            return [4 /*yield*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                    return [2 /*return*/, tx.user.findUnique({ where: { email: profile.email } })];
                                }); }); })];
                        case 2:
                            // Identity doesn't exist. Check if user with email exists.
                            user = _b.sent();
                            if (!!user) return [3 /*break*/, 5];
                            if (!idp.jitEnabled) {
                                throw new common_1.BadRequestException('User does not exist and JIT provisioning is disabled');
                            }
                            // JIT domain validation
                            if (idp.domainValidation) {
                                domains = idp.domainValidation
                                    .split(',')
                                    .map(function (d) { return d.trim().toLowerCase(); });
                                emailDomain = profile.email.split('@')[1].toLowerCase();
                                if (!domains.includes(emailDomain)) {
                                    throw new common_1.BadRequestException('Domain not allowed for SSO provisioning');
                                }
                            }
                            return [4 /*yield*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.user.create({
                                                data: {
                                                    email: profile.email,
                                                    firstName: profile.firstName || 'Unknown',
                                                    lastName: profile.lastName || 'Unknown',
                                                    password: crypto.randomUUID(), // Dummy password since they login via SSO
                                                    companyId: idp.companyId,
                                                    roleId: idp.jitDefaultRoleId || null,
                                                    status: 'ACTIVE',
                                                },
                                            })];
                                    });
                                }); })];
                        case 3:
                            // Create new user (JIT)
                            user = _b.sent();
                            this.logger.log("JIT provisioned user ".concat(user.id, " via SSO (IdP: ").concat(idp.id, ")"));
                            return [4 /*yield*/, this.logAudit(idp.companyId, user.id, 'User', user.id, 'CREATE_JIT_SSO', { idpId: idp.id })];
                        case 4:
                            _b.sent();
                            return [3 /*break*/, 6];
                        case 5:
                            // Enforce company boundary
                            if (user.companyId !== idp.companyId) {
                                throw new common_1.BadRequestException('User belongs to a different tenant');
                            }
                            _b.label = 6;
                        case 6: return [4 /*yield*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    return [2 /*return*/, tx.userIdentity.create({
                                            data: {
                                                userId: user.id,
                                                identityProviderId: idp.id,
                                                providerUserId: providerUserId,
                                                profileData: profile,
                                            },
                                            include: { user: true },
                                        })];
                                });
                            }); })];
                        case 7:
                            // Link identity
                            userIdentity = _b.sent();
                            return [3 /*break*/, 9];
                        case 8:
                            user = userIdentity.user;
                            if (user.status !== 'ACTIVE') {
                                throw new common_1.BadRequestException('User account is inactive');
                            }
                            // Update profile data in background
                            this.prisma
                                .runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    return [2 /*return*/, tx.userIdentity.update({
                                            where: { id: (userIdentity === null || userIdentity === void 0 ? void 0 : userIdentity.id) || '' },
                                            data: { profileData: profile, updatedAt: new Date() },
                                        })];
                                });
                            }); })
                                .catch(function (err) {
                                return _this.logger.error('Failed to update UserIdentity profile data', err);
                            });
                            _b.label = 9;
                        case 9:
                            if (!(idp.roleMapping &&
                                typeof idp.roleMapping === 'object' &&
                                profile.groups)) return [3 /*break*/, 13];
                            mapping = idp.roleMapping;
                            _loop_1 = function (group) {
                                var newRoleId_1;
                                return __generator(this, function (_c) {
                                    switch (_c.label) {
                                        case 0:
                                            if (!mapping[group]) return [3 /*break*/, 3];
                                            newRoleId_1 = mapping[group];
                                            if (!(user.roleId !== newRoleId_1)) return [3 /*break*/, 2];
                                            return [4 /*yield*/, this_1.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                                    return __generator(this, function (_a) {
                                                        return [2 /*return*/, tx.user.update({
                                                                where: { id: user.id },
                                                                data: { roleId: newRoleId_1 },
                                                            })];
                                                    });
                                                }); })];
                                        case 1:
                                            _c.sent();
                                            user.roleId = newRoleId_1;
                                            this_1.logger.log("Mapped user ".concat(user.id, " to role ").concat(newRoleId_1, " via SSO group ").concat(group));
                                            _c.label = 2;
                                        case 2: return [2 /*return*/, "break"];
                                        case 3: return [2 /*return*/];
                                    }
                                });
                            };
                            this_1 = this;
                            _i = 0, _a = profile.groups;
                            _b.label = 10;
                        case 10:
                            if (!(_i < _a.length)) return [3 /*break*/, 13];
                            group = _a[_i];
                            return [5 /*yield**/, _loop_1(group)];
                        case 11:
                            state_1 = _b.sent();
                            if (state_1 === "break")
                                return [3 /*break*/, 13];
                            _b.label = 12;
                        case 12:
                            _i++;
                            return [3 /*break*/, 10];
                        case 13:
                            if (!profile.sessionId) return [3 /*break*/, 15];
                            return [4 /*yield*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.ssoSession.upsert({
                                                where: {
                                                    identityProviderId_sessionId: {
                                                        identityProviderId: idp.id,
                                                        sessionId: profile.sessionId,
                                                    },
                                                },
                                                create: {
                                                    identityProviderId: idp.id,
                                                    sessionId: profile.sessionId,
                                                    userId: user.id,
                                                },
                                                update: { userId: user.id },
                                            })];
                                    });
                                }); })];
                        case 14:
                            _b.sent();
                            _b.label = 15;
                        case 15:
                            ip = req.ip || '0.0.0.0';
                            userAgent = req.headers['user-agent'] || 'Unknown';
                            return [4 /*yield*/, this.logAudit(idp.companyId, user.id, 'SsoSession', profile.sessionId || 'unknown', 'SSO_LOGIN', { idpId: idp.id, ip: ip })];
                        case 16:
                            _b.sent();
                            // Leverage existing auth service for JWT generation and MFA check
                            return [2 /*return*/, this.authService.issueTokensAfterLogin(user, ip, userAgent)];
                    }
                });
            });
        };
        SsoService_1.prototype.logAudit = function (companyId, userId, entity, entityId, action, details) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma
                                .runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    return [2 /*return*/, this.auditService.logEvent({
                                            companyId: companyId,
                                            userId: userId,
                                            entity: entity,
                                            entityId: entityId,
                                            action: action,
                                            details: details,
                                            source: 'SSO',
                                        }, null, tx)];
                                });
                            }); })
                                .catch(function (err) { return _this.logger.error('Failed to write audit log', err); })];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        return SsoService_1;
    }());
    __setFunctionName(_classThis, "SsoService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        SsoService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return SsoService = _classThis;
}();
exports.SsoService = SsoService;
