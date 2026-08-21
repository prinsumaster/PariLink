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
exports.ExecutiveBriefingService = void 0;
var common_1 = require("@nestjs/common");
var ExecutiveBriefingService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var ExecutiveBriefingService = _classThis = /** @class */ (function () {
        function ExecutiveBriefingService_1(prisma, analyticsRegistry) {
            this.prisma = prisma;
            this.analyticsRegistry = analyticsRegistry;
            this.logger = new common_1.Logger(ExecutiveBriefingService.name);
        }
        /**
         * Generates C-Level Natural Language Briefings leveraging cross-domain engines.
         */
        ExecutiveBriefingService_1.prototype.generateDailyBriefing = function (companyId, userId) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    this.logger.log("Copilot generating Daily Executive Briefing for ".concat(companyId));
                    return [2 /*return*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                            var fleetProvider, wmsProvider, fleetMetrics, _a, wmsMetrics, _b, bpmProvider, finProvider, bpmMetrics, _c, financialMetrics, _d;
                            return __generator(this, function (_e) {
                                switch (_e.label) {
                                    case 0:
                                        fleetProvider = this.analyticsRegistry.getProvider('fleet');
                                        wmsProvider = this.analyticsRegistry.getProvider('warehouse');
                                        if (!fleetProvider) return [3 /*break*/, 2];
                                        return [4 /*yield*/, fleetProvider.getAnalytics(companyId, 'ALL')];
                                    case 1:
                                        _a = (_e.sent());
                                        return [3 /*break*/, 3];
                                    case 2:
                                        _a = {
                                            activeVehicles: 45,
                                            totalVehicles: 50,
                                            maintenanceAlerts: 2,
                                            criticalIncidents: 0,
                                        };
                                        _e.label = 3;
                                    case 3:
                                        fleetMetrics = _a;
                                        if (!wmsProvider) return [3 /*break*/, 5];
                                        return [4 /*yield*/, wmsProvider.getAnalytics(companyId, 'ALL')];
                                    case 4:
                                        _b = (_e.sent());
                                        return [3 /*break*/, 6];
                                    case 5:
                                        _b = {
                                            dockUtilization: '85%',
                                            pendingInbounds: 12,
                                            pendingOutbounds: 34,
                                            bottlenecks: 1,
                                        };
                                        _e.label = 6;
                                    case 6:
                                        wmsMetrics = _b;
                                        bpmProvider = this.analyticsRegistry.getProvider('bpm');
                                        finProvider = this.analyticsRegistry.getProvider('finance');
                                        if (!bpmProvider) return [3 /*break*/, 8];
                                        return [4 /*yield*/, bpmProvider.getAnalytics(companyId, 'ALL')];
                                    case 7:
                                        _c = (_e.sent());
                                        return [3 /*break*/, 9];
                                    case 8:
                                        _c = {
                                            activeProcesses: 10,
                                            bottlenecks: 1,
                                        };
                                        _e.label = 9;
                                    case 9:
                                        bpmMetrics = _c;
                                        if (!finProvider) return [3 /*break*/, 11];
                                        return [4 /*yield*/, finProvider.getAnalytics(companyId, 'ALL')];
                                    case 10:
                                        _d = _e.sent();
                                        return [3 /*break*/, 12];
                                    case 11:
                                        _d = {
                                            revenue: '$124,500',
                                            profitMargin: '18%',
                                            outstandingInvoices: 5,
                                        };
                                        _e.label = 12;
                                    case 12:
                                        financialMetrics = _d;
                                        // In production, an LLM layer would ingest these RAW metrics and construct a narrative.
                                        // Here we simulate the LLM's structured output.
                                        return [2 /*return*/, {
                                                title: 'Daily Operations & Financial Briefing',
                                                date: new Date().toISOString(),
                                                summary: "Today's operations achieved a 98.2% SLA compliance rate with fleet utilization holding steady at ".concat((fleetMetrics === null || fleetMetrics === void 0 ? void 0 : fleetMetrics.fleetUtilizationPercentage) || 85, "%. Warehouse throughput remains high, executing at a ").concat((wmsMetrics === null || wmsMetrics === void 0 ? void 0 : wmsMetrics.orderFulfillmentRate) || 98, "% fulfillment rate."),
                                                financials: {
                                                    revenue: '$145,000',
                                                    margin: '18.5%',
                                                    warning: 'Fuel expenses spiked 4% in the North-East corridor.',
                                                },
                                                risks: [
                                                    '3 Vehicles are overdue for preventive maintenance.',
                                                    "Warehouse 'Cross-Dock-Alpha' is approaching 90% congestion.",
                                                    "BPM Analytics indicates ".concat((bpmMetrics === null || bpmMetrics === void 0 ? void 0 : bpmMetrics.bottlenecks.length) || 0, " process bottlenecks in Finance Approval."),
                                                ],
                                                aiRecommendations: [
                                                    {
                                                        action: 'Re-route 15 pending trips to Contract Carriers.',
                                                        reason: 'Internal fleet availability is dropping due to pending maintenance.',
                                                        confidence: 0.92,
                                                        actionableLink: '/bpm/start/outsource-trips',
                                                    },
                                                ],
                                            }];
                                }
                            });
                        }); })];
                });
            });
        };
        return ExecutiveBriefingService_1;
    }());
    __setFunctionName(_classThis, "ExecutiveBriefingService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ExecutiveBriefingService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ExecutiveBriefingService = _classThis;
}();
exports.ExecutiveBriefingService = ExecutiveBriefingService;
