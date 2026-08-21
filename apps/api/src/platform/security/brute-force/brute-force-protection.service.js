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
exports.BruteForceProtectionService = void 0;
var common_1 = require("@nestjs/common");
var BruteForceProtectionService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var BruteForceProtectionService = _classThis = /** @class */ (function () {
        function BruteForceProtectionService_1(redisManager) {
            this.redisManager = redisManager;
            this.logger = new common_1.Logger(BruteForceProtectionService.name);
            this.store = new Map();
            this.redis = null;
            this.useRedis = false;
            this.MAX_ATTEMPTS_SOFT = 5;
            this.MAX_ATTEMPTS_HARD = 10;
            this.WINDOW_MS = 15 * 60 * 1000; // 15 minutes
            this.SOFT_LOCK_DURATION_MS = 15 * 60 * 1000; // 15 minutes
            this.redis = this.redisManager.getClient();
            this.useRedis = true; // Assume true since RedisManager handles connections
        }
        BruteForceProtectionService_1.prototype.onModuleDestroy = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/];
                });
            });
        };
        BruteForceProtectionService_1.prototype.getRecord = function (key) {
            return __awaiter(this, void 0, void 0, function () {
                var data;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!(this.useRedis && this.redis)) return [3 /*break*/, 2];
                            return [4 /*yield*/, this.redis.get("bf:".concat(key))];
                        case 1:
                            data = _a.sent();
                            return [2 /*return*/, data ? JSON.parse(data) : undefined];
                        case 2: return [2 /*return*/, this.store.get(key)];
                    }
                });
            });
        };
        BruteForceProtectionService_1.prototype.setRecord = function (key, record, ttlMs) {
            return __awaiter(this, void 0, void 0, function () {
                var ttl;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!(this.useRedis && this.redis)) return [3 /*break*/, 2];
                            ttl = record.permanentLock
                                ? 30 * 24 * 60 * 60
                                : Math.ceil(ttlMs / 1000);
                            return [4 /*yield*/, this.redis.set("bf:".concat(key), JSON.stringify(record), 'EX', ttl)];
                        case 1:
                            _a.sent();
                            return [3 /*break*/, 3];
                        case 2:
                            this.store.set(key, record);
                            _a.label = 3;
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        BruteForceProtectionService_1.prototype.deleteRecord = function (key) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!(this.useRedis && this.redis)) return [3 /*break*/, 2];
                            return [4 /*yield*/, this.redis.del("bf:".concat(key))];
                        case 1:
                            _a.sent();
                            return [3 /*break*/, 3];
                        case 2:
                            this.store.delete(key);
                            _a.label = 3;
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        BruteForceProtectionService_1.prototype.checkLoginAttempt = function (email, ipAddress) {
            return __awaiter(this, void 0, void 0, function () {
                var key, now, record, remaining;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            key = email.toLowerCase();
                            now = Date.now();
                            return [4 /*yield*/, this.getRecord(key)];
                        case 1:
                            record = _a.sent();
                            if (!record) {
                                return [2 /*return*/, { allowed: true, remainingAttempts: this.MAX_ATTEMPTS_SOFT }];
                            }
                            // Check permanent lock
                            if (record.permanentLock) {
                                return [2 /*return*/, { allowed: false, permanentlyLocked: true }];
                            }
                            // Check soft lock
                            if (record.lockedUntil && now < record.lockedUntil) {
                                return [2 /*return*/, { allowed: false, lockedUntil: new Date(record.lockedUntil) }];
                            }
                            if (!(now - record.firstAttemptAt > this.WINDOW_MS)) return [3 /*break*/, 3];
                            return [4 /*yield*/, this.deleteRecord(key)];
                        case 2:
                            _a.sent();
                            return [2 /*return*/, { allowed: true, remainingAttempts: this.MAX_ATTEMPTS_SOFT }];
                        case 3:
                            remaining = this.MAX_ATTEMPTS_SOFT - record.count;
                            return [2 /*return*/, {
                                    allowed: true,
                                    remainingAttempts: Math.max(0, remaining),
                                }];
                    }
                });
            });
        };
        BruteForceProtectionService_1.prototype.recordFailedAttempt = function (email, ipAddress) {
            return __awaiter(this, void 0, void 0, function () {
                var key, now, existing, record;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            key = email.toLowerCase();
                            now = Date.now();
                            return [4 /*yield*/, this.getRecord(key)];
                        case 1:
                            existing = _a.sent();
                            if (!existing || now - existing.firstAttemptAt > this.WINDOW_MS) {
                                record = { count: 1, firstAttemptAt: now, permanentLock: false };
                            }
                            else {
                                record = __assign(__assign({}, existing), { count: existing.count + 1 });
                            }
                            if (!(record.count >= this.MAX_ATTEMPTS_HARD)) return [3 /*break*/, 3];
                            record.permanentLock = true;
                            this.logger.warn("[BruteForce] HARD LOCK triggered for ".concat(key, " after ").concat(record.count, " attempts \u2014 requires admin reset"));
                            return [4 /*yield*/, this.setRecord(key, record, this.WINDOW_MS)];
                        case 2:
                            _a.sent();
                            return [2 /*return*/, { allowed: false, permanentlyLocked: true }];
                        case 3:
                            if (!(record.count >= this.MAX_ATTEMPTS_SOFT)) return [3 /*break*/, 5];
                            record.lockedUntil = now + this.SOFT_LOCK_DURATION_MS;
                            this.logger.warn("[BruteForce] SOFT LOCK triggered for ".concat(key, " until ").concat(new Date(record.lockedUntil).toISOString()));
                            // TTL should cover the lock duration
                            return [4 /*yield*/, this.setRecord(key, record, this.SOFT_LOCK_DURATION_MS)];
                        case 4:
                            // TTL should cover the lock duration
                            _a.sent();
                            return [2 /*return*/, { allowed: false, lockedUntil: new Date(record.lockedUntil) }];
                        case 5: return [4 /*yield*/, this.setRecord(key, record, this.WINDOW_MS)];
                        case 6:
                            _a.sent();
                            return [2 /*return*/, {
                                    allowed: true,
                                    remainingAttempts: this.MAX_ATTEMPTS_SOFT - record.count,
                                }];
                    }
                });
            });
        };
        BruteForceProtectionService_1.prototype.recordSuccessfulLogin = function (email) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.deleteRecord(email.toLowerCase())];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        BruteForceProtectionService_1.prototype.adminUnlock = function (email) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.deleteRecord(email.toLowerCase())];
                        case 1:
                            _a.sent();
                            this.logger.log("[BruteForce] Admin unlocked account for ".concat(email));
                            return [2 /*return*/];
                    }
                });
            });
        };
        BruteForceProtectionService_1.prototype.isAccountLocked = function (email) {
            return __awaiter(this, void 0, void 0, function () {
                var record;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.getRecord(email.toLowerCase())];
                        case 1:
                            record = _a.sent();
                            if (!record)
                                return [2 /*return*/, false];
                            if (record.permanentLock)
                                return [2 /*return*/, true];
                            if (record.lockedUntil && Date.now() < record.lockedUntil)
                                return [2 /*return*/, true];
                            return [2 /*return*/, false];
                    }
                });
            });
        };
        return BruteForceProtectionService_1;
    }());
    __setFunctionName(_classThis, "BruteForceProtectionService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        BruteForceProtectionService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return BruteForceProtectionService = _classThis;
}();
exports.BruteForceProtectionService = BruteForceProtectionService;
