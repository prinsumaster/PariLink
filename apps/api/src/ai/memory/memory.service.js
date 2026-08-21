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
exports.EnterpriseMemoryService = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
var common_1 = require("@nestjs/common");
var memoryStore = new Map();
var EnterpriseMemoryService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var EnterpriseMemoryService = _classThis = /** @class */ (function () {
        function EnterpriseMemoryService_1(prisma) {
            this.prisma = prisma;
            this.logger = new common_1.Logger(EnterpriseMemoryService.name);
        }
        /**
         * Write a memory entry to the specified scope
         */
        EnterpriseMemoryService_1.prototype.setMemory = function (scope, scopeId, key, value, ttlMs) {
            return __awaiter(this, void 0, void 0, function () {
                var storeKey, effectiveTtl, expiresAt, existing;
                return __generator(this, function (_a) {
                    storeKey = "".concat(scope, ":").concat(scopeId, ":").concat(key);
                    effectiveTtl = ttlMs !== null && ttlMs !== void 0 ? ttlMs : EnterpriseMemoryService.DEFAULT_TTL[scope];
                    expiresAt = effectiveTtl > 0 ? Date.now() + effectiveTtl : undefined;
                    existing = memoryStore.get(storeKey);
                    memoryStore.set(storeKey, {
                        value: value,
                        scope: scope,
                        scopeId: scopeId,
                        expiresAt: expiresAt,
                        createdAt: (existing === null || existing === void 0 ? void 0 : existing.createdAt) || new Date(),
                        updatedAt: new Date(),
                    });
                    this.logger.debug("Memory set: [".concat(scope, ":").concat(scopeId, "] ").concat(key));
                    return [2 /*return*/];
                });
            });
        };
        /**
         * Read a memory entry — returns null if expired or not found
         */
        EnterpriseMemoryService_1.prototype.getMemory = function (scope, scopeId, key) {
            return __awaiter(this, void 0, void 0, function () {
                var storeKey, entry;
                return __generator(this, function (_a) {
                    storeKey = "".concat(scope, ":").concat(scopeId, ":").concat(key);
                    entry = memoryStore.get(storeKey);
                    if (!entry)
                        return [2 /*return*/, null];
                    if (entry.expiresAt && Date.now() > entry.expiresAt) {
                        memoryStore.delete(storeKey);
                        return [2 /*return*/, null];
                    }
                    return [2 /*return*/, entry.value];
                });
            });
        };
        /**
         * Get all memory entries for a given scope
         */
        EnterpriseMemoryService_1.prototype.getScopeMemory = function (scope, scopeId) {
            return __awaiter(this, void 0, void 0, function () {
                var prefix, result, _i, _a, _b, key, entry, memKey;
                return __generator(this, function (_c) {
                    prefix = "".concat(scope, ":").concat(scopeId, ":");
                    result = {};
                    for (_i = 0, _a = memoryStore.entries(); _i < _a.length; _i++) {
                        _b = _a[_i], key = _b[0], entry = _b[1];
                        if (key.startsWith(prefix)) {
                            if (!entry.expiresAt || Date.now() <= entry.expiresAt) {
                                memKey = key.slice(prefix.length);
                                result[memKey] = entry.value;
                            }
                        }
                    }
                    return [2 /*return*/, result];
                });
            });
        };
        /**
         * Get recent conversation memory as a string context block
         */
        EnterpriseMemoryService_1.prototype.getConversationContext = function (sessionId) {
            return __awaiter(this, void 0, void 0, function () {
                var messages, formatted, _a;
                var _this = this;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.aiChatMessage.findMany({
                                                where: { sessionId: sessionId },
                                                orderBy: { createdAt: 'desc' },
                                                take: 10, // Last 10 messages
                                            })];
                                    });
                                }); })];
                        case 1:
                            messages = _b.sent();
                            if (messages.length === 0)
                                return [2 /*return*/, ''];
                            formatted = messages
                                .reverse()
                                .map(function (m) {
                                return "".concat(m.role === 'USER' ? 'User' : 'Assistant', ": ").concat(m.content.substring(0, 200));
                            })
                                .join('\n');
                            return [2 /*return*/, "\n\n--- Previous Conversation ---\n".concat(formatted, "\n--- End of History ---")];
                        case 2:
                            _a = _b.sent();
                            return [2 /*return*/, ''];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Get workspace preferences and institutional memory
         */
        EnterpriseMemoryService_1.prototype.getWorkspaceContext = function (companyId) {
            return __awaiter(this, void 0, void 0, function () {
                var prefs, lines;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.getScopeMemory('WORKSPACE', companyId)];
                        case 1:
                            prefs = _a.sent();
                            if (Object.keys(prefs).length === 0)
                                return [2 /*return*/, ''];
                            lines = Object.entries(prefs)
                                .map(function (_a) {
                                var k = _a[0], v = _a[1];
                                return "".concat(k, ": ").concat(JSON.stringify(v));
                            })
                                .join('\n');
                            return [2 /*return*/, "\n\n--- Workspace Memory ---\n".concat(lines, "\n--- End Memory ---")];
                    }
                });
            });
        };
        /**
         * Store a user preference
         */
        EnterpriseMemoryService_1.prototype.setUserPreference = function (userId, preference, value) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.setMemory('USER', userId, "pref:".concat(preference), value)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Get a user preference
         */
        EnterpriseMemoryService_1.prototype.getUserPreference = function (userId, preference) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.getMemory('USER', userId, "pref:".concat(preference))];
                });
            });
        };
        /**
         * Delete a specific memory entry
         */
        EnterpriseMemoryService_1.prototype.deleteMemory = function (scope, scopeId, key) {
            return __awaiter(this, void 0, void 0, function () {
                var storeKey;
                return __generator(this, function (_a) {
                    storeKey = "".concat(scope, ":").concat(scopeId, ":").concat(key);
                    memoryStore.delete(storeKey);
                    return [2 /*return*/];
                });
            });
        };
        /**
         * Purge all expired memory entries (should be called periodically)
         */
        EnterpriseMemoryService_1.prototype.clearExpiredMemory = function () {
            return __awaiter(this, void 0, void 0, function () {
                var now, cleared, _i, _a, _b, key, entry;
                return __generator(this, function (_c) {
                    now = Date.now();
                    cleared = 0;
                    for (_i = 0, _a = memoryStore.entries(); _i < _a.length; _i++) {
                        _b = _a[_i], key = _b[0], entry = _b[1];
                        if (entry.expiresAt && now > entry.expiresAt) {
                            memoryStore.delete(key);
                            cleared++;
                        }
                    }
                    if (cleared > 0) {
                        this.logger.log("Cleared ".concat(cleared, " expired memory entries"));
                    }
                    return [2 /*return*/, cleared];
                });
            });
        };
        /**
         * Get memory statistics for observability
         */
        EnterpriseMemoryService_1.prototype.getMemoryStats = function () {
            var stats = {
                CONVERSATION: 0,
                USER: 0,
                WORKSPACE: 0,
                ORGANIZATION: 0,
            };
            for (var _i = 0, _a = memoryStore.values(); _i < _a.length; _i++) {
                var entry = _a[_i];
                if (!entry.expiresAt || Date.now() <= entry.expiresAt) {
                    stats[entry.scope]++;
                }
            }
            return stats;
        };
        return EnterpriseMemoryService_1;
    }());
    __setFunctionName(_classThis, "EnterpriseMemoryService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        EnterpriseMemoryService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
    })();
    // Default TTLs per scope (ms)
    _classThis.DEFAULT_TTL = {
        CONVERSATION: 2 * 60 * 60 * 1000, // 2 hours
        USER: 7 * 24 * 60 * 60 * 1000, // 7 days
        WORKSPACE: 30 * 24 * 60 * 60 * 1000, // 30 days
        ORGANIZATION: 365 * 24 * 60 * 60 * 1000, // 1 year
    };
    (function () {
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return EnterpriseMemoryService = _classThis;
}();
exports.EnterpriseMemoryService = EnterpriseMemoryService;
