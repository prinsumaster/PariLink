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
exports.UpdateTenantConfigDto = exports.CreateSubscriptionPlanDto = exports.CreateTenantDto = void 0;
var class_validator_1 = require("class-validator");
var swagger_1 = require("@nestjs/swagger");
var CreateTenantDto = function () {
    var _a;
    var _name_decorators;
    var _name_initializers = [];
    var _name_extraInitializers = [];
    var _adminEmail_decorators;
    var _adminEmail_initializers = [];
    var _adminEmail_extraInitializers = [];
    var _adminPassword_decorators;
    var _adminPassword_initializers = [];
    var _adminPassword_extraInitializers = [];
    var _adminFirstName_decorators;
    var _adminFirstName_initializers = [];
    var _adminFirstName_extraInitializers = [];
    var _adminLastName_decorators;
    var _adminLastName_initializers = [];
    var _adminLastName_extraInitializers = [];
    var _subscriptionPlanId_decorators;
    var _subscriptionPlanId_initializers = [];
    var _subscriptionPlanId_extraInitializers = [];
    return _a = /** @class */ (function () {
            function CreateTenantDto() {
                this.name = __runInitializers(this, _name_initializers, void 0);
                this.adminEmail = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _adminEmail_initializers, void 0));
                this.adminPassword = (__runInitializers(this, _adminEmail_extraInitializers), __runInitializers(this, _adminPassword_initializers, void 0));
                this.adminFirstName = (__runInitializers(this, _adminPassword_extraInitializers), __runInitializers(this, _adminFirstName_initializers, void 0));
                this.adminLastName = (__runInitializers(this, _adminFirstName_extraInitializers), __runInitializers(this, _adminLastName_initializers, void 0));
                this.subscriptionPlanId = (__runInitializers(this, _adminLastName_extraInitializers), __runInitializers(this, _subscriptionPlanId_initializers, void 0));
                __runInitializers(this, _subscriptionPlanId_extraInitializers);
            }
            return CreateTenantDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _name_decorators = [(0, swagger_1.ApiProperty)(), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _adminEmail_decorators = [(0, swagger_1.ApiProperty)(), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _adminPassword_decorators = [(0, swagger_1.ApiProperty)(), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _adminFirstName_decorators = [(0, swagger_1.ApiProperty)(), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _adminLastName_decorators = [(0, swagger_1.ApiProperty)(), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _subscriptionPlanId_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: function (obj) { return "name" in obj; }, get: function (obj) { return obj.name; }, set: function (obj, value) { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
            __esDecorate(null, null, _adminEmail_decorators, { kind: "field", name: "adminEmail", static: false, private: false, access: { has: function (obj) { return "adminEmail" in obj; }, get: function (obj) { return obj.adminEmail; }, set: function (obj, value) { obj.adminEmail = value; } }, metadata: _metadata }, _adminEmail_initializers, _adminEmail_extraInitializers);
            __esDecorate(null, null, _adminPassword_decorators, { kind: "field", name: "adminPassword", static: false, private: false, access: { has: function (obj) { return "adminPassword" in obj; }, get: function (obj) { return obj.adminPassword; }, set: function (obj, value) { obj.adminPassword = value; } }, metadata: _metadata }, _adminPassword_initializers, _adminPassword_extraInitializers);
            __esDecorate(null, null, _adminFirstName_decorators, { kind: "field", name: "adminFirstName", static: false, private: false, access: { has: function (obj) { return "adminFirstName" in obj; }, get: function (obj) { return obj.adminFirstName; }, set: function (obj, value) { obj.adminFirstName = value; } }, metadata: _metadata }, _adminFirstName_initializers, _adminFirstName_extraInitializers);
            __esDecorate(null, null, _adminLastName_decorators, { kind: "field", name: "adminLastName", static: false, private: false, access: { has: function (obj) { return "adminLastName" in obj; }, get: function (obj) { return obj.adminLastName; }, set: function (obj, value) { obj.adminLastName = value; } }, metadata: _metadata }, _adminLastName_initializers, _adminLastName_extraInitializers);
            __esDecorate(null, null, _subscriptionPlanId_decorators, { kind: "field", name: "subscriptionPlanId", static: false, private: false, access: { has: function (obj) { return "subscriptionPlanId" in obj; }, get: function (obj) { return obj.subscriptionPlanId; }, set: function (obj, value) { obj.subscriptionPlanId = value; } }, metadata: _metadata }, _subscriptionPlanId_initializers, _subscriptionPlanId_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.CreateTenantDto = CreateTenantDto;
var CreateSubscriptionPlanDto = function () {
    var _a;
    var _name_decorators;
    var _name_initializers = [];
    var _name_extraInitializers = [];
    var _description_decorators;
    var _description_initializers = [];
    var _description_extraInitializers = [];
    var _price_decorators;
    var _price_initializers = [];
    var _price_extraInitializers = [];
    var _currency_decorators;
    var _currency_initializers = [];
    var _currency_extraInitializers = [];
    var _features_decorators;
    var _features_initializers = [];
    var _features_extraInitializers = [];
    return _a = /** @class */ (function () {
            function CreateSubscriptionPlanDto() {
                this.name = __runInitializers(this, _name_initializers, void 0);
                this.description = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.price = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _price_initializers, void 0));
                this.currency = (__runInitializers(this, _price_extraInitializers), __runInitializers(this, _currency_initializers, void 0));
                this.features = (__runInitializers(this, _currency_extraInitializers), __runInitializers(this, _features_initializers, void 0));
                __runInitializers(this, _features_extraInitializers);
            }
            return CreateSubscriptionPlanDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _name_decorators = [(0, swagger_1.ApiProperty)(), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _description_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _price_decorators = [(0, swagger_1.ApiProperty)(), (0, class_validator_1.IsNumber)()];
            _currency_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _features_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsObject)(), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: function (obj) { return "name" in obj; }, get: function (obj) { return obj.name; }, set: function (obj, value) { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: function (obj) { return "description" in obj; }, get: function (obj) { return obj.description; }, set: function (obj, value) { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _price_decorators, { kind: "field", name: "price", static: false, private: false, access: { has: function (obj) { return "price" in obj; }, get: function (obj) { return obj.price; }, set: function (obj, value) { obj.price = value; } }, metadata: _metadata }, _price_initializers, _price_extraInitializers);
            __esDecorate(null, null, _currency_decorators, { kind: "field", name: "currency", static: false, private: false, access: { has: function (obj) { return "currency" in obj; }, get: function (obj) { return obj.currency; }, set: function (obj, value) { obj.currency = value; } }, metadata: _metadata }, _currency_initializers, _currency_extraInitializers);
            __esDecorate(null, null, _features_decorators, { kind: "field", name: "features", static: false, private: false, access: { has: function (obj) { return "features" in obj; }, get: function (obj) { return obj.features; }, set: function (obj, value) { obj.features = value; } }, metadata: _metadata }, _features_initializers, _features_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.CreateSubscriptionPlanDto = CreateSubscriptionPlanDto;
var UpdateTenantConfigDto = function () {
    var _a;
    var _settings_decorators;
    var _settings_initializers = [];
    var _settings_extraInitializers = [];
    var _theme_decorators;
    var _theme_initializers = [];
    var _theme_extraInitializers = [];
    var _policies_decorators;
    var _policies_initializers = [];
    var _policies_extraInitializers = [];
    return _a = /** @class */ (function () {
            function UpdateTenantConfigDto() {
                this.settings = __runInitializers(this, _settings_initializers, void 0);
                this.theme = (__runInitializers(this, _settings_extraInitializers), __runInitializers(this, _theme_initializers, void 0));
                this.policies = (__runInitializers(this, _theme_extraInitializers), __runInitializers(this, _policies_initializers, void 0));
                __runInitializers(this, _policies_extraInitializers);
            }
            return UpdateTenantConfigDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _settings_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsObject)(), (0, class_validator_1.IsOptional)()];
            _theme_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsObject)(), (0, class_validator_1.IsOptional)()];
            _policies_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsObject)(), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _settings_decorators, { kind: "field", name: "settings", static: false, private: false, access: { has: function (obj) { return "settings" in obj; }, get: function (obj) { return obj.settings; }, set: function (obj, value) { obj.settings = value; } }, metadata: _metadata }, _settings_initializers, _settings_extraInitializers);
            __esDecorate(null, null, _theme_decorators, { kind: "field", name: "theme", static: false, private: false, access: { has: function (obj) { return "theme" in obj; }, get: function (obj) { return obj.theme; }, set: function (obj, value) { obj.theme = value; } }, metadata: _metadata }, _theme_initializers, _theme_extraInitializers);
            __esDecorate(null, null, _policies_decorators, { kind: "field", name: "policies", static: false, private: false, access: { has: function (obj) { return "policies" in obj; }, get: function (obj) { return obj.policies; }, set: function (obj, value) { obj.policies = value; } }, metadata: _metadata }, _policies_initializers, _policies_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.UpdateTenantConfigDto = UpdateTenantConfigDto;
