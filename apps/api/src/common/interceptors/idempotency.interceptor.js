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
exports.IdempotencyInterceptor = void 0;
var common_1 = require("@nestjs/common");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var IdempotencyInterceptor = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var IdempotencyInterceptor = _classThis = /** @class */ (function () {
        function IdempotencyInterceptor_1(redisManager) {
            this.redisManager = redisManager;
            this.logger = new common_1.Logger(IdempotencyInterceptor.name);
            this.redis = this.redisManager.getClient();
        }
        IdempotencyInterceptor_1.prototype.intercept = function (context, next) {
            return __awaiter(this, void 0, void 0, function () {
                var request, response, idempotencyKey, cacheKey, cachedResponseStr, cachedResponse, err_1;
                var _this = this;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            request = context.switchToHttp().getRequest();
                            response = context.switchToHttp().getResponse();
                            // Only apply idempotency to mutating endpoints (POST, PUT, PATCH, DELETE)
                            if (request.method === 'GET' || request.method === 'OPTIONS') {
                                return [2 /*return*/, next.handle()];
                            }
                            idempotencyKey = request.headers['x-idempotency-key'];
                            if (!idempotencyKey) {
                                // For global safety, we could enforce it, but to prevent breaking all existing clients, we make it optional but recommended.
                                // However, if it IS provided, we strictly enforce it.
                                return [2 /*return*/, next.handle()];
                            }
                            cacheKey = "idempotency:".concat(((_a = request.user) === null || _a === void 0 ? void 0 : _a.companyId) || 'global', ":").concat(request.method, ":").concat(request.path, ":").concat(idempotencyKey);
                            _b.label = 1;
                        case 1:
                            _b.trys.push([1, 4, , 5]);
                            return [4 /*yield*/, this.redis.get(cacheKey)];
                        case 2:
                            cachedResponseStr = _b.sent();
                            if (cachedResponseStr) {
                                if (cachedResponseStr === 'IN_PROGRESS') {
                                    throw new common_1.HttpException('Request is already being processed.', common_1.HttpStatus.CONFLICT);
                                }
                                cachedResponse = JSON.parse(cachedResponseStr);
                                this.logger.log("[Idempotency] Serving cached response for key: ".concat(idempotencyKey));
                                // Ensure we send back the original status code
                                response.status(cachedResponse.statusCode || common_1.HttpStatus.OK);
                                return [2 /*return*/, (0, rxjs_1.of)(cachedResponse.data)];
                            }
                            // Mark as in-progress (TTL 30s to match timeout interceptor)
                            return [4 /*yield*/, this.redis.set(cacheKey, 'IN_PROGRESS', 'EX', 30)];
                        case 3:
                            // Mark as in-progress (TTL 30s to match timeout interceptor)
                            _b.sent();
                            return [3 /*break*/, 5];
                        case 4:
                            err_1 = _b.sent();
                            if (err_1 instanceof common_1.HttpException)
                                throw err_1;
                            this.logger.error('Redis error in IdempotencyInterceptor', err_1);
                            // Proceed gracefully if Redis fails
                            return [2 /*return*/, next.handle()];
                        case 5: return [2 /*return*/, next.handle().pipe((0, operators_1.tap)(function (data) { return __awaiter(_this, void 0, void 0, function () {
                                var responseToCache, err_2;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            _a.trys.push([0, 2, , 3]);
                                            responseToCache = {
                                                statusCode: response.statusCode,
                                                data: data,
                                            };
                                            // Cache successful response for 24 hours
                                            return [4 /*yield*/, this.redis.set(cacheKey, JSON.stringify(responseToCache), 'EX', 86400)];
                                        case 1:
                                            // Cache successful response for 24 hours
                                            _a.sent();
                                            return [3 /*break*/, 3];
                                        case 2:
                                            err_2 = _a.sent();
                                            this.logger.error('Failed to cache idempotent response', err_2);
                                            return [3 /*break*/, 3];
                                        case 3: return [2 /*return*/];
                                    }
                                });
                            }); }), (0, operators_1.catchError)(function (err) { return __awaiter(_this, void 0, void 0, function () {
                                var redisErr_1;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            _a.trys.push([0, 2, , 3]);
                                            // If the request fails (e.g. validation error, 500), remove the IN_PROGRESS lock
                                            // so the client can retry safely.
                                            return [4 /*yield*/, this.redis.del(cacheKey)];
                                        case 1:
                                            // If the request fails (e.g. validation error, 500), remove the IN_PROGRESS lock
                                            // so the client can retry safely.
                                            _a.sent();
                                            return [3 /*break*/, 3];
                                        case 2:
                                            redisErr_1 = _a.sent();
                                            this.logger.error('Failed to clear idempotency lock on error', redisErr_1);
                                            return [3 /*break*/, 3];
                                        case 3: throw err; // rethrow the original error
                                    }
                                });
                            }); }))];
                    }
                });
            });
        };
        return IdempotencyInterceptor_1;
    }());
    __setFunctionName(_classThis, "IdempotencyInterceptor");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        IdempotencyInterceptor = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return IdempotencyInterceptor = _classThis;
}();
exports.IdempotencyInterceptor = IdempotencyInterceptor;
