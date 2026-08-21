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
exports.LiveFleetService = void 0;
var common_1 = require("@nestjs/common");
var LiveFleetService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var LiveFleetService = _classThis = /** @class */ (function () {
        function LiveFleetService_1(prisma, cache, eventStore) {
            this.prisma = prisma;
            this.cache = cache;
            this.eventStore = eventStore;
            this.logger = new common_1.Logger(LiveFleetService.name);
        }
        /**
         * Fast real-time fleet map API. Returns all active vehicles and their last known location.
         * Target execution: < 50ms
         */
        LiveFleetService_1.prototype.getLiveMap = function (companyId) {
            return __awaiter(this, void 0, void 0, function () {
                var cacheKey, cached, activeTrips, activeVehiclesIds, locations, mapData;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            cacheKey = "fleet_map:".concat(companyId);
                            return [4 /*yield*/, this.cache.get(cacheKey)];
                        case 1:
                            cached = _a.sent();
                            if (cached)
                                return [2 /*return*/, cached];
                            return [4 /*yield*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.trip.findMany({
                                                where: { companyId: companyId, status: 'IN_PROGRESS' },
                                                include: {
                                                    vehicle: true,
                                                    driver: true,
                                                    loads: { select: { originCity: true, destinationCity: true } },
                                                },
                                            })];
                                    });
                                }); })];
                        case 2:
                            activeTrips = _a.sent();
                            activeVehiclesIds = activeTrips
                                .map(function (t) { return t.vehicleId; })
                                .filter(Boolean);
                            return [4 /*yield*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.vehicleLocation.findMany({
                                                where: { companyId: companyId }, // We'd filter by vehicle ID if we had mapping, but providerVehicleId is used.
                                                orderBy: { gpsTimestamp: 'desc' },
                                                take: 500, // naive optimization for demonstration
                                            })];
                                    });
                                }); })];
                        case 3:
                            locations = _a.sent();
                            mapData = activeTrips.map(function (trip) {
                                var _a, _b, _c;
                                var loc = locations.find(function (l) { var _a; return l.providerVehicleId === ((_a = trip.vehicle) === null || _a === void 0 ? void 0 : _a.licensePlate); });
                                return {
                                    tripId: trip.id,
                                    vehicleId: trip.vehicleId,
                                    registration: (_a = trip.vehicle) === null || _a === void 0 ? void 0 : _a.licensePlate,
                                    driverName: trip.driver
                                        ? "".concat(trip.driver.firstName, " ").concat(trip.driver.lastName)
                                        : 'Unassigned',
                                    origin: (_b = trip.loads[0]) === null || _b === void 0 ? void 0 : _b.originCity,
                                    destination: (_c = trip.loads[0]) === null || _c === void 0 ? void 0 : _c.destinationCity,
                                    latitude: (loc === null || loc === void 0 ? void 0 : loc.latitude) || 0,
                                    longitude: (loc === null || loc === void 0 ? void 0 : loc.longitude) || 0,
                                    speed: (loc === null || loc === void 0 ? void 0 : loc.speed) || 0,
                                    heading: (loc === null || loc === void 0 ? void 0 : loc.heading) || 0,
                                    lastUpdate: (loc === null || loc === void 0 ? void 0 : loc.gpsTimestamp) || trip.startDate,
                                    status: trip.status,
                                };
                            });
                            return [4 /*yield*/, this.cache.set(cacheKey, mapData, 2)];
                        case 4:
                            _a.sent(); // 2 second cache TTL to meet GPS refresh < 2 sec target
                            return [2 /*return*/, mapData];
                    }
                });
            });
        };
        /**
         * Background task to detect geofence and idle violations on incoming telemetry
         */
        LiveFleetService_1.prototype.evaluateTelemetryRules = function (companyId, vehicleId, latitude, longitude, speed) {
            return __awaiter(this, void 0, void 0, function () {
                var idleKey, idleStart, idleDurationMs;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!(speed === 0)) return [3 /*break*/, 7];
                            idleKey = "idle:".concat(vehicleId);
                            return [4 /*yield*/, this.cache.get(idleKey)];
                        case 1:
                            idleStart = _a.sent();
                            if (!!idleStart) return [3 /*break*/, 3];
                            return [4 /*yield*/, this.cache.set(idleKey, Date.now(), 3600)];
                        case 2:
                            _a.sent(); // Set idle start
                            return [3 /*break*/, 6];
                        case 3:
                            idleDurationMs = Date.now() - idleStart;
                            if (!(idleDurationMs > 15 * 60 * 1000)) return [3 /*break*/, 6];
                            // 15 minutes
                            // Fire idle alert
                            return [4 /*yield*/, this.eventStore.append({
                                    tenantId: companyId,
                                    streamId: vehicleId,
                                    streamType: 'VEHICLE',
                                    eventType: 'ExcessiveIdlingDetected',
                                    payload: {
                                        durationMinutes: Math.round(idleDurationMs / 60000),
                                        location: { latitude: latitude, longitude: longitude },
                                    },
                                    userId: 'SYSTEM',
                                })];
                        case 4:
                            // 15 minutes
                            // Fire idle alert
                            _a.sent();
                            // clear cache to prevent spam
                            return [4 /*yield*/, this.cache.delete(idleKey)];
                        case 5:
                            // clear cache to prevent spam
                            _a.sent();
                            _a.label = 6;
                        case 6: return [3 /*break*/, 9];
                        case 7: 
                        // Clear idle cache if moving
                        return [4 /*yield*/, this.cache.delete("idle:".concat(vehicleId))];
                        case 8:
                            // Clear idle cache if moving
                            _a.sent();
                            _a.label = 9;
                        case 9: return [2 /*return*/];
                    }
                });
            });
        };
        return LiveFleetService_1;
    }());
    __setFunctionName(_classThis, "LiveFleetService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        LiveFleetService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return LiveFleetService = _classThis;
}();
exports.LiveFleetService = LiveFleetService;
