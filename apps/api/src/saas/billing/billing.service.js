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
exports.BillingService = void 0;
var common_1 = require("@nestjs/common");
var client_1 = require("@prisma/client");
var BillingService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var BillingService = _classThis = /** @class */ (function () {
        function BillingService_1(prisma, razorpay) {
            this.prisma = prisma;
            this.razorpay = razorpay;
            this.logger = new common_1.Logger(BillingService.name);
        }
        BillingService_1.prototype.getSubscriptionPlans = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) {
                            return tx.subscriptionPlan.findMany({
                                orderBy: { price: 'asc' },
                            });
                        })];
                });
            });
        };
        BillingService_1.prototype.getCompanyBillingInfo = function (companyId) {
            return __awaiter(this, void 0, void 0, function () {
                var company;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) {
                                return tx.company.findUnique({
                                    where: { id: companyId },
                                    include: { subscriptionPlan: true },
                                });
                            })];
                        case 1:
                            company = _a.sent();
                            return [2 /*return*/, {
                                    subscriptionPlan: company === null || company === void 0 ? void 0 : company.subscriptionPlan,
                                    stripeCustomerId: company === null || company === void 0 ? void 0 : company.stripeCustomerId,
                                }];
                    }
                });
            });
        };
        BillingService_1.prototype.upgradePlan = function (companyId, planId, successUrl, cancelUrl) {
            return __awaiter(this, void 0, void 0, function () {
                var company, plan, customerId;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) {
                                return tx.company.findUnique({ where: { id: companyId } });
                            })];
                        case 1:
                            company = _a.sent();
                            if (!company)
                                throw new common_1.NotFoundException('Company not found');
                            return [4 /*yield*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) {
                                    return tx.subscriptionPlan.findUnique({ where: { id: planId } });
                                })];
                        case 2:
                            plan = _a.sent();
                            if (!plan || !plan.stripePriceId) {
                                throw new common_1.NotFoundException('Subscription Plan or Stripe Price ID missing');
                            }
                            customerId = company.stripeCustomerId;
                            if (!!customerId) return [3 /*break*/, 4];
                            customerId = 'mock_stripe_cus_' + companyId;
                            return [4 /*yield*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) {
                                    return tx.company.update({
                                        where: { id: companyId },
                                        data: { stripeCustomerId: customerId },
                                    });
                                })];
                        case 3:
                            _a.sent();
                            _a.label = 4;
                        case 4: 
                        // Create a razorpay subscription via the new adapter
                        return [2 /*return*/, this.razorpay.createSubscription(plan.stripePriceId, customerId, 12)];
                    }
                });
            });
        };
        BillingService_1.prototype.handleWebhook = function (event) {
            return __awaiter(this, void 0, void 0, function () {
                var error_1;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.logger.log("Handling stripe webhook: ".concat(event.type));
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    var session, companyId, subscriptionId;
                                    var _a;
                                    return __generator(this, function (_b) {
                                        switch (_b.label) {
                                            case 0: 
                                            // Idempotency Check: Insert WebhookDelivery using event.id as primary key
                                            // If the event was already processed, Prisma will throw a P2002 Unique Constraint violation
                                            return [4 /*yield*/, tx.webhookDelivery.create({
                                                    data: {
                                                        id: event.id, // Enforce exact-once processing via DB primary key constraint
                                                        companyId: 'SYSTEM', // Billing webhooks are cross-tenant
                                                        direction: 'INCOMING',
                                                        endpointUrl: '/api/v1/webhooks/stripe',
                                                        eventTopic: event.type,
                                                        payload: event,
                                                        status: 'SUCCESS',
                                                    },
                                                })];
                                            case 1:
                                                // Idempotency Check: Insert WebhookDelivery using event.id as primary key
                                                // If the event was already processed, Prisma will throw a P2002 Unique Constraint violation
                                                _b.sent();
                                                if (!(event.type === 'checkout.session.completed')) return [3 /*break*/, 3];
                                                session = event.data.object;
                                                companyId = (_a = session.metadata) === null || _a === void 0 ? void 0 : _a.companyId;
                                                subscriptionId = session.subscription;
                                                if (!(companyId && subscriptionId)) return [3 /*break*/, 3];
                                                // Use updateMany to prevent P2025 errors and transaction rollback if companyId is invalid
                                                return [4 /*yield*/, tx.company.updateMany({
                                                        where: { id: companyId },
                                                        data: { stripeSubscriptionId: subscriptionId },
                                                    })];
                                            case 2:
                                                // Use updateMany to prevent P2025 errors and transaction rollback if companyId is invalid
                                                _b.sent();
                                                _b.label = 3;
                                            case 3: return [2 /*return*/];
                                        }
                                    });
                                }); })];
                        case 2:
                            _a.sent();
                            return [3 /*break*/, 4];
                        case 3:
                            error_1 = _a.sent();
                            if (error_1 instanceof client_1.Prisma.PrismaClientKnownRequestError &&
                                error_1.code === 'P2002') {
                                this.logger.warn("Idempotency Check Failed: Webhook event ".concat(event.id, " already processed. Ignoring."));
                                return [2 /*return*/]; // Gracefully acknowledge receipt without duplicate processing
                            }
                            this.logger.error("Webhook processing failed for event ".concat(event.id, ":"), error_1);
                            throw error_1;
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        BillingService_1.prototype.handleRazorpayWebhook = function (event) {
            return __awaiter(this, void 0, void 0, function () {
                var uniqueId, error_2;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.logger.log("Handling razorpay webhook: ".concat(event.event));
                            uniqueId = event.id ||
                                require('crypto')
                                    .createHash('md5')
                                    .update(JSON.stringify(event))
                                    .digest('hex');
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    var subscription, companyId, subscriptionId;
                                    var _a;
                                    return __generator(this, function (_b) {
                                        switch (_b.label) {
                                            case 0: 
                                            // Idempotency Check: Insert WebhookDelivery using uniqueId as primary key
                                            return [4 /*yield*/, tx.webhookDelivery.create({
                                                    data: {
                                                        id: uniqueId,
                                                        companyId: 'SYSTEM',
                                                        direction: 'INCOMING',
                                                        endpointUrl: '/api/v1/webhooks/razorpay',
                                                        eventTopic: event.event,
                                                        payload: event,
                                                        status: 'SUCCESS',
                                                    },
                                                })];
                                            case 1:
                                                // Idempotency Check: Insert WebhookDelivery using uniqueId as primary key
                                                _b.sent();
                                                if (!(event.event === 'subscription.authenticated' ||
                                                    event.event === 'subscription.charged')) return [3 /*break*/, 3];
                                                subscription = event.payload.subscription.entity;
                                                companyId = (_a = subscription.notes) === null || _a === void 0 ? void 0 : _a.companyId;
                                                subscriptionId = subscription.id;
                                                if (!(companyId && subscriptionId)) return [3 /*break*/, 3];
                                                // Use updateMany to prevent P2025 errors and transaction rollback if companyId is invalid
                                                return [4 /*yield*/, tx.company.updateMany({
                                                        where: { id: companyId },
                                                        data: { stripeSubscriptionId: subscriptionId },
                                                    })];
                                            case 2:
                                                // Use updateMany to prevent P2025 errors and transaction rollback if companyId is invalid
                                                _b.sent();
                                                _b.label = 3;
                                            case 3: return [2 /*return*/];
                                        }
                                    });
                                }); })];
                        case 2:
                            _a.sent();
                            return [3 /*break*/, 4];
                        case 3:
                            error_2 = _a.sent();
                            if (error_2 instanceof client_1.Prisma.PrismaClientKnownRequestError &&
                                error_2.code === 'P2002') {
                                this.logger.warn("Idempotency Check Failed: Webhook event ".concat(uniqueId, " already processed. Ignoring."));
                                return [2 /*return*/];
                            }
                            this.logger.error("Webhook processing failed for event ".concat(uniqueId, ":"), error_2);
                            throw error_2;
                        case 4: return [2 /*return*/];
                    }
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
