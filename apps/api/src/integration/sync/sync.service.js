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
exports.SyncEngineService = void 0;
var common_1 = require("@nestjs/common");
var SyncEngineService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var SyncEngineService = _classThis = /** @class */ (function () {
        function SyncEngineService_1(prisma, registry, auth, audit) {
            this.prisma = prisma;
            this.registry = registry;
            this.auth = auth;
            this.audit = audit;
            this.logger = new common_1.Logger(SyncEngineService.name);
        }
        SyncEngineService_1.prototype.triggerSync = function (companyId, connectionId, entityType, payload) {
            return __awaiter(this, void 0, void 0, function () {
                var connection, connector, job, credentials, result_1, e_1;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    return [2 /*return*/, tx.integrationConnection.findUnique({
                                            where: { id: connectionId, companyId: companyId },
                                            include: { connector: true },
                                        })];
                                });
                            }); })];
                        case 1:
                            connection = _a.sent();
                            if (!connection)
                                throw new Error('Connection not found');
                            connector = this.registry.getConnector(connection.connector.provider);
                            if (!connector)
                                throw new Error("Connector ".concat(connection.connector.provider, " not loaded"));
                            return [4 /*yield*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.syncJob.create({
                                                data: {
                                                    companyId: companyId,
                                                    connectionId: connectionId,
                                                    entityType: entityType,
                                                    direction: 'BIDIRECTIONAL',
                                                    status: 'RUNNING',
                                                },
                                            })];
                                    });
                                }); })];
                        case 2:
                            job = _a.sent();
                            _a.label = 3;
                        case 3:
                            _a.trys.push([3, 7, , 11]);
                            this.logger.log("Starting Sync Job ".concat(job.id, " for ").concat(connection.connector.provider));
                            credentials = this.auth.decryptCredentials(connection.credentials);
                            return [4 /*yield*/, connector.sync(companyId, credentials, entityType, payload)];
                        case 4:
                            result_1 = _a.sent();
                            return [4 /*yield*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.syncJob.update({
                                                where: { id: job.id },
                                                data: {
                                                    status: 'COMPLETED',
                                                    recordsProcessed: (result_1 === null || result_1 === void 0 ? void 0 : result_1.recordsProcessed) || 1,
                                                    completedAt: new Date(),
                                                },
                                            })];
                                    });
                                }); })];
                        case 5:
                            _a.sent();
                            return [4 /*yield*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.integrationConnection.update({
                                                where: { id: connection.id },
                                                data: { lastSync: new Date() },
                                            })];
                                    });
                                }); })];
                        case 6:
                            _a.sent();
                            return [2 /*return*/, {
                                    jobId: job.id,
                                    status: 'COMPLETED',
                                    recordsProcessed: (result_1 === null || result_1 === void 0 ? void 0 : result_1.recordsProcessed) || 1,
                                }];
                        case 7:
                            e_1 = _a.sent();
                            this.logger.error("Sync Job ".concat(job.id, " failed: ").concat(e_1.message));
                            return [4 /*yield*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.syncJob.update({
                                                where: { id: job.id },
                                                data: { status: 'FAILED', error: e_1.message },
                                            })];
                                    });
                                }); })];
                        case 8:
                            _a.sent();
                            return [4 /*yield*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.integrationConnection.update({
                                                where: { id: connection.id },
                                                data: { lastError: e_1.message, retryCount: connection.retryCount + 1 },
                                            })];
                                    });
                                }); })];
                        case 9:
                            _a.sent();
                            return [4 /*yield*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.syncError.create({
                                                data: {
                                                    connectionId: connection.id,
                                                    errorMessage: e_1.message,
                                                    errorStack: e_1.stack || null,
                                                },
                                            })];
                                    });
                                }); })];
                        case 10:
                            _a.sent();
                            throw e_1;
                        case 11: return [2 /*return*/];
                    }
                });
            });
        };
        SyncEngineService_1.prototype.scheduleSync = function (companyId, userId, dto) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    if (!dto.connectionId || !dto.cronExpression) {
                        throw new common_1.BadRequestException('connectionId and cronExpression are required');
                    }
                    return [2 /*return*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                            var conn, schedule;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, tx.integrationConnection.findUnique({
                                            where: { id: dto.connectionId },
                                        })];
                                    case 1:
                                        conn = _a.sent();
                                        if (!conn || conn.companyId !== companyId) {
                                            throw new common_1.NotFoundException('Connection not found');
                                        }
                                        return [4 /*yield*/, tx.scheduledSync.create({
                                                data: {
                                                    connectionId: dto.connectionId,
                                                    cronExpression: dto.cronExpression,
                                                    isActive: dto.isActive !== false,
                                                    nextRunAt: new Date(Date.now() + 3600000), // Next hour estimate
                                                },
                                            })];
                                    case 2:
                                        schedule = _a.sent();
                                        if (!this.audit) return [3 /*break*/, 4];
                                        return [4 /*yield*/, this.audit.logEvent({
                                                companyId: companyId,
                                                userId: userId,
                                                entity: 'ScheduledSync',
                                                entityId: schedule.id,
                                                action: 'CREATE_SYNC_SCHEDULE',
                                                details: { connectionId: dto.connectionId, cron: dto.cronExpression },
                                            })];
                                    case 3:
                                        _a.sent();
                                        _a.label = 4;
                                    case 4: return [2 /*return*/, schedule];
                                }
                            });
                        }); })];
                });
            });
        };
        SyncEngineService_1.prototype.listSchedules = function (companyId) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                return [2 /*return*/, tx.scheduledSync.findMany({
                                        where: { connection: { companyId: companyId } },
                                        include: { connection: { include: { connector: true } } },
                                    })];
                            });
                        }); })];
                });
            });
        };
        SyncEngineService_1.prototype.getSyncHistory = function (companyId, query) {
            return __awaiter(this, void 0, void 0, function () {
                var where;
                var _this = this;
                return __generator(this, function (_a) {
                    where = { companyId: companyId };
                    if (query.connectionId)
                        where.connectionId = query.connectionId;
                    if (query.status)
                        where.status = query.status.toUpperCase();
                    return [2 /*return*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                return [2 /*return*/, tx.syncJob.findMany({
                                        where: where,
                                        take: query.limit || 50,
                                        orderBy: { createdAt: 'desc' },
                                    })];
                            });
                        }); })];
                });
            });
        };
        SyncEngineService_1.prototype.getSyncErrors = function (companyId, connectionId) {
            return __awaiter(this, void 0, void 0, function () {
                var where;
                var _this = this;
                return __generator(this, function (_a) {
                    where = { connection: { companyId: companyId } };
                    if (connectionId)
                        where.connectionId = connectionId;
                    return [2 /*return*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                return [2 /*return*/, tx.syncError.findMany({
                                        where: where,
                                        take: 50,
                                        orderBy: { createdAt: 'desc' },
                                        include: { connection: { include: { connector: true } } },
                                    })];
                            });
                        }); })];
                });
            });
        };
        SyncEngineService_1.prototype.resolveError = function (companyId, errorId, userId) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                            var err, updated;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, tx.syncError.findUnique({
                                            where: { id: errorId },
                                            include: { connection: true },
                                        })];
                                    case 1:
                                        err = _a.sent();
                                        if (!err || err.connection.companyId !== companyId) {
                                            throw new common_1.NotFoundException('Sync error not found');
                                        }
                                        return [4 /*yield*/, tx.syncError.update({
                                                where: { id: errorId },
                                                data: { resolved: true },
                                            })];
                                    case 2:
                                        updated = _a.sent();
                                        if (!this.audit) return [3 /*break*/, 4];
                                        return [4 /*yield*/, this.audit.logEvent({
                                                companyId: companyId,
                                                userId: userId,
                                                entity: 'SyncError',
                                                entityId: errorId,
                                                action: 'RESOLVE_SYNC_ERROR',
                                                details: { errorMessage: err.errorMessage },
                                            })];
                                    case 3:
                                        _a.sent();
                                        _a.label = 4;
                                    case 4: return [2 /*return*/, updated];
                                }
                            });
                        }); })];
                });
            });
        };
        return SyncEngineService_1;
    }());
    __setFunctionName(_classThis, "SyncEngineService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        SyncEngineService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return SyncEngineService = _classThis;
}();
exports.SyncEngineService = SyncEngineService;
