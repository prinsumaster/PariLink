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
exports.HeuristicOptimizerService = exports.OptimizationObjective = void 0;
var common_1 = require("@nestjs/common");
var OptimizationObjective;
(function (OptimizationObjective) {
    OptimizationObjective["COST_MINIMIZATION"] = "COST_MINIMIZATION";
    OptimizationObjective["TIME_MINIMIZATION"] = "TIME_MINIMIZATION";
    OptimizationObjective["UTILIZATION_MAXIMIZATION"] = "UTILIZATION_MAXIMIZATION";
})(OptimizationObjective || (exports.OptimizationObjective = OptimizationObjective = {}));
var HeuristicOptimizerService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var HeuristicOptimizerService = _classThis = /** @class */ (function () {
        function HeuristicOptimizerService_1(prisma, networkState, costEstimator, constraintEngine) {
            this.prisma = prisma;
            this.networkState = networkState;
            this.costEstimator = costEstimator;
            this.constraintEngine = constraintEngine;
            this.logger = new common_1.Logger(HeuristicOptimizerService.name);
        }
        /**
         * Generates optimization scenarios for the current network state.
         */
        HeuristicOptimizerService_1.prototype.generateScenarios = function (companyId) {
            return __awaiter(this, void 0, void 0, function () {
                var context, scenarioIds, costScenario, timeScenario;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.networkState.buildOptimizationContext(companyId)];
                        case 1:
                            context = _a.sent();
                            if (context.openLoads.length === 0) {
                                this.logger.log("No open loads to optimize for company ".concat(companyId, "."));
                                return [2 /*return*/, []];
                            }
                            scenarioIds = [];
                            return [4 /*yield*/, this.runScenario(context, OptimizationObjective.COST_MINIMIZATION)];
                        case 2:
                            costScenario = _a.sent();
                            if (costScenario)
                                scenarioIds.push(costScenario);
                            return [4 /*yield*/, this.runScenario(context, OptimizationObjective.TIME_MINIMIZATION)];
                        case 3:
                            timeScenario = _a.sent();
                            if (timeScenario)
                                scenarioIds.push(timeScenario);
                            return [2 /*return*/, scenarioIds];
                    }
                });
            });
        };
        HeuristicOptimizerService_1.prototype.runScenario = function (context, objective) {
            return __awaiter(this, void 0, void 0, function () {
                var pool, totalCost, totalRevenue, totalMargin, sumConfidence, assignedCount, recommendationsToInsert, _i, _a, load, bestCandidate, bestMetric, bestEstimation, bestCandidateIndex, i, candidate, violations, hasFatal, estimation, metric, avgConfidence, scenario;
                var _this = this;
                var _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            pool = __spreadArray([], context.availableVehicles, true);
                            totalCost = 0;
                            totalRevenue = 0;
                            totalMargin = 0;
                            sumConfidence = 0;
                            assignedCount = 0;
                            recommendationsToInsert = [];
                            // Simple heuristic: process loads in order of pickup date
                            for (_i = 0, _a = context.openLoads; _i < _a.length; _i++) {
                                load = _a[_i];
                                bestCandidate = null;
                                bestMetric = objective === OptimizationObjective.UTILIZATION_MAXIMIZATION
                                    ? -Infinity
                                    : Infinity;
                                bestEstimation = null;
                                bestCandidateIndex = -1;
                                for (i = 0; i < pool.length; i++) {
                                    candidate = pool[i];
                                    violations = this.constraintEngine.evaluate({
                                        load: load,
                                        vehicle: candidate.vehicle,
                                        driver: candidate.driver || { id: 'UNASSIGNED', status: 'AVAILABLE' },
                                    }).violations;
                                    hasFatal = violations.some(function (v) { return v.isFatal; });
                                    if (hasFatal)
                                        continue; // skip infeasible
                                    estimation = this.costEstimator.estimate(load, candidate.vehicle, candidate.driver, candidate.state);
                                    metric = 0;
                                    if (objective === OptimizationObjective.COST_MINIMIZATION) {
                                        metric = estimation.estimatedCost;
                                        if (metric < bestMetric) {
                                            bestMetric = metric;
                                            bestCandidate = candidate;
                                            bestEstimation = estimation;
                                            bestCandidateIndex = i;
                                        }
                                    }
                                    else if (objective === OptimizationObjective.TIME_MINIMIZATION) {
                                        metric = estimation.durationHours;
                                        if (metric < bestMetric) {
                                            bestMetric = metric;
                                            bestCandidate = candidate;
                                            bestEstimation = estimation;
                                            bestCandidateIndex = i;
                                        }
                                    }
                                    else if (objective === OptimizationObjective.UTILIZATION_MAXIMIZATION) {
                                        metric = estimation.expectedMargin; // maximize margin
                                        if (metric > bestMetric) {
                                            bestMetric = metric;
                                            bestCandidate = candidate;
                                            bestEstimation = estimation;
                                            bestCandidateIndex = i;
                                        }
                                    }
                                }
                                // 4. Create recommendation if a feasible candidate was found
                                if (bestCandidate && bestEstimation) {
                                    recommendationsToInsert.push({
                                        loadId: load.id,
                                        vehicleId: bestCandidate.vehicle.id,
                                        driverId: ((_b = bestCandidate.driver) === null || _b === void 0 ? void 0 : _b.id) || null,
                                        trailerId: null, // simplification
                                        expectedCost: bestEstimation.estimatedCost,
                                        expectedRevenue: bestEstimation.estimatedRevenue,
                                        confidenceScore: bestEstimation.confidenceScore,
                                        reasonCodes: ['HEURISTIC_SELECTION'],
                                    });
                                    totalCost += bestEstimation.estimatedCost;
                                    totalRevenue += bestEstimation.estimatedRevenue;
                                    totalMargin += bestEstimation.expectedMargin;
                                    sumConfidence += bestEstimation.confidenceScore;
                                    assignedCount++;
                                    // Remove from pool to prevent double-assignment in this scenario
                                    pool.splice(bestCandidateIndex, 1);
                                }
                            }
                            if (recommendationsToInsert.length === 0) {
                                this.logger.debug("Scenario ".concat(objective, " yielded no feasible assignments."));
                                return [2 /*return*/, null];
                            }
                            avgConfidence = sumConfidence / assignedCount;
                            return [4 /*yield*/, this.prisma.$transaction(function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    var created;
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0: return [4 /*yield*/, tx.optimizationScenario.create({
                                                    data: {
                                                        companyId: context.companyId,
                                                        objective: objective,
                                                        status: 'GENERATED',
                                                        totalCost: totalCost,
                                                        totalRevenue: totalRevenue,
                                                        margin: totalMargin,
                                                        confidenceScore: avgConfidence,
                                                        explanation: "Heuristic assignment of ".concat(assignedCount, " loads prioritizing ").concat(objective, "."),
                                                    },
                                                })];
                                            case 1:
                                                created = _a.sent();
                                                return [4 /*yield*/, tx.optimizationRecommendation.createMany({
                                                        data: recommendationsToInsert.map(function (r) { return (__assign(__assign({}, r), { scenarioId: created.id, companyId: context.companyId })); }),
                                                    })];
                                            case 2:
                                                _a.sent();
                                                return [2 /*return*/, created];
                                        }
                                    });
                                }); })];
                        case 1:
                            scenario = _c.sent();
                            this.logger.log("Generated Scenario ".concat(scenario.id, " [").concat(objective, "] for company ").concat(context.companyId));
                            return [2 /*return*/, scenario.id];
                    }
                });
            });
        };
        return HeuristicOptimizerService_1;
    }());
    __setFunctionName(_classThis, "HeuristicOptimizerService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        HeuristicOptimizerService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return HeuristicOptimizerService = _classThis;
}();
exports.HeuristicOptimizerService = HeuristicOptimizerService;
