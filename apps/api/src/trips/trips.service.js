"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
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
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.TripsService = void 0;
var client_1 = require("@prisma/client");
var pagination_util_1 = require("../platform/api/utils/pagination.util");
var common_1 = require("@nestjs/common");
var crypto = __importStar(require("crypto"));
var TripsService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var TripsService = _classThis = /** @class */ (function () {
        function TripsService_1(auditService, prisma, eventEmitter, workflow, eventStore) {
            this.auditService = auditService;
            this.prisma = prisma;
            this.eventEmitter = eventEmitter;
            this.workflow = workflow;
            this.eventStore = eventStore;
        }
        TripsService_1.prototype.create = function (companyId, createTripDto) {
            return __awaiter(this, void 0, void 0, function () {
                var trip;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                var data, existingTripNum, driver, vehicle, trailer, trip, ruleResult;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            data = __assign(__assign({}, createTripDto), { companyId: companyId });
                                            if (data.startDate)
                                                data.startDate = new Date(data.startDate);
                                            if (data.endDate)
                                                data.endDate = new Date(data.endDate);
                                            if (data.eta)
                                                data.eta = new Date(data.eta);
                                            if (!!data.tripNumber) return [3 /*break*/, 1];
                                            data.tripNumber = "TRP-".concat(crypto.randomBytes(4).toString('hex').toUpperCase());
                                            return [3 /*break*/, 3];
                                        case 1: return [4 /*yield*/, tx.trip.findFirst({
                                                where: { tripNumber: data.tripNumber, companyId: companyId },
                                            })];
                                        case 2:
                                            existingTripNum = _a.sent();
                                            if (existingTripNum) {
                                                throw new common_1.ConflictException("Trip number ".concat(data.tripNumber, " already exists."));
                                            }
                                            _a.label = 3;
                                        case 3:
                                            if (!data.driverId) return [3 /*break*/, 6];
                                            return [4 /*yield*/, tx.driver.findFirst({
                                                    where: { id: data.driverId, companyId: companyId },
                                                })];
                                        case 4:
                                            driver = _a.sent();
                                            if (!driver || driver.status !== 'AVAILABLE') {
                                                throw new common_1.ConflictException("Driver is not available for assignment");
                                            }
                                            return [4 /*yield*/, this.prisma.updateWithOcc(tx, 'driver', driver.id, driver.updatedAt, { status: 'DISPATCHED' })];
                                        case 5:
                                            _a.sent();
                                            _a.label = 6;
                                        case 6:
                                            if (!data.vehicleId) return [3 /*break*/, 9];
                                            return [4 /*yield*/, tx.vehicle.findFirst({
                                                    where: { id: data.vehicleId, companyId: companyId },
                                                })];
                                        case 7:
                                            vehicle = _a.sent();
                                            if (!vehicle || vehicle.status !== 'IN_SERVICE') {
                                                throw new common_1.ConflictException("Vehicle is not available for assignment");
                                            }
                                            return [4 /*yield*/, this.prisma.updateWithOcc(tx, 'vehicle', vehicle.id, vehicle.updatedAt, { status: 'DISPATCHED' })];
                                        case 8:
                                            _a.sent();
                                            _a.label = 9;
                                        case 9:
                                            if (!data.trailerId) return [3 /*break*/, 12];
                                            return [4 /*yield*/, tx.vehicle.findFirst({
                                                    where: { id: data.trailerId, companyId: companyId, type: 'TRAILER' },
                                                })];
                                        case 10:
                                            trailer = _a.sent();
                                            if (!trailer || trailer.status !== 'IN_SERVICE') {
                                                throw new common_1.ConflictException("Trailer is not available for assignment");
                                            }
                                            return [4 /*yield*/, this.prisma.updateWithOcc(tx, 'vehicle', trailer.id, trailer.updatedAt, { status: 'DISPATCHED' })];
                                        case 11:
                                            _a.sent();
                                            _a.label = 12;
                                        case 12: return [4 /*yield*/, tx.trip.create({
                                                data: data,
                                                include: { driver: true, vehicle: true, trailer: true, loads: true },
                                            })];
                                        case 13:
                                            trip = _a.sent();
                                            return [4 /*yield*/, this.workflow.evaluateRules(companyId, {
                                                    entityType: 'TRIP',
                                                    trigger: 'TRIP_CREATED',
                                                    entityData: trip,
                                                })];
                                        case 14:
                                            ruleResult = _a.sent();
                                            if (ruleResult.triggeredActions.some(function (a) { return a.actionType === 'REJECT'; })) {
                                                throw new Error('Trip creation rejected by business rules.');
                                            }
                                            return [4 /*yield*/, this.auditService.logEvent({
                                                    companyId: companyId,
                                                    entity: 'Trip',
                                                    entityType: 'Trip',
                                                    entityId: trip.id,
                                                    action: 'CREATE',
                                                    details: { tripNumber: trip.tripNumber, status: trip.status },
                                                    source: 'API',
                                                }, null, tx)];
                                        case 15:
                                            _a.sent();
                                            return [4 /*yield*/, this.eventStore.append({
                                                    tenantId: companyId,
                                                    streamType: 'TRIP',
                                                    streamId: trip.id,
                                                    eventType: 'TripCreated',
                                                    payload: __assign({}, trip),
                                                })];
                                        case 16:
                                            _a.sent();
                                            return [2 /*return*/, trip];
                                    }
                                });
                            }); })];
                        case 1:
                            trip = _a.sent();
                            this.eventEmitter.emit('trip.created', {
                                companyId: companyId,
                                tripId: trip.id,
                                tripNumber: trip.tripNumber,
                                status: trip.status,
                            });
                            return [2 /*return*/, trip];
                    }
                });
            });
        };
        TripsService_1.prototype.findAll = function (companyId, query) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                            var _a, page, _b, limit, search, status, driverId, vehicleId, _c, skip, take, where, _d, data, total;
                            return __generator(this, function (_e) {
                                switch (_e.label) {
                                    case 0:
                                        _a = query.page, page = _a === void 0 ? 1 : _a, _b = query.limit, limit = _b === void 0 ? 10 : _b, search = query.search, status = query.status, driverId = query.driverId, vehicleId = query.vehicleId;
                                        _c = (0, pagination_util_1.getPaginationParams)(page, limit), skip = _c.skip, take = _c.take;
                                        where = { companyId: companyId };
                                        if (search) {
                                            where.OR = [
                                                { tripNumber: { contains: search, mode: 'insensitive' } },
                                                { driver: { firstName: { contains: search, mode: 'insensitive' } } },
                                                { driver: { lastName: { contains: search, mode: 'insensitive' } } },
                                                {
                                                    vehicle: {
                                                        licensePlate: { contains: search, mode: 'insensitive' },
                                                    },
                                                },
                                            ];
                                        }
                                        if (status)
                                            where.status = status;
                                        if (driverId)
                                            where.driverId = driverId;
                                        if (vehicleId)
                                            where.vehicleId = vehicleId;
                                        return [4 /*yield*/, Promise.all([
                                                tx.trip.findMany({
                                                    where: where,
                                                    skip: skip,
                                                    take: take,
                                                    orderBy: { createdAt: 'desc' },
                                                    include: {
                                                        driver: true,
                                                        vehicle: true,
                                                        trailer: true,
                                                        loads: { include: { customer: true } },
                                                    },
                                                }),
                                                tx.trip.count({ where: where }),
                                            ])];
                                    case 1:
                                        _d = _e.sent(), data = _d[0], total = _d[1];
                                        return [2 /*return*/, (0, pagination_util_1.createPaginationResponse)(data, total, page, limit)];
                                }
                            });
                        }); })];
                });
            });
        };
        TripsService_1.prototype.findOne = function (companyId, id) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                            var trip;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, tx.trip.findFirst({
                                            where: { id: id, companyId: companyId },
                                            include: {
                                                driver: true,
                                                vehicle: true,
                                                trailer: true,
                                                loads: { include: { customer: true } },
                                            },
                                        })];
                                    case 1:
                                        trip = _a.sent();
                                        if (!trip) {
                                            throw new common_1.NotFoundException("Trip with ID ".concat(id, " not found"));
                                        }
                                        return [2 /*return*/, trip];
                                }
                            });
                        }); })];
                });
            });
        };
        TripsService_1.prototype.update = function (companyId, id, updateTripDto) {
            return __awaiter(this, void 0, void 0, function () {
                var result;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                var existingTrip, data, duplicate, newDriver, newVehicle, newTrailer, updatedTrip;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, tx.trip.findFirst({
                                                where: { id: id, companyId: companyId },
                                            })];
                                        case 1:
                                            existingTrip = _a.sent();
                                            if (!existingTrip)
                                                throw new common_1.NotFoundException();
                                            data = __assign({}, updateTripDto);
                                            if (data.startDate)
                                                data.startDate = new Date(data.startDate);
                                            if (data.endDate)
                                                data.endDate = new Date(data.endDate);
                                            if (data.eta)
                                                data.eta = new Date(data.eta);
                                            if (!(data.tripNumber && data.tripNumber !== existingTrip.tripNumber)) return [3 /*break*/, 3];
                                            return [4 /*yield*/, tx.trip.findFirst({
                                                    where: { tripNumber: data.tripNumber, companyId: companyId },
                                                })];
                                        case 2:
                                            duplicate = _a.sent();
                                            if (duplicate) {
                                                throw new common_1.ConflictException("Trip number ".concat(data.tripNumber, " already exists."));
                                            }
                                            _a.label = 3;
                                        case 3:
                                            if (!(data.driverId && data.driverId !== existingTrip.driverId)) return [3 /*break*/, 7];
                                            return [4 /*yield*/, tx.driver.findFirst({
                                                    where: { id: data.driverId, companyId: companyId },
                                                })];
                                        case 4:
                                            newDriver = _a.sent();
                                            if (!newDriver || newDriver.status !== 'AVAILABLE') {
                                                throw new common_1.ConflictException('New driver is not available for assignment');
                                            }
                                            return [4 /*yield*/, this.prisma.updateWithOcc(tx, 'driver', newDriver.id, newDriver.updatedAt, { status: 'DISPATCHED' })];
                                        case 5:
                                            _a.sent();
                                            if (!existingTrip.driverId) return [3 /*break*/, 7];
                                            return [4 /*yield*/, tx.driver.updateMany({
                                                    where: { id: existingTrip.driverId, companyId: companyId },
                                                    data: { status: 'AVAILABLE' },
                                                })];
                                        case 6:
                                            _a.sent();
                                            _a.label = 7;
                                        case 7:
                                            if (!(data.vehicleId && data.vehicleId !== existingTrip.vehicleId)) return [3 /*break*/, 11];
                                            return [4 /*yield*/, tx.vehicle.findFirst({
                                                    where: { id: data.vehicleId, companyId: companyId },
                                                })];
                                        case 8:
                                            newVehicle = _a.sent();
                                            if (!newVehicle || newVehicle.status !== 'IN_SERVICE') {
                                                throw new common_1.ConflictException('New vehicle is not available for assignment');
                                            }
                                            return [4 /*yield*/, this.prisma.updateWithOcc(tx, 'vehicle', newVehicle.id, newVehicle.updatedAt, { status: 'DISPATCHED' })];
                                        case 9:
                                            _a.sent();
                                            if (!existingTrip.vehicleId) return [3 /*break*/, 11];
                                            return [4 /*yield*/, tx.vehicle.updateMany({
                                                    where: { id: existingTrip.vehicleId, companyId: companyId },
                                                    data: { status: 'IN_SERVICE' },
                                                })];
                                        case 10:
                                            _a.sent();
                                            _a.label = 11;
                                        case 11:
                                            if (!(data.trailerId && data.trailerId !== existingTrip.trailerId)) return [3 /*break*/, 15];
                                            return [4 /*yield*/, tx.vehicle.findFirst({
                                                    where: { id: data.trailerId, companyId: companyId, type: 'TRAILER' },
                                                })];
                                        case 12:
                                            newTrailer = _a.sent();
                                            if (!newTrailer || newTrailer.status !== 'IN_SERVICE') {
                                                throw new common_1.ConflictException('New trailer is not available for assignment');
                                            }
                                            return [4 /*yield*/, this.prisma.updateWithOcc(tx, 'vehicle', newTrailer.id, newTrailer.updatedAt, { status: 'DISPATCHED' })];
                                        case 13:
                                            _a.sent();
                                            if (!existingTrip.trailerId) return [3 /*break*/, 15];
                                            return [4 /*yield*/, tx.vehicle.updateMany({
                                                    where: { id: existingTrip.trailerId, companyId: companyId },
                                                    data: { status: 'IN_SERVICE' },
                                                })];
                                        case 14:
                                            _a.sent();
                                            _a.label = 15;
                                        case 15:
                                            // Prevent backwards state transitions
                                            if ((existingTrip.status === 'COMPLETED' ||
                                                existingTrip.status === 'CANCELLED') &&
                                                data.status &&
                                                data.status !== existingTrip.status) {
                                                throw new common_1.BadRequestException("Cannot change status of a ".concat(existingTrip.status, " trip"));
                                            }
                                            if (!(data.status &&
                                                (data.status === 'COMPLETED' || data.status === 'CANCELLED') &&
                                                existingTrip.status !== 'COMPLETED' &&
                                                existingTrip.status !== 'CANCELLED')) return [3 /*break*/, 23];
                                            if (!existingTrip.driverId) return [3 /*break*/, 17];
                                            return [4 /*yield*/, tx.driver.updateMany({
                                                    where: { id: existingTrip.driverId, companyId: companyId },
                                                    data: { status: 'AVAILABLE' },
                                                })];
                                        case 16:
                                            _a.sent();
                                            _a.label = 17;
                                        case 17:
                                            if (!existingTrip.vehicleId) return [3 /*break*/, 19];
                                            return [4 /*yield*/, tx.vehicle.updateMany({
                                                    where: { id: existingTrip.vehicleId, companyId: companyId },
                                                    data: { status: 'IN_SERVICE' },
                                                })];
                                        case 18:
                                            _a.sent();
                                            _a.label = 19;
                                        case 19:
                                            if (!existingTrip.trailerId) return [3 /*break*/, 21];
                                            return [4 /*yield*/, tx.vehicle.updateMany({
                                                    where: { id: existingTrip.trailerId, companyId: companyId },
                                                    data: { status: 'IN_SERVICE' },
                                                })];
                                        case 20:
                                            _a.sent();
                                            _a.label = 21;
                                        case 21:
                                            if (!(data.status === 'CANCELLED')) return [3 /*break*/, 23];
                                            // Unassign loads when trip is cancelled
                                            return [4 /*yield*/, tx.load.updateMany({
                                                    where: { tripId: id, companyId: companyId },
                                                    data: { tripId: null, status: 'PENDING' },
                                                })];
                                        case 22:
                                            // Unassign loads when trip is cancelled
                                            _a.sent();
                                            _a.label = 23;
                                        case 23: return [4 /*yield*/, this.prisma.updateWithOcc(tx, 'trip', id, existingTrip.updatedAt, data, { driver: true, vehicle: true, trailer: true, loads: true })];
                                        case 24:
                                            updatedTrip = _a.sent();
                                            return [4 /*yield*/, this.auditService.logEvent({
                                                    companyId: companyId,
                                                    entity: 'Trip',
                                                    entityType: 'Trip',
                                                    entityId: updatedTrip.id,
                                                    action: 'UPDATE',
                                                    beforeValue: { status: existingTrip.status },
                                                    afterValue: { status: updatedTrip.status },
                                                    source: 'API',
                                                }, null, tx)];
                                        case 25:
                                            _a.sent();
                                            return [4 /*yield*/, this.eventStore.append({
                                                    tenantId: companyId,
                                                    streamType: 'TRIP',
                                                    streamId: updatedTrip.id,
                                                    eventType: 'TripUpdated',
                                                    payload: data,
                                                })];
                                        case 26:
                                            _a.sent();
                                            return [2 /*return*/, { updatedTrip: updatedTrip, existingStatus: existingTrip.status }];
                                    }
                                });
                            }); })];
                        case 1:
                            result = _a.sent();
                            if (result.existingStatus !== 'IN_TRANSIT' &&
                                result.updatedTrip.status === 'IN_TRANSIT') {
                                this.eventEmitter.emit('trip.started', result.updatedTrip);
                            }
                            else if (result.existingStatus !== 'COMPLETED' &&
                                result.updatedTrip.status === 'COMPLETED') {
                                this.eventEmitter.emit('trip.completed', result.updatedTrip);
                            }
                            else {
                                this.eventEmitter.emit('trip.updated', result.updatedTrip);
                            }
                            return [2 /*return*/, result.updatedTrip];
                    }
                });
            });
        };
        TripsService_1.prototype.assignLoads = function (companyId, id, loadIds) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                            var existingTrip, ruleResult, availableLoads, rowCount, updatedTrip;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, tx.trip.findFirst({
                                            where: { id: id, companyId: companyId },
                                        })];
                                    case 1:
                                        existingTrip = _a.sent();
                                        if (!existingTrip)
                                            throw new common_1.NotFoundException();
                                        return [4 /*yield*/, this.workflow.evaluateRules(companyId, {
                                                entityType: 'TRIP',
                                                trigger: 'ASSIGN_LOADS',
                                                entityData: { trip: existingTrip, loadIds: loadIds },
                                            })];
                                    case 2:
                                        ruleResult = _a.sent();
                                        if (ruleResult.triggeredActions.some(function (a) { return a.actionType === 'REJECT'; })) {
                                            throw new Error('Load assignment rejected by business rules.');
                                        }
                                        return [4 /*yield*/, tx.load.findMany({
                                                where: {
                                                    id: { in: loadIds },
                                                    companyId: companyId,
                                                    tripId: null,
                                                    status: 'PENDING',
                                                },
                                            })];
                                    case 3:
                                        availableLoads = _a.sent();
                                        if (availableLoads.length !== loadIds.length) {
                                            throw new common_1.ConflictException('One or more loads are already assigned to another trip or do not exist.');
                                        }
                                        return [4 /*yield*/, tx.$executeRaw(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n        UPDATE \"Load\" \n        SET \"tripId\" = ", "::uuid, status = 'ASSIGNED' \n        WHERE id::text IN (", ") \n          AND \"companyId\"::text = ", " \n          AND \"tripId\" IS NULL \n          AND status = 'PENDING'\n      "], ["\n        UPDATE \"Load\" \n        SET \"tripId\" = ", "::uuid, status = 'ASSIGNED' \n        WHERE id::text IN (", ") \n          AND \"companyId\"::text = ", " \n          AND \"tripId\" IS NULL \n          AND status = 'PENDING'\n      "])), id, client_1.Prisma.join(loadIds), companyId)];
                                    case 4:
                                        rowCount = _a.sent();
                                        if (rowCount !== loadIds.length) {
                                            throw new common_1.ConflictException('One or more loads were already assigned by a concurrent request.');
                                        }
                                        return [4 /*yield*/, tx.trip.findFirst({
                                                where: { id: id, companyId: companyId },
                                                include: { loads: true },
                                            })];
                                    case 5:
                                        updatedTrip = _a.sent();
                                        return [4 /*yield*/, this.auditService.logEvent({
                                                companyId: companyId,
                                                entity: 'Trip',
                                                entityType: 'Trip',
                                                entityId: id,
                                                action: 'ASSIGN_LOADS',
                                                details: { loadIds: loadIds },
                                                source: 'API',
                                            }, null, tx)];
                                    case 6:
                                        _a.sent();
                                        return [4 /*yield*/, this.eventStore.append({
                                                tenantId: companyId,
                                                streamType: 'TRIP',
                                                streamId: id,
                                                eventType: 'LoadsAssigned',
                                                payload: { loadIds: loadIds },
                                            })];
                                    case 7:
                                        _a.sent();
                                        return [2 /*return*/, updatedTrip];
                                }
                            });
                        }); })];
                });
            });
        };
        TripsService_1.prototype.remove = function (companyId, id) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                            var existingTrip, deletedTrip;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, tx.trip.findFirst({
                                            where: { id: id, companyId: companyId },
                                        })];
                                    case 1:
                                        existingTrip = _a.sent();
                                        if (!existingTrip)
                                            throw new common_1.NotFoundException();
                                        if (existingTrip.status === 'COMPLETED' ||
                                            existingTrip.status === 'CANCELLED') {
                                            throw new common_1.BadRequestException("Cannot delete a trip that is already ".concat(existingTrip.status));
                                        }
                                        // Unassign loads when trip is cancelled/removed
                                        return [4 /*yield*/, tx.load.updateMany({
                                                where: { tripId: id, companyId: companyId },
                                                data: { tripId: null, status: 'PENDING' },
                                            })];
                                    case 2:
                                        // Unassign loads when trip is cancelled/removed
                                        _a.sent();
                                        if (!existingTrip.driverId) return [3 /*break*/, 4];
                                        return [4 /*yield*/, tx.driver.updateMany({
                                                where: { id: existingTrip.driverId, companyId: companyId },
                                                data: { status: 'AVAILABLE' },
                                            })];
                                    case 3:
                                        _a.sent();
                                        _a.label = 4;
                                    case 4:
                                        if (!existingTrip.vehicleId) return [3 /*break*/, 6];
                                        return [4 /*yield*/, tx.vehicle.updateMany({
                                                where: { id: existingTrip.vehicleId, companyId: companyId },
                                                data: { status: 'IN_SERVICE' },
                                            })];
                                    case 5:
                                        _a.sent();
                                        _a.label = 6;
                                    case 6:
                                        if (!existingTrip.trailerId) return [3 /*break*/, 8];
                                        return [4 /*yield*/, tx.vehicle.updateMany({
                                                where: { id: existingTrip.trailerId, companyId: companyId },
                                                data: { status: 'IN_SERVICE' },
                                            })];
                                    case 7:
                                        _a.sent();
                                        _a.label = 8;
                                    case 8: return [4 /*yield*/, tx.trip.update({
                                            where: { id: id, companyId: companyId },
                                            data: { deletedAt: new Date(), status: 'CANCELLED' },
                                        })];
                                    case 9:
                                        deletedTrip = _a.sent();
                                        return [4 /*yield*/, this.auditService.logEvent({
                                                companyId: companyId,
                                                entity: 'Trip',
                                                entityType: 'Trip',
                                                entityId: deletedTrip.id,
                                                action: 'DELETE',
                                                details: { tripNumber: deletedTrip.tripNumber },
                                                source: 'API',
                                            }, null, tx)];
                                    case 10:
                                        _a.sent();
                                        return [4 /*yield*/, this.eventStore.append({
                                                tenantId: companyId,
                                                streamType: 'TRIP',
                                                streamId: deletedTrip.id,
                                                eventType: 'TripCancelled',
                                                payload: {},
                                            })];
                                    case 11:
                                        _a.sent();
                                        return [2 /*return*/, deletedTrip];
                                }
                            });
                        }); })];
                });
            });
        };
        return TripsService_1;
    }());
    __setFunctionName(_classThis, "TripsService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        TripsService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return TripsService = _classThis;
}();
exports.TripsService = TripsService;
var templateObject_1;
