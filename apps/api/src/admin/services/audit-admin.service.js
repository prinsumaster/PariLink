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
exports.AuditAdminService = void 0;
var common_1 = require("@nestjs/common");
var AuditAdminService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var AuditAdminService = _classThis = /** @class */ (function () {
        function AuditAdminService_1(prisma, audit) {
            this.prisma = prisma;
            this.audit = audit;
        }
        AuditAdminService_1.prototype.queryAuditLogs = function (companyId_1, dto_1) {
            return __awaiter(this, arguments, void 0, function (companyId, dto, isSuperAdmin) {
                var _a, page, _b, limit, entity, userId, actionPrefix, startDate, endDate, where, _c, data, total;
                var _this = this;
                if (isSuperAdmin === void 0) { isSuperAdmin = false; }
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            _a = dto.page, page = _a === void 0 ? 1 : _a, _b = dto.limit, limit = _b === void 0 ? 50 : _b, entity = dto.entity, userId = dto.userId, actionPrefix = dto.actionPrefix, startDate = dto.startDate, endDate = dto.endDate;
                            where = {};
                            if (!isSuperAdmin || companyId !== 'GLOBAL') {
                                where.companyId = companyId;
                            }
                            if (entity)
                                where.entity = entity;
                            if (userId)
                                where.userId = userId;
                            if (actionPrefix) {
                                where.action = { startsWith: actionPrefix };
                            }
                            if (startDate || endDate) {
                                where.createdAt = {};
                                if (startDate)
                                    where.createdAt.gte = new Date(startDate);
                                if (endDate)
                                    where.createdAt.lte = new Date(endDate);
                            }
                            return [4 /*yield*/, Promise.all([
                                    this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                        return __generator(this, function (_a) {
                                            return [2 /*return*/, tx.auditLog.findMany({
                                                    where: where,
                                                    orderBy: { createdAt: 'desc' },
                                                    skip: (page - 1) * limit,
                                                    take: limit,
                                                    include: {
                                                        user: {
                                                            select: {
                                                                id: true,
                                                                firstName: true,
                                                                lastName: true,
                                                                email: true,
                                                            },
                                                        },
                                                    },
                                                })];
                                        });
                                    }); }),
                                    this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.auditLog.count({ where: where })];
                                    }); }); }),
                                ])];
                        case 1:
                            _c = _d.sent(), data = _c[0], total = _c[1];
                            return [2 /*return*/, { data: data, total: total, page: page, limit: limit, totalPages: Math.ceil(total / limit) }];
                    }
                });
            });
        };
        AuditAdminService_1.prototype.getUserTimeline = function (companyId_1, userId_1) {
            return __awaiter(this, arguments, void 0, function (companyId, userId, page, limit) {
                if (page === void 0) { page = 1; }
                if (limit === void 0) { limit = 50; }
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.queryAuditLogs(companyId, { userId: userId, page: page, limit: limit })];
                });
            });
        };
        AuditAdminService_1.prototype.getSecurityEvents = function (companyId_1) {
            return __awaiter(this, arguments, void 0, function (companyId, page, limit) {
                var where, _a, data, total;
                var _this = this;
                if (page === void 0) { page = 1; }
                if (limit === void 0) { limit = 50; }
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            where = {
                                companyId: companyId,
                                OR: [
                                    { action: { startsWith: 'auth:' } },
                                    { action: { startsWith: 'security:' } },
                                    { action: { startsWith: 'sso:' } },
                                    { action: { startsWith: 'mfa:' } },
                                    { action: { startsWith: 'admin:security:' } },
                                    { action: { startsWith: 'admin:user:lock' } },
                                    { action: { startsWith: 'admin:user:suspend' } },
                                ],
                            };
                            return [4 /*yield*/, Promise.all([
                                    this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                        return __generator(this, function (_a) {
                                            return [2 /*return*/, tx.auditLog.findMany({
                                                    where: where,
                                                    orderBy: { createdAt: 'desc' },
                                                    skip: (page - 1) * limit,
                                                    take: limit,
                                                    include: {
                                                        user: {
                                                            select: {
                                                                id: true,
                                                                firstName: true,
                                                                lastName: true,
                                                                email: true,
                                                            },
                                                        },
                                                    },
                                                })];
                                        });
                                    }); }),
                                    this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.auditLog.count({ where: where })];
                                    }); }); }),
                                ])];
                        case 1:
                            _a = _b.sent(), data = _a[0], total = _a[1];
                            return [2 /*return*/, { data: data, total: total, page: page, limit: limit, totalPages: Math.ceil(total / limit) }];
                    }
                });
            });
        };
        AuditAdminService_1.prototype.getComplianceReport = function (companyId) {
            return __awaiter(this, void 0, void 0, function () {
                var now, thirtyDaysAgo, _a, totalEvents, authFailures, adminMutations, securityChanges, config, policies;
                var _this = this;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            now = new Date();
                            thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                            return [4 /*yield*/, Promise.all([
                                    this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                        return __generator(this, function (_a) {
                                            return [2 /*return*/, tx.auditLog.count({
                                                    where: { companyId: companyId, createdAt: { gte: thirtyDaysAgo } },
                                                })];
                                        });
                                    }); }),
                                    this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                        return __generator(this, function (_a) {
                                            return [2 /*return*/, tx.auditLog.count({
                                                    where: {
                                                        companyId: companyId,
                                                        createdAt: { gte: thirtyDaysAgo },
                                                        OR: [
                                                            { action: 'auth:login:failed' },
                                                            { action: 'auth:mfa:failed' },
                                                            { action: 'auth:brute_force_lock' },
                                                        ],
                                                    },
                                                })];
                                        });
                                    }); }),
                                    this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                        return __generator(this, function (_a) {
                                            return [2 /*return*/, tx.auditLog.count({
                                                    where: {
                                                        companyId: companyId,
                                                        createdAt: { gte: thirtyDaysAgo },
                                                        action: { startsWith: 'admin:' },
                                                    },
                                                })];
                                        });
                                    }); }),
                                    this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                        return __generator(this, function (_a) {
                                            return [2 /*return*/, tx.auditLog.count({
                                                    where: {
                                                        companyId: companyId,
                                                        createdAt: { gte: thirtyDaysAgo },
                                                        action: { startsWith: 'security:' },
                                                    },
                                                })];
                                        });
                                    }); }),
                                ])];
                        case 1:
                            _a = _b.sent(), totalEvents = _a[0], authFailures = _a[1], adminMutations = _a[2], securityChanges = _a[3];
                            return [4 /*yield*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                    return [2 /*return*/, tx.tenantConfiguration.findUnique({ where: { companyId: companyId } })];
                                }); }); })];
                        case 2:
                            config = _b.sent();
                            policies = ((config === null || config === void 0 ? void 0 : config.policies) || {});
                            return [2 /*return*/, {
                                    companyId: companyId,
                                    reportGeneratedAt: now.toISOString(),
                                    periodDays: 30,
                                    metrics: {
                                        totalAuditEvents: totalEvents,
                                        authenticationFailures: authFailures,
                                        administrativeMutations: adminMutations,
                                        securityPolicyModifications: securityChanges,
                                    },
                                    compliancePosture: {
                                        mfaRequired: !!policies.requireMfa,
                                        auditRetentionDays: policies.auditRetentionDays || 365,
                                        passwordExpiryDays: policies.passwordExpiryDays || 90,
                                        compliant: !!policies.requireMfa && (policies.auditRetentionDays || 365) >= 90,
                                    },
                                }];
                    }
                });
            });
        };
        AuditAdminService_1.prototype.getRetentionPolicy = function (companyId) {
            return __awaiter(this, void 0, void 0, function () {
                var config, policies;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, tx.tenantConfiguration.findUnique({ where: { companyId: companyId } })];
                            }); }); })];
                        case 1:
                            config = _a.sent();
                            policies = ((config === null || config === void 0 ? void 0 : config.policies) || {});
                            return [2 /*return*/, {
                                    companyId: companyId,
                                    auditRetentionDays: policies.auditRetentionDays || 365,
                                    autoArchiveEnabled: true,
                                }];
                    }
                });
            });
        };
        AuditAdminService_1.prototype.updateRetentionPolicy = function (companyId, dto, adminUserId) {
            return __awaiter(this, void 0, void 0, function () {
                var config, currentPolicies, updatedPolicies;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, tx.tenantConfiguration.findUnique({ where: { companyId: companyId } })];
                            }); }); })];
                        case 1:
                            config = _a.sent();
                            if (!config)
                                throw new common_1.NotFoundException("Tenant configuration for ".concat(companyId, " not found"));
                            currentPolicies = (config.policies || {});
                            updatedPolicies = __assign(__assign({}, currentPolicies), { auditRetentionDays: dto.auditRetentionDays });
                            return [4 /*yield*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.tenantConfiguration.update({
                                                where: { companyId: companyId },
                                                data: { policies: updatedPolicies },
                                            })];
                                    });
                                }); })];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, this.audit.logEvent({
                                    action: 'admin:audit:update_retention',
                                    entity: 'TenantConfiguration',
                                    entityId: config.id,
                                    userId: adminUserId,
                                    companyId: companyId,
                                    details: { auditRetentionDays: dto.auditRetentionDays },
                                })];
                        case 3:
                            _a.sent();
                            return [2 /*return*/, { companyId: companyId, auditRetentionDays: dto.auditRetentionDays }];
                    }
                });
            });
        };
        AuditAdminService_1.prototype.purgeExpiredLogs = function (companyId, adminUserId) {
            return __awaiter(this, void 0, void 0, function () {
                var policy, cutoffDate, result;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.getRetentionPolicy(companyId)];
                        case 1:
                            policy = _a.sent();
                            cutoffDate = new Date(Date.now() - policy.auditRetentionDays * 24 * 60 * 60 * 1000);
                            return [4 /*yield*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.auditLog.deleteMany({
                                                where: { companyId: companyId, createdAt: { lt: cutoffDate } },
                                            })];
                                    });
                                }); })];
                        case 2:
                            result = _a.sent();
                            return [4 /*yield*/, this.audit.logEvent({
                                    action: 'admin:audit:purge_expired',
                                    entity: 'AuditLog',
                                    entityId: companyId,
                                    userId: adminUserId,
                                    companyId: companyId,
                                    details: {
                                        purgedCount: result.count,
                                        cutoffDate: cutoffDate.toISOString(),
                                    },
                                })];
                        case 3:
                            _a.sent();
                            return [2 /*return*/, { purgedCount: result.count, cutoffDate: cutoffDate.toISOString() }];
                    }
                });
            });
        };
        return AuditAdminService_1;
    }());
    __setFunctionName(_classThis, "AuditAdminService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AuditAdminService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AuditAdminService = _classThis;
}();
exports.AuditAdminService = AuditAdminService;
