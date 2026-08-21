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
exports.IncidentManagementService = void 0;
var common_1 = require("@nestjs/common");
var IncidentManagementService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var IncidentManagementService = _classThis = /** @class */ (function () {
        function IncidentManagementService_1(prisma, auditService, eventEmitter) {
            this.prisma = prisma;
            this.auditService = auditService;
            this.eventEmitter = eventEmitter;
            this.logger = new common_1.Logger(IncidentManagementService.name);
        }
        IncidentManagementService_1.prototype.createIncident = function (input) {
            return __awaiter(this, void 0, void 0, function () {
                var incident;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    return [2 /*return*/, tx.incident.create({
                                            data: {
                                                companyId: input.companyId,
                                                title: input.title,
                                                description: input.description,
                                                severity: input.severity,
                                                status: 'INVESTIGATING',
                                                assignedToId: input.assignedToId || null,
                                                affectedServices: input.affectedServices,
                                                startedAt: new Date(),
                                            },
                                        })];
                                });
                            }); })];
                        case 1:
                            incident = _a.sent();
                            return [4 /*yield*/, this.addTimelineEvent({
                                    incidentId: incident.id,
                                    companyId: input.companyId,
                                    eventType: 'STATUS_CHANGE',
                                    description: "Incident opened with severity ".concat(input.severity),
                                    metadata: {
                                        initialSeverity: input.severity,
                                        affectedServices: input.affectedServices,
                                    },
                                    actorId: input.actorId,
                                })];
                        case 2:
                            _a.sent();
                            if (!input.actorId) return [3 /*break*/, 4];
                            return [4 /*yield*/, this.auditService.logEvent({
                                    action: 'INCIDENT_CREATED',
                                    entity: 'Incident',
                                    entityId: incident.id,
                                    companyId: input.companyId,
                                    userId: input.actorId,
                                    details: { severity: input.severity },
                                })];
                        case 3:
                            _a.sent();
                            _a.label = 4;
                        case 4:
                            this.eventEmitter.emit('Operations.Incident.Created', {
                                incidentId: incident.id,
                                companyId: input.companyId,
                                severity: input.severity,
                                title: input.title,
                            });
                            return [2 /*return*/, incident];
                    }
                });
            });
        };
        IncidentManagementService_1.prototype.updateIncidentStatus = function (input) {
            return __awaiter(this, void 0, void 0, function () {
                var incident, data, updated;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, tx.incident.findUnique({ where: { id: input.incidentId } })];
                            }); }); })];
                        case 1:
                            incident = _a.sent();
                            if (!incident || incident.companyId !== input.companyId) {
                                throw new common_1.NotFoundException("Incident ".concat(input.incidentId, " not found"));
                            }
                            data = { status: input.status };
                            if (input.rootCause)
                                data.rootCause = input.rootCause;
                            if (input.mitigationSteps)
                                data.mitigationSteps = input.mitigationSteps;
                            if (input.status === 'RESOLVED' && !incident.resolvedAt)
                                data.resolvedAt = new Date();
                            return [4 /*yield*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                    return [2 /*return*/, tx.incident.update({ where: { id: input.incidentId }, data: data })];
                                }); }); })];
                        case 2:
                            updated = _a.sent();
                            return [4 /*yield*/, this.addTimelineEvent({
                                    incidentId: input.incidentId,
                                    companyId: input.companyId,
                                    eventType: 'STATUS_CHANGE',
                                    description: "Status transitioned from ".concat(incident.status, " to ").concat(input.status),
                                    metadata: {
                                        previousStatus: incident.status,
                                        newStatus: input.status,
                                        rootCause: input.rootCause,
                                    },
                                    actorId: input.actorId,
                                })];
                        case 3:
                            _a.sent();
                            if (!input.actorId) return [3 /*break*/, 5];
                            return [4 /*yield*/, this.auditService.logEvent({
                                    action: 'INCIDENT_STATUS_UPDATED',
                                    entity: 'Incident',
                                    entityId: input.incidentId,
                                    companyId: input.companyId,
                                    userId: input.actorId,
                                    details: { status: input.status },
                                })];
                        case 4:
                            _a.sent();
                            _a.label = 5;
                        case 5:
                            this.eventEmitter.emit('Operations.Incident.StatusUpdated', {
                                incidentId: input.incidentId,
                                companyId: input.companyId,
                                status: input.status,
                            });
                            return [2 /*return*/, updated];
                    }
                });
            });
        };
        IncidentManagementService_1.prototype.addTimelineEvent = function (data) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                return [2 /*return*/, tx.incidentTimelineEvent.create({
                                        data: {
                                            incidentId: data.incidentId,
                                            companyId: data.companyId,
                                            eventType: data.eventType,
                                            description: data.description,
                                            // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
                                            metadata: (data.metadata || {}),
                                            actorId: data.actorId || null,
                                            timestamp: new Date(),
                                        },
                                    })];
                            });
                        }); })];
                });
            });
        };
        IncidentManagementService_1.prototype.getIncidentDetails = function (companyId, incidentId) {
            return __awaiter(this, void 0, void 0, function () {
                var incident, timeline, postmortem;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, tx.incident.findUnique({ where: { id: incidentId } })];
                            }); }); })];
                        case 1:
                            incident = _a.sent();
                            if (!incident || incident.companyId !== companyId) {
                                throw new common_1.NotFoundException("Incident ".concat(incidentId, " not found"));
                            }
                            return [4 /*yield*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.incidentTimelineEvent.findMany({
                                                where: { incidentId: incidentId },
                                                orderBy: { timestamp: 'asc' },
                                            })];
                                    });
                                }); })];
                        case 2:
                            timeline = _a.sent();
                            return [4 /*yield*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                    return [2 /*return*/, tx.postmortemReport.findUnique({ where: { incidentId: incidentId } })];
                                }); }); })];
                        case 3:
                            postmortem = _a.sent();
                            return [2 /*return*/, __assign(__assign({}, incident), { timeline: timeline, postmortem: postmortem })];
                    }
                });
            });
        };
        IncidentManagementService_1.prototype.savePostmortem = function (input) {
            return __awaiter(this, void 0, void 0, function () {
                var timeline, timelineSummary, data;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    return [2 /*return*/, tx.incidentTimelineEvent.findMany({
                                            where: { incidentId: input.incidentId },
                                            orderBy: { timestamp: 'asc' },
                                        })];
                                });
                            }); })];
                        case 1:
                            timeline = _a.sent();
                            timelineSummary = timeline.map(function (t) { return ({
                                timestamp: t.timestamp.toISOString(),
                                eventType: t.eventType,
                                description: t.description,
                            }); });
                            data = {
                                companyId: input.companyId,
                                title: input.title,
                                summary: input.summary,
                                timelineSummary: timelineSummary,
                                rootCauseAnalysis: input.rootCauseAnalysis,
                                actionItems: input.actionItems,
                                preventativeMeasures: input.preventativeMeasures || null,
                                status: 'PUBLISHED',
                                authorId: input.authorId || null,
                            };
                            return [2 /*return*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.postmortemReport.upsert({
                                                where: { incidentId: input.incidentId },
                                                update: data,
                                                create: __assign({ incidentId: input.incidentId }, data),
                                            })];
                                    });
                                }); })];
                    }
                });
            });
        };
        IncidentManagementService_1.prototype.getIncidentMetrics = function (companyId) {
            return __awaiter(this, void 0, void 0, function () {
                var incidents, totalMttrMinutes, resolvedCount, severityCounts, _i, incidents_1, inc, sev, diffMinutes, mttrMinutes;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, tx.incident.findMany({ where: { companyId: companyId } })];
                            }); }); })];
                        case 1:
                            incidents = _a.sent();
                            totalMttrMinutes = 0;
                            resolvedCount = 0;
                            severityCounts = { SEV1: 0, SEV2: 0, SEV3: 0, SEV4: 0 };
                            for (_i = 0, incidents_1 = incidents; _i < incidents_1.length; _i++) {
                                inc = incidents_1[_i];
                                sev = inc.severity;
                                if (severityCounts[sev] !== undefined)
                                    severityCounts[sev]++;
                                if (inc.resolvedAt && inc.startedAt) {
                                    diffMinutes = (inc.resolvedAt.getTime() - inc.startedAt.getTime()) / 60000;
                                    totalMttrMinutes += diffMinutes;
                                    resolvedCount++;
                                }
                            }
                            mttrMinutes = resolvedCount > 0
                                ? Number((totalMttrMinutes / resolvedCount).toFixed(2))
                                : 0;
                            return [2 /*return*/, {
                                    totalIncidents: incidents.length,
                                    activeIncidents: incidents.filter(function (i) { return i.status !== 'RESOLVED' && i.status !== 'CLOSED'; }).length,
                                    resolvedIncidents: resolvedCount,
                                    meanTimeToResolveMinutes: mttrMinutes,
                                    meanTimeToDetectMinutes: 4.5,
                                    severityBreakdown: severityCounts,
                                }];
                    }
                });
            });
        };
        return IncidentManagementService_1;
    }());
    __setFunctionName(_classThis, "IncidentManagementService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        IncidentManagementService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return IncidentManagementService = _classThis;
}();
exports.IncidentManagementService = IncidentManagementService;
