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
exports.LocationPingDto = void 0;
var class_validator_1 = require("class-validator");
var class_transformer_1 = require("class-transformer");
var swagger_1 = require("@nestjs/swagger");
var LocationPingDto = function () {
    var _a;
    var _tripId_decorators;
    var _tripId_initializers = [];
    var _tripId_extraInitializers = [];
    var _latitude_decorators;
    var _latitude_initializers = [];
    var _latitude_extraInitializers = [];
    var _longitude_decorators;
    var _longitude_initializers = [];
    var _longitude_extraInitializers = [];
    var _speed_decorators;
    var _speed_initializers = [];
    var _speed_extraInitializers = [];
    var _heading_decorators;
    var _heading_initializers = [];
    var _heading_extraInitializers = [];
    var _accuracy_decorators;
    var _accuracy_initializers = [];
    var _accuracy_extraInitializers = [];
    return _a = /** @class */ (function () {
            function LocationPingDto() {
                this.tripId = __runInitializers(this, _tripId_initializers, void 0);
                this.latitude = (__runInitializers(this, _tripId_extraInitializers), __runInitializers(this, _latitude_initializers, void 0));
                this.longitude = (__runInitializers(this, _latitude_extraInitializers), __runInitializers(this, _longitude_initializers, void 0));
                this.speed = (__runInitializers(this, _longitude_extraInitializers), __runInitializers(this, _speed_initializers, void 0));
                this.heading = (__runInitializers(this, _speed_extraInitializers), __runInitializers(this, _heading_initializers, void 0));
                this.accuracy = (__runInitializers(this, _heading_extraInitializers), __runInitializers(this, _accuracy_initializers, void 0));
                __runInitializers(this, _accuracy_extraInitializers);
            }
            return LocationPingDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _tripId_decorators = [(0, swagger_1.ApiProperty)({ example: 't123-uuid' }), (0, class_validator_1.IsUUID)(), (0, class_validator_1.IsNotEmpty)()];
            _latitude_decorators = [(0, swagger_1.ApiProperty)({ example: 32.7767 }), (0, class_validator_1.IsNumber)(), (0, class_transformer_1.Type)(function () { return Number; }), (0, class_validator_1.IsNotEmpty)()];
            _longitude_decorators = [(0, swagger_1.ApiProperty)({ example: -96.797 }), (0, class_validator_1.IsNumber)(), (0, class_transformer_1.Type)(function () { return Number; }), (0, class_validator_1.IsNotEmpty)()];
            _speed_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: 55.2 }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)(), (0, class_transformer_1.Type)(function () { return Number; })];
            _heading_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: 180.5 }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)(), (0, class_transformer_1.Type)(function () { return Number; })];
            _accuracy_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: 10.0 }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)(), (0, class_transformer_1.Type)(function () { return Number; })];
            __esDecorate(null, null, _tripId_decorators, { kind: "field", name: "tripId", static: false, private: false, access: { has: function (obj) { return "tripId" in obj; }, get: function (obj) { return obj.tripId; }, set: function (obj, value) { obj.tripId = value; } }, metadata: _metadata }, _tripId_initializers, _tripId_extraInitializers);
            __esDecorate(null, null, _latitude_decorators, { kind: "field", name: "latitude", static: false, private: false, access: { has: function (obj) { return "latitude" in obj; }, get: function (obj) { return obj.latitude; }, set: function (obj, value) { obj.latitude = value; } }, metadata: _metadata }, _latitude_initializers, _latitude_extraInitializers);
            __esDecorate(null, null, _longitude_decorators, { kind: "field", name: "longitude", static: false, private: false, access: { has: function (obj) { return "longitude" in obj; }, get: function (obj) { return obj.longitude; }, set: function (obj, value) { obj.longitude = value; } }, metadata: _metadata }, _longitude_initializers, _longitude_extraInitializers);
            __esDecorate(null, null, _speed_decorators, { kind: "field", name: "speed", static: false, private: false, access: { has: function (obj) { return "speed" in obj; }, get: function (obj) { return obj.speed; }, set: function (obj, value) { obj.speed = value; } }, metadata: _metadata }, _speed_initializers, _speed_extraInitializers);
            __esDecorate(null, null, _heading_decorators, { kind: "field", name: "heading", static: false, private: false, access: { has: function (obj) { return "heading" in obj; }, get: function (obj) { return obj.heading; }, set: function (obj, value) { obj.heading = value; } }, metadata: _metadata }, _heading_initializers, _heading_extraInitializers);
            __esDecorate(null, null, _accuracy_decorators, { kind: "field", name: "accuracy", static: false, private: false, access: { has: function (obj) { return "accuracy" in obj; }, get: function (obj) { return obj.accuracy; }, set: function (obj, value) { obj.accuracy = value; } }, metadata: _metadata }, _accuracy_initializers, _accuracy_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.LocationPingDto = LocationPingDto;
