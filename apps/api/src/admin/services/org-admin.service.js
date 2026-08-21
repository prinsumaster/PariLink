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
exports.OrgAdminService = void 0;
var common_1 = require("@nestjs/common");
var OrgAdminService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var OrgAdminService = _classThis = /** @class */ (function () {
        function OrgAdminService_1(prisma, audit) {
            this.prisma = prisma;
            this.audit = audit;
        }
        OrgAdminService_1.prototype.getOrgOverview = function (companyId) {
            return __awaiter(this, void 0, void 0, function () {
                var _a, branches, warehouses, departments, teams, costCenters;
                var _this = this;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, Promise.all([
                                this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                    return [2 /*return*/, tx.branch.findMany({ where: { companyId: companyId } })];
                                }); }); }),
                                this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                    return [2 /*return*/, tx.warehouse.findMany({ where: { companyId: companyId } })];
                                }); }); }),
                                this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                    return [2 /*return*/, tx.department.findMany({ where: { companyId: companyId } })];
                                }); }); }),
                                this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                    return [2 /*return*/, tx.team.findMany({ where: { companyId: companyId } })];
                                }); }); }),
                                this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                    return [2 /*return*/, tx.costCenter.findMany({ where: { companyId: companyId } })];
                                }); }); }),
                            ])];
                        case 1:
                            _a = _b.sent(), branches = _a[0], warehouses = _a[1], departments = _a[2], teams = _a[3], costCenters = _a[4];
                            return [2 /*return*/, {
                                    companyId: companyId,
                                    branches: branches,
                                    warehouses: warehouses,
                                    departments: departments,
                                    teams: teams,
                                    costCenters: costCenters,
                                }];
                    }
                });
            });
        };
        OrgAdminService_1.prototype.getDepartments = function (companyId) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                return [2 /*return*/, tx.department.findMany({
                                        where: { companyId: companyId },
                                        include: { _count: { select: { users: true, teams: true } } },
                                        orderBy: { name: 'asc' },
                                    })];
                            });
                        }); })];
                });
            });
        };
        OrgAdminService_1.prototype.createDepartment = function (companyId, dto, adminUserId) {
            return __awaiter(this, void 0, void 0, function () {
                var existing, dept;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    return [2 /*return*/, tx.department.findFirst({
                                            where: { companyId: companyId, name: dto.name },
                                        })];
                                });
                            }); })];
                        case 1:
                            existing = _a.sent();
                            if (existing)
                                throw new common_1.ConflictException("Department ".concat(dto.name, " already exists in tenant"));
                            return [4 /*yield*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.department.create({
                                                data: {
                                                    companyId: companyId,
                                                    name: dto.name,
                                                    code: dto.code,
                                                    description: dto.description,
                                                    managerId: dto.managerId,
                                                },
                                            })];
                                    });
                                }); })];
                        case 2:
                            dept = _a.sent();
                            return [4 /*yield*/, this.audit.logEvent({
                                    action: 'admin:org:create_department',
                                    entity: 'Department',
                                    entityId: dept.id,
                                    userId: adminUserId,
                                    companyId: companyId,
                                    details: { department: dto },
                                })];
                        case 3:
                            _a.sent();
                            return [2 /*return*/, dept];
                    }
                });
            });
        };
        OrgAdminService_1.prototype.updateDepartment = function (companyId, deptId, dto, adminUserId) {
            return __awaiter(this, void 0, void 0, function () {
                var existing, updated;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    return [2 /*return*/, tx.department.findFirst({
                                            where: { id: deptId, companyId: companyId },
                                        })];
                                });
                            }); })];
                        case 1:
                            existing = _a.sent();
                            if (!existing)
                                throw new common_1.NotFoundException("Department ".concat(deptId, " not found"));
                            return [4 /*yield*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.department.update({
                                                where: { id: deptId },
                                                data: dto,
                                            })];
                                    });
                                }); })];
                        case 2:
                            updated = _a.sent();
                            return [4 /*yield*/, this.audit.logEvent({
                                    action: 'admin:org:update_department',
                                    entity: 'Department',
                                    entityId: deptId,
                                    userId: adminUserId,
                                    companyId: companyId,
                                    details: { dto: dto },
                                })];
                        case 3:
                            _a.sent();
                            return [2 /*return*/, updated];
                    }
                });
            });
        };
        OrgAdminService_1.prototype.deleteDepartment = function (companyId, deptId, adminUserId) {
            return __awaiter(this, void 0, void 0, function () {
                var existing;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    return [2 /*return*/, tx.department.findFirst({
                                            where: { id: deptId, companyId: companyId },
                                        })];
                                });
                            }); })];
                        case 1:
                            existing = _a.sent();
                            if (!existing)
                                throw new common_1.NotFoundException("Department ".concat(deptId, " not found"));
                            return [4 /*yield*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                    return [2 /*return*/, tx.department.delete({ where: { id: deptId } })];
                                }); }); })];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, this.audit.logEvent({
                                    action: 'admin:org:delete_department',
                                    entity: 'Department',
                                    entityId: deptId,
                                    userId: adminUserId,
                                    companyId: companyId,
                                    details: { name: existing.name },
                                })];
                        case 3:
                            _a.sent();
                            return [2 /*return*/, { success: true }];
                    }
                });
            });
        };
        OrgAdminService_1.prototype.getTeams = function (companyId, departmentId) {
            return __awaiter(this, void 0, void 0, function () {
                var where;
                var _this = this;
                return __generator(this, function (_a) {
                    where = { companyId: companyId };
                    if (departmentId)
                        where.departmentId = departmentId;
                    return [2 /*return*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                return [2 /*return*/, tx.team.findMany({
                                        where: where,
                                        include: {
                                            department: { select: { id: true, name: true } },
                                            _count: { select: { users: true } },
                                        },
                                        orderBy: { name: 'asc' },
                                    })];
                            });
                        }); })];
                });
            });
        };
        OrgAdminService_1.prototype.createTeam = function (companyId, dto, adminUserId) {
            return __awaiter(this, void 0, void 0, function () {
                var existing, team;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    return [2 /*return*/, tx.team.findFirst({
                                            where: { companyId: companyId, name: dto.name },
                                        })];
                                });
                            }); })];
                        case 1:
                            existing = _a.sent();
                            if (existing)
                                throw new common_1.ConflictException("Team ".concat(dto.name, " already exists in tenant"));
                            return [4 /*yield*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.team.create({
                                                data: {
                                                    companyId: companyId,
                                                    name: dto.name,
                                                    description: dto.description,
                                                    departmentId: dto.departmentId,
                                                    leadId: dto.leadId,
                                                },
                                            })];
                                    });
                                }); })];
                        case 2:
                            team = _a.sent();
                            return [4 /*yield*/, this.audit.logEvent({
                                    action: 'admin:org:create_team',
                                    entity: 'Team',
                                    entityId: team.id,
                                    userId: adminUserId,
                                    companyId: companyId,
                                    details: { team: dto },
                                })];
                        case 3:
                            _a.sent();
                            return [2 /*return*/, team];
                    }
                });
            });
        };
        OrgAdminService_1.prototype.updateTeam = function (companyId, teamId, dto, adminUserId) {
            return __awaiter(this, void 0, void 0, function () {
                var existing, updated;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    return [2 /*return*/, tx.team.findFirst({
                                            where: { id: teamId, companyId: companyId },
                                        })];
                                });
                            }); })];
                        case 1:
                            existing = _a.sent();
                            if (!existing)
                                throw new common_1.NotFoundException("Team ".concat(teamId, " not found"));
                            return [4 /*yield*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.team.update({
                                                where: { id: teamId },
                                                data: dto,
                                            })];
                                    });
                                }); })];
                        case 2:
                            updated = _a.sent();
                            return [4 /*yield*/, this.audit.logEvent({
                                    action: 'admin:org:update_team',
                                    entity: 'Team',
                                    entityId: teamId,
                                    userId: adminUserId,
                                    companyId: companyId,
                                    details: { dto: dto },
                                })];
                        case 3:
                            _a.sent();
                            return [2 /*return*/, updated];
                    }
                });
            });
        };
        OrgAdminService_1.prototype.deleteTeam = function (companyId, teamId, adminUserId) {
            return __awaiter(this, void 0, void 0, function () {
                var existing;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    return [2 /*return*/, tx.team.findFirst({
                                            where: { id: teamId, companyId: companyId },
                                        })];
                                });
                            }); })];
                        case 1:
                            existing = _a.sent();
                            if (!existing)
                                throw new common_1.NotFoundException("Team ".concat(teamId, " not found"));
                            return [4 /*yield*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                    return [2 /*return*/, tx.team.delete({ where: { id: teamId } })];
                                }); }); })];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, this.audit.logEvent({
                                    action: 'admin:org:delete_team',
                                    entity: 'Team',
                                    entityId: teamId,
                                    userId: adminUserId,
                                    companyId: companyId,
                                    details: { name: existing.name },
                                })];
                        case 3:
                            _a.sent();
                            return [2 /*return*/, { success: true }];
                    }
                });
            });
        };
        OrgAdminService_1.prototype.getCostCenters = function (companyId) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                return [2 /*return*/, tx.costCenter.findMany({
                                        where: { companyId: companyId },
                                        include: { _count: { select: { users: true } } },
                                        orderBy: { code: 'asc' },
                                    })];
                            });
                        }); })];
                });
            });
        };
        OrgAdminService_1.prototype.createCostCenter = function (companyId, dto, adminUserId) {
            return __awaiter(this, void 0, void 0, function () {
                var existing, cc;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    return [2 /*return*/, tx.costCenter.findFirst({
                                            where: { companyId: companyId, code: dto.code },
                                        })];
                                });
                            }); })];
                        case 1:
                            existing = _a.sent();
                            if (existing)
                                throw new common_1.ConflictException("Cost center with code ".concat(dto.code, " already exists"));
                            return [4 /*yield*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    var _a, _b;
                                    return __generator(this, function (_c) {
                                        return [2 /*return*/, tx.costCenter.create({
                                                data: {
                                                    companyId: companyId,
                                                    code: dto.code,
                                                    name: dto.name,
                                                    budget: (_a = dto.budget) !== null && _a !== void 0 ? _a : 0,
                                                    currency: (_b = dto.currency) !== null && _b !== void 0 ? _b : 'USD',
                                                },
                                            })];
                                    });
                                }); })];
                        case 2:
                            cc = _a.sent();
                            return [4 /*yield*/, this.audit.logEvent({
                                    action: 'admin:org:create_cost_center',
                                    entity: 'CostCenter',
                                    entityId: cc.id,
                                    userId: adminUserId,
                                    companyId: companyId,
                                    details: { costCenter: dto },
                                })];
                        case 3:
                            _a.sent();
                            return [2 /*return*/, cc];
                    }
                });
            });
        };
        OrgAdminService_1.prototype.updateCostCenter = function (companyId, ccId, dto, adminUserId) {
            return __awaiter(this, void 0, void 0, function () {
                var existing, updated;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    return [2 /*return*/, tx.costCenter.findFirst({
                                            where: { id: ccId, companyId: companyId },
                                        })];
                                });
                            }); })];
                        case 1:
                            existing = _a.sent();
                            if (!existing)
                                throw new common_1.NotFoundException("Cost center ".concat(ccId, " not found"));
                            return [4 /*yield*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.costCenter.update({
                                                where: { id: ccId },
                                                data: dto,
                                            })];
                                    });
                                }); })];
                        case 2:
                            updated = _a.sent();
                            return [4 /*yield*/, this.audit.logEvent({
                                    action: 'admin:org:update_cost_center',
                                    entity: 'CostCenter',
                                    entityId: ccId,
                                    userId: adminUserId,
                                    companyId: companyId,
                                    details: { dto: dto },
                                })];
                        case 3:
                            _a.sent();
                            return [2 /*return*/, updated];
                    }
                });
            });
        };
        OrgAdminService_1.prototype.deleteCostCenter = function (companyId, ccId, adminUserId) {
            return __awaiter(this, void 0, void 0, function () {
                var existing;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    return [2 /*return*/, tx.costCenter.findFirst({
                                            where: { id: ccId, companyId: companyId },
                                        })];
                                });
                            }); })];
                        case 1:
                            existing = _a.sent();
                            if (!existing)
                                throw new common_1.NotFoundException("Cost center ".concat(ccId, " not found"));
                            return [4 /*yield*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                    return [2 /*return*/, tx.costCenter.delete({ where: { id: ccId } })];
                                }); }); })];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, this.audit.logEvent({
                                    action: 'admin:org:delete_cost_center',
                                    entity: 'CostCenter',
                                    entityId: ccId,
                                    userId: adminUserId,
                                    companyId: companyId,
                                    details: { code: existing.code },
                                })];
                        case 3:
                            _a.sent();
                            return [2 /*return*/, { success: true }];
                    }
                });
            });
        };
        return OrgAdminService_1;
    }());
    __setFunctionName(_classThis, "OrgAdminService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        OrgAdminService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return OrgAdminService = _classThis;
}();
exports.OrgAdminService = OrgAdminService;
