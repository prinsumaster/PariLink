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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoadsService = void 0;
var pagination_util_1 = require("../platform/api/utils/pagination.util");
var common_1 = require("@nestjs/common");
var crypto = __importStar(require("crypto"));
var LoadsService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var LoadsService = _classThis = /** @class */ (function () {
        function LoadsService_1(prisma, workflow, eventEmitter, auditService, eventStore) {
            this.prisma = prisma;
            this.workflow = workflow;
            this.eventEmitter = eventEmitter;
            this.auditService = auditService;
            this.eventStore = eventStore;
            this.logger = new common_1.Logger(LoadsService.name);
        }
        LoadsService_1.prototype.create = function (companyId, createLoadDto, userId) {
            return __awaiter(this, void 0, void 0, function () {
                var newLoad;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                var customerId, restDto, customer, data, duplicateRef, createdLoad, ruleResult;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            customerId = createLoadDto.customerId, restDto = __rest(createLoadDto, ["customerId"]);
                                            return [4 /*yield*/, tx.customer.findFirst({
                                                    where: { id: customerId, companyId: companyId },
                                                })];
                                        case 1:
                                            customer = _a.sent();
                                            if (!customer)
                                                throw new common_1.NotFoundException('Customer not found or unauthorized');
                                            data = __assign({}, restDto);
                                            if (data.pickupDate)
                                                data.pickupDate = new Date(data.pickupDate);
                                            if (data.deliveryDate)
                                                data.deliveryDate = new Date(data.deliveryDate);
                                            if (!data.referenceNumber) return [3 /*break*/, 3];
                                            return [4 /*yield*/, tx.load.findFirst({
                                                    where: { referenceNumber: data.referenceNumber, companyId: companyId },
                                                })];
                                        case 2:
                                            duplicateRef = _a.sent();
                                            if (duplicateRef)
                                                throw new common_1.ConflictException("Reference number ".concat(data.referenceNumber, " already exists"));
                                            _a.label = 3;
                                        case 3:
                                            // Auto-generate referenceNumber if not provided
                                            if (!data.referenceNumber) {
                                                data.referenceNumber = "LD-".concat(crypto.randomBytes(4).toString('hex').toUpperCase());
                                            }
                                            return [4 /*yield*/, tx.load.create({
                                                    data: __assign(__assign({}, data), { company: { connect: { id: companyId } }, customer: { connect: { id: customerId } } }),
                                                    include: { customer: true },
                                                })];
                                        case 4:
                                            createdLoad = _a.sent();
                                            return [4 /*yield*/, this.workflow.evaluateRules(companyId, {
                                                    entityType: 'LOAD',
                                                    trigger: 'LOAD_CREATED',
                                                    entityData: createdLoad,
                                                })];
                                        case 5:
                                            ruleResult = _a.sent();
                                            if (ruleResult.triggeredActions.some(function (a) { return a.actionType === 'REJECT'; })) {
                                                throw new Error('Load creation rejected by business rules.');
                                            }
                                            return [4 /*yield*/, this.auditService.logEvent({
                                                    companyId: companyId,
                                                    entity: 'Load',
                                                    entityType: 'Load',
                                                    entityId: createdLoad.id,
                                                    action: 'CREATE',
                                                    details: { referenceNumber: createdLoad.referenceNumber },
                                                    source: 'API',
                                                }, null, tx)];
                                        case 6:
                                            _a.sent();
                                            return [4 /*yield*/, this.eventStore.append({
                                                    tenantId: companyId,
                                                    streamType: 'LOAD',
                                                    streamId: createdLoad.id,
                                                    eventType: 'LoadCreated',
                                                    payload: { referenceNumber: createdLoad.referenceNumber },
                                                    userId: userId,
                                                })];
                                        case 7:
                                            _a.sent();
                                            return [2 /*return*/, createdLoad];
                                    }
                                });
                            }); })];
                        case 1:
                            newLoad = _a.sent();
                            this.eventEmitter.emit('load.created', newLoad);
                            return [2 /*return*/, newLoad];
                    }
                });
            });
        };
        LoadsService_1.prototype.findAll = function (companyId, query) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                            var _a, page, _b, limit, search, status, customerId, _c, skip, take, where, _d, data, total;
                            return __generator(this, function (_e) {
                                switch (_e.label) {
                                    case 0:
                                        _a = query.page, page = _a === void 0 ? 1 : _a, _b = query.limit, limit = _b === void 0 ? 10 : _b, search = query.search, status = query.status, customerId = query.customerId;
                                        _c = (0, pagination_util_1.getPaginationParams)(page, limit), skip = _c.skip, take = _c.take;
                                        where = { companyId: companyId };
                                        if (search) {
                                            where.OR = [
                                                { referenceNumber: { contains: search, mode: 'insensitive' } },
                                                { originCity: { contains: search, mode: 'insensitive' } },
                                                { destinationCity: { contains: search, mode: 'insensitive' } },
                                                { customer: { name: { contains: search, mode: 'insensitive' } } },
                                            ];
                                        }
                                        if (status) {
                                            where.status = status;
                                        }
                                        if (customerId) {
                                            where.customerId = customerId;
                                        }
                                        this.logger.debug("findMany args: page=".concat(page, " limit=").concat(limit, " status=").concat(status !== null && status !== void 0 ? status : 'all', " customerId=").concat(customerId !== null && customerId !== void 0 ? customerId : 'all'));
                                        return [4 /*yield*/, Promise.all([
                                                tx.load.findMany({
                                                    where: where,
                                                    skip: skip,
                                                    take: take,
                                                    orderBy: { createdAt: 'desc' },
                                                    include: { customer: true },
                                                }),
                                                tx.load.count({ where: where }),
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
        LoadsService_1.prototype.findOne = function (companyId, id) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                            var load;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, tx.load.findFirst({
                                            where: { id: id, companyId: companyId },
                                            include: { customer: true, documents: true, invoices: true },
                                        })];
                                    case 1:
                                        load = _a.sent();
                                        if (!load) {
                                            throw new common_1.NotFoundException("Load with ID ".concat(id, " not found"));
                                        }
                                        return [2 /*return*/, load];
                                }
                            });
                        }); })];
                });
            });
        };
        LoadsService_1.prototype.update = function (companyId, id, updateLoadDto, userId) {
            return __awaiter(this, void 0, void 0, function () {
                var updatedLoad;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                var existingLoad, driverId, vehicleId, customerId, restData, customer, data, driver, vehicle, trip, savedLoad, existingInvoice, refPart;
                                var _a;
                                return __generator(this, function (_b) {
                                    switch (_b.label) {
                                        case 0: return [4 /*yield*/, tx.load.findFirst({
                                                where: { id: id, companyId: companyId },
                                            })];
                                        case 1:
                                            existingLoad = _b.sent();
                                            if (!existingLoad)
                                                throw new common_1.NotFoundException();
                                            driverId = updateLoadDto.driverId, vehicleId = updateLoadDto.vehicleId, customerId = updateLoadDto.customerId, restData = __rest(updateLoadDto, ["driverId", "vehicleId", "customerId"]);
                                            if (!(customerId && customerId !== existingLoad.customerId)) return [3 /*break*/, 3];
                                            return [4 /*yield*/, tx.customer.findFirst({
                                                    where: { id: customerId, companyId: companyId },
                                                })];
                                        case 2:
                                            customer = _b.sent();
                                            if (!customer)
                                                throw new common_1.NotFoundException('Customer not found or unauthorized');
                                            _b.label = 3;
                                        case 3:
                                            data = __assign({}, restData);
                                            if (customerId)
                                                data.customerId = customerId;
                                            if (data.pickupDate)
                                                data.pickupDate = new Date(data.pickupDate);
                                            if (data.deliveryDate)
                                                data.deliveryDate = new Date(data.deliveryDate);
                                            // Prevent backwards state transitions
                                            if ((existingLoad.status === 'COMPLETED' ||
                                                existingLoad.status === 'DELIVERED' ||
                                                existingLoad.status === 'CANCELLED') &&
                                                data.status &&
                                                data.status !== existingLoad.status) {
                                                throw new common_1.ConflictException("Cannot change status of a ".concat(existingLoad.status, " load directly."));
                                            }
                                            if (!(driverId &&
                                                vehicleId &&
                                                data.status === 'ASSIGNED' &&
                                                !existingLoad.tripId)) return [3 /*break*/, 9];
                                            return [4 /*yield*/, tx.driver.findFirst({
                                                    where: { id: driverId, companyId: companyId },
                                                })];
                                        case 4:
                                            driver = _b.sent();
                                            if (!driver || driver.status !== 'AVAILABLE')
                                                throw new common_1.ConflictException('Driver is not available');
                                            return [4 /*yield*/, tx.vehicle.findFirst({
                                                    where: { id: vehicleId, companyId: companyId },
                                                })];
                                        case 5:
                                            vehicle = _b.sent();
                                            if (!vehicle || vehicle.status !== 'IN_SERVICE')
                                                throw new common_1.ConflictException('Vehicle is not available');
                                            return [4 /*yield*/, tx.trip.create({
                                                    data: {
                                                        companyId: companyId,
                                                        tripNumber: "TRP-".concat(crypto.randomBytes(4).toString('hex').toUpperCase()),
                                                        driverId: driverId,
                                                        vehicleId: vehicleId,
                                                        status: 'DISPATCHED',
                                                    },
                                                })];
                                        case 6:
                                            trip = _b.sent();
                                            return [4 /*yield*/, this.prisma.updateWithOcc(tx, 'driver', driverId, driver.updatedAt, { status: 'DISPATCHED' })];
                                        case 7:
                                            _b.sent();
                                            return [4 /*yield*/, this.prisma.updateWithOcc(tx, 'vehicle', vehicleId, vehicle.updatedAt, { status: 'DISPATCHED' })];
                                        case 8:
                                            _b.sent();
                                            data.tripId = trip.id;
                                            _b.label = 9;
                                        case 9:
                                            this.logger.debug("Updating load ".concat(id, " with status=").concat((_a = updateLoadDto.status) !== null && _a !== void 0 ? _a : 'unchanged'));
                                            return [4 /*yield*/, this.prisma.updateWithOcc(tx, 'load', id, existingLoad.updatedAt, data, { customer: true })];
                                        case 10:
                                            savedLoad = _b.sent();
                                            this.logger.debug("Load ".concat(id, " updated successfully"));
                                            if (!(updateLoadDto.status === 'DELIVERED')) return [3 /*break*/, 13];
                                            return [4 /*yield*/, tx.invoice.findFirst({
                                                    where: { loadId: id },
                                                })];
                                        case 11:
                                            existingInvoice = _b.sent();
                                            if (!!existingInvoice) return [3 /*break*/, 13];
                                            refPart = savedLoad.referenceNumber
                                                ? savedLoad.referenceNumber.split('-').pop()
                                                : crypto.randomBytes(4).toString('hex').toUpperCase();
                                            return [4 /*yield*/, tx.invoice.create({
                                                    data: {
                                                        companyId: companyId,
                                                        customerId: savedLoad.customerId,
                                                        loadId: savedLoad.id,
                                                        invoiceNumber: "INV-".concat(refPart),
                                                        status: 'DRAFT',
                                                        amount: savedLoad.rate || 1500,
                                                        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                                                    },
                                                })];
                                        case 12:
                                            _b.sent();
                                            _b.label = 13;
                                        case 13: return [4 /*yield*/, this.auditService.logEvent({
                                                companyId: companyId,
                                                entity: 'Load',
                                                entityType: 'Load',
                                                entityId: savedLoad.id,
                                                action: 'UPDATE',
                                                details: { status: savedLoad.status },
                                                source: 'API',
                                            }, null, tx)];
                                        case 14:
                                            _b.sent();
                                            return [4 /*yield*/, this.eventStore.append({
                                                    tenantId: companyId,
                                                    streamType: 'LOAD',
                                                    streamId: savedLoad.id,
                                                    eventType: 'LoadUpdated',
                                                    payload: { status: savedLoad.status },
                                                    userId: userId,
                                                })];
                                        case 15:
                                            _b.sent();
                                            return [2 /*return*/, savedLoad];
                                    }
                                });
                            }); })];
                        case 1:
                            updatedLoad = _a.sent();
                            this.eventEmitter.emit('load.updated', updatedLoad);
                            return [2 /*return*/, updatedLoad];
                    }
                });
            });
        };
        LoadsService_1.prototype.remove = function (companyId, id, userId) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                            var existingLoad, deletedLoad;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, tx.load.findFirst({
                                            where: { id: id, companyId: companyId },
                                        })];
                                    case 1:
                                        existingLoad = _a.sent();
                                        if (!existingLoad)
                                            throw new common_1.NotFoundException();
                                        return [4 /*yield*/, tx.load.update({
                                                where: { id: id, companyId: companyId },
                                                data: { deletedAt: new Date(), status: 'CANCELLED' },
                                            })];
                                    case 2:
                                        deletedLoad = _a.sent();
                                        return [4 /*yield*/, this.auditService.logEvent({
                                                companyId: companyId,
                                                entity: 'Load',
                                                entityType: 'Load',
                                                entityId: deletedLoad.id,
                                                action: 'DELETE',
                                                details: { status: deletedLoad.status },
                                                source: 'API',
                                            }, null, tx)];
                                    case 3:
                                        _a.sent();
                                        return [4 /*yield*/, this.eventStore.append({
                                                tenantId: companyId,
                                                streamType: 'LOAD',
                                                streamId: deletedLoad.id,
                                                eventType: 'LoadDeleted',
                                                payload: { status: deletedLoad.status },
                                                userId: userId,
                                            })];
                                    case 4:
                                        _a.sent();
                                        return [2 /*return*/, deletedLoad];
                                }
                            });
                        }); })];
                });
            });
        };
        return LoadsService_1;
    }());
    __setFunctionName(_classThis, "LoadsService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        LoadsService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return LoadsService = _classThis;
}();
exports.LoadsService = LoadsService;
