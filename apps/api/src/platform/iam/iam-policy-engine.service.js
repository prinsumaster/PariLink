"use strict";
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
exports.IamPolicyEngineService = void 0;
var common_1 = require("@nestjs/common");
var IamPolicyEngineService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var IamPolicyEngineService = _classThis = /** @class */ (function () {
        function IamPolicyEngineService_1(prisma) {
            this.prisma = prisma;
            this.logger = new common_1.Logger(IamPolicyEngineService.name);
            this.cache = new Map();
            this.CACHE_TTL_MS = 60000; // 60 seconds
        }
        /**
         * Primary authorization check.
         */
        IamPolicyEngineService_1.prototype.authorize = function (ctx) {
            return __awaiter(this, void 0, void 0, function () {
                var permissions, requiredPermission, wildcardPermission, stringPerms, hasRbac, abacRules, hasAbac, failedAbacReason, user, _i, abacRules_1, rule, ruleSatisfied, conditions, canAccessOthers;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            // Layer 3: Row-Level Security — ALWAYS enforce tenant isolation first
                            if (ctx.resourceCompanyId && ctx.resourceCompanyId !== ctx.companyId) {
                                this.logger.warn("[IAM] Cross-tenant access denied: user from tenant ".concat(ctx.companyId, " attempted ") +
                                    "to access resource owned by ".concat(ctx.resourceCompanyId));
                                return [2 /*return*/, { granted: false, reason: 'CROSS_TENANT_ACCESS_DENIED' }];
                            }
                            if (!ctx.roleId) {
                                return [2 /*return*/, { granted: false, reason: 'NO_ROLE_ASSIGNED' }];
                            }
                            return [4 /*yield*/, this.loadPermissions(ctx.roleId, ctx.companyId)];
                        case 1:
                            permissions = _a.sent();
                            // Super-admin bypass
                            if (permissions.includes('*')) {
                                return [2 /*return*/, { granted: true, reason: 'SUPER_ADMIN' }];
                            }
                            requiredPermission = "".concat(ctx.resource, ":").concat(ctx.action);
                            wildcardPermission = "".concat(ctx.resource, ":*");
                            stringPerms = permissions.filter(function (p) { return typeof p === 'string'; });
                            hasRbac = stringPerms.includes(requiredPermission) ||
                                stringPerms.includes(wildcardPermission);
                            abacRules = permissions.filter(function (p) {
                                return typeof p === 'object' &&
                                    p.resource === ctx.resource &&
                                    (p.action === ctx.action || p.action === '*');
                            });
                            hasAbac = false;
                            failedAbacReason = '';
                            if (!(abacRules.length > 0)) return [3 /*break*/, 3];
                            return [4 /*yield*/, this.prisma.runAsTenant(ctx.companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.user.findUnique({
                                                where: { id: ctx.userId },
                                                select: { branchId: true, region: true, costCenterId: true },
                                            })];
                                    });
                                }); })];
                        case 2:
                            user = _a.sent();
                            for (_i = 0, abacRules_1 = abacRules; _i < abacRules_1.length; _i++) {
                                rule = abacRules_1[_i];
                                ruleSatisfied = true;
                                conditions = rule.conditions || {};
                                if (conditions.branchId === '$user.branchId' &&
                                    ctx.resourceBranchId !== (user === null || user === void 0 ? void 0 : user.branchId)) {
                                    ruleSatisfied = false;
                                    failedAbacReason = 'BRANCH_ISOLATION_VIOLATION';
                                }
                                if (conditions.region === '$user.region' &&
                                    ctx.resourceRegion !== (user === null || user === void 0 ? void 0 : user.region)) {
                                    ruleSatisfied = false;
                                    failedAbacReason = 'REGION_ISOLATION_VIOLATION';
                                }
                                if (conditions.costCenterId === '$user.costCenterId' &&
                                    ctx.resourceCostCenterId !== (user === null || user === void 0 ? void 0 : user.costCenterId)) {
                                    ruleSatisfied = false;
                                    failedAbacReason = 'COST_CENTER_ISOLATION_VIOLATION';
                                }
                                if (ruleSatisfied) {
                                    hasAbac = true;
                                    break;
                                }
                            }
                            return [3 /*break*/, 4];
                        case 3:
                            // If no ABAC rules specifically constrain this, fallback to RBAC
                            hasAbac = hasRbac;
                            _a.label = 4;
                        case 4:
                            if (!hasAbac && !hasRbac) {
                                return [2 /*return*/, {
                                        granted: false,
                                        reason: failedAbacReason || "MISSING_PERMISSION:".concat(requiredPermission),
                                    }];
                            }
                            // Default Ownership Check (Implicit ABAC constraint)
                            if (ctx.resourceOwnerId && ctx.resourceOwnerId !== ctx.userId) {
                                canAccessOthers = stringPerms.includes("".concat(ctx.resource, ":read:any"));
                                if (!canAccessOthers && !hasAbac) {
                                    // Allow explicit ABAC to override ownership
                                    return [2 /*return*/, { granted: false, reason: 'OWNERSHIP_VIOLATION' }];
                                }
                            }
                            return [2 /*return*/, { granted: true, reason: 'ABAC_RBAC_GRANTED' }];
                    }
                });
            });
        };
        IamPolicyEngineService_1.prototype.hasPermission = function (roleId, companyId, permission) {
            return __awaiter(this, void 0, void 0, function () {
                var permissions, stringPerms, resource;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.loadPermissions(roleId, companyId)];
                        case 1:
                            permissions = _a.sent();
                            stringPerms = permissions.filter(function (p) { return typeof p === 'string'; });
                            resource = permission.split(':')[0];
                            return [2 /*return*/, (stringPerms.includes(permission) ||
                                    stringPerms.includes("".concat(resource, ":*")) ||
                                    stringPerms.includes('*'))];
                    }
                });
            });
        };
        IamPolicyEngineService_1.prototype.invalidateRoleCache = function (roleId) {
            this.cache.delete(roleId);
            this.logger.debug("[IAM] Cache invalidated for role ".concat(roleId));
        };
        IamPolicyEngineService_1.prototype.loadPermissions = function (roleId, companyId) {
            return __awaiter(this, void 0, void 0, function () {
                var cacheKey, cached, role, permissions;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            cacheKey = "".concat(companyId, ":").concat(roleId);
                            cached = this.cache.get(cacheKey);
                            if (cached && cached.expiry > Date.now()) {
                                return [2 /*return*/, cached.permissions];
                            }
                            return [4 /*yield*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.role.findUnique({
                                                where: { id: roleId },
                                                select: { permissions: true },
                                            })];
                                    });
                                }); })];
                        case 1:
                            role = _a.sent();
                            permissions = Array.isArray(role === null || role === void 0 ? void 0 : role.permissions)
                                ? role.permissions
                                : [];
                            this.cache.set(cacheKey, {
                                permissions: permissions,
                                expiry: Date.now() + this.CACHE_TTL_MS,
                            });
                            return [2 /*return*/, permissions];
                    }
                });
            });
        };
        return IamPolicyEngineService_1;
    }());
    __setFunctionName(_classThis, "IamPolicyEngineService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        IamPolicyEngineService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return IamPolicyEngineService = _classThis;
}();
exports.IamPolicyEngineService = IamPolicyEngineService;
