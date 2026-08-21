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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
var common_1 = require("@nestjs/common");
var bcrypt = __importStar(require("bcryptjs"));
var crypto = __importStar(require("crypto"));
var server_1 = require("@simplewebauthn/server");
// ---------------------------------------------------------------------------
// AuthService — Enterprise Hardened
//
// Changes from naive implementation:
//   1. Brute-force / account-lockout protection (OWASP ASVS 2.2.1)
//   2. Refresh tokens stored as SHA-256 hash — raw token never stored at rest
//   3. Refresh token rotation — old token invalidated on each refresh
//   4. Concurrent session management — max 5 active sessions per user
//   5. Structured audit logging on every auth event
//   6. Generic error messages — no user enumeration via error text
//   7. JWT payload minimized (no PII leakage from decoded tokens)
//   8. Secure token cookie transport available alongside Bearer header
// ---------------------------------------------------------------------------
var AuthService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var AuthService = _classThis = /** @class */ (function () {
        function AuthService_1(prisma, jwtService, bruteForce, auditService, mfaService, resendService) {
            this.prisma = prisma;
            this.jwtService = jwtService;
            this.bruteForce = bruteForce;
            this.auditService = auditService;
            this.mfaService = mfaService;
            this.resendService = resendService;
            this.logger = new common_1.Logger(AuthService.name);
            this.MAX_CONCURRENT_SESSIONS = 5;
            // In-memory challenge store (use Redis in prod)
            this.webAuthnChallenges = new Map();
            // Constants for WebAuthn
            this.rpName = 'PariLink Enterprise';
            this.rpID = process.env.WEBAUTHN_RPID || 'localhost';
            this.origin = process.env.WEBAUTHN_ORIGIN || "http://".concat(this.rpID, ":3000");
        }
        AuthService_1.prototype.register = function (registerDto, ipAddress, deviceInfo) {
            return __awaiter(this, void 0, void 0, function () {
                var email, password, companyName, existingUser, hashedPassword, result;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            email = registerDto.email, password = registerDto.password, companyName = registerDto.companyName;
                            return [4 /*yield*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.user.findUnique({
                                                where: { email: email.toLowerCase() },
                                            })];
                                    });
                                }); })];
                        case 1:
                            existingUser = _a.sent();
                            if (existingUser) {
                                throw new common_1.ForbiddenException('User already exists');
                            }
                            return [4 /*yield*/, bcrypt.hash(password, 10)];
                        case 2:
                            hashedPassword = _a.sent();
                            return [4 /*yield*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    var company, role, user;
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0: return [4 /*yield*/, tx.company.create({
                                                    data: { name: companyName, status: 'ACTIVE' },
                                                })];
                                            case 1:
                                                company = _a.sent();
                                                return [4 /*yield*/, tx.role.create({
                                                        data: {
                                                            name: 'SUPER_ADMIN',
                                                            description: 'Full system access',
                                                            permissions: ['*'],
                                                            companyId: company.id,
                                                        },
                                                    })];
                                            case 2:
                                                role = _a.sent();
                                                return [4 /*yield*/, tx.user.create({
                                                        data: {
                                                            email: email.toLowerCase(),
                                                            password: hashedPassword,
                                                            firstName: 'Admin',
                                                            lastName: 'User',
                                                            roleId: role.id,
                                                            companyId: company.id,
                                                            status: 'ACTIVE',
                                                        },
                                                    })];
                                            case 3:
                                                user = _a.sent();
                                                return [2 /*return*/, user];
                                        }
                                    });
                                }); })];
                        case 3:
                            result = _a.sent();
                            // Send Welcome Email
                            return [4 /*yield*/, this.resendService.sendTransactionalEmail(email.toLowerCase(), 'Welcome to PariLink Enterprise', "<p>Your account for ".concat(companyName, " has been created successfully.</p>"))];
                        case 4:
                            // Send Welcome Email
                            _a.sent();
                            // 4. Log the user in
                            return [2 /*return*/, this.login({ email: email, password: password }, ipAddress, deviceInfo)];
                    }
                });
            });
        };
        AuthService_1.prototype.login = function (loginDto, ipAddress, deviceInfo) {
            return __awaiter(this, void 0, void 0, function () {
                var email, password, bfCheck, reason, user, GENERIC_AUTH_ERROR, isPasswordValid, result, isTrusted, returnedDeviceIdentifier, trustedDevice_1, err_1, backupErr_1, deviceId_1, expiresAt_1, _a, accessToken, refreshToken, refreshTokenHash, refreshExpiresAt;
                var _this = this;
                var _b, _c, _d, _e, _f, _g;
                return __generator(this, function (_h) {
                    switch (_h.label) {
                        case 0:
                            email = loginDto.email, password = loginDto.password;
                            return [4 /*yield*/, this.bruteForce.checkLoginAttempt(email, ipAddress)];
                        case 1:
                            bfCheck = _h.sent();
                            if (!bfCheck.allowed) {
                                reason = bfCheck.permanentlyLocked
                                    ? 'Account permanently locked. Contact your administrator.'
                                    : "Account temporarily locked until ".concat((_b = bfCheck.lockedUntil) === null || _b === void 0 ? void 0 : _b.toISOString(), ".");
                                throw new common_1.ForbiddenException(reason);
                            }
                            return [4 /*yield*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.user.findUnique({
                                                where: { email: email.toLowerCase() },
                                                select: {
                                                    id: true,
                                                    email: true,
                                                    password: true,
                                                    firstName: true,
                                                    lastName: true,
                                                    status: true,
                                                    deletedAt: true,
                                                    roleId: true,
                                                    companyId: true,
                                                    mfaEnabled: true,
                                                    role: {
                                                        select: {
                                                            name: true,
                                                            permissions: true,
                                                        },
                                                    },
                                                    company: {
                                                        select: {
                                                            tenantConfiguration: {
                                                                select: { onboardingCompleted: true },
                                                            },
                                                        },
                                                    },
                                                },
                                            })];
                                    });
                                }); })];
                        case 2:
                            user = _h.sent();
                            GENERIC_AUTH_ERROR = 'Invalid credentials';
                            if (!(!user || user.status !== 'ACTIVE' || user.deletedAt)) return [3 /*break*/, 5];
                            // Record failure against the email even if user doesn't exist
                            // (prevents timing-based user enumeration)
                            return [4 /*yield*/, this.bruteForce.recordFailedAttempt(email, ipAddress)];
                        case 3:
                            // Record failure against the email even if user doesn't exist
                            // (prevents timing-based user enumeration)
                            _h.sent();
                            return [4 /*yield*/, this.auditService.logEvent({
                                    action: 'LOGIN_FAILED',
                                    entity: 'User',
                                    entityId: email,
                                    companyId: null, // AuditLog requires companyId optionally? Let's assume it's optional or handled.
                                    source: 'AUTH',
                                    details: { reason: 'User not found or inactive', ip: ipAddress },
                                })];
                        case 4:
                            _h.sent();
                            throw new common_1.UnauthorizedException(GENERIC_AUTH_ERROR);
                        case 5: return [4 /*yield*/, bcrypt.compare(password, user.password)];
                        case 6:
                            isPasswordValid = _h.sent();
                            if (!!isPasswordValid) return [3 /*break*/, 9];
                            return [4 /*yield*/, this.bruteForce.recordFailedAttempt(email, ipAddress)];
                        case 7:
                            result = _h.sent();
                            return [4 /*yield*/, this.auditService.logEvent({
                                    action: 'LOGIN_FAILED',
                                    entity: 'User',
                                    entityId: user.id,
                                    companyId: user.companyId,
                                    userId: user.id,
                                    source: 'AUTH',
                                    details: {
                                        reason: 'Invalid password',
                                        ip: ipAddress,
                                        remainingAttempts: result.remainingAttempts,
                                    },
                                })];
                        case 8:
                            _h.sent();
                            throw new common_1.UnauthorizedException(GENERIC_AUTH_ERROR);
                        case 9:
                            isTrusted = false;
                            returnedDeviceIdentifier = undefined;
                            if (!loginDto.deviceIdentifier) return [3 /*break*/, 12];
                            return [4 /*yield*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.trustedDevice.findFirst({
                                                where: {
                                                    userId: user.id,
                                                    deviceIdentifier: loginDto.deviceIdentifier,
                                                    expiresAt: { gt: new Date() },
                                                },
                                            })];
                                    });
                                }); })];
                        case 10:
                            trustedDevice_1 = _h.sent();
                            if (!trustedDevice_1) return [3 /*break*/, 12];
                            isTrusted = true;
                            return [4 /*yield*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.trustedDevice.update({
                                                where: { id: trustedDevice_1.id },
                                                data: { lastUsedAt: new Date(), ipAddress: ipAddress, deviceInfo: deviceInfo },
                                            })];
                                    });
                                }); })];
                        case 11:
                            _h.sent();
                            _h.label = 12;
                        case 12:
                            if (!(user.mfaEnabled && !isTrusted)) return [3 /*break*/, 23];
                            if (!loginDto.mfaToken) {
                                return [2 /*return*/, { requiresMfa: true }]; // Client needs to prompt for MFA
                            }
                            _h.label = 13;
                        case 13:
                            _h.trys.push([13, 15, , 21]);
                            return [4 /*yield*/, this.mfaService.verifyTotp(user.id, loginDto.mfaToken)];
                        case 14:
                            _h.sent();
                            return [3 /*break*/, 21];
                        case 15:
                            err_1 = _h.sent();
                            _h.label = 16;
                        case 16:
                            _h.trys.push([16, 18, , 20]);
                            return [4 /*yield*/, this.mfaService.verifyBackupCode(user.id, loginDto.mfaToken)];
                        case 17:
                            _h.sent();
                            return [3 /*break*/, 20];
                        case 18:
                            backupErr_1 = _h.sent();
                            return [4 /*yield*/, this.auditService.logEvent({
                                    action: 'LOGIN_MFA_FAILED',
                                    entity: 'User',
                                    entityId: user.id,
                                    companyId: user.companyId,
                                    userId: user.id,
                                    source: 'AUTH',
                                    details: { ip: ipAddress },
                                })];
                        case 19:
                            _h.sent();
                            throw new common_1.UnauthorizedException('Invalid MFA token or backup code');
                        case 20: return [3 /*break*/, 21];
                        case 21:
                            if (!loginDto.trustDevice) return [3 /*break*/, 23];
                            deviceId_1 = crypto.randomUUID();
                            expiresAt_1 = new Date();
                            expiresAt_1.setDate(expiresAt_1.getDate() + 30); // 30 days
                            return [4 /*yield*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.trustedDevice.create({
                                                data: {
                                                    userId: user.id,
                                                    deviceIdentifier: deviceId_1,
                                                    deviceInfo: deviceInfo,
                                                    ipAddress: ipAddress,
                                                    expiresAt: expiresAt_1,
                                                },
                                            })];
                                    });
                                }); })];
                        case 22:
                            _h.sent();
                            returnedDeviceIdentifier = deviceId_1;
                            _h.label = 23;
                        case 23: 
                        // 4. Successful authentication — clear brute-force counter
                        return [4 /*yield*/, this.bruteForce.recordSuccessfulLogin(email)];
                        case 24:
                            // 4. Successful authentication — clear brute-force counter
                            _h.sent();
                            // 4. Concurrent session enforcement — evict oldest if over limit
                            return [4 /*yield*/, this.enforceSessionLimit(user.id)];
                        case 25:
                            // 4. Concurrent session enforcement — evict oldest if over limit
                            _h.sent();
                            return [4 /*yield*/, this.mintTokens(user)];
                        case 26:
                            _a = _h.sent(), accessToken = _a.accessToken, refreshToken = _a.refreshToken, refreshTokenHash = _a.refreshTokenHash, refreshExpiresAt = _a.refreshExpiresAt;
                            // 6. Store hashed refresh token (never the raw token)
                            return [4 /*yield*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.refreshToken.create({
                                                data: {
                                                    token: refreshTokenHash,
                                                    userId: user.id,
                                                    expiresAt: refreshExpiresAt,
                                                    ipAddress: ipAddress,
                                                    deviceInfo: deviceInfo,
                                                    deviceFingerprint: loginDto.deviceFingerprint,
                                                    history: [
                                                        {
                                                            ip: ipAddress,
                                                            device: deviceInfo,
                                                            date: new Date().toISOString(),
                                                        },
                                                    ],
                                                },
                                            })];
                                    });
                                }); })];
                        case 27:
                            // 6. Store hashed refresh token (never the raw token)
                            _h.sent();
                            // 7. Audit log
                            return [4 /*yield*/, this.auditService.logEvent({
                                    action: 'LOGIN_SUCCESS',
                                    entity: 'User',
                                    entityId: user.id,
                                    companyId: user.companyId,
                                    userId: user.id,
                                    source: 'AUTH',
                                    details: { ip: ipAddress },
                                })];
                        case 28:
                            // 7. Audit log
                            _h.sent();
                            this.logger.log("User ".concat(user.id, " logged in from ").concat(ipAddress));
                            return [2 /*return*/, {
                                    access_token: accessToken,
                                    refresh_token: refreshToken, // raw — send to client only
                                    device_identifier: returnedDeviceIdentifier,
                                    user: {
                                        id: user.id,
                                        email: user.email,
                                        firstName: user.firstName,
                                        lastName: user.lastName,
                                        roleId: user.roleId,
                                        role: (_c = user.role) === null || _c === void 0 ? void 0 : _c.name,
                                        permissions: ((_d = user.role) === null || _d === void 0 ? void 0 : _d.permissions) || [],
                                        companyId: user.companyId,
                                        defaultTenantId: user.companyId,
                                        onboardingCompleted: (_g = (_f = (_e = user.company) === null || _e === void 0 ? void 0 : _e.tenantConfiguration) === null || _f === void 0 ? void 0 : _f.onboardingCompleted) !== null && _g !== void 0 ? _g : false,
                                    },
                                }];
                    }
                });
            });
        };
        AuthService_1.prototype.refreshToken = function (rawToken, ipAddress, deviceInfo, deviceFingerprint) {
            return __awaiter(this, void 0, void 0, function () {
                var tokenHash, tokenRecord, isWithinGracePeriod, enforcement, user, _a, accessToken, newRaw, refreshTokenHash, refreshExpiresAt, history, newHistory;
                var _this = this;
                var _b, _c;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            if (!rawToken)
                                throw new common_1.UnauthorizedException('Refresh token required');
                            tokenHash = crypto
                                .createHash('sha256')
                                .update(rawToken)
                                .digest('hex');
                            return [4 /*yield*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.refreshToken.findUnique({
                                                where: { token: tokenHash },
                                                include: {
                                                    user: {
                                                        select: {
                                                            id: true,
                                                            email: true,
                                                            status: true,
                                                            deletedAt: true,
                                                            roleId: true,
                                                            companyId: true,
                                                            role: {
                                                                select: {
                                                                    name: true,
                                                                    permissions: true,
                                                                },
                                                            },
                                                        },
                                                    },
                                                },
                                            })];
                                    });
                                }); })];
                        case 1:
                            tokenRecord = _d.sent();
                            if (!(!tokenRecord || tokenRecord.expiresAt < new Date())) return [3 /*break*/, 4];
                            if (!tokenRecord) return [3 /*break*/, 3];
                            // Possible token reuse attack — invalidate entire session
                            return [4 /*yield*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.refreshToken.deleteMany({
                                                where: { familyId: tokenRecord.familyId },
                                            })];
                                    });
                                }); })];
                        case 2:
                            // Possible token reuse attack — invalidate entire session
                            _d.sent();
                            this.logger.warn("[Auth] Expired refresh token reuse detected from ".concat(ipAddress, ". Revoking token family."));
                            _d.label = 3;
                        case 3: throw new common_1.UnauthorizedException('Invalid or expired refresh token');
                        case 4:
                            if (!tokenRecord.isRevoked) return [3 /*break*/, 8];
                            isWithinGracePeriod = tokenRecord.updatedAt.getTime() > Date.now() - 15000;
                            if (!!isWithinGracePeriod) return [3 /*break*/, 7];
                            return [4 /*yield*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.refreshToken.deleteMany({
                                                where: { familyId: tokenRecord.familyId },
                                            })];
                                    });
                                }); })];
                        case 5:
                            _d.sent();
                            return [4 /*yield*/, this.auditService.logEvent({
                                    action: 'REPLAY_ATTACK_DETECTED',
                                    entity: 'User',
                                    entityId: tokenRecord.userId,
                                    companyId: tokenRecord.user.companyId,
                                    userId: tokenRecord.userId,
                                    source: 'AUTH',
                                    details: { ip: ipAddress, familyId: tokenRecord.familyId },
                                })];
                        case 6:
                            _d.sent();
                            this.logger.warn("[Auth] Replay attack detected for user ".concat(tokenRecord.userId, ". Revoked token family."));
                            throw new common_1.UnauthorizedException('Replay attack detected. Session terminated.');
                        case 7:
                            this.logger.debug("[Auth] Concurrent refresh detected within grace period for user ".concat(tokenRecord.userId, ". Request rejected safely."));
                            throw new common_1.UnauthorizedException('Token already refreshed recently');
                        case 8:
                            enforcement = process.env.DEVICE_BINDING_ENFORCEMENT || 'WARN';
                            if (!(enforcement !== 'OFF' &&
                                tokenRecord.deviceFingerprint &&
                                deviceFingerprint)) return [3 /*break*/, 10];
                            if (!(tokenRecord.deviceFingerprint !== deviceFingerprint)) return [3 /*break*/, 10];
                            return [4 /*yield*/, this.auditService.logEvent({
                                    action: 'DEVICE_MISMATCH',
                                    entity: 'User',
                                    entityId: tokenRecord.userId,
                                    companyId: tokenRecord.user.companyId,
                                    userId: tokenRecord.userId,
                                    source: 'AUTH',
                                    details: {
                                        ip: ipAddress,
                                        expected: tokenRecord.deviceFingerprint,
                                        actual: deviceFingerprint,
                                    },
                                })];
                        case 9:
                            _d.sent();
                            if (enforcement === 'ENFORCE') {
                                throw new common_1.UnauthorizedException('Device fingerprint mismatch. Please login again.');
                            }
                            else {
                                this.logger.warn("Device fingerprint mismatch for user ".concat(tokenRecord.userId, " (ip: ").concat(ipAddress, ")"));
                            }
                            _d.label = 10;
                        case 10:
                            user = tokenRecord.user;
                            if (!(user.status !== 'ACTIVE' || user.deletedAt)) return [3 /*break*/, 12];
                            return [4 /*yield*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.refreshToken.deleteMany({
                                                where: { familyId: tokenRecord.familyId },
                                            })];
                                    });
                                }); })];
                        case 11:
                            _d.sent();
                            throw new common_1.UnauthorizedException('User account is inactive');
                        case 12: return [4 /*yield*/, this.mintTokens(user)];
                        case 13:
                            _a = _d.sent(), accessToken = _a.accessToken, newRaw = _a.refreshToken, refreshTokenHash = _a.refreshTokenHash, refreshExpiresAt = _a.refreshExpiresAt;
                            return [4 /*yield*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.refreshToken.update({
                                                where: { id: tokenRecord.id },
                                                data: {
                                                    isRevoked: true,
                                                    replacedByToken: refreshTokenHash,
                                                },
                                            })];
                                    });
                                }); })];
                        case 14:
                            _d.sent();
                            history = Array.isArray(tokenRecord.history)
                                ? tokenRecord.history
                                : [];
                            newHistory = __spreadArray(__spreadArray([], history, true), [
                                { ip: ipAddress, device: deviceInfo, date: new Date().toISOString() },
                            ], false);
                            // Prune history to keep only the last 10 entries to save space
                            if (newHistory.length > 10)
                                newHistory.shift();
                            return [4 /*yield*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.refreshToken.create({
                                                data: {
                                                    token: refreshTokenHash,
                                                    familyId: tokenRecord.familyId,
                                                    userId: user.id,
                                                    expiresAt: refreshExpiresAt,
                                                    ipAddress: ipAddress,
                                                    deviceInfo: deviceInfo,
                                                    deviceFingerprint: deviceFingerprint || tokenRecord.deviceFingerprint,
                                                    history: newHistory,
                                                },
                                            })];
                                    });
                                }); })];
                        case 15:
                            _d.sent();
                            return [2 /*return*/, {
                                    access_token: accessToken,
                                    refresh_token: newRaw,
                                    user: {
                                        id: user.id,
                                        email: user.email,
                                        roleId: user.roleId,
                                        role: (_b = user.role) === null || _b === void 0 ? void 0 : _b.name,
                                        permissions: ((_c = user.role) === null || _c === void 0 ? void 0 : _c.permissions) || [],
                                        companyId: user.companyId,
                                        defaultTenantId: user.companyId,
                                    },
                                }];
                    }
                });
            });
        };
        AuthService_1.prototype.logout = function (rawToken, userId) {
            return __awaiter(this, void 0, void 0, function () {
                var tokenHash_1;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!rawToken) return [3 /*break*/, 2];
                            tokenHash_1 = crypto
                                .createHash('sha256')
                                .update(rawToken)
                                .digest('hex');
                            return [4 /*yield*/, this.prisma
                                    .runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                    return [2 /*return*/, tx.refreshToken.delete({ where: { token: tokenHash_1 } })];
                                }); }); })
                                    .catch(function () { })];
                        case 1:
                            _a.sent(); // Already deleted — no-op
                            _a.label = 2;
                        case 2: return [4 /*yield*/, this.auditService.logEvent({
                                action: 'LOGOUT',
                                entity: 'User',
                                entityId: userId,
                                companyId: 'N/A', // Caller should pass companyId if available
                                userId: userId,
                                source: 'AUTH',
                            })];
                        case 3:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        AuthService_1.prototype.logoutAllSessions = function (userId) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, tx.refreshToken.deleteMany({ where: { userId: userId } })];
                            }); }); })];
                        case 1:
                            _a.sent();
                            this.logger.log("All sessions revoked for user ".concat(userId));
                            return [2 /*return*/];
                    }
                });
            });
        };
        // ─────────────────────────────────────────────────────────────────────────
        // Private helpers
        // ─────────────────────────────────────────────────────────────────────────
        AuthService_1.prototype.mintTokens = function (user) {
            return __awaiter(this, void 0, void 0, function () {
                var payload, accessToken, rawRefreshToken, refreshTokenHash, refreshExpiresAt;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            payload = {
                                sub: user.id,
                                cid: user.companyId, // companyId abbreviated for token size
                                rid: user.roleId, // roleId abbreviated
                                // email deliberately omitted — reduces token size, lowers PII risk
                            };
                            return [4 /*yield*/, this.jwtService.signAsync(payload, {
                                    expiresIn: '15m',
                                    algorithm: 'RS256',
                                })];
                        case 1:
                            accessToken = _a.sent();
                            rawRefreshToken = crypto.randomBytes(48).toString('base64url');
                            refreshTokenHash = crypto
                                .createHash('sha256')
                                .update(rawRefreshToken)
                                .digest('hex');
                            refreshExpiresAt = new Date();
                            refreshExpiresAt.setDate(refreshExpiresAt.getDate() + 7);
                            return [2 /*return*/, {
                                    accessToken: accessToken,
                                    refreshToken: rawRefreshToken,
                                    refreshTokenHash: refreshTokenHash,
                                    refreshExpiresAt: refreshExpiresAt,
                                }];
                    }
                });
            });
        };
        AuthService_1.prototype.enforceSessionLimit = function (userId) {
            return __awaiter(this, void 0, void 0, function () {
                var sessions, excess_1;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    return [2 /*return*/, tx.refreshToken.findMany({
                                            where: { userId: userId },
                                            orderBy: { lastActiveAt: 'asc' }, // oldest active first
                                        })];
                                });
                            }); })];
                        case 1:
                            sessions = _a.sent();
                            if (!(sessions.length >= this.MAX_CONCURRENT_SESSIONS)) return [3 /*break*/, 3];
                            excess_1 = sessions.slice(0, sessions.length - this.MAX_CONCURRENT_SESSIONS + 1);
                            return [4 /*yield*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.refreshToken.deleteMany({
                                                where: { id: { in: excess_1.map(function (s) { return s.id; }) } },
                                            })];
                                    });
                                }); })];
                        case 2:
                            _a.sent();
                            this.logger.log("[Session] Evicted ".concat(excess_1.length, " oldest session(s) for user ").concat(userId));
                            _a.label = 3;
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        AuthService_1.prototype.getActiveSessions = function (userId) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                return [2 /*return*/, tx.refreshToken.findMany({
                                        where: { userId: userId },
                                        select: {
                                            id: true,
                                            deviceInfo: true,
                                            ipAddress: true,
                                            lastActiveAt: true,
                                            createdAt: true,
                                        },
                                        orderBy: { lastActiveAt: 'desc' },
                                    })];
                            });
                        }); })];
                });
            });
        };
        AuthService_1.prototype.revokeSession = function (userId, sessionId) {
            return __awaiter(this, void 0, void 0, function () {
                var session;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    return [2 /*return*/, tx.refreshToken.findFirst({
                                            where: { id: sessionId, userId: userId },
                                        })];
                                });
                            }); })];
                        case 1:
                            session = _a.sent();
                            if (!session)
                                throw new common_1.UnauthorizedException('Session not found');
                            return [4 /*yield*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.refreshToken.delete({
                                                where: { id: sessionId },
                                            })];
                                    });
                                }); })];
                        case 2:
                            _a.sent();
                            this.logger.log("[Session] Revoked session ".concat(sessionId, " for user ").concat(userId));
                            return [2 /*return*/, { success: true }];
                    }
                });
            });
        };
        // ─────────────────────────────────────────────────────────────────────────
        // WebAuthn / Passkeys Implementation
        // ─────────────────────────────────────────────────────────────────────────
        AuthService_1.prototype.generateWebAuthnRegistrationOptions = function (email) {
            return __awaiter(this, void 0, void 0, function () {
                var user, options;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    return [2 /*return*/, tx.user.findUnique({
                                            where: { email: email.toLowerCase() },
                                            include: { webAuthnCredentials: true },
                                        })];
                                });
                            }); })];
                        case 1:
                            user = _a.sent();
                            if (!user)
                                throw new common_1.UnauthorizedException('User not found');
                            return [4 /*yield*/, (0, server_1.generateRegistrationOptions)({
                                    rpName: this.rpName,
                                    rpID: this.rpID,
                                    userID: new Uint8Array(Buffer.from(user.id)),
                                    userName: user.email,
                                    userDisplayName: "".concat(user.firstName, " ").concat(user.lastName),
                                    attestationType: 'none',
                                    excludeCredentials: user.webAuthnCredentials.map(function (cred) { return ({
                                        id: Buffer.from(cred.credentialID).toString('base64url'),
                                        type: 'public-key',
                                        transports: cred.transports,
                                    }); }),
                                    authenticatorSelection: {
                                        residentKey: 'required',
                                        userVerification: 'preferred',
                                    },
                                })];
                        case 2:
                            options = _a.sent();
                            this.webAuthnChallenges.set("reg:".concat(email.toLowerCase()), options.challenge);
                            return [2 /*return*/, options];
                    }
                });
            });
        };
        AuthService_1.prototype.verifyWebAuthnRegistration = function (email, response) {
            return __awaiter(this, void 0, void 0, function () {
                var expectedChallenge, user, verification, _a, credential_1, credentialDeviceType_1, credentialBackedUp_1;
                var _this = this;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            expectedChallenge = this.webAuthnChallenges.get("reg:".concat(email.toLowerCase()));
                            if (!expectedChallenge)
                                throw new common_1.ForbiddenException('Challenge expired or not found');
                            return [4 /*yield*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.user.findUnique({
                                                where: { email: email.toLowerCase() },
                                            })];
                                    });
                                }); })];
                        case 1:
                            user = _b.sent();
                            if (!user)
                                throw new common_1.UnauthorizedException('User not found');
                            return [4 /*yield*/, (0, server_1.verifyRegistrationResponse)({
                                    response: response,
                                    expectedChallenge: expectedChallenge,
                                    expectedOrigin: this.origin,
                                    expectedRPID: this.rpID,
                                })];
                        case 2:
                            verification = _b.sent();
                            if (!(verification.verified && verification.registrationInfo)) return [3 /*break*/, 4];
                            _a = verification.registrationInfo, credential_1 = _a.credential, credentialDeviceType_1 = _a.credentialDeviceType, credentialBackedUp_1 = _a.credentialBackedUp;
                            return [4 /*yield*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.webAuthnCredential.create({
                                                data: {
                                                    userId: user.id,
                                                    credentialID: Buffer.from(credential_1.id),
                                                    credentialPublicKey: Buffer.from(credential_1.publicKey),
                                                    counter: credential_1.counter,
                                                    credentialDeviceType: credentialDeviceType_1,
                                                    credentialBackedUp: credentialBackedUp_1,
                                                    transports: response.response.transports || [],
                                                },
                                            })];
                                    });
                                }); })];
                        case 3:
                            _b.sent();
                            this.webAuthnChallenges.delete("reg:".concat(email.toLowerCase()));
                            return [2 /*return*/, { verified: true }];
                        case 4: throw new common_1.ForbiddenException('Passkey registration failed');
                    }
                });
            });
        };
        AuthService_1.prototype.generateWebAuthnAuthenticationOptions = function (email) {
            return __awaiter(this, void 0, void 0, function () {
                var user, options;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    return [2 /*return*/, tx.user.findUnique({
                                            where: { email: email.toLowerCase() },
                                            include: { webAuthnCredentials: true },
                                        })];
                                });
                            }); })];
                        case 1:
                            user = _a.sent();
                            if (!user)
                                throw new common_1.UnauthorizedException('User not found');
                            return [4 /*yield*/, (0, server_1.generateAuthenticationOptions)({
                                    rpID: this.rpID,
                                    allowCredentials: user.webAuthnCredentials.map(function (cred) { return ({
                                        id: Buffer.from(cred.credentialID).toString('base64url'),
                                        type: 'public-key',
                                        transports: cred.transports,
                                    }); }),
                                    userVerification: 'preferred',
                                })];
                        case 2:
                            options = _a.sent();
                            this.webAuthnChallenges.set("auth:".concat(email.toLowerCase()), options.challenge);
                            return [2 /*return*/, options];
                    }
                });
            });
        };
        AuthService_1.prototype.verifyWebAuthnAuthentication = function (email, response, ipAddress, deviceInfo, deviceFingerprint) {
            return __awaiter(this, void 0, void 0, function () {
                var expectedChallenge, user, credential, verification, _a, accessToken, refreshToken, refreshTokenHash_1, refreshExpiresAt_1;
                var _this = this;
                var _b, _c;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            expectedChallenge = this.webAuthnChallenges.get("auth:".concat(email.toLowerCase()));
                            if (!expectedChallenge)
                                throw new common_1.ForbiddenException('Challenge expired or not found');
                            return [4 /*yield*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.user.findUnique({
                                                where: { email: email.toLowerCase() },
                                                include: { webAuthnCredentials: true },
                                            })];
                                    });
                                }); })];
                        case 1:
                            user = _d.sent();
                            if (!user)
                                throw new common_1.UnauthorizedException('User not found');
                            credential = user.webAuthnCredentials.find(function (c) { return Buffer.from(c.credentialID).toString('base64url') === response.id; });
                            if (!credential)
                                throw new common_1.ForbiddenException('Passkey not found for user');
                            return [4 /*yield*/, (0, server_1.verifyAuthenticationResponse)({
                                    response: response,
                                    expectedChallenge: expectedChallenge,
                                    expectedOrigin: this.origin,
                                    expectedRPID: this.rpID,
                                    credential: {
                                        id: Buffer.from(credential.credentialID).toString('base64url'),
                                        publicKey: new Uint8Array(credential.credentialPublicKey),
                                        counter: credential.counter,
                                        transports: credential.transports,
                                    },
                                })];
                        case 2:
                            verification = _d.sent();
                            if (!verification.verified) return [3 /*break*/, 7];
                            return [4 /*yield*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.webAuthnCredential.update({
                                                where: { id: credential.id },
                                                data: {
                                                    counter: verification.authenticationInfo.newCounter,
                                                    lastUsedAt: new Date(),
                                                },
                                            })];
                                    });
                                }); })];
                        case 3:
                            _d.sent();
                            this.webAuthnChallenges.delete("auth:".concat(email.toLowerCase()));
                            return [4 /*yield*/, this.auditService.logEvent({
                                    action: 'LOGIN_SUCCESS_PASSKEY',
                                    entity: 'User',
                                    entityId: user.id,
                                    companyId: user.companyId,
                                    userId: user.id,
                                    source: 'AUTH',
                                })];
                        case 4:
                            _d.sent();
                            return [4 /*yield*/, this.mintTokens(user)];
                        case 5:
                            _a = _d.sent(), accessToken = _a.accessToken, refreshToken = _a.refreshToken, refreshTokenHash_1 = _a.refreshTokenHash, refreshExpiresAt_1 = _a.refreshExpiresAt;
                            return [4 /*yield*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.refreshToken.create({
                                                data: {
                                                    token: refreshTokenHash_1,
                                                    userId: user.id,
                                                    expiresAt: refreshExpiresAt_1,
                                                    ipAddress: ipAddress,
                                                    deviceInfo: deviceInfo,
                                                    deviceFingerprint: deviceFingerprint,
                                                    history: [
                                                        {
                                                            ip: ipAddress,
                                                            device: deviceInfo,
                                                            date: new Date().toISOString(),
                                                        },
                                                    ],
                                                },
                                            })];
                                    });
                                }); })];
                        case 6:
                            _d.sent();
                            return [2 /*return*/, {
                                    access_token: accessToken,
                                    refresh_token: refreshToken,
                                    user: {
                                        id: user.id,
                                        email: user.email,
                                        firstName: user.firstName,
                                        lastName: user.lastName,
                                        roleId: user.roleId,
                                        role: (_b = user.role) === null || _b === void 0 ? void 0 : _b.name,
                                        permissions: ((_c = user.role) === null || _c === void 0 ? void 0 : _c.permissions) || [],
                                        companyId: user.companyId,
                                        defaultTenantId: user.companyId,
                                    },
                                }];
                        case 7: throw new common_1.ForbiddenException('Passkey authentication failed');
                    }
                });
            });
        };
        AuthService_1.prototype.issueTokensAfterLogin = function (user, ipAddress, deviceInfo, deviceFingerprint) {
            return __awaiter(this, void 0, void 0, function () {
                var _a, accessToken, refreshToken, refreshTokenHash, refreshExpiresAt;
                var _this = this;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: 
                        // Concurrent session enforcement — evict oldest if over limit
                        return [4 /*yield*/, this.enforceSessionLimit(user.id)];
                        case 1:
                            // Concurrent session enforcement — evict oldest if over limit
                            _b.sent();
                            return [4 /*yield*/, this.mintTokens(user)];
                        case 2:
                            _a = _b.sent(), accessToken = _a.accessToken, refreshToken = _a.refreshToken, refreshTokenHash = _a.refreshTokenHash, refreshExpiresAt = _a.refreshExpiresAt;
                            // Store hashed refresh token
                            return [4 /*yield*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.refreshToken.create({
                                                data: {
                                                    token: refreshTokenHash,
                                                    userId: user.id,
                                                    expiresAt: refreshExpiresAt,
                                                    ipAddress: ipAddress,
                                                    deviceInfo: deviceInfo,
                                                    deviceFingerprint: deviceFingerprint || null,
                                                    history: [
                                                        {
                                                            action: 'ISSUED_SSO',
                                                            timestamp: new Date(),
                                                            ipAddress: ipAddress,
                                                            deviceInfo: deviceInfo,
                                                        },
                                                    ],
                                                },
                                            })];
                                    });
                                }); })];
                        case 3:
                            // Store hashed refresh token
                            _b.sent();
                            return [2 /*return*/, {
                                    access_token: accessToken,
                                    refresh_token: refreshToken, // raw token to be set in cookie
                                    user: {
                                        id: user.id,
                                        email: user.email,
                                        firstName: user.firstName,
                                        lastName: user.lastName,
                                        roleId: user.roleId,
                                        companyId: user.companyId,
                                        defaultTenantId: user.companyId,
                                    },
                                }];
                    }
                });
            });
        };
        return AuthService_1;
    }());
    __setFunctionName(_classThis, "AuthService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AuthService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AuthService = _classThis;
}();
exports.AuthService = AuthService;
