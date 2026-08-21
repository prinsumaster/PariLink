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
exports.PlanningEngineService = void 0;
var common_1 = require("@nestjs/common");
var PlanningEngineService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var PlanningEngineService = _classThis = /** @class */ (function () {
        function PlanningEngineService_1(prisma, optimizer, llmManager, eventService) {
            this.prisma = prisma;
            this.optimizer = optimizer;
            this.llmManager = llmManager;
            this.eventService = eventService;
            this.logger = new common_1.Logger(PlanningEngineService.name);
        }
        /**
         * Pipeline Step 1: Run optimization and augment exceptions.
         */
        PlanningEngineService_1.prototype.runPipeline = function (companyId) {
            return __awaiter(this, void 0, void 0, function () {
                var scenarioIds, latestScenarioId, scenario, autoPlanned, needsApproval, requiresHuman, planItems, planDate, plan;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.logger.log("Starting Morning Planning Pipeline for company ".concat(companyId));
                            return [4 /*yield*/, this.optimizer.generateScenarios(companyId)];
                        case 1:
                            scenarioIds = _a.sent();
                            if (scenarioIds.length === 0) {
                                throw new common_1.BadRequestException('Cannot run planning: No open loads or available vehicles found.');
                            }
                            latestScenarioId = scenarioIds[scenarioIds.length - 1];
                            return [4 /*yield*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.optimizationScenario.findUnique({
                                                where: { id: latestScenarioId },
                                                include: { recommendations: true },
                                            })];
                                    });
                                }); })];
                        case 2:
                            scenario = _a.sent();
                            if (!scenario)
                                throw new common_1.NotFoundException('Optimization Scenario failed to generate.');
                            autoPlanned = 0;
                            needsApproval = 0;
                            requiresHuman = 0;
                            return [4 /*yield*/, Promise.all(scenario.recommendations.map(function (rec) { return __awaiter(_this, void 0, void 0, function () {
                                    var status, aiDecisionProposal, aiResponse, jsonStr, e_1;
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0:
                                                status = 'AUTO_PLANNED';
                                                aiDecisionProposal = null;
                                                if (rec.confidenceScore < 0.7) {
                                                    status = 'REQUIRES_HUMAN';
                                                    requiresHuman++;
                                                }
                                                else if (rec.confidenceScore < 0.9) {
                                                    status = 'NEEDS_APPROVAL';
                                                    needsApproval++;
                                                }
                                                else {
                                                    autoPlanned++;
                                                }
                                                if (!(status !== 'AUTO_PLANNED')) return [3 /*break*/, 4];
                                                _a.label = 1;
                                            case 1:
                                                _a.trys.push([1, 3, , 4]);
                                                return [4 /*yield*/, this.llmManager.generateResponse("You are an expert logistics dispatcher. A heuristic optimization engine has recommended assigning load ".concat(rec.loadId, " to vehicle ").concat(rec.vehicleId, " but the confidence is ").concat(rec.confidenceScore, ". Generate a structured decision proposal explaining why this might be risky, the financial impact, and a rollback strategy. Return ONLY valid JSON matching this schema: { \"category\": \"ASSIGNMENT\", \"actionIntent\": \"string\", \"riskLevel\": \"MEDIUM\" | \"HIGH\", \"confidenceScore\": number, \"businessImpact\": \"string\", \"costImpact\": \"string\", \"reasoning\": \"string\", \"alternativeOptions\": [\"string\"], \"expectedOutcome\": \"string\", \"rollbackStrategy\": \"string\" }"), "Evaluate this dispatch recommendation.", { recommendation: rec }, 'openai')];
                                            case 2:
                                                aiResponse = _a.sent();
                                                jsonStr = aiResponse
                                                    .replace(/```json/g, '')
                                                    .replace(/```/g, '')
                                                    .trim();
                                                aiDecisionProposal = JSON.parse(jsonStr);
                                                // ensure risk level maps to status
                                                aiDecisionProposal.riskLevel =
                                                    status === 'REQUIRES_HUMAN' ? 'HIGH' : 'MEDIUM';
                                                return [3 /*break*/, 4];
                                            case 3:
                                                e_1 = _a.sent();
                                                this.logger.error("Failed to generate AI decision for exception: ".concat(e_1.message));
                                                aiDecisionProposal = {
                                                    category: 'ASSIGNMENT',
                                                    actionIntent: "Assign Load ".concat(rec.loadId),
                                                    riskLevel: status === 'REQUIRES_HUMAN' ? 'HIGH' : 'MEDIUM',
                                                    confidenceScore: rec.confidenceScore,
                                                    businessImpact: 'Manual review needed',
                                                    costImpact: 'Unknown',
                                                    reasoning: 'AI analysis failed. Please review manually.',
                                                    alternativeOptions: [],
                                                    expectedOutcome: 'Pending manual review',
                                                    rollbackStrategy: 'Cancel dispatch',
                                                };
                                                return [3 /*break*/, 4];
                                            case 4: return [2 /*return*/, {
                                                    loadId: rec.loadId,
                                                    vehicleId: rec.vehicleId,
                                                    driverId: rec.driverId,
                                                    status: status,
                                                    confidenceScore: rec.confidenceScore,
                                                    expectedCost: rec.expectedCost,
                                                    expectedRevenue: rec.expectedRevenue,
                                                    aiDecisionProposal: aiDecisionProposal,
                                                }];
                                        }
                                    });
                                }); }))];
                        case 3:
                            planItems = _a.sent();
                            planDate = new Date();
                            planDate.setHours(0, 0, 0, 0);
                            return [4 /*yield*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.operationalPlan.create({
                                                data: {
                                                    companyId: companyId,
                                                    date: planDate,
                                                    status: 'DRAFT',
                                                    metrics: {
                                                        totalSavings: scenario.margin, // using margin as proxy for savings
                                                        fuelSaved: Math.round(scenario.margin * 0.1), // Mock metric
                                                        onTimePercentage: scenario.confidenceScore * 100,
                                                        totalRevenue: scenario.totalRevenue,
                                                        autoPlanned: autoPlanned,
                                                        needsApproval: needsApproval,
                                                        requiresHuman: requiresHuman,
                                                    },
                                                    items: {
                                                        create: planItems,
                                                    },
                                                },
                                                include: { items: true },
                                            })];
                                    });
                                }); })];
                        case 4:
                            plan = _a.sent();
                            this.logger.log("Created OperationalPlan ".concat(plan.id, " for company ").concat(companyId));
                            // Broadcast event
                            this.eventService.publish('OperationalPlan.Generated', {
                                tenantId: companyId,
                                payload: {
                                    type: 'SYSTEM_NOTIFICATION',
                                    planId: plan.id,
                                    date: plan.date,
                                    metrics: plan.metrics,
                                },
                            });
                            return [2 /*return*/, plan];
                    }
                });
            });
        };
        PlanningEngineService_1.prototype.getLatestPlan = function (companyId) {
            return __awaiter(this, void 0, void 0, function () {
                var planDate, plan;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            planDate = new Date();
                            planDate.setHours(0, 0, 0, 0);
                            return [4 /*yield*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.operationalPlan.findFirst({
                                                where: { companyId: companyId, date: planDate },
                                                include: { items: true },
                                                orderBy: { createdAt: 'desc' },
                                            })];
                                    });
                                }); })];
                        case 1:
                            plan = _a.sent();
                            if (!plan)
                                return [2 /*return*/, null];
                            return [2 /*return*/, plan];
                    }
                });
            });
        };
        PlanningEngineService_1.prototype.approveItem = function (companyId, itemId) {
            return __awaiter(this, void 0, void 0, function () {
                var item;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    return [2 /*return*/, tx.operationalPlanItem.findFirst({
                                            where: { id: itemId, plan: { companyId: companyId } },
                                        })];
                                });
                            }); })];
                        case 1:
                            item = _a.sent();
                            if (!item)
                                throw new common_1.NotFoundException('Plan item not found.');
                            return [4 /*yield*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.operationalPlanItem.update({
                                                where: { id: itemId },
                                                data: { status: 'AUTO_PLANNED' },
                                            })];
                                    });
                                }); })];
                        case 2:
                            _a.sent();
                            return [2 /*return*/, {
                                    success: true,
                                    message: 'Item approved and moved to Auto Planned.',
                                }];
                    }
                });
            });
        };
        PlanningEngineService_1.prototype.rejectItem = function (companyId, itemId, reason) {
            return __awaiter(this, void 0, void 0, function () {
                var item;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    return [2 /*return*/, tx.operationalPlanItem.findFirst({
                                            where: { id: itemId, plan: { companyId: companyId } },
                                        })];
                                });
                            }); })];
                        case 1:
                            item = _a.sent();
                            if (!item)
                                throw new common_1.NotFoundException('Plan item not found.');
                            return [4 /*yield*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.operationalPlanItem.update({
                                                where: { id: itemId },
                                                data: { status: 'REQUIRES_HUMAN' }, // Kick it back to manual
                                            })];
                                    });
                                }); })];
                        case 2:
                            _a.sent();
                            // In a real system, we'd log the rejection reason for AI retraining
                            return [2 /*return*/, { success: true, message: "Item rejected for reason: ".concat(reason) }];
                    }
                });
            });
        };
        return PlanningEngineService_1;
    }());
    __setFunctionName(_classThis, "PlanningEngineService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        PlanningEngineService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return PlanningEngineService = _classThis;
}();
exports.PlanningEngineService = PlanningEngineService;
