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
exports.TelematicsIngestionService = void 0;
var common_1 = require("@nestjs/common");
var TelematicsIngestionService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var TelematicsIngestionService = _classThis = /** @class */ (function () {
        function TelematicsIngestionService_1(prisma, audit, notificationOrchestrator) {
            this.prisma = prisma;
            this.audit = audit;
            this.notificationOrchestrator = notificationOrchestrator;
            this.logger = new common_1.Logger(TelematicsIngestionService.name);
        }
        TelematicsIngestionService_1.prototype.ingestTelemetry = function (companyId, dto) {
            return __awaiter(this, void 0, void 0, function () {
                var vehicle, timestamp, telemetry, rules, triggeredAlerts, alertsToCreate, adminUser, _i, rules_1, rule, triggered, actualValue, message, e_1, createdAlerts;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    return [2 /*return*/, tx.vehicle.findUnique({
                                            where: { id: dto.vehicleId },
                                        })];
                                });
                            }); })];
                        case 1:
                            vehicle = _a.sent();
                            if (!vehicle || vehicle.companyId !== companyId) {
                                throw new common_1.NotFoundException('Vehicle not found in company');
                            }
                            timestamp = dto.timestamp ? new Date(dto.timestamp) : new Date();
                            return [4 /*yield*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.vehicleTelemetry.create({
                                                data: {
                                                    companyId: companyId,
                                                    vehicleId: dto.vehicleId,
                                                    odometer: dto.odometer || null,
                                                    engineHours: dto.engineHours || null,
                                                    fuelLevel: dto.fuelLevel || null,
                                                    batteryVolts: dto.batteryVolts || null,
                                                    coolantTemp: dto.coolantTemp || null,
                                                    engineLoad: dto.engineLoad || null,
                                                    rpm: dto.rpm || null,
                                                    dtcCodes: dto.dtcCodes ? dto.dtcCodes : undefined,
                                                    ignition: dto.ignition !== undefined ? dto.ignition : null,
                                                    timestamp: timestamp,
                                                },
                                            })];
                                    });
                                }); })];
                        case 2:
                            telemetry = _a.sent();
                            return [4 /*yield*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.alertRule.findMany({
                                                where: { companyId: companyId, isActive: true },
                                            })];
                                    });
                                }); })];
                        case 3:
                            rules = _a.sent();
                            triggeredAlerts = [];
                            alertsToCreate = [];
                            return [4 /*yield*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.user.findFirst({
                                                where: { companyId: companyId, status: 'ACTIVE' },
                                            })];
                                    });
                                }); })];
                        case 4:
                            adminUser = _a.sent();
                            _i = 0, rules_1 = rules;
                            _a.label = 5;
                        case 5:
                            if (!(_i < rules_1.length)) return [3 /*break*/, 10];
                            rule = rules_1[_i];
                            triggered = false;
                            actualValue = null;
                            message = '';
                            if (rule.type === 'SPEEDING' && dto.speed !== undefined) {
                                if (rule.condition === 'EXCEEDS' && dto.speed > rule.threshold) {
                                    triggered = true;
                                    actualValue = dto.speed;
                                    message = "Vehicle ".concat(vehicle.licensePlate, " speeding at ").concat(dto.speed, " mph (threshold: ").concat(rule.threshold, " mph)");
                                }
                            }
                            else if (rule.type === 'MAINTENANCE' || rule.type === 'COOLANT') {
                                if (dto.coolantTemp !== undefined && dto.coolantTemp > rule.threshold) {
                                    triggered = true;
                                    actualValue = dto.coolantTemp;
                                    message = "Vehicle ".concat(vehicle.licensePlate, " engine overheating at ").concat(dto.coolantTemp, "\u00B0F");
                                }
                                else if (dto.dtcCodes && dto.dtcCodes.length > 0) {
                                    triggered = true;
                                    actualValue = dto.dtcCodes;
                                    message = "Vehicle ".concat(vehicle.licensePlate, " reported diagnostic trouble codes: ").concat(dto.dtcCodes.join(', '));
                                }
                            }
                            else if (rule.type === 'LOW_FUEL' && dto.fuelLevel !== undefined) {
                                if (rule.condition === 'LESS_THAN' && dto.fuelLevel < rule.threshold) {
                                    triggered = true;
                                    actualValue = dto.fuelLevel;
                                    message = "Vehicle ".concat(vehicle.licensePlate, " low fuel level at ").concat(dto.fuelLevel, "%");
                                }
                            }
                            else if (rule.type === 'BATTERY' && dto.batteryVolts !== undefined) {
                                if (rule.condition === 'LESS_THAN' &&
                                    dto.batteryVolts < rule.threshold) {
                                    triggered = true;
                                    actualValue = dto.batteryVolts;
                                    message = "Vehicle ".concat(vehicle.licensePlate, " low battery voltage at ").concat(dto.batteryVolts, "V");
                                }
                            }
                            if (!triggered) return [3 /*break*/, 9];
                            alertsToCreate.push({
                                companyId: companyId,
                                ruleId: rule.id,
                                vehicleId: dto.vehicleId,
                                driverId: dto.driverId || null,
                                severity: rule.severity || 'MEDIUM',
                                message: message,
                                status: 'NEW',
                                timestamp: timestamp,
                                metadata: {
                                    actualValue: actualValue,
                                    threshold: rule.threshold,
                                    telemetryId: telemetry.id,
                                },
                            });
                            if (!((rule.severity === 'HIGH' || rule.severity === 'CRITICAL') &&
                                adminUser)) return [3 /*break*/, 9];
                            _a.label = 6;
                        case 6:
                            _a.trys.push([6, 8, , 9]);
                            return [4 /*yield*/, this.notificationOrchestrator.dispatchNotification(companyId, adminUser.id, {
                                    targetUserId: adminUser.id,
                                    eventType: "telematics.".concat(rule.type.toLowerCase()),
                                    priority: rule.severity === 'CRITICAL' ? 'URGENT' : 'HIGH',
                                    title: "Fleet Alert: ".concat(rule.name),
                                    body: message,
                                    entityType: 'Vehicle',
                                    entityId: dto.vehicleId,
                                    channels: ['IN_APP', 'EMAIL'],
                                })];
                        case 7:
                            _a.sent();
                            return [3 /*break*/, 9];
                        case 8:
                            e_1 = _a.sent();
                            this.logger.error("Failed to dispatch alert notification: ".concat(e_1));
                            return [3 /*break*/, 9];
                        case 9:
                            _i++;
                            return [3 /*break*/, 5];
                        case 10:
                            if (!(alertsToCreate.length > 0)) return [3 /*break*/, 12];
                            return [4 /*yield*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                    return [2 /*return*/, Promise.all(alertsToCreate.map(function (alert) { return tx.alert.create({ data: alert }); }))];
                                }); }); })];
                        case 11:
                            createdAlerts = _a.sent();
                            triggeredAlerts.push.apply(triggeredAlerts, createdAlerts);
                            _a.label = 12;
                        case 12: return [2 /*return*/, {
                                success: true,
                                telemetryId: telemetry.id,
                                evaluatedRulesCount: rules.length,
                                triggeredAlertsCount: triggeredAlerts.length,
                                triggeredAlerts: triggeredAlerts,
                            }];
                    }
                });
            });
        };
        // Alert Rules CRUD
        TelematicsIngestionService_1.prototype.createAlertRule = function (companyId, userId, dto) {
            return __awaiter(this, void 0, void 0, function () {
                var rule;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    return [2 /*return*/, tx.alertRule.create({
                                            data: {
                                                companyId: companyId,
                                                name: dto.name,
                                                type: dto.type,
                                                condition: dto.condition,
                                                threshold: dto.threshold,
                                                severity: dto.severity || 'MEDIUM',
                                                isActive: dto.isActive !== undefined ? dto.isActive : true,
                                            },
                                        })];
                                });
                            }); })];
                        case 1:
                            rule = _a.sent();
                            return [4 /*yield*/, this.audit.logEvent({
                                    action: 'telematics:alert_rule:create',
                                    entity: 'AlertRule',
                                    entityId: rule.id,
                                    userId: userId,
                                    companyId: companyId,
                                    details: { name: rule.name, type: rule.type, threshold: rule.threshold },
                                })];
                        case 2:
                            _a.sent();
                            return [2 /*return*/, rule];
                    }
                });
            });
        };
        TelematicsIngestionService_1.prototype.getAlertRules = function (companyId) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                return [2 /*return*/, tx.alertRule.findMany({
                                        where: { companyId: companyId },
                                        orderBy: { createdAt: 'desc' },
                                    })];
                            });
                        }); })];
                });
            });
        };
        TelematicsIngestionService_1.prototype.deleteAlertRule = function (companyId, id, userId) {
            return __awaiter(this, void 0, void 0, function () {
                var rule;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, tx.alertRule.findFirst({ where: { id: id, companyId: companyId } })];
                            }); }); })];
                        case 1:
                            rule = _a.sent();
                            if (!rule || rule.companyId !== companyId) {
                                throw new common_1.NotFoundException('Alert rule not found');
                            }
                            return [4 /*yield*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.alertRule.deleteMany({
                                                where: { id: id, companyId: companyId },
                                            })];
                                    });
                                }); })];
                        case 2:
                            _a.sent();
                            return [2 /*return*/, { success: true, id: id }];
                    }
                });
            });
        };
        // Alerts Management
        TelematicsIngestionService_1.prototype.getAlerts = function (companyId, status, vehicleId) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                return [2 /*return*/, tx.alert.findMany({
                                        where: {
                                            companyId: companyId,
                                            status: status || undefined,
                                            vehicleId: vehicleId || undefined,
                                        },
                                        include: {
                                            vehicle: { select: { licensePlate: true, make: true, model: true } },
                                            rule: { select: { name: true, type: true } },
                                        },
                                        orderBy: { timestamp: 'desc' },
                                        take: 100,
                                    })];
                            });
                        }); })];
                });
            });
        };
        TelematicsIngestionService_1.prototype.updateAlertStatus = function (companyId, id, userId, dto) {
            return __awaiter(this, void 0, void 0, function () {
                var alert, updated;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, tx.alert.findFirst({ where: { id: id, companyId: companyId } })];
                            }); }); })];
                        case 1:
                            alert = _a.sent();
                            if (!alert || alert.companyId !== companyId) {
                                throw new common_1.NotFoundException('Alert not found');
                            }
                            return [4 /*yield*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.alert.updateMany({
                                                where: { id: id, companyId: companyId },
                                                data: {
                                                    status: dto.status,
                                                    resolvedAt: dto.status === 'RESOLVED' ? new Date() : undefined,
                                                    metadata: __assign(__assign({}, alert.metadata), { lastUpdatedBy: userId, notes: dto.notes || null }),
                                                },
                                            })];
                                    });
                                }); })];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                    return [2 /*return*/, tx.alert.findFirst({ where: { id: id, companyId: companyId } })];
                                }); }); })];
                        case 3:
                            updated = _a.sent();
                            return [4 /*yield*/, this.audit.logEvent({
                                    action: "telematics:alert:".concat(dto.status.toLowerCase()),
                                    entity: 'Alert',
                                    entityId: id,
                                    userId: userId,
                                    companyId: companyId,
                                    details: {
                                        previousStatus: alert.status,
                                        newStatus: dto.status,
                                        notes: dto.notes,
                                    },
                                })];
                        case 4:
                            _a.sent();
                            return [2 /*return*/, updated];
                    }
                });
            });
        };
        TelematicsIngestionService_1.prototype.getFleetHealthAnalytics = function (companyId) {
            return __awaiter(this, void 0, void 0, function () {
                var _a, totalAlerts, unresolvedAlerts, criticalAlerts, vehicleCount, alertsByType;
                var _this = this;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, Promise.all([
                                this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                    return [2 /*return*/, tx.alert.count({ where: { companyId: companyId } })];
                                }); }); }),
                                this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.alert.count({
                                                where: { companyId: companyId, status: { in: ['NEW', 'ACKNOWLEDGED'] } },
                                            })];
                                    });
                                }); }),
                                this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.alert.count({
                                                where: {
                                                    companyId: companyId,
                                                    severity: 'CRITICAL',
                                                    status: { in: ['NEW', 'ACKNOWLEDGED'] },
                                                },
                                            })];
                                    });
                                }); }),
                                this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                    return [2 /*return*/, tx.vehicle.count({ where: { companyId: companyId } })];
                                }); }); }),
                            ])];
                        case 1:
                            _a = _b.sent(), totalAlerts = _a[0], unresolvedAlerts = _a[1], criticalAlerts = _a[2], vehicleCount = _a[3];
                            return [4 /*yield*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.alert.groupBy({
                                                by: ['ruleId'],
                                                where: { companyId: companyId, status: { in: ['NEW', 'ACKNOWLEDGED'] } },
                                                _count: true,
                                            })];
                                    });
                                }); })];
                        case 2:
                            alertsByType = _b.sent();
                            return [2 /*return*/, {
                                    companyId: companyId,
                                    summary: { vehicleCount: vehicleCount, totalAlerts: totalAlerts, unresolvedAlerts: unresolvedAlerts, criticalAlerts: criticalAlerts },
                                    timestamp: new Date().toISOString(),
                                }];
                    }
                });
            });
        };
        return TelematicsIngestionService_1;
    }());
    __setFunctionName(_classThis, "TelematicsIngestionService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        TelematicsIngestionService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return TelematicsIngestionService = _classThis;
}();
exports.TelematicsIngestionService = TelematicsIngestionService;
