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
exports.CircuitBreakerService = void 0;
var common_1 = require("@nestjs/common");
var DEFAULT_OPTIONS = {
    failureThreshold: 5,
    resetTimeoutMs: 30000,
    maxConcurrent: 10,
    retryCount: 3,
    retryBaseDelayMs: 200,
};
var CircuitBreakerService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var CircuitBreakerService = _classThis = /** @class */ (function () {
        function CircuitBreakerService_1() {
            this.logger = new common_1.Logger(CircuitBreakerService.name);
            this.states = new Map();
            this.options = new Map();
        }
        /** Configure a named circuit (call once at module init or on first use). */
        CircuitBreakerService_1.prototype.configure = function (name, opts) {
            this.options.set(name, __assign(__assign({}, DEFAULT_OPTIONS), opts));
        };
        /**
         * Execute `action` inside a circuit breaker + retry wrapper.
         * @param name    Unique identifier for this integration (e.g., 'LOCONAV', 'QUICKBOOKS')
         * @param action  The async operation to execute
         * @param opts    Per-call overrides (optional)
         */
        CircuitBreakerService_1.prototype.execute = function (name, action, opts) {
            return __awaiter(this, void 0, void 0, function () {
                var cfg, state, now, result, error_1;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            cfg = __assign(__assign(__assign({}, DEFAULT_OPTIONS), ((_a = this.options.get(name)) !== null && _a !== void 0 ? _a : {})), (opts !== null && opts !== void 0 ? opts : {}));
                            state = this.getState(name);
                            // Bulkhead check
                            if (state.concurrentCalls >= cfg.maxConcurrent) {
                                throw new common_1.ServiceUnavailableException("[Bulkhead] Integration \"".concat(name, "\" at max concurrency (").concat(cfg.maxConcurrent, ")"));
                            }
                            now = Date.now();
                            if (state.status === 'OPEN') {
                                if (now - state.lastFailureAt < cfg.resetTimeoutMs) {
                                    throw new common_1.ServiceUnavailableException("[CircuitBreaker] \"".concat(name, "\" is OPEN \u2014 pausing calls"));
                                }
                                // Transition to HALF_OPEN for probe
                                state.status = 'HALF_OPEN';
                                state.lastProbeAt = now;
                                this.logger.log("[CircuitBreaker] \"".concat(name, "\" entering HALF_OPEN (probe)"));
                            }
                            state.concurrentCalls++;
                            _b.label = 1;
                        case 1:
                            _b.trys.push([1, 3, 4, 5]);
                            return [4 /*yield*/, this.withRetry(name, action, cfg)];
                        case 2:
                            result = _b.sent();
                            this.onSuccess(name, state);
                            return [2 /*return*/, result];
                        case 3:
                            error_1 = _b.sent();
                            this.onFailure(name, state, cfg);
                            throw error_1;
                        case 4:
                            state.concurrentCalls = Math.max(0, state.concurrentCalls - 1);
                            return [7 /*endfinally*/];
                        case 5: return [2 /*return*/];
                    }
                });
            });
        };
        CircuitBreakerService_1.prototype.getStatus = function (name) {
            var s = this.states.get(name);
            return s
                ? {
                    status: s.status,
                    failures: s.failures,
                    concurrent: s.concurrentCalls,
                }
                : { status: 'CLOSED', failures: 0, concurrent: 0 };
        };
        // ─────────────────────────────────────────────────────────────────────────
        CircuitBreakerService_1.prototype.withRetry = function (name, action, cfg) {
            return __awaiter(this, void 0, void 0, function () {
                var lastError, attempt, err_1, delay, jitter;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            attempt = 0;
                            _a.label = 1;
                        case 1:
                            if (!(attempt <= cfg.retryCount)) return [3 /*break*/, 8];
                            _a.label = 2;
                        case 2:
                            _a.trys.push([2, 4, , 7]);
                            return [4 /*yield*/, action()];
                        case 3: return [2 /*return*/, _a.sent()];
                        case 4:
                            err_1 = _a.sent();
                            lastError = err_1;
                            // Don't retry client errors (4xx)
                            if ((err_1 === null || err_1 === void 0 ? void 0 : err_1.status) >= 400 && (err_1 === null || err_1 === void 0 ? void 0 : err_1.status) < 500)
                                throw err_1;
                            if (!(attempt < cfg.retryCount)) return [3 /*break*/, 6];
                            delay = cfg.retryBaseDelayMs * Math.pow(2, attempt);
                            jitter = delay * (0.8 + Math.random() * 0.4);
                            this.logger.warn("[Retry] \"".concat(name, "\" attempt ").concat(attempt + 1, "/").concat(cfg.retryCount, " failed \u2014 retrying in ").concat(Math.round(jitter), "ms"));
                            return [4 /*yield*/, this.sleep(jitter)];
                        case 5:
                            _a.sent();
                            _a.label = 6;
                        case 6: return [3 /*break*/, 7];
                        case 7:
                            attempt++;
                            return [3 /*break*/, 1];
                        case 8: throw lastError;
                    }
                });
            });
        };
        CircuitBreakerService_1.prototype.onSuccess = function (name, state) {
            if (state.status !== 'CLOSED') {
                this.logger.log("[CircuitBreaker] \"".concat(name, "\" CLOSED (recovered)"));
            }
            state.status = 'CLOSED';
            state.failures = 0;
        };
        CircuitBreakerService_1.prototype.onFailure = function (name, state, cfg) {
            state.failures++;
            state.lastFailureAt = Date.now();
            if (state.status === 'HALF_OPEN') {
                state.status = 'OPEN';
                this.logger.error("[CircuitBreaker] \"".concat(name, "\" probe failed \u2014 returning to OPEN"));
                return;
            }
            if (state.failures >= cfg.failureThreshold) {
                state.status = 'OPEN';
                this.logger.error("[CircuitBreaker] \"".concat(name, "\" TRIPPED (OPEN) after ").concat(state.failures, " failures"));
            }
        };
        CircuitBreakerService_1.prototype.getState = function (name) {
            if (!this.states.has(name)) {
                this.states.set(name, {
                    status: 'CLOSED',
                    failures: 0,
                    lastFailureAt: 0,
                    concurrentCalls: 0,
                });
            }
            return this.states.get(name);
        };
        CircuitBreakerService_1.prototype.sleep = function (ms) {
            return new Promise(function (resolve) { return setTimeout(resolve, ms); });
        };
        return CircuitBreakerService_1;
    }());
    __setFunctionName(_classThis, "CircuitBreakerService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        CircuitBreakerService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return CircuitBreakerService = _classThis;
}();
exports.CircuitBreakerService = CircuitBreakerService;
