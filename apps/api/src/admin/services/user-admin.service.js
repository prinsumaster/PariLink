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
exports.UserAdminService = void 0;
var common_1 = require("@nestjs/common");
var bcrypt = __importStar(require("bcrypt"));
var crypto = __importStar(require("crypto"));
var UserAdminService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var UserAdminService = _classThis = /** @class */ (function () {
        function UserAdminService_1(prisma, audit) {
            this.prisma = prisma;
            this.audit = audit;
        }
        UserAdminService_1.prototype.getUsers = function (companyId, status) {
            return __awaiter(this, void 0, void 0, function () {
                var where;
                var _this = this;
                return __generator(this, function (_a) {
                    where = { companyId: companyId };
                    if (status)
                        where.status = status;
                    return [2 /*return*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                return [2 /*return*/, tx.user.findMany({
                                        where: where,
                                        take: 1000,
                                        select: {
                                            id: true,
                                            email: true,
                                            firstName: true,
                                            lastName: true,
                                            phone: true,
                                            status: true,
                                            mfaEnabled: true,
                                            roleId: true,
                                            departmentId: true,
                                            teamId: true,
                                            costCenterId: true,
                                            createdAt: true,
                                            role: { select: { id: true, name: true } },
                                            department: { select: { id: true, name: true } },
                                            team: { select: { id: true, name: true } },
                                            costCenter: { select: { id: true, code: true, name: true } },
                                        },
                                        orderBy: { createdAt: 'desc' },
                                    })];
                            });
                        }); })];
                });
            });
        };
        UserAdminService_1.prototype.inviteUser = function (companyId, dto, adminUserId) {
            return __awaiter(this, void 0, void 0, function () {
                var existing, tempPassword, hashedPassword, user;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    return [2 /*return*/, tx.user.findUnique({
                                            where: { email: dto.email },
                                        })];
                                });
                            }); })];
                        case 1:
                            existing = _a.sent();
                            if (existing)
                                throw new common_1.ConflictException("User with email ".concat(dto.email, " already exists"));
                            tempPassword = crypto.randomBytes(16).toString('hex');
                            return [4 /*yield*/, bcrypt.hash(tempPassword, 10)];
                        case 2:
                            hashedPassword = _a.sent();
                            return [4 /*yield*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.user.create({
                                                data: {
                                                    companyId: companyId,
                                                    email: dto.email,
                                                    firstName: dto.firstName,
                                                    lastName: dto.lastName,
                                                    password: hashedPassword,
                                                    status: 'INVITED',
                                                    roleId: dto.roleId,
                                                    departmentId: dto.departmentId,
                                                    teamId: dto.teamId,
                                                    costCenterId: dto.costCenterId,
                                                    preferences: {
                                                        invitationToken: crypto.randomBytes(32).toString('hex'),
                                                        invitedBy: adminUserId,
                                                    },
                                                },
                                            })];
                                    });
                                }); })];
                        case 3:
                            user = _a.sent();
                            return [4 /*yield*/, this.audit.logEvent({
                                    action: 'admin:user:invite',
                                    entity: 'User',
                                    entityId: user.id,
                                    userId: adminUserId,
                                    companyId: companyId,
                                    details: { email: dto.email, roleId: dto.roleId },
                                })];
                        case 4:
                            _a.sent();
                            return [2 /*return*/, {
                                    id: user.id,
                                    email: user.email,
                                    status: user.status,
                                    invitationSent: true,
                                }];
                    }
                });
            });
        };
        UserAdminService_1.prototype.bulkImportUsers = function (companyId, dto, adminUserId) {
            return __awaiter(this, void 0, void 0, function () {
                var results, promises, settled, _i, settled_1, res;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            results = {
                                imported: 0,
                                failed: 0,
                                errors: [],
                            };
                            promises = dto.users.map(function (u) { return __awaiter(_this, void 0, void 0, function () {
                                var e_1;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            _a.trys.push([0, 2, , 3]);
                                            return [4 /*yield*/, this.inviteUser(companyId, u, adminUserId)];
                                        case 1:
                                            _a.sent();
                                            return [2 /*return*/, { success: true, email: u.email }];
                                        case 2:
                                            e_1 = _a.sent();
                                            return [2 /*return*/, {
                                                    success: false,
                                                    email: u.email,
                                                    reason: e_1.message || 'Import error',
                                                }];
                                        case 3: return [2 /*return*/];
                                    }
                                });
                            }); });
                            return [4 /*yield*/, Promise.all(promises)];
                        case 1:
                            settled = _a.sent();
                            for (_i = 0, settled_1 = settled; _i < settled_1.length; _i++) {
                                res = settled_1[_i];
                                if (res.success) {
                                    results.imported++;
                                }
                                else {
                                    results.failed++;
                                    results.errors.push({
                                        email: res.email,
                                        reason: res.reason,
                                    });
                                }
                            }
                            return [4 /*yield*/, this.audit.logEvent({
                                    action: 'admin:user:bulk_import',
                                    entity: 'User',
                                    entityId: companyId,
                                    userId: adminUserId,
                                    companyId: companyId,
                                    details: { imported: results.imported, failed: results.failed },
                                })];
                        case 2:
                            _a.sent();
                            return [2 /*return*/, results];
                    }
                });
            });
        };
        UserAdminService_1.prototype.exportUsers = function (companyId) {
            return __awaiter(this, void 0, void 0, function () {
                var users;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.getUsers(companyId)];
                        case 1:
                            users = _a.sent();
                            return [2 /*return*/, {
                                    exportedAt: new Date().toISOString(),
                                    total: users.length,
                                    users: users,
                                }];
                    }
                });
            });
        };
        UserAdminService_1.prototype.suspendUser = function (companyId, targetUserId, dto, adminUserId) {
            return __awaiter(this, void 0, void 0, function () {
                var user, updated;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    return [2 /*return*/, tx.user.findFirst({
                                            where: { id: targetUserId, companyId: companyId },
                                        })];
                                });
                            }); })];
                        case 1:
                            user = _a.sent();
                            if (!user)
                                throw new common_1.NotFoundException("User ".concat(targetUserId, " not found"));
                            return [4 /*yield*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.user.update({
                                                where: { id: targetUserId },
                                                data: { status: 'SUSPENDED' },
                                            })];
                                    });
                                }); })];
                        case 2:
                            updated = _a.sent();
                            return [4 /*yield*/, this.forceLogout(companyId, targetUserId, adminUserId)];
                        case 3:
                            _a.sent();
                            return [4 /*yield*/, this.audit.logEvent({
                                    action: 'admin:user:suspend',
                                    entity: 'User',
                                    entityId: targetUserId,
                                    userId: adminUserId,
                                    companyId: companyId,
                                    details: { reason: dto.reason || 'Admin suspension' },
                                })];
                        case 4:
                            _a.sent();
                            return [2 /*return*/, updated];
                    }
                });
            });
        };
        UserAdminService_1.prototype.activateUser = function (companyId, targetUserId, adminUserId) {
            return __awaiter(this, void 0, void 0, function () {
                var user, updated;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    return [2 /*return*/, tx.user.findFirst({
                                            where: { id: targetUserId, companyId: companyId },
                                        })];
                                });
                            }); })];
                        case 1:
                            user = _a.sent();
                            if (!user)
                                throw new common_1.NotFoundException("User ".concat(targetUserId, " not found"));
                            return [4 /*yield*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.user.update({
                                                where: { id: targetUserId },
                                                data: { status: 'ACTIVE' },
                                            })];
                                    });
                                }); })];
                        case 2:
                            updated = _a.sent();
                            return [4 /*yield*/, this.audit.logEvent({
                                    action: 'admin:user:activate',
                                    entity: 'User',
                                    entityId: targetUserId,
                                    userId: adminUserId,
                                    companyId: companyId,
                                    details: { previousStatus: user.status },
                                })];
                        case 3:
                            _a.sent();
                            return [2 /*return*/, updated];
                    }
                });
            });
        };
        UserAdminService_1.prototype.lockUser = function (companyId, targetUserId, dto, adminUserId) {
            return __awaiter(this, void 0, void 0, function () {
                var user, updated;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    return [2 /*return*/, tx.user.findFirst({
                                            where: { id: targetUserId, companyId: companyId },
                                        })];
                                });
                            }); })];
                        case 1:
                            user = _a.sent();
                            if (!user)
                                throw new common_1.NotFoundException("User ".concat(targetUserId, " not found"));
                            return [4 /*yield*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.user.update({
                                                where: { id: targetUserId },
                                                data: { status: 'LOCKED' },
                                            })];
                                    });
                                }); })];
                        case 2:
                            updated = _a.sent();
                            return [4 /*yield*/, this.forceLogout(companyId, targetUserId, adminUserId)];
                        case 3:
                            _a.sent();
                            return [4 /*yield*/, this.audit.logEvent({
                                    action: 'admin:user:lock',
                                    entity: 'User',
                                    entityId: targetUserId,
                                    userId: adminUserId,
                                    companyId: companyId,
                                    details: { reason: dto.reason || 'Admin lock' },
                                })];
                        case 4:
                            _a.sent();
                            return [2 /*return*/, updated];
                    }
                });
            });
        };
        UserAdminService_1.prototype.unlockUser = function (companyId, targetUserId, adminUserId) {
            return __awaiter(this, void 0, void 0, function () {
                var user, updated;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    return [2 /*return*/, tx.user.findFirst({
                                            where: { id: targetUserId, companyId: companyId },
                                        })];
                                });
                            }); })];
                        case 1:
                            user = _a.sent();
                            if (!user)
                                throw new common_1.NotFoundException("User ".concat(targetUserId, " not found"));
                            return [4 /*yield*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.user.update({
                                                where: { id: targetUserId },
                                                data: { status: 'ACTIVE' },
                                            })];
                                    });
                                }); })];
                        case 2:
                            updated = _a.sent();
                            return [4 /*yield*/, this.audit.logEvent({
                                    action: 'admin:user:unlock',
                                    entity: 'User',
                                    entityId: targetUserId,
                                    userId: adminUserId,
                                    companyId: companyId,
                                    details: { previousStatus: user.status },
                                })];
                        case 3:
                            _a.sent();
                            return [2 /*return*/, updated];
                    }
                });
            });
        };
        UserAdminService_1.prototype.forceLogout = function (companyId, targetUserId, adminUserId) {
            return __awaiter(this, void 0, void 0, function () {
                var user;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    return [2 /*return*/, tx.user.findFirst({
                                            where: { id: targetUserId, companyId: companyId },
                                        })];
                                });
                            }); })];
                        case 1:
                            user = _a.sent();
                            if (!user)
                                throw new common_1.NotFoundException("User ".concat(targetUserId, " not found"));
                            return [4 /*yield*/, Promise.all([
                                    this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.refreshToken.deleteMany({ where: { userId: targetUserId } })];
                                    }); }); }),
                                    this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.trustedDevice.deleteMany({ where: { userId: targetUserId } })];
                                    }); }); }),
                                ])];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, this.audit.logEvent({
                                    action: 'admin:user:force_logout',
                                    entity: 'User',
                                    entityId: targetUserId,
                                    userId: adminUserId,
                                    companyId: companyId,
                                    details: { revokedAllTokensAndSessions: true },
                                })];
                        case 3:
                            _a.sent();
                            return [2 /*return*/, {
                                    success: true,
                                    message: "All sessions revoked for user ".concat(targetUserId),
                                }];
                    }
                });
            });
        };
        UserAdminService_1.prototype.forcePasswordReset = function (companyId, targetUserId, adminUserId) {
            return __awaiter(this, void 0, void 0, function () {
                var user, currentPrefs, updatedPrefs;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    return [2 /*return*/, tx.user.findFirst({
                                            where: { id: targetUserId, companyId: companyId },
                                        })];
                                });
                            }); })];
                        case 1:
                            user = _a.sent();
                            if (!user)
                                throw new common_1.NotFoundException("User ".concat(targetUserId, " not found"));
                            currentPrefs = (user.preferences || {});
                            updatedPrefs = __assign(__assign({}, currentPrefs), { passwordResetRequired: true, forceResetAt: new Date().toISOString() });
                            return [4 /*yield*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.user.update({
                                                where: { id: targetUserId },
                                                data: { preferences: updatedPrefs },
                                            })];
                                    });
                                }); })];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, this.forceLogout(companyId, targetUserId, adminUserId)];
                        case 3:
                            _a.sent();
                            return [4 /*yield*/, this.audit.logEvent({
                                    action: 'admin:user:force_password_reset',
                                    entity: 'User',
                                    entityId: targetUserId,
                                    userId: adminUserId,
                                    companyId: companyId,
                                    details: { passwordResetRequired: true },
                                })];
                        case 4:
                            _a.sent();
                            return [2 /*return*/, {
                                    success: true,
                                    message: "Password reset enforced for user ".concat(targetUserId),
                                }];
                    }
                });
            });
        };
        UserAdminService_1.prototype.resetMfa = function (companyId, targetUserId, adminUserId) {
            return __awaiter(this, void 0, void 0, function () {
                var user;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    return [2 /*return*/, tx.user.findFirst({
                                            where: { id: targetUserId, companyId: companyId },
                                        })];
                                });
                            }); })];
                        case 1:
                            user = _a.sent();
                            if (!user)
                                throw new common_1.NotFoundException("User ".concat(targetUserId, " not found"));
                            return [4 /*yield*/, Promise.all([
                                    this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.backupCode.deleteMany({ where: { userId: targetUserId } })];
                                    }); }); }),
                                    this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.webAuthnCredential.deleteMany({ where: { userId: targetUserId } })];
                                    }); }); }),
                                    this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                        return __generator(this, function (_a) {
                                            return [2 /*return*/, tx.user.update({
                                                    where: { id: targetUserId },
                                                    data: { mfaEnabled: false, totpSecret: null },
                                                })];
                                        });
                                    }); }),
                                ])];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, this.audit.logEvent({
                                    action: 'admin:user:reset_mfa',
                                    entity: 'User',
                                    entityId: targetUserId,
                                    userId: adminUserId,
                                    companyId: companyId,
                                    details: { mfaReset: true },
                                })];
                        case 3:
                            _a.sent();
                            return [2 /*return*/, { success: true, message: "MFA reset for user ".concat(targetUserId) }];
                    }
                });
            });
        };
        return UserAdminService_1;
    }());
    __setFunctionName(_classThis, "UserAdminService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        UserAdminService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return UserAdminService = _classThis;
}();
exports.UserAdminService = UserAdminService;
