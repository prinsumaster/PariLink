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
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlanningController = void 0;
var common_1 = require("@nestjs/common");
var swagger_1 = require("@nestjs/swagger");
var class_validator_1 = require("class-validator");
var jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
var permissions_guard_1 = require("../../auth/guards/permissions.guard");
var permissions_decorator_1 = require("../../auth/decorators/permissions.decorator");
var CreatePlanDto = function () {
    var _a;
    var _loadId_decorators;
    var _loadId_initializers = [];
    var _loadId_extraInitializers = [];
    return _a = /** @class */ (function () {
            function CreatePlanDto() {
                this.loadId = __runInitializers(this, _loadId_initializers, void 0);
                __runInitializers(this, _loadId_extraInitializers);
            }
            return CreatePlanDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _loadId_decorators = [(0, class_validator_1.IsUUID)()];
            __esDecorate(null, null, _loadId_decorators, { kind: "field", name: "loadId", static: false, private: false, access: { has: function (obj) { return "loadId" in obj; }, get: function (obj) { return obj.loadId; }, set: function (obj, value) { obj.loadId = value; } }, metadata: _metadata }, _loadId_initializers, _loadId_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
var AssignPlanDto = function () {
    var _a;
    var _candidateId_decorators;
    var _candidateId_initializers = [];
    var _candidateId_extraInitializers = [];
    var _overrideReason_decorators;
    var _overrideReason_initializers = [];
    var _overrideReason_extraInitializers = [];
    return _a = /** @class */ (function () {
            function AssignPlanDto() {
                this.candidateId = __runInitializers(this, _candidateId_initializers, void 0);
                this.overrideReason = (__runInitializers(this, _candidateId_extraInitializers), __runInitializers(this, _overrideReason_initializers, void 0));
                __runInitializers(this, _overrideReason_extraInitializers);
            }
            return AssignPlanDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _candidateId_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsUUID)()];
            _overrideReason_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            __esDecorate(null, null, _candidateId_decorators, { kind: "field", name: "candidateId", static: false, private: false, access: { has: function (obj) { return "candidateId" in obj; }, get: function (obj) { return obj.candidateId; }, set: function (obj, value) { obj.candidateId = value; } }, metadata: _metadata }, _candidateId_initializers, _candidateId_extraInitializers);
            __esDecorate(null, null, _overrideReason_decorators, { kind: "field", name: "overrideReason", static: false, private: false, access: { has: function (obj) { return "overrideReason" in obj; }, get: function (obj) { return obj.overrideReason; }, set: function (obj, value) { obj.overrideReason = value; } }, metadata: _metadata }, _overrideReason_initializers, _overrideReason_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
var RejectDriverDto = function () {
    var _a;
    var _driverId_decorators;
    var _driverId_initializers = [];
    var _driverId_extraInitializers = [];
    var _reason_decorators;
    var _reason_initializers = [];
    var _reason_extraInitializers = [];
    return _a = /** @class */ (function () {
            function RejectDriverDto() {
                this.driverId = __runInitializers(this, _driverId_initializers, void 0);
                this.reason = (__runInitializers(this, _driverId_extraInitializers), __runInitializers(this, _reason_initializers, void 0));
                __runInitializers(this, _reason_extraInitializers);
            }
            return RejectDriverDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _driverId_decorators = [(0, class_validator_1.IsUUID)()];
            _reason_decorators = [(0, class_validator_1.IsString)()];
            __esDecorate(null, null, _driverId_decorators, { kind: "field", name: "driverId", static: false, private: false, access: { has: function (obj) { return "driverId" in obj; }, get: function (obj) { return obj.driverId; }, set: function (obj, value) { obj.driverId = value; } }, metadata: _metadata }, _driverId_initializers, _driverId_extraInitializers);
            __esDecorate(null, null, _reason_decorators, { kind: "field", name: "reason", static: false, private: false, access: { has: function (obj) { return "reason" in obj; }, get: function (obj) { return obj.reason; }, set: function (obj, value) { obj.reason = value; } }, metadata: _metadata }, _reason_initializers, _reason_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
var PlanningController = function () {
    var _classDecorators = [(0, swagger_1.ApiTags)('dispatch/planning'), (0, swagger_1.ApiBearerAuth)(), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard), (0, common_1.Controller)('dispatch/plans')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _createPlan_decorators;
    var _generateCandidates_decorators;
    var _assign_decorators;
    var _cancel_decorators;
    var _listPlans_decorators;
    var _getKpis_decorators;
    var _getPlan_decorators;
    var _driverRejection_decorators;
    var PlanningController = _classThis = /** @class */ (function () {
        function PlanningController_1(planning, exceptions, promises, kpi) {
            this.planning = (__runInitializers(this, _instanceExtraInitializers), planning);
            this.exceptions = exceptions;
            this.promises = promises;
            this.kpi = kpi;
        }
        // ── Planning ───────────────────────────────────────────────
        PlanningController_1.prototype.createPlan = function (user, dto) {
            return this.planning.createPlan(user.companyId, dto.loadId, user.userId);
        };
        PlanningController_1.prototype.generateCandidates = function (user, planId) {
            return this.planning.generateCandidates(user.companyId, planId);
        };
        PlanningController_1.prototype.assign = function (user, planId, dto) {
            return this.planning.assign(user.companyId, planId, user.userId, dto.candidateId, dto.overrideReason);
        };
        PlanningController_1.prototype.cancel = function (user, planId, body) {
            return this.planning.cancel(user.companyId, planId, body.reason, user.userId);
        };
        PlanningController_1.prototype.listPlans = function (user, status) {
            return this.planning.listPlans(user.companyId, status);
        };
        PlanningController_1.prototype.getKpis = function (user) {
            return this.kpi.getKpis(user.companyId);
        };
        PlanningController_1.prototype.getPlan = function (user, planId) {
            return this.planning.getPlan(user.companyId, planId);
        };
        // ── Exception Console ────────────────────────────────────
        PlanningController_1.prototype.driverRejection = function (user, planId, dto) {
            return this.exceptions.handleDriverRejection(user.companyId, planId, dto.driverId, dto.reason);
        };
        return PlanningController_1;
    }());
    __setFunctionName(_classThis, "PlanningController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _createPlan_decorators = [(0, common_1.Post)(), (0, permissions_decorator_1.RequirePermissions)('dispatch:write'), (0, swagger_1.ApiOperation)({ summary: 'Create a dispatch plan for a load' })];
        _generateCandidates_decorators = [(0, common_1.Post)(':planId/candidates'), (0, permissions_decorator_1.RequirePermissions)('dispatch:write'), (0, swagger_1.ApiOperation)({ summary: 'Run candidate generation and scoring for a plan' })];
        _assign_decorators = [(0, common_1.Post)(':planId/assign'), (0, permissions_decorator_1.RequirePermissions)('dispatch:write'), (0, swagger_1.ApiOperation)({
                summary: 'Execute the assignment — reserves resources and creates a Trip',
            })];
        _cancel_decorators = [(0, common_1.Post)(':planId/cancel'), (0, permissions_decorator_1.RequirePermissions)('dispatch:write'), (0, swagger_1.ApiOperation)({ summary: 'Cancel a dispatch plan' })];
        _listPlans_decorators = [(0, common_1.Get)(), (0, permissions_decorator_1.RequirePermissions)('dispatch:read'), (0, swagger_1.ApiOperation)({
                summary: 'List all dispatch plans (optionally filtered by status)',
            })];
        _getKpis_decorators = [(0, common_1.Get)('kpi'), (0, permissions_decorator_1.RequirePermissions)('dispatch:read'), (0, swagger_1.ApiOperation)({ summary: 'Get Dispatch KPIs' })];
        _getPlan_decorators = [(0, common_1.Get)(':planId'), (0, permissions_decorator_1.RequirePermissions)('dispatch:read'), (0, swagger_1.ApiOperation)({
                summary: 'Get full plan detail with candidates and violations',
            })];
        _driverRejection_decorators = [(0, common_1.Post)(':planId/exceptions/driver-rejection'), (0, permissions_decorator_1.RequirePermissions)('dispatch:write'), (0, swagger_1.ApiOperation)({
                summary: 'Register a driver rejection and auto-recommend next candidate',
            })];
        __esDecorate(_classThis, null, _createPlan_decorators, { kind: "method", name: "createPlan", static: false, private: false, access: { has: function (obj) { return "createPlan" in obj; }, get: function (obj) { return obj.createPlan; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _generateCandidates_decorators, { kind: "method", name: "generateCandidates", static: false, private: false, access: { has: function (obj) { return "generateCandidates" in obj; }, get: function (obj) { return obj.generateCandidates; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _assign_decorators, { kind: "method", name: "assign", static: false, private: false, access: { has: function (obj) { return "assign" in obj; }, get: function (obj) { return obj.assign; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _cancel_decorators, { kind: "method", name: "cancel", static: false, private: false, access: { has: function (obj) { return "cancel" in obj; }, get: function (obj) { return obj.cancel; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _listPlans_decorators, { kind: "method", name: "listPlans", static: false, private: false, access: { has: function (obj) { return "listPlans" in obj; }, get: function (obj) { return obj.listPlans; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getKpis_decorators, { kind: "method", name: "getKpis", static: false, private: false, access: { has: function (obj) { return "getKpis" in obj; }, get: function (obj) { return obj.getKpis; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getPlan_decorators, { kind: "method", name: "getPlan", static: false, private: false, access: { has: function (obj) { return "getPlan" in obj; }, get: function (obj) { return obj.getPlan; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _driverRejection_decorators, { kind: "method", name: "driverRejection", static: false, private: false, access: { has: function (obj) { return "driverRejection" in obj; }, get: function (obj) { return obj.driverRejection; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        PlanningController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return PlanningController = _classThis;
}();
exports.PlanningController = PlanningController;
