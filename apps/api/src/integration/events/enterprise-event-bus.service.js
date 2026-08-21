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
exports.EnterpriseEventBusService = void 0;
var common_1 = require("@nestjs/common");
var crypto = __importStar(require("crypto"));
var EnterpriseEventBusService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var EnterpriseEventBusService = _classThis = /** @class */ (function () {
        function EnterpriseEventBusService_1(prisma, eventEmitter, audit) {
            this.prisma = prisma;
            this.eventEmitter = eventEmitter;
            this.audit = audit;
            this.logger = new common_1.Logger(EnterpriseEventBusService.name);
        }
        EnterpriseEventBusService_1.prototype.publishEvent = function (companyId, userId, dto) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    if (!dto.streamId || !dto.streamType || !dto.eventType || !dto.payload) {
                        throw new common_1.BadRequestException('streamId, streamType, eventType, and payload are required');
                    }
                    return [2 /*return*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                            var lastEvent, nextVersion, eventRecord, topic;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, tx.domainEvent.findFirst({
                                            where: { streamId: dto.streamId },
                                            orderBy: { version: 'desc' },
                                        })];
                                    case 1:
                                        lastEvent = _a.sent();
                                        nextVersion = lastEvent ? lastEvent.version + 1 : 1;
                                        return [4 /*yield*/, tx.domainEvent.create({
                                                data: {
                                                    companyId: companyId,
                                                    streamId: dto.streamId,
                                                    streamType: dto.streamType.toUpperCase(),
                                                    eventType: dto.eventType,
                                                    version: nextVersion,
                                                    payload: dto.payload,
                                                    metadata: dto.metadata || {},
                                                    correlationId: dto.correlationId || crypto.randomUUID(),
                                                    userId: userId,
                                                },
                                            })];
                                    case 2:
                                        eventRecord = _a.sent();
                                        topic = "DomainEvent.".concat(eventRecord.streamType, ".").concat(eventRecord.eventType);
                                        this.eventEmitter.emit(topic, {
                                            tenantId: companyId,
                                            eventId: eventRecord.id,
                                            streamId: eventRecord.streamId,
                                            version: eventRecord.version,
                                            payload: {
                                                data: __assign({ eventType: eventRecord.eventType }, dto.payload),
                                            },
                                        });
                                        this.logger.log("Published event ".concat(topic, " (v").concat(nextVersion, ") for stream ").concat(dto.streamId));
                                        return [4 /*yield*/, this.audit.logEvent({
                                                companyId: companyId,
                                                userId: userId,
                                                entity: 'DomainEvent',
                                                entityId: eventRecord.id,
                                                action: 'PUBLISH_EVENT',
                                                details: {
                                                    streamId: dto.streamId,
                                                    eventType: dto.eventType,
                                                    version: nextVersion,
                                                },
                                            })];
                                    case 3:
                                        _a.sent();
                                        return [2 /*return*/, eventRecord];
                                }
                            });
                        }); })];
                });
            });
        };
        EnterpriseEventBusService_1.prototype.getEventHistory = function (companyId, query) {
            return __awaiter(this, void 0, void 0, function () {
                var where, _a, events, total;
                var _this = this;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            where = { companyId: companyId };
                            if (query.streamType)
                                where.streamType = query.streamType.toUpperCase();
                            if (query.streamId)
                                where.streamId = query.streamId;
                            if (query.eventType)
                                where.eventType = query.eventType;
                            return [4 /*yield*/, Promise.all([
                                    this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                        return __generator(this, function (_a) {
                                            return [2 /*return*/, tx.domainEvent.findMany({
                                                    where: where,
                                                    take: query.limit || 50,
                                                    skip: query.offset || 0,
                                                    orderBy: { timestamp: 'desc' },
                                                })];
                                        });
                                    }); }),
                                    this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.domainEvent.count({ where: where })];
                                    }); }); }),
                                ])];
                        case 1:
                            _a = _b.sent(), events = _a[0], total = _a[1];
                            return [2 /*return*/, {
                                    events: events,
                                    total: total,
                                    limit: query.limit || 50,
                                    offset: query.offset || 0,
                                }];
                    }
                });
            });
        };
        EnterpriseEventBusService_1.prototype.replayEvents = function (companyId, streamId, fromVersion, toVersion, userId) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                            var events, replayedCount, _i, events_1, ev, topic;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, tx.domainEvent.findMany({
                                            where: {
                                                companyId: companyId,
                                                streamId: streamId,
                                                version: {
                                                    gte: fromVersion,
                                                    lte: toVersion,
                                                },
                                            },
                                            orderBy: { version: 'asc' },
                                        })];
                                    case 1:
                                        events = _a.sent();
                                        if (events.length === 0) {
                                            throw new common_1.NotFoundException("No domain events found for stream ".concat(streamId, " in the specified version range."));
                                        }
                                        replayedCount = 0;
                                        for (_i = 0, events_1 = events; _i < events_1.length; _i++) {
                                            ev = events_1[_i];
                                            topic = "DomainEvent.".concat(ev.streamType, ".").concat(ev.eventType);
                                            this.eventEmitter.emit(topic, {
                                                tenantId: companyId,
                                                eventId: ev.id,
                                                streamId: ev.streamId,
                                                version: ev.version,
                                                isReplay: true,
                                                payload: {
                                                    data: __assign({ eventType: ev.eventType }, ev.payload),
                                                },
                                            });
                                            replayedCount++;
                                        }
                                        this.logger.log("Replayed ".concat(replayedCount, " events for stream ").concat(streamId));
                                        return [4 /*yield*/, this.audit.logEvent({
                                                companyId: companyId,
                                                userId: userId,
                                                entity: 'DomainEvent',
                                                entityId: streamId,
                                                action: 'REPLAY_STREAM_EVENTS',
                                                details: { fromVersion: fromVersion, toVersion: toVersion, replayedCount: replayedCount },
                                            })];
                                    case 2:
                                        _a.sent();
                                        return [2 /*return*/, { streamId: streamId, replayedCount: replayedCount, status: 'REPLAYED' }];
                                }
                            });
                        }); })];
                });
            });
        };
        return EnterpriseEventBusService_1;
    }());
    __setFunctionName(_classThis, "EnterpriseEventBusService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        EnterpriseEventBusService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return EnterpriseEventBusService = _classThis;
}();
exports.EnterpriseEventBusService = EnterpriseEventBusService;
