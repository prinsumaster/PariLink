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
exports.BrokerService = void 0;
// @ts-nocheck
var common_1 = require("@nestjs/common");
var pagination_util_1 = require("../platform/api/utils/pagination.util");
var BrokerService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var BrokerService = _classThis = /** @class */ (function () {
        function BrokerService_1(prisma, auditService, eventStore) {
            this.prisma = prisma;
            this.auditService = auditService;
            this.eventStore = eventStore;
        }
        BrokerService_1.prototype.createCarrier = function (companyId, data, userId) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                            var carrier;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, tx.externalCarrier.create({
                                            data: {
                                                companyId: companyId,
                                                name: data.name,
                                                dotNumber: data.dotNumber,
                                                mcNumber: data.mcNumber,
                                                contactName: data.contactName,
                                                email: data.email,
                                                phone: data.phone,
                                            },
                                        })];
                                    case 1:
                                        carrier = _a.sent();
                                        return [4 /*yield*/, this.auditService.logEvent({
                                                companyId: companyId,
                                                entity: 'Broker',
                                                entityType: 'ExternalCarrier',
                                                entityId: carrier.id,
                                                action: 'CREATE',
                                                details: { name: carrier.name },
                                                source: 'API',
                                            }, null, tx)];
                                    case 2:
                                        _a.sent();
                                        return [4 /*yield*/, this.eventStore.append({
                                                tenantId: companyId,
                                                streamType: 'EXTERNAL_CARRIER',
                                                streamId: carrier.id,
                                                eventType: 'CarrierCreated',
                                                payload: { name: carrier.name },
                                                userId: userId,
                                            })];
                                    case 3:
                                        _a.sent();
                                        return [2 /*return*/, carrier];
                                }
                            });
                        }); })];
                });
            });
        };
        BrokerService_1.prototype.getCarriers = function (companyId) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, tx.externalCarrier.findMany({ where: { companyId: companyId } })];
                        }); }); })];
                });
            });
        };
        BrokerService_1.prototype.postToLoadBoard = function (companyId, tripId, data, userId) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                            var trip, boardItem;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, tx.trip.findUnique({
                                            where: { id: tripId, companyId: companyId },
                                        })];
                                    case 1:
                                        trip = _a.sent();
                                        if (!trip)
                                            throw new common_1.NotFoundException('Trip not found');
                                        return [4 /*yield*/, tx.loadBoardItem.create({
                                                data: {
                                                    companyId: companyId,
                                                    tripId: tripId,
                                                    origin: data.origin,
                                                    destination: data.destination,
                                                    pickupTime: new Date(data.pickupTime),
                                                    deliveryTime: new Date(data.deliveryTime),
                                                    weight: data.weight,
                                                    equipmentType: data.equipmentType,
                                                    maxRate: data.maxRate,
                                                    status: 'OPEN',
                                                },
                                            })];
                                    case 2:
                                        boardItem = _a.sent();
                                        return [4 /*yield*/, this.auditService.logEvent({
                                                companyId: companyId,
                                                entity: 'Broker',
                                                entityType: 'LoadBoardItem',
                                                entityId: boardItem.id,
                                                action: 'CREATE',
                                                details: { tripId: boardItem.tripId },
                                                source: 'API',
                                            }, null, tx)];
                                    case 3:
                                        _a.sent();
                                        return [4 /*yield*/, this.eventStore.append({
                                                tenantId: companyId,
                                                streamType: 'LOAD_BOARD_ITEM',
                                                streamId: boardItem.id,
                                                eventType: 'LoadBoardItemCreated',
                                                payload: { tripId: boardItem.tripId },
                                                userId: userId,
                                            })];
                                    case 4:
                                        _a.sent();
                                        return [2 /*return*/, boardItem];
                                }
                            });
                        }); })];
                });
            });
        };
        BrokerService_1.prototype.getLoadBoard = function (companyId_1, status_1) {
            return __awaiter(this, arguments, void 0, function (companyId, status, page, limit) {
                var _this = this;
                if (page === void 0) { page = 1; }
                if (limit === void 0) { limit = 10; }
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                            var _a, skip, take, where, _b, data, total;
                            return __generator(this, function (_c) {
                                switch (_c.label) {
                                    case 0:
                                        _a = (0, pagination_util_1.getPaginationParams)(page, limit), skip = _a.skip, take = _a.take;
                                        where = { companyId: companyId };
                                        if (status)
                                            where.status = status;
                                        return [4 /*yield*/, Promise.all([
                                                tx.loadBoardItem.findMany({
                                                    where: where,
                                                    skip: skip,
                                                    take: take,
                                                    orderBy: { createdAt: 'desc' },
                                                    include: { trip: true, bids: true },
                                                }),
                                                tx.loadBoardItem.count({ where: where }),
                                            ])];
                                    case 1:
                                        _b = _c.sent(), data = _b[0], total = _b[1];
                                        return [2 /*return*/, (0, pagination_util_1.createPaginationResponse)(data, total, page, limit)];
                                }
                            });
                        }); })];
                });
            });
        };
        BrokerService_1.prototype.submitBid = function (companyId, loadBoardItemId, carrierId, data, userId) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                            var bid;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, tx.carrierBid.create({
                                            data: {
                                                companyId: companyId,
                                                loadBoardItemId: loadBoardItemId,
                                                carrierId: carrierId,
                                                bidAmount: data.bidAmount,
                                                notes: data.notes,
                                            },
                                        })];
                                    case 1:
                                        bid = _a.sent();
                                        return [4 /*yield*/, this.auditService.logEvent({
                                                companyId: companyId,
                                                entity: 'Broker',
                                                entityType: 'CarrierBid',
                                                entityId: bid.id,
                                                action: 'CREATE',
                                                details: { carrierId: carrierId, loadBoardItemId: loadBoardItemId, bidAmount: data.bidAmount },
                                                source: 'API',
                                            }, null, tx)];
                                    case 2:
                                        _a.sent();
                                        return [4 /*yield*/, this.eventStore.append({
                                                tenantId: companyId,
                                                streamType: 'CARRIER_BID',
                                                streamId: bid.id,
                                                eventType: 'CarrierBidSubmitted',
                                                payload: { carrierId: carrierId, loadBoardItemId: loadBoardItemId, bidAmount: data.bidAmount },
                                                userId: userId,
                                            })];
                                    case 3:
                                        _a.sent();
                                        return [2 /*return*/, bid];
                                }
                            });
                        }); })];
                });
            });
        };
        BrokerService_1.prototype.acceptBid = function (companyId, bidId, userId) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                            var bid, acceptedBid, load;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, tx.carrierBid.findUnique({
                                            where: { id: bidId, companyId: companyId },
                                            include: { loadBoardItem: true },
                                        })];
                                    case 1:
                                        bid = _a.sent();
                                        if (!bid)
                                            throw new common_1.NotFoundException('Bid not found');
                                        if (bid.status !== 'PENDING')
                                            throw new common_1.BadRequestException('Bid is not pending');
                                        // Reject all other bids for this load
                                        return [4 /*yield*/, tx.carrierBid.updateMany({
                                                where: {
                                                    companyId: companyId,
                                                    loadBoardItemId: bid.loadBoardItemId,
                                                    id: { not: bidId },
                                                },
                                                data: { status: 'REJECTED' },
                                            })];
                                    case 2:
                                        // Reject all other bids for this load
                                        _a.sent();
                                        return [4 /*yield*/, tx.carrierBid.update({
                                                where: { id: bidId, companyId: companyId },
                                                data: { status: 'ACCEPTED' },
                                            })];
                                    case 3:
                                        acceptedBid = _a.sent();
                                        return [4 /*yield*/, tx.loadBoardItem.update({
                                                where: { id: bid.loadBoardItemId, companyId: companyId },
                                                data: {
                                                    status: 'ASSIGNED',
                                                    assignedToId: bid.carrierId,
                                                    assignedRate: bid.bidAmount,
                                                    margin: (bid.loadBoardItem.maxRate || 0) - bid.bidAmount,
                                                },
                                            })];
                                    case 4:
                                        load = _a.sent();
                                        return [4 /*yield*/, this.auditService.logEvent({
                                                companyId: companyId,
                                                entity: 'Broker',
                                                entityType: 'CarrierBid',
                                                entityId: bid.id,
                                                action: 'ACCEPT',
                                                details: { loadBoardItemId: bid.loadBoardItemId },
                                                source: 'API',
                                            }, null, tx)];
                                    case 5:
                                        _a.sent();
                                        return [4 /*yield*/, this.eventStore.append({
                                                tenantId: companyId,
                                                streamType: 'CARRIER_BID',
                                                streamId: bid.id,
                                                eventType: 'CarrierBidAccepted',
                                                payload: { loadBoardItemId: bid.loadBoardItemId },
                                                userId: userId,
                                            })];
                                    case 6:
                                        _a.sent();
                                        return [2 /*return*/, { bid: acceptedBid, load: load }];
                                }
                            });
                        }); })];
                });
            });
        };
        return BrokerService_1;
    }());
    __setFunctionName(_classThis, "BrokerService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        BrokerService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return BrokerService = _classThis;
}();
exports.BrokerService = BrokerService;
