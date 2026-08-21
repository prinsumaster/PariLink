"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
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
exports.SyncEngineProcessor = void 0;
var bullmq_1 = require("@nestjs/bullmq");
var common_1 = require("@nestjs/common");
var SyncEngineProcessor = function () {
    var _classDecorators = [(0, bullmq_1.Processor)('integration-sync', { concurrency: 20 })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _classSuper = bullmq_1.WorkerHost;
    var _instanceExtraInitializers = [];
    var _onCompleted_decorators;
    var _onFailed_decorators;
    var SyncEngineProcessor = _classThis = /** @class */ (function (_super) {
        __extends(SyncEngineProcessor_1, _super);
        function SyncEngineProcessor_1(prisma, factory, crypto) {
            var _this = _super.call(this) || this;
            _this.prisma = (__runInitializers(_this, _instanceExtraInitializers), prisma);
            _this.factory = factory;
            _this.crypto = crypto;
            _this.logger = new common_1.Logger(SyncEngineProcessor.name);
            return _this;
        }
        SyncEngineProcessor_1.prototype.process = function (job) {
            return __awaiter(this, void 0, void 0, function () {
                var connection, connector, credentials, lastSyncDate, result_1, error_1, errorMessage_1, errorStack_1;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.logger.log("Starting Sync Job ".concat(job.id, " for connection ").concat(job.data.connectionId));
                            return [4 /*yield*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.integrationConnection.findUnique({
                                                where: { id: job.data.connectionId },
                                                include: { connector: true },
                                            })];
                                    });
                                }); })];
                        case 1:
                            connection = _a.sent();
                            if (!connection) {
                                throw new Error("Connection ".concat(job.data.connectionId, " not found"));
                            }
                            if (connection.status !== 'ACTIVE' && connection.status !== 'CONFIGURED') {
                                throw new Error("Connection is in invalid state: ".concat(connection.status));
                            }
                            _a.label = 2;
                        case 2:
                            _a.trys.push([2, 6, , 9]);
                            connector = this.factory.getConnector(connection.connector.provider);
                            credentials = typeof connection.credentials === 'string'
                                ? JSON.parse(connection.credentials)
                                : connection.credentials;
                            lastSyncDate = job.data.isFullSync
                                ? undefined
                                : connection.lastSync || undefined;
                            return [4 /*yield*/, connector.syncEntity(job.data.entityType, credentials, lastSyncDate)];
                        case 3:
                            result_1 = _a.sent();
                            // Log success
                            return [4 /*yield*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.syncJob.create({
                                                data: {
                                                    connectionId: connection.id,
                                                    companyId: connection.companyId,
                                                    entityType: job.data.entityType,
                                                    direction: 'IMPORT',
                                                    status: 'COMPLETED',
                                                    recordsProcessed: result_1.recordsSynced,
                                                    startedAt: new Date(job.timestamp),
                                                    completedAt: new Date(),
                                                },
                                            })];
                                    });
                                }); })];
                        case 4:
                            // Log success
                            _a.sent();
                            // Update connection
                            return [4 /*yield*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.integrationConnection.update({
                                                where: { id: connection.id },
                                                data: { lastSync: new Date(), lastError: null },
                                            })];
                                    });
                                }); })];
                        case 5:
                            // Update connection
                            _a.sent();
                            return [2 /*return*/, result_1];
                        case 6:
                            error_1 = _a.sent();
                            errorMessage_1 = error_1 instanceof Error ? error_1.message : String(error_1);
                            errorStack_1 = error_1 instanceof Error ? error_1.stack : undefined;
                            this.logger.error("Sync Job ".concat(job.id, " failed: ").concat(errorMessage_1));
                            // Log Error
                            return [4 /*yield*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.syncError.create({
                                                data: {
                                                    connectionId: connection.id,
                                                    errorMessage: errorMessage_1,
                                                    errorStack: errorStack_1,
                                                },
                                            })];
                                    });
                                }); })];
                        case 7:
                            // Log Error
                            _a.sent();
                            // Update connection
                            return [4 /*yield*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.integrationConnection.update({
                                                where: { id: connection.id },
                                                data: { status: 'FAILED', lastError: errorMessage_1 },
                                            })];
                                    });
                                }); })];
                        case 8:
                            // Update connection
                            _a.sent();
                            throw error_1;
                        case 9: return [2 /*return*/];
                    }
                });
            });
        };
        SyncEngineProcessor_1.prototype.onCompleted = function (job) {
            this.logger.log("Job ".concat(job.id, " completed successfully"));
        };
        SyncEngineProcessor_1.prototype.onFailed = function (job, error) {
            this.logger.error("Job ".concat(job.id, " failed: ").concat(error.message));
        };
        return SyncEngineProcessor_1;
    }(_classSuper));
    __setFunctionName(_classThis, "SyncEngineProcessor");
    (function () {
        var _a;
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create((_a = _classSuper[Symbol.metadata]) !== null && _a !== void 0 ? _a : null) : void 0;
        _onCompleted_decorators = [(0, bullmq_1.OnWorkerEvent)('completed')];
        _onFailed_decorators = [(0, bullmq_1.OnWorkerEvent)('failed')];
        __esDecorate(_classThis, null, _onCompleted_decorators, { kind: "method", name: "onCompleted", static: false, private: false, access: { has: function (obj) { return "onCompleted" in obj; }, get: function (obj) { return obj.onCompleted; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _onFailed_decorators, { kind: "method", name: "onFailed", static: false, private: false, access: { has: function (obj) { return "onFailed" in obj; }, get: function (obj) { return obj.onFailed; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        SyncEngineProcessor = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return SyncEngineProcessor = _classThis;
}();
exports.SyncEngineProcessor = SyncEngineProcessor;
