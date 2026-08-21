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
exports.DashboardAdminController = exports.SystemSettingsAdminController = exports.AuditAdminController = exports.ApiAdminController = exports.LicenseAdminController = exports.FeatureFlagAdminController = exports.SecurityPolicyAdminController = exports.RbacAdminController = exports.UserAdminController = exports.OrgAdminController = exports.TenantAdminController = void 0;
var common_1 = require("@nestjs/common");
var jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
var permissions_guard_1 = require("../../auth/guards/permissions.guard");
var permissions_decorator_1 = require("../../auth/decorators/permissions.decorator");
var swagger_1 = require("@nestjs/swagger");
// 1. Tenant Management Controller
var TenantAdminController = function () {
    var _classDecorators = [(0, swagger_1.ApiTags)('Enterprise Admin - Tenant Management'), (0, swagger_1.ApiBearerAuth)(), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard), (0, common_1.Controller)('admin/tenants')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _getTenants_decorators;
    var _getTenantById_decorators;
    var _updateStatus_decorators;
    var _updateBranding_decorators;
    var _updateRegional_decorators;
    var _updateBusinessHours_decorators;
    var TenantAdminController = _classThis = /** @class */ (function () {
        function TenantAdminController_1(service) {
            this.service = (__runInitializers(this, _instanceExtraInitializers), service);
        }
        TenantAdminController_1.prototype.getTenants = function (status) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.service.getTenants(status)];
                });
            });
        };
        TenantAdminController_1.prototype.getTenantById = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.service.getTenantById(id)];
                });
            });
        };
        TenantAdminController_1.prototype.updateStatus = function (id, dto, user) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.service.updateTenantStatus(id, dto, user.userId)];
                });
            });
        };
        TenantAdminController_1.prototype.updateBranding = function (id, dto, user) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.service.updateBranding(id, dto, user.userId)];
                });
            });
        };
        TenantAdminController_1.prototype.updateRegional = function (id, dto, user) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.service.updateRegional(id, dto, user.userId)];
                });
            });
        };
        TenantAdminController_1.prototype.updateBusinessHours = function (id, dto, user) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.service.updateBusinessHours(id, dto, user.userId)];
                });
            });
        };
        return TenantAdminController_1;
    }());
    __setFunctionName(_classThis, "TenantAdminController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _getTenants_decorators = [(0, common_1.Get)(), (0, permissions_decorator_1.RequirePermissions)('admin:tenant:read', 'admin:manage'), (0, swagger_1.ApiOperation)({ summary: 'List tenants with optional status filter' })];
        _getTenantById_decorators = [(0, common_1.Get)(':id'), (0, permissions_decorator_1.RequirePermissions)('admin:tenant:read', 'admin:manage'), (0, swagger_1.ApiOperation)({ summary: 'Get detailed tenant configuration and metrics' })];
        _updateStatus_decorators = [(0, common_1.Put)(':id/status'), (0, permissions_decorator_1.RequirePermissions)('admin:tenant:write', 'admin:manage'), (0, swagger_1.ApiOperation)({
                summary: 'Update tenant status (ACTIVE, SUSPENDED, PENDING, DELETED)',
            })];
        _updateBranding_decorators = [(0, common_1.Put)(':id/branding'), (0, permissions_decorator_1.RequirePermissions)('admin:tenant:write', 'admin:manage'), (0, swagger_1.ApiOperation)({ summary: 'Update tenant custom branding' })];
        _updateRegional_decorators = [(0, common_1.Put)(':id/regional'), (0, permissions_decorator_1.RequirePermissions)('admin:tenant:write', 'admin:manage'), (0, swagger_1.ApiOperation)({
                summary: 'Update tenant regional settings (timezone, currency)',
            })];
        _updateBusinessHours_decorators = [(0, common_1.Put)(':id/business-hours'), (0, permissions_decorator_1.RequirePermissions)('admin:tenant:write', 'admin:manage'), (0, swagger_1.ApiOperation)({ summary: 'Update tenant business hours' })];
        __esDecorate(_classThis, null, _getTenants_decorators, { kind: "method", name: "getTenants", static: false, private: false, access: { has: function (obj) { return "getTenants" in obj; }, get: function (obj) { return obj.getTenants; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getTenantById_decorators, { kind: "method", name: "getTenantById", static: false, private: false, access: { has: function (obj) { return "getTenantById" in obj; }, get: function (obj) { return obj.getTenantById; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _updateStatus_decorators, { kind: "method", name: "updateStatus", static: false, private: false, access: { has: function (obj) { return "updateStatus" in obj; }, get: function (obj) { return obj.updateStatus; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _updateBranding_decorators, { kind: "method", name: "updateBranding", static: false, private: false, access: { has: function (obj) { return "updateBranding" in obj; }, get: function (obj) { return obj.updateBranding; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _updateRegional_decorators, { kind: "method", name: "updateRegional", static: false, private: false, access: { has: function (obj) { return "updateRegional" in obj; }, get: function (obj) { return obj.updateRegional; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _updateBusinessHours_decorators, { kind: "method", name: "updateBusinessHours", static: false, private: false, access: { has: function (obj) { return "updateBusinessHours" in obj; }, get: function (obj) { return obj.updateBusinessHours; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        TenantAdminController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return TenantAdminController = _classThis;
}();
exports.TenantAdminController = TenantAdminController;
// 2. Organization Management Controller
var OrgAdminController = function () {
    var _classDecorators = [(0, swagger_1.ApiTags)('Enterprise Admin - Organization Management'), (0, swagger_1.ApiBearerAuth)(), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard), (0, common_1.Controller)('admin/org')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _getOverview_decorators;
    var _getDepartments_decorators;
    var _createDepartment_decorators;
    var _updateDepartment_decorators;
    var _deleteDepartment_decorators;
    var _getTeams_decorators;
    var _createTeam_decorators;
    var _updateTeam_decorators;
    var _deleteTeam_decorators;
    var _getCostCenters_decorators;
    var _createCostCenter_decorators;
    var _updateCostCenter_decorators;
    var _deleteCostCenter_decorators;
    var OrgAdminController = _classThis = /** @class */ (function () {
        function OrgAdminController_1(service) {
            this.service = (__runInitializers(this, _instanceExtraInitializers), service);
        }
        OrgAdminController_1.prototype.getOverview = function (user) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.service.getOrgOverview(user.companyId)];
                });
            });
        };
        // Departments
        OrgAdminController_1.prototype.getDepartments = function (user) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.service.getDepartments(user.companyId)];
                });
            });
        };
        OrgAdminController_1.prototype.createDepartment = function (dto, user) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.service.createDepartment(user.companyId, dto, user.userId)];
                });
            });
        };
        OrgAdminController_1.prototype.updateDepartment = function (id, dto, user) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.service.updateDepartment(user.companyId, id, dto, user.userId)];
                });
            });
        };
        OrgAdminController_1.prototype.deleteDepartment = function (id, user) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.service.deleteDepartment(user.companyId, id, user.userId)];
                });
            });
        };
        // Teams
        OrgAdminController_1.prototype.getTeams = function (departmentId_1) {
            return __awaiter(this, arguments, void 0, function (departmentId, user) {
                if (user === void 0) { user = {}; }
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.service.getTeams(user.companyId, departmentId)];
                });
            });
        };
        OrgAdminController_1.prototype.createTeam = function (dto, user) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.service.createTeam(user.companyId, dto, user.userId)];
                });
            });
        };
        OrgAdminController_1.prototype.updateTeam = function (id, dto, user) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.service.updateTeam(user.companyId, id, dto, user.userId)];
                });
            });
        };
        OrgAdminController_1.prototype.deleteTeam = function (id, user) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.service.deleteTeam(user.companyId, id, user.userId)];
                });
            });
        };
        // Cost Centers
        OrgAdminController_1.prototype.getCostCenters = function (user) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.service.getCostCenters(user.companyId)];
                });
            });
        };
        OrgAdminController_1.prototype.createCostCenter = function (dto, user) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.service.createCostCenter(user.companyId, dto, user.userId)];
                });
            });
        };
        OrgAdminController_1.prototype.updateCostCenter = function (id, dto, user) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.service.updateCostCenter(user.companyId, id, dto, user.userId)];
                });
            });
        };
        OrgAdminController_1.prototype.deleteCostCenter = function (id, user) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.service.deleteCostCenter(user.companyId, id, user.userId)];
                });
            });
        };
        return OrgAdminController_1;
    }());
    __setFunctionName(_classThis, "OrgAdminController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _getOverview_decorators = [(0, common_1.Get)('overview'), (0, permissions_decorator_1.RequirePermissions)('admin:org:read', 'admin:manage'), (0, swagger_1.ApiOperation)({ summary: 'Get organization hierarchy overview' })];
        _getDepartments_decorators = [(0, common_1.Get)('departments'), (0, permissions_decorator_1.RequirePermissions)('admin:org:read', 'admin:manage'), (0, swagger_1.ApiOperation)({ summary: 'List departments' })];
        _createDepartment_decorators = [(0, common_1.Post)('departments'), (0, permissions_decorator_1.RequirePermissions)('admin:org:write', 'admin:manage'), (0, swagger_1.ApiOperation)({ summary: 'Create a new department' })];
        _updateDepartment_decorators = [(0, common_1.Put)('departments/:id'), (0, permissions_decorator_1.RequirePermissions)('admin:org:write', 'admin:manage'), (0, swagger_1.ApiOperation)({ summary: 'Update department details' })];
        _deleteDepartment_decorators = [(0, common_1.Delete)('departments/:id'), (0, permissions_decorator_1.RequirePermissions)('admin:org:write', 'admin:manage'), (0, swagger_1.ApiOperation)({ summary: 'Delete department' })];
        _getTeams_decorators = [(0, common_1.Get)('teams'), (0, permissions_decorator_1.RequirePermissions)('admin:org:read', 'admin:manage'), (0, swagger_1.ApiOperation)({ summary: 'List teams with optional department filter' })];
        _createTeam_decorators = [(0, common_1.Post)('teams'), (0, permissions_decorator_1.RequirePermissions)('admin:org:write', 'admin:manage'), (0, swagger_1.ApiOperation)({ summary: 'Create a new team' })];
        _updateTeam_decorators = [(0, common_1.Put)('teams/:id'), (0, permissions_decorator_1.RequirePermissions)('admin:org:write', 'admin:manage'), (0, swagger_1.ApiOperation)({ summary: 'Update team details' })];
        _deleteTeam_decorators = [(0, common_1.Delete)('teams/:id'), (0, permissions_decorator_1.RequirePermissions)('admin:org:write', 'admin:manage'), (0, swagger_1.ApiOperation)({ summary: 'Delete team' })];
        _getCostCenters_decorators = [(0, common_1.Get)('cost-centers'), (0, permissions_decorator_1.RequirePermissions)('admin:org:read', 'admin:manage'), (0, swagger_1.ApiOperation)({ summary: 'List cost centers' })];
        _createCostCenter_decorators = [(0, common_1.Post)('cost-centers'), (0, permissions_decorator_1.RequirePermissions)('admin:org:write', 'admin:manage'), (0, swagger_1.ApiOperation)({ summary: 'Create a cost center' })];
        _updateCostCenter_decorators = [(0, common_1.Put)('cost-centers/:id'), (0, permissions_decorator_1.RequirePermissions)('admin:org:write', 'admin:manage'), (0, swagger_1.ApiOperation)({ summary: 'Update cost center' })];
        _deleteCostCenter_decorators = [(0, common_1.Delete)('cost-centers/:id'), (0, permissions_decorator_1.RequirePermissions)('admin:org:write', 'admin:manage'), (0, swagger_1.ApiOperation)({ summary: 'Delete cost center' })];
        __esDecorate(_classThis, null, _getOverview_decorators, { kind: "method", name: "getOverview", static: false, private: false, access: { has: function (obj) { return "getOverview" in obj; }, get: function (obj) { return obj.getOverview; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getDepartments_decorators, { kind: "method", name: "getDepartments", static: false, private: false, access: { has: function (obj) { return "getDepartments" in obj; }, get: function (obj) { return obj.getDepartments; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _createDepartment_decorators, { kind: "method", name: "createDepartment", static: false, private: false, access: { has: function (obj) { return "createDepartment" in obj; }, get: function (obj) { return obj.createDepartment; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _updateDepartment_decorators, { kind: "method", name: "updateDepartment", static: false, private: false, access: { has: function (obj) { return "updateDepartment" in obj; }, get: function (obj) { return obj.updateDepartment; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _deleteDepartment_decorators, { kind: "method", name: "deleteDepartment", static: false, private: false, access: { has: function (obj) { return "deleteDepartment" in obj; }, get: function (obj) { return obj.deleteDepartment; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getTeams_decorators, { kind: "method", name: "getTeams", static: false, private: false, access: { has: function (obj) { return "getTeams" in obj; }, get: function (obj) { return obj.getTeams; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _createTeam_decorators, { kind: "method", name: "createTeam", static: false, private: false, access: { has: function (obj) { return "createTeam" in obj; }, get: function (obj) { return obj.createTeam; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _updateTeam_decorators, { kind: "method", name: "updateTeam", static: false, private: false, access: { has: function (obj) { return "updateTeam" in obj; }, get: function (obj) { return obj.updateTeam; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _deleteTeam_decorators, { kind: "method", name: "deleteTeam", static: false, private: false, access: { has: function (obj) { return "deleteTeam" in obj; }, get: function (obj) { return obj.deleteTeam; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getCostCenters_decorators, { kind: "method", name: "getCostCenters", static: false, private: false, access: { has: function (obj) { return "getCostCenters" in obj; }, get: function (obj) { return obj.getCostCenters; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _createCostCenter_decorators, { kind: "method", name: "createCostCenter", static: false, private: false, access: { has: function (obj) { return "createCostCenter" in obj; }, get: function (obj) { return obj.createCostCenter; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _updateCostCenter_decorators, { kind: "method", name: "updateCostCenter", static: false, private: false, access: { has: function (obj) { return "updateCostCenter" in obj; }, get: function (obj) { return obj.updateCostCenter; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _deleteCostCenter_decorators, { kind: "method", name: "deleteCostCenter", static: false, private: false, access: { has: function (obj) { return "deleteCostCenter" in obj; }, get: function (obj) { return obj.deleteCostCenter; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        OrgAdminController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return OrgAdminController = _classThis;
}();
exports.OrgAdminController = OrgAdminController;
// 3. User Administration Controller
var UserAdminController = function () {
    var _classDecorators = [(0, swagger_1.ApiTags)('Enterprise Admin - User Administration'), (0, swagger_1.ApiBearerAuth)(), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard), (0, common_1.Controller)('admin/users')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _getUsers_decorators;
    var _inviteUser_decorators;
    var _bulkImport_decorators;
    var _exportUsers_decorators;
    var _suspendUser_decorators;
    var _activateUser_decorators;
    var _lockUser_decorators;
    var _unlockUser_decorators;
    var _forceLogout_decorators;
    var _forcePasswordReset_decorators;
    var _resetMfa_decorators;
    var UserAdminController = _classThis = /** @class */ (function () {
        function UserAdminController_1(service) {
            this.service = (__runInitializers(this, _instanceExtraInitializers), service);
        }
        UserAdminController_1.prototype.getUsers = function (status_1) {
            return __awaiter(this, arguments, void 0, function (status, user) {
                if (user === void 0) { user = {}; }
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.service.getUsers(user.companyId, status)];
                });
            });
        };
        UserAdminController_1.prototype.inviteUser = function (dto, user) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.service.inviteUser(user.companyId, dto, user.userId)];
                });
            });
        };
        UserAdminController_1.prototype.bulkImport = function (dto, user) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.service.bulkImportUsers(user.companyId, dto, user.userId)];
                });
            });
        };
        UserAdminController_1.prototype.exportUsers = function (user) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.service.exportUsers(user.companyId)];
                });
            });
        };
        UserAdminController_1.prototype.suspendUser = function (id, dto, user) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.service.suspendUser(user.companyId, id, dto, user.userId)];
                });
            });
        };
        UserAdminController_1.prototype.activateUser = function (id, user) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.service.activateUser(user.companyId, id, user.userId)];
                });
            });
        };
        UserAdminController_1.prototype.lockUser = function (id, dto, user) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.service.lockUser(user.companyId, id, dto, user.userId)];
                });
            });
        };
        UserAdminController_1.prototype.unlockUser = function (id, user) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.service.unlockUser(user.companyId, id, user.userId)];
                });
            });
        };
        UserAdminController_1.prototype.forceLogout = function (id, user) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.service.forceLogout(user.companyId, id, user.userId)];
                });
            });
        };
        UserAdminController_1.prototype.forcePasswordReset = function (id, user) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.service.forcePasswordReset(user.companyId, id, user.userId)];
                });
            });
        };
        UserAdminController_1.prototype.resetMfa = function (id, user) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.service.resetMfa(user.companyId, id, user.userId)];
                });
            });
        };
        return UserAdminController_1;
    }());
    __setFunctionName(_classThis, "UserAdminController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _getUsers_decorators = [(0, common_1.Get)(), (0, permissions_decorator_1.RequirePermissions)('users:read', 'admin:manage'), (0, swagger_1.ApiOperation)({ summary: 'List all tenant users with filtering' })];
        _inviteUser_decorators = [(0, common_1.Post)('invite'), (0, permissions_decorator_1.RequirePermissions)('users:create', 'admin:manage'), (0, swagger_1.ApiOperation)({ summary: 'Invite a user to the organization' })];
        _bulkImport_decorators = [(0, common_1.Post)('import'), (0, permissions_decorator_1.RequirePermissions)('users:create', 'admin:manage'), (0, swagger_1.ApiOperation)({ summary: 'Bulk import users' })];
        _exportUsers_decorators = [(0, common_1.Get)('export'), (0, permissions_decorator_1.RequirePermissions)('users:read', 'admin:manage'), (0, swagger_1.ApiOperation)({ summary: 'Export user directory' })];
        _suspendUser_decorators = [(0, common_1.Post)(':id/suspend'), (0, permissions_decorator_1.RequirePermissions)('users:suspend', 'admin:manage'), (0, swagger_1.ApiOperation)({ summary: 'Suspend a user account and revoke sessions' })];
        _activateUser_decorators = [(0, common_1.Post)(':id/activate'), (0, permissions_decorator_1.RequirePermissions)('users:update', 'admin:manage'), (0, swagger_1.ApiOperation)({ summary: 'Activate or restore a suspended/locked user' })];
        _lockUser_decorators = [(0, common_1.Post)(':id/lock'), (0, permissions_decorator_1.RequirePermissions)('users:lock', 'admin:manage'), (0, swagger_1.ApiOperation)({ summary: 'Manually lock user account' })];
        _unlockUser_decorators = [(0, common_1.Post)(':id/unlock'), (0, permissions_decorator_1.RequirePermissions)('users:update', 'admin:manage'), (0, swagger_1.ApiOperation)({ summary: 'Unlock user account' })];
        _forceLogout_decorators = [(0, common_1.Post)(':id/force-logout'), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, permissions_decorator_1.RequirePermissions)('users:update', 'admin:manage'), (0, swagger_1.ApiOperation)({
                summary: 'Revoke all refresh tokens and active sessions for a user',
            })];
        _forcePasswordReset_decorators = [(0, common_1.Post)(':id/force-password-reset'), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, permissions_decorator_1.RequirePermissions)('users:update', 'admin:manage'), (0, swagger_1.ApiOperation)({ summary: 'Force user to reset password on next login' })];
        _resetMfa_decorators = [(0, common_1.Post)(':id/reset-mfa'), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, permissions_decorator_1.RequirePermissions)('users:update', 'admin:manage'), (0, swagger_1.ApiOperation)({ summary: 'Reset and clear MFA methods for user' })];
        __esDecorate(_classThis, null, _getUsers_decorators, { kind: "method", name: "getUsers", static: false, private: false, access: { has: function (obj) { return "getUsers" in obj; }, get: function (obj) { return obj.getUsers; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _inviteUser_decorators, { kind: "method", name: "inviteUser", static: false, private: false, access: { has: function (obj) { return "inviteUser" in obj; }, get: function (obj) { return obj.inviteUser; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _bulkImport_decorators, { kind: "method", name: "bulkImport", static: false, private: false, access: { has: function (obj) { return "bulkImport" in obj; }, get: function (obj) { return obj.bulkImport; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _exportUsers_decorators, { kind: "method", name: "exportUsers", static: false, private: false, access: { has: function (obj) { return "exportUsers" in obj; }, get: function (obj) { return obj.exportUsers; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _suspendUser_decorators, { kind: "method", name: "suspendUser", static: false, private: false, access: { has: function (obj) { return "suspendUser" in obj; }, get: function (obj) { return obj.suspendUser; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _activateUser_decorators, { kind: "method", name: "activateUser", static: false, private: false, access: { has: function (obj) { return "activateUser" in obj; }, get: function (obj) { return obj.activateUser; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _lockUser_decorators, { kind: "method", name: "lockUser", static: false, private: false, access: { has: function (obj) { return "lockUser" in obj; }, get: function (obj) { return obj.lockUser; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _unlockUser_decorators, { kind: "method", name: "unlockUser", static: false, private: false, access: { has: function (obj) { return "unlockUser" in obj; }, get: function (obj) { return obj.unlockUser; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _forceLogout_decorators, { kind: "method", name: "forceLogout", static: false, private: false, access: { has: function (obj) { return "forceLogout" in obj; }, get: function (obj) { return obj.forceLogout; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _forcePasswordReset_decorators, { kind: "method", name: "forcePasswordReset", static: false, private: false, access: { has: function (obj) { return "forcePasswordReset" in obj; }, get: function (obj) { return obj.forcePasswordReset; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _resetMfa_decorators, { kind: "method", name: "resetMfa", static: false, private: false, access: { has: function (obj) { return "resetMfa" in obj; }, get: function (obj) { return obj.resetMfa; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        UserAdminController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return UserAdminController = _classThis;
}();
exports.UserAdminController = UserAdminController;
// 4. Enterprise RBAC Controller
var RbacAdminController = function () {
    var _classDecorators = [(0, swagger_1.ApiTags)('Enterprise Admin - RBAC'), (0, swagger_1.ApiBearerAuth)(), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard), (0, common_1.Controller)('admin/rbac')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _getPermissionGroups_decorators;
    var _getRoleTemplates_decorators;
    var _createFromTemplate_decorators;
    var _getRoles_decorators;
    var _getRoleById_decorators;
    var _updateRole_decorators;
    var _deleteRole_decorators;
    var _setDelegatedScope_decorators;
    var _grantTemporaryPermission_decorators;
    var _simulate_decorators;
    var RbacAdminController = _classThis = /** @class */ (function () {
        function RbacAdminController_1(service) {
            this.service = (__runInitializers(this, _instanceExtraInitializers), service);
        }
        RbacAdminController_1.prototype.getPermissionGroups = function () {
            return this.service.getPermissionGroups();
        };
        RbacAdminController_1.prototype.getRoleTemplates = function () {
            return this.service.getRoleTemplates();
        };
        RbacAdminController_1.prototype.createFromTemplate = function (dto, user) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.service.createRoleFromTemplate(user.companyId, dto, user.userId)];
                });
            });
        };
        RbacAdminController_1.prototype.getRoles = function (user) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.service.getRoles(user.companyId)];
                });
            });
        };
        RbacAdminController_1.prototype.getRoleById = function (id, user) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.service.getRoleById(user.companyId, id)];
                });
            });
        };
        RbacAdminController_1.prototype.updateRole = function (id, dto, user) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.service.updateRole(user.companyId, id, dto, user.userId)];
                });
            });
        };
        RbacAdminController_1.prototype.deleteRole = function (id, user) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.service.deleteRole(user.companyId, id, user.userId)];
                });
            });
        };
        RbacAdminController_1.prototype.setDelegatedScope = function (userId, scopes, user) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.service.setDelegatedScope(user.companyId, userId, scopes, user.userId)];
                });
            });
        };
        RbacAdminController_1.prototype.grantTemporaryPermission = function (userId, body, user) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.service.grantTemporaryPermission(user.companyId, userId, body.permission, body.expiresAt, user.userId)];
                });
            });
        };
        RbacAdminController_1.prototype.simulate = function (dto, user) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.service.simulatePermission(user.companyId, dto)];
                });
            });
        };
        return RbacAdminController_1;
    }());
    __setFunctionName(_classThis, "RbacAdminController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _getPermissionGroups_decorators = [(0, common_1.Get)('groups'), (0, permissions_decorator_1.RequirePermissions)('admin:rbac:read', 'admin:manage'), (0, swagger_1.ApiOperation)({ summary: 'Get system permission groups by domain' })];
        _getRoleTemplates_decorators = [(0, common_1.Get)('templates'), (0, permissions_decorator_1.RequirePermissions)('admin:rbac:read', 'admin:manage'), (0, swagger_1.ApiOperation)({ summary: 'Get standard role templates' })];
        _createFromTemplate_decorators = [(0, common_1.Post)('from-template'), (0, permissions_decorator_1.RequirePermissions)('admin:rbac:write', 'admin:manage'), (0, swagger_1.ApiOperation)({ summary: 'Create custom role from template' })];
        _getRoles_decorators = [(0, common_1.Get)('roles'), (0, permissions_decorator_1.RequirePermissions)('admin:rbac:read', 'admin:manage'), (0, swagger_1.ApiOperation)({ summary: 'List custom roles' })];
        _getRoleById_decorators = [(0, common_1.Get)('roles/:id'), (0, permissions_decorator_1.RequirePermissions)('admin:rbac:read', 'admin:manage'), (0, swagger_1.ApiOperation)({ summary: 'Get role by id' })];
        _updateRole_decorators = [(0, common_1.Put)('roles/:id'), (0, permissions_decorator_1.RequirePermissions)('admin:rbac:write', 'admin:manage'), (0, swagger_1.ApiOperation)({ summary: 'Update role' })];
        _deleteRole_decorators = [(0, common_1.Delete)('roles/:id'), (0, permissions_decorator_1.RequirePermissions)('admin:rbac:write', 'admin:manage'), (0, swagger_1.ApiOperation)({ summary: 'Delete role' })];
        _setDelegatedScope_decorators = [(0, common_1.Put)('delegated-scope/:userId'), (0, permissions_decorator_1.RequirePermissions)('admin:rbac:write', 'admin:manage'), (0, swagger_1.ApiOperation)({ summary: 'Set delegated administration scope for a user' })];
        _grantTemporaryPermission_decorators = [(0, common_1.Post)('temporary-permission/:userId'), (0, permissions_decorator_1.RequirePermissions)('admin:rbac:write', 'admin:manage'), (0, swagger_1.ApiOperation)({ summary: 'Grant time-bound temporary permission to user' })];
        _simulate_decorators = [(0, common_1.Post)('simulate'), (0, permissions_decorator_1.RequirePermissions)('admin:rbac:read', 'admin:manage'), (0, swagger_1.ApiOperation)({
                summary: 'Simulate effective permission for a user and action',
            })];
        __esDecorate(_classThis, null, _getPermissionGroups_decorators, { kind: "method", name: "getPermissionGroups", static: false, private: false, access: { has: function (obj) { return "getPermissionGroups" in obj; }, get: function (obj) { return obj.getPermissionGroups; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getRoleTemplates_decorators, { kind: "method", name: "getRoleTemplates", static: false, private: false, access: { has: function (obj) { return "getRoleTemplates" in obj; }, get: function (obj) { return obj.getRoleTemplates; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _createFromTemplate_decorators, { kind: "method", name: "createFromTemplate", static: false, private: false, access: { has: function (obj) { return "createFromTemplate" in obj; }, get: function (obj) { return obj.createFromTemplate; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getRoles_decorators, { kind: "method", name: "getRoles", static: false, private: false, access: { has: function (obj) { return "getRoles" in obj; }, get: function (obj) { return obj.getRoles; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getRoleById_decorators, { kind: "method", name: "getRoleById", static: false, private: false, access: { has: function (obj) { return "getRoleById" in obj; }, get: function (obj) { return obj.getRoleById; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _updateRole_decorators, { kind: "method", name: "updateRole", static: false, private: false, access: { has: function (obj) { return "updateRole" in obj; }, get: function (obj) { return obj.updateRole; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _deleteRole_decorators, { kind: "method", name: "deleteRole", static: false, private: false, access: { has: function (obj) { return "deleteRole" in obj; }, get: function (obj) { return obj.deleteRole; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _setDelegatedScope_decorators, { kind: "method", name: "setDelegatedScope", static: false, private: false, access: { has: function (obj) { return "setDelegatedScope" in obj; }, get: function (obj) { return obj.setDelegatedScope; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _grantTemporaryPermission_decorators, { kind: "method", name: "grantTemporaryPermission", static: false, private: false, access: { has: function (obj) { return "grantTemporaryPermission" in obj; }, get: function (obj) { return obj.grantTemporaryPermission; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _simulate_decorators, { kind: "method", name: "simulate", static: false, private: false, access: { has: function (obj) { return "simulate" in obj; }, get: function (obj) { return obj.simulate; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        RbacAdminController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return RbacAdminController = _classThis;
}();
exports.RbacAdminController = RbacAdminController;
// 5. Security Policies Controller
var SecurityPolicyAdminController = function () {
    var _classDecorators = [(0, swagger_1.ApiTags)('Enterprise Admin - Security Policies'), (0, swagger_1.ApiBearerAuth)(), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard), (0, common_1.Controller)('admin/security-policies')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _getPolicies_decorators;
    var _updatePolicies_decorators;
    var SecurityPolicyAdminController = _classThis = /** @class */ (function () {
        function SecurityPolicyAdminController_1(service) {
            this.service = (__runInitializers(this, _instanceExtraInitializers), service);
        }
        SecurityPolicyAdminController_1.prototype.getPolicies = function (user) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.service.getSecurityPolicies(user.companyId)];
                });
            });
        };
        SecurityPolicyAdminController_1.prototype.updatePolicies = function (dto, user) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.service.updateSecurityPolicies(user.companyId, dto, user.userId)];
                });
            });
        };
        return SecurityPolicyAdminController_1;
    }());
    __setFunctionName(_classThis, "SecurityPolicyAdminController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _getPolicies_decorators = [(0, common_1.Get)(), (0, permissions_decorator_1.RequirePermissions)('security:policies:read', 'admin:manage'), (0, swagger_1.ApiOperation)({ summary: 'Get active tenant security policies' })];
        _updatePolicies_decorators = [(0, common_1.Put)(), (0, permissions_decorator_1.RequirePermissions)('security:policies:write', 'admin:manage'), (0, swagger_1.ApiOperation)({ summary: 'Update tenant security policies' })];
        __esDecorate(_classThis, null, _getPolicies_decorators, { kind: "method", name: "getPolicies", static: false, private: false, access: { has: function (obj) { return "getPolicies" in obj; }, get: function (obj) { return obj.getPolicies; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _updatePolicies_decorators, { kind: "method", name: "updatePolicies", static: false, private: false, access: { has: function (obj) { return "updatePolicies" in obj; }, get: function (obj) { return obj.updatePolicies; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        SecurityPolicyAdminController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return SecurityPolicyAdminController = _classThis;
}();
exports.SecurityPolicyAdminController = SecurityPolicyAdminController;
// 6. Feature Flag Platform Controller
var FeatureFlagAdminController = function () {
    var _classDecorators = [(0, swagger_1.ApiTags)('Enterprise Admin - Feature Flags'), (0, swagger_1.ApiBearerAuth)(), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard), (0, common_1.Controller)('admin/feature-flags')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _getFlags_decorators;
    var _upsertFlag_decorators;
    var _updateFlag_decorators;
    var _triggerKillSwitch_decorators;
    var FeatureFlagAdminController = _classThis = /** @class */ (function () {
        function FeatureFlagAdminController_1(service) {
            this.service = (__runInitializers(this, _instanceExtraInitializers), service);
        }
        FeatureFlagAdminController_1.prototype.getFlags = function (user) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.service.getFlags(user.companyId)];
                });
            });
        };
        FeatureFlagAdminController_1.prototype.upsertFlag = function (dto, user) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.service.upsertFlag(user.companyId, dto, user.userId)];
                });
            });
        };
        FeatureFlagAdminController_1.prototype.updateFlag = function (id, dto, user) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.service.updateFlag(user.companyId, id, dto, user.userId)];
                });
            });
        };
        FeatureFlagAdminController_1.prototype.triggerKillSwitch = function (id, user) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.service.triggerKillSwitch(user.companyId, id, user.userId)];
                });
            });
        };
        return FeatureFlagAdminController_1;
    }());
    __setFunctionName(_classThis, "FeatureFlagAdminController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _getFlags_decorators = [(0, common_1.Get)(), (0, permissions_decorator_1.RequirePermissions)('admin:flags:read', 'admin:manage'), (0, swagger_1.ApiOperation)({ summary: 'Get all tenant and global feature flags' })];
        _upsertFlag_decorators = [(0, common_1.Post)(), (0, permissions_decorator_1.RequirePermissions)('admin:flags:write', 'admin:manage'), (0, swagger_1.ApiOperation)({
                summary: 'Create or update feature flag with percentage rollout',
            })];
        _updateFlag_decorators = [(0, common_1.Put)(':id'), (0, permissions_decorator_1.RequirePermissions)('admin:flags:write', 'admin:manage'), (0, swagger_1.ApiOperation)({ summary: 'Update feature flag rules and rollout' })];
        _triggerKillSwitch_decorators = [(0, common_1.Post)(':id/kill-switch'), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, permissions_decorator_1.RequirePermissions)('admin:flags:write', 'admin:manage'), (0, swagger_1.ApiOperation)({
                summary: 'Immediately disable feature flag via emergency kill switch',
            })];
        __esDecorate(_classThis, null, _getFlags_decorators, { kind: "method", name: "getFlags", static: false, private: false, access: { has: function (obj) { return "getFlags" in obj; }, get: function (obj) { return obj.getFlags; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _upsertFlag_decorators, { kind: "method", name: "upsertFlag", static: false, private: false, access: { has: function (obj) { return "upsertFlag" in obj; }, get: function (obj) { return obj.upsertFlag; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _updateFlag_decorators, { kind: "method", name: "updateFlag", static: false, private: false, access: { has: function (obj) { return "updateFlag" in obj; }, get: function (obj) { return obj.updateFlag; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _triggerKillSwitch_decorators, { kind: "method", name: "triggerKillSwitch", static: false, private: false, access: { has: function (obj) { return "triggerKillSwitch" in obj; }, get: function (obj) { return obj.triggerKillSwitch; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        FeatureFlagAdminController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return FeatureFlagAdminController = _classThis;
}();
exports.FeatureFlagAdminController = FeatureFlagAdminController;
// 7. License Management Controller
var LicenseAdminController = function () {
    var _classDecorators = [(0, swagger_1.ApiTags)('Enterprise Admin - License Management'), (0, swagger_1.ApiBearerAuth)(), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard), (0, common_1.Controller)('admin/licenses')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _getOverview_decorators;
    var _assignPlan_decorators;
    var _setTruckLimit_decorators;
    var _setDriverLimit_decorators;
    var _setBoost_decorators;
    var _setUnlimitedMode_decorators;
    var _listPlans_decorators;
    var _getUsage_decorators;
    var _listAllTenants_decorators;
    var LicenseAdminController = _classThis = /** @class */ (function () {
        function LicenseAdminController_1(service) {
            this.service = (__runInitializers(this, _instanceExtraInitializers), service);
        }
        LicenseAdminController_1.prototype.getOverview = function (user) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.service.getLicenseOverview(user.companyId)];
                });
            });
        };
        LicenseAdminController_1.prototype.assignPlan = function (dto, user) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.service.assignPlan(user.companyId, dto, user.userId)];
                });
            });
        };
        // ─── Truck Capacity Management (Enterprise Licensing Engine) ─────────────────
        LicenseAdminController_1.prototype.setTruckLimit = function (dto, user) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.service.setTruckLimit(user.companyId, dto, user.userId)];
                });
            });
        };
        LicenseAdminController_1.prototype.setDriverLimit = function (dto, user) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.service.setDriverLimit(user.companyId, dto, user.userId)];
                });
            });
        };
        LicenseAdminController_1.prototype.setBoost = function (dto, user) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.service.setBoost(user.companyId, dto, user.userId)];
                });
            });
        };
        LicenseAdminController_1.prototype.setUnlimitedMode = function (dto, user) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.service.setUnlimitedMode(user.companyId, dto, user.userId)];
                });
            });
        };
        LicenseAdminController_1.prototype.listPlans = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.service.listPlans()];
                });
            });
        };
        LicenseAdminController_1.prototype.getUsage = function (user) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.service.getUsageDashboard(user.companyId)];
                });
            });
        };
        LicenseAdminController_1.prototype.listAllTenants = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.service.listAllTenantsWithLicense()];
                });
            });
        };
        return LicenseAdminController_1;
    }());
    __setFunctionName(_classThis, "LicenseAdminController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _getOverview_decorators = [(0, common_1.Get)(), (0, permissions_decorator_1.RequirePermissions)('admin:license:read', 'admin:manage'), (0, swagger_1.ApiOperation)({
                summary: 'Get license overview, seat usage, quotas, capacity limits',
            })];
        _assignPlan_decorators = [(0, common_1.Put)('assign-plan'), (0, permissions_decorator_1.RequirePermissions)('admin:license:write', 'admin:manage'), (0, swagger_1.ApiOperation)({
                summary: 'Assign subscription plan — automatically sets default capacity limits',
            })];
        _setTruckLimit_decorators = [(0, common_1.Put)('trucks/limit'), (0, permissions_decorator_1.RequirePermissions)('admin:license:write', 'admin:manage'), (0, swagger_1.ApiOperation)({
                summary: 'Override truck/vehicle capacity limit instantly (no plan change required)',
            })];
        _setDriverLimit_decorators = [(0, common_1.Put)('drivers/limit'), (0, permissions_decorator_1.RequirePermissions)('admin:license:write', 'admin:manage'), (0, swagger_1.ApiOperation)({ summary: 'Override driver capacity limit' })];
        _setBoost_decorators = [(0, common_1.Put)('trucks/boost'), (0, permissions_decorator_1.RequirePermissions)('admin:license:write', 'admin:manage'), (0, swagger_1.ApiOperation)({
                summary: 'Set a temporary truck capacity boost with expiry date',
            })];
        _setUnlimitedMode_decorators = [(0, common_1.Put)('unlimited'), (0, permissions_decorator_1.RequirePermissions)('admin:license:write', 'admin:manage'), (0, swagger_1.ApiOperation)({
                summary: 'Enable or disable Unlimited Mode (bypasses all capacity checks)',
            })];
        _listPlans_decorators = [(0, common_1.Get)('plans'), (0, permissions_decorator_1.RequirePermissions)('admin:license:read', 'admin:manage'), (0, swagger_1.ApiOperation)({ summary: 'List all available subscription plans' })];
        _getUsage_decorators = [(0, common_1.Get)('usage'), (0, permissions_decorator_1.RequirePermissions)('admin:license:read', 'admin:manage'), (0, swagger_1.ApiOperation)({
                summary: 'Get real-time usage dashboard for the current tenant',
            })];
        _listAllTenants_decorators = [(0, common_1.Get)('tenants'), (0, permissions_decorator_1.RequirePermissions)('admin:super', 'admin:manage'), (0, swagger_1.ApiOperation)({
                summary: '[Super Admin] List all tenants with license summary',
            })];
        __esDecorate(_classThis, null, _getOverview_decorators, { kind: "method", name: "getOverview", static: false, private: false, access: { has: function (obj) { return "getOverview" in obj; }, get: function (obj) { return obj.getOverview; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _assignPlan_decorators, { kind: "method", name: "assignPlan", static: false, private: false, access: { has: function (obj) { return "assignPlan" in obj; }, get: function (obj) { return obj.assignPlan; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _setTruckLimit_decorators, { kind: "method", name: "setTruckLimit", static: false, private: false, access: { has: function (obj) { return "setTruckLimit" in obj; }, get: function (obj) { return obj.setTruckLimit; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _setDriverLimit_decorators, { kind: "method", name: "setDriverLimit", static: false, private: false, access: { has: function (obj) { return "setDriverLimit" in obj; }, get: function (obj) { return obj.setDriverLimit; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _setBoost_decorators, { kind: "method", name: "setBoost", static: false, private: false, access: { has: function (obj) { return "setBoost" in obj; }, get: function (obj) { return obj.setBoost; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _setUnlimitedMode_decorators, { kind: "method", name: "setUnlimitedMode", static: false, private: false, access: { has: function (obj) { return "setUnlimitedMode" in obj; }, get: function (obj) { return obj.setUnlimitedMode; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _listPlans_decorators, { kind: "method", name: "listPlans", static: false, private: false, access: { has: function (obj) { return "listPlans" in obj; }, get: function (obj) { return obj.listPlans; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getUsage_decorators, { kind: "method", name: "getUsage", static: false, private: false, access: { has: function (obj) { return "getUsage" in obj; }, get: function (obj) { return obj.getUsage; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _listAllTenants_decorators, { kind: "method", name: "listAllTenants", static: false, private: false, access: { has: function (obj) { return "listAllTenants" in obj; }, get: function (obj) { return obj.listAllTenants; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        LicenseAdminController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return LicenseAdminController = _classThis;
}();
exports.LicenseAdminController = LicenseAdminController;
// 8. API Administration Controller
var ApiAdminController = function () {
    var _classDecorators = [(0, swagger_1.ApiTags)('Enterprise Admin - API Administration'), (0, swagger_1.ApiBearerAuth)(), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard), (0, common_1.Controller)('admin/api-clients')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _getApiClients_decorators;
    var _createApiClient_decorators;
    var _revokeApiClient_decorators;
    var _getOAuthClients_decorators;
    var _getScopes_decorators;
    var _getWebhooks_decorators;
    var _createWebhook_decorators;
    var ApiAdminController = _classThis = /** @class */ (function () {
        function ApiAdminController_1(service) {
            this.service = (__runInitializers(this, _instanceExtraInitializers), service);
        }
        ApiAdminController_1.prototype.getApiClients = function (user) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.service.getApiClients(user.companyId)];
                });
            });
        };
        ApiAdminController_1.prototype.createApiClient = function (dto, user) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.service.createApiClient(user.companyId, dto, user.userId)];
                });
            });
        };
        ApiAdminController_1.prototype.revokeApiClient = function (id, user) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.service.revokeApiClient(user.companyId, id, user.userId)];
                });
            });
        };
        ApiAdminController_1.prototype.getOAuthClients = function (user) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.service.getOAuthClients(user.companyId)];
                });
            });
        };
        ApiAdminController_1.prototype.getScopes = function () {
            return this.service.getAvailableScopes();
        };
        ApiAdminController_1.prototype.getWebhooks = function (user) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.service.getWebhookEndpoints(user.companyId)];
                });
            });
        };
        ApiAdminController_1.prototype.createWebhook = function (dto, user) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.service.createWebhookSecret(user.companyId, dto, user.userId)];
                });
            });
        };
        return ApiAdminController_1;
    }());
    __setFunctionName(_classThis, "ApiAdminController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _getApiClients_decorators = [(0, common_1.Get)('keys'), (0, permissions_decorator_1.RequirePermissions)('admin:api:read', 'admin:manage'), (0, swagger_1.ApiOperation)({ summary: 'List API keys and rate limits' })];
        _createApiClient_decorators = [(0, common_1.Post)('keys'), (0, permissions_decorator_1.RequirePermissions)('admin:api:write', 'admin:manage'), (0, swagger_1.ApiOperation)({
                summary: 'Create API key with scopes and rate limit override',
            })];
        _revokeApiClient_decorators = [(0, common_1.Delete)('keys/:id'), (0, permissions_decorator_1.RequirePermissions)('admin:api:write', 'admin:manage'), (0, swagger_1.ApiOperation)({ summary: 'Revoke API key' })];
        _getOAuthClients_decorators = [(0, common_1.Get)('oauth-clients'), (0, permissions_decorator_1.RequirePermissions)('admin:api:read', 'admin:manage'), (0, swagger_1.ApiOperation)({ summary: 'List OAuth 2.0 applications' })];
        _getScopes_decorators = [(0, common_1.Get)('scopes'), (0, permissions_decorator_1.RequirePermissions)('admin:api:read', 'admin:manage'), (0, swagger_1.ApiOperation)({ summary: 'List available API permissions and scopes' })];
        _getWebhooks_decorators = [(0, common_1.Get)('webhooks'), (0, permissions_decorator_1.RequirePermissions)('admin:api:read', 'admin:manage'), (0, swagger_1.ApiOperation)({ summary: 'List webhook endpoints' })];
        _createWebhook_decorators = [(0, common_1.Post)('webhooks'), (0, permissions_decorator_1.RequirePermissions)('admin:api:write', 'admin:manage'), (0, swagger_1.ApiOperation)({ summary: 'Create webhook endpoint and signing secret' })];
        __esDecorate(_classThis, null, _getApiClients_decorators, { kind: "method", name: "getApiClients", static: false, private: false, access: { has: function (obj) { return "getApiClients" in obj; }, get: function (obj) { return obj.getApiClients; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _createApiClient_decorators, { kind: "method", name: "createApiClient", static: false, private: false, access: { has: function (obj) { return "createApiClient" in obj; }, get: function (obj) { return obj.createApiClient; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _revokeApiClient_decorators, { kind: "method", name: "revokeApiClient", static: false, private: false, access: { has: function (obj) { return "revokeApiClient" in obj; }, get: function (obj) { return obj.revokeApiClient; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getOAuthClients_decorators, { kind: "method", name: "getOAuthClients", static: false, private: false, access: { has: function (obj) { return "getOAuthClients" in obj; }, get: function (obj) { return obj.getOAuthClients; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getScopes_decorators, { kind: "method", name: "getScopes", static: false, private: false, access: { has: function (obj) { return "getScopes" in obj; }, get: function (obj) { return obj.getScopes; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getWebhooks_decorators, { kind: "method", name: "getWebhooks", static: false, private: false, access: { has: function (obj) { return "getWebhooks" in obj; }, get: function (obj) { return obj.getWebhooks; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _createWebhook_decorators, { kind: "method", name: "createWebhook", static: false, private: false, access: { has: function (obj) { return "createWebhook" in obj; }, get: function (obj) { return obj.createWebhook; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ApiAdminController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ApiAdminController = _classThis;
}();
exports.ApiAdminController = ApiAdminController;
// 9. Audit Center Controller
var AuditAdminController = function () {
    var _classDecorators = [(0, swagger_1.ApiTags)('Enterprise Admin - Audit Center'), (0, swagger_1.ApiBearerAuth)(), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard), (0, common_1.Controller)('admin/audit')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _queryTimeline_decorators;
    var _getUserTimeline_decorators;
    var _getSecurityEvents_decorators;
    var _getComplianceReport_decorators;
    var _getRetentionPolicy_decorators;
    var _updateRetentionPolicy_decorators;
    var _purgeExpired_decorators;
    var AuditAdminController = _classThis = /** @class */ (function () {
        function AuditAdminController_1(service) {
            this.service = (__runInitializers(this, _instanceExtraInitializers), service);
        }
        AuditAdminController_1.prototype.queryTimeline = function (dto, user) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.service.queryAuditLogs(user.companyId, dto, false)];
                });
            });
        };
        AuditAdminController_1.prototype.getUserTimeline = function (userId_1) {
            return __awaiter(this, arguments, void 0, function (userId, page, limit, user) {
                if (page === void 0) { page = 1; }
                if (limit === void 0) { limit = 50; }
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.service.getUserTimeline(user.companyId, userId, Number(page), Number(limit))];
                });
            });
        };
        AuditAdminController_1.prototype.getSecurityEvents = function () {
            return __awaiter(this, arguments, void 0, function (page, limit, user) {
                if (page === void 0) { page = 1; }
                if (limit === void 0) { limit = 50; }
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.service.getSecurityEvents(user.companyId, Number(page), Number(limit))];
                });
            });
        };
        AuditAdminController_1.prototype.getComplianceReport = function (user) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.service.getComplianceReport(user.companyId)];
                });
            });
        };
        AuditAdminController_1.prototype.getRetentionPolicy = function (user) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.service.getRetentionPolicy(user.companyId)];
                });
            });
        };
        AuditAdminController_1.prototype.updateRetentionPolicy = function (dto, user) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.service.updateRetentionPolicy(user.companyId, dto, user.userId)];
                });
            });
        };
        AuditAdminController_1.prototype.purgeExpired = function (user) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.service.purgeExpiredLogs(user.companyId, user.userId)];
                });
            });
        };
        return AuditAdminController_1;
    }());
    __setFunctionName(_classThis, "AuditAdminController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _queryTimeline_decorators = [(0, common_1.Get)('timeline'), (0, permissions_decorator_1.RequirePermissions)('admin:audit:read', 'admin:manage'), (0, swagger_1.ApiOperation)({ summary: 'Query global/tenant audit timeline' })];
        _getUserTimeline_decorators = [(0, common_1.Get)('user-timeline/:userId'), (0, permissions_decorator_1.RequirePermissions)('admin:audit:read', 'admin:manage'), (0, swagger_1.ApiOperation)({ summary: 'Query audit history for a specific user' })];
        _getSecurityEvents_decorators = [(0, common_1.Get)('security-events'), (0, permissions_decorator_1.RequirePermissions)('admin:audit:read', 'admin:manage'), (0, swagger_1.ApiOperation)({ summary: 'Query security-specific audit logs' })];
        _getComplianceReport_decorators = [(0, common_1.Get)('compliance-report'), (0, permissions_decorator_1.RequirePermissions)('admin:audit:read', 'admin:manage'), (0, swagger_1.ApiOperation)({ summary: 'Generate 30-day compliance report' })];
        _getRetentionPolicy_decorators = [(0, common_1.Get)('retention'), (0, permissions_decorator_1.RequirePermissions)('admin:audit:read', 'admin:manage'), (0, swagger_1.ApiOperation)({ summary: 'Get audit retention policy' })];
        _updateRetentionPolicy_decorators = [(0, common_1.Put)('retention'), (0, permissions_decorator_1.RequirePermissions)('admin:audit:write', 'admin:manage'), (0, swagger_1.ApiOperation)({ summary: 'Update audit retention days' })];
        _purgeExpired_decorators = [(0, common_1.Post)('purge'), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, permissions_decorator_1.RequirePermissions)('admin:audit:write', 'admin:manage'), (0, swagger_1.ApiOperation)({
                summary: 'Manually purge expired audit logs beyond retention window',
            })];
        __esDecorate(_classThis, null, _queryTimeline_decorators, { kind: "method", name: "queryTimeline", static: false, private: false, access: { has: function (obj) { return "queryTimeline" in obj; }, get: function (obj) { return obj.queryTimeline; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getUserTimeline_decorators, { kind: "method", name: "getUserTimeline", static: false, private: false, access: { has: function (obj) { return "getUserTimeline" in obj; }, get: function (obj) { return obj.getUserTimeline; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getSecurityEvents_decorators, { kind: "method", name: "getSecurityEvents", static: false, private: false, access: { has: function (obj) { return "getSecurityEvents" in obj; }, get: function (obj) { return obj.getSecurityEvents; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getComplianceReport_decorators, { kind: "method", name: "getComplianceReport", static: false, private: false, access: { has: function (obj) { return "getComplianceReport" in obj; }, get: function (obj) { return obj.getComplianceReport; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getRetentionPolicy_decorators, { kind: "method", name: "getRetentionPolicy", static: false, private: false, access: { has: function (obj) { return "getRetentionPolicy" in obj; }, get: function (obj) { return obj.getRetentionPolicy; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _updateRetentionPolicy_decorators, { kind: "method", name: "updateRetentionPolicy", static: false, private: false, access: { has: function (obj) { return "updateRetentionPolicy" in obj; }, get: function (obj) { return obj.updateRetentionPolicy; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _purgeExpired_decorators, { kind: "method", name: "purgeExpired", static: false, private: false, access: { has: function (obj) { return "purgeExpired" in obj; }, get: function (obj) { return obj.purgeExpired; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AuditAdminController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AuditAdminController = _classThis;
}();
exports.AuditAdminController = AuditAdminController;
// 10. System Settings Controller
var SystemSettingsAdminController = function () {
    var _classDecorators = [(0, swagger_1.ApiTags)('Enterprise Admin - System Settings'), (0, swagger_1.ApiBearerAuth)(), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard), (0, common_1.Controller)('admin/system-settings')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _getSettings_decorators;
    var _updateSmtp_decorators;
    var _updateStorage_decorators;
    var _updateQueue_decorators;
    var _updateRedis_decorators;
    var _updateCdn_decorators;
    var _updateMaintenance_decorators;
    var SystemSettingsAdminController = _classThis = /** @class */ (function () {
        function SystemSettingsAdminController_1(service) {
            this.service = (__runInitializers(this, _instanceExtraInitializers), service);
        }
        SystemSettingsAdminController_1.prototype.getSettings = function (user) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.service.getSystemSettings(user.companyId)];
                });
            });
        };
        SystemSettingsAdminController_1.prototype.updateSmtp = function (dto, user) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.service.updateSmtp(user.companyId, dto, user.userId)];
                });
            });
        };
        SystemSettingsAdminController_1.prototype.updateStorage = function (dto, user) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.service.updateStorage(user.companyId, dto, user.userId)];
                });
            });
        };
        SystemSettingsAdminController_1.prototype.updateQueue = function (dto, user) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.service.updateQueue(user.companyId, dto, user.userId)];
                });
            });
        };
        SystemSettingsAdminController_1.prototype.updateRedis = function (dto, user) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.service.updateRedis(user.companyId, dto, user.userId)];
                });
            });
        };
        SystemSettingsAdminController_1.prototype.updateCdn = function (dto, user) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.service.updateCdn(user.companyId, dto, user.userId)];
                });
            });
        };
        SystemSettingsAdminController_1.prototype.updateMaintenance = function (dto, user) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.service.updateMaintenanceMode(user.companyId, dto, user.userId)];
                });
            });
        };
        return SystemSettingsAdminController_1;
    }());
    __setFunctionName(_classThis, "SystemSettingsAdminController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _getSettings_decorators = [(0, common_1.Get)(), (0, permissions_decorator_1.RequirePermissions)('admin:system:read', 'admin:manage'), (0, swagger_1.ApiOperation)({ summary: 'Get system infrastructure settings' })];
        _updateSmtp_decorators = [(0, common_1.Put)('smtp'), (0, permissions_decorator_1.RequirePermissions)('admin:system:write', 'admin:manage'), (0, swagger_1.ApiOperation)({ summary: 'Update SMTP configurations' })];
        _updateStorage_decorators = [(0, common_1.Put)('storage'), (0, permissions_decorator_1.RequirePermissions)('admin:system:write', 'admin:manage'), (0, swagger_1.ApiOperation)({ summary: 'Update S3/storage configurations' })];
        _updateQueue_decorators = [(0, common_1.Put)('queue'), (0, permissions_decorator_1.RequirePermissions)('admin:system:write', 'admin:manage'), (0, swagger_1.ApiOperation)({ summary: 'Update background job queue settings' })];
        _updateRedis_decorators = [(0, common_1.Put)('redis'), (0, permissions_decorator_1.RequirePermissions)('admin:system:write', 'admin:manage'), (0, swagger_1.ApiOperation)({ summary: 'Update Redis cache configurations' })];
        _updateCdn_decorators = [(0, common_1.Put)('cdn'), (0, permissions_decorator_1.RequirePermissions)('admin:system:write', 'admin:manage'), (0, swagger_1.ApiOperation)({ summary: 'Update CDN settings' })];
        _updateMaintenance_decorators = [(0, common_1.Put)('maintenance'), (0, permissions_decorator_1.RequirePermissions)('admin:system:write', 'admin:manage'), (0, swagger_1.ApiOperation)({ summary: 'Toggle system maintenance mode' })];
        __esDecorate(_classThis, null, _getSettings_decorators, { kind: "method", name: "getSettings", static: false, private: false, access: { has: function (obj) { return "getSettings" in obj; }, get: function (obj) { return obj.getSettings; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _updateSmtp_decorators, { kind: "method", name: "updateSmtp", static: false, private: false, access: { has: function (obj) { return "updateSmtp" in obj; }, get: function (obj) { return obj.updateSmtp; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _updateStorage_decorators, { kind: "method", name: "updateStorage", static: false, private: false, access: { has: function (obj) { return "updateStorage" in obj; }, get: function (obj) { return obj.updateStorage; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _updateQueue_decorators, { kind: "method", name: "updateQueue", static: false, private: false, access: { has: function (obj) { return "updateQueue" in obj; }, get: function (obj) { return obj.updateQueue; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _updateRedis_decorators, { kind: "method", name: "updateRedis", static: false, private: false, access: { has: function (obj) { return "updateRedis" in obj; }, get: function (obj) { return obj.updateRedis; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _updateCdn_decorators, { kind: "method", name: "updateCdn", static: false, private: false, access: { has: function (obj) { return "updateCdn" in obj; }, get: function (obj) { return obj.updateCdn; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _updateMaintenance_decorators, { kind: "method", name: "updateMaintenance", static: false, private: false, access: { has: function (obj) { return "updateMaintenance" in obj; }, get: function (obj) { return obj.updateMaintenance; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        SystemSettingsAdminController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return SystemSettingsAdminController = _classThis;
}();
exports.SystemSettingsAdminController = SystemSettingsAdminController;
// 11. Enterprise Admin Dashboard Controller
var DashboardAdminController = function () {
    var _classDecorators = [(0, swagger_1.ApiTags)('Enterprise Admin - Dashboard'), (0, swagger_1.ApiBearerAuth)(), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard), (0, common_1.Controller)('admin/dashboard')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _getDashboard_decorators;
    var DashboardAdminController = _classThis = /** @class */ (function () {
        function DashboardAdminController_1(service) {
            this.service = (__runInitializers(this, _instanceExtraInitializers), service);
        }
        DashboardAdminController_1.prototype.getDashboard = function (user) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.service.getDashboardSummary(user.companyId, false)];
                });
            });
        };
        return DashboardAdminController_1;
    }());
    __setFunctionName(_classThis, "DashboardAdminController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _getDashboard_decorators = [(0, common_1.Get)(), (0, permissions_decorator_1.RequirePermissions)('admin:dashboard:read', 'admin:manage'), (0, swagger_1.ApiOperation)({
                summary: 'Get comprehensive enterprise admin dashboard metrics and security score',
            })];
        __esDecorate(_classThis, null, _getDashboard_decorators, { kind: "method", name: "getDashboard", static: false, private: false, access: { has: function (obj) { return "getDashboard" in obj; }, get: function (obj) { return obj.getDashboard; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        DashboardAdminController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return DashboardAdminController = _classThis;
}();
exports.DashboardAdminController = DashboardAdminController;
