"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
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
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.ModelRouterService = void 0;
// Skipping strict type checking for LLM interfaces
var common_1 = require("@nestjs/common");
var openai_1 = require("@langchain/openai");
var anthropic_1 = require("@langchain/anthropic");
var chat_models_1 = require("@langchain/core/language_models/chat_models");
var MockChatModel = /** @class */ (function (_super) {
    __extends(MockChatModel, _super);
    function MockChatModel() {
        return _super.call(this, {}) || this;
    }
    MockChatModel.prototype._llmType = function () {
        return 'mock-chat-model';
    };
    MockChatModel.prototype._call = function (messages) {
        return __awaiter(this, void 0, void 0, function () {
            var text;
            return __generator(this, function (_a) {
                text = messages
                    .map(function (m) {
                    return typeof m.content === 'string' ? m.content : JSON.stringify(m.content);
                })
                    .join(' ');
                if (text.includes('ping'))
                    return [2 /*return*/, 'pong'];
                return [2 /*return*/, "[Mock AI Response] Simulated response for testing without API keys. You said: \"".concat(text.substring(0, 50), "...\"")];
            });
        });
    };
    return MockChatModel;
}(chat_models_1.SimpleChatModel));
var ModelRouterService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var ModelRouterService = _classThis = /** @class */ (function () {
        function ModelRouterService_1(prisma) {
            this.prisma = prisma;
            this.logger = new common_1.Logger(ModelRouterService.name);
            // Ordered by priority (highest first)
            this.activeModels = [];
        }
        ModelRouterService_1.prototype.onModuleInit = function () {
            var _this = this;
            this.refreshModels().catch(function (err) { return _this.logger.error('Failed to init models', err); });
        };
        ModelRouterService_1.prototype.refreshModels = function () {
            return __awaiter(this, void 0, void 0, function () {
                var configs, _a, _i, configs_1, config, details, model, _b, ChatGoogleGenerativeAI, _c, ChatOllama, _d, pricing, error_1;
                var _this = this;
                var _e, _f, _g, _h, _j;
                return __generator(this, function (_k) {
                    switch (_k.label) {
                        case 0:
                            this.activeModels = [];
                            configs = [];
                            _k.label = 1;
                        case 1:
                            _k.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.aiModelConfig.findMany({
                                                where: { isActive: true },
                                                orderBy: { priority: 'desc' },
                                            })];
                                    });
                                }); })];
                        case 2:
                            configs = _k.sent();
                            return [3 /*break*/, 4];
                        case 3:
                            _a = _k.sent();
                            this.logger.warn('Could not load AI model configs from DB — using fallback mock model.');
                            return [3 /*break*/, 4];
                        case 4:
                            _i = 0, configs_1 = configs;
                            _k.label = 5;
                        case 5:
                            if (!(_i < configs_1.length)) return [3 /*break*/, 22];
                            config = configs_1[_i];
                            _k.label = 6;
                        case 6:
                            _k.trys.push([6, 20, , 21]);
                            details = config.config || {};
                            model = null;
                            _b = config.provider;
                            switch (_b) {
                                case 'OPENAI': return [3 /*break*/, 7];
                                case 'ANTHROPIC': return [3 /*break*/, 8];
                                case 'GEMINI': return [3 /*break*/, 9];
                                case 'OLLAMA': return [3 /*break*/, 13];
                                case 'AZURE_OPENAI': return [3 /*break*/, 17];
                            }
                            return [3 /*break*/, 18];
                        case 7:
                            model = new openai_1.ChatOpenAI({
                                modelName: config.modelName,
                                apiKey: details.apiKey || process.env.OPENAI_API_KEY,
                                temperature: (_e = details.temperature) !== null && _e !== void 0 ? _e : 0,
                                maxTokens: details.maxTokens,
                                streaming: false,
                            });
                            return [3 /*break*/, 19];
                        case 8:
                            model = new anthropic_1.ChatAnthropic({
                                modelName: config.modelName,
                                apiKey: details.apiKey || process.env.ANTHROPIC_API_KEY,
                                temperature: (_f = details.temperature) !== null && _f !== void 0 ? _f : 0,
                                maxTokens: details.maxTokens,
                            });
                            return [3 /*break*/, 19];
                        case 9:
                            _k.trys.push([9, 11, , 12]);
                            return [4 /*yield*/, Promise.resolve().then(function () { return __importStar(require('@langchain/google-genai')); })];
                        case 10:
                            ChatGoogleGenerativeAI = (_k.sent()).ChatGoogleGenerativeAI;
                            model = new ChatGoogleGenerativeAI({
                                model: config.modelName,
                                apiKey: details.apiKey || process.env.GOOGLE_AI_API_KEY,
                                temperature: (_g = details.temperature) !== null && _g !== void 0 ? _g : 0,
                                maxOutputTokens: details.maxTokens,
                            });
                            return [3 /*break*/, 12];
                        case 11:
                            _c = _k.sent();
                            this.logger.warn('Gemini provider: @langchain/google-genai not installed. Skipping.');
                            return [3 /*break*/, 12];
                        case 12: return [3 /*break*/, 19];
                        case 13:
                            _k.trys.push([13, 15, , 16]);
                            return [4 /*yield*/, Promise.resolve().then(function () { return __importStar(require('@langchain/ollama')); })];
                        case 14:
                            ChatOllama = (_k.sent()).ChatOllama;
                            model = new ChatOllama({
                                model: config.modelName,
                                baseUrl: details.baseUrl ||
                                    process.env.OLLAMA_BASE_URL ||
                                    'http://localhost:11434',
                                temperature: (_h = details.temperature) !== null && _h !== void 0 ? _h : 0,
                            });
                            return [3 /*break*/, 16];
                        case 15:
                            _d = _k.sent();
                            this.logger.warn('Ollama provider: @langchain/ollama not installed. Skipping.');
                            return [3 /*break*/, 16];
                        case 16: return [3 /*break*/, 19];
                        case 17:
                            model = new openai_1.AzureChatOpenAI({
                                azureOpenAIApiKey: details.apiKey || process.env.AZURE_OPENAI_API_KEY,
                                azureOpenAIApiInstanceName: details.instanceName ||
                                    process.env.AZURE_OPENAI_INSTANCE_NAME ||
                                    'parilink',
                                azureOpenAIApiDeploymentName: details.deploymentName || config.modelName,
                                azureOpenAIApiVersion: details.apiVersion || '2024-02-01',
                                temperature: (_j = details.temperature) !== null && _j !== void 0 ? _j : 0,
                                maxTokens: details.maxTokens,
                            });
                            return [3 /*break*/, 19];
                        case 18:
                            this.logger.warn("Unknown provider: ".concat(config.provider, ". Skipping."));
                            _k.label = 19;
                        case 19:
                            if (model) {
                                pricing = ModelRouterService.PRICING[config.modelName] ||
                                    ModelRouterService.PRICING.default;
                                this.activeModels.push({
                                    model: model,
                                    provider: config.provider,
                                    modelName: config.modelName,
                                    priority: config.priority,
                                    costPerInputToken: pricing.input,
                                    costPerOutputToken: pricing.output,
                                });
                                this.logger.log("Registered model: ".concat(config.provider, "/").concat(config.modelName, " (priority=").concat(config.priority, ")"));
                            }
                            return [3 /*break*/, 21];
                        case 20:
                            error_1 = _k.sent();
                            this.logger.error("Failed to initialize model ".concat(config.provider, ": ").concat(error_1.message));
                            return [3 /*break*/, 21];
                        case 21:
                            _i++;
                            return [3 /*break*/, 5];
                        case 22:
                            if (this.activeModels.length === 0) {
                                this.logger.warn('No active AI models found in DB or environment. Injecting Mock Chat Model fallback.');
                                this.activeModels.push({
                                    model: new MockChatModel(),
                                    provider: 'MOCK',
                                    modelName: 'mock-chat-model',
                                    priority: -1,
                                    costPerInputToken: 0,
                                    costPerOutputToken: 0,
                                });
                            }
                            this.logger.log("Active AI models: ".concat(this.activeModels.length));
                            return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Returns the highest-priority healthy model, with automatic failover.
         * If preferredProvider is given, tries that first before falling back.
         */
        ModelRouterService_1.prototype.getBestModel = function (preferredProvider) {
            return __awaiter(this, void 0, void 0, function () {
                var preferred, _i, _a, entry, healthy;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            if (this.activeModels.length === 0) {
                                this.logger.error('No active AI models configured or credentials missing');
                                throw new common_1.ServiceUnavailableException('AI platform is not configured. Please add an AI provider API key.');
                            }
                            if (preferredProvider) {
                                preferred = this.activeModels.find(function (m) { return m.provider === preferredProvider; });
                                if (preferred)
                                    return [2 /*return*/, preferred.model];
                            }
                            _i = 0, _a = this.activeModels;
                            _b.label = 1;
                        case 1:
                            if (!(_i < _a.length)) return [3 /*break*/, 4];
                            entry = _a[_i];
                            return [4 /*yield*/, this.isModelHealthy(entry)];
                        case 2:
                            healthy = _b.sent();
                            if (healthy)
                                return [2 /*return*/, entry.model];
                            this.logger.warn("Model ".concat(entry.provider, "/").concat(entry.modelName, " failed health check \u2014 trying next"));
                            _b.label = 3;
                        case 3:
                            _i++;
                            return [3 /*break*/, 1];
                        case 4: 
                        // All models unhealthy — return first anyway (last resort)
                        return [2 /*return*/, this.activeModels[0].model];
                    }
                });
            });
        };
        /**
         * Get pricing info for a given model entry (used by LlmManager for cost estimation)
         */
        ModelRouterService_1.prototype.getModelEntry = function (preferredProvider) {
            if (this.activeModels.length === 0)
                return null;
            if (preferredProvider) {
                return (this.activeModels.find(function (m) { return m.provider === preferredProvider; }) || null);
            }
            return this.activeModels[0];
        };
        /**
         * Health check: invoke with a tiny prompt to verify the model is responsive.
         * Returns true if healthy, false on error or timeout.
         */
        ModelRouterService_1.prototype.isModelHealthy = function (entry) {
            return __awaiter(this, void 0, void 0, function () {
                var HumanMessage, timeoutPromise, pingPromise, _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 3, , 4]);
                            return [4 /*yield*/, Promise.resolve().then(function () { return __importStar(require('@langchain/core/messages')); })];
                        case 1:
                            HumanMessage = (_b.sent()).HumanMessage;
                            timeoutPromise = new Promise(function (_, reject) {
                                return setTimeout(function () { return reject(new Error('Health check timeout')); }, 3000);
                            });
                            pingPromise = entry.model.invoke([new HumanMessage('ping')]);
                            return [4 /*yield*/, Promise.race([pingPromise, timeoutPromise])];
                        case 2:
                            _b.sent();
                            return [2 /*return*/, true];
                        case 3:
                            _a = _b.sent();
                            return [2 /*return*/, false];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Returns a summary of all registered models and their status
         */
        ModelRouterService_1.prototype.getModelRegistry = function () {
            return this.activeModels.map(function (m) { return ({
                provider: m.provider,
                modelName: m.modelName,
                priority: m.priority,
                costPerInputTokenUsd: m.costPerInputToken,
                costPerOutputTokenUsd: m.costPerOutputToken,
            }); });
        };
        return ModelRouterService_1;
    }());
    __setFunctionName(_classThis, "ModelRouterService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ModelRouterService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
    })();
    // Pricing table (USD per 1K tokens) — updated manually or via config
    _classThis.PRICING = {
        'gpt-4o': { input: 0.005, output: 0.015 },
        'gpt-4o-mini': { input: 0.00015, output: 0.0006 },
        'gpt-3.5-turbo': { input: 0.0005, output: 0.0015 },
        'claude-3-5-sonnet-20241022': { input: 0.003, output: 0.015 },
        'claude-3-haiku-20240307': { input: 0.00025, output: 0.00125 },
        'gemini-1.5-pro': { input: 0.00125, output: 0.005 },
        'gemini-1.5-flash': { input: 0.000075, output: 0.0003 },
        default: { input: 0.001, output: 0.002 },
    };
    (function () {
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ModelRouterService = _classThis;
}();
exports.ModelRouterService = ModelRouterService;
