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
exports.ControlTowerService = void 0;
var common_1 = require("@nestjs/common");
var ControlTowerService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var ControlTowerService = _classThis = /** @class */ (function () {
        function ControlTowerService_1(prisma, cache) {
            this.prisma = prisma;
            this.cache = cache;
            this.logger = new common_1.Logger(ControlTowerService.name);
        }
        /**
         * Generates a real-time aggregate of fleet operations for the Control Tower Dashboard.
         * Target execution: < 150ms
         */
        ControlTowerService_1.prototype.getLiveDashboard = function (companyId) {
            return __awaiter(this, void 0, void 0, function () {
                var cacheKey, cached, _a, activeTrips, delayedTrips, idleVehicles, todayRevenue, todayCost, result;
                var _b;
                var _this = this;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            cacheKey = "control_tower:".concat(companyId, ":live");
                            return [4 /*yield*/, this.cache.get(cacheKey)];
                        case 1:
                            cached = _c.sent();
                            if (cached)
                                return [2 /*return*/, cached];
                            return [4 /*yield*/, Promise.all([
                                    this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                        return __generator(this, function (_a) {
                                            return [2 /*return*/, tx.trip.count({
                                                    where: { companyId: companyId, status: 'IN_PROGRESS' },
                                                })];
                                        });
                                    }); }),
                                    this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                        return __generator(this, function (_a) {
                                            return [2 /*return*/, tx.trip.count({
                                                    where: {
                                                        companyId: companyId,
                                                        status: 'IN_PROGRESS',
                                                        eta: { lt: new Date() },
                                                    },
                                                })];
                                        });
                                    }); }),
                                    this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                        return __generator(this, function (_a) {
                                            return [2 /*return*/, tx.vehicle.count({
                                                    where: { companyId: companyId, status: 'AVAILABLE' },
                                                })];
                                        });
                                    }); }),
                                    this.calculateTodayRevenue(companyId),
                                    this.calculateTodayCost(companyId),
                                ])];
                        case 2:
                            _a = _c.sent(), activeTrips = _a[0], delayedTrips = _a[1], idleVehicles = _a[2], todayRevenue = _a[3], todayCost = _a[4];
                            _b = {
                                activeTrips: activeTrips,
                                delayedTrips: delayedTrips,
                                offlineVehicles: 0, // Requires telemetry ping aggregation
                                idleVehicles: idleVehicles,
                                todayRevenue: todayRevenue,
                                todayCost: todayCost
                            };
                            return [4 /*yield*/, this.calculateUtilization(companyId)];
                        case 3:
                            result = (_b.fleetUtilization = _c.sent(),
                                _b.timestamp = new Date().toISOString(),
                                _b);
                            // Cache briefly for high-frequency dashboards (e.g. refreshed every 2-5 seconds by client)
                            return [4 /*yield*/, this.cache.set(cacheKey, result, 5)];
                        case 4:
                            // Cache briefly for high-frequency dashboards (e.g. refreshed every 2-5 seconds by client)
                            _c.sent(); // 5 seconds
                            return [2 /*return*/, result];
                    }
                });
            });
        };
        ControlTowerService_1.prototype.getActiveTripsWithDeviations = function (companyId) {
            return __awaiter(this, void 0, void 0, function () {
                var trips;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    return [2 /*return*/, tx.trip.findMany({
                                            where: { companyId: companyId, status: 'IN_PROGRESS' },
                                            include: {
                                                driver: true,
                                                vehicle: true,
                                                loads: true,
                                            },
                                            orderBy: { startDate: 'desc' },
                                            take: 100, // Limit for real-time board
                                        })];
                                });
                            }); })];
                        case 1:
                            trips = _a.sent();
                            return [2 /*return*/, trips.map(function (trip) {
                                    var _a, _b, _c;
                                    var isDelayed = trip.eta && new Date() > trip.eta;
                                    return {
                                        id: trip.id,
                                        tripNumber: trip.tripNumber,
                                        driver: trip.driver
                                            ? "".concat(trip.driver.firstName, " ").concat(trip.driver.lastName)
                                            : 'Unassigned',
                                        vehicle: ((_a = trip.vehicle) === null || _a === void 0 ? void 0 : _a.licensePlate) || 'Unassigned',
                                        origin: ((_b = trip.loads[0]) === null || _b === void 0 ? void 0 : _b.originCity) || 'Unknown',
                                        destination: ((_c = trip.loads[0]) === null || _c === void 0 ? void 0 : _c.destinationCity) || 'Unknown',
                                        eta: trip.eta,
                                        isDelayed: isDelayed,
                                        status: trip.status,
                                    };
                                })];
                    }
                });
            });
        };
        ControlTowerService_1.prototype.calculateTodayRevenue = function (companyId) {
            return __awaiter(this, void 0, void 0, function () {
                var today, invoices;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            today = new Date();
                            today.setHours(0, 0, 0, 0);
                            return [4 /*yield*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.invoice.aggregate({
                                                _sum: { amount: true },
                                                where: {
                                                    companyId: companyId,
                                                    createdAt: { gte: today },
                                                    status: { not: 'CANCELLED' },
                                                },
                                            })];
                                    });
                                }); })];
                        case 1:
                            invoices = _a.sent();
                            return [2 /*return*/, invoices._sum.amount || 0];
                    }
                });
            });
        };
        ControlTowerService_1.prototype.calculateTodayCost = function (companyId) {
            return __awaiter(this, void 0, void 0, function () {
                var today, trips;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            today = new Date();
                            today.setHours(0, 0, 0, 0);
                            return [4 /*yield*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.trip.aggregate({
                                                _sum: { fuelExpenses: true, otherExpenses: true },
                                                where: { companyId: companyId, startDate: { gte: today } },
                                            })];
                                    });
                                }); })];
                        case 1:
                            trips = _a.sent();
                            return [2 /*return*/, (trips._sum.fuelExpenses || 0) + (trips._sum.otherExpenses || 0)];
                    }
                });
            });
        };
        ControlTowerService_1.prototype.calculateUtilization = function (companyId) {
            return __awaiter(this, void 0, void 0, function () {
                var _a, totalVehicles, activeTrips;
                var _this = this;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, Promise.all([
                                this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                    return [2 /*return*/, tx.vehicle.count({ where: { companyId: companyId } })];
                                }); }); }),
                                this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.trip.count({
                                                where: { companyId: companyId, status: 'IN_PROGRESS' },
                                            })];
                                    });
                                }); }),
                            ])];
                        case 1:
                            _a = _b.sent(), totalVehicles = _a[0], activeTrips = _a[1];
                            if (totalVehicles === 0)
                                return [2 /*return*/, 0];
                            return [2 /*return*/, Math.round((activeTrips / totalVehicles) * 100)];
                    }
                });
            });
        };
        return ControlTowerService_1;
    }());
    __setFunctionName(_classThis, "ControlTowerService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ControlTowerService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ControlTowerService = _classThis;
}();
exports.ControlTowerService = ControlTowerService;
