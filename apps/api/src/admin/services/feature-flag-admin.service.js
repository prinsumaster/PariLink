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
exports.FeatureFlagAdminService = void 0;
var common_1 = require("@nestjs/common");
var FeatureFlagAdminService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var FeatureFlagAdminService = _classThis = /** @class */ (function () {
        function FeatureFlagAdminService_1(prisma, audit) {
            this.prisma = prisma;
            this.audit = audit;
        }
        FeatureFlagAdminService_1.prototype.getFlags = function (companyId) {
            return __awaiter(this, void 0, void 0, function () {
                var flags;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    return [2 /*return*/, tx.featureFlag.findMany({
                                            where: {
                                                OR: [{ companyId: companyId }, { companyId: 'GLOBAL' }],
                                            },
                                            orderBy: { key: 'asc' },
                                        })];
                                });
                            }); })];
                        case 1:
                            flags = _a.sent();
                            return [2 /*return*/, flags.map(function (f) {
                                    var rules = (f.rules || {});
                                    return {
                                        id: f.id,
                                        companyId: f.companyId,
                                        key: f.key,
                                        name: f.name,
                                        description: f.description,
                                        isEnabled: f.isEnabled,
                                        isGlobal: f.companyId === 'GLOBAL' || !!rules.isGlobal,
                                        percentageRollout: typeof rules.percentageRollout === 'number'
                                            ? rules.percentageRollout
                                            : 100,
                                        killSwitch: !!rules.killSwitch,
                                        targetEnvironments: Array.isArray(rules.targetEnvironments)
                                            ? rules.targetEnvironments
                                            : ['production', 'staging', 'development'],
                                        rules: f.rules,
                                    };
                                })];
                    }
                });
            });
        };
        FeatureFlagAdminService_1.prototype.upsertFlag = function (companyId, dto, adminUserId) {
            return __awaiter(this, void 0, void 0, function () {
                var targetCompanyId, rules, flag;
                var _this = this;
                var _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            targetCompanyId = dto.isGlobal ? 'GLOBAL' : companyId;
                            rules = {
                                isGlobal: !!dto.isGlobal,
                                percentageRollout: (_a = dto.percentageRollout) !== null && _a !== void 0 ? _a : 100,
                                killSwitch: !!dto.killSwitch,
                                targetEnvironments: (_b = dto.targetEnvironments) !== null && _b !== void 0 ? _b : [
                                    'production',
                                    'staging',
                                    'development',
                                ],
                            };
                            return [4 /*yield*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    var _a, _b;
                                    return __generator(this, function (_c) {
                                        return [2 /*return*/, tx.featureFlag.upsert({
                                                where: { companyId_key: { companyId: targetCompanyId, key: dto.key } },
                                                update: {
                                                    name: dto.name,
                                                    description: dto.description,
                                                    isEnabled: (_a = dto.isEnabled) !== null && _a !== void 0 ? _a : false,
                                                    rules: rules,
                                                },
                                                create: {
                                                    companyId: targetCompanyId,
                                                    key: dto.key,
                                                    name: dto.name,
                                                    description: dto.description || dto.key,
                                                    isEnabled: (_b = dto.isEnabled) !== null && _b !== void 0 ? _b : false,
                                                    rules: rules,
                                                },
                                            })];
                                    });
                                }); })];
                        case 1:
                            flag = _c.sent();
                            return [4 /*yield*/, this.audit.logEvent({
                                    action: 'admin:feature_flag:upsert',
                                    entity: 'FeatureFlag',
                                    entityId: flag.id,
                                    userId: adminUserId,
                                    companyId: targetCompanyId,
                                    details: { dto: dto, rules: rules },
                                })];
                        case 2:
                            _c.sent();
                            return [2 /*return*/, flag];
                    }
                });
            });
        };
        FeatureFlagAdminService_1.prototype.updateFlag = function (companyId, flagId, dto, adminUserId) {
            return __awaiter(this, void 0, void 0, function () {
                var flag, currentRules, updatedRules, updated;
                var _this = this;
                var _a, _b, _c, _d, _e, _f;
                return __generator(this, function (_g) {
                    switch (_g.label) {
                        case 0: return [4 /*yield*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    return [2 /*return*/, tx.featureFlag.findFirst({
                                            where: { id: flagId, OR: [{ companyId: companyId }, { companyId: 'GLOBAL' }] },
                                        })];
                                });
                            }); })];
                        case 1:
                            flag = _g.sent();
                            if (!flag)
                                throw new common_1.NotFoundException("Feature flag ".concat(flagId, " not found"));
                            currentRules = (flag.rules || {});
                            updatedRules = __assign(__assign({}, currentRules), { percentageRollout: (_b = (_a = dto.percentageRollout) !== null && _a !== void 0 ? _a : currentRules.percentageRollout) !== null && _b !== void 0 ? _b : 100, killSwitch: (_d = (_c = dto.killSwitch) !== null && _c !== void 0 ? _c : currentRules.killSwitch) !== null && _d !== void 0 ? _d : false, targetEnvironments: (_f = (_e = dto.targetEnvironments) !== null && _e !== void 0 ? _e : currentRules.targetEnvironments) !== null && _f !== void 0 ? _f : [
                                    'production',
                                    'staging',
                                    'development',
                                ] });
                            return [4 /*yield*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    var _a;
                                    return __generator(this, function (_b) {
                                        return [2 /*return*/, tx.featureFlag.update({
                                                where: { id: flagId },
                                                data: {
                                                    isEnabled: (_a = dto.isEnabled) !== null && _a !== void 0 ? _a : flag.isEnabled,
                                                    rules: updatedRules,
                                                },
                                            })];
                                    });
                                }); })];
                        case 2:
                            updated = _g.sent();
                            return [4 /*yield*/, this.audit.logEvent({
                                    action: 'admin:feature_flag:update',
                                    entity: 'FeatureFlag',
                                    entityId: flagId,
                                    userId: adminUserId,
                                    companyId: flag.companyId,
                                    details: { dto: dto },
                                })];
                        case 3:
                            _g.sent();
                            return [2 /*return*/, updated];
                    }
                });
            });
        };
        FeatureFlagAdminService_1.prototype.triggerKillSwitch = function (companyId, flagId, adminUserId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.updateFlag(companyId, flagId, { isEnabled: false, killSwitch: true }, adminUserId)];
                });
            });
        };
        return FeatureFlagAdminService_1;
    }());
    __setFunctionName(_classThis, "FeatureFlagAdminService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        FeatureFlagAdminService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return FeatureFlagAdminService = _classThis;
}();
exports.FeatureFlagAdminService = FeatureFlagAdminService;
