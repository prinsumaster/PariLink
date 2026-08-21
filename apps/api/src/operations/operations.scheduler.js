"use strict";
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
exports.OperationsScheduler = void 0;
var common_1 = require("@nestjs/common");
var schedule_1 = require("@nestjs/schedule");
/**
 * OperationsScheduler — Autonomous background monitoring daemon.
 *
 * Runs continuously in production to collect metrics, detect anomalies,
 * fire threshold alerts, rotate logs, and maintain backup integrity.
 * Comparable to the Datadog Agent, CloudWatch Agent, and Prometheus scraper.
 */
var OperationsScheduler = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _collectHealthPulse_decorators;
    var _collectSystemMetrics_decorators;
    var _monitorQueueDepth_decorators;
    var _detectSlowEndpoints_decorators;
    var _monitorErrorRates_decorators;
    var _scheduleDailyBackups_decorators;
    var _enforceBackupRetention_decorators;
    var _enforceLogRetention_decorators;
    var _expireMaintenanceWindows_decorators;
    var OperationsScheduler = _classThis = /** @class */ (function () {
        function OperationsScheduler_1(prisma, healthService, metricsService, alertEngine, backupService, loggingService, perfService) {
            this.prisma = (__runInitializers(this, _instanceExtraInitializers), prisma);
            this.healthService = healthService;
            this.metricsService = metricsService;
            this.alertEngine = alertEngine;
            this.backupService = backupService;
            this.loggingService = loggingService;
            this.perfService = perfService;
            this.logger = new common_1.Logger(OperationsScheduler.name);
        }
        /**
         * HEALTH PULSE — Runs every 60 seconds.
         * Performs a global health sweep and records a snapshot in SystemHealthLog.
         * If any component is UNHEALTHY or DOWN, auto-triggers an alert.
         */
        OperationsScheduler_1.prototype.collectHealthPulse = function () {
            return __awaiter(this, void 0, void 0, function () {
                var report, componentsList, unhealthyComps, company_1, e_1;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 5, , 6]);
                            return [4 /*yield*/, this.healthService.getGlobalHealth()];
                        case 1:
                            report = _a.sent();
                            componentsList = Object.values(report.components);
                            unhealthyComps = componentsList.filter(function (c) { return c.status === 'DOWN' || c.status === 'UNHEALTHY'; });
                            if (!(unhealthyComps.length > 0)) return [3 /*break*/, 4];
                            return [4 /*yield*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                    return [2 /*return*/, tx.company.findFirst({ where: { status: 'ACTIVE' } })];
                                }); }); })];
                        case 2:
                            company_1 = _a.sent();
                            if (!company_1) return [3 /*break*/, 4];
                            return [4 /*yield*/, Promise.all(unhealthyComps.map(function (comp) {
                                    return _this.alertEngine
                                        .triggerAlert({
                                        companyId: company_1.id,
                                        type: 'HEALTH',
                                        severity: comp.status === 'DOWN' ? 'CRITICAL' : 'HIGH',
                                        message: "Component ".concat(comp.component, " is ").concat(comp.status, ". Latency: ").concat(comp.latencyMs, "ms, Error Rate: ").concat(comp.errorRatePct, "%"),
                                        metadata: comp.details,
                                    })
                                        .catch(function () { });
                                }))];
                        case 3:
                            _a.sent();
                            _a.label = 4;
                        case 4:
                            if (report.overallStatus !== 'HEALTHY') {
                                this.logger.warn("[Health Pulse] System status: ".concat(report.overallStatus, " at ").concat(report.timestamp));
                            }
                            return [3 /*break*/, 6];
                        case 5:
                            e_1 = _a.sent();
                            this.logger.error("[Health Pulse] Failed: ".concat(e_1 instanceof Error ? (e_1 instanceof Error ? e_1.message : String(e_1)) : String(e_1)));
                            return [3 /*break*/, 6];
                        case 6: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * METRICS COLLECTION — Runs every 5 minutes.
         * Records system metrics (CPU, heap, event loop) into PlatformMetric table.
         * Uses SYSTEM_INTERNAL as companyId sentinel for platform-wide metrics.
         */
        OperationsScheduler_1.prototype.collectSystemMetrics = function () {
            return __awaiter(this, void 0, void 0, function () {
                var metrics, SENTINEL_COMPANY_ID, e_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 6, , 7]);
                            return [4 /*yield*/, this.metricsService.getSystemMetrics()];
                        case 1:
                            metrics = _a.sent();
                            SENTINEL_COMPANY_ID = 'SYSTEM_INTERNAL';
                            if (!(metrics.heapUsedMb > 800)) return [3 /*break*/, 3];
                            return [4 /*yield*/, this.perfService.recordProfile({
                                    profileType: 'MEMORY_LEAK',
                                    targetResource: 'Node.js Process Heap',
                                    metricValue: metrics.heapUsedMb,
                                    thresholdValue: 800,
                                    analysisDetails: {
                                        rss: metrics.rssMb,
                                        heapTotal: metrics.heapTotalMb,
                                    },
                                })];
                        case 2:
                            _a.sent();
                            _a.label = 3;
                        case 3:
                            if (!(metrics.cpuUsagePct > 85)) return [3 /*break*/, 5];
                            return [4 /*yield*/, this.perfService.recordProfile({
                                    profileType: 'CPU_SPIKE',
                                    targetResource: 'API Server Process',
                                    metricValue: metrics.cpuUsagePct,
                                    thresholdValue: 85,
                                    analysisDetails: { uptime: metrics.uptimeSeconds },
                                })];
                        case 4:
                            _a.sent();
                            _a.label = 5;
                        case 5:
                            this.logger.debug("[Metrics] Heap: ".concat(metrics.heapUsedMb, "MB | CPU: ").concat(metrics.cpuUsagePct, "%"));
                            return [3 /*break*/, 7];
                        case 6:
                            e_2 = _a.sent();
                            this.logger.error("[Metrics Collection] Failed: ".concat(e_2 instanceof Error ? (e_2 instanceof Error ? e_2.message : String(e_2)) : String(e_2)));
                            return [3 /*break*/, 7];
                        case 7: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * QUEUE DEPTH MONITOR — Runs every 30 seconds.
         * Checks pending and failed job counts across all companies. Alerts on depth spikes.
         */
        OperationsScheduler_1.prototype.monitorQueueDepth = function () {
            return __awaiter(this, void 0, void 0, function () {
                var failedJobs, pendingJobs, e_3;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            return [4 /*yield*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                    return [2 /*return*/, tx.backgroundJob.count({ where: { status: 'FAILED' } })];
                                }); }); })];
                        case 1:
                            failedJobs = _a.sent();
                            return [4 /*yield*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                    return [2 /*return*/, tx.backgroundJob.count({ where: { status: 'PENDING' } })];
                                }); }); })];
                        case 2:
                            pendingJobs = _a.sent();
                            if (failedJobs > 20) {
                                this.logger.warn("[Queue Monitor] High failed job count: ".concat(failedJobs));
                            }
                            return [3 /*break*/, 4];
                        case 3:
                            e_3 = _a.sent();
                            this.logger.error("[Data Sync Polling] Failed: ".concat(e_3 instanceof Error ? (e_3 instanceof Error ? e_3.message : String(e_3)) : String(e_3)));
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * SLOW QUERY DETECTOR — Runs every 10 minutes.
         * Scans recent API Analytics logs to identify high-latency endpoints.
         */
        OperationsScheduler_1.prototype.detectSlowEndpoints = function () {
            return __awaiter(this, void 0, void 0, function () {
                var slowLogs, e_4;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            return [4 /*yield*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.apiAnalyticsLog.findMany({
                                                where: {
                                                    latencyMs: { gte: 3000 }, // > 3 seconds
                                                    timestamp: { gte: new Date(Date.now() - 600000) }, // Last 10 min
                                                },
                                                take: 50,
                                                orderBy: { latencyMs: 'desc' },
                                            })];
                                    });
                                }); })];
                        case 1:
                            slowLogs = _a.sent();
                            return [4 /*yield*/, Promise.all(slowLogs.slice(0, 5).map(function (log) {
                                    return _this.perfService.recordProfile({
                                        companyId: log.companyId || undefined,
                                        profileType: 'HIGH_LATENCY',
                                        targetResource: "".concat(log.method, " ").concat(log.endpoint),
                                        metricValue: log.latencyMs,
                                        thresholdValue: 3000,
                                        analysisDetails: {
                                            statusCode: log.statusCode,
                                            companyId: log.companyId,
                                        },
                                    });
                                }))];
                        case 2:
                            _a.sent();
                            if (slowLogs.length > 0) {
                                this.logger.warn("[Slow Endpoint Detector] Found ".concat(slowLogs.length, " slow API calls in last 10 minutes"));
                            }
                            return [3 /*break*/, 4];
                        case 3:
                            e_4 = _a.sent();
                            this.logger.error("[Slow Endpoint Detector] Failed: ".concat(e_4 instanceof Error ? e_4.message : String(e_4)));
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * ERROR RATE MONITOR — Runs every 5 minutes.
         * Checks global 5xx error rates. Logs warning if > 5% over the past 5 minutes.
         */
        OperationsScheduler_1.prototype.monitorErrorRates = function () {
            return __awaiter(this, void 0, void 0, function () {
                var window_1, _a, total, errors, errorRatePct, e_5;
                var _this = this;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 4, , 5]);
                            window_1 = new Date(Date.now() - 300000);
                            return [4 /*yield*/, Promise.all([
                                    this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.apiAnalyticsLog.count({ where: { timestamp: { gte: window_1 } } })];
                                    }); }); }),
                                    this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                        return __generator(this, function (_a) {
                                            return [2 /*return*/, tx.apiAnalyticsLog.count({
                                                    where: { timestamp: { gte: window_1 }, statusCode: { gte: 500 } },
                                                })];
                                        });
                                    }); }),
                                ])];
                        case 1:
                            _a = _b.sent(), total = _a[0], errors = _a[1];
                            if (!(total > 0)) return [3 /*break*/, 3];
                            errorRatePct = (errors / total) * 100;
                            if (!(errorRatePct > 5)) return [3 /*break*/, 3];
                            this.logger.error("[Error Rate Monitor] Error rate spike: ".concat(errorRatePct.toFixed(2), "% (").concat(errors, "/").concat(total, " requests)"));
                            return [4 /*yield*/, this.loggingService.log({
                                    level: 'ERROR',
                                    service: 'api-error-rate-monitor',
                                    message: "Error rate spike detected: ".concat(errorRatePct.toFixed(2), "% over last 5 minutes"),
                                    structuredData: { total: total, errors: errors, errorRatePct: errorRatePct, windowMinutes: 5 },
                                })];
                        case 2:
                            _b.sent();
                            _b.label = 3;
                        case 3: return [3 /*break*/, 5];
                        case 4:
                            e_5 = _b.sent();
                            this.logger.error("[Error Rate Monitor] Failed: ".concat(e_5 instanceof Error ? e_5.message : String(e_5)));
                            return [3 /*break*/, 5];
                        case 5: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * DAILY BACKUP SCHEDULER — Runs every day at 02:00 UTC.
         * Triggers automated full database backups for all active companies.
         */
        OperationsScheduler_1.prototype.scheduleDailyBackups = function () {
            return __awaiter(this, void 0, void 0, function () {
                var companies, e_6;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.logger.log('[Backup Scheduler] Starting daily automated database backups...');
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 4, , 5]);
                            return [4 /*yield*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                    return [2 /*return*/, tx.company.findMany({ where: { status: 'ACTIVE' }, take: 50 })];
                                }); }); })];
                        case 2:
                            companies = _a.sent();
                            return [4 /*yield*/, Promise.all(companies.map(function (company) {
                                    return _this.backupService.startBackupJob({
                                        companyId: company.id,
                                        backupType: 'DATABASE',
                                        retentionDays: 30,
                                    });
                                }))];
                        case 3:
                            _a.sent();
                            this.logger.log("[Backup Scheduler] Initiated ".concat(companies.length, " automated database backups"));
                            return [3 /*break*/, 5];
                        case 4:
                            e_6 = _a.sent();
                            this.logger.error("[Backup Scheduler] Daily backup failed: ".concat(e_6 instanceof Error ? e_6.message : String(e_6)));
                            return [3 /*break*/, 5];
                        case 5: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * BACKUP RETENTION ENFORCER — Runs every day at 03:00 UTC.
         * Purges expired backup archives beyond their retention window.
         */
        OperationsScheduler_1.prototype.enforceBackupRetention = function () {
            return __awaiter(this, void 0, void 0, function () {
                var purgedCount, e_7;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, this.backupService.purgeExpiredBackups()];
                        case 1:
                            purgedCount = (_a.sent()).purgedCount;
                            if (purgedCount > 0) {
                                this.logger.log("[Retention Enforcer] Purged ".concat(purgedCount, " expired backup archives"));
                            }
                            return [3 /*break*/, 3];
                        case 2:
                            e_7 = _a.sent();
                            this.logger.error("[Maintenance Sweep] Failed: ".concat(e_7 instanceof Error ? (e_7 instanceof Error ? e_7.message : String(e_7)) : String(e_7)));
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * LOG RETENTION ENFORCER — Runs every week on Sunday at 04:00 UTC.
         * Purges enterprise logs older than the retention window (default 90 days).
         */
        OperationsScheduler_1.prototype.enforceLogRetention = function () {
            return __awaiter(this, void 0, void 0, function () {
                var deletedCount, e_8;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, this.loggingService.purgeExpiredLogs(90)];
                        case 1:
                            deletedCount = (_a.sent()).deletedCount;
                            this.logger.log("[Log Retention] Purged ".concat(deletedCount, " enterprise log records older than 90 days"));
                            return [3 /*break*/, 3];
                        case 2:
                            e_8 = _a.sent();
                            this.logger.error("[Log Processing] Failed: ".concat(e_8 instanceof Error ? (e_8 instanceof Error ? e_8.message : String(e_8)) : String(e_8)));
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * MAINTENANCE WINDOW EXPIRY — Runs every 10 minutes.
         * Deactivates expired maintenance windows so alert suppression ends on time.
         */
        OperationsScheduler_1.prototype.expireMaintenanceWindows = function () {
            return __awaiter(this, void 0, void 0, function () {
                var expired, e_9;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.maintenanceWindow.updateMany({
                                                where: { isActive: true, endTime: { lt: new Date() } },
                                                data: { isActive: false },
                                            })];
                                    });
                                }); })];
                        case 1:
                            expired = _a.sent();
                            if (expired.count > 0) {
                                this.logger.log("[Maintenance Windows] Deactivated ".concat(expired.count, " expired maintenance windows"));
                            }
                            return [3 /*break*/, 3];
                        case 2:
                            e_9 = _a.sent();
                            this.logger.error("[Maintenance Windows] Expiry check failed: ".concat(e_9 instanceof Error ? e_9.message : String(e_9)));
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        return OperationsScheduler_1;
    }());
    __setFunctionName(_classThis, "OperationsScheduler");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _collectHealthPulse_decorators = [(0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_MINUTE)];
        _collectSystemMetrics_decorators = [(0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_5_MINUTES)];
        _monitorQueueDepth_decorators = [(0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_30_SECONDS)];
        _detectSlowEndpoints_decorators = [(0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_10_MINUTES)];
        _monitorErrorRates_decorators = [(0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_5_MINUTES)];
        _scheduleDailyBackups_decorators = [(0, schedule_1.Cron)('0 2 * * *')];
        _enforceBackupRetention_decorators = [(0, schedule_1.Cron)('0 3 * * *')];
        _enforceLogRetention_decorators = [(0, schedule_1.Cron)('0 4 * * 0')];
        _expireMaintenanceWindows_decorators = [(0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_10_MINUTES)];
        __esDecorate(_classThis, null, _collectHealthPulse_decorators, { kind: "method", name: "collectHealthPulse", static: false, private: false, access: { has: function (obj) { return "collectHealthPulse" in obj; }, get: function (obj) { return obj.collectHealthPulse; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _collectSystemMetrics_decorators, { kind: "method", name: "collectSystemMetrics", static: false, private: false, access: { has: function (obj) { return "collectSystemMetrics" in obj; }, get: function (obj) { return obj.collectSystemMetrics; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _monitorQueueDepth_decorators, { kind: "method", name: "monitorQueueDepth", static: false, private: false, access: { has: function (obj) { return "monitorQueueDepth" in obj; }, get: function (obj) { return obj.monitorQueueDepth; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _detectSlowEndpoints_decorators, { kind: "method", name: "detectSlowEndpoints", static: false, private: false, access: { has: function (obj) { return "detectSlowEndpoints" in obj; }, get: function (obj) { return obj.detectSlowEndpoints; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _monitorErrorRates_decorators, { kind: "method", name: "monitorErrorRates", static: false, private: false, access: { has: function (obj) { return "monitorErrorRates" in obj; }, get: function (obj) { return obj.monitorErrorRates; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _scheduleDailyBackups_decorators, { kind: "method", name: "scheduleDailyBackups", static: false, private: false, access: { has: function (obj) { return "scheduleDailyBackups" in obj; }, get: function (obj) { return obj.scheduleDailyBackups; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _enforceBackupRetention_decorators, { kind: "method", name: "enforceBackupRetention", static: false, private: false, access: { has: function (obj) { return "enforceBackupRetention" in obj; }, get: function (obj) { return obj.enforceBackupRetention; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _enforceLogRetention_decorators, { kind: "method", name: "enforceLogRetention", static: false, private: false, access: { has: function (obj) { return "enforceLogRetention" in obj; }, get: function (obj) { return obj.enforceLogRetention; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _expireMaintenanceWindows_decorators, { kind: "method", name: "expireMaintenanceWindows", static: false, private: false, access: { has: function (obj) { return "expireMaintenanceWindows" in obj; }, get: function (obj) { return obj.expireMaintenanceWindows; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        OperationsScheduler = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return OperationsScheduler = _classThis;
}();
exports.OperationsScheduler = OperationsScheduler;
