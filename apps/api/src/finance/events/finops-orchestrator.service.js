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
exports.FinOpsOrchestratorService = void 0;
var common_1 = require("@nestjs/common");
var event_emitter_1 = require("@nestjs/event-emitter");
/**
 * Enterprise Financial Operating Platform (FinOps) Orchestrator.
 * Event-Driven Finance Controller.
 */
var FinOpsOrchestratorService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _handleFinancialEvents_decorators;
    var FinOpsOrchestratorService = _classThis = /** @class */ (function () {
        function FinOpsOrchestratorService_1(prisma, pricingEngine, settlementEngine, eventStore, invoicesService) {
            this.prisma = (__runInitializers(this, _instanceExtraInitializers), prisma);
            this.pricingEngine = pricingEngine;
            this.settlementEngine = settlementEngine;
            this.eventStore = eventStore;
            this.invoicesService = invoicesService;
            this.logger = new common_1.Logger(FinOpsOrchestratorService.name);
        }
        FinOpsOrchestratorService_1.prototype.handleFinancialEvents = function (payload) {
            return __awaiter(this, void 0, void 0, function () {
                var _a, err_1, errorMessage;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            if (!payload || !payload.eventType)
                                return [2 /*return*/];
                            _b.label = 1;
                        case 1:
                            _b.trys.push([1, 10, , 11]);
                            _a = payload.eventType;
                            switch (_a) {
                                case 'LifecycleStateChangedToCOMPLETED': return [3 /*break*/, 2];
                                case 'PODUploaded': return [3 /*break*/, 5];
                                case 'PaymentReceived': return [3 /*break*/, 7];
                            }
                            return [3 /*break*/, 9];
                        case 2:
                            if (!(payload.streamType === 'TRIP')) return [3 /*break*/, 4];
                            return [4 /*yield*/, this.handleTripCompleted(payload.tenantId, payload.streamId, payload.userId)];
                        case 3:
                            _b.sent();
                            _b.label = 4;
                        case 4: return [3 /*break*/, 9];
                        case 5: 
                        // POD Triggers final billing
                        return [4 /*yield*/, this.handlePodUploaded(payload.tenantId, payload.streamId, payload.userId)];
                        case 6:
                            // POD Triggers final billing
                            _b.sent();
                            return [3 /*break*/, 9];
                        case 7: 
                        // Auto-reconcile AR and settle AP
                        return [4 /*yield*/, this.handlePaymentReceived(payload.tenantId, payload.streamId, payload.userId)];
                        case 8:
                            // Auto-reconcile AR and settle AP
                            _b.sent();
                            return [3 /*break*/, 9];
                        case 9: return [3 /*break*/, 11];
                        case 10:
                            err_1 = _b.sent();
                            errorMessage = err_1 instanceof Error ? err_1.message : String(err_1);
                            this.logger.error("FinOps Orchestration Error: [".concat(payload.eventType, "] ").concat(errorMessage));
                            return [3 /*break*/, 11];
                        case 11: return [2 /*return*/];
                    }
                });
            });
        };
        FinOpsOrchestratorService_1.prototype.handleTripCompleted = function (companyId, tripId, userId) {
            return __awaiter(this, void 0, void 0, function () {
                var trip;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.logger.log("FinOps: Processing TripCompleted for ".concat(tripId));
                            return [4 /*yield*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.trip.findUnique({
                                                where: { id: tripId },
                                                include: { vehicle: true },
                                            })];
                                    });
                                }); })];
                        case 1:
                            trip = _a.sent();
                            if (!(trip && trip.driverId)) return [3 /*break*/, 4];
                            return [4 /*yield*/, this.settlementEngine.generateSettlement({
                                    companyId: companyId,
                                    driverId: trip.driverId,
                                    tripIds: [tripId],
                                    advances: trip.fuelExpenses || 0,
                                })];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, this.eventStore.append({
                                    tenantId: companyId,
                                    streamId: tripId,
                                    streamType: 'TRIP_FINANCE',
                                    eventType: 'SettlementAccrued',
                                    payload: { driverId: trip.driverId },
                                    userId: userId,
                                })];
                        case 3:
                            _a.sent();
                            _a.label = 4;
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        FinOpsOrchestratorService_1.prototype.handlePodUploaded = function (companyId, loadId, userId) {
            return __awaiter(this, void 0, void 0, function () {
                var load, pricing, invoice;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.logger.log("FinOps: Processing PODUploaded for Load ".concat(loadId));
                            return [4 /*yield*/, this.prisma.load.findUnique({
                                    where: { id: loadId },
                                })];
                        case 1:
                            load = _a.sent();
                            if (!load)
                                return [2 /*return*/];
                            return [4 /*yield*/, this.pricingEngine.calculatePrice({
                                    companyId: companyId,
                                    customerId: load.customerId,
                                    weightKg: load.weight,
                                    volumeM3: load.volume,
                                })];
                        case 2:
                            pricing = _a.sent();
                            return [4 /*yield*/, this.invoicesService.createInvoice(companyId, {
                                    customerId: load.customerId,
                                    loadId: load.id,
                                    amount: pricing.totalAmount,
                                    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Net 30
                                    invoiceNumber: "INV-FINOPS-".concat(Date.now()),
                                })];
                        case 3:
                            invoice = _a.sent();
                            if (!invoice) return [3 /*break*/, 5];
                            return [4 /*yield*/, this.eventStore.append({
                                    tenantId: companyId,
                                    streamId: invoice.id,
                                    streamType: 'INVOICE',
                                    eventType: 'InvoiceGenerated',
                                    payload: { amount: pricing.totalAmount, breakdown: pricing },
                                    userId: userId,
                                })];
                        case 4:
                            _a.sent();
                            _a.label = 5;
                        case 5: return [2 /*return*/];
                    }
                });
            });
        };
        FinOpsOrchestratorService_1.prototype.handlePaymentReceived = function (companyId, invoiceId, userId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.logger.log("FinOps: Posting General Ledger Entries for Payment on Invoice ".concat(invoiceId));
                            // Simulate GL Postings (Accounts Receivable Credit, Cash Debit)
                            return [4 /*yield*/, this.eventStore.append({
                                    tenantId: companyId,
                                    streamId: invoiceId,
                                    streamType: 'LEDGER',
                                    eventType: 'JournalEntryPosted',
                                    payload: {
                                        debitAccount: 'CASH',
                                        creditAccount: 'ACCOUNTS_RECEIVABLE',
                                        reference: invoiceId,
                                    },
                                    userId: userId,
                                })];
                        case 1:
                            // Simulate GL Postings (Accounts Receivable Credit, Cash Debit)
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        return FinOpsOrchestratorService_1;
    }());
    __setFunctionName(_classThis, "FinOpsOrchestratorService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _handleFinancialEvents_decorators = [(0, event_emitter_1.OnEvent)('EventStore.*')];
        __esDecorate(_classThis, null, _handleFinancialEvents_decorators, { kind: "method", name: "handleFinancialEvents", static: false, private: false, access: { has: function (obj) { return "handleFinancialEvents" in obj; }, get: function (obj) { return obj.handleFinancialEvents; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        FinOpsOrchestratorService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return FinOpsOrchestratorService = _classThis;
}();
exports.FinOpsOrchestratorService = FinOpsOrchestratorService;
