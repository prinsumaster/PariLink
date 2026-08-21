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
exports.BusinessHealthService = void 0;
var common_1 = require("@nestjs/common");
var BusinessHealthService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var BusinessHealthService = _classThis = /** @class */ (function () {
        function BusinessHealthService_1(prisma, eventService, metrics) {
            this.prisma = prisma;
            this.eventService = eventService;
            this.metrics = metrics;
            this.logger = new common_1.Logger(BusinessHealthService.name);
        }
        /**
         * Orchestrates the calculation of the Business Health Vitals
         */
        BusinessHealthService_1.prototype.calculateHealthVitals = function (companyId) {
            return __awaiter(this, void 0, void 0, function () {
                var operationalData, financialData, snapshot, benchmarks, benchmarkMap;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.logger.log("Calculating Business Health Vitals for company ".concat(companyId));
                            return [4 /*yield*/, this.calculateOperationalHealth(companyId)];
                        case 1:
                            operationalData = _a.sent();
                            return [4 /*yield*/, this.calculateFinancialHealth(companyId)];
                        case 2:
                            financialData = _a.sent();
                            return [4 /*yield*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.businessHealthSnapshot.create({
                                                data: {
                                                    companyId: companyId,
                                                    operationalScore: operationalData.score,
                                                    financialScore: financialData.score,
                                                    contributingFactors: {
                                                        operational: operationalData.factors,
                                                        financial: financialData.factors,
                                                    },
                                                },
                                            })];
                                    });
                                }); })];
                        case 3:
                            snapshot = _a.sent();
                            return [4 /*yield*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                    return [2 /*return*/, tx.linBenchmark.findMany()];
                                }); }); })];
                        case 4:
                            benchmarks = _a.sent();
                            benchmarkMap = benchmarks.reduce(function (acc, b) {
                                var _a;
                                return (__assign(__assign({}, acc), (_a = {}, _a[b.metricName] = b.value, _a)));
                            }, {});
                            // 4. Emit Event for Realtime SSE Update
                            this.eventService.publish('BusinessHealth.Updated', {
                                tenantId: companyId,
                                payload: {
                                    operationalScore: snapshot.operationalScore,
                                    financialScore: snapshot.financialScore,
                                    timestamp: snapshot.timestamp,
                                    factors: snapshot.contributingFactors,
                                    industryBenchmarks: benchmarkMap,
                                },
                            });
                            return [2 /*return*/, snapshot];
                    }
                });
            });
        };
        /**
         * Calculates Operational Health Score (0-100)
         */
        BusinessHealthService_1.prototype.calculateOperationalHealth = function (companyId) {
            return __awaiter(this, void 0, void 0, function () {
                var now, startOfDay, fleetUtil, utilizationScore, activeAnomalies, anomalyPenalty, planExceptions, exceptionPenalty, tripsToday, completedOrTransit, delayed, onTimeScore, baseScore, finalScore;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            now = new Date();
                            startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                            return [4 /*yield*/, this.metrics.getFleetUtilization(companyId)];
                        case 1:
                            fleetUtil = _a.sent();
                            utilizationScore = fleetUtil.percentage;
                            return [4 /*yield*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.operationalAnomaly.count({
                                                where: { companyId: companyId, status: 'OPEN' },
                                            })];
                                    });
                                }); })];
                        case 2:
                            activeAnomalies = _a.sent();
                            anomalyPenalty = Math.min(activeAnomalies * 5, 30);
                            return [4 /*yield*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.operationalPlanItem.count({
                                                where: {
                                                    plan: { companyId: companyId, date: startOfDay },
                                                    status: { in: ['NEEDS_APPROVAL', 'REQUIRES_HUMAN'] },
                                                },
                                            })];
                                    });
                                }); })];
                        case 3:
                            planExceptions = _a.sent();
                            exceptionPenalty = Math.min(planExceptions * 2, 20);
                            return [4 /*yield*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.trip.findMany({
                                                where: { companyId: companyId, createdAt: { gte: startOfDay } },
                                            })];
                                    });
                                }); })];
                        case 4:
                            tripsToday = _a.sent();
                            completedOrTransit = tripsToday.filter(function (t) { return t.status === 'COMPLETED' || t.status === 'IN_TRANSIT'; }).length;
                            delayed = tripsToday.filter(function (t) { return t.status === 'DELAYED'; }).length;
                            onTimeScore = 100;
                            if (tripsToday.length > 0) {
                                onTimeScore = (completedOrTransit / tripsToday.length) * 100;
                            }
                            baseScore = utilizationScore * 0.4 + onTimeScore * 0.6;
                            finalScore = baseScore - anomalyPenalty - exceptionPenalty;
                            // Clamp to 0-100
                            finalScore = Math.max(0, Math.min(100, finalScore));
                            return [2 /*return*/, {
                                    score: finalScore,
                                    factors: {
                                        utilizationScore: utilizationScore,
                                        onTimeScore: onTimeScore,
                                        activeAnomalies: activeAnomalies,
                                        planExceptions: planExceptions,
                                    },
                                }];
                    }
                });
            });
        };
        /**
         * Calculates Financial Health Score (0-100)
         */
        BusinessHealthService_1.prototype.calculateFinancialHealth = function (companyId) {
            return __awaiter(this, void 0, void 0, function () {
                var now, thirtyDaysAgo, revenueKpi, revenueTarget, revenueScore, unpaidInvoices, totalArAging, arPenalty, finalScore;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            now = new Date();
                            thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                            return [4 /*yield*/, this.metrics.getRevenueKPI(companyId, thirtyDaysAgo, now)];
                        case 1:
                            revenueKpi = _a.sent();
                            revenueTarget = 100000;
                            revenueScore = Math.min((revenueKpi.value / revenueTarget) * 100, 100);
                            return [4 /*yield*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.invoice.findMany({
                                                where: { companyId: companyId, status: 'ISSUED', dueDate: { lt: now } },
                                            })];
                                    });
                                }); })];
                        case 2:
                            unpaidInvoices = _a.sent();
                            totalArAging = unpaidInvoices.reduce(function (sum, inv) { return sum + (inv.amount || 0); }, 0);
                            arPenalty = 0;
                            if (totalArAging > 50000)
                                arPenalty = 30;
                            else if (totalArAging > 10000)
                                arPenalty = 15;
                            finalScore = revenueScore - arPenalty;
                            // Default to a realistic baseline if brand new company
                            if (revenueKpi.value === 0 && totalArAging === 0) {
                                finalScore = 85;
                            }
                            // Clamp to 0-100
                            finalScore = Math.max(0, Math.min(100, finalScore));
                            return [2 /*return*/, {
                                    score: finalScore,
                                    factors: {
                                        revenueValue: revenueKpi.value,
                                        revenueScore: revenueScore,
                                        totalArAging: totalArAging,
                                        arPenalty: arPenalty,
                                    },
                                }];
                    }
                });
            });
        };
        return BusinessHealthService_1;
    }());
    __setFunctionName(_classThis, "BusinessHealthService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        BusinessHealthService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return BusinessHealthService = _classThis;
}();
exports.BusinessHealthService = BusinessHealthService;
