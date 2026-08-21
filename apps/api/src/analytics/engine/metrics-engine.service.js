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
exports.MetricsEngineService = void 0;
var common_1 = require("@nestjs/common");
var MetricsEngineService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var MetricsEngineService = _classThis = /** @class */ (function () {
        function MetricsEngineService_1(prisma, cache) {
            this.prisma = prisma;
            this.cache = cache;
            this.logger = new common_1.Logger(MetricsEngineService.name);
        }
        /**
         * Calculate Real-time KPI: Revenue
         */
        MetricsEngineService_1.prototype.getRevenueKPI = function (companyId, startDate, endDate) {
            return __awaiter(this, void 0, void 0, function () {
                var cacheKey, cached, invoices, totalRevenue, result;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            cacheKey = "kpi:revenue:".concat(companyId, ":").concat(startDate.toISOString(), ":").concat(endDate.toISOString());
                            return [4 /*yield*/, this.cache.getCachedMetric(cacheKey)];
                        case 1:
                            cached = _a.sent();
                            if (cached)
                                return [2 /*return*/, cached];
                            return [4 /*yield*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.invoice.findMany({
                                                where: {
                                                    companyId: companyId,
                                                    createdAt: { gte: startDate, lte: endDate },
                                                    status: { in: ['PAID', 'ISSUED'] }, // Issued represents recognized revenue
                                                },
                                                select: { amount: true },
                                            })];
                                    });
                                }); })];
                        case 2:
                            invoices = _a.sent();
                            totalRevenue = invoices.reduce(function (acc, inv) { return acc + (inv.amount || 0); }, 0);
                            result = { value: totalRevenue, currency: 'USD' };
                            return [4 /*yield*/, this.cache.setCachedMetric(cacheKey, result, 300)];
                        case 3:
                            _a.sent(); // Cache for 5 mins
                            return [2 /*return*/, result];
                    }
                });
            });
        };
        /**
         * Calculate Real-time KPI: Fleet Utilization
         */
        MetricsEngineService_1.prototype.getFleetUtilization = function (companyId) {
            return __awaiter(this, void 0, void 0, function () {
                var cacheKey, cached, totalVehicles, activeVehicles, util, result;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            cacheKey = "kpi:fleet_util:".concat(companyId);
                            return [4 /*yield*/, this.cache.getCachedMetric(cacheKey)];
                        case 1:
                            cached = _a.sent();
                            if (cached)
                                return [2 /*return*/, cached];
                            return [4 /*yield*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.vehicle.count({
                                                where: { companyId: companyId },
                                            })];
                                    });
                                }); })];
                        case 2:
                            totalVehicles = _a.sent();
                            if (totalVehicles === 0)
                                return [2 /*return*/, { percentage: 0 }];
                            return [4 /*yield*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.vehicle.count({
                                                where: { companyId: companyId, status: 'IN_TRANSIT' },
                                            })];
                                    });
                                }); })];
                        case 3:
                            activeVehicles = _a.sent();
                            util = (activeVehicles / totalVehicles) * 100;
                            result = {
                                percentage: util,
                                active: activeVehicles,
                                total: totalVehicles,
                            };
                            return [4 /*yield*/, this.cache.setCachedMetric(cacheKey, result, 60)];
                        case 4:
                            _a.sent(); // Cache for 1 min
                            return [2 /*return*/, result];
                    }
                });
            });
        };
        /**
         * Get all core KPIs for the Command Center
         */
        MetricsEngineService_1.prototype.getCommandCenterMetrics = function (companyId) {
            return __awaiter(this, void 0, void 0, function () {
                var now, thirtyDaysAgo, _a, revenue, fleet, tripsCompleted, customers;
                var _this = this;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            now = new Date();
                            thirtyDaysAgo = new Date();
                            thirtyDaysAgo.setDate(now.getDate() - 30);
                            return [4 /*yield*/, Promise.all([
                                    this.getRevenueKPI(companyId, thirtyDaysAgo, now),
                                    this.getFleetUtilization(companyId),
                                    this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                        return __generator(this, function (_a) {
                                            return [2 /*return*/, tx.trip.count({
                                                    where: {
                                                        companyId: companyId,
                                                        status: 'COMPLETED',
                                                        createdAt: { gte: thirtyDaysAgo },
                                                    },
                                                })];
                                        });
                                    }); }),
                                    this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.customer.count({ where: { companyId: companyId } })];
                                    }); }); }),
                                ])];
                        case 1:
                            _a = _b.sent(), revenue = _a[0], fleet = _a[1], tripsCompleted = _a[2], customers = _a[3];
                            return [2 /*return*/, {
                                    revenue: revenue,
                                    fleetUtilization: fleet,
                                    tripsCompleted30d: tripsCompleted,
                                    totalCustomers: customers,
                                }];
                    }
                });
            });
        };
        return MetricsEngineService_1;
    }());
    __setFunctionName(_classThis, "MetricsEngineService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        MetricsEngineService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return MetricsEngineService = _classThis;
}();
exports.MetricsEngineService = MetricsEngineService;
