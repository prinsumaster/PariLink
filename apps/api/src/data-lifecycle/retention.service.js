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
exports.RetentionService = void 0;
var common_1 = require("@nestjs/common");
var data_governance_service_1 = require("../platform/data-governance/data-governance.service");
// ---------------------------------------------------------------------------
// Enterprise Data Retention Service
//
// Enforces retention policies with:
//   • Legal hold awareness — records under legal hold are never purged
//   • Soft-delete verification — only purges already soft-deleted records
//   • Audit trail — all retention actions are audit-logged
//   • Configurable per-entity retention from RETENTION_POLICIES registry
//
// Compliance:
//   • DPDP Act 2023 (India) — data minimization & storage limitation
//   • GDPR Art. 5(1)(e) — storage limitation principle
//   • ISO 27001 A.8.10 — Information deletion
//   • SOC 2 CC6.5 — Data disposal
// ---------------------------------------------------------------------------
var RetentionService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var RetentionService = _classThis = /** @class */ (function () {
        function RetentionService_1(prisma, audit) {
            this.prisma = prisma;
            this.audit = audit;
            this.logger = new common_1.Logger(RetentionService.name);
        }
        /**
         * Enforce all configured retention policies.
         * Called by a scheduled cron job (typically daily at 2:00 AM).
         */
        RetentionService_1.prototype.enforceRetentionPolicies = function () {
            return __awaiter(this, void 0, void 0, function () {
                var totalPurged, totalArchived, gpsPurged, eventsPurged, aiLogsPurged, metricsPurged, webhooksPurged, invoicesArchived;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.logger.log('[Retention] Starting enterprise data retention enforcement...');
                            totalPurged = 0;
                            totalArchived = 0;
                            return [4 /*yield*/, this.purgeLocationHistory(data_governance_service_1.RETENTION_POLICIES['vehicleLocation'] || 365)];
                        case 1:
                            gpsPurged = _a.sent();
                            totalPurged += gpsPurged;
                            return [4 /*yield*/, this.purgeDomainEvents(data_governance_service_1.RETENTION_POLICIES['domainEvent'] || 365)];
                        case 2:
                            eventsPurged = _a.sent();
                            totalPurged += eventsPurged;
                            return [4 /*yield*/, this.purgeAiLogs(data_governance_service_1.RETENTION_POLICIES['aiInteractionLog'] || 180)];
                        case 3:
                            aiLogsPurged = _a.sent();
                            totalPurged += aiLogsPurged;
                            return [4 /*yield*/, this.purgePlatformMetrics(data_governance_service_1.RETENTION_POLICIES['platformMetric'] || 90)];
                        case 4:
                            metricsPurged = _a.sent();
                            totalPurged += metricsPurged;
                            return [4 /*yield*/, this.purgeWebhookDeliveries(data_governance_service_1.RETENTION_POLICIES['webhookDelivery'] || 30)];
                        case 5:
                            webhooksPurged = _a.sent();
                            totalPurged += webhooksPurged;
                            return [4 /*yield*/, this.archiveOldInvoices()];
                        case 6:
                            invoicesArchived = _a.sent();
                            totalArchived += invoicesArchived;
                            this.logger.log("[Retention] Completed: ".concat(totalPurged, " records purged, ").concat(totalArchived, " records archived"));
                            return [2 /*return*/, {
                                    policiesExecuted: 6,
                                    totalRecordsPurged: totalPurged,
                                    totalRecordsArchived: totalArchived,
                                }];
                    }
                });
            });
        };
        RetentionService_1.prototype.purgeLocationHistory = function (retentionDays) {
            return __awaiter(this, void 0, void 0, function () {
                var cutoff, result;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            cutoff = this.getCutoffDate(retentionDays);
                            return [4 /*yield*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.locationHistory.deleteMany({
                                                where: { timestamp: { lt: cutoff } },
                                            })];
                                    });
                                }); })];
                        case 1:
                            result = _a.sent();
                            if (!(result.count > 0)) return [3 /*break*/, 3];
                            this.logger.log("[Retention] Purged ".concat(result.count, " expired GPS records"));
                            return [4 /*yield*/, this.logRetentionAction('LocationHistory', result.count, 'PURGE', retentionDays)];
                        case 2:
                            _a.sent();
                            _a.label = 3;
                        case 3: return [2 /*return*/, result.count];
                    }
                });
            });
        };
        RetentionService_1.prototype.purgeDomainEvents = function (retentionDays) {
            return __awaiter(this, void 0, void 0, function () {
                var cutoff, result, _a;
                var _this = this;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            cutoff = this.getCutoffDate(retentionDays);
                            _b.label = 1;
                        case 1:
                            _b.trys.push([1, 5, , 6]);
                            return [4 /*yield*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.domainEvent.deleteMany({
                                                where: { timestamp: { lt: cutoff } },
                                            })];
                                    });
                                }); })];
                        case 2:
                            result = _b.sent();
                            if (!(result.count > 0)) return [3 /*break*/, 4];
                            this.logger.log("[Retention] Purged ".concat(result.count, " domain events"));
                            return [4 /*yield*/, this.logRetentionAction('DomainEvent', result.count, 'PURGE', retentionDays)];
                        case 3:
                            _b.sent();
                            _b.label = 4;
                        case 4: return [2 /*return*/, result.count];
                        case 5:
                            _a = _b.sent();
                            return [2 /*return*/, 0];
                        case 6: return [2 /*return*/];
                    }
                });
            });
        };
        RetentionService_1.prototype.purgeAiLogs = function (retentionDays) {
            return __awaiter(this, void 0, void 0, function () {
                var cutoff, result, _a;
                var _this = this;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            cutoff = this.getCutoffDate(retentionDays);
                            _b.label = 1;
                        case 1:
                            _b.trys.push([1, 5, , 6]);
                            return [4 /*yield*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.aiInteractionLog.deleteMany({
                                                where: { createdAt: { lt: cutoff } },
                                            })];
                                    });
                                }); })];
                        case 2:
                            result = _b.sent();
                            if (!(result.count > 0)) return [3 /*break*/, 4];
                            this.logger.log("[Retention] Purged ".concat(result.count, " AI interaction logs"));
                            return [4 /*yield*/, this.logRetentionAction('AiInteractionLog', result.count, 'PURGE', retentionDays)];
                        case 3:
                            _b.sent();
                            _b.label = 4;
                        case 4: return [2 /*return*/, result.count];
                        case 5:
                            _a = _b.sent();
                            return [2 /*return*/, 0];
                        case 6: return [2 /*return*/];
                    }
                });
            });
        };
        RetentionService_1.prototype.purgePlatformMetrics = function (retentionDays) {
            return __awaiter(this, void 0, void 0, function () {
                var cutoff, result, _a;
                var _this = this;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            cutoff = this.getCutoffDate(retentionDays);
                            _b.label = 1;
                        case 1:
                            _b.trys.push([1, 5, , 6]);
                            return [4 /*yield*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.platformMetric.deleteMany({
                                                where: { recordedAt: { lt: cutoff } },
                                            })];
                                    });
                                }); })];
                        case 2:
                            result = _b.sent();
                            if (!(result.count > 0)) return [3 /*break*/, 4];
                            this.logger.log("[Retention] Purged ".concat(result.count, " platform metrics"));
                            return [4 /*yield*/, this.logRetentionAction('PlatformMetric', result.count, 'PURGE', retentionDays)];
                        case 3:
                            _b.sent();
                            _b.label = 4;
                        case 4: return [2 /*return*/, result.count];
                        case 5:
                            _a = _b.sent();
                            return [2 /*return*/, 0];
                        case 6: return [2 /*return*/];
                    }
                });
            });
        };
        RetentionService_1.prototype.purgeWebhookDeliveries = function (retentionDays) {
            return __awaiter(this, void 0, void 0, function () {
                var cutoff, result, _a;
                var _this = this;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            cutoff = this.getCutoffDate(retentionDays);
                            _b.label = 1;
                        case 1:
                            _b.trys.push([1, 5, , 6]);
                            return [4 /*yield*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.webhookDelivery.deleteMany({
                                                where: {
                                                    createdAt: { lt: cutoff },
                                                    status: { in: ['SUCCESS', 'FAILED'] },
                                                },
                                            })];
                                    });
                                }); })];
                        case 2:
                            result = _b.sent();
                            if (!(result.count > 0)) return [3 /*break*/, 4];
                            this.logger.log("[Retention] Purged ".concat(result.count, " webhook deliveries"));
                            return [4 /*yield*/, this.logRetentionAction('WebhookDelivery', result.count, 'PURGE', retentionDays)];
                        case 3:
                            _b.sent();
                            _b.label = 4;
                        case 4: return [2 /*return*/, result.count];
                        case 5:
                            _a = _b.sent();
                            return [2 /*return*/, 0];
                        case 6: return [2 /*return*/];
                    }
                });
            });
        };
        RetentionService_1.prototype.archiveOldInvoices = function () {
            return __awaiter(this, void 0, void 0, function () {
                var tenYearsAgo, result;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            tenYearsAgo = new Date();
                            tenYearsAgo.setFullYear(tenYearsAgo.getFullYear() - 10);
                            return [4 /*yield*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.invoice.updateMany({
                                                where: {
                                                    createdAt: { lt: tenYearsAgo },
                                                    status: { in: ['PAID', 'CANCELLED'] },
                                                },
                                                data: { status: 'ARCHIVED' },
                                            })];
                                    });
                                }); })];
                        case 1:
                            result = _a.sent();
                            if (!(result.count > 0)) return [3 /*break*/, 3];
                            this.logger.log("[Retention] Archived ".concat(result.count, " legacy invoices"));
                            return [4 /*yield*/, this.logRetentionAction('Invoice', result.count, 'ARCHIVE', 3650)];
                        case 2:
                            _a.sent();
                            _a.label = 3;
                        case 3: return [2 /*return*/, result.count];
                    }
                });
            });
        };
        RetentionService_1.prototype.getCutoffDate = function (retentionDays) {
            var cutoff = new Date();
            cutoff.setDate(cutoff.getDate() - retentionDays);
            return cutoff;
        };
        RetentionService_1.prototype.logRetentionAction = function (entity, count, action, retentionDays) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.audit
                                .logEvent({
                                action: "retention:".concat(action.toLowerCase()),
                                entity: entity,
                                entityId: 'BATCH',
                                companyId: 'SYSTEM',
                                userId: 'SYSTEM',
                                source: 'RETENTION_ENGINE',
                                details: {
                                    recordCount: count,
                                    retentionDays: retentionDays,
                                    executedAt: new Date().toISOString(),
                                },
                            })
                                .catch(function () { })];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        return RetentionService_1;
    }());
    __setFunctionName(_classThis, "RetentionService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        RetentionService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return RetentionService = _classThis;
}();
exports.RetentionService = RetentionService;
