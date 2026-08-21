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
exports.CommercialController = void 0;
var common_1 = require("@nestjs/common");
var swagger_1 = require("@nestjs/swagger");
var jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
var permissions_guard_1 = require("../auth/guards/permissions.guard");
var permissions_decorator_1 = require("../auth/decorators/permissions.decorator");
var CommercialController = function () {
    var _classDecorators = [(0, swagger_1.ApiTags)('commercial'), (0, swagger_1.ApiBearerAuth)(), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard), (0, common_1.Controller)('commercial')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _createRateCard_decorators;
    var _createQuote_decorators;
    var _submitQuote_decorators;
    var _convertQuote_decorators;
    var _createContract_decorators;
    var _activateContract_decorators;
    var _createTender_decorators;
    var _submitBid_decorators;
    var _awardTender_decorators;
    var _getTripProfitability_decorators;
    var _getCustomerProfitability_decorators;
    var _getCustomerSLA_decorators;
    var CommercialController = _classThis = /** @class */ (function () {
        function CommercialController_1(pricing, contract, tender, profitability, slaTracker) {
            this.pricing = (__runInitializers(this, _instanceExtraInitializers), pricing);
            this.contract = contract;
            this.tender = tender;
            this.profitability = profitability;
            this.slaTracker = slaTracker;
        }
        // ── Pricing & Quotations ──────────────────────────────────────────────
        CommercialController_1.prototype.createRateCard = function (user, dto) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.pricing.createRateCard(user.companyId, dto)];
                });
            });
        };
        CommercialController_1.prototype.createQuote = function (user, customerId, dto) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.pricing.createQuotation(user.companyId, customerId, dto)];
                });
            });
        };
        CommercialController_1.prototype.submitQuote = function (user, id) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.pricing.submitQuotation(user.companyId, id)];
                });
            });
        };
        CommercialController_1.prototype.convertQuote = function (user, id) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.pricing.convertQuotationToRateCard(user.companyId, id)];
                });
            });
        };
        // ── Contracts ─────────────────────────────────────────────────────────
        CommercialController_1.prototype.createContract = function (user, dto) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.contract.createContract(user.companyId, dto)];
                });
            });
        };
        CommercialController_1.prototype.activateContract = function (user, id) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.contract.activateContract(user.companyId, id)];
                });
            });
        };
        // ── Tenders ───────────────────────────────────────────────────────────
        CommercialController_1.prototype.createTender = function (user, dto) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.tender.createTender(user.companyId, dto)];
                });
            });
        };
        CommercialController_1.prototype.submitBid = function (user, tenderId, dto) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.tender.submitBid(user.companyId, tenderId, dto.vendorId, dto)];
                });
            });
        };
        CommercialController_1.prototype.awardTender = function (user, tenderId, bidId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.tender.awardTender(user.companyId, tenderId, bidId)];
                });
            });
        };
        // ── Analytics & Profitability ─────────────────────────────────────────
        CommercialController_1.prototype.getTripProfitability = function (user, tripId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.profitability.calculateTripProfitability(user.companyId, tripId)];
                });
            });
        };
        CommercialController_1.prototype.getCustomerProfitability = function (user, customerId, from, to) {
            return __awaiter(this, void 0, void 0, function () {
                var fromDate, toDate;
                return __generator(this, function (_a) {
                    fromDate = from ? new Date(from) : new Date(0);
                    toDate = to ? new Date(to) : new Date();
                    return [2 /*return*/, this.profitability.calculateCustomerProfitability(user.companyId, customerId, fromDate, toDate)];
                });
            });
        };
        CommercialController_1.prototype.getCustomerSLA = function (user, customerId, from, to) {
            return __awaiter(this, void 0, void 0, function () {
                var fromDate, toDate;
                return __generator(this, function (_a) {
                    fromDate = from ? new Date(from) : new Date(0);
                    toDate = to ? new Date(to) : new Date();
                    return [2 /*return*/, this.slaTracker.evaluateCustomerSLA(user.companyId, customerId, fromDate, toDate)];
                });
            });
        };
        return CommercialController_1;
    }());
    __setFunctionName(_classThis, "CommercialController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _createRateCard_decorators = [(0, common_1.Post)('rate-cards'), (0, permissions_decorator_1.RequirePermissions)('commercial:write'), (0, swagger_1.ApiOperation)({ summary: 'Create or update a customer Rate Card' })];
        _createQuote_decorators = [(0, common_1.Post)('quotes/:customerId'), (0, permissions_decorator_1.RequirePermissions)('commercial:write'), (0, swagger_1.ApiOperation)({ summary: 'Draft a new quotation' })];
        _submitQuote_decorators = [(0, common_1.Post)('quotes/:id/submit'), (0, permissions_decorator_1.RequirePermissions)('commercial:write'), (0, swagger_1.ApiOperation)({ summary: 'Submit a drafted quotation' })];
        _convertQuote_decorators = [(0, common_1.Post)('quotes/:id/convert'), (0, permissions_decorator_1.RequirePermissions)('commercial:write'), (0, swagger_1.ApiOperation)({ summary: 'Convert an approved quote into a Rate Card' })];
        _createContract_decorators = [(0, common_1.Post)('contracts'), (0, permissions_decorator_1.RequirePermissions)('commercial:write'), (0, swagger_1.ApiOperation)({ summary: 'Draft a new MSA or Carrier Agreement' })];
        _activateContract_decorators = [(0, common_1.Post)('contracts/:id/activate'), (0, permissions_decorator_1.RequirePermissions)('commercial:write'), (0, swagger_1.ApiOperation)({ summary: 'Activate a drafted contract' })];
        _createTender_decorators = [(0, common_1.Post)('tenders'), (0, permissions_decorator_1.RequirePermissions)('commercial:write'), (0, swagger_1.ApiOperation)({ summary: 'Create a new carrier tender' })];
        _submitBid_decorators = [(0, common_1.Post)('tenders/:tenderId/bids'), (0, permissions_decorator_1.RequirePermissions)('commercial:write'), (0, swagger_1.ApiOperation)({ summary: 'Submit a vendor bid to an open tender' })];
        _awardTender_decorators = [(0, common_1.Post)('tenders/:tenderId/award/:bidId'), (0, permissions_decorator_1.RequirePermissions)('commercial:write'), (0, swagger_1.ApiOperation)({ summary: 'Award a tender to a specific bid' })];
        _getTripProfitability_decorators = [(0, common_1.Get)('analytics/trip/:tripId/profitability'), (0, permissions_decorator_1.RequirePermissions)('commercial:read'), (0, swagger_1.ApiOperation)({ summary: 'Calculate profitability for a specific trip' })];
        _getCustomerProfitability_decorators = [(0, common_1.Get)('analytics/customer/:customerId/profitability'), (0, permissions_decorator_1.RequirePermissions)('commercial:read'), (0, swagger_1.ApiOperation)({ summary: 'Calculate aggregate customer profitability' })];
        _getCustomerSLA_decorators = [(0, common_1.Get)('analytics/customer/:customerId/sla'), (0, permissions_decorator_1.RequirePermissions)('commercial:read'), (0, swagger_1.ApiOperation)({ summary: 'Evaluate customer SLA performance' })];
        __esDecorate(_classThis, null, _createRateCard_decorators, { kind: "method", name: "createRateCard", static: false, private: false, access: { has: function (obj) { return "createRateCard" in obj; }, get: function (obj) { return obj.createRateCard; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _createQuote_decorators, { kind: "method", name: "createQuote", static: false, private: false, access: { has: function (obj) { return "createQuote" in obj; }, get: function (obj) { return obj.createQuote; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _submitQuote_decorators, { kind: "method", name: "submitQuote", static: false, private: false, access: { has: function (obj) { return "submitQuote" in obj; }, get: function (obj) { return obj.submitQuote; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _convertQuote_decorators, { kind: "method", name: "convertQuote", static: false, private: false, access: { has: function (obj) { return "convertQuote" in obj; }, get: function (obj) { return obj.convertQuote; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _createContract_decorators, { kind: "method", name: "createContract", static: false, private: false, access: { has: function (obj) { return "createContract" in obj; }, get: function (obj) { return obj.createContract; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _activateContract_decorators, { kind: "method", name: "activateContract", static: false, private: false, access: { has: function (obj) { return "activateContract" in obj; }, get: function (obj) { return obj.activateContract; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _createTender_decorators, { kind: "method", name: "createTender", static: false, private: false, access: { has: function (obj) { return "createTender" in obj; }, get: function (obj) { return obj.createTender; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _submitBid_decorators, { kind: "method", name: "submitBid", static: false, private: false, access: { has: function (obj) { return "submitBid" in obj; }, get: function (obj) { return obj.submitBid; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _awardTender_decorators, { kind: "method", name: "awardTender", static: false, private: false, access: { has: function (obj) { return "awardTender" in obj; }, get: function (obj) { return obj.awardTender; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getTripProfitability_decorators, { kind: "method", name: "getTripProfitability", static: false, private: false, access: { has: function (obj) { return "getTripProfitability" in obj; }, get: function (obj) { return obj.getTripProfitability; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getCustomerProfitability_decorators, { kind: "method", name: "getCustomerProfitability", static: false, private: false, access: { has: function (obj) { return "getCustomerProfitability" in obj; }, get: function (obj) { return obj.getCustomerProfitability; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getCustomerSLA_decorators, { kind: "method", name: "getCustomerSLA", static: false, private: false, access: { has: function (obj) { return "getCustomerSLA" in obj; }, get: function (obj) { return obj.getCustomerSLA; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        CommercialController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return CommercialController = _classThis;
}();
exports.CommercialController = CommercialController;
