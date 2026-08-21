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
exports.LicenseAdminService = void 0;
var common_1 = require("@nestjs/common");
// ─── Default capacity per plan code ──────────────────────────────────────────
var PLAN_DEFAULTS = {
    STARTER: { maxVehicles: 20, maxDrivers: 50 },
    GROWTH: { maxVehicles: 50, maxDrivers: 100 },
    PROFESSIONAL: { maxVehicles: 100, maxDrivers: 200 },
    BUSINESS: { maxVehicles: 250, maxDrivers: 500 },
    ENTERPRISE: { maxVehicles: 500, maxDrivers: 1000 },
    ENTERPRISE_PLUS: { maxVehicles: 1000, maxDrivers: 2000 },
    CUSTOM: { maxVehicles: 99999, maxDrivers: 99999 },
};
var LicenseAdminService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var LicenseAdminService = _classThis = /** @class */ (function () {
        function LicenseAdminService_1(prisma, audit) {
            this.prisma = prisma;
            this.audit = audit;
        }
        // ─── Get full license overview for a tenant ─────────────────────────────────
        LicenseAdminService_1.prototype.getLicenseOverview = function (companyId) {
            return __awaiter(this, void 0, void 0, function () {
                var _a, company, config, tenantConfig, activeUsersCount, totalUsersCount, vehicleCount, driverCount, maxUsers, maxVehicles, maxDrivers, storageQuotaMb, apiRateLimit, unlimitedMode, boostExpiresAt, boostMaxVehicles, now, isInBoostPeriod, effectiveVehicleLimit, settings;
                var _this = this;
                var _b, _c, _d, _e, _f, _g, _h, _j;
                return __generator(this, function (_k) {
                    switch (_k.label) {
                        case 0: return [4 /*yield*/, Promise.all([
                                this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.company.findUnique({
                                                where: { id: companyId },
                                                include: { subscriptionPlan: true },
                                            })];
                                    });
                                }); }),
                                this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                    return [2 /*return*/, tx.tenantConfiguration.findUnique({ where: { companyId: companyId } })];
                                }); }); }),
                                this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                    return [2 /*return*/, tx.tenantConfig.findUnique({ where: { companyId: companyId } })];
                                }); }); }),
                                this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                    return [2 /*return*/, tx.user.count({ where: { companyId: companyId, status: 'ACTIVE' } })];
                                }); }); }),
                                this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                    return [2 /*return*/, tx.user.count({ where: { companyId: companyId } })];
                                }); }); }),
                                this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                    return [2 /*return*/, tx.vehicle.count({ where: { companyId: companyId } })];
                                }); }); }),
                                this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                    return [2 /*return*/, tx.driver.count({ where: { companyId: companyId } })];
                                }); }); }),
                            ])];
                        case 1:
                            _a = _k.sent(), company = _a[0], config = _a[1], tenantConfig = _a[2], activeUsersCount = _a[3], totalUsersCount = _a[4], vehicleCount = _a[5], driverCount = _a[6];
                            if (!company)
                                throw new common_1.NotFoundException("Tenant ".concat(companyId, " not found"));
                            maxUsers = (_b = tenantConfig === null || tenantConfig === void 0 ? void 0 : tenantConfig.maxUsers) !== null && _b !== void 0 ? _b : 50;
                            maxVehicles = (_c = tenantConfig === null || tenantConfig === void 0 ? void 0 : tenantConfig.maxVehicles) !== null && _c !== void 0 ? _c : 20;
                            maxDrivers = (_d = tenantConfig === null || tenantConfig === void 0 ? void 0 : tenantConfig.maxDrivers) !== null && _d !== void 0 ? _d : 50;
                            storageQuotaMb = (_e = tenantConfig === null || tenantConfig === void 0 ? void 0 : tenantConfig.storageQuotaMb) !== null && _e !== void 0 ? _e : 10000;
                            apiRateLimit = (_f = tenantConfig === null || tenantConfig === void 0 ? void 0 : tenantConfig.apiRateLimit) !== null && _f !== void 0 ? _f : 1000;
                            unlimitedMode = (_g = tenantConfig === null || tenantConfig === void 0 ? void 0 : tenantConfig.unlimitedMode) !== null && _g !== void 0 ? _g : false;
                            boostExpiresAt = (_h = tenantConfig === null || tenantConfig === void 0 ? void 0 : tenantConfig.boostExpiresAt) !== null && _h !== void 0 ? _h : null;
                            boostMaxVehicles = (_j = tenantConfig === null || tenantConfig === void 0 ? void 0 : tenantConfig.boostMaxVehicles) !== null && _j !== void 0 ? _j : null;
                            now = new Date();
                            isInBoostPeriod = boostExpiresAt && boostExpiresAt > now;
                            effectiveVehicleLimit = isInBoostPeriod && boostMaxVehicles ? boostMaxVehicles : maxVehicles;
                            settings = ((config === null || config === void 0 ? void 0 : config.settings) || {});
                            return [2 /*return*/, {
                                    companyId: companyId,
                                    subscriptionPlan: company.subscriptionPlan || {
                                        id: 'default',
                                        name: 'Standard Enterprise',
                                        planCode: 'ENTERPRISE',
                                        price: 0,
                                    },
                                    capacity: {
                                        vehicles: {
                                            used: vehicleCount,
                                            limit: maxVehicles,
                                            effectiveLimit: effectiveVehicleLimit,
                                            utilizationPct: unlimitedMode
                                                ? 0
                                                : Math.round((vehicleCount / effectiveVehicleLimit) * 100),
                                            unlimitedMode: unlimitedMode,
                                            boost: isInBoostPeriod ? { boostMaxVehicles: boostMaxVehicles, boostExpiresAt: boostExpiresAt } : null,
                                        },
                                        drivers: {
                                            used: driverCount,
                                            limit: maxDrivers,
                                            utilizationPct: Math.round((driverCount / maxDrivers) * 100),
                                        },
                                        users: {
                                            used: activeUsersCount,
                                            total: totalUsersCount,
                                            limit: maxUsers,
                                            utilizationPct: Math.round((activeUsersCount / maxUsers) * 100),
                                        },
                                        storage: {
                                            quotaMb: storageQuotaMb,
                                            usedMb: settings.storageUsedMb || 0,
                                            utilizationPct: Math.round(((settings.storageUsedMb || 0) / storageQuotaMb) * 100),
                                        },
                                        api: {
                                            rateLimitPerMinute: apiRateLimit,
                                        },
                                    },
                                    trialMode: {
                                        isTrial: !!settings.isTrial,
                                        trialEndsAt: settings.trialEndsAt || null,
                                    },
                                    gracePeriod: {
                                        inGracePeriod: !!settings.inGracePeriod,
                                        gracePeriodDays: settings.gracePeriodDays || 14,
                                        gracePeriodEndsAt: settings.gracePeriodEndsAt || null,
                                    },
                                }];
                    }
                });
            });
        };
        // ─── Assign subscription plan ───────────────────────────────────────────────
        LicenseAdminService_1.prototype.assignPlan = function (companyId, dto, adminUserId) {
            return __awaiter(this, void 0, void 0, function () {
                var company, plan, planCode, planDefaults;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    return [2 /*return*/, tx.company.findUnique({
                                            where: { id: companyId },
                                            include: { subscriptionPlan: true },
                                        })];
                                });
                            }); })];
                        case 1:
                            company = _a.sent();
                            if (!company)
                                throw new common_1.NotFoundException("Tenant ".concat(companyId, " not found"));
                            return [4 /*yield*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                    return [2 /*return*/, tx.subscriptionPlan.findUnique({ where: { id: dto.subscriptionPlanId } })];
                                }); }); })];
                        case 2:
                            plan = _a.sent();
                            planCode = (plan === null || plan === void 0 ? void 0 : plan.planCode) || 'STARTER';
                            planDefaults = PLAN_DEFAULTS[planCode] || PLAN_DEFAULTS['STARTER'];
                            return [4 /*yield*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.company.update({
                                                where: { id: companyId },
                                                data: { subscriptionPlanId: dto.subscriptionPlanId },
                                            })];
                                    });
                                }); })];
                        case 3:
                            _a.sent();
                            return [4 /*yield*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
                                    return __generator(this, function (_l) {
                                        return [2 /*return*/, tx.tenantConfig.upsert({
                                                where: { companyId: companyId },
                                                update: {
                                                    maxUsers: (_a = dto.seats) !== null && _a !== void 0 ? _a : undefined,
                                                    apiRateLimit: (_b = dto.apiRateLimit) !== null && _b !== void 0 ? _b : undefined,
                                                    storageQuotaMb: (_c = dto.storageQuotaMb) !== null && _c !== void 0 ? _c : undefined,
                                                    maxVehicles: (_d = plan === null || plan === void 0 ? void 0 : plan.defaultMaxVehicles) !== null && _d !== void 0 ? _d : planDefaults.maxVehicles,
                                                    maxDrivers: (_e = plan === null || plan === void 0 ? void 0 : plan.defaultMaxDrivers) !== null && _e !== void 0 ? _e : planDefaults.maxDrivers,
                                                    unlimitedMode: planCode === 'CUSTOM',
                                                },
                                                create: {
                                                    companyId: companyId,
                                                    maxUsers: (_f = dto.seats) !== null && _f !== void 0 ? _f : 50,
                                                    apiRateLimit: (_g = dto.apiRateLimit) !== null && _g !== void 0 ? _g : 1000,
                                                    storageQuotaMb: (_h = dto.storageQuotaMb) !== null && _h !== void 0 ? _h : 10000,
                                                    maxVehicles: (_j = plan === null || plan === void 0 ? void 0 : plan.defaultMaxVehicles) !== null && _j !== void 0 ? _j : planDefaults.maxVehicles,
                                                    maxDrivers: (_k = plan === null || plan === void 0 ? void 0 : plan.defaultMaxDrivers) !== null && _k !== void 0 ? _k : planDefaults.maxDrivers,
                                                    unlimitedMode: planCode === 'CUSTOM',
                                                },
                                            })];
                                    });
                                }); })];
                        case 4:
                            _a.sent();
                            return [4 /*yield*/, this.audit.logEvent({
                                    action: 'admin:license:assign_plan',
                                    entity: 'Company',
                                    entityId: companyId,
                                    userId: adminUserId,
                                    companyId: companyId,
                                    details: { planId: dto.subscriptionPlanId, planCode: planCode, planDefaults: planDefaults },
                                })];
                        case 5:
                            _a.sent();
                            return [2 /*return*/, this.getLicenseOverview(companyId)];
                    }
                });
            });
        };
        // ─── Set truck/vehicle capacity override ────────────────────────────────────
        LicenseAdminService_1.prototype.setTruckLimit = function (companyId, dto, adminUserId) {
            return __awaiter(this, void 0, void 0, function () {
                var company;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, tx.company.findUnique({ where: { id: companyId } })];
                            }); }); })];
                        case 1:
                            company = _a.sent();
                            if (!company)
                                throw new common_1.NotFoundException("Tenant ".concat(companyId, " not found"));
                            return [4 /*yield*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.tenantConfig.upsert({
                                                where: { companyId: companyId },
                                                update: { maxVehicles: dto.maxVehicles },
                                                create: { companyId: companyId, maxVehicles: dto.maxVehicles },
                                            })];
                                    });
                                }); })];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, this.audit.logEvent({
                                    action: 'admin:license:set_truck_limit',
                                    entity: 'TenantConfig',
                                    entityId: companyId,
                                    userId: adminUserId,
                                    companyId: companyId,
                                    details: { maxVehicles: dto.maxVehicles, reason: dto.reason },
                                })];
                        case 3:
                            _a.sent();
                            return [2 /*return*/, this.getLicenseOverview(companyId)];
                    }
                });
            });
        };
        // ─── Set driver capacity override ───────────────────────────────────────────
        LicenseAdminService_1.prototype.setDriverLimit = function (companyId, dto, adminUserId) {
            return __awaiter(this, void 0, void 0, function () {
                var company;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, tx.company.findUnique({ where: { id: companyId } })];
                            }); }); })];
                        case 1:
                            company = _a.sent();
                            if (!company)
                                throw new common_1.NotFoundException("Tenant ".concat(companyId, " not found"));
                            return [4 /*yield*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.tenantConfig.upsert({
                                                where: { companyId: companyId },
                                                update: { maxDrivers: dto.maxDrivers },
                                                create: { companyId: companyId, maxDrivers: dto.maxDrivers },
                                            })];
                                    });
                                }); })];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, this.audit.logEvent({
                                    action: 'admin:license:set_driver_limit',
                                    entity: 'TenantConfig',
                                    entityId: companyId,
                                    userId: adminUserId,
                                    companyId: companyId,
                                    details: { maxDrivers: dto.maxDrivers, reason: dto.reason },
                                })];
                        case 3:
                            _a.sent();
                            return [2 /*return*/, this.getLicenseOverview(companyId)];
                    }
                });
            });
        };
        // ─── Set temporary capacity boost ──────────────────────────────────────────
        LicenseAdminService_1.prototype.setBoost = function (companyId, dto, adminUserId) {
            return __awaiter(this, void 0, void 0, function () {
                var company, boostExpiresAt;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, tx.company.findUnique({ where: { id: companyId } })];
                            }); }); })];
                        case 1:
                            company = _a.sent();
                            if (!company)
                                throw new common_1.NotFoundException("Tenant ".concat(companyId, " not found"));
                            boostExpiresAt = new Date(dto.boostExpiresAt);
                            return [4 /*yield*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.tenantConfig.upsert({
                                                where: { companyId: companyId },
                                                update: { boostMaxVehicles: dto.boostMaxVehicles, boostExpiresAt: boostExpiresAt },
                                                create: {
                                                    companyId: companyId,
                                                    boostMaxVehicles: dto.boostMaxVehicles,
                                                    boostExpiresAt: boostExpiresAt,
                                                },
                                            })];
                                    });
                                }); })];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, this.audit.logEvent({
                                    action: 'admin:license:set_boost',
                                    entity: 'TenantConfig',
                                    entityId: companyId,
                                    userId: adminUserId,
                                    companyId: companyId,
                                    details: {
                                        boostMaxVehicles: dto.boostMaxVehicles,
                                        boostExpiresAt: dto.boostExpiresAt,
                                        reason: dto.reason,
                                    },
                                })];
                        case 3:
                            _a.sent();
                            return [2 /*return*/, this.getLicenseOverview(companyId)];
                    }
                });
            });
        };
        // ─── Toggle unlimited mode ──────────────────────────────────────────────────
        LicenseAdminService_1.prototype.setUnlimitedMode = function (companyId, dto, adminUserId) {
            return __awaiter(this, void 0, void 0, function () {
                var company;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, tx.company.findUnique({ where: { id: companyId } })];
                            }); }); })];
                        case 1:
                            company = _a.sent();
                            if (!company)
                                throw new common_1.NotFoundException("Tenant ".concat(companyId, " not found"));
                            return [4 /*yield*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.tenantConfig.upsert({
                                                where: { companyId: companyId },
                                                update: { unlimitedMode: dto.unlimited },
                                                create: { companyId: companyId, unlimitedMode: dto.unlimited },
                                            })];
                                    });
                                }); })];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, this.audit.logEvent({
                                    action: 'admin:license:set_unlimited',
                                    entity: 'TenantConfig',
                                    entityId: companyId,
                                    userId: adminUserId,
                                    companyId: companyId,
                                    details: { unlimited: dto.unlimited, reason: dto.reason },
                                })];
                        case 3:
                            _a.sent();
                            return [2 /*return*/, this.getLicenseOverview(companyId)];
                    }
                });
            });
        };
        // ─── List all subscription plans ────────────────────────────────────────────
        LicenseAdminService_1.prototype.listPlans = function () {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                return [2 /*return*/, tx.subscriptionPlan.findMany({
                                        orderBy: { defaultMaxVehicles: 'asc' },
                                    })];
                            });
                        }); })];
                });
            });
        };
        // ─── Get tenant usage dashboard ─────────────────────────────────────────────
        LicenseAdminService_1.prototype.getUsageDashboard = function (companyId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.getLicenseOverview(companyId)];
                });
            });
        };
        // ─── List all tenants with license summary (for Super Admin Center) ──────────
        LicenseAdminService_1.prototype.listAllTenantsWithLicense = function () {
            return __awaiter(this, void 0, void 0, function () {
                var companies, companyIds, configs, configMap, vehicleCounts, vehicleCountMap, driverCounts, driverCountMap, summaries;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    return [2 /*return*/, tx.company.findMany({
                                            include: {
                                                subscriptionPlan: true,
                                                tenantConfiguration: true,
                                            },
                                            orderBy: { createdAt: 'desc' },
                                            take: 200,
                                        })];
                                });
                            }); })];
                        case 1:
                            companies = _a.sent();
                            companyIds = companies.map(function (c) { return c.id; });
                            return [4 /*yield*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                    return [2 /*return*/, tx.tenantConfig.findMany({ where: { companyId: { in: companyIds } } })];
                                }); }); })];
                        case 2:
                            configs = _a.sent();
                            configMap = new Map(configs.map(function (c) { return [c.companyId, c]; }));
                            return [4 /*yield*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.vehicle.groupBy({
                                                by: ['companyId'],
                                                where: { companyId: { in: companyIds } },
                                                _count: true,
                                            })];
                                    });
                                }); })];
                        case 3:
                            vehicleCounts = _a.sent();
                            vehicleCountMap = new Map(vehicleCounts.map(function (v) { return [v.companyId, v._count]; }));
                            return [4 /*yield*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.driver.groupBy({
                                                by: ['companyId'],
                                                where: { companyId: { in: companyIds } },
                                                _count: true,
                                            })];
                                    });
                                }); })];
                        case 4:
                            driverCounts = _a.sent();
                            driverCountMap = new Map(driverCounts.map(function (d) { return [d.companyId, d._count]; }));
                            summaries = companies.map(function (company) {
                                var _a, _b, _c, _d, _e, _f, _g, _h;
                                var config = configMap.get(company.id);
                                var vehicleCount = (_a = vehicleCountMap.get(company.id)) !== null && _a !== void 0 ? _a : 0;
                                var driverCount = (_b = driverCountMap.get(company.id)) !== null && _b !== void 0 ? _b : 0;
                                return {
                                    id: company.id,
                                    name: company.name,
                                    status: company.status,
                                    plan: ((_c = company.subscriptionPlan) === null || _c === void 0 ? void 0 : _c.name) || 'No Plan',
                                    planCode: ((_d = company.subscriptionPlan) === null || _d === void 0 ? void 0 : _d.planCode) || 'NONE',
                                    maxVehicles: (_e = config === null || config === void 0 ? void 0 : config.maxVehicles) !== null && _e !== void 0 ? _e : 20,
                                    vehicleCount: vehicleCount,
                                    maxDrivers: (_f = config === null || config === void 0 ? void 0 : config.maxDrivers) !== null && _f !== void 0 ? _f : 50,
                                    driverCount: driverCount,
                                    unlimitedMode: (_g = config === null || config === void 0 ? void 0 : config.unlimitedMode) !== null && _g !== void 0 ? _g : false,
                                    boostExpiresAt: (_h = config === null || config === void 0 ? void 0 : config.boostExpiresAt) !== null && _h !== void 0 ? _h : null,
                                    createdAt: company.createdAt,
                                };
                            });
                            return [2 /*return*/, summaries];
                    }
                });
            });
        };
        return LicenseAdminService_1;
    }());
    __setFunctionName(_classThis, "LicenseAdminService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        LicenseAdminService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return LicenseAdminService = _classThis;
}();
exports.LicenseAdminService = LicenseAdminService;
