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
exports.InventoryService = void 0;
var common_1 = require("@nestjs/common");
var InventoryService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var InventoryService = _classThis = /** @class */ (function () {
        function InventoryService_1(prisma, eventStore, workflow) {
            this.prisma = prisma;
            this.eventStore = eventStore;
            this.workflow = workflow;
            this.logger = new common_1.Logger(InventoryService.name);
        }
        /**
         * Adjust inventory quantity and emit an event
         */
        InventoryService_1.prototype.adjustInventory = function (companyId, itemId, adjustmentQty, reason) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.prisma.$transaction(function (tx) { return __awaiter(_this, void 0, void 0, function () {
                            var item, newQty, updated, ruleResult;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, tx.inventoryItem.findUnique({
                                            where: { id: itemId, companyId: companyId },
                                        })];
                                    case 1:
                                        item = _a.sent();
                                        if (!item)
                                            throw new common_1.NotFoundException('Inventory item not found');
                                        newQty = item.quantity + adjustmentQty;
                                        if (newQty < 0)
                                            throw new common_1.BadRequestException('Insufficient inventory');
                                        return [4 /*yield*/, tx.inventoryItem.update({
                                                where: { id: itemId },
                                                data: { quantity: newQty },
                                            })];
                                    case 2:
                                        updated = _a.sent();
                                        return [4 /*yield*/, this.workflow.evaluateRules(companyId, {
                                                entityType: 'INVENTORY',
                                                trigger: 'INVENTORY_ADJUSTED',
                                                entityData: { item: updated, adjustmentQty: adjustmentQty, reason: reason },
                                            })];
                                    case 3:
                                        ruleResult = _a.sent();
                                        if (ruleResult.triggeredActions.some(function (a) { return a.actionType === 'REJECT'; })) {
                                            throw new common_1.BadRequestException('Inventory adjustment rejected by business rules.');
                                        }
                                        return [4 /*yield*/, this.eventStore.append({
                                                tenantId: companyId,
                                                streamType: 'INVENTORY',
                                                streamId: itemId,
                                                eventType: 'InventoryAdjusted',
                                                payload: {
                                                    previousQuantity: item.quantity,
                                                    newQuantity: newQty,
                                                    adjustment: adjustmentQty,
                                                    reason: reason,
                                                },
                                                userId: 'SYSTEM', // In real app, this should be the user ID
                                            })];
                                    case 4:
                                        _a.sent();
                                        return [2 /*return*/, updated];
                                }
                            });
                        }); })];
                });
            });
        };
        /**
         * Move inventory to a new bin
         */
        InventoryService_1.prototype.moveInventory = function (companyId, itemId, targetBinId, userId) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.prisma.$transaction(function (tx) { return __awaiter(_this, void 0, void 0, function () {
                            var item, targetBin, updated, ruleResult;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, tx.inventoryItem.findUnique({
                                            where: { id: itemId, companyId: companyId },
                                        })];
                                    case 1:
                                        item = _a.sent();
                                        if (!item)
                                            throw new common_1.NotFoundException('Inventory item not found');
                                        return [4 /*yield*/, tx.warehouseBin.findUnique({
                                                where: { id: targetBinId },
                                            })];
                                    case 2:
                                        targetBin = _a.sent();
                                        if (!targetBin || targetBin.status !== 'AVAILABLE') {
                                            throw new common_1.BadRequestException('Target bin is invalid or unavailable');
                                        }
                                        return [4 /*yield*/, tx.inventoryItem.update({
                                                where: { id: itemId },
                                                data: { binId: targetBinId },
                                            })];
                                    case 3:
                                        updated = _a.sent();
                                        return [4 /*yield*/, this.workflow.evaluateRules(companyId, {
                                                entityType: 'INVENTORY',
                                                trigger: 'INVENTORY_MOVED',
                                                entityData: { item: updated, targetBinId: targetBinId, userId: userId },
                                            })];
                                    case 4:
                                        ruleResult = _a.sent();
                                        if (ruleResult.triggeredActions.some(function (a) { return a.actionType === 'REJECT'; })) {
                                            throw new common_1.BadRequestException('Inventory move rejected by business rules.');
                                        }
                                        return [4 /*yield*/, this.eventStore.append({
                                                tenantId: companyId,
                                                streamType: 'INVENTORY',
                                                streamId: itemId,
                                                eventType: 'InventoryMoved',
                                                payload: {
                                                    previousBinId: item.binId,
                                                    newBinId: targetBinId,
                                                },
                                                userId: userId,
                                            })];
                                    case 5:
                                        _a.sent();
                                        return [2 /*return*/, updated];
                                }
                            });
                        }); })];
                });
            });
        };
        /**
         * Get all inventory for a specific warehouse
         */
        InventoryService_1.prototype.getWarehouseInventory = function (companyId, warehouseId) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                return [2 /*return*/, tx.inventoryItem.findMany({
                                        where: { companyId: companyId, warehouseId: warehouseId },
                                        include: {
                                            bin: {
                                                include: { zone: true },
                                            },
                                        },
                                    })];
                            });
                        }); })];
                });
            });
        };
        return InventoryService_1;
    }());
    __setFunctionName(_classThis, "InventoryService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        InventoryService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return InventoryService = _classThis;
}();
exports.InventoryService = InventoryService;
