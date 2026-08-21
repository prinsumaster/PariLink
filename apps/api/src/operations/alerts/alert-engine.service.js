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
exports.AlertEngineService = void 0;
var common_1 = require("@nestjs/common");
var AlertEngineService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var AlertEngineService = _classThis = /** @class */ (function () {
        function AlertEngineService_1(prisma, auditService, eventEmitter) {
            this.prisma = prisma;
            this.auditService = auditService;
            this.eventEmitter = eventEmitter;
            this.logger = new common_1.Logger(AlertEngineService.name);
        }
        AlertEngineService_1.prototype.isUnderMaintenance = function (companyId, serviceName) {
            return __awaiter(this, void 0, void 0, function () {
                var now, activeWindows, _i, activeWindows_1, w, affected;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            now = new Date();
                            return [4 /*yield*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.maintenanceWindow.findMany({
                                                where: {
                                                    companyId: companyId,
                                                    isActive: true,
                                                    startTime: { lte: now },
                                                    endTime: { gte: now },
                                                },
                                            })];
                                    });
                                }); })];
                        case 1:
                            activeWindows = _a.sent();
                            for (_i = 0, activeWindows_1 = activeWindows; _i < activeWindows_1.length; _i++) {
                                w = activeWindows_1[_i];
                                affected = w.affectedServices || [];
                                if (affected.includes('ALL') || affected.includes(serviceName))
                                    return [2 /*return*/, true];
                            }
                            return [2 /*return*/, false];
                    }
                });
            });
        };
        AlertEngineService_1.prototype.triggerAlert = function (input) {
            return __awaiter(this, void 0, void 0, function () {
                var ruleId, rule, alert;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.isUnderMaintenance(input.companyId, input.type)];
                        case 1:
                            if (_a.sent()) {
                                this.logger.log("[Alert Engine] Alert suppressed for ".concat(input.type, " due to active Maintenance Window."));
                                return [2 /*return*/, { suppressed: true, reason: 'MAINTENANCE_WINDOW_ACTIVE' }];
                            }
                            ruleId = input.ruleId;
                            if (!!ruleId) return [3 /*break*/, 5];
                            return [4 /*yield*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.alertRule.findFirst({
                                                where: { companyId: input.companyId, type: input.type },
                                            })];
                                    });
                                }); })];
                        case 2:
                            rule = _a.sent();
                            if (!!rule) return [3 /*break*/, 4];
                            return [4 /*yield*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.alertRule.create({
                                                data: {
                                                    companyId: input.companyId,
                                                    name: "System Rule - ".concat(input.type),
                                                    type: input.type,
                                                    condition: 'EXCEEDS',
                                                    threshold: 0,
                                                    severity: input.severity,
                                                    isActive: true,
                                                },
                                            })];
                                    });
                                }); })];
                        case 3:
                            rule = _a.sent();
                            _a.label = 4;
                        case 4:
                            ruleId = rule.id;
                            _a.label = 5;
                        case 5: return [4 /*yield*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    return [2 /*return*/, tx.alert.create({
                                            data: {
                                                companyId: input.companyId,
                                                ruleId: ruleId,
                                                vehicleId: input.vehicleId || null,
                                                driverId: input.driverId || null,
                                                severity: input.severity,
                                                message: input.message,
                                                status: 'NEW',
                                                // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
                                                metadata: (input.metadata || {}),
                                            },
                                        })];
                                });
                            }); })];
                        case 6:
                            alert = _a.sent();
                            return [4 /*yield*/, this.processEscalation(input.companyId, alert)];
                        case 7:
                            _a.sent();
                            this.eventEmitter.emit('Operations.Alert.Triggered', {
                                alertId: alert.id,
                                companyId: input.companyId,
                                type: input.type,
                                severity: input.severity,
                                message: input.message,
                            });
                            return [2 /*return*/, alert];
                    }
                });
            });
        };
        AlertEngineService_1.prototype.evaluateThresholds = function (companyId, metricName, value, subsystem) {
            return __awaiter(this, void 0, void 0, function () {
                var rules, _i, rules_1, rule, triggered;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    return [2 /*return*/, tx.alertRule.findMany({
                                            where: { companyId: companyId, type: subsystem, isActive: true },
                                        })];
                                });
                            }); })];
                        case 1:
                            rules = _a.sent();
                            _i = 0, rules_1 = rules;
                            _a.label = 2;
                        case 2:
                            if (!(_i < rules_1.length)) return [3 /*break*/, 5];
                            rule = rules_1[_i];
                            triggered = false;
                            if (rule.condition === 'EXCEEDS' && value > rule.threshold)
                                triggered = true;
                            else if (rule.condition === 'LESS_THAN' && value < rule.threshold)
                                triggered = true;
                            else if (rule.condition === 'MATCHES' && value === rule.threshold)
                                triggered = true;
                            if (!triggered) return [3 /*break*/, 4];
                            return [4 /*yield*/, this.triggerAlert({
                                    companyId: companyId,
                                    ruleId: rule.id,
                                    type: subsystem,
                                    severity: rule.severity || 'HIGH',
                                    message: "Threshold breached for ".concat(metricName, ": observed value ").concat(value, " ").concat(rule.condition, " threshold ").concat(rule.threshold),
                                    metadata: {
                                        metricName: metricName,
                                        value: value,
                                        threshold: rule.threshold,
                                        condition: rule.condition,
                                    },
                                })];
                        case 3:
                            _a.sent();
                            _a.label = 4;
                        case 4:
                            _i++;
                            return [3 /*break*/, 2];
                        case 5: return [2 /*return*/];
                    }
                });
            });
        };
        AlertEngineService_1.prototype.processEscalation = function (companyId, alert) {
            return __awaiter(this, void 0, void 0, function () {
                var policy, steps, _i, steps_1, step, e_1;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.alertEscalationPolicy.findFirst({
                                                where: { companyId: companyId, isActive: true, severity: alert.severity },
                                            })];
                                    });
                                }); })];
                        case 1:
                            policy = _a.sent();
                            if (!policy)
                                return [2 /*return*/];
                            steps = policy.steps || [];
                            this.logger.log("[Alert Engine] Executing escalation policy \"".concat(policy.name, "\" (").concat(steps.length, " steps) for alert ").concat(alert.id));
                            for (_i = 0, steps_1 = steps; _i < steps_1.length; _i++) {
                                step = steps_1[_i];
                                this.eventEmitter.emit('Operations.Alert.EscalateStep', {
                                    alertId: alert.id,
                                    delayMinutes: step.delayMinutes || 0,
                                    targetRoles: step.targetRoles || ['ADMIN'],
                                    channels: step.channels || ['EMAIL'],
                                });
                            }
                            return [3 /*break*/, 3];
                        case 2:
                            e_1 = _a.sent();
                            this.logger.error("Escalation processing failed: ".concat(e_1 instanceof Error ? e_1.message : String(e_1)));
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        AlertEngineService_1.prototype.acknowledgeAlert = function (companyId, alertId, userId) {
            return __awaiter(this, void 0, void 0, function () {
                var updated;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    return [2 /*return*/, tx.alert.update({
                                            where: { id: alertId },
                                            data: { status: 'ACKNOWLEDGED' },
                                        })];
                                });
                            }); })];
                        case 1:
                            updated = _a.sent();
                            if (!userId) return [3 /*break*/, 3];
                            return [4 /*yield*/, this.auditService.logEvent({
                                    action: 'ALERT_ACKNOWLEDGED',
                                    entity: 'Alert',
                                    entityId: alertId,
                                    companyId: companyId,
                                    userId: userId,
                                    details: { status: 'ACKNOWLEDGED' },
                                })];
                        case 2:
                            _a.sent();
                            _a.label = 3;
                        case 3: return [2 /*return*/, updated];
                    }
                });
            });
        };
        AlertEngineService_1.prototype.resolveAlert = function (companyId, alertId, userId) {
            return __awaiter(this, void 0, void 0, function () {
                var updated;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    return [2 /*return*/, tx.alert.update({
                                            where: { id: alertId },
                                            data: { status: 'RESOLVED', resolvedAt: new Date() },
                                        })];
                                });
                            }); })];
                        case 1:
                            updated = _a.sent();
                            if (!userId) return [3 /*break*/, 3];
                            return [4 /*yield*/, this.auditService.logEvent({
                                    action: 'ALERT_RESOLVED',
                                    entity: 'Alert',
                                    entityId: alertId,
                                    companyId: companyId,
                                    userId: userId,
                                    details: { status: 'RESOLVED' },
                                })];
                        case 2:
                            _a.sent();
                            _a.label = 3;
                        case 3: return [2 /*return*/, updated];
                    }
                });
            });
        };
        AlertEngineService_1.prototype.createMaintenanceWindow = function (data) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                return [2 /*return*/, tx.maintenanceWindow.create({
                                        data: {
                                            companyId: data.companyId,
                                            name: data.name,
                                            description: data.description || null,
                                            startTime: data.startTime,
                                            endTime: data.endTime,
                                            affectedServices: data.affectedServices,
                                            isActive: true,
                                        },
                                    })];
                            });
                        }); })];
                });
            });
        };
        AlertEngineService_1.prototype.createEscalationPolicy = function (data) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                return [2 /*return*/, tx.alertEscalationPolicy.create({
                                        data: {
                                            companyId: data.companyId,
                                            name: data.name,
                                            severity: data.severity,
                                            // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
                                            steps: data.steps,
                                            isActive: true,
                                        },
                                    })];
                            });
                        }); })];
                });
            });
        };
        return AlertEngineService_1;
    }());
    __setFunctionName(_classThis, "AlertEngineService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AlertEngineService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AlertEngineService = _classThis;
}();
exports.AlertEngineService = AlertEngineService;
