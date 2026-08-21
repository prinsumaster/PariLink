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
exports.InstallAppDto = exports.WebhookConfigDto = void 0;
var class_validator_1 = require("class-validator");
var class_transformer_1 = require("class-transformer");
var WebhookConfigDto = function () {
    var _a;
    var _url_decorators;
    var _url_initializers = [];
    var _url_extraInitializers = [];
    var _events_decorators;
    var _events_initializers = [];
    var _events_extraInitializers = [];
    return _a = /** @class */ (function () {
            function WebhookConfigDto() {
                this.url = __runInitializers(this, _url_initializers, void 0);
                this.events = (__runInitializers(this, _url_extraInitializers), __runInitializers(this, _events_initializers, void 0));
                __runInitializers(this, _events_extraInitializers);
            }
            return WebhookConfigDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _url_decorators = [(0, class_validator_1.IsString)()];
            _events_decorators = [(0, class_validator_1.IsArray)(), (0, class_validator_1.IsString)({ each: true })];
            __esDecorate(null, null, _url_decorators, { kind: "field", name: "url", static: false, private: false, access: { has: function (obj) { return "url" in obj; }, get: function (obj) { return obj.url; }, set: function (obj, value) { obj.url = value; } }, metadata: _metadata }, _url_initializers, _url_extraInitializers);
            __esDecorate(null, null, _events_decorators, { kind: "field", name: "events", static: false, private: false, access: { has: function (obj) { return "events" in obj; }, get: function (obj) { return obj.events; }, set: function (obj, value) { obj.events = value; } }, metadata: _metadata }, _events_initializers, _events_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.WebhookConfigDto = WebhookConfigDto;
var InstallAppDto = function () {
    var _a;
    var _appId_decorators;
    var _appId_initializers = [];
    var _appId_extraInitializers = [];
    var _version_decorators;
    var _version_initializers = [];
    var _version_extraInitializers = [];
    var _credentials_decorators;
    var _credentials_initializers = [];
    var _credentials_extraInitializers = [];
    var _settings_decorators;
    var _settings_initializers = [];
    var _settings_extraInitializers = [];
    var _webhooks_decorators;
    var _webhooks_initializers = [];
    var _webhooks_extraInitializers = [];
    return _a = /** @class */ (function () {
            function InstallAppDto() {
                this.appId = __runInitializers(this, _appId_initializers, void 0);
                this.version = (__runInitializers(this, _appId_extraInitializers), __runInitializers(this, _version_initializers, void 0));
                this.credentials = (__runInitializers(this, _version_extraInitializers), __runInitializers(this, _credentials_initializers, void 0));
                this.settings = (__runInitializers(this, _credentials_extraInitializers), __runInitializers(this, _settings_initializers, void 0));
                this.webhooks = (__runInitializers(this, _settings_extraInitializers), __runInitializers(this, _webhooks_initializers, void 0));
                __runInitializers(this, _webhooks_extraInitializers);
            }
            return InstallAppDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _appId_decorators = [(0, class_validator_1.IsString)()];
            _version_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _credentials_decorators = [(0, class_validator_1.IsObject)(), (0, class_validator_1.IsOptional)()];
            _settings_decorators = [(0, class_validator_1.IsObject)(), (0, class_validator_1.IsOptional)()];
            _webhooks_decorators = [(0, class_validator_1.IsArray)(), (0, class_validator_1.ValidateNested)({ each: true }), (0, class_transformer_1.Type)(function () { return WebhookConfigDto; }), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _appId_decorators, { kind: "field", name: "appId", static: false, private: false, access: { has: function (obj) { return "appId" in obj; }, get: function (obj) { return obj.appId; }, set: function (obj, value) { obj.appId = value; } }, metadata: _metadata }, _appId_initializers, _appId_extraInitializers);
            __esDecorate(null, null, _version_decorators, { kind: "field", name: "version", static: false, private: false, access: { has: function (obj) { return "version" in obj; }, get: function (obj) { return obj.version; }, set: function (obj, value) { obj.version = value; } }, metadata: _metadata }, _version_initializers, _version_extraInitializers);
            __esDecorate(null, null, _credentials_decorators, { kind: "field", name: "credentials", static: false, private: false, access: { has: function (obj) { return "credentials" in obj; }, get: function (obj) { return obj.credentials; }, set: function (obj, value) { obj.credentials = value; } }, metadata: _metadata }, _credentials_initializers, _credentials_extraInitializers);
            __esDecorate(null, null, _settings_decorators, { kind: "field", name: "settings", static: false, private: false, access: { has: function (obj) { return "settings" in obj; }, get: function (obj) { return obj.settings; }, set: function (obj, value) { obj.settings = value; } }, metadata: _metadata }, _settings_initializers, _settings_extraInitializers);
            __esDecorate(null, null, _webhooks_decorators, { kind: "field", name: "webhooks", static: false, private: false, access: { has: function (obj) { return "webhooks" in obj; }, get: function (obj) { return obj.webhooks; }, set: function (obj, value) { obj.webhooks = value; } }, metadata: _metadata }, _webhooks_initializers, _webhooks_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.InstallAppDto = InstallAppDto;
