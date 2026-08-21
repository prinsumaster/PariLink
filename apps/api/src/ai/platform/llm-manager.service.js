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
var __await = (this && this.__await) || function (v) { return this instanceof __await ? (this.v = v, this) : new __await(v); }
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __asyncGenerator = (this && this.__asyncGenerator) || function (thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = Object.create((typeof AsyncIterator === "function" ? AsyncIterator : Object).prototype), verb("next"), verb("throw"), verb("return", awaitReturn), i[Symbol.asyncIterator] = function () { return this; }, i;
    function awaitReturn(f) { return function (v) { return Promise.resolve(v).then(f, reject); }; }
    function verb(n, f) { if (g[n]) { i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; if (f) i[n] = f(i[n]); } }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LlmManagerService = void 0;
var common_1 = require("@nestjs/common");
var messages_1 = require("@langchain/core/messages");
// Prompt template registry
var PROMPT_TEMPLATES = {
    logistics_analyst: "You are an expert logistics analyst for PariLink, an enterprise freight and logistics platform.\nYou have deep knowledge of supply chains, freight operations, dispatch, fleet management, and warehouse operations.\nAlways be concise, data-driven, and actionable in your responses.",
    support_agent: "You are a helpful support agent for PariLink.\nYou assist users with platform questions, troubleshooting, and operational guidance.\nBe empathetic, clear, and guide users to solutions efficiently.",
    compliance_officer: "You are a compliance officer AI for PariLink.\nYou evaluate operations against regulatory requirements (FMCSA, DOT, HOS, IFTA).\nAlways cite regulations clearly and flag risks explicitly.",
    developer: "You are an expert developer assistant for the PariLink platform.\nYou know the TypeScript/NestJS backend, Next.js frontend, Prisma schema, and all platform APIs.\nProvide accurate, typed code examples and architectural guidance.",
    finance: "You are a financial analysis AI for PariLink logistics operations.\nYou analyze invoices, factoring, P&L, and cost center performance.\nAlways provide numerical accuracy and flag anomalies.",
    default: "You are PariLink Copilot, an enterprise AI assistant for logistics and operations.\nYou help dispatchers, drivers, warehouse operators, finance teams, and administrators.\nBe precise, professional, and action-oriented.",
};
var LlmManagerService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var LlmManagerService = _classThis = /** @class */ (function () {
        function LlmManagerService_1(modelRouter, observabilityService, governance) {
            this.modelRouter = modelRouter;
            this.observabilityService = observabilityService;
            this.governance = governance;
            this.logger = new common_1.Logger(LlmManagerService.name);
        }
        /**
         * Standard text generation — awaits full response
         */
        LlmManagerService_1.prototype.generateResponse = function (systemPrompt_1, userQuery_1) {
            return __awaiter(this, arguments, void 0, function (systemPrompt, userQuery, context, preferredProvider, templateKey) {
                var startTime, resolvedSystem, sanitizedQuery, model, entry, messages, response, duration, responseText, validation, approxInputTokens, approxOutputTokens, inputCost, outputCost, error_1, duration;
                if (context === void 0) { context = {}; }
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            startTime = Date.now();
                            resolvedSystem = templateKey
                                ? (PROMPT_TEMPLATES[templateKey] || PROMPT_TEMPLATES.default) +
                                    '\n\n' +
                                    systemPrompt
                                : systemPrompt;
                            sanitizedQuery = this.governance.sanitizeInput(userQuery);
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 5, , 7]);
                            return [4 /*yield*/, this.modelRouter.getBestModel(preferredProvider)];
                        case 2:
                            model = _a.sent();
                            entry = this.modelRouter.getModelEntry(preferredProvider);
                            messages = [
                                new messages_1.SystemMessage(resolvedSystem +
                                    (Object.keys(context).length
                                        ? "\n\nContext:\n".concat(JSON.stringify(context, null, 2))
                                        : '')),
                                new messages_1.HumanMessage(sanitizedQuery),
                            ];
                            return [4 /*yield*/, model.invoke(messages)];
                        case 3:
                            response = _a.sent();
                            duration = Date.now() - startTime;
                            responseText = typeof response.content === 'string'
                                ? response.content
                                : JSON.stringify(response.content);
                            validation = this.governance.validateOutput(responseText);
                            if (!validation.valid) {
                                this.logger.warn('LLM generated output violating policies.');
                            }
                            approxInputTokens = Math.ceil(messages
                                .map(function (m) {
                                return typeof m.content === 'string'
                                    ? m.content.length
                                    : JSON.stringify(m.content).length;
                            })
                                .reduce(function (a, b) { return a + b; }, 0) / 4);
                            approxOutputTokens = Math.ceil(responseText.length / 4);
                            inputCost = entry
                                ? (approxInputTokens / 1000) * entry.costPerInputToken
                                : 0;
                            outputCost = entry
                                ? (approxOutputTokens / 1000) * entry.costPerOutputToken
                                : 0;
                            return [4 /*yield*/, this.observabilityService.logMetrics({
                                    modelProvider: (entry === null || entry === void 0 ? void 0 : entry.provider) || 'Fallback',
                                    latencyMs: duration,
                                    promptTokens: approxInputTokens,
                                    completionTokens: approxOutputTokens,
                                    cost: inputCost + outputCost,
                                    success: true,
                                })];
                        case 4:
                            _a.sent();
                            return [2 /*return*/, validation.valid
                                    ? responseText
                                    : 'Output blocked by Security Policy.'];
                        case 5:
                            error_1 = _a.sent();
                            duration = Date.now() - startTime;
                            return [4 /*yield*/, this.observabilityService.logMetrics({
                                    modelProvider: preferredProvider || 'Fallback',
                                    latencyMs: duration,
                                    promptTokens: 0,
                                    completionTokens: 0,
                                    cost: 0,
                                    success: false,
                                })];
                        case 6:
                            _a.sent();
                            this.logger.error("LLM Generation Failed: ".concat(error_1.message));
                            throw error_1;
                        case 7: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Streaming generation — yields text chunks as they arrive
         */
        LlmManagerService_1.prototype.generateStreamResponse = function (systemPrompt_1, userQuery_1) {
            return __asyncGenerator(this, arguments, function generateStreamResponse_1(systemPrompt, userQuery, context, preferredProvider) {
                var model, messages, stream, _a, stream_1, stream_1_1, chunk, text, e_1_1;
                var _b, e_1, _c, _d;
                if (context === void 0) { context = {}; }
                return __generator(this, function (_e) {
                    switch (_e.label) {
                        case 0: return [4 /*yield*/, __await(this.modelRouter.getBestModel(preferredProvider))];
                        case 1:
                            model = _e.sent();
                            messages = [
                                new messages_1.SystemMessage(systemPrompt +
                                    (Object.keys(context).length
                                        ? "\n\nContext:\n".concat(JSON.stringify(context, null, 2))
                                        : '')),
                                new messages_1.HumanMessage(userQuery),
                            ];
                            return [4 /*yield*/, __await(model.stream(messages))];
                        case 2:
                            stream = _e.sent();
                            _e.label = 3;
                        case 3:
                            _e.trys.push([3, 10, 11, 16]);
                            _a = true, stream_1 = __asyncValues(stream);
                            _e.label = 4;
                        case 4: return [4 /*yield*/, __await(stream_1.next())];
                        case 5:
                            if (!(stream_1_1 = _e.sent(), _b = stream_1_1.done, !_b)) return [3 /*break*/, 9];
                            _d = stream_1_1.value;
                            _a = false;
                            chunk = _d;
                            text = typeof chunk.content === 'string'
                                ? chunk.content
                                : JSON.stringify(chunk.content);
                            if (!text) return [3 /*break*/, 8];
                            return [4 /*yield*/, __await(text)];
                        case 6: return [4 /*yield*/, _e.sent()];
                        case 7:
                            _e.sent();
                            _e.label = 8;
                        case 8:
                            _a = true;
                            return [3 /*break*/, 4];
                        case 9: return [3 /*break*/, 16];
                        case 10:
                            e_1_1 = _e.sent();
                            e_1 = { error: e_1_1 };
                            return [3 /*break*/, 16];
                        case 11:
                            _e.trys.push([11, , 14, 15]);
                            if (!(!_a && !_b && (_c = stream_1.return))) return [3 /*break*/, 13];
                            return [4 /*yield*/, __await(_c.call(stream_1))];
                        case 12:
                            _e.sent();
                            _e.label = 13;
                        case 13: return [3 /*break*/, 15];
                        case 14:
                            if (e_1) throw e_1.error;
                            return [7 /*endfinally*/];
                        case 15: return [7 /*endfinally*/];
                        case 16: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Returns all registered prompt templates
         */
        LlmManagerService_1.prototype.getPromptTemplates = function () {
            return __assign({}, PROMPT_TEMPLATES);
        };
        /**
         * Returns the model registry summary
         */
        LlmManagerService_1.prototype.getModelRegistry = function () {
            return this.modelRouter.getModelRegistry();
        };
        /**
         * Retrieves the raw BaseChatModel instance (for Agent Executors)
         */
        LlmManagerService_1.prototype.getModel = function (preferredProvider) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.modelRouter.getBestModel(preferredProvider)];
                });
            });
        };
        return LlmManagerService_1;
    }());
    __setFunctionName(_classThis, "LlmManagerService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        LlmManagerService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return LlmManagerService = _classThis;
}();
exports.LlmManagerService = LlmManagerService;
