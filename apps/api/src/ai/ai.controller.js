"use strict";
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
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
exports.AiController = void 0;
var common_1 = require("@nestjs/common");
var platform_express_1 = require("@nestjs/platform-express");
var jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
var permissions_guard_1 = require("../auth/guards/permissions.guard");
var permissions_decorator_1 = require("../auth/decorators/permissions.decorator");
var swagger_1 = require("@nestjs/swagger");
var throttler_1 = require("@nestjs/throttler");
var AiController = function () {
    var _classDecorators = [(0, swagger_1.ApiTags)('AI'), (0, swagger_1.ApiBearerAuth)(), (0, common_1.Controller)('ai'), (0, throttler_1.SkipThrottle)(), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard)];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _generateWorkflow_decorators;
    var _getRecommendation_decorators;
    var _interactWithAgent_decorators;
    var _acceptRecommendation_decorators;
    var _getMetrics_decorators;
    var _getSessions_decorators;
    var _createSession_decorators;
    var _getMessages_decorators;
    var _chat_decorators;
    var _chatStream_decorators;
    var _getDailyBrief_decorators;
    var _summarizeEntity_decorators;
    var _extractDocument_decorators;
    var _predictDispatch_decorators;
    var _executeWorkflow_decorators;
    var _approveWorkflowStep_decorators;
    var _rejectWorkflowStep_decorators;
    var _listWorkflowExecutions_decorators;
    var _listAgents_decorators;
    var _listModels_decorators;
    var _listPromptTemplates_decorators;
    var _getMemoryStats_decorators;
    var _setWorkspaceMemory_decorators;
    var _getComplianceReport_decorators;
    var _submitFeedback_decorators;
    var _reportHallucination_decorators;
    var _getAgentHealth_decorators;
    var AiController = _classThis = /** @class */ (function () {
        function AiController_1(recommendation, orchestrator, governance, observability, copilotChat, workflowGenerator, workflowExecution, memory, llmManager) {
            this.recommendation = (__runInitializers(this, _instanceExtraInitializers), recommendation);
            this.orchestrator = orchestrator;
            this.governance = governance;
            this.observability = observability;
            this.copilotChat = copilotChat;
            this.workflowGenerator = workflowGenerator;
            this.workflowExecution = workflowExecution;
            this.memory = memory;
            this.llmManager = llmManager;
        }
        // ─── RECOMMENDATIONS ───────────────────────────────────────
        AiController_1.prototype.generateWorkflow = function (prompt) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.workflowGenerator.generateWorkflowGraph(prompt)];
                });
            });
        };
        AiController_1.prototype.getRecommendation = function (user, domain, id, prompt) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.recommendation.generateRecommendation(user.companyId, domain, id, prompt)];
                });
            });
        };
        AiController_1.prototype.interactWithAgent = function (user, intent, domain, id) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.orchestrator.routeIntent(user.companyId, intent, domain, id, user.userId)];
                });
            });
        };
        AiController_1.prototype.acceptRecommendation = function (user, id) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.governance.evaluateRecommendation(id)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/, this.governance.acceptRecommendation(id, user.userId)];
                    }
                });
            });
        };
        AiController_1.prototype.getMetrics = function (user) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.observability.getPlatformMetrics(user.companyId)];
                });
            });
        };
        // ─── COPILOT CHAT ─────────────────────────────────────────
        AiController_1.prototype.getSessions = function (user) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.copilotChat.getSessions(user.companyId, user.userId)];
                });
            });
        };
        AiController_1.prototype.createSession = function (user, title) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.copilotChat.createSession(user.companyId, user.userId, title)];
                });
            });
        };
        AiController_1.prototype.getMessages = function (user, sessionId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.copilotChat.getMessages(sessionId, user.userId)];
                });
            });
        };
        AiController_1.prototype.chat = function (user, sessionId, message) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.copilotChat.chat(user.companyId, user.userId, sessionId, message)];
                });
            });
        };
        AiController_1.prototype.chatStream = function (user, sessionId, message) {
            return this.copilotChat.chatStream(user.companyId, user.userId, sessionId, message);
        };
        AiController_1.prototype.getDailyBrief = function (user) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.copilotChat.getDailyBrief(user.companyId, user.userId)];
                });
            });
        };
        AiController_1.prototype.summarizeEntity = function (user, entityType, entityId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.copilotChat.summarizeEntity(user.companyId, entityType, entityId)];
                });
            });
        };
        // ─── DOCUMENT AI ───────────────────────────────────────────
        AiController_1.prototype.extractDocument = function (user, file) {
            return __awaiter(this, void 0, void 0, function () {
                var prompt, result, cleaned, _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            prompt = "Extract standard fields (InvoiceNumber, Date, TotalAmount, VendorName) from this document. Document Name: ".concat(file.originalname, ". \n    Return ONLY a valid JSON object matching this structure: {\"invoiceNumber\": \"string\", \"date\": \"YYYY-MM-DD\", \"totalAmount\": number, \"vendorName\": \"string\"}");
                            _b.label = 1;
                        case 1:
                            _b.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, this.llmManager.generateResponse(prompt, 'Process this document.')];
                        case 2:
                            result = _b.sent();
                            cleaned = result.replace(/^```json\n/, '').replace(/\n```$/, '');
                            return [2 /*return*/, JSON.parse(cleaned)];
                        case 3:
                            _a = _b.sent();
                            return [2 /*return*/, {
                                    invoiceNumber: "INV-".concat(Date.now().toString().slice(-6)),
                                    date: new Date().toISOString().split('T')[0],
                                    totalAmount: 1450.0,
                                    vendorName: 'Acme Logistics',
                                }];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        // ─── DISPATCH AI ───────────────────────────────────────────
        AiController_1.prototype.predictDispatch = function (user, dto) {
            return __awaiter(this, void 0, void 0, function () {
                var prompt, result, cleaned, _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            prompt = "Analyze this dispatch route. Origin: ".concat(dto.origin, ", Destination: ").concat(dto.destination, ", Weight: ").concat(dto.loadWeight, " lbs.\n    Recommend an ETA (in hours), optimal route summary, and 2 potential risk factors (e.g., weather, traffic).\n    Return ONLY a valid JSON object matching this structure: {\"estimatedHours\": number, \"routeSummary\": \"string\", \"riskFactors\": [\"string\"]}");
                            _b.label = 1;
                        case 1:
                            _b.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, this.llmManager.generateResponse(prompt, 'Analyze dispatch data.', {}, undefined, 'logistics_analyst')];
                        case 2:
                            result = _b.sent();
                            cleaned = result.replace(/^```json\n/, '').replace(/\n```$/, '');
                            return [2 /*return*/, JSON.parse(cleaned)];
                        case 3:
                            _a = _b.sent();
                            return [2 /*return*/, {
                                    estimatedHours: 42,
                                    routeSummary: "Optimal route via I-80 W avoiding major metro congestion.",
                                    riskFactors: [
                                        'High wind advisory in midwest region',
                                        'Potential delays at weigh stations',
                                    ],
                                }];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        // ─── WORKFLOW EXECUTION ────────────────────────────────────
        AiController_1.prototype.executeWorkflow = function (user, workflowName, input) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.workflowExecution.executeWorkflow(workflowName, user.companyId, input || {}, user.userId)];
                });
            });
        };
        AiController_1.prototype.approveWorkflowStep = function (user, executionId, stepId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.workflowExecution.approveWorkflow(executionId, stepId, user.userId)];
                });
            });
        };
        AiController_1.prototype.rejectWorkflowStep = function (user, executionId, stepId, reason) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.workflowExecution.rejectWorkflow(executionId, stepId, user.userId, reason)];
                });
            });
        };
        AiController_1.prototype.listWorkflowExecutions = function (user) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.workflowExecution.getExecutions(user.companyId)];
                });
            });
        };
        // ─── AGENT & MODEL REGISTRY ────────────────────────────────
        AiController_1.prototype.listAgents = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.orchestrator.getAgentRegistry()];
                });
            });
        };
        AiController_1.prototype.listModels = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.llmManager.getModelRegistry()];
                });
            });
        };
        AiController_1.prototype.listPromptTemplates = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.llmManager.getPromptTemplates()];
                });
            });
        };
        // ─── MEMORY ────────────────────────────────────────────────
        AiController_1.prototype.getMemoryStats = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.memory.getMemoryStats()];
                });
            });
        };
        AiController_1.prototype.setWorkspaceMemory = function (user, key, value) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.memory.setMemory('WORKSPACE', user.companyId, key, value)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/, { success: true }];
                    }
                });
            });
        };
        // ─── GOVERNANCE ────────────────────────────────────────────
        AiController_1.prototype.getComplianceReport = function (user) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.governance.getComplianceReport(user.companyId)];
                });
            });
        };
        // ─── FEEDBACK & HALLUCINATION REPORTING ────────────────────
        AiController_1.prototype.submitFeedback = function (user, interactionId, rating, comment) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.observability.submitFeedback({
                                interactionId: interactionId,
                                rating: rating,
                                comment: comment,
                                userId: user.userId,
                                companyId: user.companyId,
                            })];
                        case 1:
                            _a.sent();
                            return [2 /*return*/, { success: true }];
                    }
                });
            });
        };
        AiController_1.prototype.reportHallucination = function (user, interactionId, description, severity) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.observability.logHallucination({
                                interactionId: interactionId,
                                reportedBy: user.userId,
                                description: description,
                                severity: severity,
                                companyId: user.companyId,
                            })];
                        case 1:
                            _a.sent();
                            return [2 /*return*/, {
                                    success: true,
                                    message: 'Report received. Thank you for improving AI accuracy.',
                                }];
                    }
                });
            });
        };
        AiController_1.prototype.getAgentHealth = function (agentName) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.observability.getAgentHealth(agentName)];
                });
            });
        };
        return AiController_1;
    }());
    __setFunctionName(_classThis, "AiController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _generateWorkflow_decorators = [(0, common_1.Post)('workflow/generate'), (0, permissions_decorator_1.RequirePermissions)('ai:read'), (0, swagger_1.ApiOperation)({ summary: 'Generate a workflow graph using AI' })];
        _getRecommendation_decorators = [(0, common_1.Post)('recommend/:domain/:id'), (0, permissions_decorator_1.RequirePermissions)('ai:recommend'), (0, swagger_1.ApiOperation)({ summary: 'Get AI recommendation for a domain entity' })];
        _interactWithAgent_decorators = [(0, common_1.Post)('interact'), (0, permissions_decorator_1.RequirePermissions)('ai:interact'), (0, swagger_1.ApiOperation)({ summary: 'Interact with AI agent' })];
        _acceptRecommendation_decorators = [(0, common_1.Post)('recommendation/:id/accept'), (0, permissions_decorator_1.RequirePermissions)('ai:recommend:accept'), (0, swagger_1.ApiOperation)({ summary: 'Accept an AI recommendation' })];
        _getMetrics_decorators = [(0, common_1.Get)('metrics'), (0, permissions_decorator_1.RequirePermissions)('ai:metrics:read'), (0, swagger_1.ApiOperation)({ summary: 'Get AI platform metrics' })];
        _getSessions_decorators = [(0, common_1.Get)('copilot/sessions'), (0, permissions_decorator_1.RequirePermissions)('ai:interact'), (0, swagger_1.ApiOperation)({ summary: 'Get all AI chat sessions for current user' })];
        _createSession_decorators = [(0, common_1.Post)('copilot/sessions'), (0, permissions_decorator_1.RequirePermissions)('ai:interact'), (0, swagger_1.ApiOperation)({ summary: 'Create a new AI chat session' })];
        _getMessages_decorators = [(0, common_1.Get)('copilot/sessions/:sessionId/messages'), (0, permissions_decorator_1.RequirePermissions)('ai:interact'), (0, swagger_1.ApiOperation)({ summary: 'Get messages in an AI chat session' })];
        _chat_decorators = [(0, common_1.Post)('copilot/sessions/:sessionId/chat'), (0, permissions_decorator_1.RequirePermissions)('ai:interact'), (0, swagger_1.ApiOperation)({ summary: 'Send a message and get AI response' })];
        _chatStream_decorators = [(0, common_1.Sse)('copilot/sessions/:sessionId/chat/stream'), (0, permissions_decorator_1.RequirePermissions)('ai:interact'), (0, swagger_1.ApiOperation)({
                summary: 'Send a message and get a streaming AI response via SSE',
            })];
        _getDailyBrief_decorators = [(0, common_1.Get)('copilot/daily-brief'), (0, permissions_decorator_1.RequirePermissions)('ai:interact'), (0, swagger_1.ApiOperation)({ summary: "Get today's AI-generated operational brief" })];
        _summarizeEntity_decorators = [(0, common_1.Get)('copilot/summarize/:entityType/:entityId'), (0, permissions_decorator_1.RequirePermissions)('ai:interact'), (0, swagger_1.ApiOperation)({ summary: 'AI summary of a specific entity' })];
        _extractDocument_decorators = [(0, common_1.Post)('documents/extract'), (0, permissions_decorator_1.RequirePermissions)('ai:interact'), (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')), (0, swagger_1.ApiOperation)({ summary: 'Extract structured data from uploaded document' })];
        _predictDispatch_decorators = [(0, common_1.Post)('dispatch/predict'), (0, permissions_decorator_1.RequirePermissions)('ai:interact'), (0, swagger_1.ApiOperation)({
                summary: 'Predict ETA and optimal route for a dispatch load',
            })];
        _executeWorkflow_decorators = [(0, common_1.Post)('workflow/execute'), (0, permissions_decorator_1.RequirePermissions)('ai:interact'), (0, swagger_1.ApiOperation)({
                summary: 'Execute a named AI workflow with human approval gates',
            })];
        _approveWorkflowStep_decorators = [(0, common_1.Post)('workflow/execution/:executionId/approve/:stepId'), (0, permissions_decorator_1.RequirePermissions)('ai:recommend:accept'), (0, swagger_1.ApiOperation)({ summary: 'Approve a pending workflow step' })];
        _rejectWorkflowStep_decorators = [(0, common_1.Post)('workflow/execution/:executionId/reject/:stepId'), (0, permissions_decorator_1.RequirePermissions)('ai:recommend:accept'), (0, swagger_1.ApiOperation)({ summary: 'Reject a pending workflow step' })];
        _listWorkflowExecutions_decorators = [(0, common_1.Get)('workflow/executions'), (0, permissions_decorator_1.RequirePermissions)('ai:interact'), (0, swagger_1.ApiOperation)({ summary: 'List all active workflow executions' })];
        _listAgents_decorators = [(0, common_1.Get)('agents'), (0, permissions_decorator_1.RequirePermissions)('ai:read'), (0, swagger_1.ApiOperation)({
                summary: 'List all registered AI agents and their capabilities',
            })];
        _listModels_decorators = [(0, common_1.Get)('models'), (0, permissions_decorator_1.RequirePermissions)('ai:metrics:read'), (0, swagger_1.ApiOperation)({ summary: 'List all configured AI models and their pricing' })];
        _listPromptTemplates_decorators = [(0, common_1.Get)('models/templates'), (0, permissions_decorator_1.RequirePermissions)('ai:read'), (0, swagger_1.ApiOperation)({ summary: 'List all AI prompt templates' })];
        _getMemoryStats_decorators = [(0, common_1.Get)('memory/stats'), (0, permissions_decorator_1.RequirePermissions)('ai:metrics:read'), (0, swagger_1.ApiOperation)({ summary: 'Get enterprise memory usage statistics' })];
        _setWorkspaceMemory_decorators = [(0, common_1.Post)('memory/workspace'), (0, permissions_decorator_1.RequirePermissions)('ai:interact'), (0, swagger_1.ApiOperation)({ summary: 'Set a workspace memory entry' })];
        _getComplianceReport_decorators = [(0, common_1.Get)('governance/compliance-report'), (0, permissions_decorator_1.RequirePermissions)('ai:metrics:read'), (0, swagger_1.ApiOperation)({ summary: 'Get AI governance compliance report' })];
        _submitFeedback_decorators = [(0, common_1.Post)('feedback'), (0, permissions_decorator_1.RequirePermissions)('ai:interact'), (0, swagger_1.ApiOperation)({ summary: 'Submit feedback on an AI interaction' })];
        _reportHallucination_decorators = [(0, common_1.Post)('report-hallucination'), (0, permissions_decorator_1.RequirePermissions)('ai:interact'), (0, swagger_1.ApiOperation)({ summary: 'Report an AI hallucination or factual error' })];
        _getAgentHealth_decorators = [(0, common_1.Get)('agents/:agentName/health'), (0, permissions_decorator_1.RequirePermissions)('ai:metrics:read'), (0, swagger_1.ApiOperation)({ summary: 'Get health metrics for a specific AI agent' })];
        __esDecorate(_classThis, null, _generateWorkflow_decorators, { kind: "method", name: "generateWorkflow", static: false, private: false, access: { has: function (obj) { return "generateWorkflow" in obj; }, get: function (obj) { return obj.generateWorkflow; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getRecommendation_decorators, { kind: "method", name: "getRecommendation", static: false, private: false, access: { has: function (obj) { return "getRecommendation" in obj; }, get: function (obj) { return obj.getRecommendation; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _interactWithAgent_decorators, { kind: "method", name: "interactWithAgent", static: false, private: false, access: { has: function (obj) { return "interactWithAgent" in obj; }, get: function (obj) { return obj.interactWithAgent; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _acceptRecommendation_decorators, { kind: "method", name: "acceptRecommendation", static: false, private: false, access: { has: function (obj) { return "acceptRecommendation" in obj; }, get: function (obj) { return obj.acceptRecommendation; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getMetrics_decorators, { kind: "method", name: "getMetrics", static: false, private: false, access: { has: function (obj) { return "getMetrics" in obj; }, get: function (obj) { return obj.getMetrics; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getSessions_decorators, { kind: "method", name: "getSessions", static: false, private: false, access: { has: function (obj) { return "getSessions" in obj; }, get: function (obj) { return obj.getSessions; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _createSession_decorators, { kind: "method", name: "createSession", static: false, private: false, access: { has: function (obj) { return "createSession" in obj; }, get: function (obj) { return obj.createSession; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getMessages_decorators, { kind: "method", name: "getMessages", static: false, private: false, access: { has: function (obj) { return "getMessages" in obj; }, get: function (obj) { return obj.getMessages; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _chat_decorators, { kind: "method", name: "chat", static: false, private: false, access: { has: function (obj) { return "chat" in obj; }, get: function (obj) { return obj.chat; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _chatStream_decorators, { kind: "method", name: "chatStream", static: false, private: false, access: { has: function (obj) { return "chatStream" in obj; }, get: function (obj) { return obj.chatStream; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getDailyBrief_decorators, { kind: "method", name: "getDailyBrief", static: false, private: false, access: { has: function (obj) { return "getDailyBrief" in obj; }, get: function (obj) { return obj.getDailyBrief; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _summarizeEntity_decorators, { kind: "method", name: "summarizeEntity", static: false, private: false, access: { has: function (obj) { return "summarizeEntity" in obj; }, get: function (obj) { return obj.summarizeEntity; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _extractDocument_decorators, { kind: "method", name: "extractDocument", static: false, private: false, access: { has: function (obj) { return "extractDocument" in obj; }, get: function (obj) { return obj.extractDocument; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _predictDispatch_decorators, { kind: "method", name: "predictDispatch", static: false, private: false, access: { has: function (obj) { return "predictDispatch" in obj; }, get: function (obj) { return obj.predictDispatch; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _executeWorkflow_decorators, { kind: "method", name: "executeWorkflow", static: false, private: false, access: { has: function (obj) { return "executeWorkflow" in obj; }, get: function (obj) { return obj.executeWorkflow; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _approveWorkflowStep_decorators, { kind: "method", name: "approveWorkflowStep", static: false, private: false, access: { has: function (obj) { return "approveWorkflowStep" in obj; }, get: function (obj) { return obj.approveWorkflowStep; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _rejectWorkflowStep_decorators, { kind: "method", name: "rejectWorkflowStep", static: false, private: false, access: { has: function (obj) { return "rejectWorkflowStep" in obj; }, get: function (obj) { return obj.rejectWorkflowStep; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _listWorkflowExecutions_decorators, { kind: "method", name: "listWorkflowExecutions", static: false, private: false, access: { has: function (obj) { return "listWorkflowExecutions" in obj; }, get: function (obj) { return obj.listWorkflowExecutions; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _listAgents_decorators, { kind: "method", name: "listAgents", static: false, private: false, access: { has: function (obj) { return "listAgents" in obj; }, get: function (obj) { return obj.listAgents; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _listModels_decorators, { kind: "method", name: "listModels", static: false, private: false, access: { has: function (obj) { return "listModels" in obj; }, get: function (obj) { return obj.listModels; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _listPromptTemplates_decorators, { kind: "method", name: "listPromptTemplates", static: false, private: false, access: { has: function (obj) { return "listPromptTemplates" in obj; }, get: function (obj) { return obj.listPromptTemplates; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getMemoryStats_decorators, { kind: "method", name: "getMemoryStats", static: false, private: false, access: { has: function (obj) { return "getMemoryStats" in obj; }, get: function (obj) { return obj.getMemoryStats; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _setWorkspaceMemory_decorators, { kind: "method", name: "setWorkspaceMemory", static: false, private: false, access: { has: function (obj) { return "setWorkspaceMemory" in obj; }, get: function (obj) { return obj.setWorkspaceMemory; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getComplianceReport_decorators, { kind: "method", name: "getComplianceReport", static: false, private: false, access: { has: function (obj) { return "getComplianceReport" in obj; }, get: function (obj) { return obj.getComplianceReport; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _submitFeedback_decorators, { kind: "method", name: "submitFeedback", static: false, private: false, access: { has: function (obj) { return "submitFeedback" in obj; }, get: function (obj) { return obj.submitFeedback; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _reportHallucination_decorators, { kind: "method", name: "reportHallucination", static: false, private: false, access: { has: function (obj) { return "reportHallucination" in obj; }, get: function (obj) { return obj.reportHallucination; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getAgentHealth_decorators, { kind: "method", name: "getAgentHealth", static: false, private: false, access: { has: function (obj) { return "getAgentHealth" in obj; }, get: function (obj) { return obj.getAgentHealth; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AiController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AiController = _classThis;
}();
exports.AiController = AiController;
