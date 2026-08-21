"use strict";
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
exports.VehiclesService = void 0;
var pagination_util_1 = require("../platform/api/utils/pagination.util");
var common_1 = require("@nestjs/common");
var VehiclesService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var VehiclesService = _classThis = /** @class */ (function () {
        function VehiclesService_1(auditService, prisma, workflow, eventEmitter, eventStore) {
            this.auditService = auditService;
            this.prisma = prisma;
            this.workflow = workflow;
            this.eventEmitter = eventEmitter;
            this.eventStore = eventStore;
        }
        VehiclesService_1.prototype.create = function (companyId, createVehicleDto) {
            return __awaiter(this, void 0, void 0, function () {
                var newVehicle;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                var orConditions, existing, newVehicle, ruleResult;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            if (!(createVehicleDto.vin || createVehicleDto.licensePlate)) return [3 /*break*/, 2];
                                            orConditions = [];
                                            if (createVehicleDto.vin)
                                                orConditions.push({ vin: createVehicleDto.vin });
                                            if (createVehicleDto.licensePlate)
                                                orConditions.push({ licensePlate: createVehicleDto.licensePlate });
                                            return [4 /*yield*/, tx.vehicle.findFirst({
                                                    where: {
                                                        companyId: companyId,
                                                        OR: orConditions,
                                                    },
                                                })];
                                        case 1:
                                            existing = _a.sent();
                                            if (existing) {
                                                throw new common_1.ConflictException('A vehicle with this VIN or license plate already exists.');
                                            }
                                            _a.label = 2;
                                        case 2: return [4 /*yield*/, tx.vehicle.create({
                                                data: __assign(__assign({}, createVehicleDto), { companyId: companyId }),
                                            })];
                                        case 3:
                                            newVehicle = _a.sent();
                                            return [4 /*yield*/, this.workflow.evaluateRules(companyId, {
                                                    entityType: 'VEHICLE',
                                                    trigger: 'VEHICLE_CREATED',
                                                    entityData: newVehicle,
                                                })];
                                        case 4:
                                            ruleResult = _a.sent();
                                            if (ruleResult.triggeredActions.some(function (a) { return a.actionType === 'REJECT'; })) {
                                                throw new Error('Vehicle creation rejected by business rules.');
                                            }
                                            // 3. Audit Logging
                                            return [4 /*yield*/, this.auditService.logEvent({
                                                    companyId: companyId,
                                                    entity: 'Vehicle',
                                                    entityType: 'Vehicle',
                                                    entityId: newVehicle.id,
                                                    action: 'CREATE',
                                                    details: __assign({}, newVehicle),
                                                    source: 'API',
                                                }, null, tx)];
                                        case 5:
                                            // 3. Audit Logging
                                            _a.sent();
                                            return [4 /*yield*/, this.eventStore.append({
                                                    tenantId: companyId,
                                                    streamType: 'VEHICLE',
                                                    streamId: newVehicle.id,
                                                    eventType: 'VehicleCreated',
                                                    payload: __assign({}, newVehicle),
                                                })];
                                        case 6:
                                            _a.sent();
                                            return [2 /*return*/, newVehicle];
                                    }
                                });
                            }); })];
                        case 1:
                            newVehicle = _a.sent();
                            this.eventEmitter.emit('vehicle.created', newVehicle);
                            return [2 /*return*/, newVehicle];
                    }
                });
            });
        };
        VehiclesService_1.prototype.findAll = function (companyId, query) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                            var _a, page, _b, limit, search, type, status, _c, skip, take, where, _d, data, total;
                            return __generator(this, function (_e) {
                                switch (_e.label) {
                                    case 0:
                                        _a = query.page, page = _a === void 0 ? 1 : _a, _b = query.limit, limit = _b === void 0 ? 10 : _b, search = query.search, type = query.type, status = query.status;
                                        _c = (0, pagination_util_1.getPaginationParams)(page, limit), skip = _c.skip, take = _c.take;
                                        where = { companyId: companyId };
                                        if (search) {
                                            where.OR = [
                                                { licensePlate: { contains: search, mode: 'insensitive' } },
                                                { vin: { contains: search, mode: 'insensitive' } },
                                                { make: { contains: search, mode: 'insensitive' } },
                                                { model: { contains: search, mode: 'insensitive' } },
                                            ];
                                        }
                                        if (type) {
                                            where.type = type;
                                        }
                                        if (status) {
                                            where.status = status;
                                        }
                                        return [4 /*yield*/, Promise.all([
                                                tx.vehicle.findMany({
                                                    where: where,
                                                    skip: skip,
                                                    take: take,
                                                    orderBy: { createdAt: 'desc' },
                                                }),
                                                tx.vehicle.count({ where: where }),
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
        VehiclesService_1.prototype.findOne = function (companyId, id) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                            var vehicle;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, tx.vehicle.findFirst({
                                            where: { id: id, companyId: companyId },
                                        })];
                                    case 1:
                                        vehicle = _a.sent();
                                        if (!vehicle) {
                                            throw new common_1.NotFoundException("Vehicle with ID ".concat(id, " not found"));
                                        }
                                        return [2 /*return*/, vehicle];
                                }
                            });
                        }); })];
                });
            });
        };
        VehiclesService_1.prototype.update = function (companyId, id, updateVehicleDto) {
            return __awaiter(this, void 0, void 0, function () {
                var updatedVehicle;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                var existingVehicle, orConditions, existingDuplicate, updatedVehicle, ruleResult;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, tx.vehicle.findFirst({
                                                where: { id: id, companyId: companyId },
                                            })];
                                        case 1:
                                            existingVehicle = _a.sent();
                                            if (!existingVehicle)
                                                throw new common_1.NotFoundException();
                                            if (!(updateVehicleDto.vin || updateVehicleDto.licensePlate)) return [3 /*break*/, 3];
                                            orConditions = [];
                                            if (updateVehicleDto.vin)
                                                orConditions.push({ vin: updateVehicleDto.vin });
                                            if (updateVehicleDto.licensePlate)
                                                orConditions.push({ licensePlate: updateVehicleDto.licensePlate });
                                            return [4 /*yield*/, tx.vehicle.findFirst({
                                                    where: {
                                                        companyId: companyId,
                                                        id: { not: id },
                                                        OR: orConditions,
                                                    },
                                                })];
                                        case 2:
                                            existingDuplicate = _a.sent();
                                            if (existingDuplicate) {
                                                throw new common_1.ConflictException('A vehicle with this VIN or license plate already exists.');
                                            }
                                            _a.label = 3;
                                        case 3: return [4 /*yield*/, this.prisma.updateWithOcc(tx, 'vehicle', id, existingVehicle.updatedAt, updateVehicleDto)];
                                        case 4:
                                            updatedVehicle = _a.sent();
                                            return [4 /*yield*/, this.workflow.evaluateRules(companyId, {
                                                    entityType: 'VEHICLE',
                                                    trigger: 'VEHICLE_UPDATED',
                                                    entityData: updatedVehicle,
                                                })];
                                        case 5:
                                            ruleResult = _a.sent();
                                            if (ruleResult.triggeredActions.some(function (a) { return a.actionType === 'REJECT'; })) {
                                                throw new Error('Vehicle update rejected by business rules.');
                                            }
                                            // Audit Logging
                                            return [4 /*yield*/, this.auditService.logEvent({
                                                    companyId: companyId,
                                                    entity: 'Vehicle',
                                                    entityType: 'Vehicle',
                                                    entityId: updatedVehicle.id,
                                                    action: 'UPDATE',
                                                    beforeValue: __assign({}, existingVehicle),
                                                    afterValue: __assign({}, updatedVehicle),
                                                    source: 'API',
                                                }, null, tx)];
                                        case 6:
                                            // Audit Logging
                                            _a.sent();
                                            return [4 /*yield*/, this.eventStore.append({
                                                    tenantId: companyId,
                                                    streamType: 'VEHICLE',
                                                    streamId: updatedVehicle.id,
                                                    eventType: 'VehicleUpdated',
                                                    payload: updateVehicleDto,
                                                })];
                                        case 7:
                                            _a.sent();
                                            return [2 /*return*/, updatedVehicle];
                                    }
                                });
                            }); })];
                        case 1:
                            updatedVehicle = _a.sent();
                            this.eventEmitter.emit('vehicle.updated', updatedVehicle);
                            return [2 /*return*/, updatedVehicle];
                    }
                });
            });
        };
        VehiclesService_1.prototype.remove = function (companyId, id) {
            return __awaiter(this, void 0, void 0, function () {
                var deletedVehicle;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                var existingVehicle, deletedVehicle;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, tx.vehicle.findFirst({
                                                where: { id: id, companyId: companyId },
                                            })];
                                        case 1:
                                            existingVehicle = _a.sent();
                                            if (!existingVehicle)
                                                throw new common_1.NotFoundException();
                                            return [4 /*yield*/, tx.vehicle.update({
                                                    where: { id: id, companyId: companyId },
                                                    data: { deletedAt: new Date(), status: 'OUT_OF_SERVICE' },
                                                })];
                                        case 2:
                                            deletedVehicle = _a.sent();
                                            return [4 /*yield*/, this.auditService.logEvent({
                                                    companyId: companyId,
                                                    entity: 'Vehicle',
                                                    entityType: 'Vehicle',
                                                    entityId: deletedVehicle.id,
                                                    action: 'DELETE',
                                                    details: __assign({}, deletedVehicle),
                                                    source: 'API',
                                                }, null, tx)];
                                        case 3:
                                            _a.sent();
                                            return [4 /*yield*/, this.eventStore.append({
                                                    tenantId: companyId,
                                                    streamType: 'VEHICLE',
                                                    streamId: deletedVehicle.id,
                                                    eventType: 'VehicleDeleted',
                                                    payload: {},
                                                })];
                                        case 4:
                                            _a.sent();
                                            return [2 /*return*/, deletedVehicle];
                                    }
                                });
                            }); })];
                        case 1:
                            deletedVehicle = _a.sent();
                            this.eventEmitter.emit('vehicle.deleted', deletedVehicle);
                            return [2 /*return*/, deletedVehicle];
                    }
                });
            });
        };
        return VehiclesService_1;
    }());
    __setFunctionName(_classThis, "VehiclesService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        VehiclesService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return VehiclesService = _classThis;
}();
exports.VehiclesService = VehiclesService;
