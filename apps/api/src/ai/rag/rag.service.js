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
exports.EnterpriseRagService = void 0;
var common_1 = require("@nestjs/common");
var openai_1 = require("@langchain/openai");
var EnterpriseRagService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var EnterpriseRagService = _classThis = /** @class */ (function () {
        function EnterpriseRagService_1(prisma) {
            this.prisma = prisma;
            this.logger = new common_1.Logger(EnterpriseRagService.name);
        }
        Object.defineProperty(EnterpriseRagService_1.prototype, "embeddings", {
            get: function () {
                if (!this._embeddings) {
                    this._embeddings = new openai_1.OpenAIEmbeddings({
                        apiKey: process.env.OPENAI_API_KEY || 'dummy-key-to-allow-boot',
                        modelName: 'text-embedding-3-small',
                    });
                }
                return this._embeddings;
            },
            enumerable: false,
            configurable: true
        });
        EnterpriseRagService_1.prototype.getEmbedding = function (text) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    if (!process.env.OPENAI_API_KEY) {
                        throw new common_1.ServiceUnavailableException('OpenAI API Key is required for RAG context retrieval.');
                    }
                    return [2 /*return*/, this.embeddings.embedQuery(text)];
                });
            });
        };
        EnterpriseRagService_1.prototype.cosineSimilarity = function (a, b) {
            var dotProduct = 0;
            var normA = 0;
            var normB = 0;
            for (var i = 0; i < a.length; i++) {
                dotProduct += a[i] * b[i];
                normA += a[i] * a[i];
                normB += b[i] * b[i];
            }
            if (normA === 0 || normB === 0)
                return 0;
            return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
        };
        /**
         * BM25-style keyword scoring (simple term frequency approach)
         */
        EnterpriseRagService_1.prototype.keywordScore = function (query, text) {
            var queryTerms = query.toLowerCase().split(/\s+/).filter(Boolean);
            var textLower = text.toLowerCase();
            var score = 0;
            for (var _i = 0, queryTerms_1 = queryTerms; _i < queryTerms_1.length; _i++) {
                var term = queryTerms_1[_i];
                var occurrences = (textLower.match(new RegExp(term, 'g')) || []).length;
                // Normalized TF
                score += occurrences / (occurrences + 1.5);
            }
            return score / Math.max(queryTerms.length, 1);
        };
        /**
         * Tenant-isolated, permission-aware hybrid search (semantic + keyword).
         * Returns context string + citations for the calling agent/copilot.
         */
        EnterpriseRagService_1.prototype.retrieveContext = function (query_1) {
            return __awaiter(this, arguments, void 0, function (query, options) {
                var companyId, _a, limit, _b, permissionTags, _c, semanticWeight, queryVector, whereClause, chunks, _d, keywordWeight, scoredChunks, citations, contextParts;
                var _this = this;
                if (options === void 0) { options = {}; }
                return __generator(this, function (_e) {
                    switch (_e.label) {
                        case 0:
                            companyId = options.companyId, _a = options.limit, limit = _a === void 0 ? 5 : _a, _b = options.permissionTags, permissionTags = _b === void 0 ? [] : _b, _c = options.semanticWeight, semanticWeight = _c === void 0 ? 0.7 : _c;
                            this.logger.log("RAG retrieval \u2014 query: \"".concat(query.substring(0, 80), "\", company: ").concat(companyId || 'global'));
                            return [4 /*yield*/, this.getEmbedding(query)];
                        case 1:
                            queryVector = _e.sent();
                            whereClause = {};
                            if (companyId) {
                                whereClause.document = { companyId: companyId };
                            }
                            if (permissionTags.length > 0) {
                                // Only return chunks whose document does NOT have restricted tags
                                // that the caller doesn't possess
                                whereClause.document = __assign(__assign({}, whereClause.document), { 
                                    // permissionTag must be in caller's permissionTags OR be null/empty
                                    OR: [
                                        { permissionTag: null },
                                        { permissionTag: '' },
                                        { permissionTag: { in: permissionTags } },
                                    ] });
                            }
                            chunks = [];
                            _e.label = 2;
                        case 2:
                            _e.trys.push([2, 4, , 5]);
                            return [4 /*yield*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.knowledgeChunk.findMany({
                                                where: whereClause,
                                                include: { document: true },
                                                take: 200, // Fetch candidates, rank in memory
                                            })];
                                    });
                                }); })];
                        case 3:
                            chunks = _e.sent();
                            return [3 /*break*/, 5];
                        case 4:
                            _d = _e.sent();
                            this.logger.warn('KnowledgeChunk table not available — returning empty context');
                            return [2 /*return*/, {
                                    context: '[System: No knowledge base configured yet.]',
                                    citations: [],
                                }];
                        case 5:
                            if (chunks.length === 0) {
                                return [2 /*return*/, {
                                        context: "[System: No documents found in the knowledge base".concat(companyId ? ' for this organization' : '', ".]"),
                                        citations: [],
                                    }];
                            }
                            keywordWeight = 1 - semanticWeight;
                            scoredChunks = chunks
                                .map(function (chunk) {
                                var semantic = _this.cosineSimilarity(queryVector, chunk.embedding);
                                var keyword = _this.keywordScore(query, chunk.content);
                                var hybridScore = semantic * semanticWeight + keyword * keywordWeight;
                                return { chunk: chunk, score: hybridScore };
                            })
                                .sort(function (a, b) { return b.score - a.score; })
                                .slice(0, limit);
                            citations = scoredChunks.map(function (_a, idx) {
                                var _b, _c;
                                var chunk = _a.chunk, score = _a.score;
                                return ({
                                    documentId: chunk.documentId,
                                    documentTitle: ((_b = chunk.document) === null || _b === void 0 ? void 0 : _b.title) || 'Unknown Document',
                                    chunkIndex: (_c = chunk.chunkIndex) !== null && _c !== void 0 ? _c : idx,
                                    relevanceScore: Math.round(score * 1000) / 1000,
                                    snippet: chunk.content.substring(0, 150) +
                                        (chunk.content.length > 150 ? '...' : ''),
                                });
                            });
                            contextParts = scoredChunks.map(function (_a) {
                                var _b;
                                var chunk = _a.chunk, score = _a.score;
                                return "[Source: \"".concat(((_b = chunk.document) === null || _b === void 0 ? void 0 : _b.title) || 'Unknown', "\" | Relevance: ").concat((score * 100).toFixed(1), "%]\n").concat(chunk.content);
                            });
                            return [2 /*return*/, {
                                    context: contextParts.join('\n\n---\n\n'),
                                    citations: citations,
                                }];
                    }
                });
            });
        };
        /**
         * Legacy compatibility shim — returns just the context string
         */
        EnterpriseRagService_1.prototype.retrieveContextLegacy = function (query_1) {
            return __awaiter(this, arguments, void 0, function (query, limit) {
                var result;
                if (limit === void 0) { limit = 3; }
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.retrieveContext(query, { limit: limit })];
                        case 1:
                            result = _a.sent();
                            return [2 /*return*/, result.context];
                    }
                });
            });
        };
        return EnterpriseRagService_1;
    }());
    __setFunctionName(_classThis, "EnterpriseRagService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        EnterpriseRagService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return EnterpriseRagService = _classThis;
}();
exports.EnterpriseRagService = EnterpriseRagService;
