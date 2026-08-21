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
exports.AdminService = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
var common_1 = require("@nestjs/common");
var bcrypt = __importStar(require("bcrypt"));
var AdminService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var AdminService = _classThis = /** @class */ (function () {
        function AdminService_1(prisma) {
            this.prisma = prisma;
        }
        AdminService_1.prototype.createSubscriptionPlan = function (dto) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                return [2 /*return*/, tx.subscriptionPlan.create({
                                        data: dto,
                                    })];
                            });
                        }); })];
                });
            });
        };
        AdminService_1.prototype.getSubscriptionPlans = function () {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, tx.subscriptionPlan.findMany()];
                        }); }); })];
                });
            });
        };
        AdminService_1.prototype.provisionTenant = function (dto) {
            return __awaiter(this, void 0, void 0, function () {
                var existingUser, hashedPassword;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    return [2 /*return*/, tx.user.findUnique({
                                            where: { email: dto.adminEmail },
                                        })];
                                });
                            }); })];
                        case 1:
                            existingUser = _a.sent();
                            if (existingUser) {
                                throw new common_1.ConflictException('Admin email already in use globally');
                            }
                            return [4 /*yield*/, bcrypt.hash(dto.adminPassword, 10)];
                        case 2:
                            hashedPassword = _a.sent();
                            // Create the tenant, config, role, and admin user in a transaction
                            return [2 /*return*/, this.prisma.$transaction(function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    var company, adminRole, adminUser;
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0: return [4 /*yield*/, tx.company.create({
                                                    data: {
                                                        name: dto.name,
                                                        subscriptionPlanId: dto.subscriptionPlanId,
                                                    },
                                                })];
                                            case 1:
                                                company = _a.sent();
                                                // Default tenant config
                                                return [4 /*yield*/, tx.tenantConfiguration.create({
                                                        data: {
                                                            companyId: company.id,
                                                            settings: { timezone: 'UTC', currency: 'USD' },
                                                            theme: { primaryColor: '#000000', logoUrl: '' },
                                                            policies: { requireMfa: false },
                                                        },
                                                    })];
                                            case 2:
                                                // Default tenant config
                                                _a.sent();
                                                return [4 /*yield*/, tx.role.create({
                                                        data: {
                                                            companyId: company.id,
                                                            name: 'Super Admin',
                                                            description: 'Tenant Super Administrator',
                                                            permissions: ['*'], // wildcard permission
                                                        },
                                                    })];
                                            case 3:
                                                adminRole = _a.sent();
                                                return [4 /*yield*/, tx.user.create({
                                                        data: {
                                                            companyId: company.id,
                                                            email: dto.adminEmail,
                                                            password: hashedPassword,
                                                            firstName: dto.adminFirstName,
                                                            lastName: dto.adminLastName,
                                                            roleId: adminRole.id,
                                                        },
                                                    })];
                                            case 4:
                                                adminUser = _a.sent();
                                                return [2 /*return*/, { company: company, adminUser: adminUser }];
                                        }
                                    });
                                }); })];
                    }
                });
            });
        };
        AdminService_1.prototype.suspendTenant = function (companyId) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                return [2 /*return*/, tx.company.update({
                                        where: { id: companyId },
                                        data: { status: 'SUSPENDED' },
                                    })];
                            });
                        }); })];
                });
            });
        };
        AdminService_1.prototype.updateTenantConfig = function (companyId, dto) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    // This uses runAsTenant to ensure safety if called by a tenant admin
                    return [2 /*return*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                            var config;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, tx.tenantConfiguration.findUnique({
                                            where: { companyId: companyId },
                                        })];
                                    case 1:
                                        config = _a.sent();
                                        if (!config)
                                            throw new common_1.NotFoundException('Tenant config not found');
                                        return [2 /*return*/, tx.tenantConfiguration.update({
                                                where: { companyId: companyId },
                                                data: {
                                                    settings: (dto.settings || config.settings),
                                                    theme: (dto.theme || config.theme),
                                                    policies: (dto.policies || config.policies),
                                                },
                                            })];
                                }
                            });
                        }); })];
                });
            });
        };
        // ─────────────────────────────────────────────────────────────
        // V27 — MARKETPLACE
        // ─────────────────────────────────────────────────────────────
        AdminService_1.prototype.getMarketplaceApps = function (companyId) {
            return __awaiter(this, void 0, void 0, function () {
                var _a, apps, installations, installedMap;
                var _this = this;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, Promise.all([
                                this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                    return [2 /*return*/, tx.marketplaceApp.findMany({ orderBy: { name: 'asc' } })];
                                }); }); }),
                                this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                    return [2 /*return*/, tx.appInstallation.findMany({ where: { companyId: companyId } })];
                                }); }); }),
                            ])];
                        case 1:
                            _a = _b.sent(), apps = _a[0], installations = _a[1];
                            installedMap = new Map(installations.map(function (i) { return [i.appId, i]; }));
                            return [2 /*return*/, apps.map(function (app) { return (__assign(__assign({}, app), { isInstalled: installedMap.has(app.id), installation: installedMap.get(app.id) || null })); })];
                    }
                });
            });
        };
        AdminService_1.prototype.installApp = function (companyId_1, userId_1, appId_1) {
            return __awaiter(this, arguments, void 0, function (companyId, userId, appId, credentials, settings) {
                var app;
                var _this = this;
                if (credentials === void 0) { credentials = {}; }
                if (settings === void 0) { settings = {}; }
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    return [2 /*return*/, tx.marketplaceApp.findUnique({
                                            where: { id: appId },
                                        })];
                                });
                            }); })];
                        case 1:
                            app = _a.sent();
                            if (!app)
                                throw new common_1.NotFoundException('App not found');
                            return [2 /*return*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.appInstallation.upsert({
                                                where: { companyId_appId: { companyId: companyId, appId: appId } },
                                                update: {
                                                    status: 'ACTIVE',
                                                    credentials: credentials,
                                                    settings: settings,
                                                    installedBy: userId,
                                                },
                                                create: {
                                                    companyId: companyId,
                                                    appId: appId,
                                                    status: 'ACTIVE',
                                                    credentials: credentials,
                                                    settings: settings,
                                                    installedBy: userId,
                                                },
                                            })];
                                    });
                                }); })];
                    }
                });
            });
        };
        AdminService_1.prototype.uninstallApp = function (companyId, appId) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                return [2 /*return*/, tx.appInstallation.updateMany({
                                        where: { companyId: companyId, appId: appId },
                                        data: { status: 'UNINSTALLED' },
                                    })];
                            });
                        }); })];
                });
            });
        };
        AdminService_1.prototype.updateAppSettings = function (companyId, appId, settings) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                return [2 /*return*/, tx.appInstallation.update({
                                        where: { companyId_appId: { companyId: companyId, appId: appId } },
                                        data: { settings: settings },
                                    })];
                            });
                        }); })];
                });
            });
        };
        // ─────────────────────────────────────────────────────────────
        // V27 — FEATURE FLAGS
        // ─────────────────────────────────────────────────────────────
        AdminService_1.prototype.getFeatureFlags = function (companyId) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, tx.featureFlag.findMany({ where: { companyId: companyId } })];
                        }); }); })];
                });
            });
        };
        AdminService_1.prototype.upsertFeatureFlag = function (companyId, key, isEnabled, description) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                return [2 /*return*/, tx.featureFlag.upsert({
                                        where: { companyId_key: { companyId: companyId, key: key } },
                                        update: { isEnabled: isEnabled, description: description },
                                        create: {
                                            companyId: companyId,
                                            key: key,
                                            name: key,
                                            isEnabled: isEnabled,
                                            description: description || key,
                                        },
                                    })];
                            });
                        }); })];
                });
            });
        };
        // ─────────────────────────────────────────────────────────────
        // V27 — AUDIT LOGS
        // ─────────────────────────────────────────────────────────────
        AdminService_1.prototype.getAuditLogs = function (companyId_1) {
            return __awaiter(this, arguments, void 0, function (companyId, options) {
                var _a, page, _b, limit, entity, userId, where, _c, data, total;
                var _this = this;
                if (options === void 0) { options = {}; }
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            _a = options.page, page = _a === void 0 ? 1 : _a, _b = options.limit, limit = _b === void 0 ? 50 : _b, entity = options.entity, userId = options.userId;
                            where = { companyId: companyId };
                            if (entity)
                                where.entity = entity;
                            if (userId)
                                where.userId = userId;
                            return [4 /*yield*/, Promise.all([
                                    this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                        return __generator(this, function (_a) {
                                            return [2 /*return*/, tx.auditLog.findMany({
                                                    where: where,
                                                    orderBy: { createdAt: 'desc' },
                                                    skip: (page - 1) * limit,
                                                    take: limit,
                                                    include: {
                                                        user: { select: { firstName: true, lastName: true, email: true } },
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
                            return [2 /*return*/, { data: data, total: total, page: page, limit: limit }];
                    }
                });
            });
        };
        // ─────────────────────────────────────────────────────────────
        // V27 — USERS MANAGEMENT
        // ─────────────────────────────────────────────────────────────
        AdminService_1.prototype.getAllUsers = function (companyId) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                return [2 /*return*/, tx.user.findMany({
                                        where: { companyId: companyId },
                                        select: {
                                            id: true,
                                            firstName: true,
                                            lastName: true,
                                            email: true,
                                            phone: true,
                                            status: true,
                                            createdAt: true,
                                            role: { select: { id: true, name: true } },
                                        },
                                        orderBy: { createdAt: 'desc' },
                                    })];
                            });
                        }); })];
                });
            });
        };
        AdminService_1.prototype.getAllRoles = function (companyId) {
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
        return AdminService_1;
    }());
    __setFunctionName(_classThis, "AdminService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AdminService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AdminService = _classThis;
}();
exports.AdminService = AdminService;
