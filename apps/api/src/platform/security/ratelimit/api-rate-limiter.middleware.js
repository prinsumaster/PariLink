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
exports.ApiRateLimiterMiddleware = void 0;
var common_1 = require("@nestjs/common");
// ---------------------------------------------------------------------------
// API Gateway Rate Limiter — Enterprise (Redis-backed)
//
// Limits enforced (in order, highest priority first):
//   1. IP Block List — hard reject
//   2. Idempotency Key replay detection (TTL: 24h)
//   3. Burst Protection — max requests per second
//   4. Per-Tenant Quota — max requests per minute
// ---------------------------------------------------------------------------
// IP addresses that are blocked globally (loaded from env or DB at startup)
var BLOCKED_IPS = new Set((process.env.BLOCKED_IPS || '').split(',').filter(Boolean));
var ApiRateLimiterMiddleware = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var ApiRateLimiterMiddleware = _classThis = /** @class */ (function () {
        function ApiRateLimiterMiddleware_1(audit, redisManager) {
            this.audit = audit;
            this.redisManager = redisManager;
            this.logger = new common_1.Logger(ApiRateLimiterMiddleware.name);
            // Defaults — overridden per-tenant by TenantConfig.apiRateLimit
            this.DEFAULT_RPM = 1000; // requests per minute
            this.BURST_RPS = 20; // requests per second burst cap
            this.WINDOW_S = 60; // 1 minute
            this.BURST_WINDOW_S = 1; // 1 second
            this.redis = null;
            this.useRedis = false;
            // Memory fallbacks for dev environments without Redis
            this.fallbackMinuteBuckets = new Map();
            this.fallbackBurstBuckets = new Map();
            this.fallbackIdempotencyStore = new Map();
            this.redis = this.redisManager.getClient();
            this.useRedis = true; // Handled by RedisManager
        }
        ApiRateLimiterMiddleware_1.prototype.onModuleDestroy = function () {
            // Rely on RedisManagerService to close the pool
        };
        ApiRateLimiterMiddleware_1.prototype.use = function (req, res, next) {
            return __awaiter(this, void 0, void 0, function () {
                var ip, tenantId, idempotencyKey, replayKey, isReplay, rpmLimit, burstRps, path, category, burstKey, burstAllowed, minuteKey, minuteLimit, retryAfter;
                var _a, _b, _c;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            ip = this.extractIp(req);
                            tenantId = (_c = (_b = (_a = req.user) === null || _a === void 0 ? void 0 : _a.companyId) !== null && _b !== void 0 ? _b : req.headers['x-tenant-id']) !== null && _c !== void 0 ? _c : 'anonymous';
                            idempotencyKey = req.headers['x-idempotency-key'];
                            // 1. IP Block List
                            if (BLOCKED_IPS.has(ip)) {
                                this.logger.warn("[Gateway] Blocked IP attempted access: ".concat(ip));
                                res.status(common_1.HttpStatus.FORBIDDEN).json({ message: 'Access denied' });
                                return [2 /*return*/];
                            }
                            if (!(idempotencyKey && ['POST', 'PUT', 'PATCH'].includes(req.method))) return [3 /*break*/, 2];
                            replayKey = "idem:".concat(tenantId, ":").concat(idempotencyKey);
                            return [4 /*yield*/, this.checkIdempotency(replayKey)];
                        case 1:
                            isReplay = _d.sent();
                            if (isReplay) {
                                res.status(common_1.HttpStatus.CONFLICT).json({
                                    message: 'Duplicate request detected (idempotency key already used)',
                                    idempotencyKey: idempotencyKey,
                                });
                                return [2 /*return*/];
                            }
                            _d.label = 2;
                        case 2:
                            rpmLimit = this.getTenantLimit(req);
                            burstRps = this.BURST_RPS;
                            path = req.originalUrl || req.url;
                            category = 'general';
                            if (path.includes('/api/v1/auth')) {
                                rpmLimit = 500;
                                burstRps = 100;
                                category = 'auth';
                            }
                            else if (path.includes('/api/v1/webhooks')) {
                                rpmLimit = 50;
                                burstRps = 5;
                                category = 'webhooks';
                            }
                            else if (path.includes('/api/v1/ai')) {
                                rpmLimit = 200;
                                burstRps = 30;
                                category = 'ai';
                            }
                            else {
                                // General limits for all other routes
                                rpmLimit = 3000;
                                burstRps = 500;
                            }
                            burstKey = "burst:".concat(category, ":").concat(tenantId, ":").concat(ip);
                            return [4 /*yield*/, this.checkLimit(burstKey, burstRps, this.BURST_WINDOW_S, this.fallbackBurstBuckets)];
                        case 3:
                            burstAllowed = _d.sent();
                            if (!burstAllowed.allowed) {
                                res.setHeader('Retry-After', '1');
                                res.status(common_1.HttpStatus.TOO_MANY_REQUESTS).json({
                                    message: 'Burst limit exceeded. Please reduce request rate.',
                                });
                                return [2 /*return*/];
                            }
                            minuteKey = "rpm:".concat(category, ":").concat(tenantId, ":").concat(ip);
                            return [4 /*yield*/, this.checkLimit(minuteKey, rpmLimit, this.WINDOW_S, this.fallbackMinuteBuckets)];
                        case 4:
                            minuteLimit = _d.sent();
                            res.setHeader('X-RateLimit-Limit', rpmLimit);
                            res.setHeader('X-RateLimit-Remaining', Math.max(0, minuteLimit.remaining));
                            res.setHeader('X-RateLimit-Reset', Math.floor(minuteLimit.resetAt / 1000));
                            if (!minuteLimit.allowed) {
                                retryAfter = Math.ceil((minuteLimit.resetAt - Date.now()) / 1000);
                                res.setHeader('Retry-After', retryAfter);
                                this.audit
                                    .logEvent({
                                    action: 'RATE_LIMIT_EXCEEDED',
                                    entity: 'ApiGateway',
                                    entityId: tenantId,
                                    companyId: tenantId === 'anonymous' || tenantId === 'system'
                                        ? 'SYSTEM'
                                        : tenantId,
                                    source: 'API_GATEWAY',
                                    details: { ip: ip, path: req.url, limit: rpmLimit },
                                })
                                    .catch(function () { });
                                res.status(common_1.HttpStatus.TOO_MANY_REQUESTS).json({
                                    message: 'Rate limit exceeded. Please wait before retrying.',
                                    retryAfter: retryAfter,
                                });
                                return [2 /*return*/];
                            }
                            next();
                            return [2 /*return*/];
                    }
                });
            });
        };
        ApiRateLimiterMiddleware_1.prototype.getTenantLimit = function (req) {
            var headerLimit = req.headers['x-rate-limit-override'];
            if (headerLimit && !isNaN(Number(headerLimit)))
                return Number(headerLimit);
            return this.DEFAULT_RPM;
        };
        ApiRateLimiterMiddleware_1.prototype.checkIdempotency = function (key) {
            return __awaiter(this, void 0, void 0, function () {
                var result, TTL_24H;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!(this.useRedis && this.redis)) return [3 /*break*/, 2];
                            return [4 /*yield*/, this.redis.set(key, '1', 'EX', 86400, 'NX')];
                        case 1:
                            result = _a.sent();
                            return [2 /*return*/, result !== 'OK'];
                        case 2:
                            TTL_24H = Date.now() + 86400000;
                            if (this.fallbackIdempotencyStore.has(key)) {
                                if (this.fallbackIdempotencyStore.get(key) > Date.now()) {
                                    return [2 /*return*/, true];
                                }
                            }
                            this.fallbackIdempotencyStore.set(key, TTL_24H);
                            return [2 /*return*/, false];
                    }
                });
            });
        };
        ApiRateLimiterMiddleware_1.prototype.checkLimit = function (key, limit, windowSeconds, fallbackMap) {
            return __awaiter(this, void 0, void 0, function () {
                var current, multi, results, count, ttl, now, bucket, remaining, resetAt;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!(this.useRedis && this.redis)) return [3 /*break*/, 4];
                            current = Date.now();
                            multi = this.redis.multi();
                            multi.incr(key);
                            multi.pttl(key);
                            return [4 /*yield*/, multi.exec()];
                        case 1:
                            results = _a.sent();
                            if (!results)
                                return [2 /*return*/, {
                                        allowed: true,
                                        remaining: limit - 1,
                                        resetAt: current + windowSeconds * 1000,
                                    }];
                            count = results[0][1];
                            ttl = results[1][1];
                            if (!(ttl === -1 || ttl === -2)) return [3 /*break*/, 3];
                            // Set expiry if missing or new
                            return [4 /*yield*/, this.redis.expire(key, windowSeconds)];
                        case 2:
                            // Set expiry if missing or new
                            _a.sent();
                            ttl = windowSeconds * 1000;
                            _a.label = 3;
                        case 3: return [2 /*return*/, {
                                allowed: count <= limit,
                                remaining: limit - count,
                                resetAt: current + ttl,
                            }];
                        case 4:
                            now = Date.now();
                            bucket = fallbackMap.get(key);
                            if (!bucket || now - bucket.windowStart >= windowSeconds * 1000) {
                                fallbackMap.set(key, { count: 1, windowStart: now });
                                return [2 /*return*/, {
                                        allowed: true,
                                        remaining: limit - 1,
                                        resetAt: now + windowSeconds * 1000,
                                    }];
                            }
                            bucket.count++;
                            remaining = limit - bucket.count;
                            resetAt = bucket.windowStart + windowSeconds * 1000;
                            return [2 /*return*/, { allowed: bucket.count <= limit, remaining: remaining, resetAt: resetAt }];
                    }
                });
            });
        };
        ApiRateLimiterMiddleware_1.prototype.extractIp = function (req) {
            var _a, _b, _c, _d;
            return ((_d = (_c = (_b = (_a = req.headers['x-forwarded-for']) === null || _a === void 0 ? void 0 : _a.split(',')[0]) === null || _b === void 0 ? void 0 : _b.trim()) !== null && _c !== void 0 ? _c : req.socket.remoteAddress) !== null && _d !== void 0 ? _d : 'unknown');
        };
        return ApiRateLimiterMiddleware_1;
    }());
    __setFunctionName(_classThis, "ApiRateLimiterMiddleware");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ApiRateLimiterMiddleware = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ApiRateLimiterMiddleware = _classThis;
}();
exports.ApiRateLimiterMiddleware = ApiRateLimiterMiddleware;
