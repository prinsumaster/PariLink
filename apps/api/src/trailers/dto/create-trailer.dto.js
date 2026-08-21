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
exports.CreateTrailerDto = void 0;
var swagger_1 = require("@nestjs/swagger");
var class_validator_1 = require("class-validator");
var CreateTrailerDto = function () {
    var _a;
    var _make_decorators;
    var _make_initializers = [];
    var _make_extraInitializers = [];
    var _model_decorators;
    var _model_initializers = [];
    var _model_extraInitializers = [];
    var _year_decorators;
    var _year_initializers = [];
    var _year_extraInitializers = [];
    var _licensePlate_decorators;
    var _licensePlate_initializers = [];
    var _licensePlate_extraInitializers = [];
    var _vin_decorators;
    var _vin_initializers = [];
    var _vin_extraInitializers = [];
    var _capacityWeight_decorators;
    var _capacityWeight_initializers = [];
    var _capacityWeight_extraInitializers = [];
    var _capacityVolume_decorators;
    var _capacityVolume_initializers = [];
    var _capacityVolume_extraInitializers = [];
    return _a = /** @class */ (function () {
            function CreateTrailerDto() {
                this.make = __runInitializers(this, _make_initializers, void 0);
                this.model = (__runInitializers(this, _make_extraInitializers), __runInitializers(this, _model_initializers, void 0));
                this.year = (__runInitializers(this, _model_extraInitializers), __runInitializers(this, _year_initializers, void 0));
                this.licensePlate = (__runInitializers(this, _year_extraInitializers), __runInitializers(this, _licensePlate_initializers, void 0));
                this.vin = (__runInitializers(this, _licensePlate_extraInitializers), __runInitializers(this, _vin_initializers, void 0));
                this.capacityWeight = (__runInitializers(this, _vin_extraInitializers), __runInitializers(this, _capacityWeight_initializers, void 0));
                this.capacityVolume = (__runInitializers(this, _capacityWeight_extraInitializers), __runInitializers(this, _capacityVolume_initializers, void 0));
                __runInitializers(this, _capacityVolume_extraInitializers);
            }
            return CreateTrailerDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _make_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: 'Utility' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _model_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: '4000D-X' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _year_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: 2024 }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(1980)];
            _licensePlate_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: 'TR-90088' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _vin_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: '123456789ABCDEFG' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _capacityWeight_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: 45000 }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)()];
            _capacityVolume_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: 4000 }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)()];
            __esDecorate(null, null, _make_decorators, { kind: "field", name: "make", static: false, private: false, access: { has: function (obj) { return "make" in obj; }, get: function (obj) { return obj.make; }, set: function (obj, value) { obj.make = value; } }, metadata: _metadata }, _make_initializers, _make_extraInitializers);
            __esDecorate(null, null, _model_decorators, { kind: "field", name: "model", static: false, private: false, access: { has: function (obj) { return "model" in obj; }, get: function (obj) { return obj.model; }, set: function (obj, value) { obj.model = value; } }, metadata: _metadata }, _model_initializers, _model_extraInitializers);
            __esDecorate(null, null, _year_decorators, { kind: "field", name: "year", static: false, private: false, access: { has: function (obj) { return "year" in obj; }, get: function (obj) { return obj.year; }, set: function (obj, value) { obj.year = value; } }, metadata: _metadata }, _year_initializers, _year_extraInitializers);
            __esDecorate(null, null, _licensePlate_decorators, { kind: "field", name: "licensePlate", static: false, private: false, access: { has: function (obj) { return "licensePlate" in obj; }, get: function (obj) { return obj.licensePlate; }, set: function (obj, value) { obj.licensePlate = value; } }, metadata: _metadata }, _licensePlate_initializers, _licensePlate_extraInitializers);
            __esDecorate(null, null, _vin_decorators, { kind: "field", name: "vin", static: false, private: false, access: { has: function (obj) { return "vin" in obj; }, get: function (obj) { return obj.vin; }, set: function (obj, value) { obj.vin = value; } }, metadata: _metadata }, _vin_initializers, _vin_extraInitializers);
            __esDecorate(null, null, _capacityWeight_decorators, { kind: "field", name: "capacityWeight", static: false, private: false, access: { has: function (obj) { return "capacityWeight" in obj; }, get: function (obj) { return obj.capacityWeight; }, set: function (obj, value) { obj.capacityWeight = value; } }, metadata: _metadata }, _capacityWeight_initializers, _capacityWeight_extraInitializers);
            __esDecorate(null, null, _capacityVolume_decorators, { kind: "field", name: "capacityVolume", static: false, private: false, access: { has: function (obj) { return "capacityVolume" in obj; }, get: function (obj) { return obj.capacityVolume; }, set: function (obj, value) { obj.capacityVolume = value; } }, metadata: _metadata }, _capacityVolume_initializers, _capacityVolume_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.CreateTrailerDto = CreateTrailerDto;
