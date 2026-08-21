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
exports.EnvironmentVariables = void 0;
var class_validator_1 = require("class-validator");
var EnvironmentVariables = function () {
    var _a;
    var _NODE_ENV_decorators;
    var _NODE_ENV_initializers = [];
    var _NODE_ENV_extraInitializers = [];
    var _DATABASE_URL_decorators;
    var _DATABASE_URL_initializers = [];
    var _DATABASE_URL_extraInitializers = [];
    var _REDIS_URL_decorators;
    var _REDIS_URL_initializers = [];
    var _REDIS_URL_extraInitializers = [];
    var _COOKIE_SECRET_decorators;
    var _COOKIE_SECRET_initializers = [];
    var _COOKIE_SECRET_extraInitializers = [];
    var _MASTER_ENCRYPTION_KEY_V1_decorators;
    var _MASTER_ENCRYPTION_KEY_V1_initializers = [];
    var _MASTER_ENCRYPTION_KEY_V1_extraInitializers = [];
    var _CORS_ALLOWED_ORIGINS_decorators;
    var _CORS_ALLOWED_ORIGINS_initializers = [];
    var _CORS_ALLOWED_ORIGINS_extraInitializers = [];
    return _a = /** @class */ (function () {
            function EnvironmentVariables() {
                this.NODE_ENV = __runInitializers(this, _NODE_ENV_initializers, void 0);
                this.DATABASE_URL = (__runInitializers(this, _NODE_ENV_extraInitializers), __runInitializers(this, _DATABASE_URL_initializers, void 0));
                this.REDIS_URL = (__runInitializers(this, _DATABASE_URL_extraInitializers), __runInitializers(this, _REDIS_URL_initializers, void 0));
                this.COOKIE_SECRET = (__runInitializers(this, _REDIS_URL_extraInitializers), __runInitializers(this, _COOKIE_SECRET_initializers, void 0));
                this.MASTER_ENCRYPTION_KEY_V1 = (__runInitializers(this, _COOKIE_SECRET_extraInitializers), __runInitializers(this, _MASTER_ENCRYPTION_KEY_V1_initializers, void 0));
                this.CORS_ALLOWED_ORIGINS = (__runInitializers(this, _MASTER_ENCRYPTION_KEY_V1_extraInitializers), __runInitializers(this, _CORS_ALLOWED_ORIGINS_initializers, void 0));
                __runInitializers(this, _CORS_ALLOWED_ORIGINS_extraInitializers);
            }
            return EnvironmentVariables;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _NODE_ENV_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _DATABASE_URL_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _REDIS_URL_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _COOKIE_SECRET_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _MASTER_ENCRYPTION_KEY_V1_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _CORS_ALLOWED_ORIGINS_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            __esDecorate(null, null, _NODE_ENV_decorators, { kind: "field", name: "NODE_ENV", static: false, private: false, access: { has: function (obj) { return "NODE_ENV" in obj; }, get: function (obj) { return obj.NODE_ENV; }, set: function (obj, value) { obj.NODE_ENV = value; } }, metadata: _metadata }, _NODE_ENV_initializers, _NODE_ENV_extraInitializers);
            __esDecorate(null, null, _DATABASE_URL_decorators, { kind: "field", name: "DATABASE_URL", static: false, private: false, access: { has: function (obj) { return "DATABASE_URL" in obj; }, get: function (obj) { return obj.DATABASE_URL; }, set: function (obj, value) { obj.DATABASE_URL = value; } }, metadata: _metadata }, _DATABASE_URL_initializers, _DATABASE_URL_extraInitializers);
            __esDecorate(null, null, _REDIS_URL_decorators, { kind: "field", name: "REDIS_URL", static: false, private: false, access: { has: function (obj) { return "REDIS_URL" in obj; }, get: function (obj) { return obj.REDIS_URL; }, set: function (obj, value) { obj.REDIS_URL = value; } }, metadata: _metadata }, _REDIS_URL_initializers, _REDIS_URL_extraInitializers);
            __esDecorate(null, null, _COOKIE_SECRET_decorators, { kind: "field", name: "COOKIE_SECRET", static: false, private: false, access: { has: function (obj) { return "COOKIE_SECRET" in obj; }, get: function (obj) { return obj.COOKIE_SECRET; }, set: function (obj, value) { obj.COOKIE_SECRET = value; } }, metadata: _metadata }, _COOKIE_SECRET_initializers, _COOKIE_SECRET_extraInitializers);
            __esDecorate(null, null, _MASTER_ENCRYPTION_KEY_V1_decorators, { kind: "field", name: "MASTER_ENCRYPTION_KEY_V1", static: false, private: false, access: { has: function (obj) { return "MASTER_ENCRYPTION_KEY_V1" in obj; }, get: function (obj) { return obj.MASTER_ENCRYPTION_KEY_V1; }, set: function (obj, value) { obj.MASTER_ENCRYPTION_KEY_V1 = value; } }, metadata: _metadata }, _MASTER_ENCRYPTION_KEY_V1_initializers, _MASTER_ENCRYPTION_KEY_V1_extraInitializers);
            __esDecorate(null, null, _CORS_ALLOWED_ORIGINS_decorators, { kind: "field", name: "CORS_ALLOWED_ORIGINS", static: false, private: false, access: { has: function (obj) { return "CORS_ALLOWED_ORIGINS" in obj; }, get: function (obj) { return obj.CORS_ALLOWED_ORIGINS; }, set: function (obj, value) { obj.CORS_ALLOWED_ORIGINS = value; } }, metadata: _metadata }, _CORS_ALLOWED_ORIGINS_initializers, _CORS_ALLOWED_ORIGINS_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.EnvironmentVariables = EnvironmentVariables;
