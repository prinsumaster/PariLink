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
exports.GeofenceService = void 0;
var common_1 = require("@nestjs/common");
var event_emitter_1 = require("@nestjs/event-emitter");
var GeofenceService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _handleGpsPing_decorators;
    var GeofenceService = _classThis = /** @class */ (function () {
        function GeofenceService_1(prisma, eventService) {
            this.prisma = (__runInitializers(this, _instanceExtraInitializers), prisma);
            this.eventService = eventService;
            this.logger = new common_1.Logger(GeofenceService.name);
        }
        // Haversine distance formula
        GeofenceService_1.prototype.getDistance = function (lat1, lon1, lat2, lon2) {
            var R = 6371e3; // metres
            var φ1 = (lat1 * Math.PI) / 180; // φ, λ in radians
            var φ2 = (lat2 * Math.PI) / 180;
            var Δφ = ((lat2 - lat1) * Math.PI) / 180;
            var Δλ = ((lon2 - lon1) * Math.PI) / 180;
            var a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
                Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
            var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            return R * c; // in metres
        };
        GeofenceService_1.prototype.handleGpsPing = function (event) {
            return __awaiter(this, void 0, void 0, function () {
                var tenantId, payload, timestamp, vehicleId, latitude, longitude, geofences, _loop_1, this_1, _i, geofences_1, geofence;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            tenantId = event.tenantId, payload = event.payload, timestamp = event.timestamp;
                            vehicleId = payload.vehicleId, latitude = payload.latitude, longitude = payload.longitude;
                            return [4 /*yield*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.geofence.findMany({
                                                where: { companyId: tenantId, isActive: true },
                                            })];
                                    });
                                }); })];
                        case 1:
                            geofences = _a.sent();
                            _loop_1 = function (geofence) {
                                var distance, isInsideNow, lastEvent, wasInsideBefore, dwellTimeMs_1;
                                return __generator(this, function (_b) {
                                    switch (_b.label) {
                                        case 0:
                                            distance = this_1.getDistance(latitude, longitude, geofence.latitude, geofence.longitude);
                                            isInsideNow = distance <= geofence.radiusMeters;
                                            return [4 /*yield*/, this_1.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                                    return __generator(this, function (_a) {
                                                        return [2 /*return*/, tx.geofenceEvent.findFirst({
                                                                where: { vehicleId: vehicleId, geofenceId: geofence.id },
                                                                orderBy: { timestamp: 'desc' },
                                                            })];
                                                    });
                                                }); })];
                                        case 1:
                                            lastEvent = _b.sent();
                                            wasInsideBefore = (lastEvent === null || lastEvent === void 0 ? void 0 : lastEvent.eventType) === 'ENTER';
                                            if (!(isInsideNow && !wasInsideBefore)) return [3 /*break*/, 3];
                                            // Trigger ENTER event
                                            return [4 /*yield*/, this_1.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                                    return __generator(this, function (_a) {
                                                        return [2 /*return*/, tx.geofenceEvent.create({
                                                                data: {
                                                                    companyId: tenantId,
                                                                    geofenceId: geofence.id,
                                                                    vehicleId: vehicleId,
                                                                    eventType: 'ENTER',
                                                                    timestamp: new Date(timestamp),
                                                                },
                                                            })];
                                                    });
                                                }); })];
                                        case 2:
                                            // Trigger ENTER event
                                            _b.sent();
                                            this_1.eventService.publish('Geofence.Entered', {
                                                tenantId: tenantId,
                                                userId: 'SYSTEM',
                                                correlationId: event.correlationId,
                                                payload: {
                                                    vehicleId: vehicleId,
                                                    geofenceId: geofence.id,
                                                    geofenceName: geofence.name,
                                                },
                                                timestamp: new Date(timestamp),
                                            });
                                            this_1.logger.debug("Vehicle ".concat(vehicleId, " ENTERED geofence ").concat(geofence.name));
                                            return [3 /*break*/, 5];
                                        case 3:
                                            if (!(!isInsideNow && wasInsideBefore)) return [3 /*break*/, 5];
                                            dwellTimeMs_1 = new Date(timestamp).getTime() -
                                                new Date(lastEvent.timestamp).getTime();
                                            return [4 /*yield*/, this_1.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                                    return __generator(this, function (_a) {
                                                        return [2 /*return*/, tx.geofenceEvent.create({
                                                                data: {
                                                                    companyId: tenantId,
                                                                    geofenceId: geofence.id,
                                                                    vehicleId: vehicleId,
                                                                    eventType: 'EXIT',
                                                                    timestamp: new Date(timestamp),
                                                                    metadata: { dwellTimeMs: dwellTimeMs_1 },
                                                                },
                                                            })];
                                                    });
                                                }); })];
                                        case 4:
                                            _b.sent();
                                            this_1.eventService.publish('Geofence.Exited', {
                                                tenantId: tenantId,
                                                userId: 'SYSTEM',
                                                correlationId: event.correlationId,
                                                payload: {
                                                    vehicleId: vehicleId,
                                                    geofenceId: geofence.id,
                                                    geofenceName: geofence.name,
                                                    dwellTimeMs: dwellTimeMs_1,
                                                },
                                                timestamp: new Date(timestamp),
                                            });
                                            this_1.logger.debug("Vehicle ".concat(vehicleId, " EXITED geofence ").concat(geofence.name, " (Dwell: ").concat(Math.round(dwellTimeMs_1 / 60000), "m)"));
                                            _b.label = 5;
                                        case 5: return [2 /*return*/];
                                    }
                                });
                            };
                            this_1 = this;
                            _i = 0, geofences_1 = geofences;
                            _a.label = 2;
                        case 2:
                            if (!(_i < geofences_1.length)) return [3 /*break*/, 5];
                            geofence = geofences_1[_i];
                            return [5 /*yield**/, _loop_1(geofence)];
                        case 3:
                            _a.sent();
                            _a.label = 4;
                        case 4:
                            _i++;
                            return [3 /*break*/, 2];
                        case 5: return [2 /*return*/];
                    }
                });
            });
        };
        return GeofenceService_1;
    }());
    __setFunctionName(_classThis, "GeofenceService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _handleGpsPing_decorators = [(0, event_emitter_1.OnEvent)('GpsPing.Received')];
        __esDecorate(_classThis, null, _handleGpsPing_decorators, { kind: "method", name: "handleGpsPing", static: false, private: false, access: { has: function (obj) { return "handleGpsPing" in obj; }, get: function (obj) { return obj.handleGpsPing; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        GeofenceService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return GeofenceService = _classThis;
}();
exports.GeofenceService = GeofenceService;
