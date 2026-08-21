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
exports.PurchaseOrderService = void 0;
// @ts-nocheck
var common_1 = require("@nestjs/common");
var PurchaseOrderService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var PurchaseOrderService = _classThis = /** @class */ (function () {
        function PurchaseOrderService_1(prisma) {
            this.prisma = prisma;
        }
        PurchaseOrderService_1.prototype.createPurchaseOrder = function (companyId, data) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                            var totalAmount;
                            return __generator(this, function (_a) {
                                totalAmount = 0;
                                if (data.items && Array.isArray(data.items)) {
                                    totalAmount = data.items.reduce(function (sum, item) { return sum + item.quantity * item.unitPrice; }, 0);
                                }
                                return [2 /*return*/, tx.purchaseOrder.create({
                                        data: {
                                            companyId: companyId,
                                            vendorId: data.vendorId,
                                            poNumber: data.poNumber,
                                            date: new Date(data.date),
                                            expectedDate: data.expectedDate
                                                ? new Date(data.expectedDate)
                                                : undefined,
                                            status: 'DRAFT',
                                            totalAmount: totalAmount,
                                            notes: data.notes,
                                            items: {
                                                create: (data.items || []).map(function (item) { return ({
                                                    companyId: companyId,
                                                    description: item.description,
                                                    quantity: item.quantity,
                                                    unitPrice: item.unitPrice,
                                                    totalPrice: item.quantity * item.unitPrice,
                                                }); }),
                                            },
                                        },
                                        include: { items: true },
                                    })];
                            });
                        }); })];
                });
            });
        };
        PurchaseOrderService_1.prototype.getPurchaseOrders = function (companyId, status) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                            var where;
                            return __generator(this, function (_a) {
                                where = { companyId: companyId };
                                if (status)
                                    where.status = status;
                                return [2 /*return*/, tx.purchaseOrder.findMany({
                                        where: where,
                                        include: { vendor: true },
                                        orderBy: { date: 'desc' },
                                    })];
                            });
                        }); })];
                });
            });
        };
        PurchaseOrderService_1.prototype.receivePurchaseOrderItems = function (companyId, poId, receivedItems) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                            var po, allReceived, anyReceived, _loop_1, _i, receivedItems_1, reqItem, updatedPoItems, fullyReceived, newStatus;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, tx.purchaseOrder.findUnique({
                                            where: { id: poId, companyId: companyId },
                                            include: { items: true },
                                        })];
                                    case 1:
                                        po = _a.sent();
                                        if (!po)
                                            throw new common_1.NotFoundException('Purchase order not found');
                                        allReceived = true;
                                        anyReceived = false;
                                        _loop_1 = function (reqItem) {
                                            var item, newReceivedQty;
                                            return __generator(this, function (_b) {
                                                switch (_b.label) {
                                                    case 0:
                                                        item = po.items.find(function (i) { return i.id === reqItem.itemId; });
                                                        if (!item) return [3 /*break*/, 2];
                                                        newReceivedQty = item.receivedQty + reqItem.quantity;
                                                        return [4 /*yield*/, tx.purchaseOrderItem.update({
                                                                where: { id: item.id },
                                                                data: { receivedQty: newReceivedQty },
                                                            })];
                                                    case 1:
                                                        _b.sent();
                                                        if (newReceivedQty > 0)
                                                            anyReceived = true;
                                                        if (newReceivedQty < item.quantity)
                                                            allReceived = false;
                                                        _b.label = 2;
                                                    case 2: return [2 /*return*/];
                                                }
                                            });
                                        };
                                        _i = 0, receivedItems_1 = receivedItems;
                                        _a.label = 2;
                                    case 2:
                                        if (!(_i < receivedItems_1.length)) return [3 /*break*/, 5];
                                        reqItem = receivedItems_1[_i];
                                        return [5 /*yield**/, _loop_1(reqItem)];
                                    case 3:
                                        _a.sent();
                                        _a.label = 4;
                                    case 4:
                                        _i++;
                                        return [3 /*break*/, 2];
                                    case 5: return [4 /*yield*/, tx.purchaseOrderItem.findMany({
                                            where: { purchaseOrderId: poId },
                                        })];
                                    case 6:
                                        updatedPoItems = _a.sent();
                                        fullyReceived = updatedPoItems.every(function (i) { return i.receivedQty >= i.quantity; });
                                        newStatus = fullyReceived
                                            ? 'RECEIVED'
                                            : anyReceived
                                                ? 'PARTIAL_RECEIVED'
                                                : po.status;
                                        return [2 /*return*/, tx.purchaseOrder.update({
                                                where: { id: poId },
                                                data: { status: newStatus },
                                                include: { items: true },
                                            })];
                                }
                            });
                        }); })];
                });
            });
        };
        return PurchaseOrderService_1;
    }());
    __setFunctionName(_classThis, "PurchaseOrderService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        PurchaseOrderService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return PurchaseOrderService = _classThis;
}();
exports.PurchaseOrderService = PurchaseOrderService;
