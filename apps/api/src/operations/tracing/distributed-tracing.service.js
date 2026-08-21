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
exports.DistributedTracingService = void 0;
var common_1 = require("@nestjs/common");
var crypto = __importStar(require("crypto"));
var DistributedTracingService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var DistributedTracingService = _classThis = /** @class */ (function () {
        function DistributedTracingService_1(prisma, eventEmitter) {
            this.prisma = prisma;
            this.eventEmitter = eventEmitter;
            this.logger = new common_1.Logger(DistributedTracingService.name);
        }
        /**
         * Generates a new W3C / OpenTelemetry compatible Correlation ID or Trace ID.
         */
        DistributedTracingService_1.prototype.generateCorrelationId = function () {
            return "trace-".concat(crypto.randomUUID());
        };
        /**
         * Starts and completes a trace span around an asynchronous operation.
         */
        DistributedTracingService_1.prototype.traceOperation = function (options, operation) {
            return __awaiter(this, void 0, void 0, function () {
                var traceId, spanId, startTime, status, errorTag, result, err_1, endTime, durationMs, tags;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            traceId = options.traceId || this.generateCorrelationId();
                            spanId = "span-".concat(crypto.randomUUID().slice(0, 13));
                            startTime = new Date();
                            status = 'OK';
                            errorTag = {};
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, 4, 6]);
                            return [4 /*yield*/, operation(spanId, traceId)];
                        case 2:
                            result = _a.sent();
                            return [2 /*return*/, result];
                        case 3:
                            err_1 = _a.sent();
                            status = 'ERROR';
                            errorTag = {
                                error: true,
                                errorMessage: err_1 instanceof Error ? err_1.message : String(err_1),
                                errorStack: err_1 instanceof Error ? err_1.stack : undefined,
                            };
                            throw err_1;
                        case 4:
                            endTime = new Date();
                            durationMs = endTime.getTime() - startTime.getTime();
                            tags = __assign(__assign({}, options.tags), errorTag);
                            return [4 /*yield*/, this.recordSpan({
                                    traceId: traceId,
                                    spanId: spanId,
                                    parentSpanId: options.parentSpanId || null,
                                    companyId: options.companyId || null,
                                    serviceName: options.serviceName,
                                    operationName: options.operationName,
                                    startTime: startTime,
                                    endTime: endTime,
                                    durationMs: durationMs,
                                    status: status,
                                    tags: tags,
                                    events: [],
                                })];
                        case 5:
                            _a.sent();
                            return [7 /*endfinally*/];
                        case 6: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Directly records a trace span in the persistence database.
         */
        DistributedTracingService_1.prototype.recordSpan = function (data) {
            return __awaiter(this, void 0, void 0, function () {
                var span, e_1;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.traceSpan.create({
                                                data: {
                                                    traceId: data.traceId,
                                                    spanId: data.spanId,
                                                    parentSpanId: data.parentSpanId || null,
                                                    companyId: data.companyId || null,
                                                    serviceName: data.serviceName,
                                                    operationName: data.operationName,
                                                    startTime: data.startTime,
                                                    endTime: data.endTime,
                                                    durationMs: data.durationMs,
                                                    status: data.status,
                                                    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
                                                    tags: data.tags,
                                                    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
                                                    events: data.events,
                                                },
                                            })];
                                    });
                                }); })];
                        case 1:
                            span = _a.sent();
                            this.eventEmitter.emit('Operations.TraceSpan.Recorded', {
                                traceId: data.traceId,
                                spanId: data.spanId,
                                serviceName: data.serviceName,
                                status: data.status,
                            });
                            return [2 /*return*/, span];
                        case 2:
                            e_1 = _a.sent();
                            this.logger.warn("Failed to persist trace span: ".concat(e_1 instanceof Error ? e_1.message : String(e_1)));
                            return [2 /*return*/, null];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Helper methods for Request, Queue, Workflow, Webhook, Database, and External API Tracing.
         */
        DistributedTracingService_1.prototype.traceRequest = function (traceId, method, url, cb) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.traceOperation({
                            traceId: traceId,
                            serviceName: 'http-gateway',
                            operationName: "".concat(method, " ").concat(url),
                            tags: { kind: 'HTTP_REQUEST' },
                        }, function () { return cb(); })];
                });
            });
        };
        DistributedTracingService_1.prototype.traceQueue = function (traceId, queueName, jobName, cb) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.traceOperation({
                            traceId: traceId,
                            serviceName: 'bullmq-worker',
                            operationName: "".concat(queueName, ".").concat(jobName),
                            tags: { kind: 'QUEUE_JOB' },
                        }, function () { return cb(); })];
                });
            });
        };
        DistributedTracingService_1.prototype.traceWorkflow = function (traceId, workflowId, ruleName, cb) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.traceOperation({
                            traceId: traceId,
                            serviceName: 'workflow-engine',
                            operationName: "execute_workflow_".concat(ruleName),
                            tags: { kind: 'WORKFLOW', workflowId: workflowId },
                        }, function () { return cb(); })];
                });
            });
        };
        DistributedTracingService_1.prototype.traceWebhook = function (traceId, targetUrl, cb) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.traceOperation({
                            traceId: traceId,
                            serviceName: 'webhook-dispatcher',
                            operationName: "POST ".concat(targetUrl),
                            tags: { kind: 'WEBHOOK_DELIVERY' },
                        }, function () { return cb(); })];
                });
            });
        };
        DistributedTracingService_1.prototype.traceDbQuery = function (traceId, model, action, cb) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.traceOperation({
                            traceId: traceId,
                            serviceName: 'prisma-client',
                            operationName: "".concat(model, ".").concat(action),
                            tags: { kind: 'DB_QUERY' },
                        }, function () { return cb(); })];
                });
            });
        };
        DistributedTracingService_1.prototype.traceExternalApi = function (traceId, provider, endpoint, cb) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.traceOperation({
                            traceId: traceId,
                            serviceName: "connector-".concat(provider),
                            operationName: endpoint,
                            tags: { kind: 'EXTERNAL_API', provider: provider },
                        }, function () { return cb(); })];
                });
            });
        };
        /**
         * Trace Explorer: Retrieves a full trace tree by Trace ID, organizing parent-child span hierarchy.
         */
        DistributedTracingService_1.prototype.getTraceTree = function (traceId) {
            return __awaiter(this, void 0, void 0, function () {
                var spans, map, servicesSet, errorCount, _i, spans_1, s, rootSpan, _a, _b, node, parent_1, firstStart, lastEnd, totalDurationMs;
                var _this = this;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0: return [4 /*yield*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    return [2 /*return*/, tx.traceSpan.findMany({
                                            where: { traceId: traceId },
                                            orderBy: { startTime: 'asc' },
                                        })];
                                });
                            }); })];
                        case 1:
                            spans = _c.sent();
                            if (spans.length === 0) {
                                return [2 /*return*/, {
                                        traceId: traceId,
                                        totalDurationMs: 0,
                                        rootSpan: null,
                                        spansCount: 0,
                                        errorCount: 0,
                                        servicesInvolved: [],
                                    }];
                            }
                            map = new Map();
                            servicesSet = new Set();
                            errorCount = 0;
                            for (_i = 0, spans_1 = spans; _i < spans_1.length; _i++) {
                                s = spans_1[_i];
                                servicesSet.add(s.serviceName);
                                if (s.status === 'ERROR')
                                    errorCount++;
                                map.set(s.spanId, {
                                    id: s.id,
                                    traceId: s.traceId,
                                    spanId: s.spanId,
                                    parentSpanId: s.parentSpanId,
                                    companyId: s.companyId,
                                    serviceName: s.serviceName,
                                    operationName: s.operationName,
                                    startTime: s.startTime.toISOString(),
                                    endTime: s.endTime.toISOString(),
                                    durationMs: s.durationMs,
                                    status: s.status,
                                    tags: s.tags || {},
                                    events: s.events || [],
                                    children: [],
                                });
                            }
                            rootSpan = null;
                            for (_a = 0, _b = map.values(); _a < _b.length; _a++) {
                                node = _b[_a];
                                if (!node.parentSpanId || !map.has(node.parentSpanId)) {
                                    if (!rootSpan)
                                        rootSpan = node;
                                }
                                else {
                                    parent_1 = map.get(node.parentSpanId);
                                    parent_1 === null || parent_1 === void 0 ? void 0 : parent_1.children.push(node);
                                }
                            }
                            firstStart = Math.min.apply(Math, spans.map(function (s) { return s.startTime.getTime(); }));
                            lastEnd = Math.max.apply(Math, spans.map(function (s) { return s.endTime.getTime(); }));
                            totalDurationMs = lastEnd - firstStart;
                            return [2 /*return*/, {
                                    traceId: traceId,
                                    totalDurationMs: totalDurationMs,
                                    rootSpan: rootSpan || map.values().next().value || null,
                                    spansCount: spans.length,
                                    errorCount: errorCount,
                                    servicesInvolved: Array.from(servicesSet),
                                }];
                    }
                });
            });
        };
        /**
         * Searches recent traces by service, operation, status, or latency duration threshold.
         */
        DistributedTracingService_1.prototype.searchTraces = function (filter) {
            return __awaiter(this, void 0, void 0, function () {
                var where, spans;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            where = {};
                            if (filter.companyId)
                                where.companyId = filter.companyId;
                            if (filter.traceId)
                                where.traceId = filter.traceId;
                            if (filter.serviceName)
                                where.serviceName = filter.serviceName;
                            if (filter.operationName)
                                where.operationName = {
                                    contains: filter.operationName,
                                    mode: 'insensitive',
                                };
                            if (filter.status)
                                where.status = filter.status;
                            if (filter.hasError) {
                                // Typically modeled via tags, skipping exact tag query here for brevity
                            }
                            if (filter.startTime || filter.endTime) {
                                where.startTime = {};
                                if (filter.startTime)
                                    where.startTime.gte = filter.startTime;
                                if (filter.endTime)
                                    where.startTime.lte = filter.endTime;
                            }
                            if (filter.minDurationMs)
                                where.durationMs = { gte: filter.minDurationMs };
                            return [4 /*yield*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.traceSpan.findMany({
                                                where: where,
                                                orderBy: { startTime: 'desc' },
                                                take: filter.limit || 100,
                                            })];
                                    });
                                }); })];
                        case 1:
                            spans = _a.sent();
                            return [2 /*return*/, spans.map(function (s) { return ({
                                    id: s.id,
                                    traceId: s.traceId,
                                    spanId: s.spanId,
                                    parentSpanId: s.parentSpanId,
                                    companyId: s.companyId,
                                    serviceName: s.serviceName,
                                    operationName: s.operationName,
                                    startTime: s.startTime.toISOString(),
                                    endTime: s.endTime.toISOString(),
                                    durationMs: s.durationMs,
                                    status: s.status,
                                    tags: s.tags || {},
                                    events: s.events || [],
                                }); })];
                    }
                });
            });
        };
        return DistributedTracingService_1;
    }());
    __setFunctionName(_classThis, "DistributedTracingService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        DistributedTracingService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return DistributedTracingService = _classThis;
}();
exports.DistributedTracingService = DistributedTracingService;
