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
exports.FeatureToggleService = void 0;
var common_1 = require("@nestjs/common");
var FeatureToggleService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var FeatureToggleService = _classThis = /** @class */ (function () {
        function FeatureToggleService_1(prisma, cache) {
            this.prisma = prisma;
            this.cache = cache;
            this.logger = new common_1.Logger(FeatureToggleService.name);
            this.CACHE_TTL_SECONDS = 60;
        }
        FeatureToggleService_1.prototype.onModuleInit = function () {
            this.logger.log('Feature Toggle Platform initialized');
        };
        /**
         * Primary evaluation method. Use this everywhere.
         */
        FeatureToggleService_1.prototype.isEnabled = function (flagKey, ctx) {
            return __awaiter(this, void 0, void 0, function () {
                var killSwitchKey, cacheKey, cached, flag, rules, result;
                var _this = this;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            killSwitchKey = "FEATURE_DISABLED_".concat(flagKey.toUpperCase().replace(/-/g, '_'));
                            if (process.env[killSwitchKey] === 'true') {
                                this.logger.warn("[FeatureFlag] ".concat(flagKey, " disabled via kill switch env var"));
                                return [2 /*return*/, false];
                            }
                            cacheKey = this.cache.generateTenantKey(ctx.companyId, 'ff', "".concat(flagKey, ":").concat((_a = ctx.userId) !== null && _a !== void 0 ? _a : 'anon'));
                            return [4 /*yield*/, this.cache.get(cacheKey)];
                        case 1:
                            cached = _b.sent();
                            if (cached !== null)
                                return [2 /*return*/, cached];
                            return [4 /*yield*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.featureFlag.findUnique({
                                                where: { companyId_key: { companyId: ctx.companyId, key: flagKey } },
                                            })];
                                    });
                                }); })];
                        case 2:
                            flag = _b.sent();
                            if (!!flag) return [3 /*break*/, 4];
                            return [4 /*yield*/, this.cache.set(cacheKey, false, this.CACHE_TTL_SECONDS)];
                        case 3:
                            _b.sent();
                            return [2 /*return*/, false];
                        case 4:
                            if (!!flag.isEnabled) return [3 /*break*/, 6];
                            return [4 /*yield*/, this.cache.set(cacheKey, false, this.CACHE_TTL_SECONDS)];
                        case 5:
                            _b.sent();
                            return [2 /*return*/, false];
                        case 6:
                            rules = flag.rules || {};
                            result = this.evaluateRules(rules, ctx, flagKey);
                            return [4 /*yield*/, this.cache.set(cacheKey, result, this.CACHE_TTL_SECONDS)];
                        case 7:
                            _b.sent();
                            return [2 /*return*/, result];
                    }
                });
            });
        };
        /** Enable a flag for a tenant (sets isEnabled=true and default=true in rules) */
        FeatureToggleService_1.prototype.enable = function (companyId, flagKey, updatedBy) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    return [2 /*return*/, tx.featureFlag.upsert({
                                            where: { companyId_key: { companyId: companyId, key: flagKey } },
                                            create: {
                                                companyId: companyId,
                                                key: flagKey,
                                                name: flagKey,
                                                isEnabled: true,
                                                rules: { default: true },
                                            },
                                            update: { isEnabled: true },
                                        })];
                                });
                            }); })];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, this.invalidate(companyId, flagKey)];
                        case 2:
                            _a.sent();
                            this.logger.log("[FeatureFlag] ".concat(flagKey, " ENABLED for tenant ").concat(companyId, " by ").concat(updatedBy));
                            return [2 /*return*/];
                    }
                });
            });
        };
        /** Instant emergency kill: sets isEnabled=false */
        FeatureToggleService_1.prototype.killSwitch = function (companyId, flagKey, updatedBy) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    return [2 /*return*/, tx.featureFlag.updateMany({
                                            where: { companyId: companyId, key: flagKey },
                                            data: { isEnabled: false },
                                        })];
                                });
                            }); })];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, this.invalidate(companyId, flagKey)];
                        case 2:
                            _a.sent();
                            this.logger.warn("[FeatureFlag] KILL SWITCH: ".concat(flagKey, " DISABLED for tenant ").concat(companyId, " by ").concat(updatedBy));
                            return [2 /*return*/];
                    }
                });
            });
        };
        FeatureToggleService_1.prototype.invalidate = function (companyId, flagKey) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: 
                        // Invalidate all user-specific cache entries for this flag
                        // In a full Redis implementation we'd use SCAN + DEL pattern
                        return [4 /*yield*/, this.cache.delete(this.cache.generateTenantKey(companyId, 'ff', "".concat(flagKey, ":anon")))];
                        case 1:
                            // Invalidate all user-specific cache entries for this flag
                            // In a full Redis implementation we'd use SCAN + DEL pattern
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        // ─────────────────────────────────────────────────────────────────────────
        FeatureToggleService_1.prototype.evaluateRules = function (rules, ctx, flagKey) {
            var _a;
            var now = new Date();
            // Schedule gate
            if (rules.scheduledFrom && new Date(rules.scheduledFrom) > now)
                return false;
            if (rules.scheduledUntil && new Date(rules.scheduledUntil) < now)
                return false;
            // User allow-list
            if (ctx.userId &&
                Array.isArray(rules.userIds) &&
                rules.userIds.includes(ctx.userId))
                return true;
            // Role-based
            if (ctx.roleId &&
                Array.isArray(rules.roleIds) &&
                rules.roleIds.includes(ctx.roleId))
                return true;
            // Branch-based
            if (ctx.branchId &&
                Array.isArray(rules.branchIds) &&
                rules.branchIds.includes(ctx.branchId))
                return true;
            // Percentage rollout (deterministic: same user always gets same result)
            if (typeof rules.percentage === 'number' && rules.percentage > 0) {
                var hash = this.deterministicHash("".concat(ctx.companyId, ":").concat((_a = ctx.userId) !== null && _a !== void 0 ? _a : '', ":").concat(flagKey));
                var bucket = hash % 100;
                if (bucket < rules.percentage)
                    return true;
            }
            // Fall through to global default
            return rules.default === true;
        };
        FeatureToggleService_1.prototype.deterministicHash = function (input) {
            var hash = 0;
            for (var i = 0; i < input.length; i++) {
                var char = input.charCodeAt(i);
                hash = (hash << 5) - hash + char;
                hash |= 0; // 32-bit int
            }
            return Math.abs(hash);
        };
        return FeatureToggleService_1;
    }());
    __setFunctionName(_classThis, "FeatureToggleService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        FeatureToggleService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return FeatureToggleService = _classThis;
}();
exports.FeatureToggleService = FeatureToggleService;
