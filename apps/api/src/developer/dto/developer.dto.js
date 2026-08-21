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
exports.UpdateDeveloperAppDto = exports.CreateDeveloperAppDto = void 0;
var class_validator_1 = require("class-validator");
var swagger_1 = require("@nestjs/swagger");
var CreateDeveloperAppDto = function () {
    var _a;
    var _name_decorators;
    var _name_initializers = [];
    var _name_extraInitializers = [];
    var _description_decorators;
    var _description_initializers = [];
    var _description_extraInitializers = [];
    var _websiteUrl_decorators;
    var _websiteUrl_initializers = [];
    var _websiteUrl_extraInitializers = [];
    var _environment_decorators;
    var _environment_initializers = [];
    var _environment_extraInitializers = [];
    var _scopes_decorators;
    var _scopes_initializers = [];
    var _scopes_extraInitializers = [];
    var _redirectUris_decorators;
    var _redirectUris_initializers = [];
    var _redirectUris_extraInitializers = [];
    var _webhookUrl_decorators;
    var _webhookUrl_initializers = [];
    var _webhookUrl_extraInitializers = [];
    return _a = /** @class */ (function () {
            function CreateDeveloperAppDto() {
                this.name = __runInitializers(this, _name_initializers, void 0);
                this.description = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.websiteUrl = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _websiteUrl_initializers, void 0));
                this.environment = (__runInitializers(this, _websiteUrl_extraInitializers), __runInitializers(this, _environment_initializers, void 0));
                this.scopes = (__runInitializers(this, _environment_extraInitializers), __runInitializers(this, _scopes_initializers, void 0));
                this.redirectUris = (__runInitializers(this, _scopes_extraInitializers), __runInitializers(this, _redirectUris_initializers, void 0));
                this.webhookUrl = (__runInitializers(this, _redirectUris_extraInitializers), __runInitializers(this, _webhookUrl_initializers, void 0));
                __runInitializers(this, _webhookUrl_extraInitializers);
            }
            return CreateDeveloperAppDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _name_decorators = [(0, swagger_1.ApiProperty)({ example: 'My Integration App' }), (0, class_validator_1.IsString)()];
            _description_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: 'Fetches load data for logistics' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _websiteUrl_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: 'https://myapp.com' }), (0, class_validator_1.IsUrl)(), (0, class_validator_1.IsOptional)()];
            _environment_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: 'DEVELOPMENT' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _scopes_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    type: [String],
                    example: ['read:loads', 'write:loads'],
                }), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsString)({ each: true }), (0, class_validator_1.IsOptional)()];
            _redirectUris_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    type: [String],
                    example: ['https://myapp.com/callback'],
                }), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsUrl)({}, { each: true }), (0, class_validator_1.IsOptional)()];
            _webhookUrl_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: 'https://myapp.com/webhook' }), (0, class_validator_1.IsUrl)(), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: function (obj) { return "name" in obj; }, get: function (obj) { return obj.name; }, set: function (obj, value) { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: function (obj) { return "description" in obj; }, get: function (obj) { return obj.description; }, set: function (obj, value) { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _websiteUrl_decorators, { kind: "field", name: "websiteUrl", static: false, private: false, access: { has: function (obj) { return "websiteUrl" in obj; }, get: function (obj) { return obj.websiteUrl; }, set: function (obj, value) { obj.websiteUrl = value; } }, metadata: _metadata }, _websiteUrl_initializers, _websiteUrl_extraInitializers);
            __esDecorate(null, null, _environment_decorators, { kind: "field", name: "environment", static: false, private: false, access: { has: function (obj) { return "environment" in obj; }, get: function (obj) { return obj.environment; }, set: function (obj, value) { obj.environment = value; } }, metadata: _metadata }, _environment_initializers, _environment_extraInitializers);
            __esDecorate(null, null, _scopes_decorators, { kind: "field", name: "scopes", static: false, private: false, access: { has: function (obj) { return "scopes" in obj; }, get: function (obj) { return obj.scopes; }, set: function (obj, value) { obj.scopes = value; } }, metadata: _metadata }, _scopes_initializers, _scopes_extraInitializers);
            __esDecorate(null, null, _redirectUris_decorators, { kind: "field", name: "redirectUris", static: false, private: false, access: { has: function (obj) { return "redirectUris" in obj; }, get: function (obj) { return obj.redirectUris; }, set: function (obj, value) { obj.redirectUris = value; } }, metadata: _metadata }, _redirectUris_initializers, _redirectUris_extraInitializers);
            __esDecorate(null, null, _webhookUrl_decorators, { kind: "field", name: "webhookUrl", static: false, private: false, access: { has: function (obj) { return "webhookUrl" in obj; }, get: function (obj) { return obj.webhookUrl; }, set: function (obj, value) { obj.webhookUrl = value; } }, metadata: _metadata }, _webhookUrl_initializers, _webhookUrl_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.CreateDeveloperAppDto = CreateDeveloperAppDto;
var UpdateDeveloperAppDto = function () {
    var _a;
    var _name_decorators;
    var _name_initializers = [];
    var _name_extraInitializers = [];
    var _description_decorators;
    var _description_initializers = [];
    var _description_extraInitializers = [];
    var _websiteUrl_decorators;
    var _websiteUrl_initializers = [];
    var _websiteUrl_extraInitializers = [];
    var _scopes_decorators;
    var _scopes_initializers = [];
    var _scopes_extraInitializers = [];
    var _redirectUris_decorators;
    var _redirectUris_initializers = [];
    var _redirectUris_extraInitializers = [];
    var _webhookUrl_decorators;
    var _webhookUrl_initializers = [];
    var _webhookUrl_extraInitializers = [];
    return _a = /** @class */ (function () {
            function UpdateDeveloperAppDto() {
                this.name = __runInitializers(this, _name_initializers, void 0);
                this.description = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.websiteUrl = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _websiteUrl_initializers, void 0));
                this.scopes = (__runInitializers(this, _websiteUrl_extraInitializers), __runInitializers(this, _scopes_initializers, void 0));
                this.redirectUris = (__runInitializers(this, _scopes_extraInitializers), __runInitializers(this, _redirectUris_initializers, void 0));
                this.webhookUrl = (__runInitializers(this, _redirectUris_extraInitializers), __runInitializers(this, _webhookUrl_initializers, void 0));
                __runInitializers(this, _webhookUrl_extraInitializers);
            }
            return UpdateDeveloperAppDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _name_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: 'My Integration App' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _description_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: 'Fetches load data for logistics' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _websiteUrl_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: 'https://myapp.com' }), (0, class_validator_1.IsUrl)(), (0, class_validator_1.IsOptional)()];
            _scopes_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    type: [String],
                    example: ['read:loads', 'write:loads'],
                }), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsString)({ each: true }), (0, class_validator_1.IsOptional)()];
            _redirectUris_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    type: [String],
                    example: ['https://myapp.com/callback'],
                }), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsUrl)({}, { each: true }), (0, class_validator_1.IsOptional)()];
            _webhookUrl_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: 'https://myapp.com/webhook' }), (0, class_validator_1.IsUrl)(), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: function (obj) { return "name" in obj; }, get: function (obj) { return obj.name; }, set: function (obj, value) { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: function (obj) { return "description" in obj; }, get: function (obj) { return obj.description; }, set: function (obj, value) { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _websiteUrl_decorators, { kind: "field", name: "websiteUrl", static: false, private: false, access: { has: function (obj) { return "websiteUrl" in obj; }, get: function (obj) { return obj.websiteUrl; }, set: function (obj, value) { obj.websiteUrl = value; } }, metadata: _metadata }, _websiteUrl_initializers, _websiteUrl_extraInitializers);
            __esDecorate(null, null, _scopes_decorators, { kind: "field", name: "scopes", static: false, private: false, access: { has: function (obj) { return "scopes" in obj; }, get: function (obj) { return obj.scopes; }, set: function (obj, value) { obj.scopes = value; } }, metadata: _metadata }, _scopes_initializers, _scopes_extraInitializers);
            __esDecorate(null, null, _redirectUris_decorators, { kind: "field", name: "redirectUris", static: false, private: false, access: { has: function (obj) { return "redirectUris" in obj; }, get: function (obj) { return obj.redirectUris; }, set: function (obj, value) { obj.redirectUris = value; } }, metadata: _metadata }, _redirectUris_initializers, _redirectUris_extraInitializers);
            __esDecorate(null, null, _webhookUrl_decorators, { kind: "field", name: "webhookUrl", static: false, private: false, access: { has: function (obj) { return "webhookUrl" in obj; }, get: function (obj) { return obj.webhookUrl; }, set: function (obj, value) { obj.webhookUrl = value; } }, metadata: _metadata }, _webhookUrl_initializers, _webhookUrl_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.UpdateDeveloperAppDto = UpdateDeveloperAppDto;
