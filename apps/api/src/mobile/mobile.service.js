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
exports.MobileService = void 0;
var common_1 = require("@nestjs/common");
var MobileService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var MobileService = _classThis = /** @class */ (function () {
        function MobileService_1(prisma) {
            this.prisma = prisma;
            this.logger = new common_1.Logger(MobileService.name);
        }
        MobileService_1.prototype.getDriverByUserId = function (tx, userId) {
            return __awaiter(this, void 0, void 0, function () {
                var driver;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, tx.driver.findUnique({
                                where: { userId: userId },
                            })];
                        case 1:
                            driver = _a.sent();
                            if (!driver) {
                                throw new common_1.UnauthorizedException('Authenticated user is not registered as a driver');
                            }
                            return [2 /*return*/, driver];
                    }
                });
            });
        };
        MobileService_1.prototype.getActiveTrip = function (companyId, userId) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                            var driver, activeTrip;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, this.getDriverByUserId(tx, userId)];
                                    case 1:
                                        driver = _a.sent();
                                        return [4 /*yield*/, tx.trip.findFirst({
                                                where: {
                                                    driverId: driver.id,
                                                    status: { in: ['DISPATCHED', 'IN_PROGRESS'] },
                                                },
                                                include: {
                                                    vehicle: true,
                                                    loads: {
                                                        include: { customer: true },
                                                    },
                                                },
                                                orderBy: { createdAt: 'desc' },
                                            })];
                                    case 2:
                                        activeTrip = _a.sent();
                                        if (!activeTrip) {
                                            throw new common_1.NotFoundException('No active trips assigned to this driver');
                                        }
                                        return [2 /*return*/, activeTrip];
                                }
                            });
                        }); })];
                });
            });
        };
        MobileService_1.prototype.updateTripStatus = function (companyId, userId, tripId, dto) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                            var driver, trip, updatedTrip;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, this.getDriverByUserId(tx, userId)];
                                    case 1:
                                        driver = _a.sent();
                                        return [4 /*yield*/, tx.trip.findFirst({
                                                where: { id: tripId, driverId: driver.id },
                                            })];
                                    case 2:
                                        trip = _a.sent();
                                        if (!trip) {
                                            throw new common_1.NotFoundException('Trip not found or not assigned to this driver');
                                        }
                                        return [4 /*yield*/, tx.trip.update({
                                                where: { id: tripId },
                                                data: { status: dto.status },
                                                include: { vehicle: true, loads: true },
                                            })];
                                    case 3:
                                        updatedTrip = _a.sent();
                                        if (!(dto.status === 'COMPLETED')) return [3 /*break*/, 5];
                                        return [4 /*yield*/, tx.load.updateMany({
                                                where: { tripId: tripId, companyId: companyId, status: 'IN_TRANSIT' },
                                                data: { status: 'DELIVERED' },
                                            })];
                                    case 4:
                                        _a.sent();
                                        _a.label = 5;
                                    case 5:
                                        if (!(dto.status === 'IN_PROGRESS')) return [3 /*break*/, 7];
                                        return [4 /*yield*/, tx.load.updateMany({
                                                where: { tripId: tripId, companyId: companyId, status: 'ASSIGNED' },
                                                data: { status: 'IN_TRANSIT' },
                                            })];
                                    case 6:
                                        _a.sent();
                                        _a.label = 7;
                                    case 7: return [2 /*return*/, updatedTrip];
                                }
                            });
                        }); })];
                });
            });
        };
        MobileService_1.prototype.updateLoadStatus = function (companyId, userId, loadId, dto) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                            var driver, load;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, this.getDriverByUserId(tx, userId)];
                                    case 1:
                                        driver = _a.sent();
                                        return [4 /*yield*/, tx.load.findFirst({
                                                where: {
                                                    id: loadId,
                                                    trip: { driverId: driver.id },
                                                },
                                                include: { trip: true },
                                            })];
                                    case 2:
                                        load = _a.sent();
                                        if (!load) {
                                            throw new common_1.NotFoundException('Load not found or not assigned to this driver');
                                        }
                                        return [2 /*return*/, tx.load.update({
                                                where: { id: loadId },
                                                data: { status: dto.status },
                                            })];
                                }
                            });
                        }); })];
                });
            });
        };
        MobileService_1.prototype.recordLocation = function (companyId, userId, dto) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                            var driver, trip;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, this.getDriverByUserId(tx, userId)];
                                    case 1:
                                        driver = _a.sent();
                                        return [4 /*yield*/, tx.trip.findFirst({
                                                where: { id: dto.tripId, driverId: driver.id },
                                            })];
                                    case 2:
                                        trip = _a.sent();
                                        if (!trip) {
                                            throw new common_1.BadRequestException('Invalid tripId for location ping');
                                        }
                                        return [2 /*return*/, tx.locationHistory.create({
                                                data: {
                                                    companyId: companyId,
                                                    tripId: dto.tripId,
                                                    driverId: driver.id,
                                                    latitude: dto.latitude,
                                                    longitude: dto.longitude,
                                                    speed: dto.speed,
                                                    heading: dto.heading,
                                                    accuracy: dto.accuracy,
                                                },
                                            })];
                                }
                            });
                        }); })];
                });
            });
        };
        MobileService_1.prototype.processOfflineQueue = function (companyId, userId, queueData) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                            var processed, failed, _i, queueData_1, item, e_1, errorMessage;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        // Basic conflict resolution / queue processor
                                        // Loops through queued actions (e.g., location pings, status updates) and processes them sequentially
                                        this.logger.log("Processing offline queue of ".concat(queueData.length, " items for driver ").concat(userId));
                                        processed = 0;
                                        failed = 0;
                                        _i = 0, queueData_1 = queueData;
                                        _a.label = 1;
                                    case 1:
                                        if (!(_i < queueData_1.length)) return [3 /*break*/, 9];
                                        item = queueData_1[_i];
                                        _a.label = 2;
                                    case 2:
                                        _a.trys.push([2, 7, , 8]);
                                        if (!(item.action === 'UPDATE_LOAD_STATUS')) return [3 /*break*/, 4];
                                        return [4 /*yield*/, this.updateLoadStatus(companyId, userId, item.loadId, {
                                                status: item.status,
                                            })];
                                    case 3:
                                        _a.sent();
                                        return [3 /*break*/, 6];
                                    case 4:
                                        if (!(item.action === 'UPDATE_TRIP_STATUS')) return [3 /*break*/, 6];
                                        return [4 /*yield*/, this.updateTripStatus(companyId, userId, item.tripId, {
                                                status: item.status,
                                            })];
                                    case 5:
                                        _a.sent();
                                        _a.label = 6;
                                    case 6:
                                        // Further actions like expenses, fuel could be added here
                                        processed++;
                                        return [3 /*break*/, 8];
                                    case 7:
                                        e_1 = _a.sent();
                                        errorMessage = e_1 instanceof Error ? e_1.message : String(e_1);
                                        this.logger.error("Offline sync conflict/error for action ".concat(item.action, ": ").concat(errorMessage));
                                        failed++;
                                        return [3 /*break*/, 8];
                                    case 8:
                                        _i++;
                                        return [3 /*break*/, 1];
                                    case 9: return [2 /*return*/, { success: true, processed: processed, failed: failed }];
                                }
                            });
                        }); })];
                });
            });
        };
        MobileService_1.prototype.uploadDocument = function (companyId, userId, type, file, referenceId) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                            var fileUrl;
                            return __generator(this, function (_a) {
                                fileUrl = "/uploads/".concat(file.filename);
                                // We will link it to a generic Document table for Mobile Uploads
                                return [2 /*return*/, tx.document.create({
                                        data: {
                                            companyId: companyId,
                                            loadId: type === 'POD' || type === 'SIGNATURE' ? referenceId : null,
                                            type: type.toUpperCase(), // POD, FUEL, EXPENSE, SIGNATURE
                                            fileUrl: fileUrl,
                                            fileName: file.originalname,
                                            mimeType: file.mimetype,
                                            sizeBytes: file.size,
                                            uploadedById: userId,
                                        },
                                    })];
                            });
                        }); })];
                });
            });
        };
        return MobileService_1;
    }());
    __setFunctionName(_classThis, "MobileService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        MobileService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return MobileService = _classThis;
}();
exports.MobileService = MobileService;
