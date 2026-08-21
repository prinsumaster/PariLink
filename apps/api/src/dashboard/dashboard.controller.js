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
exports.ExecutiveDashboardController = void 0;
var common_1 = require("@nestjs/common");
var jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
var ExecutiveDashboardController = function () {
    var _classDecorators = [(0, common_1.Controller)('dashboard'), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard)];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _getCeoMetrics_decorators;
    var _getKPIs_decorators;
    var _getVehicles_decorators;
    var _getAlerts_decorators;
    var _getAIRecommendations_decorators;
    var _getShipments_decorators;
    var ExecutiveDashboardController = _classThis = /** @class */ (function () {
        function ExecutiveDashboardController_1(prisma) {
            this.prisma = (__runInitializers(this, _instanceExtraInitializers), prisma);
        }
        ExecutiveDashboardController_1.prototype.getCeoMetrics = function (req) {
            return __awaiter(this, void 0, void 0, function () {
                var companyId, today, _a, revenue, expenses, activeTrips, idleTrucks;
                var _this = this;
                var _b, _c, _d, _e;
                return __generator(this, function (_f) {
                    switch (_f.label) {
                        case 0:
                            companyId = req.user.companyId;
                            today = new Date();
                            today.setHours(0, 0, 0, 0);
                            return [4 /*yield*/, Promise.all([
                                    this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                        return __generator(this, function (_a) {
                                            return [2 /*return*/, tx.invoice.aggregate({
                                                    _sum: { amount: true },
                                                    where: {
                                                        companyId: companyId,
                                                        createdAt: { gte: today },
                                                        status: { in: ['GENERATED', 'PAID'] },
                                                    },
                                                })];
                                        });
                                    }); }),
                                    this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                        return __generator(this, function (_a) {
                                            return [2 /*return*/, tx.expense.aggregate({
                                                    _sum: { amount: true },
                                                    where: { companyId: companyId, date: { gte: today } },
                                                })];
                                        });
                                    }); }),
                                    this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                        return __generator(this, function (_a) {
                                            return [2 /*return*/, tx.trip.count({
                                                    where: { companyId: companyId, status: 'IN_TRANSIT' },
                                                })];
                                        });
                                    }); }),
                                    this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                        return __generator(this, function (_a) {
                                            return [2 /*return*/, tx.vehicle.count({
                                                    where: {
                                                        companyId: companyId,
                                                        status: 'ACTIVE',
                                                        tripsVehicle: { none: { status: 'IN_TRANSIT' } },
                                                    },
                                                })];
                                        });
                                    }); }),
                                ])];
                        case 1:
                            _a = _f.sent(), revenue = _a[0], expenses = _a[1], activeTrips = _a[2], idleTrucks = _a[3];
                            return [2 /*return*/, {
                                    todaysRevenue: ((_b = revenue._sum) === null || _b === void 0 ? void 0 : _b.amount) || 0,
                                    todaysExpenses: ((_c = expenses._sum) === null || _c === void 0 ? void 0 : _c.amount) || 0,
                                    activeTrips: activeTrips,
                                    idleTrucks: idleTrucks,
                                    cashPosition: (((_d = revenue._sum) === null || _d === void 0 ? void 0 : _d.amount) || 0) - (((_e = expenses._sum) === null || _e === void 0 ? void 0 : _e.amount) || 0),
                                }];
                    }
                });
            });
        };
        ExecutiveDashboardController_1.prototype.getKPIs = function (req) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    // Return structured default data mapped to KPIData interface until fully wired
                    return [2 /*return*/, {
                            activeShipments: { value: 0, change: 0, trend: 'neutral' },
                            deliveriesToday: { value: 0, change: 0, trend: 'neutral' },
                            fleetUtilization: { value: 0, change: 0, trend: 'neutral' },
                            delayedShipments: { value: 0, change: 0, trend: 'neutral' },
                            revenue: { value: 0, change: 0, trend: 'neutral' },
                            profitMargin: { value: 0, change: 0, trend: 'neutral' },
                            fuelEfficiency: { value: 0, change: 0, trend: 'neutral' },
                            maintenanceAlerts: { value: 0, change: 0, trend: 'neutral' },
                            vehiclesOnline: { value: 0, total: 0 },
                            driversOnline: { value: 0, total: 0 },
                            averageEtaMinutes: { value: 0, change: 0, trend: 'neutral' },
                            revenueToday: { value: 0, change: 0, trend: 'neutral' },
                        }];
                });
            });
        };
        ExecutiveDashboardController_1.prototype.getVehicles = function (req) {
            return __awaiter(this, void 0, void 0, function () {
                var companyId, vehicles;
                var _this = this;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            companyId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.companyId;
                            if (!companyId)
                                return [2 /*return*/, []];
                            return [4 /*yield*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.vehicle.findMany({
                                                where: { companyId: companyId, status: 'ACTIVE' },
                                                take: 100,
                                            })];
                                    });
                                }); })];
                        case 1:
                            vehicles = _b.sent();
                            return [2 /*return*/, vehicles.map(function (v) { return ({
                                    id: v.id,
                                    name: v.licensePlate || 'Unknown',
                                    lat: 0, // Fallback coordinates
                                    lng: 0,
                                    status: 'IDLE',
                                    heading: 0,
                                    speed: 0
                                }); })];
                    }
                });
            });
        };
        ExecutiveDashboardController_1.prototype.getAlerts = function (req) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, []]; // Return empty array to prevent 404
                });
            });
        };
        ExecutiveDashboardController_1.prototype.getAIRecommendations = function (req) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, []]; // Return empty array to prevent 404
                });
            });
        };
        ExecutiveDashboardController_1.prototype.getShipments = function (req) {
            return __awaiter(this, void 0, void 0, function () {
                var companyId, loads;
                var _this = this;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            companyId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.companyId;
                            if (!companyId)
                                return [2 /*return*/, []];
                            return [4 /*yield*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.load.findMany({
                                                where: { companyId: companyId },
                                                take: 50,
                                                orderBy: { createdAt: 'desc' }
                                            })];
                                    });
                                }); })];
                        case 1:
                            loads = _b.sent();
                            return [2 /*return*/, loads.map(function (load) { return ({
                                    id: load.id,
                                    trackingNumber: load.referenceNumber || load.id.slice(0, 8).toUpperCase(),
                                    status: load.status,
                                    origin: "".concat(load.originCity, ", ").concat(load.originState),
                                    destination: "".concat(load.destinationCity, ", ").concat(load.destinationState),
                                    eta: new Date().toISOString(),
                                    slaStatus: 'MET'
                                }); })];
                    }
                });
            });
        };
        return ExecutiveDashboardController_1;
    }());
    __setFunctionName(_classThis, "ExecutiveDashboardController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _getCeoMetrics_decorators = [(0, common_1.Get)('ceo')];
        _getKPIs_decorators = [(0, common_1.Get)('kpis')];
        _getVehicles_decorators = [(0, common_1.Get)('vehicles')];
        _getAlerts_decorators = [(0, common_1.Get)('alerts')];
        _getAIRecommendations_decorators = [(0, common_1.Get)('ai/recommendations')];
        _getShipments_decorators = [(0, common_1.Get)('shipments')];
        __esDecorate(_classThis, null, _getCeoMetrics_decorators, { kind: "method", name: "getCeoMetrics", static: false, private: false, access: { has: function (obj) { return "getCeoMetrics" in obj; }, get: function (obj) { return obj.getCeoMetrics; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getKPIs_decorators, { kind: "method", name: "getKPIs", static: false, private: false, access: { has: function (obj) { return "getKPIs" in obj; }, get: function (obj) { return obj.getKPIs; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getVehicles_decorators, { kind: "method", name: "getVehicles", static: false, private: false, access: { has: function (obj) { return "getVehicles" in obj; }, get: function (obj) { return obj.getVehicles; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getAlerts_decorators, { kind: "method", name: "getAlerts", static: false, private: false, access: { has: function (obj) { return "getAlerts" in obj; }, get: function (obj) { return obj.getAlerts; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getAIRecommendations_decorators, { kind: "method", name: "getAIRecommendations", static: false, private: false, access: { has: function (obj) { return "getAIRecommendations" in obj; }, get: function (obj) { return obj.getAIRecommendations; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getShipments_decorators, { kind: "method", name: "getShipments", static: false, private: false, access: { has: function (obj) { return "getShipments" in obj; }, get: function (obj) { return obj.getShipments; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ExecutiveDashboardController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ExecutiveDashboardController = _classThis;
}();
exports.ExecutiveDashboardController = ExecutiveDashboardController;
