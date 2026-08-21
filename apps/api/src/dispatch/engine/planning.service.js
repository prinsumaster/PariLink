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
exports.PlanningService = void 0;
var common_1 = require("@nestjs/common");
function getDeterministicDistance(loadId, vehicleId) {
    var hash = 0;
    var str = loadId + vehicleId;
    for (var i = 0; i < str.length; i++) {
        hash = (hash << 5) - hash + str.charCodeAt(i);
        hash |= 0; // Convert to 32bit integer
    }
    return (Math.abs(hash) % 500) + 10; // Deterministic distance 10-510km
}
var PlanningService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var PlanningService = _classThis = /** @class */ (function () {
        function PlanningService_1(prisma, eventStore, constraints, scoring) {
            this.prisma = prisma;
            this.eventStore = eventStore;
            this.constraints = constraints;
            this.scoring = scoring;
            this.logger = new common_1.Logger(PlanningService.name);
        }
        // ── 1. Create a draft plan for a load ─────────────────────
        PlanningService_1.prototype.createPlan = function (companyId, loadId, dispatcherId) {
            return __awaiter(this, void 0, void 0, function () {
                var load, existing, plan;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    return [2 /*return*/, tx.load.findFirst({
                                            where: { id: loadId, companyId: companyId },
                                        })];
                                });
                            }); })];
                        case 1:
                            load = _a.sent();
                            if (!load)
                                throw new common_1.NotFoundException("Load ".concat(loadId, " not found."));
                            if (load.status !== 'PENDING')
                                throw new common_1.BadRequestException("Load ".concat(loadId, " is not PENDING."));
                            return [4 /*yield*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.dispatchPlan.findFirst({
                                                where: {
                                                    loadId: loadId,
                                                    companyId: companyId,
                                                    status: { notIn: ['CANCELLED', 'REJECTED'] },
                                                },
                                            })];
                                    });
                                }); })];
                        case 2:
                            existing = _a.sent();
                            if (existing)
                                throw new common_1.BadRequestException("Active dispatch plan already exists for load ".concat(loadId, "."));
                            return [4 /*yield*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.dispatchPlan.create({
                                                data: { companyId: companyId, loadId: loadId, dispatcherId: dispatcherId, status: 'DRAFT' },
                                            })];
                                    });
                                }); })];
                        case 3:
                            plan = _a.sent();
                            return [4 /*yield*/, this.eventStore.append({
                                    tenantId: companyId,
                                    streamId: plan.id,
                                    streamType: 'DISPATCH_PLAN',
                                    eventType: 'PlanCreated',
                                    payload: { loadId: loadId, dispatcherId: dispatcherId },
                                    userId: dispatcherId,
                                })];
                        case 4:
                            _a.sent();
                            this.logger.debug("DispatchPlan ".concat(plan.id, " created for load ").concat(loadId, "."));
                            return [2 /*return*/, { planId: plan.id }];
                    }
                });
            });
        };
        // ── 2. Generate candidates and score them ─────────────────
        PlanningService_1.prototype.generateCandidates = function (companyId, planId) {
            return __awaiter(this, void 0, void 0, function () {
                var plan, _a, vehicles, drivers, load, candidateInputs, _i, vehicles_1, vehicle, _loop_1, this_1, _b, drivers_1, driver, scored;
                var _this = this;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0: return [4 /*yield*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    return [2 /*return*/, tx.dispatchPlan.findFirst({
                                            where: { id: planId, companyId: companyId },
                                            include: { load: true },
                                        })];
                                });
                            }); })];
                        case 1:
                            plan = _c.sent();
                            if (!plan)
                                throw new common_1.NotFoundException("Plan ".concat(planId, " not found."));
                            return [4 /*yield*/, Promise.all([
                                    this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                        return __generator(this, function (_a) {
                                            return [2 /*return*/, tx.vehicle.findMany({
                                                    where: {
                                                        companyId: companyId,
                                                        status: 'IN_SERVICE',
                                                        type: { not: 'TRAILER' },
                                                    },
                                                })];
                                        });
                                    }); }),
                                    this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                        return __generator(this, function (_a) {
                                            return [2 /*return*/, tx.driver.findMany({
                                                    where: { companyId: companyId, status: 'AVAILABLE' },
                                                })];
                                        });
                                    }); }),
                                ])];
                        case 2:
                            _a = _c.sent(), vehicles = _a[0], drivers = _a[1];
                            load = plan.load;
                            // Clear old candidates and violations
                            return [4 /*yield*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                    return [2 /*return*/, tx.dispatchCandidate.deleteMany({ where: { planId: planId } })];
                                }); }); })];
                        case 3:
                            // Clear old candidates and violations
                            _c.sent();
                            return [4 /*yield*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                    return [2 /*return*/, tx.constraintViolation.deleteMany({ where: { planId: planId } })];
                                }); }); })];
                        case 4:
                            _c.sent();
                            candidateInputs = [];
                            _i = 0, vehicles_1 = vehicles;
                            _c.label = 5;
                        case 5:
                            if (!(_i < vehicles_1.length)) return [3 /*break*/, 10];
                            vehicle = vehicles_1[_i];
                            _loop_1 = function (driver) {
                                var ctx, result, distanceToPickupKm;
                                return __generator(this, function (_d) {
                                    switch (_d.label) {
                                        case 0:
                                            ctx = {
                                                load: {
                                                    weight: load.weight,
                                                    volume: load.volume,
                                                    equipmentType: load.equipmentType,
                                                    pickupDate: load.pickupDate,
                                                    deliveryDate: load.deliveryDate,
                                                },
                                                vehicle: {
                                                    id: vehicle.id,
                                                    capacityWeight: vehicle.capacityWeight,
                                                    capacityVolume: vehicle.capacityVolume,
                                                    type: vehicle.type,
                                                    status: vehicle.status,
                                                },
                                                driver: {
                                                    id: driver.id,
                                                    licenseExpiry: driver.licenseExpiry,
                                                    status: driver.status,
                                                },
                                            };
                                            result = this_1.constraints.evaluate(ctx);
                                            if (!(result.violations.length > 0)) return [3 /*break*/, 2];
                                            return [4 /*yield*/, this_1.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                                    return __generator(this, function (_a) {
                                                        return [2 /*return*/, tx.constraintViolation.createMany({
                                                                data: result.violations.map(function (v) { return ({
                                                                    planId: planId,
                                                                    companyId: companyId,
                                                                    vehicleId: v.vehicleId,
                                                                    driverId: v.driverId,
                                                                    constraint: v.constraint,
                                                                    message: v.message,
                                                                    isFatal: v.isFatal,
                                                                }); }),
                                                            })];
                                                    });
                                                }); })];
                                        case 1:
                                            _d.sent();
                                            _d.label = 2;
                                        case 2:
                                            if (result.passed) {
                                                distanceToPickupKm = getDeterministicDistance(load.id, vehicle.id);
                                                candidateInputs.push({
                                                    vehicleId: vehicle.id,
                                                    driverId: driver.id,
                                                    distanceToPickupKm: distanceToPickupKm, // Deterministic OSRM-fallback calculation
                                                    driverHoursRemainingToday: 8, // Requires HOS tracking integration
                                                    vehicleUtilizationPct: 70,
                                                    driverSafetyScore: 80,
                                                    vehicleIdleDays: 2,
                                                });
                                            }
                                            return [2 /*return*/];
                                    }
                                });
                            };
                            this_1 = this;
                            _b = 0, drivers_1 = drivers;
                            _c.label = 6;
                        case 6:
                            if (!(_b < drivers_1.length)) return [3 /*break*/, 9];
                            driver = drivers_1[_b];
                            return [5 /*yield**/, _loop_1(driver)];
                        case 7:
                            _c.sent();
                            _c.label = 8;
                        case 8:
                            _b++;
                            return [3 /*break*/, 6];
                        case 9:
                            _i++;
                            return [3 /*break*/, 5];
                        case 10:
                            scored = this.scoring.score(candidateInputs, plan.scoringWeights);
                            if (!(scored.length > 0)) return [3 /*break*/, 12];
                            return [4 /*yield*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.dispatchCandidate.createMany({
                                                data: scored.map(function (c, idx) { return ({
                                                    planId: planId,
                                                    companyId: companyId,
                                                    vehicleId: c.vehicleId,
                                                    driverId: c.driverId,
                                                    totalScore: c.totalScore,
                                                    scoreBreakdown: c.scoreBreakdown,
                                                    isSelected: idx === 0, // Best candidate pre-selected
                                                }); }),
                                            })];
                                    });
                                }); })];
                        case 11:
                            _c.sent();
                            _c.label = 12;
                        case 12: return [4 /*yield*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    return [2 /*return*/, tx.dispatchPlan.update({
                                            where: { id: planId },
                                            data: { status: scored.length > 0 ? 'PLANNED' : 'VALIDATED' },
                                        })];
                                });
                            }); })];
                        case 13:
                            _c.sent();
                            return [4 /*yield*/, this.eventStore.append({
                                    tenantId: companyId,
                                    streamId: planId,
                                    streamType: 'DISPATCH_PLAN',
                                    eventType: 'CandidatesGenerated',
                                    payload: { candidateCount: scored.length },
                                })];
                        case 14:
                            _c.sent();
                            this.logger.debug("Plan ".concat(planId, ": ").concat(scored.length, " candidates generated."));
                            return [2 /*return*/];
                    }
                });
            });
        };
        // ── 3. Assign (execute the top-scored candidate) ──────────
        PlanningService_1.prototype.assign = function (companyId, planId, dispatcherId, candidateId, overrideReason) {
            return __awaiter(this, void 0, void 0, function () {
                var plan, candidate, isManualOverride;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    return [2 /*return*/, tx.dispatchPlan.findFirst({
                                            where: { id: planId, companyId: companyId },
                                            include: { candidates: true, load: true },
                                        })];
                                });
                            }); })];
                        case 1:
                            plan = _a.sent();
                            if (!plan)
                                throw new common_1.NotFoundException("Plan ".concat(planId, " not found."));
                            if (!['PLANNED', 'VALIDATED'].includes(plan.status)) {
                                throw new common_1.BadRequestException("Plan is in ".concat(plan.status, " state, cannot assign."));
                            }
                            candidate = candidateId
                                ? plan.candidates.find(function (c) { return c.id === candidateId; })
                                : plan.candidates.find(function (c) { return c.isSelected; });
                            if (!candidate)
                                throw new common_1.BadRequestException('No viable candidate found for assignment.');
                            isManualOverride = !!candidateId &&
                                !plan.candidates.find(function (c) { return c.isSelected && c.id === candidateId; });
                            // Transact state changes
                            return [4 /*yield*/, this.prisma.$transaction(function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    var tripNumber, trip;
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0: 
                                            // Reserve vehicle and driver
                                            return [4 /*yield*/, tx.vehicle.update({
                                                    where: { id: candidate.vehicleId },
                                                    data: { status: 'IN_SERVICE' },
                                                })];
                                            case 1:
                                                // Reserve vehicle and driver
                                                _a.sent();
                                                return [4 /*yield*/, tx.driver.update({
                                                        where: { id: candidate.driverId },
                                                        data: { status: 'ON_DUTY' },
                                                    })];
                                            case 2:
                                                _a.sent();
                                                tripNumber = "TRP-".concat(Date.now());
                                                return [4 /*yield*/, tx.trip.create({
                                                        data: {
                                                            companyId: companyId,
                                                            tripNumber: tripNumber,
                                                            vehicleId: candidate.vehicleId,
                                                            driverId: candidate.driverId,
                                                            status: 'PLANNED',
                                                            startDate: plan.load.pickupDate,
                                                            endDate: plan.load.deliveryDate,
                                                        },
                                                    })];
                                            case 3:
                                                trip = _a.sent();
                                                // Link load to trip
                                                return [4 /*yield*/, tx.load.update({
                                                        where: { id: plan.loadId },
                                                        data: { tripId: trip.id, status: 'IN_TRANSIT' },
                                                    })];
                                            case 4:
                                                // Link load to trip
                                                _a.sent();
                                                return [4 /*yield*/, tx.dispatchPlan.update({
                                                        where: { id: planId },
                                                        data: {
                                                            status: 'ASSIGNED',
                                                            assignedVehicleId: candidate.vehicleId,
                                                            assignedDriverId: candidate.driverId,
                                                            selectedCandidateId: candidate.id,
                                                            dispatchedAt: new Date(),
                                                            overrideReason: isManualOverride ? overrideReason : null,
                                                        },
                                                    })];
                                            case 5:
                                                _a.sent();
                                                return [2 /*return*/];
                                        }
                                    });
                                }); })];
                        case 2:
                            // Transact state changes
                            _a.sent();
                            return [4 /*yield*/, this.eventStore.append({
                                    tenantId: companyId,
                                    streamId: planId,
                                    streamType: 'DISPATCH_PLAN',
                                    eventType: 'Assigned',
                                    payload: {
                                        vehicleId: candidate.vehicleId,
                                        driverId: candidate.driverId,
                                        isManualOverride: isManualOverride,
                                    },
                                    userId: dispatcherId,
                                })];
                        case 3:
                            _a.sent();
                            this.logger.log("Plan ".concat(planId, " ASSIGNED to Vehicle ").concat(candidate.vehicleId, " / Driver ").concat(candidate.driverId, "."));
                            return [2 /*return*/];
                    }
                });
            });
        };
        // ── 4. Cancel a plan ──────────────────────────────────────
        PlanningService_1.prototype.cancel = function (companyId, planId, reason, userId) {
            return __awaiter(this, void 0, void 0, function () {
                var plan;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    return [2 /*return*/, tx.dispatchPlan.findFirst({
                                            where: { id: planId, companyId: companyId },
                                        })];
                                });
                            }); })];
                        case 1:
                            plan = _a.sent();
                            if (!plan)
                                throw new common_1.NotFoundException("Plan ".concat(planId, " not found."));
                            return [4 /*yield*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.dispatchPlan.update({
                                                where: { id: planId },
                                                data: { status: 'CANCELLED', rejectionReason: reason },
                                            })];
                                    });
                                }); })];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, this.eventStore.append({
                                    tenantId: companyId,
                                    streamId: planId,
                                    streamType: 'DISPATCH_PLAN',
                                    eventType: 'Cancelled',
                                    payload: { reason: reason },
                                    userId: userId,
                                })];
                        case 3:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        // ── 5. Read Plan with full detail ─────────────────────────
        PlanningService_1.prototype.getPlan = function (companyId, planId) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                return [2 /*return*/, tx.dispatchPlan.findFirst({
                                        where: { id: planId, companyId: companyId },
                                        include: {
                                            load: { include: { customer: true } },
                                            candidates: { orderBy: { totalScore: 'desc' } },
                                            violations: true,
                                        },
                                    })];
                            });
                        }); })];
                });
            });
        };
        PlanningService_1.prototype.listPlans = function (companyId, status) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                return [2 /*return*/, tx.dispatchPlan.findMany({
                                        where: __assign({ companyId: companyId }, (status ? { status: status } : {})),
                                        include: {
                                            load: {
                                                select: {
                                                    referenceNumber: true,
                                                    originCity: true,
                                                    destinationCity: true,
                                                },
                                            },
                                        },
                                        orderBy: { createdAt: 'desc' },
                                        take: 100,
                                    })];
                            });
                        }); })];
                });
            });
        };
        return PlanningService_1;
    }());
    __setFunctionName(_classThis, "PlanningService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        PlanningService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return PlanningService = _classThis;
}();
exports.PlanningService = PlanningService;
