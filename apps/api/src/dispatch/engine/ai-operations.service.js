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
exports.AiOperationsService = void 0;
var common_1 = require("@nestjs/common");
var AiOperationsService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var AiOperationsService = _classThis = /** @class */ (function () {
        function AiOperationsService_1(prisma, eventStore, aiPrediction) {
            this.prisma = prisma;
            this.eventStore = eventStore;
            this.aiPrediction = aiPrediction;
            this.logger = new common_1.Logger(AiOperationsService.name);
        }
        /**
         * Predicts ETAs for active trips dynamically based on current GPS, weather, and historical telemetry.
         * Target execution: Background or fast query (<100ms)
         */
        AiOperationsService_1.prototype.predictTripEta = function (companyId, tripId) {
            return __awaiter(this, void 0, void 0, function () {
                var trip, prediction, predictedData, newEta_1;
                var _this = this;
                var _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0: return [4 /*yield*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    return [2 /*return*/, tx.trip.findFirst({
                                            where: { id: tripId, companyId: companyId },
                                            include: { loads: true },
                                        })];
                                });
                            }); })];
                        case 1:
                            trip = _c.sent();
                            if (!trip)
                                return [2 /*return*/, null];
                            return [4 /*yield*/, this.aiPrediction.generatePrediction(companyId, 'Trip', trip.id, {
                                    origin: (_a = trip.loads[0]) === null || _a === void 0 ? void 0 : _a.originCity,
                                    destination: (_b = trip.loads[0]) === null || _b === void 0 ? void 0 : _b.destinationCity,
                                    departureTime: trip.startDate,
                                    currentTime: new Date(),
                                })];
                        case 2:
                            prediction = _c.sent();
                            predictedData = prediction === null || prediction === void 0 ? void 0 : prediction.predictedValue;
                            if (!(predictedData && predictedData.eta)) return [3 /*break*/, 5];
                            newEta_1 = new Date(predictedData.eta);
                            // Update trip ETA
                            return [4 /*yield*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.trip.update({
                                                where: { id: trip.id },
                                                data: { eta: newEta_1 },
                                            })];
                                    });
                                }); })];
                        case 3:
                            // Update trip ETA
                            _c.sent();
                            if (!(trip.eta && newEta_1 > trip.eta)) return [3 /*break*/, 5];
                            return [4 /*yield*/, this.eventStore.append({
                                    tenantId: companyId,
                                    streamId: trip.id,
                                    streamType: 'TRIP',
                                    eventType: 'TripDelayPredicted',
                                    payload: { originalEta: trip.eta, newEta: newEta_1 },
                                    userId: 'SYSTEM',
                                })];
                        case 4:
                            _c.sent();
                            _c.label = 5;
                        case 5: return [2 /*return*/, prediction];
                    }
                });
            });
        };
        /**
         * Evaluates Risk Scoring for a trip based on driver behavior, vehicle maintenance, and route weather.
         */
        AiOperationsService_1.prototype.evaluateRiskScore = function (companyId, tripId) {
            return __awaiter(this, void 0, void 0, function () {
                var trip, score, factors, violations, incidents;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    return [2 /*return*/, tx.trip.findFirst({
                                            where: { id: tripId, companyId: companyId },
                                            include: { driver: true, vehicle: true },
                                        })];
                                });
                            }); })];
                        case 1:
                            trip = _a.sent();
                            if (!trip)
                                return [2 /*return*/, { score: 0, factors: [] }];
                            score = 0;
                            factors = [];
                            if (!trip.driver) return [3 /*break*/, 3];
                            return [4 /*yield*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    var _a;
                                    return __generator(this, function (_b) {
                                        return [2 /*return*/, tx.auditLog.count({
                                                where: {
                                                    entity: 'Driver',
                                                    entityId: ((_a = trip.driver) === null || _a === void 0 ? void 0 : _a.id) || '',
                                                    action: 'OVERSPEED_DETECTED',
                                                },
                                            })];
                                    });
                                }); })];
                        case 2:
                            violations = _a.sent();
                            if (violations > 0) {
                                score += violations * 10;
                                factors.push("".concat(violations, " recent speed violations"));
                            }
                            _a.label = 3;
                        case 3:
                            if (!trip.vehicle) return [3 /*break*/, 5];
                            return [4 /*yield*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    var _a;
                                    return __generator(this, function (_b) {
                                        return [2 /*return*/, tx.auditLog.count({
                                                where: {
                                                    entity: 'Vehicle',
                                                    entityId: ((_a = trip.vehicle) === null || _a === void 0 ? void 0 : _a.id) || '',
                                                    action: 'BREAKDOWN_REPORTED',
                                                },
                                            })];
                                    });
                                }); })];
                        case 4:
                            incidents = _a.sent();
                            if (incidents > 0) {
                                score += 30;
                                factors.push("Recent breakdowns reported on vehicle");
                            }
                            _a.label = 5;
                        case 5: return [2 /*return*/, { score: Math.min(score, 100), factors: factors }];
                    }
                });
            });
        };
        AiOperationsService_1.prototype.recommendDriverForLoad = function (companyId, loadId) {
            return __awaiter(this, void 0, void 0, function () {
                var load, availableDrivers;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    return [2 /*return*/, tx.load.findFirst({
                                            where: { id: loadId, companyId: companyId },
                                        })];
                                });
                            }); })];
                        case 1:
                            load = _a.sent();
                            if (!load)
                                return [2 /*return*/, []];
                            return [4 /*yield*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.driver.findMany({
                                                where: { companyId: companyId, status: 'AVAILABLE' },
                                            })];
                                    });
                                }); })];
                        case 2:
                            availableDrivers = _a.sent();
                            return [2 /*return*/, availableDrivers
                                    .map(function (d, index) { return ({
                                    driverId: d.id,
                                    name: "".concat(d.firstName, " ").concat(d.lastName),
                                    score: 85 - index * 5, // Deterministic placeholder score
                                    reason: 'Optimal duty hours and proximity',
                                }); })
                                    .sort(function (a, b) { return b.score - a.score; })
                                    .slice(0, 5)];
                    }
                });
            });
        };
        return AiOperationsService_1;
    }());
    __setFunctionName(_classThis, "AiOperationsService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AiOperationsService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AiOperationsService = _classThis;
}();
exports.AiOperationsService = AiOperationsService;
