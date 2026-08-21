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
exports.PaymentsService = void 0;
var common_1 = require("@nestjs/common");
var pagination_util_1 = require("../platform/api/utils/pagination.util");
var PaymentsService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var PaymentsService = _classThis = /** @class */ (function () {
        function PaymentsService_1(prisma) {
            this.prisma = prisma;
        }
        PaymentsService_1.prototype.getPayments = function (companyId_1) {
            return __awaiter(this, arguments, void 0, function (companyId, page, limit) {
                var _this = this;
                if (page === void 0) { page = 1; }
                if (limit === void 0) { limit = 10; }
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                            var _a, skip, take, _b, data, total;
                            return __generator(this, function (_c) {
                                switch (_c.label) {
                                    case 0:
                                        _a = (0, pagination_util_1.getPaginationParams)(page, limit), skip = _a.skip, take = _a.take;
                                        return [4 /*yield*/, Promise.all([
                                                tx.payment.findMany({
                                                    where: { companyId: companyId },
                                                    skip: skip,
                                                    take: take,
                                                    orderBy: { paymentDate: 'desc' },
                                                    include: {
                                                        invoice: { select: { invoiceNumber: true } },
                                                    },
                                                }),
                                                tx.payment.count({ where: { companyId: companyId } }),
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
        PaymentsService_1.prototype.getPaymentsByInvoice = function (companyId, invoiceId) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                return [2 /*return*/, tx.payment.findMany({
                                        where: { invoiceId: invoiceId, companyId: companyId },
                                        orderBy: { paymentDate: 'desc' },
                                    })];
                            });
                        }); })];
                });
            });
        };
        PaymentsService_1.prototype.recordPayment = function (companyId, payload) {
            return __awaiter(this, void 0, void 0, function () {
                var invoiceId, amount, method, referenceNumber, paymentDate, notes;
                var _this = this;
                return __generator(this, function (_a) {
                    invoiceId = payload.invoiceId, amount = payload.amount, method = payload.method, referenceNumber = payload.referenceNumber, paymentDate = payload.paymentDate, notes = payload.notes;
                    if (typeof amount !== 'number' ||
                        isNaN(amount) ||
                        !isFinite(amount) ||
                        amount <= 0) {
                        throw new common_1.BadRequestException('Payment amount must be a valid positive number');
                    }
                    return [2 /*return*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                            var invoice, duplicate, totalPaid, balance, newStatus, payment;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, tx.invoice.findFirst({
                                            where: { id: invoiceId, companyId: companyId },
                                            include: { payments: true },
                                        })];
                                    case 1:
                                        invoice = _a.sent();
                                        if (!invoice)
                                            throw new common_1.NotFoundException('Invoice not found');
                                        if (!referenceNumber) return [3 /*break*/, 3];
                                        return [4 /*yield*/, tx.payment.findFirst({
                                                where: { companyId: companyId, referenceNumber: referenceNumber },
                                            })];
                                    case 2:
                                        duplicate = _a.sent();
                                        if (duplicate)
                                            throw new common_1.BadRequestException("Duplicate payment reference: ".concat(referenceNumber));
                                        _a.label = 3;
                                    case 3:
                                        totalPaid = invoice.payments.reduce(function (sum, p) { return sum + p.amount; }, 0);
                                        balance = invoice.amount - totalPaid;
                                        if (amount > balance && invoice.status !== 'PAID') {
                                            throw new common_1.BadRequestException("Payment of ".concat(amount, " exceeds remaining balance of ").concat(balance));
                                        }
                                        newStatus = totalPaid + amount >= invoice.amount ? 'PAID' : invoice.status;
                                        return [4 /*yield*/, this.prisma.updateWithOcc(tx, 'invoice', invoiceId, invoice.updatedAt, { status: newStatus })];
                                    case 4:
                                        _a.sent();
                                        return [4 /*yield*/, tx.payment.create({
                                                data: {
                                                    companyId: companyId,
                                                    invoiceId: invoiceId,
                                                    amount: amount,
                                                    method: method,
                                                    referenceNumber: referenceNumber,
                                                    paymentDate: new Date(paymentDate),
                                                    notes: notes,
                                                },
                                            })];
                                    case 5:
                                        payment = _a.sent();
                                        return [2 /*return*/, payment];
                                }
                            });
                        }); })];
                });
            });
        };
        return PaymentsService_1;
    }());
    __setFunctionName(_classThis, "PaymentsService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        PaymentsService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return PaymentsService = _classThis;
}();
exports.PaymentsService = PaymentsService;
