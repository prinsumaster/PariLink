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
exports.ElomOrchestratorService = void 0;
var common_1 = require("@nestjs/common");
var event_emitter_1 = require("@nestjs/event-emitter");
/**
 * Enterprise Logistics Operating Model (ELOM) Orchestrator.
 * Subscribes to cross-domain events and orchestrates automated business processes.
 */
var ElomOrchestratorService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _handleGlobalEvents_decorators;
    var ElomOrchestratorService = _classThis = /** @class */ (function () {
        function ElomOrchestratorService_1(prisma, eventStore, lifecycle, invoicesService) {
            this.prisma = (__runInitializers(this, _instanceExtraInitializers), prisma);
            this.eventStore = eventStore;
            this.lifecycle = lifecycle;
            this.invoicesService = invoicesService;
            this.logger = new common_1.Logger(ElomOrchestratorService.name);
        }
        /**
         * Listen for Trip Completion -> Automatically generate Invoice
         */
        ElomOrchestratorService_1.prototype.handleGlobalEvents = function (payload) {
            return __awaiter(this, void 0, void 0, function () {
                var _a, err_1, errorMessage;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            if (!payload || !payload.eventType)
                                return [2 /*return*/];
                            _b.label = 1;
                        case 1:
                            _b.trys.push([1, 13, , 14]);
                            _a = payload.eventType;
                            switch (_a) {
                                case 'LifecycleStateChangedToCOMPLETED': return [3 /*break*/, 2];
                                case 'InvoiceGenerated': return [3 /*break*/, 5];
                                case 'PaymentReceived': return [3 /*break*/, 7];
                                case 'SettlementCompleted': return [3 /*break*/, 9];
                                case 'VehicleYardEntry': return [3 /*break*/, 10];
                            }
                            return [3 /*break*/, 12];
                        case 2:
                            if (!(payload.streamType === 'TRIP')) return [3 /*break*/, 4];
                            return [4 /*yield*/, this.handleTripCompleted(payload.tenantId, payload.streamId, payload.userId)];
                        case 3:
                            _b.sent();
                            _b.label = 4;
                        case 4: return [3 /*break*/, 12];
                        case 5: 
                        // Auto-approve or schedule for payment depending on rules
                        return [4 /*yield*/, this.handleInvoiceGenerated(payload.tenantId, payload.streamId, payload.userId)];
                        case 6:
                            // Auto-approve or schedule for payment depending on rules
                            _b.sent();
                            return [3 /*break*/, 12];
                        case 7: return [4 /*yield*/, this.handlePaymentReceived(payload.tenantId, payload.streamId, payload.userId)];
                        case 8:
                            _b.sent();
                            return [3 /*break*/, 12];
                        case 9:
                            this.logger.log("ELOM: Settlement ".concat(payload.streamId, " completed. Pushing to external Accounting ledger."));
                            // Stub: Call accounting integration (ERP)
                            return [3 /*break*/, 12];
                        case 10: 
                        // Trigger Dock Scheduling or Maintenance check
                        return [4 /*yield*/, this.handleYardEntry(payload.tenantId, payload.streamId, payload.payload, payload.userId)];
                        case 11:
                            // Trigger Dock Scheduling or Maintenance check
                            _b.sent();
                            return [3 /*break*/, 12];
                        case 12: return [3 /*break*/, 14];
                        case 13:
                            err_1 = _b.sent();
                            errorMessage = err_1 instanceof Error ? err_1.message : String(err_1);
                            this.logger.error("ELOM Orchestration failed for event ".concat(payload.eventType, " on ").concat(payload.streamType, " ").concat(payload.streamId, ": ").concat(errorMessage));
                            return [3 /*break*/, 14];
                        case 14: return [2 /*return*/];
                    }
                });
            });
        };
        ElomOrchestratorService_1.prototype.handleTripCompleted = function (companyId, tripId, userId) {
            return __awaiter(this, void 0, void 0, function () {
                var trip, _i, _a, load, invoice, err_2, errorMessage;
                var _this = this;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            this.logger.log("ELOM Orchestrating Post-Trip workflows for Trip ".concat(tripId));
                            return [4 /*yield*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.trip.findUnique({
                                                where: { id: tripId },
                                                include: { loads: true },
                                            })];
                                    });
                                }); })];
                        case 1:
                            trip = _b.sent();
                            if (!trip || !trip.loads.length)
                                return [2 /*return*/];
                            _i = 0, _a = trip.loads;
                            _b.label = 2;
                        case 2:
                            if (!(_i < _a.length)) return [3 /*break*/, 10];
                            load = _a[_i];
                            return [4 /*yield*/, this.lifecycle.transitionState({
                                    companyId: companyId,
                                    entityType: 'Load',
                                    entityId: load.id,
                                    fromState: load.status,
                                    toState: 'COMPLETED',
                                    userId: userId,
                                    reason: "Auto-completed due to Trip ".concat(trip.tripNumber, " completion"),
                                })];
                        case 3:
                            _b.sent();
                            _b.label = 4;
                        case 4:
                            _b.trys.push([4, 8, , 9]);
                            return [4 /*yield*/, this.invoicesService.createInvoice(companyId, {
                                    customerId: load.customerId,
                                    loadId: load.id,
                                    amount: trip.fuelExpenses ? trip.fuelExpenses * 1.2 : 500, // Dummy pricing engine hook
                                    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Net 30
                                    invoiceNumber: "INV-".concat(Date.now()),
                                })];
                        case 5:
                            invoice = _b.sent();
                            if (!invoice) return [3 /*break*/, 7];
                            return [4 /*yield*/, this.eventStore.append({
                                    tenantId: companyId,
                                    streamId: invoice.id,
                                    streamType: 'INVOICE',
                                    eventType: 'InvoiceGenerated',
                                    payload: { loadId: load.id, amount: invoice.amount },
                                    userId: userId,
                                })];
                        case 6:
                            _b.sent();
                            _b.label = 7;
                        case 7: return [3 /*break*/, 9];
                        case 8:
                            err_2 = _b.sent();
                            errorMessage = err_2 instanceof Error ? err_2.message : String(err_2);
                            this.logger.warn("Failed to auto-generate invoice for load ".concat(load.id, ": ").concat(errorMessage));
                            return [3 /*break*/, 9];
                        case 9:
                            _i++;
                            return [3 /*break*/, 2];
                        case 10: return [2 /*return*/];
                    }
                });
            });
        };
        ElomOrchestratorService_1.prototype.handleInvoiceGenerated = function (companyId, invoiceId, userId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.logger.log("ELOM Auto-processing new Invoice ".concat(invoiceId));
                            // Transition invoice from DRAFT -> PENDING_APPROVAL automatically based on rules
                            return [4 /*yield*/, this.lifecycle.transitionState({
                                    companyId: companyId,
                                    entityType: 'Invoice',
                                    entityId: invoiceId,
                                    fromState: 'DRAFT',
                                    toState: 'PENDING_APPROVAL',
                                    userId: userId,
                                    reason: 'ELOM Auto-routing for financial approval',
                                })];
                        case 1:
                            // Transition invoice from DRAFT -> PENDING_APPROVAL automatically based on rules
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        ElomOrchestratorService_1.prototype.handlePaymentReceived = function (companyId, invoiceId, userId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.logger.log("ELOM: Payment received for invoice ".concat(invoiceId, ", initiating settlement."));
                            // Automatically transition to Settlement if payment is complete
                            return [4 /*yield*/, this.eventStore.append({
                                    tenantId: companyId,
                                    streamId: invoiceId,
                                    streamType: 'SETTLEMENT',
                                    eventType: 'SettlementCompleted',
                                    payload: { invoiceId: invoiceId, status: 'PAID' },
                                    userId: userId,
                                })];
                        case 1:
                            // Automatically transition to Settlement if payment is complete
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        ElomOrchestratorService_1.prototype.handleYardEntry = function (companyId, vehicleId, data, userId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    this.logger.log("ELOM: Vehicle ".concat(vehicleId, " entered Yard. Checking pending maintenance."));
                    return [2 /*return*/];
                });
            });
        };
        return ElomOrchestratorService_1;
    }());
    __setFunctionName(_classThis, "ElomOrchestratorService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _handleGlobalEvents_decorators = [(0, event_emitter_1.OnEvent)('EventStore.*')];
        __esDecorate(_classThis, null, _handleGlobalEvents_decorators, { kind: "method", name: "handleGlobalEvents", static: false, private: false, access: { has: function (obj) { return "handleGlobalEvents" in obj; }, get: function (obj) { return obj.handleGlobalEvents; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ElomOrchestratorService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ElomOrchestratorService = _classThis;
}();
exports.ElomOrchestratorService = ElomOrchestratorService;
