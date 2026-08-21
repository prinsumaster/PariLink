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
exports.AlertEngineService = void 0;
var common_1 = require("@nestjs/common");
var event_emitter_1 = require("@nestjs/event-emitter");
var AlertEngineService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _evaluateGpsPing_decorators;
    var AlertEngineService = _classThis = /** @class */ (function () {
        function AlertEngineService_1(prisma, eventService) {
            this.prisma = (__runInitializers(this, _instanceExtraInitializers), prisma);
            this.eventService = eventService;
            this.logger = new common_1.Logger(AlertEngineService.name);
        }
        AlertEngineService_1.prototype.evaluateGpsPing = function (event) {
            return __awaiter(this, void 0, void 0, function () {
                var tenantId, payload, timestamp, vehicleId, speed, fuelLevel, rules, _i, rules_1, rule;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            tenantId = event.tenantId, payload = event.payload, timestamp = event.timestamp;
                            vehicleId = payload.vehicleId, speed = payload.speed, fuelLevel = payload.fuelLevel;
                            return [4 /*yield*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.alertRule.findMany({
                                                where: { companyId: tenantId, isActive: true },
                                            })];
                                    });
                                }); })];
                        case 1:
                            rules = _a.sent();
                            _i = 0, rules_1 = rules;
                            _a.label = 2;
                        case 2:
                            if (!(_i < rules_1.length)) return [3 /*break*/, 8];
                            rule = rules_1[_i];
                            if (!(rule.type === 'SPEEDING' && speed !== undefined)) return [3 /*break*/, 5];
                            if (!(rule.condition === 'EXCEEDS' && speed > rule.threshold)) return [3 /*break*/, 4];
                            return [4 /*yield*/, this.triggerAlert(tenantId, rule, vehicleId, timestamp, {
                                    speed: speed,
                                })];
                        case 3:
                            _a.sent();
                            _a.label = 4;
                        case 4: return [3 /*break*/, 7];
                        case 5:
                            if (!(rule.type === 'LOW_FUEL' && fuelLevel !== undefined)) return [3 /*break*/, 7];
                            if (!(rule.condition === 'LESS_THAN' && fuelLevel < rule.threshold)) return [3 /*break*/, 7];
                            return [4 /*yield*/, this.triggerAlert(tenantId, rule, vehicleId, timestamp, {
                                    fuelLevel: fuelLevel,
                                })];
                        case 6:
                            _a.sent();
                            _a.label = 7;
                        case 7:
                            _i++;
                            return [3 /*break*/, 2];
                        case 8: return [2 /*return*/];
                    }
                });
            });
        };
        AlertEngineService_1.prototype.triggerAlert = function (companyId, rule, vehicleId, timestamp, metadata) {
            return __awaiter(this, void 0, void 0, function () {
                var activeAlert, alert;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    return [2 /*return*/, tx.alert.findFirst({
                                            where: {
                                                companyId: companyId,
                                                ruleId: rule.id,
                                                vehicleId: vehicleId,
                                                status: { in: ['NEW', 'ACKNOWLEDGED'] },
                                            },
                                        })];
                                });
                            }); })];
                        case 1:
                            activeAlert = _a.sent();
                            if (activeAlert)
                                return [2 /*return*/]; // Prevent alert spam
                            return [4 /*yield*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.alert.create({
                                                data: {
                                                    companyId: companyId,
                                                    ruleId: rule.id,
                                                    vehicleId: vehicleId,
                                                    severity: rule.severity,
                                                    message: "Alert: ".concat(rule.name, " triggered."),
                                                    timestamp: new Date(timestamp),
                                                    metadata: metadata,
                                                },
                                            })];
                                    });
                                }); })];
                        case 2:
                            alert = _a.sent();
                            this.logger.warn("Alert Generated [".concat(rule.severity, "]: ").concat(rule.name, " for Vehicle ").concat(vehicleId));
                            this.eventService.publish('Alert.Triggered', {
                                tenantId: companyId,
                                userId: 'SYSTEM',
                                correlationId: "alert-".concat(alert.id),
                                payload: { alertId: alert.id, ruleType: rule.type },
                                timestamp: new Date(timestamp),
                            });
                            return [2 /*return*/];
                    }
                });
            });
        };
        return AlertEngineService_1;
    }());
    __setFunctionName(_classThis, "AlertEngineService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _evaluateGpsPing_decorators = [(0, event_emitter_1.OnEvent)('GpsPing.Received')];
        __esDecorate(_classThis, null, _evaluateGpsPing_decorators, { kind: "method", name: "evaluateGpsPing", static: false, private: false, access: { has: function (obj) { return "evaluateGpsPing" in obj; }, get: function (obj) { return obj.evaluateGpsPing; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AlertEngineService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AlertEngineService = _classThis;
}();
exports.AlertEngineService = AlertEngineService;
