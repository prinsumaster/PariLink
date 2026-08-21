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
exports.MfaService = void 0;
var common_1 = require("@nestjs/common");
var otplib_1 = require("otplib");
var QRCode = __importStar(require("qrcode"));
var crypto = __importStar(require("crypto"));
var bcrypt = __importStar(require("bcryptjs"));
var MfaService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var MfaService = _classThis = /** @class */ (function () {
        function MfaService_1(prisma, security, auditService) {
            this.prisma = prisma;
            this.security = security;
            this.auditService = auditService;
            this.logger = new common_1.Logger(MfaService.name);
            otplib_1.authenticator.options = { window: 1 }; // Allow 1 step (30s) drift
        }
        MfaService_1.prototype.generateTotpSecret = function (userId, email) {
            return __awaiter(this, void 0, void 0, function () {
                var user, secret, otpauthUrl, qrCodeDataUrl, encryptedSecret;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, tx.user.findUnique({ where: { id: userId } })];
                            }); }); })];
                        case 1:
                            user = _a.sent();
                            if (!user)
                                throw new common_1.UnauthorizedException('User not found');
                            if (user.mfaEnabled)
                                throw new common_1.BadRequestException('MFA is already enabled');
                            secret = otplib_1.authenticator.generateSecret();
                            otpauthUrl = otplib_1.authenticator.keyuri(email, 'PariLink', secret);
                            return [4 /*yield*/, QRCode.toDataURL(otpauthUrl)];
                        case 2:
                            qrCodeDataUrl = _a.sent();
                            encryptedSecret = this.security.encryptSecret(secret);
                            return [4 /*yield*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.user.update({
                                                where: { id: userId },
                                                data: { totpSecret: encryptedSecret },
                                            })];
                                    });
                                }); })];
                        case 3:
                            _a.sent();
                            return [2 /*return*/, { secret: secret, qrCodeDataUrl: qrCodeDataUrl }];
                    }
                });
            });
        };
        MfaService_1.prototype.verifyTotpSetup = function (userId, token) {
            return __awaiter(this, void 0, void 0, function () {
                var user, decryptedSecret, isValid, backupCodes, backupCodeData;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, tx.user.findUnique({ where: { id: userId } })];
                            }); }); })];
                        case 1:
                            user = _a.sent();
                            if (!user || !user.totpSecret) {
                                throw new common_1.BadRequestException('TOTP setup not initialized');
                            }
                            decryptedSecret = this.security.decryptSecret(user.totpSecret);
                            isValid = otplib_1.authenticator.verify({ token: token, secret: decryptedSecret });
                            if (!isValid) {
                                throw new common_1.UnauthorizedException('Invalid TOTP token');
                            }
                            backupCodes = this.generateBackupCodes();
                            return [4 /*yield*/, Promise.all(backupCodes.map(function (code) { return __awaiter(_this, void 0, void 0, function () {
                                    var _a;
                                    return __generator(this, function (_b) {
                                        switch (_b.label) {
                                            case 0:
                                                _a = {
                                                    userId: userId
                                                };
                                                return [4 /*yield*/, bcrypt.hash(code, 10)];
                                            case 1: return [2 /*return*/, (_a.codeHash = _b.sent(),
                                                    _a)];
                                        }
                                    });
                                }); }))];
                        case 2:
                            backupCodeData = _a.sent();
                            // Bulk insert to avoid N+1 insertions
                            return [4 /*yield*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.backupCode.createMany({
                                                data: backupCodeData,
                                            })];
                                    });
                                }); })];
                        case 3:
                            // Bulk insert to avoid N+1 insertions
                            _a.sent();
                            // Enable MFA
                            return [4 /*yield*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.user.update({
                                                where: { id: userId },
                                                data: { mfaEnabled: true },
                                            })];
                                    });
                                }); })];
                        case 4:
                            // Enable MFA
                            _a.sent();
                            this.logger.log("[MFA] User ".concat(userId, " successfully enabled MFA"));
                            return [4 /*yield*/, this.auditService.logEvent({
                                    action: 'MFA_ENABLED',
                                    entity: 'User',
                                    entityId: userId,
                                    companyId: user.companyId,
                                    userId: userId,
                                    source: 'AUTH',
                                })];
                        case 5:
                            _a.sent();
                            return [2 /*return*/, {
                                    success: true,
                                    backupCodes: backupCodes,
                                }];
                    }
                });
            });
        };
        MfaService_1.prototype.verifyTotp = function (userId, token) {
            return __awaiter(this, void 0, void 0, function () {
                var user, decryptedSecret, isValid;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, tx.user.findUnique({ where: { id: userId } })];
                            }); }); })];
                        case 1:
                            user = _a.sent();
                            if (!user || !user.totpSecret) {
                                throw new common_1.BadRequestException('MFA not enabled');
                            }
                            decryptedSecret = this.security.decryptSecret(user.totpSecret);
                            isValid = otplib_1.authenticator.verify({ token: token, secret: decryptedSecret });
                            if (!isValid) {
                                throw new common_1.UnauthorizedException('Invalid TOTP token');
                            }
                            return [2 /*return*/, true];
                    }
                });
            });
        };
        MfaService_1.prototype.verifyBackupCode = function (userId, code) {
            return __awaiter(this, void 0, void 0, function () {
                var backupCodes, _loop_1, this_1, _i, backupCodes_1, backup, state_1;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    return [2 /*return*/, tx.backupCode.findMany({
                                            where: { userId: userId, used: false },
                                        })];
                                });
                            }); })];
                        case 1:
                            backupCodes = _a.sent();
                            _loop_1 = function (backup) {
                                var isValid;
                                return __generator(this, function (_b) {
                                    switch (_b.label) {
                                        case 0: return [4 /*yield*/, bcrypt.compare(code, backup.codeHash)];
                                        case 1:
                                            isValid = _b.sent();
                                            if (!isValid) return [3 /*break*/, 3];
                                            return [4 /*yield*/, this_1.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                                    return __generator(this, function (_a) {
                                                        return [2 /*return*/, tx.backupCode.update({
                                                                where: { id: backup.id },
                                                                data: { used: true, usedAt: new Date() },
                                                            })];
                                                    });
                                                }); })];
                                        case 2:
                                            _b.sent();
                                            this_1.logger.log("[MFA] User ".concat(userId, " consumed a backup code"));
                                            return [2 /*return*/, { value: true }];
                                        case 3: return [2 /*return*/];
                                    }
                                });
                            };
                            this_1 = this;
                            _i = 0, backupCodes_1 = backupCodes;
                            _a.label = 2;
                        case 2:
                            if (!(_i < backupCodes_1.length)) return [3 /*break*/, 5];
                            backup = backupCodes_1[_i];
                            return [5 /*yield**/, _loop_1(backup)];
                        case 3:
                            state_1 = _a.sent();
                            if (typeof state_1 === "object")
                                return [2 /*return*/, state_1.value];
                            _a.label = 4;
                        case 4:
                            _i++;
                            return [3 /*break*/, 2];
                        case 5: throw new common_1.UnauthorizedException('Invalid backup code');
                    }
                });
            });
        };
        MfaService_1.prototype.generateBackupCodes = function (count, length) {
            if (count === void 0) { count = 10; }
            if (length === void 0) { length = 10; }
            var codes = [];
            for (var i = 0; i < count; i++) {
                codes.push(crypto.randomBytes(length / 2).toString('hex'));
            }
            return codes;
        };
        return MfaService_1;
    }());
    __setFunctionName(_classThis, "MfaService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        MfaService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return MfaService = _classThis;
}();
exports.MfaService = MfaService;
