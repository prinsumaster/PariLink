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
exports.GeofenceEngineService = void 0;
var common_1 = require("@nestjs/common");
var GeofenceEngineService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var GeofenceEngineService = _classThis = /** @class */ (function () {
        function GeofenceEngineService_1(prisma, audit) {
            this.prisma = prisma;
            this.audit = audit;
            this.logger = new common_1.Logger(GeofenceEngineService.name);
        }
        GeofenceEngineService_1.prototype.createGeofence = function (companyId, userId, dto) {
            return __awaiter(this, void 0, void 0, function () {
                var geofence;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    return [2 /*return*/, tx.geofence.create({
                                            data: {
                                                companyId: companyId,
                                                name: dto.name,
                                                description: dto.description || null,
                                                type: dto.type,
                                                latitude: dto.latitude,
                                                longitude: dto.longitude,
                                                radiusMeters: dto.radiusMeters || 100,
                                                polygon: dto.polygon ? dto.polygon : undefined,
                                                isActive: dto.isActive !== undefined ? dto.isActive : true,
                                            },
                                        })];
                                });
                            }); })];
                        case 1:
                            geofence = _a.sent();
                            return [4 /*yield*/, this.audit.logEvent({
                                    action: 'geofence:create',
                                    entity: 'Geofence',
                                    entityId: geofence.id,
                                    userId: userId,
                                    companyId: companyId,
                                    details: {
                                        name: geofence.name,
                                        type: geofence.type,
                                        radiusMeters: geofence.radiusMeters,
                                    },
                                })];
                        case 2:
                            _a.sent();
                            return [2 /*return*/, geofence];
                    }
                });
            });
        };
        GeofenceEngineService_1.prototype.getGeofences = function (companyId, type) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                return [2 /*return*/, tx.geofence.findMany({
                                        where: {
                                            companyId: companyId,
                                            type: type || undefined,
                                            isActive: true,
                                        },
                                        orderBy: { name: 'asc' },
                                    })];
                            });
                        }); })];
                });
            });
        };
        GeofenceEngineService_1.prototype.getGeofenceById = function (companyId, id) {
            return __awaiter(this, void 0, void 0, function () {
                var geofence;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    return [2 /*return*/, tx.geofence.findUnique({
                                            where: { id: id, companyId: companyId },
                                            include: {
                                                events: {
                                                    orderBy: { timestamp: 'desc' },
                                                    take: 10,
                                                },
                                            },
                                        })];
                                });
                            }); })];
                        case 1:
                            geofence = _a.sent();
                            if (!geofence || geofence.companyId !== companyId) {
                                throw new common_1.NotFoundException('Geofence not found');
                            }
                            return [2 /*return*/, geofence];
                    }
                });
            });
        };
        GeofenceEngineService_1.prototype.deleteGeofence = function (companyId, id, userId) {
            return __awaiter(this, void 0, void 0, function () {
                var geofence;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, tx.geofence.findFirst({ where: { id: id, companyId: companyId } })];
                            }); }); })];
                        case 1:
                            geofence = _a.sent();
                            if (!geofence || geofence.companyId !== companyId) {
                                throw new common_1.NotFoundException('Geofence not found');
                            }
                            return [4 /*yield*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.geofence.deleteMany({
                                                where: { id: id, companyId: companyId },
                                            })];
                                    });
                                }); })];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, this.audit.logEvent({
                                    action: 'geofence:delete',
                                    entity: 'Geofence',
                                    entityId: id,
                                    userId: userId,
                                    companyId: companyId,
                                    details: { name: geofence.name },
                                })];
                        case 3:
                            _a.sent();
                            return [2 /*return*/, { success: true, id: id }];
                    }
                });
            });
        };
        // Haversine formula to calculate distance in meters between two lat/lng points
        GeofenceEngineService_1.prototype.calculateDistanceMeters = function (lat1, lon1, lat2, lon2) {
            var R = 6371e3; // Earth radius in meters
            var phi1 = (lat1 * Math.PI) / 180;
            var phi2 = (lat2 * Math.PI) / 180;
            var deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
            var deltaLambda = ((lon2 - lon1) * Math.PI) / 180;
            var a = Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
                Math.cos(phi1) *
                    Math.cos(phi2) *
                    Math.sin(deltaLambda / 2) *
                    Math.sin(deltaLambda / 2);
            var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            return R * c;
        };
        // Real-time Geospatial Geofence Boundary Transition Engine
        GeofenceEngineService_1.prototype.evaluateLocationAgainstGeofences = function (companyId_1, vehicleId_1, latitude_1, longitude_1) {
            return __awaiter(this, arguments, void 0, function (companyId, vehicleId, latitude, longitude, timestamp) {
                var geofences, eventsCreated, _loop_1, this_1, _i, geofences_1, fence;
                var _this = this;
                if (timestamp === void 0) { timestamp = new Date(); }
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    return [2 /*return*/, tx.geofence.findMany({
                                            where: { companyId: companyId, isActive: true },
                                        })];
                                });
                            }); })];
                        case 1:
                            geofences = _a.sent();
                            eventsCreated = [];
                            _loop_1 = function (fence) {
                                var distance, isInside, lastEvent, wasInside, enterEvent, enterTime, exitTime, dwellMinutes_1, exitEvent;
                                return __generator(this, function (_b) {
                                    switch (_b.label) {
                                        case 0:
                                            distance = this_1.calculateDistanceMeters(latitude, longitude, fence.latitude, fence.longitude);
                                            isInside = distance <= fence.radiusMeters;
                                            return [4 /*yield*/, this_1.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                                    return __generator(this, function (_a) {
                                                        return [2 /*return*/, tx.geofenceEvent.findFirst({
                                                                where: { geofenceId: fence.id, vehicleId: vehicleId },
                                                                orderBy: { timestamp: 'desc' },
                                                            })];
                                                    });
                                                }); })];
                                        case 1:
                                            lastEvent = _b.sent();
                                            wasInside = (lastEvent === null || lastEvent === void 0 ? void 0 : lastEvent.eventType) === 'ENTER';
                                            if (!(isInside && !wasInside)) return [3 /*break*/, 4];
                                            return [4 /*yield*/, this_1.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                                    return __generator(this, function (_a) {
                                                        return [2 /*return*/, tx.geofenceEvent.create({
                                                                data: {
                                                                    companyId: companyId,
                                                                    geofenceId: fence.id,
                                                                    vehicleId: vehicleId,
                                                                    eventType: 'ENTER',
                                                                    timestamp: timestamp,
                                                                    metadata: { distanceMeters: Math.round(distance) },
                                                                },
                                                            })];
                                                    });
                                                }); })];
                                        case 2:
                                            enterEvent = _b.sent();
                                            return [4 /*yield*/, this_1.audit.logEvent({
                                                    action: 'geofence:transition:enter',
                                                    entity: 'GeofenceEvent',
                                                    entityId: enterEvent.id,
                                                    userId: undefined,
                                                    companyId: companyId,
                                                    details: {
                                                        geofenceName: fence.name,
                                                        vehicleId: vehicleId,
                                                        geofenceId: fence.id,
                                                    },
                                                })];
                                        case 3:
                                            _b.sent();
                                            eventsCreated.push(enterEvent);
                                            return [3 /*break*/, 7];
                                        case 4:
                                            if (!(!isInside && wasInside)) return [3 /*break*/, 7];
                                            enterTime = lastEvent.timestamp.getTime();
                                            exitTime = timestamp.getTime();
                                            dwellMinutes_1 = Math.max(1, Math.round((exitTime - enterTime) / 60000));
                                            return [4 /*yield*/, this_1.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                                    return __generator(this, function (_a) {
                                                        return [2 /*return*/, tx.geofenceEvent.create({
                                                                data: {
                                                                    companyId: companyId,
                                                                    geofenceId: fence.id,
                                                                    vehicleId: vehicleId,
                                                                    eventType: 'EXIT',
                                                                    timestamp: timestamp,
                                                                    metadata: {
                                                                        dwellMinutes: dwellMinutes_1,
                                                                        enteredAt: lastEvent.timestamp.toISOString(),
                                                                        exitedAt: timestamp.toISOString(),
                                                                        distanceMeters: Math.round(distance),
                                                                    },
                                                                },
                                                            })];
                                                    });
                                                }); })];
                                        case 5:
                                            exitEvent = _b.sent();
                                            return [4 /*yield*/, this_1.audit.logEvent({
                                                    action: 'geofence:transition:exit',
                                                    entity: 'GeofenceEvent',
                                                    entityId: exitEvent.id,
                                                    userId: undefined,
                                                    companyId: companyId,
                                                    details: { geofenceName: fence.name, vehicleId: vehicleId, dwellMinutes: dwellMinutes_1 },
                                                })];
                                        case 6:
                                            _b.sent();
                                            eventsCreated.push(exitEvent);
                                            _b.label = 7;
                                        case 7: return [2 /*return*/];
                                    }
                                });
                            };
                            this_1 = this;
                            _i = 0, geofences_1 = geofences;
                            _a.label = 2;
                        case 2:
                            if (!(_i < geofences_1.length)) return [3 /*break*/, 5];
                            fence = geofences_1[_i];
                            return [5 /*yield**/, _loop_1(fence)];
                        case 3:
                            _a.sent();
                            _a.label = 4;
                        case 4:
                            _i++;
                            return [3 /*break*/, 2];
                        case 5: return [2 /*return*/, { evaluatedCount: geofences.length, eventsCreated: eventsCreated }];
                    }
                });
            });
        };
        GeofenceEngineService_1.prototype.getGeofenceEvents = function (companyId, geofenceId, vehicleId) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                return [2 /*return*/, tx.geofenceEvent.findMany({
                                        where: {
                                            companyId: companyId,
                                            geofenceId: geofenceId || undefined,
                                            vehicleId: vehicleId || undefined,
                                        },
                                        include: {
                                            geofence: { select: { name: true, type: true } },
                                            vehicle: { select: { licensePlate: true } },
                                        },
                                        orderBy: { timestamp: 'desc' },
                                        take: 50,
                                    })];
                            });
                        }); })];
                });
            });
        };
        return GeofenceEngineService_1;
    }());
    __setFunctionName(_classThis, "GeofenceEngineService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        GeofenceEngineService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return GeofenceEngineService = _classThis;
}();
exports.GeofenceEngineService = GeofenceEngineService;
