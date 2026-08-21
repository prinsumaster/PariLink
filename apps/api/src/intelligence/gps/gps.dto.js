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
exports.GpsPingDto = void 0;
var class_validator_1 = require("class-validator");
var GpsPingDto = function () {
    var _a;
    var _vehicleId_decorators;
    var _vehicleId_initializers = [];
    var _vehicleId_extraInitializers = [];
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
    var _odometer_decorators;
    var _odometer_initializers = [];
    var _odometer_extraInitializers = [];
    var _fuelLevel_decorators;
    var _fuelLevel_initializers = [];
    var _fuelLevel_extraInitializers = [];
    var _ignition_decorators;
    var _ignition_initializers = [];
    var _ignition_extraInitializers = [];
    var _timestamp_decorators;
    var _timestamp_initializers = [];
    var _timestamp_extraInitializers = [];
    return _a = /** @class */ (function () {
            function GpsPingDto() {
                this.vehicleId = __runInitializers(this, _vehicleId_initializers, void 0);
                this.latitude = (__runInitializers(this, _vehicleId_extraInitializers), __runInitializers(this, _latitude_initializers, void 0));
                this.longitude = (__runInitializers(this, _latitude_extraInitializers), __runInitializers(this, _longitude_initializers, void 0));
                this.speed = (__runInitializers(this, _longitude_extraInitializers), __runInitializers(this, _speed_initializers, void 0));
                this.heading = (__runInitializers(this, _speed_extraInitializers), __runInitializers(this, _heading_initializers, void 0));
                this.accuracy = (__runInitializers(this, _heading_extraInitializers), __runInitializers(this, _accuracy_initializers, void 0));
                this.odometer = (__runInitializers(this, _accuracy_extraInitializers), __runInitializers(this, _odometer_initializers, void 0));
                this.fuelLevel = (__runInitializers(this, _odometer_extraInitializers), __runInitializers(this, _fuelLevel_initializers, void 0));
                this.ignition = (__runInitializers(this, _fuelLevel_extraInitializers), __runInitializers(this, _ignition_initializers, void 0));
                this.timestamp = (__runInitializers(this, _ignition_extraInitializers), __runInitializers(this, _timestamp_initializers, void 0));
                __runInitializers(this, _timestamp_extraInitializers);
            }
            return GpsPingDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _vehicleId_decorators = [(0, class_validator_1.IsString)()];
            _latitude_decorators = [(0, class_validator_1.IsNumber)()];
            _longitude_decorators = [(0, class_validator_1.IsNumber)()];
            _speed_decorators = [(0, class_validator_1.IsNumber)(), (0, class_validator_1.IsOptional)()];
            _heading_decorators = [(0, class_validator_1.IsNumber)(), (0, class_validator_1.IsOptional)()];
            _accuracy_decorators = [(0, class_validator_1.IsNumber)(), (0, class_validator_1.IsOptional)()];
            _odometer_decorators = [(0, class_validator_1.IsNumber)(), (0, class_validator_1.IsOptional)()];
            _fuelLevel_decorators = [(0, class_validator_1.IsNumber)(), (0, class_validator_1.IsOptional)()];
            _ignition_decorators = [(0, class_validator_1.IsBoolean)(), (0, class_validator_1.IsOptional)()];
            _timestamp_decorators = [(0, class_validator_1.IsDateString)()];
            __esDecorate(null, null, _vehicleId_decorators, { kind: "field", name: "vehicleId", static: false, private: false, access: { has: function (obj) { return "vehicleId" in obj; }, get: function (obj) { return obj.vehicleId; }, set: function (obj, value) { obj.vehicleId = value; } }, metadata: _metadata }, _vehicleId_initializers, _vehicleId_extraInitializers);
            __esDecorate(null, null, _latitude_decorators, { kind: "field", name: "latitude", static: false, private: false, access: { has: function (obj) { return "latitude" in obj; }, get: function (obj) { return obj.latitude; }, set: function (obj, value) { obj.latitude = value; } }, metadata: _metadata }, _latitude_initializers, _latitude_extraInitializers);
            __esDecorate(null, null, _longitude_decorators, { kind: "field", name: "longitude", static: false, private: false, access: { has: function (obj) { return "longitude" in obj; }, get: function (obj) { return obj.longitude; }, set: function (obj, value) { obj.longitude = value; } }, metadata: _metadata }, _longitude_initializers, _longitude_extraInitializers);
            __esDecorate(null, null, _speed_decorators, { kind: "field", name: "speed", static: false, private: false, access: { has: function (obj) { return "speed" in obj; }, get: function (obj) { return obj.speed; }, set: function (obj, value) { obj.speed = value; } }, metadata: _metadata }, _speed_initializers, _speed_extraInitializers);
            __esDecorate(null, null, _heading_decorators, { kind: "field", name: "heading", static: false, private: false, access: { has: function (obj) { return "heading" in obj; }, get: function (obj) { return obj.heading; }, set: function (obj, value) { obj.heading = value; } }, metadata: _metadata }, _heading_initializers, _heading_extraInitializers);
            __esDecorate(null, null, _accuracy_decorators, { kind: "field", name: "accuracy", static: false, private: false, access: { has: function (obj) { return "accuracy" in obj; }, get: function (obj) { return obj.accuracy; }, set: function (obj, value) { obj.accuracy = value; } }, metadata: _metadata }, _accuracy_initializers, _accuracy_extraInitializers);
            __esDecorate(null, null, _odometer_decorators, { kind: "field", name: "odometer", static: false, private: false, access: { has: function (obj) { return "odometer" in obj; }, get: function (obj) { return obj.odometer; }, set: function (obj, value) { obj.odometer = value; } }, metadata: _metadata }, _odometer_initializers, _odometer_extraInitializers);
            __esDecorate(null, null, _fuelLevel_decorators, { kind: "field", name: "fuelLevel", static: false, private: false, access: { has: function (obj) { return "fuelLevel" in obj; }, get: function (obj) { return obj.fuelLevel; }, set: function (obj, value) { obj.fuelLevel = value; } }, metadata: _metadata }, _fuelLevel_initializers, _fuelLevel_extraInitializers);
            __esDecorate(null, null, _ignition_decorators, { kind: "field", name: "ignition", static: false, private: false, access: { has: function (obj) { return "ignition" in obj; }, get: function (obj) { return obj.ignition; }, set: function (obj, value) { obj.ignition = value; } }, metadata: _metadata }, _ignition_initializers, _ignition_extraInitializers);
            __esDecorate(null, null, _timestamp_decorators, { kind: "field", name: "timestamp", static: false, private: false, access: { has: function (obj) { return "timestamp" in obj; }, get: function (obj) { return obj.timestamp; }, set: function (obj, value) { obj.timestamp = value; } }, metadata: _metadata }, _timestamp_initializers, _timestamp_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.GpsPingDto = GpsPingDto;
