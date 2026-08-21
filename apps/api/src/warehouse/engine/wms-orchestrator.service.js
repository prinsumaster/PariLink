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
exports.WmsOrchestratorService = void 0;
var common_1 = require("@nestjs/common");
var event_emitter_1 = require("@nestjs/event-emitter");
/**
 * Enterprise Warehouse Management System (WMS) Orchestrator.
 * Event-Driven integration between WMS, Finance, Dispatch, and ELOM.
 */
var WmsOrchestratorService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _handleWmsEvents_decorators;
    var WmsOrchestratorService = _classThis = /** @class */ (function () {
        function WmsOrchestratorService_1(prisma, eventStore, lifecycle, invoicesService) {
            this.prisma = (__runInitializers(this, _instanceExtraInitializers), prisma);
            this.eventStore = eventStore;
            this.lifecycle = lifecycle;
            this.invoicesService = invoicesService;
            this.logger = new common_1.Logger(WmsOrchestratorService.name);
        }
        WmsOrchestratorService_1.prototype.handleWmsEvents = function (payload) {
            return __awaiter(this, void 0, void 0, function () {
                var _a, err_1, errorMessage;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            if (!payload || !payload.eventType)
                                return [2 /*return*/];
                            _b.label = 1;
                        case 1:
                            _b.trys.push([1, 9, , 10]);
                            _a = payload.eventType;
                            switch (_a) {
                                case 'ShipmentDispatched': return [3 /*break*/, 2];
                                case 'InventoryAdjusted': return [3 /*break*/, 4];
                                case 'InventoryReceived': return [3 /*break*/, 6];
                            }
                            return [3 /*break*/, 8];
                        case 2: return [4 /*yield*/, this.handleShipmentDispatched(payload.tenantId, payload.streamId, payload.userId)];
                        case 3:
                            _b.sent();
                            return [3 /*break*/, 8];
                        case 4: 
                        // Triggers Finance Journal Entries (Write-offs)
                        return [4 /*yield*/, this.handleInventoryAdjustment(payload.tenantId, payload.streamId, payload.payload, payload.userId)];
                        case 5:
                            // Triggers Finance Journal Entries (Write-offs)
                            _b.sent();
                            return [3 /*break*/, 8];
                        case 6: 
                        // Triggers Finance AP Integration for Vendor Billing
                        return [4 /*yield*/, this.handleInventoryReceived(payload.tenantId, payload.streamId, payload.payload, payload.userId)];
                        case 7:
                            // Triggers Finance AP Integration for Vendor Billing
                            _b.sent();
                            return [3 /*break*/, 8];
                        case 8: return [3 /*break*/, 10];
                        case 9:
                            err_1 = _b.sent();
                            errorMessage = err_1 instanceof Error ? err_1.message : String(err_1);
                            this.logger.error("WMS Orchestration Error: [".concat(payload.eventType, "] ").concat(errorMessage));
                            return [3 /*break*/, 10];
                        case 10: return [2 /*return*/];
                    }
                });
            });
        };
        WmsOrchestratorService_1.prototype.handleShipmentDispatched = function (companyId, shipmentId, userId) {
            return __awaiter(this, void 0, void 0, function () {
                var loadId;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.logger.log("WMS: Processing ShipmentDispatched for ".concat(shipmentId));
                            loadId = shipmentId;
                            return [4 /*yield*/, this.lifecycle.transitionState({
                                    companyId: companyId,
                                    entityType: 'Load',
                                    entityId: loadId,
                                    fromState: 'ALLOCATED',
                                    toState: 'IN_PROGRESS',
                                    userId: userId,
                                    reason: 'WMS Dispatch Confirmation',
                                })];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        WmsOrchestratorService_1.prototype.handleInventoryAdjustment = function (companyId, sku, data, userId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.logger.log("WMS: Processing InventoryAdjustment for ".concat(sku));
                            if (!(data.reason === 'DAMAGE' || data.reason === 'EXPIRY')) return [3 /*break*/, 2];
                            return [4 /*yield*/, this.eventStore.append({
                                    tenantId: companyId,
                                    streamId: sku,
                                    streamType: 'LEDGER',
                                    eventType: 'JournalEntryPosted',
                                    payload: {
                                        debitAccount: 'INVENTORY_WRITE_OFF_EXPENSE',
                                        creditAccount: 'INVENTORY_ASSET',
                                        amount: data.financialValue || 0,
                                    },
                                    userId: userId,
                                })];
                        case 1:
                            _a.sent();
                            _a.label = 2;
                        case 2: return [2 /*return*/];
                    }
                });
            });
        };
        WmsOrchestratorService_1.prototype.handleInventoryReceived = function (companyId, asnId, data, userId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.logger.log("WMS: Processing InventoryReceived for ASN ".concat(asnId));
                            if (!data.is3PL) return [3 /*break*/, 2];
                            return [4 /*yield*/, this.eventStore.append({
                                    tenantId: companyId,
                                    streamId: asnId,
                                    streamType: 'BILLING',
                                    eventType: 'StorageChargeAccrued',
                                    payload: { customerId: data.ownerId, amount: data.volume * 0.5 }, // 50 cents per unit
                                    userId: userId,
                                })];
                        case 1:
                            _a.sent();
                            _a.label = 2;
                        case 2: return [2 /*return*/];
                    }
                });
            });
        };
        return WmsOrchestratorService_1;
    }());
    __setFunctionName(_classThis, "WmsOrchestratorService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _handleWmsEvents_decorators = [(0, event_emitter_1.OnEvent)('EventStore.*')];
        __esDecorate(_classThis, null, _handleWmsEvents_decorators, { kind: "method", name: "handleWmsEvents", static: false, private: false, access: { has: function (obj) { return "handleWmsEvents" in obj; }, get: function (obj) { return obj.handleWmsEvents; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        WmsOrchestratorService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return WmsOrchestratorService = _classThis;
}();
exports.WmsOrchestratorService = WmsOrchestratorService;
