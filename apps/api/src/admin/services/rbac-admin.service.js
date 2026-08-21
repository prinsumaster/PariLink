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
exports.RbacAdminService = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
var common_1 = require("@nestjs/common");
var RbacAdminService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var RbacAdminService = _classThis = /** @class */ (function () {
        function RbacAdminService_1(prisma, audit) {
            this.prisma = prisma;
            this.audit = audit;
        }
        // ── 1. Permission Groups
        RbacAdminService_1.prototype.getPermissionGroups = function () {
            return [
                {
                    domain: 'admin',
                    name: 'Administration & System',
                    description: 'System administration, tenant config, audit logs',
                    permissions: [
                        'admin:*',
                        'admin:tenant:read',
                        'admin:tenant:write',
                        'admin:audit:read',
                    ],
                },
                {
                    domain: 'users',
                    name: 'User Management',
                    description: 'Manage users, roles, invitations, security status',
                    permissions: [
                        'users:*',
                        'users:read',
                        'users:create',
                        'users:update',
                        'users:suspend',
                        'users:lock',
                    ],
                },
                {
                    domain: 'dispatch',
                    name: 'Dispatch & Operations',
                    description: 'Manage trips, loads, drivers, vehicles',
                    permissions: [
                        'dispatch:*',
                        'dispatch:read',
                        'dispatch:assign',
                        'dispatch:update',
                        'trips:*',
                    ],
                },
                {
                    domain: 'finance',
                    name: 'Billing & Finance',
                    description: 'Manage invoices, payments, rate cards, expenses',
                    permissions: [
                        'finance:*',
                        'billing:read',
                        'billing:write',
                        'invoices:*',
                        'payments:*',
                    ],
                },
                {
                    domain: 'security',
                    name: 'Security & Compliance',
                    description: 'Manage security policies, SSO, MFA rules',
                    permissions: [
                        'security:*',
                        'security:policies:read',
                        'security:policies:write',
                        'sso:admin',
                    ],
                },
                {
                    domain: 'reports',
                    name: 'Analytics & Reporting',
                    description: 'Access reports, BI dashboards, data export',
                    permissions: ['reports:*', 'analytics:read', 'reports:export'],
                },
            ];
        };
        // ── 2. Role Templates
        RbacAdminService_1.prototype.getRoleTemplates = function () {
            return [
                {
                    name: 'Super Admin',
                    description: 'Full access across all modules',
                    permissions: ['*'],
                    isTemplate: true,
                },
                {
                    name: 'Tenant Admin',
                    description: 'Tenant administration and user management',
                    permissions: ['admin:*', 'users:*', 'security:*'],
                    isTemplate: true,
                },
                {
                    name: 'Dispatcher',
                    description: 'Operations and dispatch management',
                    permissions: ['dispatch:*', 'trips:*', 'users:read'],
                    isTemplate: true,
                },
                {
                    name: 'Finance Manager',
                    description: 'Billing, invoicing, and accounting',
                    permissions: ['finance:*', 'billing:*', 'invoices:*', 'reports:read'],
                    isTemplate: true,
                },
                {
                    name: 'Read-Only Auditor',
                    description: 'Read-only access to logs and records',
                    permissions: ['*:read', 'admin:audit:read'],
                    isTemplate: true,
                },
            ];
        };
        RbacAdminService_1.prototype.createRoleFromTemplate = function (companyId, dto, adminUserId) {
            return __awaiter(this, void 0, void 0, function () {
                var existing, role;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    return [2 /*return*/, tx.role.findFirst({
                                            where: { companyId: companyId, name: dto.name },
                                        })];
                                });
                            }); })];
                        case 1:
                            existing = _a.sent();
                            if (existing)
                                throw new common_1.ConflictException("Role ".concat(dto.name, " already exists"));
                            return [4 /*yield*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.role.create({
                                                data: {
                                                    companyId: companyId,
                                                    name: dto.name,
                                                    description: dto.description || "Created from template: ".concat(dto.name),
                                                    permissions: dto.permissions,
                                                },
                                            })];
                                    });
                                }); })];
                        case 2:
                            role = _a.sent();
                            return [4 /*yield*/, this.audit.logEvent({
                                    action: 'admin:rbac:create_role',
                                    entity: 'Role',
                                    entityId: role.id,
                                    userId: adminUserId,
                                    companyId: companyId,
                                    details: { role: dto },
                                })];
                        case 3:
                            _a.sent();
                            return [2 /*return*/, role];
                    }
                });
            });
        };
        // ── 3. Custom Roles CRUD
        RbacAdminService_1.prototype.getRoles = function (companyId) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                return [2 /*return*/, tx.role.findMany({
                                        where: { companyId: companyId },
                                        include: { _count: { select: { users: true } } },
                                        orderBy: { name: 'asc' },
                                    })];
                            });
                        }); })];
                });
            });
        };
        RbacAdminService_1.prototype.getRoleById = function (companyId, roleId) {
            return __awaiter(this, void 0, void 0, function () {
                var role;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    return [2 /*return*/, tx.role.findFirst({
                                            where: { id: roleId, companyId: companyId },
                                            include: {
                                                users: {
                                                    select: { id: true, email: true, firstName: true, lastName: true },
                                                },
                                            },
                                        })];
                                });
                            }); })];
                        case 1:
                            role = _a.sent();
                            if (!role)
                                throw new common_1.NotFoundException("Role ".concat(roleId, " not found"));
                            return [2 /*return*/, role];
                    }
                });
            });
        };
        RbacAdminService_1.prototype.updateRole = function (companyId, roleId, dto, adminUserId) {
            return __awaiter(this, void 0, void 0, function () {
                var existing, updated;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    return [2 /*return*/, tx.role.findFirst({
                                            where: { id: roleId, companyId: companyId },
                                        })];
                                });
                            }); })];
                        case 1:
                            existing = _a.sent();
                            if (!existing)
                                throw new common_1.NotFoundException("Role ".concat(roleId, " not found"));
                            return [4 /*yield*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    var _a, _b, _c;
                                    return __generator(this, function (_d) {
                                        return [2 /*return*/, tx.role.update({
                                                where: { id: roleId },
                                                data: {
                                                    name: (_a = dto.name) !== null && _a !== void 0 ? _a : existing.name,
                                                    description: (_b = dto.description) !== null && _b !== void 0 ? _b : existing.description,
                                                    permissions: ((_c = dto.permissions) !== null && _c !== void 0 ? _c : existing.permissions),
                                                },
                                            })];
                                    });
                                }); })];
                        case 2:
                            updated = _a.sent();
                            return [4 /*yield*/, this.audit.logEvent({
                                    action: 'admin:rbac:update_role',
                                    entity: 'Role',
                                    entityId: roleId,
                                    userId: adminUserId,
                                    companyId: companyId,
                                    details: {
                                        oldPermissions: existing.permissions,
                                        newPermissions: updated.permissions,
                                    },
                                })];
                        case 3:
                            _a.sent();
                            return [2 /*return*/, updated];
                    }
                });
            });
        };
        RbacAdminService_1.prototype.deleteRole = function (companyId, roleId, adminUserId) {
            return __awaiter(this, void 0, void 0, function () {
                var existing;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    return [2 /*return*/, tx.role.findFirst({
                                            where: { id: roleId, companyId: companyId },
                                            include: { _count: { select: { users: true } } },
                                        })];
                                });
                            }); })];
                        case 1:
                            existing = _a.sent();
                            if (!existing)
                                throw new common_1.NotFoundException("Role ".concat(roleId, " not found"));
                            if (existing._count.users > 0) {
                                throw new common_1.ConflictException("Cannot delete role ".concat(existing.name, " because it has ").concat(existing._count.users, " assigned users"));
                            }
                            return [4 /*yield*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.role.update({
                                                where: { id: roleId },
                                                data: { deletedAt: new Date() },
                                            })];
                                    });
                                }); })];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, this.audit.logEvent({
                                    action: 'admin:rbac:delete_role',
                                    entity: 'Role',
                                    entityId: roleId,
                                    userId: adminUserId,
                                    companyId: companyId,
                                    details: { name: existing.name },
                                })];
                        case 3:
                            _a.sent();
                            return [2 /*return*/, { success: true }];
                    }
                });
            });
        };
        // ── 4. Delegated Administration & 5. Temporary Permissions
        RbacAdminService_1.prototype.setDelegatedScope = function (companyId, userId, delegatedScopes, adminUserId) {
            return __awaiter(this, void 0, void 0, function () {
                var user, currentPrefs, updatedPrefs, updated;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, tx.user.findFirst({ where: { id: userId, companyId: companyId } })];
                            }); }); })];
                        case 1:
                            user = _a.sent();
                            if (!user)
                                throw new common_1.NotFoundException("User ".concat(userId, " not found"));
                            currentPrefs = (user.preferences || {});
                            updatedPrefs = __assign(__assign({}, currentPrefs), { delegatedScopes: delegatedScopes });
                            return [4 /*yield*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.user.update({
                                                where: { id: userId },
                                                data: { preferences: updatedPrefs },
                                            })];
                                    });
                                }); })];
                        case 2:
                            updated = _a.sent();
                            return [4 /*yield*/, this.audit.logEvent({
                                    action: 'admin:rbac:set_delegated_scope',
                                    entity: 'User',
                                    entityId: userId,
                                    userId: adminUserId,
                                    companyId: companyId,
                                    details: { delegatedScopes: delegatedScopes },
                                })];
                        case 3:
                            _a.sent();
                            return [2 /*return*/, { id: updated.id, email: updated.email, delegatedScopes: delegatedScopes }];
                    }
                });
            });
        };
        RbacAdminService_1.prototype.grantTemporaryPermission = function (companyId, userId, permission, expiresAtIso, adminUserId) {
            return __awaiter(this, void 0, void 0, function () {
                var user, currentPrefs, tempPerms, updated;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, tx.user.findFirst({ where: { id: userId, companyId: companyId } })];
                            }); }); })];
                        case 1:
                            user = _a.sent();
                            if (!user)
                                throw new common_1.NotFoundException("User ".concat(userId, " not found"));
                            currentPrefs = (user.preferences || {});
                            tempPerms = Array.isArray(currentPrefs.tempPermissions)
                                ? currentPrefs.tempPermissions
                                : [];
                            tempPerms.push({
                                permission: permission,
                                expiresAt: expiresAtIso,
                                grantedBy: adminUserId,
                                grantedAt: new Date().toISOString(),
                            });
                            return [4 /*yield*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.user.update({
                                                where: { id: userId },
                                                data: { preferences: __assign(__assign({}, currentPrefs), { tempPermissions: tempPerms }) },
                                            })];
                                    });
                                }); })];
                        case 2:
                            updated = _a.sent();
                            return [4 /*yield*/, this.audit.logEvent({
                                    action: 'admin:rbac:grant_temp_permission',
                                    entity: 'User',
                                    entityId: userId,
                                    userId: adminUserId,
                                    companyId: companyId,
                                    details: { permission: permission, expiresAt: expiresAtIso },
                                })];
                        case 3:
                            _a.sent();
                            return [2 /*return*/, { id: updated.id, email: updated.email, tempPermissions: tempPerms }];
                    }
                });
            });
        };
        // ── 6. Permission Simulator
        RbacAdminService_1.prototype.simulatePermission = function (companyId, dto) {
            return __awaiter(this, void 0, void 0, function () {
                var user, rolePerms, currentPrefs, tempPerms, now, activeTempPerms, allPerms, hasWildcard, exactMatch, domainPrefix, domainMatch, isAllowed;
                var _this = this;
                var _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0: return [4 /*yield*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    return [2 /*return*/, tx.user.findFirst({
                                            where: { id: dto.userId, companyId: companyId },
                                            include: { role: true, department: true, team: true },
                                        })];
                                });
                            }); })];
                        case 1:
                            user = _c.sent();
                            if (!user)
                                throw new common_1.NotFoundException("User ".concat(dto.userId, " not found"));
                            rolePerms = Array.isArray((_a = user.role) === null || _a === void 0 ? void 0 : _a.permissions)
                                ? user.role.permissions
                                : [];
                            currentPrefs = (user.preferences || {});
                            tempPerms = Array.isArray(currentPrefs.tempPermissions)
                                ? currentPrefs.tempPermissions
                                : [];
                            now = new Date().getTime();
                            activeTempPerms = tempPerms
                                .filter(function (p) { return new Date(p.expiresAt).getTime() > now; })
                                .map(function (p) { return p.permission; });
                            allPerms = __spreadArray(__spreadArray([], rolePerms, true), activeTempPerms, true);
                            hasWildcard = allPerms.includes('*');
                            exactMatch = allPerms.includes(dto.permission);
                            domainPrefix = dto.permission.split(':')[0] + ':*';
                            domainMatch = allPerms.includes(domainPrefix);
                            isAllowed = hasWildcard || exactMatch || domainMatch;
                            return [2 /*return*/, {
                                    userId: user.id,
                                    email: user.email,
                                    roleName: ((_b = user.role) === null || _b === void 0 ? void 0 : _b.name) || 'No Role',
                                    simulatedAction: dto.permission,
                                    allowed: isAllowed,
                                    reason: hasWildcard
                                        ? 'Allowed by wildcard (*) permission on role'
                                        : exactMatch
                                            ? "Allowed by exact permission match (".concat(dto.permission, ")")
                                            : domainMatch
                                                ? "Allowed by domain wildcard (".concat(domainPrefix, ")")
                                                : 'Denied: permission not granted on role or active temporary permissions',
                                    effectivePermissions: allPerms,
                                    delegatedScopes: currentPrefs.delegatedScopes || null,
                                }];
                    }
                });
            });
        };
        return RbacAdminService_1;
    }());
    __setFunctionName(_classThis, "RbacAdminService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        RbacAdminService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return RbacAdminService = _classThis;
}();
exports.RbacAdminService = RbacAdminService;
