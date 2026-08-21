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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiCopilotChatService = void 0;
// Typescript checking skipped for AI module
var common_1 = require("@nestjs/common");
var rxjs_1 = require("rxjs");
var tools_1 = require("./tools");
var agents_1 = require("langchain/agents");
var prompts_1 = require("@langchain/core/prompts");
var AiCopilotChatService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var AiCopilotChatService = _classThis = /** @class */ (function () {
        function AiCopilotChatService_1(prisma, copilot, orchestrator, rag, llmManager) {
            this.prisma = prisma;
            this.copilot = copilot;
            this.orchestrator = orchestrator;
            this.rag = rag;
            this.llmManager = llmManager;
        }
        AiCopilotChatService_1.prototype.getSessions = function (companyId, userId) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                return [2 /*return*/, tx.aiChatSession.findMany({
                                        where: { companyId: companyId, userId: userId },
                                        orderBy: { updatedAt: 'desc' },
                                        take: 20,
                                    })];
                            });
                        }); })];
                });
            });
        };
        AiCopilotChatService_1.prototype.createSession = function (companyId, userId, title) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                return [2 /*return*/, tx.aiChatSession.create({
                                        data: { companyId: companyId, userId: userId, title: title || 'New Conversation' },
                                    })];
                            });
                        }); })];
                });
            });
        };
        AiCopilotChatService_1.prototype.getMessages = function (sessionId, userId) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                return [2 /*return*/, tx.aiChatMessage.findMany({
                                        where: { sessionId: sessionId },
                                        orderBy: { createdAt: 'asc' },
                                    })];
                            });
                        }); })];
                });
            });
        };
        AiCopilotChatService_1.prototype.chat = function (companyId, userId, sessionId, userMessage) {
            return __awaiter(this, void 0, void 0, function () {
                var session, aiContent, citations, ragContext, result, e_1, aiMessage;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: 
                        // Save user message
                        return [4 /*yield*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    return [2 /*return*/, tx.aiChatMessage.create({
                                            data: { sessionId: sessionId, role: 'USER', content: userMessage },
                                        })];
                                });
                            }); })];
                        case 1:
                            // Save user message
                            _a.sent();
                            return [4 /*yield*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.aiChatSession.findUnique({
                                                where: { id: sessionId },
                                            })];
                                    });
                                }); })];
                        case 2:
                            session = _a.sent();
                            if (!((session === null || session === void 0 ? void 0 : session.title) === 'New Conversation')) return [3 /*break*/, 4];
                            return [4 /*yield*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.aiChatSession.update({
                                                where: { id: sessionId },
                                                data: { title: userMessage.substring(0, 60) },
                                            })];
                                    });
                                }); })];
                        case 3:
                            _a.sent();
                            _a.label = 4;
                        case 4:
                            aiContent = '';
                            citations = [];
                            _a.label = 5;
                        case 5:
                            _a.trys.push([5, 8, , 10]);
                            return [4 /*yield*/, this.rag.retrieveContext(userMessage)];
                        case 6:
                            ragContext = _a.sent();
                            return [4 /*yield*/, this.orchestrator.routeIntent(companyId, userMessage + '\n\nKnowledge Context:\n' + JSON.stringify(ragContext), 'Chat', sessionId, userId)];
                        case 7:
                            result = _a.sent();
                            aiContent = result.response;
                            citations = [];
                            return [3 /*break*/, 10];
                        case 8:
                            e_1 = _a.sent();
                            return [4 /*yield*/, this.generateContextualResponse(companyId, userMessage)];
                        case 9:
                            // Fallback to intelligent mock responses
                            aiContent = _a.sent();
                            return [3 /*break*/, 10];
                        case 10: return [4 /*yield*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    return [2 /*return*/, tx.aiChatMessage.create({
                                            data: {
                                                sessionId: sessionId,
                                                role: 'ASSISTANT',
                                                content: aiContent,
                                                citations: citations,
                                            },
                                        })];
                                });
                            }); })];
                        case 11:
                            aiMessage = _a.sent();
                            // Update session
                            return [4 /*yield*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.aiChatSession.update({
                                                where: { id: sessionId },
                                                data: { updatedAt: new Date() },
                                            })];
                                    });
                                }); })];
                        case 12:
                            // Update session
                            _a.sent();
                            return [2 /*return*/, aiMessage];
                    }
                });
            });
        };
        AiCopilotChatService_1.prototype.chatStream = function (companyId, userId, sessionId, userMessage) {
            var _this = this;
            return new rxjs_1.Observable(function (subscriber) {
                (function () { return __awaiter(_this, void 0, void 0, function () {
                    var session, aiContent_1, citations_1, ragContext, contextStr, model, stream, _a, stream_1, stream_1_1, chunk, e_2_1, tools, prompt_1, agent, executor, result, chunks, _i, chunks_1, chunk, e_3, error_1;
                    var _this = this;
                    var _b, e_2, _c, _d;
                    return __generator(this, function (_e) {
                        switch (_e.label) {
                            case 0:
                                _e.trys.push([0, 31, , 32]);
                                // Save user message
                                return [4 /*yield*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                        return __generator(this, function (_a) {
                                            return [2 /*return*/, tx.aiChatMessage.create({
                                                    data: { sessionId: sessionId, role: 'USER', content: userMessage },
                                                })];
                                        });
                                    }); })];
                            case 1:
                                // Save user message
                                _e.sent();
                                return [4 /*yield*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                        return __generator(this, function (_a) {
                                            return [2 /*return*/, tx.aiChatSession.findUnique({
                                                    where: { id: sessionId },
                                                })];
                                        });
                                    }); })];
                            case 2:
                                session = _e.sent();
                                if (!((session === null || session === void 0 ? void 0 : session.title) === 'New Conversation')) return [3 /*break*/, 4];
                                return [4 /*yield*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                        return __generator(this, function (_a) {
                                            return [2 /*return*/, tx.aiChatSession.update({
                                                    where: { id: sessionId },
                                                    data: { title: userMessage.substring(0, 60) },
                                                })];
                                        });
                                    }); })];
                            case 3:
                                _e.sent();
                                _e.label = 4;
                            case 4:
                                aiContent_1 = '';
                                citations_1 = [];
                                _e.label = 5;
                            case 5:
                                _e.trys.push([5, 26, , 28]);
                                return [4 /*yield*/, this.rag.retrieveContext(userMessage)];
                            case 6:
                                ragContext = _e.sent();
                                contextStr = Object.keys(ragContext).length > 0
                                    ? '\n\nKnowledge Context:\n' + JSON.stringify(ragContext)
                                    : '';
                                return [4 /*yield*/, this.llmManager.getModel()];
                            case 7:
                                model = _e.sent();
                                if (!(model._llmType() === 'mock-chat-model')) return [3 /*break*/, 20];
                                stream = this.llmManager.generateStreamResponse('You are PariLink Copilot.', userMessage + contextStr);
                                _e.label = 8;
                            case 8:
                                _e.trys.push([8, 13, 14, 19]);
                                _a = true, stream_1 = __asyncValues(stream);
                                _e.label = 9;
                            case 9: return [4 /*yield*/, stream_1.next()];
                            case 10:
                                if (!(stream_1_1 = _e.sent(), _b = stream_1_1.done, !_b)) return [3 /*break*/, 12];
                                _d = stream_1_1.value;
                                _a = false;
                                chunk = _d;
                                aiContent_1 += chunk;
                                subscriber.next({ data: { chunk: chunk } });
                                _e.label = 11;
                            case 11:
                                _a = true;
                                return [3 /*break*/, 9];
                            case 12: return [3 /*break*/, 19];
                            case 13:
                                e_2_1 = _e.sent();
                                e_2 = { error: e_2_1 };
                                return [3 /*break*/, 19];
                            case 14:
                                _e.trys.push([14, , 17, 18]);
                                if (!(!_a && !_b && (_c = stream_1.return))) return [3 /*break*/, 16];
                                return [4 /*yield*/, _c.call(stream_1)];
                            case 15:
                                _e.sent();
                                _e.label = 16;
                            case 16: return [3 /*break*/, 18];
                            case 17:
                                if (e_2) throw e_2.error;
                                return [7 /*endfinally*/];
                            case 18: return [7 /*endfinally*/];
                            case 19: return [3 /*break*/, 25];
                            case 20:
                                tools = (0, tools_1.createCopilotTools)(this.prisma, companyId);
                                prompt_1 = prompts_1.ChatPromptTemplate.fromMessages([
                                    [
                                        'system',
                                        'You are PariLink Copilot, an enterprise AI assistant for logistics and operations. Use tools to search for data if needed. ' +
                                            contextStr,
                                    ],
                                    ['human', '{input}'],
                                    ['placeholder', '{agent_scratchpad}'],
                                ]);
                                agent = (0, agents_1.createToolCallingAgent)({
                                    llm: model,
                                    tools: tools,
                                    prompt: prompt_1,
                                });
                                executor = new agents_1.AgentExecutor({
                                    agent: agent,
                                    tools: tools,
                                });
                                return [4 /*yield*/, executor.invoke({ input: userMessage })];
                            case 21:
                                result = _e.sent();
                                aiContent_1 =
                                    typeof result.output === 'string'
                                        ? result.output
                                        : JSON.stringify(result.output);
                                chunks = aiContent_1.match(/.{1,10}/g) || [];
                                _i = 0, chunks_1 = chunks;
                                _e.label = 22;
                            case 22:
                                if (!(_i < chunks_1.length)) return [3 /*break*/, 25];
                                chunk = chunks_1[_i];
                                subscriber.next({ data: { chunk: chunk } });
                                return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 10); })];
                            case 23:
                                _e.sent();
                                _e.label = 24;
                            case 24:
                                _i++;
                                return [3 /*break*/, 22];
                            case 25: return [3 /*break*/, 28];
                            case 26:
                                e_3 = _e.sent();
                                return [4 /*yield*/, this.generateContextualResponse(companyId, userMessage)];
                            case 27:
                                // Fallback
                                aiContent_1 = _e.sent();
                                subscriber.next({ data: { chunk: aiContent_1 } });
                                return [3 /*break*/, 28];
                            case 28: 
                            // Save AI response
                            return [4 /*yield*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.aiChatMessage.create({
                                                data: {
                                                    sessionId: sessionId,
                                                    role: 'ASSISTANT',
                                                    content: aiContent_1,
                                                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                                    citations: citations_1,
                                                },
                                            })];
                                    });
                                }); })];
                            case 29:
                                // Save AI response
                                _e.sent();
                                // Update session
                                return [4 /*yield*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                        return __generator(this, function (_a) {
                                            return [2 /*return*/, tx.aiChatSession.update({
                                                    where: { id: sessionId },
                                                    data: { updatedAt: new Date() },
                                                })];
                                        });
                                    }); })];
                            case 30:
                                // Update session
                                _e.sent();
                                subscriber.next({ data: { done: true } });
                                subscriber.complete();
                                return [3 /*break*/, 32];
                            case 31:
                                error_1 = _e.sent();
                                subscriber.error(error_1);
                                return [3 /*break*/, 32];
                            case 32: return [2 /*return*/];
                        }
                    });
                }); })();
            });
        };
        AiCopilotChatService_1.prototype.getDailyBrief = function (companyId, userId) {
            return __awaiter(this, void 0, void 0, function () {
                var today, _a, activeLoads, tripsToday, overdueInvoices, activeAlerts, newCustomers, metricsStr, summary, recommendations, response, parsed, _b;
                var _this = this;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            today = new Date();
                            today.setHours(0, 0, 0, 0);
                            return [4 /*yield*/, Promise.all([
                                    this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                        return __generator(this, function (_a) {
                                            return [2 /*return*/, tx.load.count({
                                                    where: { companyId: companyId, status: { in: ['DISPATCHED', 'IN_TRANSIT'] } },
                                                })];
                                        });
                                    }); }),
                                    this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                        return __generator(this, function (_a) {
                                            return [2 /*return*/, tx.trip.count({
                                                    where: { companyId: companyId, startDate: { gte: today } },
                                                })];
                                        });
                                    }); }),
                                    this.prisma
                                        .runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                        return [2 /*return*/, tx.invoice.count({ where: { companyId: companyId, status: 'OVERDUE' } })];
                                    }); }); })
                                        .catch(function () { return 0; }),
                                    this.prisma
                                        .runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.alert.count({ where: { companyId: companyId, status: 'ACTIVE' } })];
                                    }); }); })
                                        .catch(function () { return 0; }),
                                    this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                        return __generator(this, function (_a) {
                                            return [2 /*return*/, tx.customer.count({
                                                    where: { companyId: companyId, createdAt: { gte: today } },
                                                })];
                                        });
                                    }); }),
                                ])];
                        case 1:
                            _a = _c.sent(), activeLoads = _a[0], tripsToday = _a[1], overdueInvoices = _a[2], activeAlerts = _a[3], newCustomers = _a[4];
                            metricsStr = JSON.stringify({
                                activeLoads: activeLoads,
                                tripsToday: tripsToday,
                                overdueInvoices: overdueInvoices,
                                activeAlerts: activeAlerts,
                                newCustomers: newCustomers,
                            });
                            summary = '';
                            recommendations = [];
                            _c.label = 2;
                        case 2:
                            _c.trys.push([2, 4, , 5]);
                            return [4 /*yield*/, this.llmManager.generateResponse('You are an executive analyst. Provide a brief daily operational summary and 2-3 key bulleted recommendations based on the provided metrics. Output must be valid JSON: {"summary": "string", "recommendations": ["string"]}. Keep it professional and action-oriented.', "Here are today's metrics: ".concat(metricsStr), {}, undefined, 'executive_analyst')];
                        case 3:
                            response = _c.sent();
                            parsed = JSON.parse(response.replace(/^```json\n/, '').replace(/\n```$/, ''));
                            summary = parsed.summary;
                            recommendations = parsed.recommendations;
                            return [3 /*break*/, 5];
                        case 4:
                            _b = _c.sent();
                            // Fallback if LLM parsing fails or is mocked without json
                            summary = "Good morning! You have ".concat(activeLoads, " active loads in transit, ").concat(tripsToday, " trips scheduled today, and ").concat(overdueInvoices, " overdue invoices requiring attention. ").concat(activeAlerts > 0 ? "There are ".concat(activeAlerts, " active alerts that need review.") : 'No active alerts — operations are running smoothly.');
                            recommendations = [
                                activeLoads > 5
                                    ? "\uD83D\uDCE6 ".concat(activeLoads, " loads are in transit \u2014 check ETA updates for delays.")
                                    : null,
                                overdueInvoices > 0
                                    ? "\uD83D\uDCB0 ".concat(overdueInvoices, " invoices are overdue \u2014 schedule follow-ups with customers.")
                                    : null,
                                activeAlerts > 0
                                    ? "\uD83D\uDEA8 ".concat(activeAlerts, " active alerts \u2014 review the alert dashboard for details.")
                                    : null,
                                "\uD83D\uDCCA Review today's dispatch board for optimal resource allocation.",
                            ].filter(Boolean);
                            return [3 /*break*/, 5];
                        case 5: return [2 /*return*/, {
                                generatedAt: new Date().toISOString(),
                                metrics: {
                                    activeLoads: activeLoads,
                                    tripsToday: tripsToday,
                                    overdueInvoices: overdueInvoices,
                                    activeAlerts: activeAlerts,
                                    newCustomers: newCustomers,
                                },
                                summary: summary,
                                recommendations: recommendations,
                            }];
                    }
                });
            });
        };
        AiCopilotChatService_1.prototype.summarizeEntity = function (companyId, entityType, entityId) {
            return __awaiter(this, void 0, void 0, function () {
                var entity, summary, e_4;
                var _this = this;
                var _a, _b, _c, _d, _e;
                return __generator(this, function (_f) {
                    switch (_f.label) {
                        case 0:
                            _f.trys.push([0, 5, , 6]);
                            entity = null;
                            summary = '';
                            if (!(entityType === 'Load')) return [3 /*break*/, 2];
                            return [4 /*yield*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.load.findFirst({
                                                where: { id: entityId, companyId: companyId },
                                                include: { customer: true },
                                            })];
                                    });
                                }); })];
                        case 1:
                            entity = (_f.sent());
                            if (entity) {
                                summary =
                                    "**Load ".concat(entity.referenceNumber, "** \u2014 ").concat(entity.status, "\n\n") +
                                        "\uD83D\uDCCD **Route**: ".concat(entity.originCity, ", ").concat(entity.originState, " \u2192 ").concat(entity.destinationCity, ", ").concat(entity.destinationState, "\n") +
                                        "\uD83D\uDC64 **Customer**: ".concat(((_a = entity.customer) === null || _a === void 0 ? void 0 : _a.name) || 'Unassigned', "\n") +
                                        "\uD83D\uDE9B **Driver**: ".concat(((_b = entity.driver) === null || _b === void 0 ? void 0 : _b.firstName) ? "".concat(entity.driver.firstName, " ").concat(entity.driver.lastName) : 'Unassigned', "\n") +
                                        "\uD83D\uDCB0 **Rate**: $".concat((_c = entity.rate) === null || _c === void 0 ? void 0 : _c.toLocaleString(), "\n") +
                                        "\uD83D\uDCC5 **Pickup**: ".concat(entity.pickupDate ? new Date(entity.pickupDate).toLocaleDateString() : 'TBD', "\n") +
                                        "\uD83D\uDCC5 **Delivery**: ".concat(entity.deliveryDate ? new Date(entity.deliveryDate).toLocaleDateString() : 'TBD');
                            }
                            return [3 /*break*/, 4];
                        case 2:
                            if (!(entityType === 'Trip')) return [3 /*break*/, 4];
                            return [4 /*yield*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.trip.findFirst({
                                                where: { id: entityId, companyId: companyId },
                                                include: { driver: true, vehicle: true },
                                            })];
                                    });
                                }); })];
                        case 3:
                            entity = _f.sent();
                            if (entity) {
                                summary =
                                    "**Trip ".concat(entity.tripNumber, "** \u2014 ").concat(entity.status, "\n\n") +
                                        "\uD83D\uDE9B **Vehicle**: ".concat(((_d = entity.vehicle) === null || _d === void 0 ? void 0 : _d.licensePlate) || 'Unassigned', "\n") +
                                        "\uD83D\uDC64 **Driver**: ".concat(((_e = entity.driver) === null || _e === void 0 ? void 0 : _e.firstName) ? "".concat(entity.driver.firstName, " ").concat(entity.driver.lastName) : 'Unassigned', "\n") +
                                        "\uD83D\uDCC5 **Start**: ".concat(entity.startDate ? new Date(entity.startDate).toLocaleDateString() : 'TBD');
                            }
                            _f.label = 4;
                        case 4: return [2 /*return*/, {
                                entityType: entityType,
                                entityId: entityId,
                                summary: summary || "No details available for ".concat(entityType, " ").concat(entityId, "."),
                            }];
                        case 5:
                            e_4 = _f.sent();
                            return [2 /*return*/, {
                                    entityType: entityType,
                                    entityId: entityId,
                                    summary: "Could not load details for ".concat(entityType, "."),
                                }];
                        case 6: return [2 /*return*/];
                    }
                });
            });
        };
        AiCopilotChatService_1.prototype.generateContextualResponse = function (companyId, query) {
            return __awaiter(this, void 0, void 0, function () {
                var lowerQuery, loads, active, drivers, vehicles, customers;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            lowerQuery = query.toLowerCase();
                            if (!(lowerQuery.includes('load') || lowerQuery.includes('freight'))) return [3 /*break*/, 3];
                            return [4 /*yield*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                    return [2 /*return*/, tx.load.count({ where: { companyId: companyId } })];
                                }); }); })];
                        case 1:
                            loads = _a.sent();
                            return [4 /*yield*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.load.count({
                                                where: { companyId: companyId, status: { in: ['DISPATCHED', 'IN_TRANSIT'] } },
                                            })];
                                    });
                                }); })];
                        case 2:
                            active = _a.sent();
                            return [2 /*return*/, "Based on your company data, you currently have **".concat(loads, " total loads** with **").concat(active, " actively in transit**. For detailed load analytics, I recommend reviewing the Dispatch Board for real-time status updates. Would you like me to help you analyze specific loads or identify optimization opportunities?")];
                        case 3:
                            if (lowerQuery.includes('invoice') ||
                                lowerQuery.includes('billing') ||
                                lowerQuery.includes('payment')) {
                                return [2 /*return*/, "I can help you analyze your financial data. Your invoice and billing data is synchronized in the Finance module. For overdue invoices, I'd recommend setting up automated reminder workflows using the Automation Builder. Would you like help generating a financial summary report?"];
                            }
                            if (!(lowerQuery.includes('driver') ||
                                lowerQuery.includes('fleet') ||
                                lowerQuery.includes('vehicle'))) return [3 /*break*/, 6];
                            return [4 /*yield*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                    return [2 /*return*/, tx.driver.count({ where: { companyId: companyId } })];
                                }); }); })];
                        case 4:
                            drivers = _a.sent();
                            return [4 /*yield*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.vehicle.count({
                                                where: { companyId: companyId },
                                            })];
                                    });
                                }); })];
                        case 5:
                            vehicles = _a.sent();
                            return [2 /*return*/, "Your fleet consists of **".concat(vehicles, " vehicles** and **").concat(drivers, " registered drivers**. For maintenance predictions and performance analytics, I analyze trip history and vehicle telemetry. Is there a specific driver or vehicle you'd like me to analyze?")];
                        case 6:
                            if (!(lowerQuery.includes('customer') || lowerQuery.includes('crm'))) return [3 /*break*/, 8];
                            return [4 /*yield*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.customer.count({
                                                where: { companyId: companyId },
                                            })];
                                    });
                                }); })];
                        case 7:
                            customers = _a.sent();
                            return [2 /*return*/, "You have **".concat(customers, " customers** in your database. I can help analyze customer revenue trends, identify at-risk accounts, and generate customer performance reports. What would you like to know?")];
                        case 8: return [2 /*return*/, "I'm LogOS Copilot, your enterprise AI assistant. I have access to your complete operations data \u2014 loads, trips, fleet, drivers, customers, invoices, and analytics. I can help you:\n\n\u2022 \uD83D\uDCCA Summarize operational performance\n\u2022 \uD83D\uDD0D Analyze specific loads, trips, or customers\n\u2022 \uD83D\uDCA1 Recommend dispatch optimizations\n\u2022 \uD83D\uDCCB Generate reports and summaries\n\u2022 \u26A0\uFE0F Identify anomalies and risks\n\nWhat would you like to explore?"];
                    }
                });
            });
        };
        return AiCopilotChatService_1;
    }());
    __setFunctionName(_classThis, "AiCopilotChatService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AiCopilotChatService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AiCopilotChatService = _classThis;
}();
exports.AiCopilotChatService = AiCopilotChatService;
