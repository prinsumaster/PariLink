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
exports.AgentOrchestratorService = void 0;
var common_1 = require("@nestjs/common");
var AgentOrchestratorService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var AgentOrchestratorService = _classThis = /** @class */ (function () {
        function AgentOrchestratorService_1(prisma, llmManager, contextEngine, promptProtection, governance, observability, memory, rag, 
        // ─── Specialized Agents ────────────────────────────────────────
        dispatcherAgent, fleetAgent, integrationAgent, warehouseAgent, financeAgent, complianceAgent, supportAgent, developerAgent, analyticsAgent, marketplaceAgent, operationsAgent) {
            this.prisma = prisma;
            this.llmManager = llmManager;
            this.contextEngine = contextEngine;
            this.promptProtection = promptProtection;
            this.governance = governance;
            this.observability = observability;
            this.memory = memory;
            this.rag = rag;
            this.dispatcherAgent = dispatcherAgent;
            this.fleetAgent = fleetAgent;
            this.integrationAgent = integrationAgent;
            this.warehouseAgent = warehouseAgent;
            this.financeAgent = financeAgent;
            this.complianceAgent = complianceAgent;
            this.supportAgent = supportAgent;
            this.developerAgent = developerAgent;
            this.analyticsAgent = analyticsAgent;
            this.marketplaceAgent = marketplaceAgent;
            this.operationsAgent = operationsAgent;
            this.logger = new common_1.Logger(AgentOrchestratorService.name);
            this.agents = new Map();
        }
        AgentOrchestratorService_1.prototype.onModuleInit = function () {
            // Register all 11 specialized agents
            var allAgents = [
                this.dispatcherAgent,
                this.fleetAgent,
                this.integrationAgent,
                this.warehouseAgent,
                this.financeAgent,
                this.complianceAgent,
                this.supportAgent,
                this.developerAgent,
                this.analyticsAgent,
                this.marketplaceAgent,
                this.operationsAgent,
            ];
            for (var _i = 0, allAgents_1 = allAgents; _i < allAgents_1.length; _i++) {
                var agent = allAgents_1[_i];
                this.registerAgent(agent);
            }
            this.logger.log("Agent Orchestrator initialized with ".concat(this.agents.size, " agents: [").concat(Array.from(this.agents.keys()).join(', '), "]"));
        };
        AgentOrchestratorService_1.prototype.registerAgent = function (agent) {
            this.agents.set(agent.agentName, agent);
            this.logger.log("Registered agent: ".concat(agent.agentName));
        };
        /**
         * Routes an intent to the most appropriate specialized agent.
         * Applies full governance pipeline: PII redaction → injection protection → routing → execution → output validation → audit.
         */
        AgentOrchestratorService_1.prototype.routeIntent = function (companyId, intent, domainEntity, entityId, userId) {
            return __awaiter(this, void 0, void 0, function () {
                var redactedIntent, safeIntent, context, conversationContext, _a, workspaceContext, ragContext, citations, ragResult, _b, agentNames, routingPrompt, agentName, routingResponse, _c, agent, enrichedContext, response, _d, valid, violations, finalResponse, agentRecord_1, _e;
                var _this = this;
                return __generator(this, function (_f) {
                    switch (_f.label) {
                        case 0:
                            this.logger.log("Routing intent [".concat(domainEntity, "]: \"").concat(intent.substring(0, 80), "\""));
                            redactedIntent = this.governance.redactPii(intent).redacted;
                            safeIntent = this.governance.sanitizeInput(redactedIntent);
                            return [4 /*yield*/, this.contextEngine.buildAiContext(companyId, domainEntity, entityId)];
                        case 1:
                            context = _f.sent();
                            if (!entityId) return [3 /*break*/, 3];
                            return [4 /*yield*/, this.memory.getConversationContext(entityId)];
                        case 2:
                            _a = _f.sent();
                            return [3 /*break*/, 4];
                        case 3:
                            _a = '';
                            _f.label = 4;
                        case 4:
                            conversationContext = _a;
                            return [4 /*yield*/, this.memory.getWorkspaceContext(companyId)];
                        case 5:
                            workspaceContext = _f.sent();
                            ragContext = '';
                            citations = [];
                            _f.label = 6;
                        case 6:
                            _f.trys.push([6, 8, , 9]);
                            return [4 /*yield*/, this.rag.retrieveContext(safeIntent, {
                                    companyId: companyId,
                                    limit: 3,
                                })];
                        case 7:
                            ragResult = _f.sent();
                            ragContext = ragResult.context;
                            citations = ragResult.citations;
                            return [3 /*break*/, 9];
                        case 8:
                            _b = _f.sent();
                            return [3 /*break*/, 9];
                        case 9:
                            agentNames = Array.from(this.agents.keys()).join(', ');
                            routingPrompt = "You are an Agent Router for PariLink enterprise platform.\nAvailable Agents: ".concat(agentNames, "\nUser Intent: ").concat(safeIntent, "\nDomain Entity: ").concat(domainEntity, "\n\nSelect the SINGLE best agent name from the available agents list. \nRespond ONLY with the exact agent name, nothing else.");
                            _f.label = 10;
                        case 10:
                            _f.trys.push([10, 12, , 13]);
                            return [4 /*yield*/, this.llmManager.generateResponse(routingPrompt, safeIntent)];
                        case 11:
                            routingResponse = _f.sent();
                            agentName = routingResponse.trim().split('\n')[0].trim();
                            return [3 /*break*/, 13];
                        case 12:
                            _c = _f.sent();
                            // Fallback based on domain entity keyword matching
                            agentName = this.keywordRoute(domainEntity, safeIntent);
                            return [3 /*break*/, 13];
                        case 13:
                            // Validate the routed agent exists
                            if (!this.agents.has(agentName)) {
                                this.logger.warn("Agent \"".concat(agentName, "\" not found \u2014 using keyword routing fallback"));
                                agentName = this.keywordRoute(domainEntity, safeIntent);
                            }
                            agent = this.agents.get(agentName);
                            enrichedContext = __assign(__assign({}, (typeof context === 'object' && context !== null ? context : {})), { knowledgeBase: ragContext, conversationHistory: conversationContext, workspacePreferences: workspaceContext });
                            return [4 /*yield*/, agent.process(safeIntent, enrichedContext)];
                        case 14:
                            response = _f.sent();
                            _d = this.governance.validateOutput(response), valid = _d.valid, violations = _d.violations;
                            finalResponse = response;
                            if (!valid) {
                                this.logger.warn("Output policy violations: ".concat(violations.map(function (v) { return v.label; }).join(', ')));
                                finalResponse = "[Output filtered by AI Governance policy. Please rephrase your request.]";
                            }
                            _f.label = 15;
                        case 15:
                            _f.trys.push([15, 19, , 20]);
                            return [4 /*yield*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                    return [2 /*return*/, tx.aiAgent.findFirst()];
                                }); }); })];
                        case 16:
                            agentRecord_1 = _f.sent();
                            if (!agentRecord_1) return [3 /*break*/, 18];
                            return [4 /*yield*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.aiInteractionLog.create({
                                                data: {
                                                    agentId: agentRecord_1.id,
                                                    prompt: safeIntent,
                                                    response: finalResponse,
                                                    userId: userId,
                                                    companyId: companyId,
                                                    sessionId: entityId,
                                                },
                                            })];
                                    });
                                }); })];
                        case 17:
                            _f.sent();
                            _f.label = 18;
                        case 18: return [3 /*break*/, 20];
                        case 19:
                            _e = _f.sent();
                            return [3 /*break*/, 20];
                        case 20: return [2 /*return*/, { response: finalResponse, agentName: agentName, citations: citations }];
                    }
                });
            });
        };
        /**
         * Keyword-based fallback routing when LLM routing fails.
         */
        AgentOrchestratorService_1.prototype.keywordRoute = function (domain, intent) {
            var combined = "".concat(domain, " ").concat(intent).toLowerCase();
            if (combined.match(/warehouse|inventory|dock|pick|put.?away|scan/))
                return 'WarehouseAgent';
            if (combined.match(/invoice|billing|payment|factoring|revenue|p&l|cost/))
                return 'FinanceAgent';
            if (combined.match(/compliance|hos|hours.of.service|dot|fmcsa|inspection|reg/))
                return 'ComplianceAgent';
            if (combined.match(/support|ticket|help|issue|problem|escalat/))
                return 'SupportAgent';
            if (combined.match(/developer|api|sdk|code|endpoint|webhook|plugin/))
                return 'DeveloperAgent';
            if (combined.match(/analytic|trend|kpi|metric|report|insight/))
                return 'AnalyticsAgent';
            if (combined.match(/marketplace|app|install|integration/))
                return 'MarketplaceAgent';
            if (combined.match(/fleet|vehicle|truck|trailer|maintenance/))
                return 'FleetManagerAgent';
            if (combined.match(/dispatch|load|route|driver|assign|trip/))
                return 'DispatcherAgent';
            if (combined.match(/operation|exception|delay|approval|health/))
                return 'OperationsAgent';
            return 'DispatcherAgent'; // Ultimate fallback
        };
        /**
         * List all registered agents with their capabilities
         */
        AgentOrchestratorService_1.prototype.getAgentRegistry = function () {
            return Array.from(this.agents.values()).map(function (a) { return ({
                name: a.agentName,
                description: a.roleDescription,
                toolCount: a.tools.length,
            }); });
        };
        return AgentOrchestratorService_1;
    }());
    __setFunctionName(_classThis, "AgentOrchestratorService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AgentOrchestratorService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AgentOrchestratorService = _classThis;
}();
exports.AgentOrchestratorService = AgentOrchestratorService;
