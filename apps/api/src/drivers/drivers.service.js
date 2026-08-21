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
exports.DriversService = void 0;
var pagination_util_1 = require("../platform/api/utils/pagination.util");
var common_1 = require("@nestjs/common");
var DriversService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var DriversService = _classThis = /** @class */ (function () {
        function DriversService_1(auditService, prisma, workflow, eventEmitter, eventStore) {
            this.auditService = auditService;
            this.prisma = prisma;
            this.workflow = workflow;
            this.eventEmitter = eventEmitter;
            this.eventStore = eventStore;
        }
        DriversService_1.prototype.create = function (companyId, createDriverDto) {
            return __awaiter(this, void 0, void 0, function () {
                var newDriver;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                var orConditions, existing, data, newDriver, ruleResult;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            if (!(createDriverDto.email || createDriverDto.licenseNumber)) return [3 /*break*/, 2];
                                            orConditions = [];
                                            if (createDriverDto.email)
                                                orConditions.push({ email: createDriverDto.email });
                                            if (createDriverDto.licenseNumber)
                                                orConditions.push({ licenseNumber: createDriverDto.licenseNumber });
                                            return [4 /*yield*/, tx.driver.findFirst({
                                                    where: {
                                                        companyId: companyId,
                                                        OR: orConditions,
                                                    },
                                                })];
                                        case 1:
                                            existing = _a.sent();
                                            if (existing) {
                                                throw new common_1.ConflictException('A driver with this email or license number already exists.');
                                            }
                                            _a.label = 2;
                                        case 2:
                                            data = __assign(__assign({}, createDriverDto), { companyId: companyId });
                                            if (data.licenseExpiry) {
                                                data.licenseExpiry = new Date(data.licenseExpiry);
                                            }
                                            return [4 /*yield*/, tx.driver.create({ data: data })];
                                        case 3:
                                            newDriver = _a.sent();
                                            return [4 /*yield*/, this.workflow.evaluateRules(companyId, {
                                                    entityType: 'DRIVER',
                                                    trigger: 'DRIVER_CREATED',
                                                    entityData: newDriver,
                                                })];
                                        case 4:
                                            ruleResult = _a.sent();
                                            if (ruleResult.triggeredActions.some(function (a) { return a.actionType === 'REJECT'; })) {
                                                throw new Error('Driver creation rejected by business rules.');
                                            }
                                            // 3. Audit Logging
                                            return [4 /*yield*/, this.auditService.logEvent({
                                                    companyId: companyId,
                                                    entity: 'Driver',
                                                    entityType: 'Driver',
                                                    entityId: newDriver.id,
                                                    action: 'CREATE',
                                                    details: __assign({}, newDriver),
                                                    source: 'API',
                                                }, null, tx)];
                                        case 5:
                                            // 3. Audit Logging
                                            _a.sent();
                                            return [4 /*yield*/, this.eventStore.append({
                                                    tenantId: companyId,
                                                    streamType: 'DRIVER',
                                                    streamId: newDriver.id,
                                                    eventType: 'DriverCreated',
                                                    payload: __assign({}, newDriver),
                                                })];
                                        case 6:
                                            _a.sent();
                                            return [2 /*return*/, newDriver];
                                    }
                                });
                            }); })];
                        case 1:
                            newDriver = _a.sent();
                            this.eventEmitter.emit('driver.created', newDriver);
                            return [2 /*return*/, newDriver];
                    }
                });
            });
        };
        DriversService_1.prototype.findAll = function (companyId, query) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                            var _a, page, _b, limit, search, status, _c, skip, take, where, _d, data, total;
                            return __generator(this, function (_e) {
                                switch (_e.label) {
                                    case 0:
                                        _a = query.page, page = _a === void 0 ? 1 : _a, _b = query.limit, limit = _b === void 0 ? 10 : _b, search = query.search, status = query.status;
                                        _c = (0, pagination_util_1.getPaginationParams)(page, limit), skip = _c.skip, take = _c.take;
                                        where = { companyId: companyId };
                                        if (search) {
                                            where.OR = [
                                                { firstName: { contains: search, mode: 'insensitive' } },
                                                { lastName: { contains: search, mode: 'insensitive' } },
                                                { email: { contains: search, mode: 'insensitive' } },
                                                { licenseNumber: { contains: search, mode: 'insensitive' } },
                                            ];
                                        }
                                        if (status) {
                                            where.status = status;
                                        }
                                        return [4 /*yield*/, Promise.all([
                                                tx.driver.findMany({
                                                    where: where,
                                                    skip: skip,
                                                    take: take,
                                                    orderBy: { createdAt: 'desc' },
                                                }),
                                                tx.driver.count({ where: where }),
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
        DriversService_1.prototype.findOne = function (companyId, id) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                            var driver;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, tx.driver.findFirst({
                                            where: { id: id, companyId: companyId },
                                        })];
                                    case 1:
                                        driver = _a.sent();
                                        if (!driver) {
                                            throw new common_1.NotFoundException("Driver with ID ".concat(id, " not found"));
                                        }
                                        return [2 /*return*/, driver];
                                }
                            });
                        }); })];
                });
            });
        };
        DriversService_1.prototype.update = function (companyId, id, updateDriverDto) {
            return __awaiter(this, void 0, void 0, function () {
                var updatedDriver;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                var existingDriver, orConditions, existingDuplicate, data, updatedDriver, ruleResult;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, tx.driver.findFirst({
                                                where: { id: id, companyId: companyId },
                                            })];
                                        case 1:
                                            existingDriver = _a.sent();
                                            if (!existingDriver)
                                                throw new common_1.NotFoundException();
                                            if (existingDriver.status === 'DISPATCHED' &&
                                                updateDriverDto.status &&
                                                updateDriverDto.status !== 'DISPATCHED') {
                                                throw new common_1.BadRequestException('Cannot change status of a dispatched driver directly.');
                                            }
                                            if (!(updateDriverDto.email || updateDriverDto.licenseNumber)) return [3 /*break*/, 3];
                                            orConditions = [];
                                            if (updateDriverDto.email)
                                                orConditions.push({ email: updateDriverDto.email });
                                            if (updateDriverDto.licenseNumber)
                                                orConditions.push({ licenseNumber: updateDriverDto.licenseNumber });
                                            return [4 /*yield*/, tx.driver.findFirst({
                                                    where: {
                                                        companyId: companyId,
                                                        id: { not: id },
                                                        OR: orConditions,
                                                    },
                                                })];
                                        case 2:
                                            existingDuplicate = _a.sent();
                                            if (existingDuplicate) {
                                                throw new common_1.ConflictException('A driver with this email or license number already exists.');
                                            }
                                            _a.label = 3;
                                        case 3:
                                            data = __assign({}, updateDriverDto);
                                            if (data.licenseExpiry) {
                                                data.licenseExpiry = new Date(data.licenseExpiry);
                                            }
                                            return [4 /*yield*/, this.prisma.updateWithOcc(tx, 'driver', id, existingDriver.updatedAt, data)];
                                        case 4:
                                            updatedDriver = _a.sent();
                                            return [4 /*yield*/, this.workflow.evaluateRules(companyId, {
                                                    entityType: 'DRIVER',
                                                    trigger: 'DRIVER_UPDATED',
                                                    entityData: updatedDriver,
                                                })];
                                        case 5:
                                            ruleResult = _a.sent();
                                            if (ruleResult.triggeredActions.some(function (a) { return a.actionType === 'REJECT'; })) {
                                                throw new Error('Driver update rejected by business rules.');
                                            }
                                            // Audit Logging
                                            return [4 /*yield*/, this.auditService.logEvent({
                                                    companyId: companyId,
                                                    entity: 'Driver',
                                                    entityType: 'Driver',
                                                    entityId: updatedDriver.id,
                                                    action: 'UPDATE',
                                                    beforeValue: __assign({}, existingDriver),
                                                    afterValue: __assign({}, updatedDriver),
                                                    source: 'API',
                                                }, null, tx)];
                                        case 6:
                                            // Audit Logging
                                            _a.sent();
                                            return [4 /*yield*/, this.eventStore.append({
                                                    tenantId: companyId,
                                                    streamType: 'DRIVER',
                                                    streamId: updatedDriver.id,
                                                    eventType: 'DriverUpdated',
                                                    payload: updateDriverDto,
                                                })];
                                        case 7:
                                            _a.sent();
                                            return [2 /*return*/, updatedDriver];
                                    }
                                });
                            }); })];
                        case 1:
                            updatedDriver = _a.sent();
                            this.eventEmitter.emit('driver.updated', updatedDriver);
                            return [2 /*return*/, updatedDriver];
                    }
                });
            });
        };
        DriversService_1.prototype.remove = function (companyId, id) {
            return __awaiter(this, void 0, void 0, function () {
                var deletedDriver;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                var existingDriver, deletedDriver;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, tx.driver.findFirst({
                                                where: { id: id, companyId: companyId },
                                            })];
                                        case 1:
                                            existingDriver = _a.sent();
                                            if (!existingDriver)
                                                throw new common_1.NotFoundException();
                                            if (existingDriver.status === 'DISPATCHED') {
                                                throw new common_1.BadRequestException('Cannot terminate a driver who is currently dispatched on a trip.');
                                            }
                                            return [4 /*yield*/, tx.driver.update({
                                                    where: { id: id, companyId: companyId },
                                                    data: { deletedAt: new Date(), status: 'TERMINATED' },
                                                })];
                                        case 2:
                                            deletedDriver = _a.sent();
                                            return [4 /*yield*/, this.auditService.logEvent({
                                                    companyId: companyId,
                                                    entity: 'Driver',
                                                    entityType: 'Driver',
                                                    entityId: deletedDriver.id,
                                                    action: 'DELETE',
                                                    details: __assign({}, deletedDriver),
                                                    source: 'API',
                                                }, null, tx)];
                                        case 3:
                                            _a.sent();
                                            return [4 /*yield*/, this.eventStore.append({
                                                    tenantId: companyId,
                                                    streamType: 'DRIVER',
                                                    streamId: deletedDriver.id,
                                                    eventType: 'DriverDeleted',
                                                    payload: {},
                                                })];
                                        case 4:
                                            _a.sent();
                                            return [2 /*return*/, deletedDriver];
                                    }
                                });
                            }); })];
                        case 1:
                            deletedDriver = _a.sent();
                            this.eventEmitter.emit('driver.deleted', deletedDriver);
                            return [2 /*return*/, deletedDriver];
                    }
                });
            });
        };
        return DriversService_1;
    }());
    __setFunctionName(_classThis, "DriversService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        DriversService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return DriversService = _classThis;
}();
exports.DriversService = DriversService;
