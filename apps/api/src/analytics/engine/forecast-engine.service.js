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
exports.ForecastEngineService = void 0;
var common_1 = require("@nestjs/common");
var ForecastEngineService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var ForecastEngineService = _classThis = /** @class */ (function () {
        function ForecastEngineService_1(prisma) {
            this.prisma = prisma;
            this.logger = new common_1.Logger(ForecastEngineService.name);
        }
        /**
         * Basic linear regression implementation for forecasting
         * y = mx + b
         */
        ForecastEngineService_1.prototype.linearRegression = function (data) {
            var n = data.length;
            if (n === 0)
                return { m: 0, b: 0 };
            if (n === 1)
                return { m: 0, b: data[0] };
            var sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;
            for (var i = 0; i < n; i++) {
                sumX += i;
                sumY += data[i];
                sumXY += i * data[i];
                sumXX += i * i;
            }
            var m = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
            var b = (sumY - m * sumX) / n;
            return { m: m, b: b };
        };
        /**
         * Forecasts revenue for the next N days based on historical invoice data
         */
        ForecastEngineService_1.prototype.forecastRevenue = function (companyId_1) {
            return __awaiter(this, arguments, void 0, function (companyId, daysAhead) {
                var now, ninetyDaysAgo, invoices, dailyData, _a, m, b, forecast, i, futureX, predictedY, futureDate;
                var _this = this;
                if (daysAhead === void 0) { daysAhead = 30; }
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            now = new Date();
                            ninetyDaysAgo = new Date();
                            ninetyDaysAgo.setDate(now.getDate() - 90);
                            return [4 /*yield*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.invoice.findMany({
                                                where: {
                                                    companyId: companyId,
                                                    createdAt: { gte: ninetyDaysAgo },
                                                    status: { in: ['PAID', 'ISSUED'] },
                                                },
                                                select: { amount: true, createdAt: true },
                                                orderBy: { createdAt: 'asc' },
                                            })];
                                    });
                                }); })];
                        case 1:
                            invoices = _b.sent();
                            dailyData = new Array(90).fill(0);
                            invoices.forEach(function (inv) {
                                var dayDiff = Math.floor((inv.createdAt.getTime() - ninetyDaysAgo.getTime()) /
                                    (1000 * 60 * 60 * 24));
                                if (dayDiff >= 0 && dayDiff < 90) {
                                    dailyData[dayDiff] += inv.amount || 0;
                                }
                            });
                            _a = this.linearRegression(dailyData), m = _a.m, b = _a.b;
                            forecast = [];
                            for (i = 1; i <= daysAhead; i++) {
                                futureX = 89 + i;
                                predictedY = m * futureX + b;
                                futureDate = new Date(now);
                                futureDate.setDate(now.getDate() + i);
                                forecast.push({
                                    date: futureDate.toISOString().split('T')[0],
                                    projectedRevenue: Math.max(0, Math.round(predictedY * 100) / 100), // Ensure no negative revenue
                                });
                            }
                            return [2 /*return*/, {
                                    historicalTrend: m > 0 ? 'UP' : m < 0 ? 'DOWN' : 'FLAT',
                                    confidence: m !== 0 ? 0.75 : 0.5, // Naive confidence
                                    forecast: forecast,
                                }];
                    }
                });
            });
        };
        return ForecastEngineService_1;
    }());
    __setFunctionName(_classThis, "ForecastEngineService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ForecastEngineService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ForecastEngineService = _classThis;
}();
exports.ForecastEngineService = ForecastEngineService;
