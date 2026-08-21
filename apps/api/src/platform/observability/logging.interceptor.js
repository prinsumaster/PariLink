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
exports.ObservabilityInterceptor = void 0;
var common_1 = require("@nestjs/common");
var operators_1 = require("rxjs/operators");
var rxjs_1 = require("rxjs");
var uuid_1 = require("uuid");
// ---------------------------------------------------------------------------
// Observability Interceptor — Distributed Tracing + Structured Logging
//
// Every request produces:
//   1. A correlation ID (X-Correlation-Id header, propagated downstream)
//   2. A request ID (X-Request-Id — unique per HTTP hop)
//   3. Structured JSON log line with timing, status, tenant, user
//   4. PlatformMetric record for p95/p99 slow-query analysis when > 500ms
//   5. Error tracking for 5xx responses (without stack trace in response body)
//
// Trace Context format:
//   {
//     requestId: "uuid",
//     correlationId: "uuid",        // spans multiple services
//     tenantId: "company-id",
//     userId: "user-id",
//     method: "GET",
//     path: "/api/v1/trips",
//     statusCode: 200,
//     durationMs: 45,
//     timestamp: "2026-01-01T00:00:00.000Z"
//   }
// ---------------------------------------------------------------------------
var SLOW_THRESHOLD_MS = 500; // Record metric above this
var ALERT_THRESHOLD_MS = 3000; // Warn above this
var ObservabilityInterceptor = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var ObservabilityInterceptor = _classThis = /** @class */ (function () {
        function ObservabilityInterceptor_1(prisma) {
            this.prisma = prisma;
            this.logger = new common_1.Logger('HTTP');
        }
        ObservabilityInterceptor_1.prototype.intercept = function (context, next) {
            var _this = this;
            var _a, _b, _c, _d;
            var ctx = context.switchToHttp();
            var req = ctx.getRequest();
            var res = ctx.getResponse();
            // Correlation ID — propagated from upstream (e.g., API Gateway, frontend)
            var correlationId = req.headers['x-correlation-id'] || (0, uuid_1.v4)();
            // Request ID — unique per hop
            var requestId = (0, uuid_1.v4)();
            req['correlationId'] = correlationId;
            req['requestId'] = requestId;
            res.setHeader('X-Correlation-Id', correlationId);
            res.setHeader('X-Request-Id', requestId);
            var startMs = Date.now();
            var method = req.method, url = req.url;
            var tenantId = (_b = (_a = req.user) === null || _a === void 0 ? void 0 : _a.companyId) !== null && _b !== void 0 ? _b : 'anon';
            var userId = (_d = (_c = req.user) === null || _c === void 0 ? void 0 : _c.id) !== null && _d !== void 0 ? _d : 'anon';
            return next.handle().pipe((0, operators_1.tap)(function () {
                var _a, _b, _c, _d;
                var durationMs = Date.now() - startMs;
                var statusCode = res.statusCode;
                _this.emitStructuredLog({
                    requestId: requestId,
                    correlationId: correlationId,
                    tenantId: tenantId,
                    userId: userId,
                    method: method,
                    path: (_b = (_a = req.route) === null || _a === void 0 ? void 0 : _a.path) !== null && _b !== void 0 ? _b : url,
                    statusCode: statusCode,
                    durationMs: durationMs,
                });
                if (durationMs >= SLOW_THRESHOLD_MS) {
                    _this.recordSlowRequest(tenantId, method, (_d = (_c = req.route) === null || _c === void 0 ? void 0 : _c.path) !== null && _d !== void 0 ? _d : url, durationMs, correlationId);
                }
            }), (0, operators_1.catchError)(function (error) {
                var _a, _b, _c;
                var durationMs = Date.now() - startMs;
                _this.emitStructuredLog({
                    requestId: requestId,
                    correlationId: correlationId,
                    tenantId: tenantId,
                    userId: userId,
                    method: method,
                    path: (_b = (_a = req.route) === null || _a === void 0 ? void 0 : _a.path) !== null && _b !== void 0 ? _b : url,
                    statusCode: (_c = error.status) !== null && _c !== void 0 ? _c : 500,
                    durationMs: durationMs,
                    error: error.message,
                });
                return (0, rxjs_1.throwError)(function () { return error; });
            }));
        };
        ObservabilityInterceptor_1.prototype.emitStructuredLog = function (fields) {
            var level = fields.statusCode >= 500
                ? 'error'
                : fields.statusCode >= 400
                    ? 'warn'
                    : 'log';
            var msg = "".concat(fields.method, " ").concat(fields.path, " ").concat(fields.statusCode, " ").concat(fields.durationMs, "ms");
            if (fields.durationMs >= ALERT_THRESHOLD_MS) {
                this.logger.warn("[SLOW] ".concat(msg, " [cid=").concat(fields.correlationId, "] [tenant=").concat(fields.tenantId, "]"));
            }
            else {
                this.logger[level]("".concat(msg, " [cid=").concat(fields.correlationId, "] [tenant=").concat(fields.tenantId, "]"));
            }
        };
        ObservabilityInterceptor_1.prototype.recordSlowRequest = function (companyId, method, path, durationMs, correlationId) {
            var _this = this;
            if (companyId === 'anon')
                return;
            // Fire-and-forget — never blocks the response
            this.prisma
                .runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, tx.platformMetric.create({
                            data: {
                                companyId: companyId,
                                category: 'API_LATENCY',
                                metricName: "".concat(method, "_").concat(path).replace(/[/:]/g, '_').slice(0, 100),
                                metricValue: durationMs,
                                dimensions: { correlationId: correlationId, threshold: SLOW_THRESHOLD_MS },
                            },
                        })];
                });
            }); })
                .catch(function () { }); // Silently ignore — observability must never break business logic
        };
        return ObservabilityInterceptor_1;
    }());
    __setFunctionName(_classThis, "ObservabilityInterceptor");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ObservabilityInterceptor = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ObservabilityInterceptor = _classThis;
}();
exports.ObservabilityInterceptor = ObservabilityInterceptor;
