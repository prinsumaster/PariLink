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
exports.LicenseService = void 0;
var common_1 = require("@nestjs/common");
var TIER_DEFAULTS = {
    TRIAL: {
        modules: ['dispatch', 'trips', 'vehicles', 'drivers'],
        limits: {
            users: 5,
            vehicles: 10,
            apiCallsPerMonth: 10000,
            storageMb: 500,
        },
    },
    STARTER: {
        modules: [
            'dispatch',
            'trips',
            'vehicles',
            'drivers',
            'finance',
            'invoices',
        ],
        limits: {
            users: 20,
            vehicles: 100,
            apiCallsPerMonth: 100000,
            storageMb: 5000,
        },
    },
    GROWTH: {
        modules: [
            'dispatch',
            'trips',
            'vehicles',
            'drivers',
            'finance',
            'invoices',
            'warehouse',
            'integrations',
            'analytics',
        ],
        limits: {
            users: 100,
            vehicles: 500,
            apiCallsPerMonth: 1000000,
            storageMb: 50000,
        },
    },
    ENTERPRISE: {
        modules: ['*'], // All modules
        limits: {
            users: 999999,
            vehicles: 999999,
            apiCallsPerMonth: 999999999,
            storageMb: 999999999,
        },
    },
};
var LicenseService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var LicenseService = _classThis = /** @class */ (function () {
        function LicenseService_1(prisma, cache) {
            this.prisma = prisma;
            this.cache = cache;
            this.logger = new common_1.Logger(LicenseService.name);
            this.CACHE_TTL = 60; // seconds
        }
        LicenseService_1.prototype.onModuleInit = function () {
            this.logger.log('License & Entitlement Engine initialized');
        };
        /** Fetch the effective license state for a tenant. Cached. */
        LicenseService_1.prototype.getLicense = function (companyId) {
            return __awaiter(this, void 0, void 0, function () {
                var cacheKey, cached, config, tier, defaults, brandingConfig, contractExpiresAt, trialExpiresAt, now, gracePeriodDays, isExpired, isInGracePeriod, gracePeriodEndsAt, expiryDate, modules, limits, state;
                var _this = this;
                var _a, _b, _c, _d, _e, _f, _g;
                return __generator(this, function (_h) {
                    switch (_h.label) {
                        case 0:
                            cacheKey = "license:".concat(companyId);
                            return [4 /*yield*/, this.cache.get(cacheKey)];
                        case 1:
                            cached = _h.sent();
                            if (cached)
                                return [2 /*return*/, cached];
                            return [4 /*yield*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.tenantConfig.findUnique({
                                                where: { companyId: companyId },
                                            })];
                                    });
                                }); })];
                        case 2:
                            config = _h.sent();
                            tier = ((_a = config === null || config === void 0 ? void 0 : config.tier) !== null && _a !== void 0 ? _a : 'TRIAL');
                            defaults = (_b = TIER_DEFAULTS[tier]) !== null && _b !== void 0 ? _b : TIER_DEFAULTS['TRIAL'];
                            brandingConfig = (_c = config === null || config === void 0 ? void 0 : config.brandingConfig) !== null && _c !== void 0 ? _c : {};
                            contractExpiresAt = brandingConfig.contractExpiresAt
                                ? new Date(brandingConfig.contractExpiresAt)
                                : undefined;
                            trialExpiresAt = brandingConfig.trialExpiresAt
                                ? new Date(brandingConfig.trialExpiresAt)
                                : undefined;
                            now = new Date();
                            gracePeriodDays = (_d = brandingConfig.gracePeriodDays) !== null && _d !== void 0 ? _d : 7;
                            isExpired = false;
                            isInGracePeriod = false;
                            expiryDate = contractExpiresAt !== null && contractExpiresAt !== void 0 ? contractExpiresAt : trialExpiresAt;
                            if (expiryDate) {
                                isExpired = now > expiryDate;
                                if (isExpired) {
                                    gracePeriodEndsAt = new Date(expiryDate.getTime() + gracePeriodDays * 86400000);
                                    isInGracePeriod = now < gracePeriodEndsAt;
                                }
                            }
                            modules = (_f = (_e = brandingConfig.modules) !== null && _e !== void 0 ? _e : defaults.modules) !== null && _f !== void 0 ? _f : [];
                            limits = __assign(__assign({}, defaults.limits), ((_g = brandingConfig.limits) !== null && _g !== void 0 ? _g : {}));
                            state = {
                                tier: tier,
                                modules: modules,
                                limits: limits,
                                isActive: !isExpired || isInGracePeriod,
                                isExpired: isExpired,
                                isInGracePeriod: isInGracePeriod,
                                gracePeriodEndsAt: gracePeriodEndsAt,
                                contractExpiresAt: contractExpiresAt,
                            };
                            return [4 /*yield*/, this.cache.set(cacheKey, state, this.CACHE_TTL)];
                        case 3:
                            _h.sent();
                            return [2 /*return*/, state];
                    }
                });
            });
        };
        /** Throws ForbiddenException if the tenant is not licensed for the module. */
        LicenseService_1.prototype.requireModule = function (companyId, module) {
            return __awaiter(this, void 0, void 0, function () {
                var license, hasModule;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, this.getLicense(companyId)];
                        case 1:
                            license = _b.sent();
                            if (!license.isActive) {
                                throw new common_1.ForbiddenException("Your PariLink subscription has expired. Please renew to continue using ".concat(module, "."));
                            }
                            hasModule = license.modules.includes('*') || license.modules.includes(module);
                            if (!hasModule) {
                                throw new common_1.ForbiddenException("The \"".concat(module, "\" module is not included in your ").concat(license.tier, " plan. Please upgrade your subscription."));
                            }
                            if (license.isInGracePeriod) {
                                this.logger.warn("[License] Tenant ".concat(companyId, " is in grace period until ").concat((_a = license.gracePeriodEndsAt) === null || _a === void 0 ? void 0 : _a.toISOString()));
                            }
                            return [2 /*return*/];
                    }
                });
            });
        };
        /** Returns true if the tenant is under a specific resource limit. */
        LicenseService_1.prototype.checkLimit = function (companyId, limitKey, currentCount) {
            return __awaiter(this, void 0, void 0, function () {
                var license, limit;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.getLicense(companyId)];
                        case 1:
                            license = _a.sent();
                            limit = license.limits[limitKey];
                            return [2 /*return*/, { allowed: currentCount < limit, limit: limit, current: currentCount }];
                    }
                });
            });
        };
        /** Invalidates the cached license for a tenant (call after plan changes). */
        LicenseService_1.prototype.invalidate = function (companyId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.cache.delete("license:".concat(companyId))];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        return LicenseService_1;
    }());
    __setFunctionName(_classThis, "LicenseService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        LicenseService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return LicenseService = _classThis;
}();
exports.LicenseService = LicenseService;
