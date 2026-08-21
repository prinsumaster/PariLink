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
exports.AiObservabilityService = void 0;
var common_1 = require("@nestjs/common");
// In-memory stores for quick aggregation (production: supplement with TimescaleDB)
var toolCallAuditLog = [];
var feedbackLog = [];
var hallucinationLog = [];
var AiObservabilityService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var AiObservabilityService = _classThis = /** @class */ (function () {
        function AiObservabilityService_1(prisma) {
            this.prisma = prisma;
            this.logger = new common_1.Logger(AiObservabilityService.name);
        }
        // ─── Core Metrics ─────────────────────────────────────────────────────────
        AiObservabilityService_1.prototype.logMetrics = function (data) {
            return __awaiter(this, void 0, void 0, function () {
                var _a;
                var _this = this;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.aiMetricsLog.create({
                                                data: {
                                                    modelProvider: data.modelProvider,
                                                    modelVersion: 'v1',
                                                    latencyMs: data.latencyMs,
                                                    promptTokens: data.promptTokens,
                                                    completionTokens: data.completionTokens,
                                                    totalCost: data.cost,
                                                    companyId: data.companyId || 'SYSTEM',
                                                    interactionId: "".concat(Date.now(), "-").concat(Math.random().toString(36).slice(2, 6)),
                                                },
                                            })];
                                    });
                                }); })];
                        case 1:
                            _b.sent();
                            return [3 /*break*/, 3];
                        case 2:
                            _a = _b.sent();
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Platform-wide AI metrics for the Executive Command Center
         */
        AiObservabilityService_1.prototype.getPlatformMetrics = function (companyId) {
            return __awaiter(this, void 0, void 0, function () {
                var logs, recs, _a, totalCost, avgLatency, acceptedRecs, acceptanceRate, totalPromptTokens, totalCompletionTokens, providerBreakdown, _i, logs_1, log, p, _b, _c, p;
                var _d;
                var _this = this;
                return __generator(this, function (_e) {
                    switch (_e.label) {
                        case 0:
                            logs = [];
                            recs = [];
                            _e.label = 1;
                        case 1:
                            _e.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, Promise.all([
                                    this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.aiMetricsLog.findMany({ where: { companyId: companyId } })];
                                    }); }); }),
                                    this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.aiRecommendation.findMany({ where: { companyId: companyId } })];
                                    }); }); }),
                                ])];
                        case 2:
                            _d = _e.sent(), logs = _d[0], recs = _d[1];
                            return [3 /*break*/, 4];
                        case 3:
                            _a = _e.sent();
                            return [3 /*break*/, 4];
                        case 4:
                            totalCost = logs.reduce(function (sum, log) { return sum + (log.totalCost || 0); }, 0);
                            avgLatency = logs.length > 0
                                ? logs.reduce(function (sum, log) { return sum + (log.latencyMs || 0); }, 0) / logs.length
                                : 0;
                            acceptedRecs = recs.filter(function (r) { return r.status === 'ACCEPTED'; }).length;
                            acceptanceRate = recs.length > 0 ? (acceptedRecs / recs.length) * 100 : 0;
                            totalPromptTokens = logs.reduce(function (sum, l) { return sum + (l.promptTokens || 0); }, 0);
                            totalCompletionTokens = logs.reduce(function (sum, l) { return sum + (l.completionTokens || 0); }, 0);
                            providerBreakdown = {};
                            for (_i = 0, logs_1 = logs; _i < logs_1.length; _i++) {
                                log = logs_1[_i];
                                p = log.modelProvider || 'unknown';
                                if (!providerBreakdown[p])
                                    providerBreakdown[p] = { calls: 0, cost: 0, avgLatency: 0 };
                                providerBreakdown[p].calls++;
                                providerBreakdown[p].cost += log.totalCost || 0;
                                providerBreakdown[p].avgLatency += log.latencyMs || 0;
                            }
                            for (_b = 0, _c = Object.keys(providerBreakdown); _b < _c.length; _b++) {
                                p = _c[_b];
                                providerBreakdown[p].avgLatency =
                                    providerBreakdown[p].calls > 0
                                        ? providerBreakdown[p].avgLatency / providerBreakdown[p].calls
                                        : 0;
                            }
                            return [2 /*return*/, {
                                    totalInteractions: logs.length,
                                    totalCostUsd: Math.round(totalCost * 10000) / 10000,
                                    averageLatencyMs: Math.round(avgLatency),
                                    totalPromptTokens: totalPromptTokens,
                                    totalCompletionTokens: totalCompletionTokens,
                                    recommendationAcceptanceRate: Math.round(acceptanceRate * 10) / 10,
                                    totalRecommendations: recs.length,
                                    providerBreakdown: providerBreakdown,
                                    agentActivity: this.getAgentActivitySummary(),
                                    toolCallsSummary: this.getToolCallsSummary(),
                                    feedbackSummary: this.getFeedbackSummary(companyId),
                                    hallucinationReports: hallucinationLog.filter(function (h) { return h.companyId === companyId; }).length,
                                }];
                    }
                });
            });
        };
        // ─── Tool Call Audit Trail ────────────────────────────────────────────────
        AiObservabilityService_1.prototype.logToolCall = function (data) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    toolCallAuditLog.push(data);
                    this.logger.log("[TOOL AUDIT] ".concat(data.agentName, "::").concat(data.toolName, " \u2014 ").concat(data.success ? 'SUCCESS' : 'FAILED', " in ").concat(data.durationMs, "ms"));
                    // Keep last 1000 entries in memory
                    if (toolCallAuditLog.length > 1000)
                        toolCallAuditLog.shift();
                    return [2 /*return*/];
                });
            });
        };
        AiObservabilityService_1.prototype.getToolCallsSummary = function () {
            var byTool = {};
            for (var _i = 0, toolCallAuditLog_1 = toolCallAuditLog; _i < toolCallAuditLog_1.length; _i++) {
                var log = toolCallAuditLog_1[_i];
                if (!byTool[log.toolName])
                    byTool[log.toolName] = { calls: 0, failures: 0, avgDuration: 0 };
                byTool[log.toolName].calls++;
                if (!log.success)
                    byTool[log.toolName].failures++;
                byTool[log.toolName].avgDuration += log.durationMs;
            }
            for (var _a = 0, _b = Object.keys(byTool); _a < _b.length; _a++) {
                var t = _b[_a];
                byTool[t].avgDuration =
                    byTool[t].calls > 0 ? byTool[t].avgDuration / byTool[t].calls : 0;
            }
            return byTool;
        };
        // ─── Hallucination Reporting ──────────────────────────────────────────────
        AiObservabilityService_1.prototype.logHallucination = function (report) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    hallucinationLog.push(report);
                    this.logger.warn("[HALLUCINATION] Severity: ".concat(report.severity, " | Reported by: ").concat(report.reportedBy, " \u2014 ").concat(report.description.substring(0, 100)));
                    if (report.severity === 'CRITICAL') {
                        this.logger.error("CRITICAL hallucination reported on interaction ".concat(report.interactionId, ". Immediate review required."));
                    }
                    return [2 /*return*/];
                });
            });
        };
        AiObservabilityService_1.prototype.getHallucinationReports = function (companyId) {
            return companyId
                ? hallucinationLog.filter(function (h) { return h.companyId === companyId; })
                : hallucinationLog;
        };
        // ─── Feedback ─────────────────────────────────────────────────────────────
        AiObservabilityService_1.prototype.submitFeedback = function (feedback) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    feedbackLog.push(feedback);
                    this.logger.log("Feedback received: ".concat(feedback.rating, "/5 for interaction ").concat(feedback.interactionId));
                    return [2 /*return*/];
                });
            });
        };
        AiObservabilityService_1.prototype.getFeedbackSummary = function (companyId) {
            var relevant = companyId
                ? feedbackLog.filter(function (f) { return f.companyId === companyId; })
                : feedbackLog;
            if (relevant.length === 0)
                return { totalRatings: 0, averageRating: 0, distribution: {} };
            var avgRating = relevant.reduce(function (sum, f) { return sum + f.rating; }, 0) / relevant.length;
            var distribution = {
                1: 0,
                2: 0,
                3: 0,
                4: 0,
                5: 0,
            };
            for (var _i = 0, relevant_1 = relevant; _i < relevant_1.length; _i++) {
                var f = relevant_1[_i];
                distribution[f.rating]++;
            }
            return {
                totalRatings: relevant.length,
                averageRating: Math.round(avgRating * 10) / 10,
                distribution: distribution,
            };
        };
        // ─── Agent Health ─────────────────────────────────────────────────────────
        AiObservabilityService_1.prototype.getAgentActivitySummary = function () {
            var agentCalls = {};
            for (var _i = 0, toolCallAuditLog_2 = toolCallAuditLog; _i < toolCallAuditLog_2.length; _i++) {
                var log = toolCallAuditLog_2[_i];
                agentCalls[log.agentName] = (agentCalls[log.agentName] || 0) + 1;
            }
            return agentCalls;
        };
        AiObservabilityService_1.prototype.getAgentHealth = function (agentName) {
            return __awaiter(this, void 0, void 0, function () {
                var agentLogs, failures, avgDuration;
                return __generator(this, function (_a) {
                    agentLogs = toolCallAuditLog.filter(function (l) { return l.agentName === agentName; });
                    failures = agentLogs.filter(function (l) { return !l.success; }).length;
                    avgDuration = agentLogs.length > 0
                        ? agentLogs.reduce(function (sum, l) { return sum + l.durationMs; }, 0) / agentLogs.length
                        : 0;
                    return [2 /*return*/, {
                            agentName: agentName,
                            totalToolCalls: agentLogs.length,
                            failureRate: agentLogs.length > 0 ? failures / agentLogs.length : 0,
                            avgToolDurationMs: Math.round(avgDuration),
                            lastActive: agentLogs.length > 0 ? new Date() : undefined,
                        }];
                });
            });
        };
        return AiObservabilityService_1;
    }());
    __setFunctionName(_classThis, "AiObservabilityService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AiObservabilityService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AiObservabilityService = _classThis;
}();
exports.AiObservabilityService = AiObservabilityService;
