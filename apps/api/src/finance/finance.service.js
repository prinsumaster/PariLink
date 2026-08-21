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
exports.FinanceService = void 0;
var common_1 = require("@nestjs/common");
var FinanceService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var FinanceService = _classThis = /** @class */ (function () {
        function FinanceService_1(prisma, auditService, eventStore) {
            this.prisma = prisma;
            this.auditService = auditService;
            this.eventStore = eventStore;
        }
        FinanceService_1.prototype.getInvoices = function (companyId_1) {
            return __awaiter(this, arguments, void 0, function (companyId, query) {
                var page, limit, skip, where, _a, invoices, total;
                var _this = this;
                if (query === void 0) { query = {}; }
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            page = Number(query.page) || 1;
                            limit = Number(query.limit) || 20;
                            skip = (page - 1) * limit;
                            where = { companyId: companyId };
                            if (query.status) {
                                where.status = query.status;
                            }
                            return [4 /*yield*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, Promise.all([
                                                tx.invoice.findMany({
                                                    where: where,
                                                    skip: skip,
                                                    take: limit,
                                                    orderBy: { createdAt: 'desc' },
                                                }),
                                                tx.invoice.count({ where: where }),
                                            ])];
                                    });
                                }); })];
                        case 1:
                            _a = _b.sent(), invoices = _a[0], total = _a[1];
                            return [2 /*return*/, { data: invoices, total: total, page: page, limit: limit }];
                    }
                });
            });
        };
        FinanceService_1.prototype.getExpenses = function (companyId_1) {
            return __awaiter(this, arguments, void 0, function (companyId, query) {
                var page, limit, skip, where, _a, expenses, total;
                var _this = this;
                if (query === void 0) { query = {}; }
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            page = Number(query.page) || 1;
                            limit = Number(query.limit) || 20;
                            skip = (page - 1) * limit;
                            where = { companyId: companyId };
                            if (query.type) {
                                where.type = query.type;
                            }
                            return [4 /*yield*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, Promise.all([
                                                tx.expense.findMany({
                                                    where: where,
                                                    skip: skip,
                                                    take: limit,
                                                    orderBy: { date: 'desc' },
                                                }),
                                                tx.expense.count({ where: where }),
                                            ])];
                                    });
                                }); })];
                        case 1:
                            _a = _b.sent(), expenses = _a[0], total = _a[1];
                            return [2 /*return*/, { data: expenses, total: total, page: page, limit: limit }];
                    }
                });
            });
        };
        FinanceService_1.prototype.createExpense = function (companyId, dto, userId) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                            var driver, trip, expense;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        if (!dto.driverId) return [3 /*break*/, 2];
                                        return [4 /*yield*/, tx.driver.findFirst({
                                                where: { id: dto.driverId },
                                            })];
                                    case 1:
                                        driver = _a.sent();
                                        if (!driver)
                                            throw new common_1.NotFoundException('Driver not found');
                                        _a.label = 2;
                                    case 2:
                                        if (!dto.tripId) return [3 /*break*/, 4];
                                        return [4 /*yield*/, tx.trip.findFirst({ where: { id: dto.tripId } })];
                                    case 3:
                                        trip = _a.sent();
                                        if (!trip)
                                            throw new common_1.NotFoundException('Trip not found');
                                        _a.label = 4;
                                    case 4: return [4 /*yield*/, tx.expense.create({
                                            data: {
                                                companyId: companyId,
                                                type: dto.type,
                                                amount: dto.amount,
                                                date: new Date(dto.date),
                                                notes: dto.notes,
                                                tripId: dto.tripId,
                                                driverId: dto.driverId,
                                            },
                                        })];
                                    case 5:
                                        expense = _a.sent();
                                        return [4 /*yield*/, this.auditService.logEvent({
                                                companyId: companyId,
                                                entity: 'Finance',
                                                entityType: 'Expense',
                                                entityId: expense.id,
                                                action: 'CREATE',
                                                details: { type: dto.type, amount: dto.amount },
                                                source: 'API',
                                            }, null, tx)];
                                    case 6:
                                        _a.sent();
                                        return [4 /*yield*/, this.eventStore.append({
                                                tenantId: companyId,
                                                streamType: 'FINANCE_EXPENSE',
                                                streamId: expense.id,
                                                eventType: 'ExpenseCreated',
                                                payload: { type: dto.type, amount: dto.amount },
                                                userId: userId,
                                            })];
                                    case 7:
                                        _a.sent();
                                        return [2 /*return*/, expense];
                                }
                            });
                        }); })];
                });
            });
        };
        FinanceService_1.prototype.createSettlement = function (companyId, dto, userId) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                            var driver, netPayable, settlement;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, tx.driver.findFirst({ where: { id: dto.driverId } })];
                                    case 1:
                                        driver = _a.sent();
                                        if (!driver)
                                            throw new common_1.NotFoundException('Driver not found');
                                        netPayable = dto.amount - (dto.advances || 0) - (dto.deductions || 0);
                                        return [4 /*yield*/, tx.settlement.create({
                                                data: {
                                                    companyId: companyId,
                                                    driverId: dto.driverId,
                                                    type: dto.type,
                                                    amount: dto.amount,
                                                    periodStart: new Date(dto.periodStart),
                                                    periodEnd: new Date(dto.periodEnd),
                                                    advances: dto.advances || 0,
                                                    deductions: dto.deductions || 0,
                                                    netPayable: netPayable,
                                                    status: 'DRAFT',
                                                },
                                            })];
                                    case 2:
                                        settlement = _a.sent();
                                        return [4 /*yield*/, this.auditService.logEvent({
                                                companyId: companyId,
                                                entity: 'Finance',
                                                entityType: 'Settlement',
                                                entityId: settlement.id,
                                                action: 'CREATE',
                                                details: { driverId: dto.driverId, netPayable: netPayable },
                                                source: 'API',
                                            }, null, tx)];
                                    case 3:
                                        _a.sent();
                                        return [4 /*yield*/, this.eventStore.append({
                                                tenantId: companyId,
                                                streamType: 'FINANCE_SETTLEMENT',
                                                streamId: settlement.id,
                                                eventType: 'SettlementCreated',
                                                payload: { driverId: dto.driverId, netPayable: netPayable },
                                                userId: userId,
                                            })];
                                    case 4:
                                        _a.sent();
                                        return [2 /*return*/, settlement];
                                }
                            });
                        }); })];
                });
            });
        };
        FinanceService_1.prototype.createVendorBill = function (companyId, dto, userId) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                            var vendor, bill;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, tx.vendor.findFirst({ where: { id: dto.vendorId } })];
                                    case 1:
                                        vendor = _a.sent();
                                        if (!vendor)
                                            throw new common_1.NotFoundException('Vendor not found');
                                        return [4 /*yield*/, tx.vendorBill.create({
                                                data: {
                                                    companyId: companyId,
                                                    vendorId: dto.vendorId,
                                                    billNumber: dto.billNumber,
                                                    amount: dto.amount,
                                                    dueDate: dto.dueDate ? new Date(dto.dueDate) : null,
                                                    status: 'DRAFT',
                                                },
                                            })];
                                    case 2:
                                        bill = _a.sent();
                                        return [4 /*yield*/, this.auditService.logEvent({
                                                companyId: companyId,
                                                entity: 'Finance',
                                                entityType: 'VendorBill',
                                                entityId: bill.id,
                                                action: 'CREATE',
                                                details: { vendorId: dto.vendorId, amount: dto.amount },
                                                source: 'API',
                                            }, null, tx)];
                                    case 3:
                                        _a.sent();
                                        return [4 /*yield*/, this.eventStore.append({
                                                tenantId: companyId,
                                                streamType: 'FINANCE_VENDOR_BILL',
                                                streamId: bill.id,
                                                eventType: 'VendorBillCreated',
                                                payload: { vendorId: dto.vendorId, amount: dto.amount },
                                                userId: userId,
                                            })];
                                    case 4:
                                        _a.sent();
                                        return [2 /*return*/, bill];
                                }
                            });
                        }); })];
                });
            });
        };
        FinanceService_1.prototype.recordPayment = function (companyId, dto, userId) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                            var invoice, existingPayments, paidAmount, payment, bankAccount, arAccount;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, tx.invoice.findFirst({
                                            where: { id: dto.invoiceId },
                                        })];
                                    case 1:
                                        invoice = _a.sent();
                                        if (!invoice)
                                            throw new common_1.NotFoundException('Invoice not found');
                                        if (invoice.status === 'DRAFT' || invoice.status === 'VOIDED') {
                                            throw new common_1.BadRequestException('Cannot pay a DRAFT or VOIDED invoice');
                                        }
                                        return [4 /*yield*/, tx.payment.findMany({
                                                where: { invoiceId: dto.invoiceId },
                                            })];
                                    case 2:
                                        existingPayments = _a.sent();
                                        paidAmount = existingPayments.reduce(function (sum, p) { return sum + p.amount; }, 0) + dto.amount;
                                        return [4 /*yield*/, tx.payment.create({
                                                data: {
                                                    companyId: companyId,
                                                    invoiceId: dto.invoiceId,
                                                    amount: dto.amount,
                                                    method: dto.method,
                                                    referenceNumber: dto.referenceNumber,
                                                    paymentDate: new Date(dto.paymentDate),
                                                    notes: dto.notes,
                                                },
                                            })];
                                    case 3:
                                        payment = _a.sent();
                                        if (!(paidAmount >= invoice.amount)) return [3 /*break*/, 5];
                                        return [4 /*yield*/, tx.invoice.update({
                                                where: { id: dto.invoiceId },
                                                data: { status: 'PAID' },
                                            })];
                                    case 4:
                                        _a.sent();
                                        _a.label = 5;
                                    case 5: return [4 /*yield*/, tx.account.upsert({
                                            where: { companyId_code: { companyId: companyId, code: '1000' } },
                                            update: {},
                                            create: {
                                                companyId: companyId,
                                                name: 'Bank Account',
                                                code: '1000',
                                                type: 'ASSET',
                                            },
                                        })];
                                    case 6:
                                        bankAccount = _a.sent();
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
                                    case 7:
                                        arAccount = _a.sent();
                                        return [4 /*yield*/, tx.journalEntry.create({
                                                data: {
                                                    companyId: companyId,
                                                    referenceType: 'PAYMENT',
                                                    referenceId: payment.id,
                                                    description: "Payment Receipt for Invoice ".concat(invoice.invoiceNumber),
                                                    status: 'POSTED',
                                                    lines: {
                                                        create: [
                                                            {
                                                                companyId: companyId,
                                                                accountId: bankAccount.id,
                                                                debit: payment.amount,
                                                                credit: 0,
                                                                description: 'Bank/Cash',
                                                            },
                                                            {
                                                                companyId: companyId,
                                                                accountId: arAccount.id,
                                                                debit: 0,
                                                                credit: payment.amount,
                                                                description: 'AR reduction',
                                                            },
                                                        ],
                                                    },
                                                },
                                            })];
                                    case 8:
                                        _a.sent();
                                        return [4 /*yield*/, this.auditService.logEvent({
                                                companyId: companyId,
                                                entity: 'Finance',
                                                entityType: 'Payment',
                                                entityId: payment.id,
                                                action: 'CREATE',
                                                details: { invoiceId: dto.invoiceId, amount: dto.amount },
                                                source: 'API',
                                            }, null, tx)];
                                    case 9:
                                        _a.sent();
                                        return [4 /*yield*/, this.eventStore.append({
                                                tenantId: companyId,
                                                streamType: 'FINANCE_PAYMENT',
                                                streamId: payment.id,
                                                eventType: 'PaymentRecorded',
                                                payload: { invoiceId: dto.invoiceId, amount: dto.amount },
                                                userId: userId,
                                            })];
                                    case 10:
                                        _a.sent();
                                        return [2 /*return*/, payment];
                                }
                            });
                        }); })];
                });
            });
        };
        return FinanceService_1;
    }());
    __setFunctionName(_classThis, "FinanceService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        FinanceService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return FinanceService = _classThis;
}();
exports.FinanceService = FinanceService;
