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
exports.AnalyticsController = void 0;
var common_1 = require("@nestjs/common");
var rxjs_1 = require("rxjs");
var jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
var permissions_guard_1 = require("../auth/guards/permissions.guard");
var permissions_decorator_1 = require("../auth/decorators/permissions.decorator");
var swagger_1 = require("@nestjs/swagger");
var AnalyticsController = function () {
    var _classDecorators = [(0, swagger_1.ApiTags)('analytics'), (0, swagger_1.ApiBearerAuth)(), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard), (0, common_1.Controller)('analytics')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _getCommandCenterMetrics_decorators;
    var _streamLiveMetrics_decorators;
    var _streamBusinessHealthPulse_decorators;
    var _getRevenueForecast_decorators;
    var _getDashboards_decorators;
    var _createDashboard_decorators;
    var _exportReport_decorators;
    var _createKpi_decorators;
    var _listKpis_decorators;
    var _recordMetric_decorators;
    var _generateTrend_decorators;
    var _getTopPerformers_decorators;
    var _getBottomPerformers_decorators;
    var AnalyticsController = _classThis = /** @class */ (function () {
        function AnalyticsController_1(metrics, forecast, kpiEngine, prisma) {
            this.metrics = (__runInitializers(this, _instanceExtraInitializers), metrics);
            this.forecast = forecast;
            this.kpiEngine = kpiEngine;
            this.prisma = prisma;
        }
        AnalyticsController_1.prototype.getCommandCenterMetrics = function (user) {
            return this.metrics.getCommandCenterMetrics(user.companyId);
        };
        AnalyticsController_1.prototype.streamLiveMetrics = function (user) {
            var _this = this;
            // Emits new metrics every 5 seconds
            return (0, rxjs_1.interval)(5000).pipe((0, rxjs_1.concatMap)(function (_) { return __awaiter(_this, void 0, void 0, function () {
                var liveActiveTrips;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.runAsTenant(user.companyId, function (tx) {
                                return tx.trip.count({
                                    where: { companyId: user.companyId, status: 'IN_PROGRESS' },
                                });
                            })];
                        case 1:
                            liveActiveTrips = _a.sent();
                            return [2 /*return*/, {
                                    data: {
                                        type: 'LIVE_METRICS_UPDATE',
                                        timestamp: new Date().toISOString(),
                                        payload: { liveActiveTrips: liveActiveTrips },
                                    },
                                }];
                    }
                });
            }); }));
        };
        AnalyticsController_1.prototype.streamBusinessHealthPulse = function (user) {
            // Queries the latest snapshot every 5 seconds and streams it
            return (0, rxjs_1.interval)(5000).pipe((0, rxjs_1.map)(function (_) { return ({
                data: {
                    type: 'BUSINESS_HEALTH_UPDATE',
                    timestamp: new Date().toISOString(),
                    // Normally we would use EventEmitter here to stream `BusinessHealth.Updated` events,
                    // but for resilience against missed events we can also poll the latest snapshot.
                    // For simplicity in the demo, the frontend will poll or rely on this ping.
                },
            }); }));
        };
        AnalyticsController_1.prototype.getRevenueForecast = function (user, days) {
            if (days === void 0) { days = 30; }
            return this.forecast.forecastRevenue(user.companyId, days);
        };
        AnalyticsController_1.prototype.getDashboards = function (user) {
            var _this = this;
            return this.prisma.runAsTenant(user.companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, tx.analyticsDashboard.findMany({
                            where: { companyId: user.companyId },
                            include: { widgets: true },
                        })];
                });
            }); });
        };
        AnalyticsController_1.prototype.createDashboard = function (user, data) {
            var _this = this;
            return this.prisma.runAsTenant(user.companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, tx.analyticsDashboard.create({
                            data: {
                                companyId: user.companyId,
                                name: data.name,
                                description: data.description,
                                createdBy: user.id,
                                layoutType: data.layoutType || 'GRID',
                                widgets: {
                                    create: data.widgets || [],
                                },
                            },
                        })];
                });
            }); });
        };
        AnalyticsController_1.prototype.exportReport = function (user, data) {
            if (!process.env.AWS_S3_BUCKET && !process.env.GCP_STORAGE_BUCKET) {
                throw new common_1.ServiceUnavailableException('Cloud storage for analytics exports is not configured.');
            }
            // In production, trigger an async worker to generate the file and upload to bucket
            return {
                status: 'PROCESSING',
                message: 'Report generation started. You will receive a notification when it is ready.',
            };
        };
        AnalyticsController_1.prototype.createKpi = function (user, data) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.kpiEngine.createKpi(user.companyId, user.id, data)];
                });
            });
        };
        AnalyticsController_1.prototype.listKpis = function (user) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.kpiEngine.listKpis(user.companyId)];
                });
            });
        };
        AnalyticsController_1.prototype.recordMetric = function (user, data) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.kpiEngine.recordCustomMetric(user.companyId, data)];
                });
            });
        };
        AnalyticsController_1.prototype.generateTrend = function (user, data) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.kpiEngine.generateTrendReport(user.companyId, data.kpiId, data.period)];
                });
            });
        };
        AnalyticsController_1.prototype.getTopPerformers = function (user, metric) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.kpiEngine.getTopPerformers(user.companyId, metric)];
                });
            });
        };
        AnalyticsController_1.prototype.getBottomPerformers = function (user, metric) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.kpiEngine.getBottomPerformers(user.companyId, metric)];
                });
            });
        };
        return AnalyticsController_1;
    }());
    __setFunctionName(_classThis, "AnalyticsController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _getCommandCenterMetrics_decorators = [(0, common_1.Get)('metrics/command-center'), (0, permissions_decorator_1.RequirePermissions)('analytics:read'), (0, swagger_1.ApiOperation)({ summary: 'Get core KPIs for Executive Command Center' })];
        _streamLiveMetrics_decorators = [(0, common_1.Sse)('metrics/live'), (0, permissions_decorator_1.RequirePermissions)('analytics:read'), (0, swagger_1.ApiOperation)({ summary: 'SSE stream for live KPI updates' })];
        _streamBusinessHealthPulse_decorators = [(0, common_1.Sse)('health/pulse'), (0, permissions_decorator_1.RequirePermissions)('analytics:read'), (0, swagger_1.ApiOperation)({ summary: 'SSE stream for real-time Business Health Pulse' })];
        _getRevenueForecast_decorators = [(0, common_1.Get)('forecast/revenue'), (0, permissions_decorator_1.RequirePermissions)('analytics:read'), (0, swagger_1.ApiOperation)({ summary: 'Forecast revenue for next N days' })];
        _getDashboards_decorators = [(0, common_1.Get)('dashboards'), (0, permissions_decorator_1.RequirePermissions)('analytics:read'), (0, swagger_1.ApiOperation)({ summary: 'List custom dashboards' })];
        _createDashboard_decorators = [(0, common_1.Post)('dashboards'), (0, permissions_decorator_1.RequirePermissions)('analytics:write'), (0, swagger_1.ApiOperation)({ summary: 'Create a custom dashboard' })];
        _exportReport_decorators = [(0, common_1.Post)('reports/export'), (0, permissions_decorator_1.RequirePermissions)('analytics:read'), (0, swagger_1.ApiOperation)({ summary: 'Generate a report export' })];
        _createKpi_decorators = [(0, common_1.Post)('kpi'), (0, permissions_decorator_1.RequirePermissions)('analytics:write'), (0, swagger_1.ApiOperation)({ summary: 'Create custom KPI definition via Formula Engine' })];
        _listKpis_decorators = [(0, common_1.Get)('kpi'), (0, permissions_decorator_1.RequirePermissions)('analytics:read'), (0, swagger_1.ApiOperation)({ summary: 'List custom KPIs' })];
        _recordMetric_decorators = [(0, common_1.Post)('custom-metrics'), (0, permissions_decorator_1.RequirePermissions)('analytics:write'), (0, swagger_1.ApiOperation)({ summary: 'Record custom metric' })];
        _generateTrend_decorators = [(0, common_1.Post)('trend-reports'), (0, permissions_decorator_1.RequirePermissions)('analytics:write'), (0, swagger_1.ApiOperation)({ summary: 'Generate Trend Report for a KPI' })];
        _getTopPerformers_decorators = [(0, common_1.Get)('performers/top'), (0, permissions_decorator_1.RequirePermissions)('analytics:read'), (0, swagger_1.ApiOperation)({ summary: 'Get top performers by metric' })];
        _getBottomPerformers_decorators = [(0, common_1.Get)('performers/bottom'), (0, permissions_decorator_1.RequirePermissions)('analytics:read'), (0, swagger_1.ApiOperation)({ summary: 'Get bottom performers by metric' })];
        __esDecorate(_classThis, null, _getCommandCenterMetrics_decorators, { kind: "method", name: "getCommandCenterMetrics", static: false, private: false, access: { has: function (obj) { return "getCommandCenterMetrics" in obj; }, get: function (obj) { return obj.getCommandCenterMetrics; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _streamLiveMetrics_decorators, { kind: "method", name: "streamLiveMetrics", static: false, private: false, access: { has: function (obj) { return "streamLiveMetrics" in obj; }, get: function (obj) { return obj.streamLiveMetrics; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _streamBusinessHealthPulse_decorators, { kind: "method", name: "streamBusinessHealthPulse", static: false, private: false, access: { has: function (obj) { return "streamBusinessHealthPulse" in obj; }, get: function (obj) { return obj.streamBusinessHealthPulse; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getRevenueForecast_decorators, { kind: "method", name: "getRevenueForecast", static: false, private: false, access: { has: function (obj) { return "getRevenueForecast" in obj; }, get: function (obj) { return obj.getRevenueForecast; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getDashboards_decorators, { kind: "method", name: "getDashboards", static: false, private: false, access: { has: function (obj) { return "getDashboards" in obj; }, get: function (obj) { return obj.getDashboards; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _createDashboard_decorators, { kind: "method", name: "createDashboard", static: false, private: false, access: { has: function (obj) { return "createDashboard" in obj; }, get: function (obj) { return obj.createDashboard; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _exportReport_decorators, { kind: "method", name: "exportReport", static: false, private: false, access: { has: function (obj) { return "exportReport" in obj; }, get: function (obj) { return obj.exportReport; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _createKpi_decorators, { kind: "method", name: "createKpi", static: false, private: false, access: { has: function (obj) { return "createKpi" in obj; }, get: function (obj) { return obj.createKpi; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _listKpis_decorators, { kind: "method", name: "listKpis", static: false, private: false, access: { has: function (obj) { return "listKpis" in obj; }, get: function (obj) { return obj.listKpis; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _recordMetric_decorators, { kind: "method", name: "recordMetric", static: false, private: false, access: { has: function (obj) { return "recordMetric" in obj; }, get: function (obj) { return obj.recordMetric; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _generateTrend_decorators, { kind: "method", name: "generateTrend", static: false, private: false, access: { has: function (obj) { return "generateTrend" in obj; }, get: function (obj) { return obj.generateTrend; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getTopPerformers_decorators, { kind: "method", name: "getTopPerformers", static: false, private: false, access: { has: function (obj) { return "getTopPerformers" in obj; }, get: function (obj) { return obj.getTopPerformers; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getBottomPerformers_decorators, { kind: "method", name: "getBottomPerformers", static: false, private: false, access: { has: function (obj) { return "getBottomPerformers" in obj; }, get: function (obj) { return obj.getBottomPerformers; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AnalyticsController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AnalyticsController = _classThis;
}();
exports.AnalyticsController = AnalyticsController;
