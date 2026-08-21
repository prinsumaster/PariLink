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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SetUnlimitedModeDto = exports.SetBoostDto = exports.SetDriverLimitDto = exports.SetTruckLimitDto = exports.UpdateMaintenanceModeDto = exports.UpdateCdnSettingsDto = exports.UpdateRedisSettingsDto = exports.UpdateQueueSettingsDto = exports.UpdateStorageSettingsDto = exports.UpdateSmtpSettingsDto = exports.AuditRetentionPolicyDto = exports.AuditQueryDto = exports.CreateWebhookSecretDto = exports.CreateApiClientDto = exports.AssignPlanDto = exports.UpdateEnterpriseFlagDto = exports.CreateEnterpriseFlagDto = exports.UpdateSecurityPolicyDto = exports.SimulatePermissionDto = exports.CreateRoleTemplateDto = exports.CreatePermissionGroupDto = exports.UserStatusActionDto = exports.BulkUserImportDto = exports.InviteUserDto = exports.UpdateCostCenterDto = exports.CreateCostCenterDto = exports.UpdateTeamDto = exports.CreateTeamDto = exports.UpdateDepartmentDto = exports.CreateDepartmentDto = exports.UpdateTenantStatusDto = exports.UpdateTenantBusinessHoursDto = exports.UpdateTenantRegionalDto = exports.UpdateTenantBrandingDto = void 0;
var class_validator_1 = require("class-validator");
var class_transformer_1 = require("class-transformer");
var swagger_1 = require("@nestjs/swagger");
// 1. Tenant Management DTOs
var UpdateTenantBrandingDto = function () {
    var _a;
    var _logoUrl_decorators;
    var _logoUrl_initializers = [];
    var _logoUrl_extraInitializers = [];
    var _primaryColor_decorators;
    var _primaryColor_initializers = [];
    var _primaryColor_extraInitializers = [];
    var _secondaryColor_decorators;
    var _secondaryColor_initializers = [];
    var _secondaryColor_extraInitializers = [];
    var _favicon_decorators;
    var _favicon_initializers = [];
    var _favicon_extraInitializers = [];
    var _appName_decorators;
    var _appName_initializers = [];
    var _appName_extraInitializers = [];
    return _a = /** @class */ (function () {
            function UpdateTenantBrandingDto() {
                this.logoUrl = __runInitializers(this, _logoUrl_initializers, void 0);
                this.primaryColor = (__runInitializers(this, _logoUrl_extraInitializers), __runInitializers(this, _primaryColor_initializers, void 0));
                this.secondaryColor = (__runInitializers(this, _primaryColor_extraInitializers), __runInitializers(this, _secondaryColor_initializers, void 0));
                this.favicon = (__runInitializers(this, _secondaryColor_extraInitializers), __runInitializers(this, _favicon_initializers, void 0));
                this.appName = (__runInitializers(this, _favicon_extraInitializers), __runInitializers(this, _appName_initializers, void 0));
                __runInitializers(this, _appName_extraInitializers);
            }
            return UpdateTenantBrandingDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _logoUrl_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _primaryColor_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _secondaryColor_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _favicon_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _appName_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _logoUrl_decorators, { kind: "field", name: "logoUrl", static: false, private: false, access: { has: function (obj) { return "logoUrl" in obj; }, get: function (obj) { return obj.logoUrl; }, set: function (obj, value) { obj.logoUrl = value; } }, metadata: _metadata }, _logoUrl_initializers, _logoUrl_extraInitializers);
            __esDecorate(null, null, _primaryColor_decorators, { kind: "field", name: "primaryColor", static: false, private: false, access: { has: function (obj) { return "primaryColor" in obj; }, get: function (obj) { return obj.primaryColor; }, set: function (obj, value) { obj.primaryColor = value; } }, metadata: _metadata }, _primaryColor_initializers, _primaryColor_extraInitializers);
            __esDecorate(null, null, _secondaryColor_decorators, { kind: "field", name: "secondaryColor", static: false, private: false, access: { has: function (obj) { return "secondaryColor" in obj; }, get: function (obj) { return obj.secondaryColor; }, set: function (obj, value) { obj.secondaryColor = value; } }, metadata: _metadata }, _secondaryColor_initializers, _secondaryColor_extraInitializers);
            __esDecorate(null, null, _favicon_decorators, { kind: "field", name: "favicon", static: false, private: false, access: { has: function (obj) { return "favicon" in obj; }, get: function (obj) { return obj.favicon; }, set: function (obj, value) { obj.favicon = value; } }, metadata: _metadata }, _favicon_initializers, _favicon_extraInitializers);
            __esDecorate(null, null, _appName_decorators, { kind: "field", name: "appName", static: false, private: false, access: { has: function (obj) { return "appName" in obj; }, get: function (obj) { return obj.appName; }, set: function (obj, value) { obj.appName = value; } }, metadata: _metadata }, _appName_initializers, _appName_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.UpdateTenantBrandingDto = UpdateTenantBrandingDto;
var UpdateTenantRegionalDto = function () {
    var _a;
    var _timezone_decorators;
    var _timezone_initializers = [];
    var _timezone_extraInitializers = [];
    var _currency_decorators;
    var _currency_initializers = [];
    var _currency_extraInitializers = [];
    var _locale_decorators;
    var _locale_initializers = [];
    var _locale_extraInitializers = [];
    var _dateFormat_decorators;
    var _dateFormat_initializers = [];
    var _dateFormat_extraInitializers = [];
    return _a = /** @class */ (function () {
            function UpdateTenantRegionalDto() {
                this.timezone = __runInitializers(this, _timezone_initializers, void 0);
                this.currency = (__runInitializers(this, _timezone_extraInitializers), __runInitializers(this, _currency_initializers, void 0));
                this.locale = (__runInitializers(this, _currency_extraInitializers), __runInitializers(this, _locale_initializers, void 0));
                this.dateFormat = (__runInitializers(this, _locale_extraInitializers), __runInitializers(this, _dateFormat_initializers, void 0));
                __runInitializers(this, _dateFormat_extraInitializers);
            }
            return UpdateTenantRegionalDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _timezone_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _currency_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _locale_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _dateFormat_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _timezone_decorators, { kind: "field", name: "timezone", static: false, private: false, access: { has: function (obj) { return "timezone" in obj; }, get: function (obj) { return obj.timezone; }, set: function (obj, value) { obj.timezone = value; } }, metadata: _metadata }, _timezone_initializers, _timezone_extraInitializers);
            __esDecorate(null, null, _currency_decorators, { kind: "field", name: "currency", static: false, private: false, access: { has: function (obj) { return "currency" in obj; }, get: function (obj) { return obj.currency; }, set: function (obj, value) { obj.currency = value; } }, metadata: _metadata }, _currency_initializers, _currency_extraInitializers);
            __esDecorate(null, null, _locale_decorators, { kind: "field", name: "locale", static: false, private: false, access: { has: function (obj) { return "locale" in obj; }, get: function (obj) { return obj.locale; }, set: function (obj, value) { obj.locale = value; } }, metadata: _metadata }, _locale_initializers, _locale_extraInitializers);
            __esDecorate(null, null, _dateFormat_decorators, { kind: "field", name: "dateFormat", static: false, private: false, access: { has: function (obj) { return "dateFormat" in obj; }, get: function (obj) { return obj.dateFormat; }, set: function (obj, value) { obj.dateFormat = value; } }, metadata: _metadata }, _dateFormat_initializers, _dateFormat_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.UpdateTenantRegionalDto = UpdateTenantRegionalDto;
var UpdateTenantBusinessHoursDto = function () {
    var _a;
    var _workDays_decorators;
    var _workDays_initializers = [];
    var _workDays_extraInitializers = [];
    var _startHour_decorators;
    var _startHour_initializers = [];
    var _startHour_extraInitializers = [];
    var _endHour_decorators;
    var _endHour_initializers = [];
    var _endHour_extraInitializers = [];
    return _a = /** @class */ (function () {
            function UpdateTenantBusinessHoursDto() {
                this.workDays = __runInitializers(this, _workDays_initializers, void 0);
                this.startHour = (__runInitializers(this, _workDays_extraInitializers), __runInitializers(this, _startHour_initializers, void 0));
                this.endHour = (__runInitializers(this, _startHour_extraInitializers), __runInitializers(this, _endHour_initializers, void 0));
                __runInitializers(this, _endHour_extraInitializers);
            }
            return UpdateTenantBusinessHoursDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _workDays_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsOptional)()];
            _startHour_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsNumber)(), (0, class_validator_1.IsOptional)()];
            _endHour_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsNumber)(), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _workDays_decorators, { kind: "field", name: "workDays", static: false, private: false, access: { has: function (obj) { return "workDays" in obj; }, get: function (obj) { return obj.workDays; }, set: function (obj, value) { obj.workDays = value; } }, metadata: _metadata }, _workDays_initializers, _workDays_extraInitializers);
            __esDecorate(null, null, _startHour_decorators, { kind: "field", name: "startHour", static: false, private: false, access: { has: function (obj) { return "startHour" in obj; }, get: function (obj) { return obj.startHour; }, set: function (obj, value) { obj.startHour = value; } }, metadata: _metadata }, _startHour_initializers, _startHour_extraInitializers);
            __esDecorate(null, null, _endHour_decorators, { kind: "field", name: "endHour", static: false, private: false, access: { has: function (obj) { return "endHour" in obj; }, get: function (obj) { return obj.endHour; }, set: function (obj, value) { obj.endHour = value; } }, metadata: _metadata }, _endHour_initializers, _endHour_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.UpdateTenantBusinessHoursDto = UpdateTenantBusinessHoursDto;
var UpdateTenantStatusDto = function () {
    var _a;
    var _status_decorators;
    var _status_initializers = [];
    var _status_extraInitializers = [];
    return _a = /** @class */ (function () {
            function UpdateTenantStatusDto() {
                this.status = __runInitializers(this, _status_initializers, void 0);
                __runInitializers(this, _status_extraInitializers);
            }
            return UpdateTenantStatusDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _status_decorators = [(0, swagger_1.ApiProperty)({ enum: ['ACTIVE', 'SUSPENDED', 'PENDING', 'DELETED'] }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: function (obj) { return "status" in obj; }, get: function (obj) { return obj.status; }, set: function (obj, value) { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.UpdateTenantStatusDto = UpdateTenantStatusDto;
// 2. Organization Management DTOs
var CreateDepartmentDto = function () {
    var _a;
    var _name_decorators;
    var _name_initializers = [];
    var _name_extraInitializers = [];
    var _code_decorators;
    var _code_initializers = [];
    var _code_extraInitializers = [];
    var _description_decorators;
    var _description_initializers = [];
    var _description_extraInitializers = [];
    var _managerId_decorators;
    var _managerId_initializers = [];
    var _managerId_extraInitializers = [];
    return _a = /** @class */ (function () {
            function CreateDepartmentDto() {
                this.name = __runInitializers(this, _name_initializers, void 0);
                this.code = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _code_initializers, void 0));
                this.description = (__runInitializers(this, _code_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.managerId = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _managerId_initializers, void 0));
                __runInitializers(this, _managerId_extraInitializers);
            }
            return CreateDepartmentDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _name_decorators = [(0, swagger_1.ApiProperty)(), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _code_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _description_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _managerId_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: function (obj) { return "name" in obj; }, get: function (obj) { return obj.name; }, set: function (obj, value) { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
            __esDecorate(null, null, _code_decorators, { kind: "field", name: "code", static: false, private: false, access: { has: function (obj) { return "code" in obj; }, get: function (obj) { return obj.code; }, set: function (obj, value) { obj.code = value; } }, metadata: _metadata }, _code_initializers, _code_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: function (obj) { return "description" in obj; }, get: function (obj) { return obj.description; }, set: function (obj, value) { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _managerId_decorators, { kind: "field", name: "managerId", static: false, private: false, access: { has: function (obj) { return "managerId" in obj; }, get: function (obj) { return obj.managerId; }, set: function (obj, value) { obj.managerId = value; } }, metadata: _metadata }, _managerId_initializers, _managerId_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.CreateDepartmentDto = CreateDepartmentDto;
var UpdateDepartmentDto = function () {
    var _a;
    var _name_decorators;
    var _name_initializers = [];
    var _name_extraInitializers = [];
    var _code_decorators;
    var _code_initializers = [];
    var _code_extraInitializers = [];
    var _description_decorators;
    var _description_initializers = [];
    var _description_extraInitializers = [];
    var _managerId_decorators;
    var _managerId_initializers = [];
    var _managerId_extraInitializers = [];
    return _a = /** @class */ (function () {
            function UpdateDepartmentDto() {
                this.name = __runInitializers(this, _name_initializers, void 0);
                this.code = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _code_initializers, void 0));
                this.description = (__runInitializers(this, _code_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.managerId = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _managerId_initializers, void 0));
                __runInitializers(this, _managerId_extraInitializers);
            }
            return UpdateDepartmentDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _name_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _code_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _description_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _managerId_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: function (obj) { return "name" in obj; }, get: function (obj) { return obj.name; }, set: function (obj, value) { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
            __esDecorate(null, null, _code_decorators, { kind: "field", name: "code", static: false, private: false, access: { has: function (obj) { return "code" in obj; }, get: function (obj) { return obj.code; }, set: function (obj, value) { obj.code = value; } }, metadata: _metadata }, _code_initializers, _code_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: function (obj) { return "description" in obj; }, get: function (obj) { return obj.description; }, set: function (obj, value) { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _managerId_decorators, { kind: "field", name: "managerId", static: false, private: false, access: { has: function (obj) { return "managerId" in obj; }, get: function (obj) { return obj.managerId; }, set: function (obj, value) { obj.managerId = value; } }, metadata: _metadata }, _managerId_initializers, _managerId_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.UpdateDepartmentDto = UpdateDepartmentDto;
var CreateTeamDto = function () {
    var _a;
    var _name_decorators;
    var _name_initializers = [];
    var _name_extraInitializers = [];
    var _description_decorators;
    var _description_initializers = [];
    var _description_extraInitializers = [];
    var _departmentId_decorators;
    var _departmentId_initializers = [];
    var _departmentId_extraInitializers = [];
    var _leadId_decorators;
    var _leadId_initializers = [];
    var _leadId_extraInitializers = [];
    return _a = /** @class */ (function () {
            function CreateTeamDto() {
                this.name = __runInitializers(this, _name_initializers, void 0);
                this.description = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.departmentId = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _departmentId_initializers, void 0));
                this.leadId = (__runInitializers(this, _departmentId_extraInitializers), __runInitializers(this, _leadId_initializers, void 0));
                __runInitializers(this, _leadId_extraInitializers);
            }
            return CreateTeamDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _name_decorators = [(0, swagger_1.ApiProperty)(), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _description_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _departmentId_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _leadId_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: function (obj) { return "name" in obj; }, get: function (obj) { return obj.name; }, set: function (obj, value) { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: function (obj) { return "description" in obj; }, get: function (obj) { return obj.description; }, set: function (obj, value) { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _departmentId_decorators, { kind: "field", name: "departmentId", static: false, private: false, access: { has: function (obj) { return "departmentId" in obj; }, get: function (obj) { return obj.departmentId; }, set: function (obj, value) { obj.departmentId = value; } }, metadata: _metadata }, _departmentId_initializers, _departmentId_extraInitializers);
            __esDecorate(null, null, _leadId_decorators, { kind: "field", name: "leadId", static: false, private: false, access: { has: function (obj) { return "leadId" in obj; }, get: function (obj) { return obj.leadId; }, set: function (obj, value) { obj.leadId = value; } }, metadata: _metadata }, _leadId_initializers, _leadId_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.CreateTeamDto = CreateTeamDto;
var UpdateTeamDto = function () {
    var _a;
    var _name_decorators;
    var _name_initializers = [];
    var _name_extraInitializers = [];
    var _description_decorators;
    var _description_initializers = [];
    var _description_extraInitializers = [];
    var _departmentId_decorators;
    var _departmentId_initializers = [];
    var _departmentId_extraInitializers = [];
    var _leadId_decorators;
    var _leadId_initializers = [];
    var _leadId_extraInitializers = [];
    return _a = /** @class */ (function () {
            function UpdateTeamDto() {
                this.name = __runInitializers(this, _name_initializers, void 0);
                this.description = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.departmentId = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _departmentId_initializers, void 0));
                this.leadId = (__runInitializers(this, _departmentId_extraInitializers), __runInitializers(this, _leadId_initializers, void 0));
                __runInitializers(this, _leadId_extraInitializers);
            }
            return UpdateTeamDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _name_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _description_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _departmentId_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _leadId_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: function (obj) { return "name" in obj; }, get: function (obj) { return obj.name; }, set: function (obj, value) { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: function (obj) { return "description" in obj; }, get: function (obj) { return obj.description; }, set: function (obj, value) { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _departmentId_decorators, { kind: "field", name: "departmentId", static: false, private: false, access: { has: function (obj) { return "departmentId" in obj; }, get: function (obj) { return obj.departmentId; }, set: function (obj, value) { obj.departmentId = value; } }, metadata: _metadata }, _departmentId_initializers, _departmentId_extraInitializers);
            __esDecorate(null, null, _leadId_decorators, { kind: "field", name: "leadId", static: false, private: false, access: { has: function (obj) { return "leadId" in obj; }, get: function (obj) { return obj.leadId; }, set: function (obj, value) { obj.leadId = value; } }, metadata: _metadata }, _leadId_initializers, _leadId_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.UpdateTeamDto = UpdateTeamDto;
var CreateCostCenterDto = function () {
    var _a;
    var _code_decorators;
    var _code_initializers = [];
    var _code_extraInitializers = [];
    var _name_decorators;
    var _name_initializers = [];
    var _name_extraInitializers = [];
    var _budget_decorators;
    var _budget_initializers = [];
    var _budget_extraInitializers = [];
    var _currency_decorators;
    var _currency_initializers = [];
    var _currency_extraInitializers = [];
    return _a = /** @class */ (function () {
            function CreateCostCenterDto() {
                this.code = __runInitializers(this, _code_initializers, void 0);
                this.name = (__runInitializers(this, _code_extraInitializers), __runInitializers(this, _name_initializers, void 0));
                this.budget = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _budget_initializers, void 0));
                this.currency = (__runInitializers(this, _budget_extraInitializers), __runInitializers(this, _currency_initializers, void 0));
                __runInitializers(this, _currency_extraInitializers);
            }
            return CreateCostCenterDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _code_decorators = [(0, swagger_1.ApiProperty)(), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _name_decorators = [(0, swagger_1.ApiProperty)(), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _budget_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsNumber)(), (0, class_validator_1.IsOptional)()];
            _currency_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _code_decorators, { kind: "field", name: "code", static: false, private: false, access: { has: function (obj) { return "code" in obj; }, get: function (obj) { return obj.code; }, set: function (obj, value) { obj.code = value; } }, metadata: _metadata }, _code_initializers, _code_extraInitializers);
            __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: function (obj) { return "name" in obj; }, get: function (obj) { return obj.name; }, set: function (obj, value) { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
            __esDecorate(null, null, _budget_decorators, { kind: "field", name: "budget", static: false, private: false, access: { has: function (obj) { return "budget" in obj; }, get: function (obj) { return obj.budget; }, set: function (obj, value) { obj.budget = value; } }, metadata: _metadata }, _budget_initializers, _budget_extraInitializers);
            __esDecorate(null, null, _currency_decorators, { kind: "field", name: "currency", static: false, private: false, access: { has: function (obj) { return "currency" in obj; }, get: function (obj) { return obj.currency; }, set: function (obj, value) { obj.currency = value; } }, metadata: _metadata }, _currency_initializers, _currency_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.CreateCostCenterDto = CreateCostCenterDto;
var UpdateCostCenterDto = function () {
    var _a;
    var _code_decorators;
    var _code_initializers = [];
    var _code_extraInitializers = [];
    var _name_decorators;
    var _name_initializers = [];
    var _name_extraInitializers = [];
    var _budget_decorators;
    var _budget_initializers = [];
    var _budget_extraInitializers = [];
    var _currency_decorators;
    var _currency_initializers = [];
    var _currency_extraInitializers = [];
    return _a = /** @class */ (function () {
            function UpdateCostCenterDto() {
                this.code = __runInitializers(this, _code_initializers, void 0);
                this.name = (__runInitializers(this, _code_extraInitializers), __runInitializers(this, _name_initializers, void 0));
                this.budget = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _budget_initializers, void 0));
                this.currency = (__runInitializers(this, _budget_extraInitializers), __runInitializers(this, _currency_initializers, void 0));
                __runInitializers(this, _currency_extraInitializers);
            }
            return UpdateCostCenterDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _code_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _name_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _budget_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsNumber)(), (0, class_validator_1.IsOptional)()];
            _currency_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _code_decorators, { kind: "field", name: "code", static: false, private: false, access: { has: function (obj) { return "code" in obj; }, get: function (obj) { return obj.code; }, set: function (obj, value) { obj.code = value; } }, metadata: _metadata }, _code_initializers, _code_extraInitializers);
            __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: function (obj) { return "name" in obj; }, get: function (obj) { return obj.name; }, set: function (obj, value) { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
            __esDecorate(null, null, _budget_decorators, { kind: "field", name: "budget", static: false, private: false, access: { has: function (obj) { return "budget" in obj; }, get: function (obj) { return obj.budget; }, set: function (obj, value) { obj.budget = value; } }, metadata: _metadata }, _budget_initializers, _budget_extraInitializers);
            __esDecorate(null, null, _currency_decorators, { kind: "field", name: "currency", static: false, private: false, access: { has: function (obj) { return "currency" in obj; }, get: function (obj) { return obj.currency; }, set: function (obj, value) { obj.currency = value; } }, metadata: _metadata }, _currency_initializers, _currency_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.UpdateCostCenterDto = UpdateCostCenterDto;
// 3. User Administration DTOs
var InviteUserDto = function () {
    var _a;
    var _email_decorators;
    var _email_initializers = [];
    var _email_extraInitializers = [];
    var _firstName_decorators;
    var _firstName_initializers = [];
    var _firstName_extraInitializers = [];
    var _lastName_decorators;
    var _lastName_initializers = [];
    var _lastName_extraInitializers = [];
    var _roleId_decorators;
    var _roleId_initializers = [];
    var _roleId_extraInitializers = [];
    var _departmentId_decorators;
    var _departmentId_initializers = [];
    var _departmentId_extraInitializers = [];
    var _teamId_decorators;
    var _teamId_initializers = [];
    var _teamId_extraInitializers = [];
    var _costCenterId_decorators;
    var _costCenterId_initializers = [];
    var _costCenterId_extraInitializers = [];
    return _a = /** @class */ (function () {
            function InviteUserDto() {
                this.email = __runInitializers(this, _email_initializers, void 0);
                this.firstName = (__runInitializers(this, _email_extraInitializers), __runInitializers(this, _firstName_initializers, void 0));
                this.lastName = (__runInitializers(this, _firstName_extraInitializers), __runInitializers(this, _lastName_initializers, void 0));
                this.roleId = (__runInitializers(this, _lastName_extraInitializers), __runInitializers(this, _roleId_initializers, void 0));
                this.departmentId = (__runInitializers(this, _roleId_extraInitializers), __runInitializers(this, _departmentId_initializers, void 0));
                this.teamId = (__runInitializers(this, _departmentId_extraInitializers), __runInitializers(this, _teamId_initializers, void 0));
                this.costCenterId = (__runInitializers(this, _teamId_extraInitializers), __runInitializers(this, _costCenterId_initializers, void 0));
                __runInitializers(this, _costCenterId_extraInitializers);
            }
            return InviteUserDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _email_decorators = [(0, swagger_1.ApiProperty)(), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _firstName_decorators = [(0, swagger_1.ApiProperty)(), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _lastName_decorators = [(0, swagger_1.ApiProperty)(), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _roleId_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _departmentId_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _teamId_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _costCenterId_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _email_decorators, { kind: "field", name: "email", static: false, private: false, access: { has: function (obj) { return "email" in obj; }, get: function (obj) { return obj.email; }, set: function (obj, value) { obj.email = value; } }, metadata: _metadata }, _email_initializers, _email_extraInitializers);
            __esDecorate(null, null, _firstName_decorators, { kind: "field", name: "firstName", static: false, private: false, access: { has: function (obj) { return "firstName" in obj; }, get: function (obj) { return obj.firstName; }, set: function (obj, value) { obj.firstName = value; } }, metadata: _metadata }, _firstName_initializers, _firstName_extraInitializers);
            __esDecorate(null, null, _lastName_decorators, { kind: "field", name: "lastName", static: false, private: false, access: { has: function (obj) { return "lastName" in obj; }, get: function (obj) { return obj.lastName; }, set: function (obj, value) { obj.lastName = value; } }, metadata: _metadata }, _lastName_initializers, _lastName_extraInitializers);
            __esDecorate(null, null, _roleId_decorators, { kind: "field", name: "roleId", static: false, private: false, access: { has: function (obj) { return "roleId" in obj; }, get: function (obj) { return obj.roleId; }, set: function (obj, value) { obj.roleId = value; } }, metadata: _metadata }, _roleId_initializers, _roleId_extraInitializers);
            __esDecorate(null, null, _departmentId_decorators, { kind: "field", name: "departmentId", static: false, private: false, access: { has: function (obj) { return "departmentId" in obj; }, get: function (obj) { return obj.departmentId; }, set: function (obj, value) { obj.departmentId = value; } }, metadata: _metadata }, _departmentId_initializers, _departmentId_extraInitializers);
            __esDecorate(null, null, _teamId_decorators, { kind: "field", name: "teamId", static: false, private: false, access: { has: function (obj) { return "teamId" in obj; }, get: function (obj) { return obj.teamId; }, set: function (obj, value) { obj.teamId = value; } }, metadata: _metadata }, _teamId_initializers, _teamId_extraInitializers);
            __esDecorate(null, null, _costCenterId_decorators, { kind: "field", name: "costCenterId", static: false, private: false, access: { has: function (obj) { return "costCenterId" in obj; }, get: function (obj) { return obj.costCenterId; }, set: function (obj, value) { obj.costCenterId = value; } }, metadata: _metadata }, _costCenterId_initializers, _costCenterId_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.InviteUserDto = InviteUserDto;
var BulkUserImportDto = function () {
    var _a;
    var _users_decorators;
    var _users_initializers = [];
    var _users_extraInitializers = [];
    return _a = /** @class */ (function () {
            function BulkUserImportDto() {
                this.users = __runInitializers(this, _users_initializers, void 0);
                __runInitializers(this, _users_extraInitializers);
            }
            return BulkUserImportDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _users_decorators = [(0, swagger_1.ApiProperty)({ type: [InviteUserDto] }), (0, class_validator_1.IsArray)(), (0, class_validator_1.ValidateNested)({ each: true }), (0, class_transformer_1.Type)(function () { return InviteUserDto; })];
            __esDecorate(null, null, _users_decorators, { kind: "field", name: "users", static: false, private: false, access: { has: function (obj) { return "users" in obj; }, get: function (obj) { return obj.users; }, set: function (obj, value) { obj.users = value; } }, metadata: _metadata }, _users_initializers, _users_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.BulkUserImportDto = BulkUserImportDto;
var UserStatusActionDto = function () {
    var _a;
    var _reason_decorators;
    var _reason_initializers = [];
    var _reason_extraInitializers = [];
    return _a = /** @class */ (function () {
            function UserStatusActionDto() {
                this.reason = __runInitializers(this, _reason_initializers, void 0);
                __runInitializers(this, _reason_extraInitializers);
            }
            return UserStatusActionDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _reason_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _reason_decorators, { kind: "field", name: "reason", static: false, private: false, access: { has: function (obj) { return "reason" in obj; }, get: function (obj) { return obj.reason; }, set: function (obj, value) { obj.reason = value; } }, metadata: _metadata }, _reason_initializers, _reason_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.UserStatusActionDto = UserStatusActionDto;
// 4. Enterprise RBAC DTOs
var CreatePermissionGroupDto = function () {
    var _a;
    var _domain_decorators;
    var _domain_initializers = [];
    var _domain_extraInitializers = [];
    var _name_decorators;
    var _name_initializers = [];
    var _name_extraInitializers = [];
    var _description_decorators;
    var _description_initializers = [];
    var _description_extraInitializers = [];
    var _permissions_decorators;
    var _permissions_initializers = [];
    var _permissions_extraInitializers = [];
    return _a = /** @class */ (function () {
            function CreatePermissionGroupDto() {
                this.domain = __runInitializers(this, _domain_initializers, void 0);
                this.name = (__runInitializers(this, _domain_extraInitializers), __runInitializers(this, _name_initializers, void 0));
                this.description = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.permissions = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _permissions_initializers, void 0));
                __runInitializers(this, _permissions_extraInitializers);
            }
            return CreatePermissionGroupDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _domain_decorators = [(0, swagger_1.ApiProperty)(), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _name_decorators = [(0, swagger_1.ApiProperty)(), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _description_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _permissions_decorators = [(0, swagger_1.ApiProperty)({ type: [String] }), (0, class_validator_1.IsArray)()];
            __esDecorate(null, null, _domain_decorators, { kind: "field", name: "domain", static: false, private: false, access: { has: function (obj) { return "domain" in obj; }, get: function (obj) { return obj.domain; }, set: function (obj, value) { obj.domain = value; } }, metadata: _metadata }, _domain_initializers, _domain_extraInitializers);
            __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: function (obj) { return "name" in obj; }, get: function (obj) { return obj.name; }, set: function (obj, value) { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: function (obj) { return "description" in obj; }, get: function (obj) { return obj.description; }, set: function (obj, value) { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _permissions_decorators, { kind: "field", name: "permissions", static: false, private: false, access: { has: function (obj) { return "permissions" in obj; }, get: function (obj) { return obj.permissions; }, set: function (obj, value) { obj.permissions = value; } }, metadata: _metadata }, _permissions_initializers, _permissions_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.CreatePermissionGroupDto = CreatePermissionGroupDto;
var CreateRoleTemplateDto = function () {
    var _a;
    var _name_decorators;
    var _name_initializers = [];
    var _name_extraInitializers = [];
    var _description_decorators;
    var _description_initializers = [];
    var _description_extraInitializers = [];
    var _permissions_decorators;
    var _permissions_initializers = [];
    var _permissions_extraInitializers = [];
    var _isTemplate_decorators;
    var _isTemplate_initializers = [];
    var _isTemplate_extraInitializers = [];
    return _a = /** @class */ (function () {
            function CreateRoleTemplateDto() {
                this.name = __runInitializers(this, _name_initializers, void 0);
                this.description = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.permissions = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _permissions_initializers, void 0));
                this.isTemplate = (__runInitializers(this, _permissions_extraInitializers), __runInitializers(this, _isTemplate_initializers, void 0));
                __runInitializers(this, _isTemplate_extraInitializers);
            }
            return CreateRoleTemplateDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _name_decorators = [(0, swagger_1.ApiProperty)(), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _description_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _permissions_decorators = [(0, swagger_1.ApiProperty)({ type: [String] }), (0, class_validator_1.IsArray)()];
            _isTemplate_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsBoolean)(), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: function (obj) { return "name" in obj; }, get: function (obj) { return obj.name; }, set: function (obj, value) { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: function (obj) { return "description" in obj; }, get: function (obj) { return obj.description; }, set: function (obj, value) { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _permissions_decorators, { kind: "field", name: "permissions", static: false, private: false, access: { has: function (obj) { return "permissions" in obj; }, get: function (obj) { return obj.permissions; }, set: function (obj, value) { obj.permissions = value; } }, metadata: _metadata }, _permissions_initializers, _permissions_extraInitializers);
            __esDecorate(null, null, _isTemplate_decorators, { kind: "field", name: "isTemplate", static: false, private: false, access: { has: function (obj) { return "isTemplate" in obj; }, get: function (obj) { return obj.isTemplate; }, set: function (obj, value) { obj.isTemplate = value; } }, metadata: _metadata }, _isTemplate_initializers, _isTemplate_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.CreateRoleTemplateDto = CreateRoleTemplateDto;
var SimulatePermissionDto = function () {
    var _a;
    var _userId_decorators;
    var _userId_initializers = [];
    var _userId_extraInitializers = [];
    var _permission_decorators;
    var _permission_initializers = [];
    var _permission_extraInitializers = [];
    var _context_decorators;
    var _context_initializers = [];
    var _context_extraInitializers = [];
    return _a = /** @class */ (function () {
            function SimulatePermissionDto() {
                this.userId = __runInitializers(this, _userId_initializers, void 0);
                this.permission = (__runInitializers(this, _userId_extraInitializers), __runInitializers(this, _permission_initializers, void 0));
                this.context = (__runInitializers(this, _permission_extraInitializers), __runInitializers(this, _context_initializers, void 0));
                __runInitializers(this, _context_extraInitializers);
            }
            return SimulatePermissionDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _userId_decorators = [(0, swagger_1.ApiProperty)(), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _permission_decorators = [(0, swagger_1.ApiProperty)(), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _context_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsObject)(), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _userId_decorators, { kind: "field", name: "userId", static: false, private: false, access: { has: function (obj) { return "userId" in obj; }, get: function (obj) { return obj.userId; }, set: function (obj, value) { obj.userId = value; } }, metadata: _metadata }, _userId_initializers, _userId_extraInitializers);
            __esDecorate(null, null, _permission_decorators, { kind: "field", name: "permission", static: false, private: false, access: { has: function (obj) { return "permission" in obj; }, get: function (obj) { return obj.permission; }, set: function (obj, value) { obj.permission = value; } }, metadata: _metadata }, _permission_initializers, _permission_extraInitializers);
            __esDecorate(null, null, _context_decorators, { kind: "field", name: "context", static: false, private: false, access: { has: function (obj) { return "context" in obj; }, get: function (obj) { return obj.context; }, set: function (obj, value) { obj.context = value; } }, metadata: _metadata }, _context_initializers, _context_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.SimulatePermissionDto = SimulatePermissionDto;
// 5. Security Policies DTOs
var UpdateSecurityPolicyDto = function () {
    var _a;
    var _passwordMinLength_decorators;
    var _passwordMinLength_initializers = [];
    var _passwordMinLength_extraInitializers = [];
    var _requireNumbers_decorators;
    var _requireNumbers_initializers = [];
    var _requireNumbers_extraInitializers = [];
    var _requireSymbols_decorators;
    var _requireSymbols_initializers = [];
    var _requireSymbols_extraInitializers = [];
    var _passwordExpiryDays_decorators;
    var _passwordExpiryDays_initializers = [];
    var _passwordExpiryDays_extraInitializers = [];
    var _requireMfa_decorators;
    var _requireMfa_initializers = [];
    var _requireMfa_extraInitializers = [];
    var _allowedMfaMethods_decorators;
    var _allowedMfaMethods_initializers = [];
    var _allowedMfaMethods_extraInitializers = [];
    var _maxConcurrentSessions_decorators;
    var _maxConcurrentSessions_initializers = [];
    var _maxConcurrentSessions_extraInitializers = [];
    var _idleTimeoutMinutes_decorators;
    var _idleTimeoutMinutes_initializers = [];
    var _idleTimeoutMinutes_extraInitializers = [];
    var _ipAllowList_decorators;
    var _ipAllowList_initializers = [];
    var _ipAllowList_extraInitializers = [];
    var _allowedCountries_decorators;
    var _allowedCountries_initializers = [];
    var _allowedCountries_extraInitializers = [];
    var _restrictToWorkingHours_decorators;
    var _restrictToWorkingHours_initializers = [];
    var _restrictToWorkingHours_extraInitializers = [];
    return _a = /** @class */ (function () {
            function UpdateSecurityPolicyDto() {
                this.passwordMinLength = __runInitializers(this, _passwordMinLength_initializers, void 0);
                this.requireNumbers = (__runInitializers(this, _passwordMinLength_extraInitializers), __runInitializers(this, _requireNumbers_initializers, void 0));
                this.requireSymbols = (__runInitializers(this, _requireNumbers_extraInitializers), __runInitializers(this, _requireSymbols_initializers, void 0));
                this.passwordExpiryDays = (__runInitializers(this, _requireSymbols_extraInitializers), __runInitializers(this, _passwordExpiryDays_initializers, void 0));
                this.requireMfa = (__runInitializers(this, _passwordExpiryDays_extraInitializers), __runInitializers(this, _requireMfa_initializers, void 0));
                this.allowedMfaMethods = (__runInitializers(this, _requireMfa_extraInitializers), __runInitializers(this, _allowedMfaMethods_initializers, void 0));
                this.maxConcurrentSessions = (__runInitializers(this, _allowedMfaMethods_extraInitializers), __runInitializers(this, _maxConcurrentSessions_initializers, void 0));
                this.idleTimeoutMinutes = (__runInitializers(this, _maxConcurrentSessions_extraInitializers), __runInitializers(this, _idleTimeoutMinutes_initializers, void 0));
                this.ipAllowList = (__runInitializers(this, _idleTimeoutMinutes_extraInitializers), __runInitializers(this, _ipAllowList_initializers, void 0));
                this.allowedCountries = (__runInitializers(this, _ipAllowList_extraInitializers), __runInitializers(this, _allowedCountries_initializers, void 0));
                this.restrictToWorkingHours = (__runInitializers(this, _allowedCountries_extraInitializers), __runInitializers(this, _restrictToWorkingHours_initializers, void 0));
                __runInitializers(this, _restrictToWorkingHours_extraInitializers);
            }
            return UpdateSecurityPolicyDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _passwordMinLength_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsNumber)(), (0, class_validator_1.IsOptional)()];
            _requireNumbers_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsBoolean)(), (0, class_validator_1.IsOptional)()];
            _requireSymbols_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsBoolean)(), (0, class_validator_1.IsOptional)()];
            _passwordExpiryDays_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsNumber)(), (0, class_validator_1.IsOptional)()];
            _requireMfa_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsBoolean)(), (0, class_validator_1.IsOptional)()];
            _allowedMfaMethods_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsOptional)()];
            _maxConcurrentSessions_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsNumber)(), (0, class_validator_1.IsOptional)()];
            _idleTimeoutMinutes_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsNumber)(), (0, class_validator_1.IsOptional)()];
            _ipAllowList_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsOptional)()];
            _allowedCountries_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsOptional)()];
            _restrictToWorkingHours_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsBoolean)(), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _passwordMinLength_decorators, { kind: "field", name: "passwordMinLength", static: false, private: false, access: { has: function (obj) { return "passwordMinLength" in obj; }, get: function (obj) { return obj.passwordMinLength; }, set: function (obj, value) { obj.passwordMinLength = value; } }, metadata: _metadata }, _passwordMinLength_initializers, _passwordMinLength_extraInitializers);
            __esDecorate(null, null, _requireNumbers_decorators, { kind: "field", name: "requireNumbers", static: false, private: false, access: { has: function (obj) { return "requireNumbers" in obj; }, get: function (obj) { return obj.requireNumbers; }, set: function (obj, value) { obj.requireNumbers = value; } }, metadata: _metadata }, _requireNumbers_initializers, _requireNumbers_extraInitializers);
            __esDecorate(null, null, _requireSymbols_decorators, { kind: "field", name: "requireSymbols", static: false, private: false, access: { has: function (obj) { return "requireSymbols" in obj; }, get: function (obj) { return obj.requireSymbols; }, set: function (obj, value) { obj.requireSymbols = value; } }, metadata: _metadata }, _requireSymbols_initializers, _requireSymbols_extraInitializers);
            __esDecorate(null, null, _passwordExpiryDays_decorators, { kind: "field", name: "passwordExpiryDays", static: false, private: false, access: { has: function (obj) { return "passwordExpiryDays" in obj; }, get: function (obj) { return obj.passwordExpiryDays; }, set: function (obj, value) { obj.passwordExpiryDays = value; } }, metadata: _metadata }, _passwordExpiryDays_initializers, _passwordExpiryDays_extraInitializers);
            __esDecorate(null, null, _requireMfa_decorators, { kind: "field", name: "requireMfa", static: false, private: false, access: { has: function (obj) { return "requireMfa" in obj; }, get: function (obj) { return obj.requireMfa; }, set: function (obj, value) { obj.requireMfa = value; } }, metadata: _metadata }, _requireMfa_initializers, _requireMfa_extraInitializers);
            __esDecorate(null, null, _allowedMfaMethods_decorators, { kind: "field", name: "allowedMfaMethods", static: false, private: false, access: { has: function (obj) { return "allowedMfaMethods" in obj; }, get: function (obj) { return obj.allowedMfaMethods; }, set: function (obj, value) { obj.allowedMfaMethods = value; } }, metadata: _metadata }, _allowedMfaMethods_initializers, _allowedMfaMethods_extraInitializers);
            __esDecorate(null, null, _maxConcurrentSessions_decorators, { kind: "field", name: "maxConcurrentSessions", static: false, private: false, access: { has: function (obj) { return "maxConcurrentSessions" in obj; }, get: function (obj) { return obj.maxConcurrentSessions; }, set: function (obj, value) { obj.maxConcurrentSessions = value; } }, metadata: _metadata }, _maxConcurrentSessions_initializers, _maxConcurrentSessions_extraInitializers);
            __esDecorate(null, null, _idleTimeoutMinutes_decorators, { kind: "field", name: "idleTimeoutMinutes", static: false, private: false, access: { has: function (obj) { return "idleTimeoutMinutes" in obj; }, get: function (obj) { return obj.idleTimeoutMinutes; }, set: function (obj, value) { obj.idleTimeoutMinutes = value; } }, metadata: _metadata }, _idleTimeoutMinutes_initializers, _idleTimeoutMinutes_extraInitializers);
            __esDecorate(null, null, _ipAllowList_decorators, { kind: "field", name: "ipAllowList", static: false, private: false, access: { has: function (obj) { return "ipAllowList" in obj; }, get: function (obj) { return obj.ipAllowList; }, set: function (obj, value) { obj.ipAllowList = value; } }, metadata: _metadata }, _ipAllowList_initializers, _ipAllowList_extraInitializers);
            __esDecorate(null, null, _allowedCountries_decorators, { kind: "field", name: "allowedCountries", static: false, private: false, access: { has: function (obj) { return "allowedCountries" in obj; }, get: function (obj) { return obj.allowedCountries; }, set: function (obj, value) { obj.allowedCountries = value; } }, metadata: _metadata }, _allowedCountries_initializers, _allowedCountries_extraInitializers);
            __esDecorate(null, null, _restrictToWorkingHours_decorators, { kind: "field", name: "restrictToWorkingHours", static: false, private: false, access: { has: function (obj) { return "restrictToWorkingHours" in obj; }, get: function (obj) { return obj.restrictToWorkingHours; }, set: function (obj, value) { obj.restrictToWorkingHours = value; } }, metadata: _metadata }, _restrictToWorkingHours_initializers, _restrictToWorkingHours_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.UpdateSecurityPolicyDto = UpdateSecurityPolicyDto;
// 6. Feature Flag Platform DTOs
var CreateEnterpriseFlagDto = function () {
    var _a;
    var _key_decorators;
    var _key_initializers = [];
    var _key_extraInitializers = [];
    var _name_decorators;
    var _name_initializers = [];
    var _name_extraInitializers = [];
    var _description_decorators;
    var _description_initializers = [];
    var _description_extraInitializers = [];
    var _isEnabled_decorators;
    var _isEnabled_initializers = [];
    var _isEnabled_extraInitializers = [];
    var _isGlobal_decorators;
    var _isGlobal_initializers = [];
    var _isGlobal_extraInitializers = [];
    var _percentageRollout_decorators;
    var _percentageRollout_initializers = [];
    var _percentageRollout_extraInitializers = [];
    var _killSwitch_decorators;
    var _killSwitch_initializers = [];
    var _killSwitch_extraInitializers = [];
    var _targetEnvironments_decorators;
    var _targetEnvironments_initializers = [];
    var _targetEnvironments_extraInitializers = [];
    return _a = /** @class */ (function () {
            function CreateEnterpriseFlagDto() {
                this.key = __runInitializers(this, _key_initializers, void 0);
                this.name = (__runInitializers(this, _key_extraInitializers), __runInitializers(this, _name_initializers, void 0));
                this.description = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.isEnabled = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _isEnabled_initializers, void 0));
                this.isGlobal = (__runInitializers(this, _isEnabled_extraInitializers), __runInitializers(this, _isGlobal_initializers, void 0));
                this.percentageRollout = (__runInitializers(this, _isGlobal_extraInitializers), __runInitializers(this, _percentageRollout_initializers, void 0));
                this.killSwitch = (__runInitializers(this, _percentageRollout_extraInitializers), __runInitializers(this, _killSwitch_initializers, void 0));
                this.targetEnvironments = (__runInitializers(this, _killSwitch_extraInitializers), __runInitializers(this, _targetEnvironments_initializers, void 0));
                __runInitializers(this, _targetEnvironments_extraInitializers);
            }
            return CreateEnterpriseFlagDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _key_decorators = [(0, swagger_1.ApiProperty)(), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _name_decorators = [(0, swagger_1.ApiProperty)(), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _description_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _isEnabled_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsBoolean)(), (0, class_validator_1.IsOptional)()];
            _isGlobal_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsBoolean)(), (0, class_validator_1.IsOptional)()];
            _percentageRollout_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsNumber)(), (0, class_validator_1.IsOptional)()];
            _killSwitch_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsBoolean)(), (0, class_validator_1.IsOptional)()];
            _targetEnvironments_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _key_decorators, { kind: "field", name: "key", static: false, private: false, access: { has: function (obj) { return "key" in obj; }, get: function (obj) { return obj.key; }, set: function (obj, value) { obj.key = value; } }, metadata: _metadata }, _key_initializers, _key_extraInitializers);
            __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: function (obj) { return "name" in obj; }, get: function (obj) { return obj.name; }, set: function (obj, value) { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: function (obj) { return "description" in obj; }, get: function (obj) { return obj.description; }, set: function (obj, value) { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _isEnabled_decorators, { kind: "field", name: "isEnabled", static: false, private: false, access: { has: function (obj) { return "isEnabled" in obj; }, get: function (obj) { return obj.isEnabled; }, set: function (obj, value) { obj.isEnabled = value; } }, metadata: _metadata }, _isEnabled_initializers, _isEnabled_extraInitializers);
            __esDecorate(null, null, _isGlobal_decorators, { kind: "field", name: "isGlobal", static: false, private: false, access: { has: function (obj) { return "isGlobal" in obj; }, get: function (obj) { return obj.isGlobal; }, set: function (obj, value) { obj.isGlobal = value; } }, metadata: _metadata }, _isGlobal_initializers, _isGlobal_extraInitializers);
            __esDecorate(null, null, _percentageRollout_decorators, { kind: "field", name: "percentageRollout", static: false, private: false, access: { has: function (obj) { return "percentageRollout" in obj; }, get: function (obj) { return obj.percentageRollout; }, set: function (obj, value) { obj.percentageRollout = value; } }, metadata: _metadata }, _percentageRollout_initializers, _percentageRollout_extraInitializers);
            __esDecorate(null, null, _killSwitch_decorators, { kind: "field", name: "killSwitch", static: false, private: false, access: { has: function (obj) { return "killSwitch" in obj; }, get: function (obj) { return obj.killSwitch; }, set: function (obj, value) { obj.killSwitch = value; } }, metadata: _metadata }, _killSwitch_initializers, _killSwitch_extraInitializers);
            __esDecorate(null, null, _targetEnvironments_decorators, { kind: "field", name: "targetEnvironments", static: false, private: false, access: { has: function (obj) { return "targetEnvironments" in obj; }, get: function (obj) { return obj.targetEnvironments; }, set: function (obj, value) { obj.targetEnvironments = value; } }, metadata: _metadata }, _targetEnvironments_initializers, _targetEnvironments_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.CreateEnterpriseFlagDto = CreateEnterpriseFlagDto;
var UpdateEnterpriseFlagDto = function () {
    var _a;
    var _isEnabled_decorators;
    var _isEnabled_initializers = [];
    var _isEnabled_extraInitializers = [];
    var _percentageRollout_decorators;
    var _percentageRollout_initializers = [];
    var _percentageRollout_extraInitializers = [];
    var _killSwitch_decorators;
    var _killSwitch_initializers = [];
    var _killSwitch_extraInitializers = [];
    var _targetEnvironments_decorators;
    var _targetEnvironments_initializers = [];
    var _targetEnvironments_extraInitializers = [];
    return _a = /** @class */ (function () {
            function UpdateEnterpriseFlagDto() {
                this.isEnabled = __runInitializers(this, _isEnabled_initializers, void 0);
                this.percentageRollout = (__runInitializers(this, _isEnabled_extraInitializers), __runInitializers(this, _percentageRollout_initializers, void 0));
                this.killSwitch = (__runInitializers(this, _percentageRollout_extraInitializers), __runInitializers(this, _killSwitch_initializers, void 0));
                this.targetEnvironments = (__runInitializers(this, _killSwitch_extraInitializers), __runInitializers(this, _targetEnvironments_initializers, void 0));
                __runInitializers(this, _targetEnvironments_extraInitializers);
            }
            return UpdateEnterpriseFlagDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _isEnabled_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsBoolean)(), (0, class_validator_1.IsOptional)()];
            _percentageRollout_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsNumber)(), (0, class_validator_1.IsOptional)()];
            _killSwitch_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsBoolean)(), (0, class_validator_1.IsOptional)()];
            _targetEnvironments_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _isEnabled_decorators, { kind: "field", name: "isEnabled", static: false, private: false, access: { has: function (obj) { return "isEnabled" in obj; }, get: function (obj) { return obj.isEnabled; }, set: function (obj, value) { obj.isEnabled = value; } }, metadata: _metadata }, _isEnabled_initializers, _isEnabled_extraInitializers);
            __esDecorate(null, null, _percentageRollout_decorators, { kind: "field", name: "percentageRollout", static: false, private: false, access: { has: function (obj) { return "percentageRollout" in obj; }, get: function (obj) { return obj.percentageRollout; }, set: function (obj, value) { obj.percentageRollout = value; } }, metadata: _metadata }, _percentageRollout_initializers, _percentageRollout_extraInitializers);
            __esDecorate(null, null, _killSwitch_decorators, { kind: "field", name: "killSwitch", static: false, private: false, access: { has: function (obj) { return "killSwitch" in obj; }, get: function (obj) { return obj.killSwitch; }, set: function (obj, value) { obj.killSwitch = value; } }, metadata: _metadata }, _killSwitch_initializers, _killSwitch_extraInitializers);
            __esDecorate(null, null, _targetEnvironments_decorators, { kind: "field", name: "targetEnvironments", static: false, private: false, access: { has: function (obj) { return "targetEnvironments" in obj; }, get: function (obj) { return obj.targetEnvironments; }, set: function (obj, value) { obj.targetEnvironments = value; } }, metadata: _metadata }, _targetEnvironments_initializers, _targetEnvironments_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.UpdateEnterpriseFlagDto = UpdateEnterpriseFlagDto;
// 7. License Management DTOs
var AssignPlanDto = function () {
    var _a;
    var _subscriptionPlanId_decorators;
    var _subscriptionPlanId_initializers = [];
    var _subscriptionPlanId_extraInitializers = [];
    var _seats_decorators;
    var _seats_initializers = [];
    var _seats_extraInitializers = [];
    var _apiRateLimit_decorators;
    var _apiRateLimit_initializers = [];
    var _apiRateLimit_extraInitializers = [];
    var _storageQuotaMb_decorators;
    var _storageQuotaMb_initializers = [];
    var _storageQuotaMb_extraInitializers = [];
    var _enabledModules_decorators;
    var _enabledModules_initializers = [];
    var _enabledModules_extraInitializers = [];
    var _isTrial_decorators;
    var _isTrial_initializers = [];
    var _isTrial_extraInitializers = [];
    var _trialEndsAt_decorators;
    var _trialEndsAt_initializers = [];
    var _trialEndsAt_extraInitializers = [];
    var _gracePeriodDays_decorators;
    var _gracePeriodDays_initializers = [];
    var _gracePeriodDays_extraInitializers = [];
    return _a = /** @class */ (function () {
            function AssignPlanDto() {
                this.subscriptionPlanId = __runInitializers(this, _subscriptionPlanId_initializers, void 0);
                this.seats = (__runInitializers(this, _subscriptionPlanId_extraInitializers), __runInitializers(this, _seats_initializers, void 0));
                this.apiRateLimit = (__runInitializers(this, _seats_extraInitializers), __runInitializers(this, _apiRateLimit_initializers, void 0));
                this.storageQuotaMb = (__runInitializers(this, _apiRateLimit_extraInitializers), __runInitializers(this, _storageQuotaMb_initializers, void 0));
                this.enabledModules = (__runInitializers(this, _storageQuotaMb_extraInitializers), __runInitializers(this, _enabledModules_initializers, void 0));
                this.isTrial = (__runInitializers(this, _enabledModules_extraInitializers), __runInitializers(this, _isTrial_initializers, void 0));
                this.trialEndsAt = (__runInitializers(this, _isTrial_extraInitializers), __runInitializers(this, _trialEndsAt_initializers, void 0));
                this.gracePeriodDays = (__runInitializers(this, _trialEndsAt_extraInitializers), __runInitializers(this, _gracePeriodDays_initializers, void 0));
                __runInitializers(this, _gracePeriodDays_extraInitializers);
            }
            return AssignPlanDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _subscriptionPlanId_decorators = [(0, swagger_1.ApiProperty)(), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _seats_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsNumber)(), (0, class_validator_1.IsOptional)()];
            _apiRateLimit_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsNumber)(), (0, class_validator_1.IsOptional)()];
            _storageQuotaMb_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsNumber)(), (0, class_validator_1.IsOptional)()];
            _enabledModules_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsOptional)()];
            _isTrial_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsBoolean)(), (0, class_validator_1.IsOptional)()];
            _trialEndsAt_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _gracePeriodDays_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsNumber)(), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _subscriptionPlanId_decorators, { kind: "field", name: "subscriptionPlanId", static: false, private: false, access: { has: function (obj) { return "subscriptionPlanId" in obj; }, get: function (obj) { return obj.subscriptionPlanId; }, set: function (obj, value) { obj.subscriptionPlanId = value; } }, metadata: _metadata }, _subscriptionPlanId_initializers, _subscriptionPlanId_extraInitializers);
            __esDecorate(null, null, _seats_decorators, { kind: "field", name: "seats", static: false, private: false, access: { has: function (obj) { return "seats" in obj; }, get: function (obj) { return obj.seats; }, set: function (obj, value) { obj.seats = value; } }, metadata: _metadata }, _seats_initializers, _seats_extraInitializers);
            __esDecorate(null, null, _apiRateLimit_decorators, { kind: "field", name: "apiRateLimit", static: false, private: false, access: { has: function (obj) { return "apiRateLimit" in obj; }, get: function (obj) { return obj.apiRateLimit; }, set: function (obj, value) { obj.apiRateLimit = value; } }, metadata: _metadata }, _apiRateLimit_initializers, _apiRateLimit_extraInitializers);
            __esDecorate(null, null, _storageQuotaMb_decorators, { kind: "field", name: "storageQuotaMb", static: false, private: false, access: { has: function (obj) { return "storageQuotaMb" in obj; }, get: function (obj) { return obj.storageQuotaMb; }, set: function (obj, value) { obj.storageQuotaMb = value; } }, metadata: _metadata }, _storageQuotaMb_initializers, _storageQuotaMb_extraInitializers);
            __esDecorate(null, null, _enabledModules_decorators, { kind: "field", name: "enabledModules", static: false, private: false, access: { has: function (obj) { return "enabledModules" in obj; }, get: function (obj) { return obj.enabledModules; }, set: function (obj, value) { obj.enabledModules = value; } }, metadata: _metadata }, _enabledModules_initializers, _enabledModules_extraInitializers);
            __esDecorate(null, null, _isTrial_decorators, { kind: "field", name: "isTrial", static: false, private: false, access: { has: function (obj) { return "isTrial" in obj; }, get: function (obj) { return obj.isTrial; }, set: function (obj, value) { obj.isTrial = value; } }, metadata: _metadata }, _isTrial_initializers, _isTrial_extraInitializers);
            __esDecorate(null, null, _trialEndsAt_decorators, { kind: "field", name: "trialEndsAt", static: false, private: false, access: { has: function (obj) { return "trialEndsAt" in obj; }, get: function (obj) { return obj.trialEndsAt; }, set: function (obj, value) { obj.trialEndsAt = value; } }, metadata: _metadata }, _trialEndsAt_initializers, _trialEndsAt_extraInitializers);
            __esDecorate(null, null, _gracePeriodDays_decorators, { kind: "field", name: "gracePeriodDays", static: false, private: false, access: { has: function (obj) { return "gracePeriodDays" in obj; }, get: function (obj) { return obj.gracePeriodDays; }, set: function (obj, value) { obj.gracePeriodDays = value; } }, metadata: _metadata }, _gracePeriodDays_initializers, _gracePeriodDays_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.AssignPlanDto = AssignPlanDto;
// 8. API Administration DTOs
var CreateApiClientDto = function () {
    var _a;
    var _name_decorators;
    var _name_initializers = [];
    var _name_extraInitializers = [];
    var _scopes_decorators;
    var _scopes_initializers = [];
    var _scopes_extraInitializers = [];
    var _rateLimitOverride_decorators;
    var _rateLimitOverride_initializers = [];
    var _rateLimitOverride_extraInitializers = [];
    return _a = /** @class */ (function () {
            function CreateApiClientDto() {
                this.name = __runInitializers(this, _name_initializers, void 0);
                this.scopes = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _scopes_initializers, void 0));
                this.rateLimitOverride = (__runInitializers(this, _scopes_extraInitializers), __runInitializers(this, _rateLimitOverride_initializers, void 0));
                __runInitializers(this, _rateLimitOverride_extraInitializers);
            }
            return CreateApiClientDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _name_decorators = [(0, swagger_1.ApiProperty)(), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _scopes_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsOptional)()];
            _rateLimitOverride_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsNumber)(), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: function (obj) { return "name" in obj; }, get: function (obj) { return obj.name; }, set: function (obj, value) { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
            __esDecorate(null, null, _scopes_decorators, { kind: "field", name: "scopes", static: false, private: false, access: { has: function (obj) { return "scopes" in obj; }, get: function (obj) { return obj.scopes; }, set: function (obj, value) { obj.scopes = value; } }, metadata: _metadata }, _scopes_initializers, _scopes_extraInitializers);
            __esDecorate(null, null, _rateLimitOverride_decorators, { kind: "field", name: "rateLimitOverride", static: false, private: false, access: { has: function (obj) { return "rateLimitOverride" in obj; }, get: function (obj) { return obj.rateLimitOverride; }, set: function (obj, value) { obj.rateLimitOverride = value; } }, metadata: _metadata }, _rateLimitOverride_initializers, _rateLimitOverride_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.CreateApiClientDto = CreateApiClientDto;
var CreateWebhookSecretDto = function () {
    var _a;
    var _endpointUrl_decorators;
    var _endpointUrl_initializers = [];
    var _endpointUrl_extraInitializers = [];
    var _description_decorators;
    var _description_initializers = [];
    var _description_extraInitializers = [];
    var _events_decorators;
    var _events_initializers = [];
    var _events_extraInitializers = [];
    return _a = /** @class */ (function () {
            function CreateWebhookSecretDto() {
                this.endpointUrl = __runInitializers(this, _endpointUrl_initializers, void 0);
                this.description = (__runInitializers(this, _endpointUrl_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.events = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _events_initializers, void 0));
                __runInitializers(this, _events_extraInitializers);
            }
            return CreateWebhookSecretDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _endpointUrl_decorators = [(0, swagger_1.ApiProperty)(), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _description_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _events_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _endpointUrl_decorators, { kind: "field", name: "endpointUrl", static: false, private: false, access: { has: function (obj) { return "endpointUrl" in obj; }, get: function (obj) { return obj.endpointUrl; }, set: function (obj, value) { obj.endpointUrl = value; } }, metadata: _metadata }, _endpointUrl_initializers, _endpointUrl_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: function (obj) { return "description" in obj; }, get: function (obj) { return obj.description; }, set: function (obj, value) { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _events_decorators, { kind: "field", name: "events", static: false, private: false, access: { has: function (obj) { return "events" in obj; }, get: function (obj) { return obj.events; }, set: function (obj, value) { obj.events = value; } }, metadata: _metadata }, _events_initializers, _events_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.CreateWebhookSecretDto = CreateWebhookSecretDto;
// 9. Audit Center DTOs
var AuditQueryDto = function () {
    var _a;
    var _page_decorators;
    var _page_initializers = [];
    var _page_extraInitializers = [];
    var _limit_decorators;
    var _limit_initializers = [];
    var _limit_extraInitializers = [];
    var _entity_decorators;
    var _entity_initializers = [];
    var _entity_extraInitializers = [];
    var _userId_decorators;
    var _userId_initializers = [];
    var _userId_extraInitializers = [];
    var _actionPrefix_decorators;
    var _actionPrefix_initializers = [];
    var _actionPrefix_extraInitializers = [];
    var _startDate_decorators;
    var _startDate_initializers = [];
    var _startDate_extraInitializers = [];
    var _endDate_decorators;
    var _endDate_initializers = [];
    var _endDate_extraInitializers = [];
    return _a = /** @class */ (function () {
            function AuditQueryDto() {
                this.page = __runInitializers(this, _page_initializers, void 0);
                this.limit = (__runInitializers(this, _page_extraInitializers), __runInitializers(this, _limit_initializers, void 0));
                this.entity = (__runInitializers(this, _limit_extraInitializers), __runInitializers(this, _entity_initializers, void 0));
                this.userId = (__runInitializers(this, _entity_extraInitializers), __runInitializers(this, _userId_initializers, void 0));
                this.actionPrefix = (__runInitializers(this, _userId_extraInitializers), __runInitializers(this, _actionPrefix_initializers, void 0));
                this.startDate = (__runInitializers(this, _actionPrefix_extraInitializers), __runInitializers(this, _startDate_initializers, void 0));
                this.endDate = (__runInitializers(this, _startDate_extraInitializers), __runInitializers(this, _endDate_initializers, void 0));
                __runInitializers(this, _endDate_extraInitializers);
            }
            return AuditQueryDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _page_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsNumber)(), (0, class_validator_1.IsOptional)()];
            _limit_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsNumber)(), (0, class_validator_1.IsOptional)()];
            _entity_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _userId_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _actionPrefix_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _startDate_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _endDate_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _page_decorators, { kind: "field", name: "page", static: false, private: false, access: { has: function (obj) { return "page" in obj; }, get: function (obj) { return obj.page; }, set: function (obj, value) { obj.page = value; } }, metadata: _metadata }, _page_initializers, _page_extraInitializers);
            __esDecorate(null, null, _limit_decorators, { kind: "field", name: "limit", static: false, private: false, access: { has: function (obj) { return "limit" in obj; }, get: function (obj) { return obj.limit; }, set: function (obj, value) { obj.limit = value; } }, metadata: _metadata }, _limit_initializers, _limit_extraInitializers);
            __esDecorate(null, null, _entity_decorators, { kind: "field", name: "entity", static: false, private: false, access: { has: function (obj) { return "entity" in obj; }, get: function (obj) { return obj.entity; }, set: function (obj, value) { obj.entity = value; } }, metadata: _metadata }, _entity_initializers, _entity_extraInitializers);
            __esDecorate(null, null, _userId_decorators, { kind: "field", name: "userId", static: false, private: false, access: { has: function (obj) { return "userId" in obj; }, get: function (obj) { return obj.userId; }, set: function (obj, value) { obj.userId = value; } }, metadata: _metadata }, _userId_initializers, _userId_extraInitializers);
            __esDecorate(null, null, _actionPrefix_decorators, { kind: "field", name: "actionPrefix", static: false, private: false, access: { has: function (obj) { return "actionPrefix" in obj; }, get: function (obj) { return obj.actionPrefix; }, set: function (obj, value) { obj.actionPrefix = value; } }, metadata: _metadata }, _actionPrefix_initializers, _actionPrefix_extraInitializers);
            __esDecorate(null, null, _startDate_decorators, { kind: "field", name: "startDate", static: false, private: false, access: { has: function (obj) { return "startDate" in obj; }, get: function (obj) { return obj.startDate; }, set: function (obj, value) { obj.startDate = value; } }, metadata: _metadata }, _startDate_initializers, _startDate_extraInitializers);
            __esDecorate(null, null, _endDate_decorators, { kind: "field", name: "endDate", static: false, private: false, access: { has: function (obj) { return "endDate" in obj; }, get: function (obj) { return obj.endDate; }, set: function (obj, value) { obj.endDate = value; } }, metadata: _metadata }, _endDate_initializers, _endDate_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.AuditQueryDto = AuditQueryDto;
var AuditRetentionPolicyDto = function () {
    var _a;
    var _auditRetentionDays_decorators;
    var _auditRetentionDays_initializers = [];
    var _auditRetentionDays_extraInitializers = [];
    return _a = /** @class */ (function () {
            function AuditRetentionPolicyDto() {
                this.auditRetentionDays = __runInitializers(this, _auditRetentionDays_initializers, void 0);
                __runInitializers(this, _auditRetentionDays_extraInitializers);
            }
            return AuditRetentionPolicyDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _auditRetentionDays_decorators = [(0, swagger_1.ApiProperty)(), (0, class_validator_1.IsNumber)(), (0, class_validator_1.IsNotEmpty)()];
            __esDecorate(null, null, _auditRetentionDays_decorators, { kind: "field", name: "auditRetentionDays", static: false, private: false, access: { has: function (obj) { return "auditRetentionDays" in obj; }, get: function (obj) { return obj.auditRetentionDays; }, set: function (obj, value) { obj.auditRetentionDays = value; } }, metadata: _metadata }, _auditRetentionDays_initializers, _auditRetentionDays_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.AuditRetentionPolicyDto = AuditRetentionPolicyDto;
// 10. System Settings DTOs
var UpdateSmtpSettingsDto = function () {
    var _a;
    var _smtpHost_decorators;
    var _smtpHost_initializers = [];
    var _smtpHost_extraInitializers = [];
    var _smtpPort_decorators;
    var _smtpPort_initializers = [];
    var _smtpPort_extraInitializers = [];
    var _smtpUser_decorators;
    var _smtpUser_initializers = [];
    var _smtpUser_extraInitializers = [];
    var _smtpSecure_decorators;
    var _smtpSecure_initializers = [];
    var _smtpSecure_extraInitializers = [];
    return _a = /** @class */ (function () {
            function UpdateSmtpSettingsDto() {
                this.smtpHost = __runInitializers(this, _smtpHost_initializers, void 0);
                this.smtpPort = (__runInitializers(this, _smtpHost_extraInitializers), __runInitializers(this, _smtpPort_initializers, void 0));
                this.smtpUser = (__runInitializers(this, _smtpPort_extraInitializers), __runInitializers(this, _smtpUser_initializers, void 0));
                this.smtpSecure = (__runInitializers(this, _smtpUser_extraInitializers), __runInitializers(this, _smtpSecure_initializers, void 0));
                __runInitializers(this, _smtpSecure_extraInitializers);
            }
            return UpdateSmtpSettingsDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _smtpHost_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _smtpPort_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsNumber)(), (0, class_validator_1.IsOptional)()];
            _smtpUser_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _smtpSecure_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsBoolean)(), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _smtpHost_decorators, { kind: "field", name: "smtpHost", static: false, private: false, access: { has: function (obj) { return "smtpHost" in obj; }, get: function (obj) { return obj.smtpHost; }, set: function (obj, value) { obj.smtpHost = value; } }, metadata: _metadata }, _smtpHost_initializers, _smtpHost_extraInitializers);
            __esDecorate(null, null, _smtpPort_decorators, { kind: "field", name: "smtpPort", static: false, private: false, access: { has: function (obj) { return "smtpPort" in obj; }, get: function (obj) { return obj.smtpPort; }, set: function (obj, value) { obj.smtpPort = value; } }, metadata: _metadata }, _smtpPort_initializers, _smtpPort_extraInitializers);
            __esDecorate(null, null, _smtpUser_decorators, { kind: "field", name: "smtpUser", static: false, private: false, access: { has: function (obj) { return "smtpUser" in obj; }, get: function (obj) { return obj.smtpUser; }, set: function (obj, value) { obj.smtpUser = value; } }, metadata: _metadata }, _smtpUser_initializers, _smtpUser_extraInitializers);
            __esDecorate(null, null, _smtpSecure_decorators, { kind: "field", name: "smtpSecure", static: false, private: false, access: { has: function (obj) { return "smtpSecure" in obj; }, get: function (obj) { return obj.smtpSecure; }, set: function (obj, value) { obj.smtpSecure = value; } }, metadata: _metadata }, _smtpSecure_initializers, _smtpSecure_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.UpdateSmtpSettingsDto = UpdateSmtpSettingsDto;
var UpdateStorageSettingsDto = function () {
    var _a;
    var _storageProvider_decorators;
    var _storageProvider_initializers = [];
    var _storageProvider_extraInitializers = [];
    var _s3Bucket_decorators;
    var _s3Bucket_initializers = [];
    var _s3Bucket_extraInitializers = [];
    var _s3Region_decorators;
    var _s3Region_initializers = [];
    var _s3Region_extraInitializers = [];
    return _a = /** @class */ (function () {
            function UpdateStorageSettingsDto() {
                this.storageProvider = __runInitializers(this, _storageProvider_initializers, void 0);
                this.s3Bucket = (__runInitializers(this, _storageProvider_extraInitializers), __runInitializers(this, _s3Bucket_initializers, void 0));
                this.s3Region = (__runInitializers(this, _s3Bucket_extraInitializers), __runInitializers(this, _s3Region_initializers, void 0));
                __runInitializers(this, _s3Region_extraInitializers);
            }
            return UpdateStorageSettingsDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _storageProvider_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _s3Bucket_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _s3Region_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _storageProvider_decorators, { kind: "field", name: "storageProvider", static: false, private: false, access: { has: function (obj) { return "storageProvider" in obj; }, get: function (obj) { return obj.storageProvider; }, set: function (obj, value) { obj.storageProvider = value; } }, metadata: _metadata }, _storageProvider_initializers, _storageProvider_extraInitializers);
            __esDecorate(null, null, _s3Bucket_decorators, { kind: "field", name: "s3Bucket", static: false, private: false, access: { has: function (obj) { return "s3Bucket" in obj; }, get: function (obj) { return obj.s3Bucket; }, set: function (obj, value) { obj.s3Bucket = value; } }, metadata: _metadata }, _s3Bucket_initializers, _s3Bucket_extraInitializers);
            __esDecorate(null, null, _s3Region_decorators, { kind: "field", name: "s3Region", static: false, private: false, access: { has: function (obj) { return "s3Region" in obj; }, get: function (obj) { return obj.s3Region; }, set: function (obj, value) { obj.s3Region = value; } }, metadata: _metadata }, _s3Region_initializers, _s3Region_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.UpdateStorageSettingsDto = UpdateStorageSettingsDto;
var UpdateQueueSettingsDto = function () {
    var _a;
    var _queueConcurrency_decorators;
    var _queueConcurrency_initializers = [];
    var _queueConcurrency_extraInitializers = [];
    var _retryAttempts_decorators;
    var _retryAttempts_initializers = [];
    var _retryAttempts_extraInitializers = [];
    return _a = /** @class */ (function () {
            function UpdateQueueSettingsDto() {
                this.queueConcurrency = __runInitializers(this, _queueConcurrency_initializers, void 0);
                this.retryAttempts = (__runInitializers(this, _queueConcurrency_extraInitializers), __runInitializers(this, _retryAttempts_initializers, void 0));
                __runInitializers(this, _retryAttempts_extraInitializers);
            }
            return UpdateQueueSettingsDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _queueConcurrency_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsNumber)(), (0, class_validator_1.IsOptional)()];
            _retryAttempts_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsNumber)(), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _queueConcurrency_decorators, { kind: "field", name: "queueConcurrency", static: false, private: false, access: { has: function (obj) { return "queueConcurrency" in obj; }, get: function (obj) { return obj.queueConcurrency; }, set: function (obj, value) { obj.queueConcurrency = value; } }, metadata: _metadata }, _queueConcurrency_initializers, _queueConcurrency_extraInitializers);
            __esDecorate(null, null, _retryAttempts_decorators, { kind: "field", name: "retryAttempts", static: false, private: false, access: { has: function (obj) { return "retryAttempts" in obj; }, get: function (obj) { return obj.retryAttempts; }, set: function (obj, value) { obj.retryAttempts = value; } }, metadata: _metadata }, _retryAttempts_initializers, _retryAttempts_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.UpdateQueueSettingsDto = UpdateQueueSettingsDto;
var UpdateRedisSettingsDto = function () {
    var _a;
    var _redisHost_decorators;
    var _redisHost_initializers = [];
    var _redisHost_extraInitializers = [];
    var _redisPort_decorators;
    var _redisPort_initializers = [];
    var _redisPort_extraInitializers = [];
    var _cacheTtl_decorators;
    var _cacheTtl_initializers = [];
    var _cacheTtl_extraInitializers = [];
    return _a = /** @class */ (function () {
            function UpdateRedisSettingsDto() {
                this.redisHost = __runInitializers(this, _redisHost_initializers, void 0);
                this.redisPort = (__runInitializers(this, _redisHost_extraInitializers), __runInitializers(this, _redisPort_initializers, void 0));
                this.cacheTtl = (__runInitializers(this, _redisPort_extraInitializers), __runInitializers(this, _cacheTtl_initializers, void 0));
                __runInitializers(this, _cacheTtl_extraInitializers);
            }
            return UpdateRedisSettingsDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _redisHost_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _redisPort_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsNumber)(), (0, class_validator_1.IsOptional)()];
            _cacheTtl_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsNumber)(), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _redisHost_decorators, { kind: "field", name: "redisHost", static: false, private: false, access: { has: function (obj) { return "redisHost" in obj; }, get: function (obj) { return obj.redisHost; }, set: function (obj, value) { obj.redisHost = value; } }, metadata: _metadata }, _redisHost_initializers, _redisHost_extraInitializers);
            __esDecorate(null, null, _redisPort_decorators, { kind: "field", name: "redisPort", static: false, private: false, access: { has: function (obj) { return "redisPort" in obj; }, get: function (obj) { return obj.redisPort; }, set: function (obj, value) { obj.redisPort = value; } }, metadata: _metadata }, _redisPort_initializers, _redisPort_extraInitializers);
            __esDecorate(null, null, _cacheTtl_decorators, { kind: "field", name: "cacheTtl", static: false, private: false, access: { has: function (obj) { return "cacheTtl" in obj; }, get: function (obj) { return obj.cacheTtl; }, set: function (obj, value) { obj.cacheTtl = value; } }, metadata: _metadata }, _cacheTtl_initializers, _cacheTtl_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.UpdateRedisSettingsDto = UpdateRedisSettingsDto;
var UpdateCdnSettingsDto = function () {
    var _a;
    var _cdnUrl_decorators;
    var _cdnUrl_initializers = [];
    var _cdnUrl_extraInitializers = [];
    var _cdnEnabled_decorators;
    var _cdnEnabled_initializers = [];
    var _cdnEnabled_extraInitializers = [];
    return _a = /** @class */ (function () {
            function UpdateCdnSettingsDto() {
                this.cdnUrl = __runInitializers(this, _cdnUrl_initializers, void 0);
                this.cdnEnabled = (__runInitializers(this, _cdnUrl_extraInitializers), __runInitializers(this, _cdnEnabled_initializers, void 0));
                __runInitializers(this, _cdnEnabled_extraInitializers);
            }
            return UpdateCdnSettingsDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _cdnUrl_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _cdnEnabled_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsBoolean)(), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _cdnUrl_decorators, { kind: "field", name: "cdnUrl", static: false, private: false, access: { has: function (obj) { return "cdnUrl" in obj; }, get: function (obj) { return obj.cdnUrl; }, set: function (obj, value) { obj.cdnUrl = value; } }, metadata: _metadata }, _cdnUrl_initializers, _cdnUrl_extraInitializers);
            __esDecorate(null, null, _cdnEnabled_decorators, { kind: "field", name: "cdnEnabled", static: false, private: false, access: { has: function (obj) { return "cdnEnabled" in obj; }, get: function (obj) { return obj.cdnEnabled; }, set: function (obj, value) { obj.cdnEnabled = value; } }, metadata: _metadata }, _cdnEnabled_initializers, _cdnEnabled_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.UpdateCdnSettingsDto = UpdateCdnSettingsDto;
var UpdateMaintenanceModeDto = function () {
    var _a;
    var _maintenanceMode_decorators;
    var _maintenanceMode_initializers = [];
    var _maintenanceMode_extraInitializers = [];
    var _maintenanceMessage_decorators;
    var _maintenanceMessage_initializers = [];
    var _maintenanceMessage_extraInitializers = [];
    return _a = /** @class */ (function () {
            function UpdateMaintenanceModeDto() {
                this.maintenanceMode = __runInitializers(this, _maintenanceMode_initializers, void 0);
                this.maintenanceMessage = (__runInitializers(this, _maintenanceMode_extraInitializers), __runInitializers(this, _maintenanceMessage_initializers, void 0));
                __runInitializers(this, _maintenanceMessage_extraInitializers);
            }
            return UpdateMaintenanceModeDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _maintenanceMode_decorators = [(0, swagger_1.ApiProperty)(), (0, class_validator_1.IsBoolean)(), (0, class_validator_1.IsNotEmpty)()];
            _maintenanceMessage_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _maintenanceMode_decorators, { kind: "field", name: "maintenanceMode", static: false, private: false, access: { has: function (obj) { return "maintenanceMode" in obj; }, get: function (obj) { return obj.maintenanceMode; }, set: function (obj, value) { obj.maintenanceMode = value; } }, metadata: _metadata }, _maintenanceMode_initializers, _maintenanceMode_extraInitializers);
            __esDecorate(null, null, _maintenanceMessage_decorators, { kind: "field", name: "maintenanceMessage", static: false, private: false, access: { has: function (obj) { return "maintenanceMessage" in obj; }, get: function (obj) { return obj.maintenanceMessage; }, set: function (obj, value) { obj.maintenanceMessage = value; } }, metadata: _metadata }, _maintenanceMessage_initializers, _maintenanceMessage_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.UpdateMaintenanceModeDto = UpdateMaintenanceModeDto;
// 11. Truck Capacity Management DTOs (Enterprise Licensing Engine)
var SetTruckLimitDto = function () {
    var _a;
    var _maxVehicles_decorators;
    var _maxVehicles_initializers = [];
    var _maxVehicles_extraInitializers = [];
    var _reason_decorators;
    var _reason_initializers = [];
    var _reason_extraInitializers = [];
    return _a = /** @class */ (function () {
            function SetTruckLimitDto() {
                this.maxVehicles = __runInitializers(this, _maxVehicles_initializers, void 0);
                this.reason = (__runInitializers(this, _maxVehicles_extraInitializers), __runInitializers(this, _reason_initializers, void 0));
                __runInitializers(this, _reason_extraInitializers);
            }
            return SetTruckLimitDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _maxVehicles_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'New maximum vehicle/truck limit for the tenant',
                    minimum: 1,
                }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.IsNotEmpty)()];
            _reason_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Reason for the override (for audit log)',
                }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _maxVehicles_decorators, { kind: "field", name: "maxVehicles", static: false, private: false, access: { has: function (obj) { return "maxVehicles" in obj; }, get: function (obj) { return obj.maxVehicles; }, set: function (obj, value) { obj.maxVehicles = value; } }, metadata: _metadata }, _maxVehicles_initializers, _maxVehicles_extraInitializers);
            __esDecorate(null, null, _reason_decorators, { kind: "field", name: "reason", static: false, private: false, access: { has: function (obj) { return "reason" in obj; }, get: function (obj) { return obj.reason; }, set: function (obj, value) { obj.reason = value; } }, metadata: _metadata }, _reason_initializers, _reason_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.SetTruckLimitDto = SetTruckLimitDto;
var SetDriverLimitDto = function () {
    var _a;
    var _maxDrivers_decorators;
    var _maxDrivers_initializers = [];
    var _maxDrivers_extraInitializers = [];
    var _reason_decorators;
    var _reason_initializers = [];
    var _reason_extraInitializers = [];
    return _a = /** @class */ (function () {
            function SetDriverLimitDto() {
                this.maxDrivers = __runInitializers(this, _maxDrivers_initializers, void 0);
                this.reason = (__runInitializers(this, _maxDrivers_extraInitializers), __runInitializers(this, _reason_initializers, void 0));
                __runInitializers(this, _reason_extraInitializers);
            }
            return SetDriverLimitDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _maxDrivers_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'New maximum driver limit for the tenant',
                    minimum: 1,
                }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.IsNotEmpty)()];
            _reason_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _maxDrivers_decorators, { kind: "field", name: "maxDrivers", static: false, private: false, access: { has: function (obj) { return "maxDrivers" in obj; }, get: function (obj) { return obj.maxDrivers; }, set: function (obj, value) { obj.maxDrivers = value; } }, metadata: _metadata }, _maxDrivers_initializers, _maxDrivers_extraInitializers);
            __esDecorate(null, null, _reason_decorators, { kind: "field", name: "reason", static: false, private: false, access: { has: function (obj) { return "reason" in obj; }, get: function (obj) { return obj.reason; }, set: function (obj, value) { obj.reason = value; } }, metadata: _metadata }, _reason_initializers, _reason_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.SetDriverLimitDto = SetDriverLimitDto;
var SetBoostDto = function () {
    var _a;
    var _boostMaxVehicles_decorators;
    var _boostMaxVehicles_initializers = [];
    var _boostMaxVehicles_extraInitializers = [];
    var _boostExpiresAt_decorators;
    var _boostExpiresAt_initializers = [];
    var _boostExpiresAt_extraInitializers = [];
    var _reason_decorators;
    var _reason_initializers = [];
    var _reason_extraInitializers = [];
    return _a = /** @class */ (function () {
            function SetBoostDto() {
                this.boostMaxVehicles = __runInitializers(this, _boostMaxVehicles_initializers, void 0);
                this.boostExpiresAt = (__runInitializers(this, _boostMaxVehicles_extraInitializers), __runInitializers(this, _boostExpiresAt_initializers, void 0));
                this.reason = (__runInitializers(this, _boostExpiresAt_extraInitializers), __runInitializers(this, _reason_initializers, void 0));
                __runInitializers(this, _reason_extraInitializers);
            }
            return SetBoostDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _boostMaxVehicles_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Temporary maximum vehicle limit during boost period',
                    minimum: 1,
                }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.IsNotEmpty)()];
            _boostExpiresAt_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'ISO 8601 datetime when the boost expires',
                    example: '2026-09-01T00:00:00Z',
                }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _reason_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _boostMaxVehicles_decorators, { kind: "field", name: "boostMaxVehicles", static: false, private: false, access: { has: function (obj) { return "boostMaxVehicles" in obj; }, get: function (obj) { return obj.boostMaxVehicles; }, set: function (obj, value) { obj.boostMaxVehicles = value; } }, metadata: _metadata }, _boostMaxVehicles_initializers, _boostMaxVehicles_extraInitializers);
            __esDecorate(null, null, _boostExpiresAt_decorators, { kind: "field", name: "boostExpiresAt", static: false, private: false, access: { has: function (obj) { return "boostExpiresAt" in obj; }, get: function (obj) { return obj.boostExpiresAt; }, set: function (obj, value) { obj.boostExpiresAt = value; } }, metadata: _metadata }, _boostExpiresAt_initializers, _boostExpiresAt_extraInitializers);
            __esDecorate(null, null, _reason_decorators, { kind: "field", name: "reason", static: false, private: false, access: { has: function (obj) { return "reason" in obj; }, get: function (obj) { return obj.reason; }, set: function (obj, value) { obj.reason = value; } }, metadata: _metadata }, _reason_initializers, _reason_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.SetBoostDto = SetBoostDto;
var SetUnlimitedModeDto = function () {
    var _a;
    var _unlimited_decorators;
    var _unlimited_initializers = [];
    var _unlimited_extraInitializers = [];
    var _reason_decorators;
    var _reason_initializers = [];
    var _reason_extraInitializers = [];
    return _a = /** @class */ (function () {
            function SetUnlimitedModeDto() {
                this.unlimited = __runInitializers(this, _unlimited_initializers, void 0);
                this.reason = (__runInitializers(this, _unlimited_extraInitializers), __runInitializers(this, _reason_initializers, void 0));
                __runInitializers(this, _reason_extraInitializers);
            }
            return SetUnlimitedModeDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _unlimited_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Enable or disable unlimited mode (bypasses all capacity checks)',
                }), (0, class_validator_1.IsBoolean)(), (0, class_validator_1.IsNotEmpty)()];
            _reason_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _unlimited_decorators, { kind: "field", name: "unlimited", static: false, private: false, access: { has: function (obj) { return "unlimited" in obj; }, get: function (obj) { return obj.unlimited; }, set: function (obj, value) { obj.unlimited = value; } }, metadata: _metadata }, _unlimited_initializers, _unlimited_extraInitializers);
            __esDecorate(null, null, _reason_decorators, { kind: "field", name: "reason", static: false, private: false, access: { has: function (obj) { return "reason" in obj; }, get: function (obj) { return obj.reason; }, set: function (obj, value) { obj.reason = value; } }, metadata: _metadata }, _reason_initializers, _reason_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.SetUnlimitedModeDto = SetUnlimitedModeDto;
