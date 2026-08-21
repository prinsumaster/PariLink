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
exports.PlatformController = void 0;
var common_1 = require("@nestjs/common");
var jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
var permissions_guard_1 = require("../../auth/guards/permissions.guard");
var permissions_decorator_1 = require("../../auth/decorators/permissions.decorator");
var swagger_1 = require("@nestjs/swagger");
// ---------------------------------------------------------------------------
// Platform Controller — Enterprise Admin & Observability API
//
// Routes:
//   GET  /api/v1/platform/health              — Kubernetes readiness probe
//   GET  /api/v1/platform/health/liveness     — Kubernetes liveness probe
//   GET  /api/v1/platform/health/deep         — Full diagnostic (auth required)
//   GET  /api/v1/platform/metrics             — Platform metrics (admin)
//   GET  /api/v1/platform/license/:tenantId   — License state
//   POST /api/v1/platform/features/:key/kill  — Emergency flag kill switch
//   GET  /api/v1/platform/audit-log           — Audit log query (admin)
//   GET  /api/v1/platform/roles/:id/cache/invalidate  — IAM cache invalidation
// ---------------------------------------------------------------------------
var PlatformController = function () {
    var _classDecorators = [(0, swagger_1.ApiTags)('Platform'), (0, common_1.Controller)('platform')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _readiness_decorators;
    var _liveness_decorators;
    var _deepHealth_decorators;
    var _getLicense_decorators;
    var _invalidateLicense_decorators;
    var _enableFlag_decorators;
    var _killFlag_decorators;
    var _invalidateRoleCache_decorators;
    var _getMetrics_decorators;
    var _getAuditLog_decorators;
    var _verifyAuditRecord_decorators;
    var _verifyAuditChain_decorators;
    var _exportAuditLogs_decorators;
    var PlatformController = _classThis = /** @class */ (function () {
        function PlatformController_1(health, license, features, iam, prisma, audit) {
            this.health = (__runInitializers(this, _instanceExtraInitializers), health);
            this.license = license;
            this.features = features;
            this.iam = iam;
            this.prisma = prisma;
            this.audit = audit;
        }
        // ── Health Probes ───────────────────────────────────────────────────────
        PlatformController_1.prototype.readiness = function (res) {
            return __awaiter(this, void 0, void 0, function () {
                var result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.health.readiness()];
                        case 1:
                            result = _a.sent();
                            return [2 /*return*/, res
                                    .status(result.status === 'UP' ? common_1.HttpStatus.OK : common_1.HttpStatus.SERVICE_UNAVAILABLE)
                                    .json(result)];
                    }
                });
            });
        };
        PlatformController_1.prototype.liveness = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.health.liveness()];
                });
            });
        };
        PlatformController_1.prototype.deepHealth = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.health.deepHealth()];
                });
            });
        };
        // ── License Management ──────────────────────────────────────────────────
        PlatformController_1.prototype.getLicense = function (tenantId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.license.getLicense(tenantId)];
                });
            });
        };
        PlatformController_1.prototype.invalidateLicense = function (tenantId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.license.invalidate(tenantId)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/, { message: "License cache invalidated for tenant ".concat(tenantId) }];
                    }
                });
            });
        };
        // ── Feature Flag Management ─────────────────────────────────────────────
        PlatformController_1.prototype.enableFlag = function (companyId, key, updatedBy) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.features.enable(companyId, key, updatedBy !== null && updatedBy !== void 0 ? updatedBy : 'ADMIN')];
                        case 1:
                            _a.sent();
                            return [2 /*return*/, { message: "Feature ".concat(key, " enabled for tenant ").concat(companyId) }];
                    }
                });
            });
        };
        PlatformController_1.prototype.killFlag = function (companyId, key, updatedBy) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.features.killSwitch(companyId, key, updatedBy !== null && updatedBy !== void 0 ? updatedBy : 'ADMIN')];
                        case 1:
                            _a.sent();
                            return [2 /*return*/, {
                                    message: "KILL SWITCH: Feature ".concat(key, " disabled for tenant ").concat(companyId),
                                }];
                    }
                });
            });
        };
        // ── IAM Cache Management ─────────────────────────────────────────────────
        PlatformController_1.prototype.invalidateRoleCache = function (roleId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    this.iam.invalidateRoleCache(roleId);
                    return [2 /*return*/, { message: "Permission cache cleared for role ".concat(roleId) }];
                });
            });
        };
        // ── Platform Metrics ────────────────────────────────────────────────────
        PlatformController_1.prototype.getMetrics = function (companyId_1, category_1) {
            return __awaiter(this, arguments, void 0, function (companyId, category, limit) {
                var _this = this;
                if (limit === void 0) { limit = '100'; }
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                return [2 /*return*/, tx.platformMetric.findMany({
                                        where: __assign(__assign({}, (companyId ? { companyId: companyId } : {})), (category ? { category: category } : {})),
                                        orderBy: { recordedAt: 'desc' },
                                        take: Math.min(Number(limit), 500),
                                    })];
                            });
                        }); })];
                });
            });
        };
        // ── Audit Log Query ─────────────────────────────────────────────────────
        PlatformController_1.prototype.getAuditLog = function (companyId_1, action_1, entity_1, userId_1) {
            return __awaiter(this, arguments, void 0, function (companyId, action, entity, userId, limit, cursor) {
                var _this = this;
                if (limit === void 0) { limit = '50'; }
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                return [2 /*return*/, tx.auditLog.findMany(__assign({ where: __assign(__assign(__assign(__assign({}, (companyId ? { companyId: companyId } : {})), (action ? { action: action } : {})), (entity ? { entity: entity } : {})), (userId ? { userId: userId } : {})), orderBy: { createdAt: 'desc' }, take: Math.min(Number(limit), 200) }, (cursor ? { cursor: { id: cursor }, skip: 1 } : {})))];
                            });
                        }); })];
                });
            });
        };
        // ── Audit Chain Verification ───────────────────────────────────────────
        PlatformController_1.prototype.verifyAuditRecord = function (auditLogId) {
            return __awaiter(this, void 0, void 0, function () {
                var isValid;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.audit.verifyIntegrity(auditLogId)];
                        case 1:
                            isValid = _a.sent();
                            return [2 /*return*/, { auditLogId: auditLogId, isValid: isValid }];
                    }
                });
            });
        };
        PlatformController_1.prototype.verifyAuditChain = function (companyId_1) {
            return __awaiter(this, arguments, void 0, function (companyId, limit) {
                if (limit === void 0) { limit = '1000'; }
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.audit.verifyChain(companyId, Math.min(Number(limit), 5000))];
                });
            });
        };
        PlatformController_1.prototype.exportAuditLogs = function (companyId, from, to, userId) {
            return __awaiter(this, void 0, void 0, function () {
                var fromDate, toDate;
                return __generator(this, function (_a) {
                    fromDate = from
                        ? new Date(from)
                        : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
                    toDate = to ? new Date(to) : new Date();
                    return [2 /*return*/, this.audit.exportAuditLogs(companyId, fromDate, toDate, userId)];
                });
            });
        };
        return PlatformController_1;
    }());
    __setFunctionName(_classThis, "PlatformController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _readiness_decorators = [(0, common_1.Get)('health')];
        _liveness_decorators = [(0, common_1.Get)('health/liveness')];
        _deepHealth_decorators = [(0, common_1.Get)('health/deep'), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard), (0, permissions_decorator_1.RequirePermissions)('platform:admin')];
        _getLicense_decorators = [(0, common_1.Get)('license/:tenantId'), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard), (0, permissions_decorator_1.RequirePermissions)('platform:admin')];
        _invalidateLicense_decorators = [(0, common_1.Post)('license/:tenantId/invalidate'), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard), (0, permissions_decorator_1.RequirePermissions)('platform:admin')];
        _enableFlag_decorators = [(0, common_1.Post)('features/:companyId/:key/enable'), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard), (0, permissions_decorator_1.RequirePermissions)('platform:admin')];
        _killFlag_decorators = [(0, common_1.Post)('features/:companyId/:key/kill'), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard), (0, permissions_decorator_1.RequirePermissions)('platform:admin')];
        _invalidateRoleCache_decorators = [(0, common_1.Post)('iam/roles/:roleId/cache/invalidate'), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard), (0, permissions_decorator_1.RequirePermissions)('platform:admin')];
        _getMetrics_decorators = [(0, common_1.Get)('metrics'), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard), (0, permissions_decorator_1.RequirePermissions)('platform:admin')];
        _getAuditLog_decorators = [(0, common_1.Get)('audit-log'), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard), (0, permissions_decorator_1.RequirePermissions)('platform:admin')];
        _verifyAuditRecord_decorators = [(0, common_1.Get)('audit-log/verify/:auditLogId'), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard), (0, permissions_decorator_1.RequirePermissions)('platform:admin'), (0, swagger_1.ApiOperation)({ summary: 'Verify integrity of a single audit log record' })];
        _verifyAuditChain_decorators = [(0, common_1.Get)('audit-log/chain/:companyId'), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard), (0, permissions_decorator_1.RequirePermissions)('platform:admin'), (0, swagger_1.ApiOperation)({ summary: 'Verify the hash chain for a tenant audit trail' })];
        _exportAuditLogs_decorators = [(0, common_1.Get)('audit-log/export/:companyId'), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard), (0, permissions_decorator_1.RequirePermissions)('platform:admin'), (0, swagger_1.ApiOperation)({ summary: 'Export audit logs for compliance' })];
        __esDecorate(_classThis, null, _readiness_decorators, { kind: "method", name: "readiness", static: false, private: false, access: { has: function (obj) { return "readiness" in obj; }, get: function (obj) { return obj.readiness; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _liveness_decorators, { kind: "method", name: "liveness", static: false, private: false, access: { has: function (obj) { return "liveness" in obj; }, get: function (obj) { return obj.liveness; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _deepHealth_decorators, { kind: "method", name: "deepHealth", static: false, private: false, access: { has: function (obj) { return "deepHealth" in obj; }, get: function (obj) { return obj.deepHealth; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getLicense_decorators, { kind: "method", name: "getLicense", static: false, private: false, access: { has: function (obj) { return "getLicense" in obj; }, get: function (obj) { return obj.getLicense; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _invalidateLicense_decorators, { kind: "method", name: "invalidateLicense", static: false, private: false, access: { has: function (obj) { return "invalidateLicense" in obj; }, get: function (obj) { return obj.invalidateLicense; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _enableFlag_decorators, { kind: "method", name: "enableFlag", static: false, private: false, access: { has: function (obj) { return "enableFlag" in obj; }, get: function (obj) { return obj.enableFlag; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _killFlag_decorators, { kind: "method", name: "killFlag", static: false, private: false, access: { has: function (obj) { return "killFlag" in obj; }, get: function (obj) { return obj.killFlag; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _invalidateRoleCache_decorators, { kind: "method", name: "invalidateRoleCache", static: false, private: false, access: { has: function (obj) { return "invalidateRoleCache" in obj; }, get: function (obj) { return obj.invalidateRoleCache; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getMetrics_decorators, { kind: "method", name: "getMetrics", static: false, private: false, access: { has: function (obj) { return "getMetrics" in obj; }, get: function (obj) { return obj.getMetrics; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getAuditLog_decorators, { kind: "method", name: "getAuditLog", static: false, private: false, access: { has: function (obj) { return "getAuditLog" in obj; }, get: function (obj) { return obj.getAuditLog; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _verifyAuditRecord_decorators, { kind: "method", name: "verifyAuditRecord", static: false, private: false, access: { has: function (obj) { return "verifyAuditRecord" in obj; }, get: function (obj) { return obj.verifyAuditRecord; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _verifyAuditChain_decorators, { kind: "method", name: "verifyAuditChain", static: false, private: false, access: { has: function (obj) { return "verifyAuditChain" in obj; }, get: function (obj) { return obj.verifyAuditChain; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _exportAuditLogs_decorators, { kind: "method", name: "exportAuditLogs", static: false, private: false, access: { has: function (obj) { return "exportAuditLogs" in obj; }, get: function (obj) { return obj.exportAuditLogs; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        PlatformController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return PlatformController = _classThis;
}();
exports.PlatformController = PlatformController;
