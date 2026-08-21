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
Object.defineProperty(exports, "__esModule", { value: true });
exports.BillingService = void 0;
var common_1 = require("@nestjs/common");
var crypto = __importStar(require("crypto"));
var BillingService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var BillingService = _classThis = /** @class */ (function () {
        function BillingService_1(prisma, workflow, eventEmitter, auditService, eventStore) {
            this.prisma = prisma;
            this.workflow = workflow;
            this.eventEmitter = eventEmitter;
            this.auditService = auditService;
            this.eventStore = eventStore;
        }
        BillingService_1.prototype.createRateCard = function (companyId, dto, userId) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                            var rateCard;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, tx.rateCard.create({
                                            data: __assign({ companyId: companyId }, dto),
                                        })];
                                    case 1:
                                        rateCard = _a.sent();
                                        return [4 /*yield*/, this.auditService.logEvent({
                                                companyId: companyId,
                                                entity: 'Billing',
                                                entityType: 'RateCard',
                                                entityId: rateCard.id,
                                                action: 'CREATE',
                                                details: { customerId: dto.customerId, type: dto.type },
                                                source: 'API',
                                            }, null, tx)];
                                    case 2:
                                        _a.sent();
                                        return [4 /*yield*/, this.eventStore.append({
                                                tenantId: companyId,
                                                streamType: 'RATE_CARD',
                                                streamId: rateCard.id,
                                                eventType: 'RateCardCreated',
                                                payload: { customerId: dto.customerId, type: dto.type },
                                                userId: userId,
                                            })];
                                    case 3:
                                        _a.sent();
                                        return [2 /*return*/, rateCard];
                                }
                            });
                        }); })];
                });
            });
        };
        BillingService_1.prototype.getRateCards = function (companyId, customerId) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                            var where;
                            return __generator(this, function (_a) {
                                where = { active: true };
                                if (customerId)
                                    where.customerId = customerId;
                                return [2 /*return*/, tx.rateCard.findMany({ where: where, include: { customer: true } })];
                            });
                        }); })];
                });
            });
        };
        BillingService_1.prototype.generateInvoice = function (companyId, dto, userId) {
            return __awaiter(this, void 0, void 0, function () {
                var invoice;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                var load, existingInvoice, amount, rateCard, invoiceNumber, generatedInvoice, ruleResult;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, tx.load.findFirst({
                                                where: { id: dto.loadId },
                                                include: { customer: true },
                                            })];
                                        case 1:
                                            load = _a.sent();
                                            if (!load)
                                                throw new common_1.NotFoundException('Load not found');
                                            if (load.status !== 'DELIVERED')
                                                throw new common_1.BadRequestException('Load must be DELIVERED before invoicing');
                                            return [4 /*yield*/, tx.invoice.findFirst({
                                                    where: { loadId: load.id, status: { not: 'VOIDED' } },
                                                })];
                                        case 2:
                                            existingInvoice = _a.sent();
                                            if (existingInvoice) {
                                                throw new common_1.BadRequestException('An active invoice already exists for this load');
                                            }
                                            amount = dto.manualAmount || load.rate;
                                            rateCard = null;
                                            if (!dto.rateCardId) return [3 /*break*/, 4];
                                            return [4 /*yield*/, tx.rateCard.findFirst({
                                                    where: { id: dto.rateCardId },
                                                })];
                                        case 3:
                                            rateCard = _a.sent();
                                            if (rateCard) {
                                                if (rateCard.type === 'FLAT' || rateCard.type === 'ROUTE')
                                                    amount = rateCard.rate;
                                                if (rateCard.type === 'DISTANCE')
                                                    amount = rateCard.rate * (load.weight || 1);
                                                amount +=
                                                    (rateCard.fuelSurcharge || 0) + (rateCard.tollSurcharge || 0);
                                            }
                                            _a.label = 4;
                                        case 4:
                                            invoiceNumber = "INV-".concat(crypto.randomBytes(4).toString('hex').toUpperCase());
                                            return [4 /*yield*/, tx.invoice.create({
                                                    data: {
                                                        companyId: companyId,
                                                        customerId: load.customerId,
                                                        loadId: load.id,
                                                        invoiceNumber: invoiceNumber,
                                                        amount: amount,
                                                        status: 'DRAFT',
                                                        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Net 30 default
                                                        lineItems: {
                                                            create: [
                                                                {
                                                                    description: "Freight for Load ".concat(load.referenceNumber),
                                                                    quantity: 1,
                                                                    unitPrice: amount,
                                                                    amount: amount,
                                                                    type: 'LINE_HAUL',
                                                                },
                                                            ],
                                                        },
                                                    },
                                                    include: { lineItems: true },
                                                })];
                                        case 5:
                                            generatedInvoice = _a.sent();
                                            return [4 /*yield*/, this.workflow.evaluateRules(companyId, {
                                                    entityType: 'INVOICE',
                                                    trigger: 'INVOICE_GENERATED',
                                                    entityData: generatedInvoice,
                                                })];
                                        case 6:
                                            ruleResult = _a.sent();
                                            if (ruleResult.triggeredActions.some(function (a) { return a.actionType === 'REJECT'; })) {
                                                throw new common_1.BadRequestException('Invoice generation rejected by business rules.');
                                            }
                                            return [4 /*yield*/, this.auditService.logEvent({
                                                    companyId: companyId,
                                                    entity: 'Billing',
                                                    entityType: 'Invoice',
                                                    entityId: generatedInvoice.id,
                                                    action: 'INVOICE_GENERATED',
                                                    details: { amount: generatedInvoice.amount },
                                                    source: 'BILLING_SERVICE',
                                                }, null, tx)];
                                        case 7:
                                            _a.sent();
                                            return [4 /*yield*/, this.eventStore.append({
                                                    tenantId: companyId,
                                                    streamType: 'INVOICE',
                                                    streamId: generatedInvoice.id,
                                                    eventType: 'InvoiceGenerated',
                                                    payload: { amount: generatedInvoice.amount, loadId: load.id },
                                                    userId: userId,
                                                })];
                                        case 8:
                                            _a.sent();
                                            return [2 /*return*/, generatedInvoice];
                                    }
                                });
                            }); })];
                        case 1:
                            invoice = _a.sent();
                            this.eventEmitter.emit('invoice.created', invoice);
                            return [2 /*return*/, invoice];
                    }
                });
            });
        };
        BillingService_1.prototype.approveInvoice = function (companyId, invoiceId, userId) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                            var invoice, ruleResult, approvedInvoice, arAccount, revAccount;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, tx.invoice.findFirst({
                                            where: { id: invoiceId, companyId: companyId },
                                            include: { customer: true },
                                        })];
                                    case 1:
                                        invoice = _a.sent();
                                        if (!invoice)
                                            throw new common_1.NotFoundException('Invoice not found');
                                        if (invoice.status !== 'DRAFT')
                                            throw new common_1.BadRequestException('Only DRAFT invoices can be approved');
                                        return [4 /*yield*/, this.workflow.evaluateRules(companyId, {
                                                entityType: 'INVOICE',
                                                trigger: 'INVOICE_APPROVAL',
                                                entityData: invoice,
                                            })];
                                    case 2:
                                        ruleResult = _a.sent();
                                        if (ruleResult.triggeredActions.some(function (a) { return a.actionType === 'REJECT'; })) {
                                            throw new common_1.BadRequestException('Invoice approval rejected by business rules.');
                                        }
                                        return [4 /*yield*/, tx.invoice.updateMany({
                                                where: { id: invoiceId, companyId: companyId, status: 'DRAFT' },
                                                data: { status: 'SENT' },
                                            })];
                                    case 3:
                                        approvedInvoice = _a.sent();
                                        if (approvedInvoice.count === 0) {
                                            throw new common_1.BadRequestException('Invoice is not in DRAFT status or already approved');
                                        }
                                        return [4 /*yield*/, tx.account.upsert({
                                                where: { companyId_code: { companyId: companyId, code: '1200' } },
                                                update: {},
                                                create: {
                                                    companyId: companyId,
                                                    name: 'Accounts Receivable',
                                                    code: '1200',
                                                    type: 'ASSET',
                                                },
                                            })];
                                    case 4:
                                        arAccount = _a.sent();
                                        return [4 /*yield*/, tx.account.upsert({
                                                where: { companyId_code: { companyId: companyId, code: '4000' } },
                                                update: {},
                                                create: {
                                                    companyId: companyId,
                                                    name: 'Freight Revenue',
                                                    code: '4000',
                                                    type: 'REVENUE',
                                                },
                                            })];
                                    case 5:
                                        revAccount = _a.sent();
                                        return [4 /*yield*/, tx.journalEntry.create({
                                                data: {
                                                    companyId: companyId,
                                                    referenceType: 'INVOICE',
                                                    referenceId: invoice.id,
                                                    description: "Invoice ".concat(invoice.invoiceNumber, " for ").concat(invoice.customer.name),
                                                    status: 'POSTED',
                                                    lines: {
                                                        create: [
                                                            {
                                                                companyId: companyId,
                                                                accountId: arAccount.id,
                                                                debit: invoice.amount,
                                                                credit: 0,
                                                                description: 'AR',
                                                            },
                                                            {
                                                                companyId: companyId,
                                                                accountId: revAccount.id,
                                                                debit: 0,
                                                                credit: invoice.amount,
                                                                description: 'Revenue',
                                                            },
                                                        ],
                                                    },
                                                },
                                            })];
                                    case 6:
                                        _a.sent();
                                        return [4 /*yield*/, this.auditService.logEvent({
                                                companyId: companyId,
                                                entity: 'Billing',
                                                entityType: 'Invoice',
                                                entityId: invoice.id,
                                                action: 'APPROVE',
                                                details: { invoiceNumber: invoice.invoiceNumber },
                                                source: 'API',
                                            }, null, tx)];
                                    case 7:
                                        _a.sent();
                                        return [4 /*yield*/, this.eventStore.append({
                                                tenantId: companyId,
                                                streamType: 'INVOICE',
                                                streamId: invoice.id,
                                                eventType: 'InvoiceApproved',
                                                payload: { invoiceNumber: invoice.invoiceNumber },
                                                userId: userId,
                                            })];
                                    case 8:
                                        _a.sent();
                                        return [2 /*return*/, __assign(__assign({}, invoice), { status: 'SENT' })];
                                }
                            });
                        }); })];
                });
            });
        };
        return BillingService_1;
    }());
    __setFunctionName(_classThis, "BillingService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        BillingService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return BillingService = _classThis;
}();
exports.BillingService = BillingService;
