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
exports.CreateRateCardDto = void 0;
var class_validator_1 = require("class-validator");
var swagger_1 = require("@nestjs/swagger");
var CreateRateCardDto = function () {
    var _a;
    var _customerId_decorators;
    var _customerId_initializers = [];
    var _customerId_extraInitializers = [];
    var _type_decorators;
    var _type_initializers = [];
    var _type_extraInitializers = [];
    var _rate_decorators;
    var _rate_initializers = [];
    var _rate_extraInitializers = [];
    var _fuelSurcharge_decorators;
    var _fuelSurcharge_initializers = [];
    var _fuelSurcharge_extraInitializers = [];
    var _tollSurcharge_decorators;
    var _tollSurcharge_initializers = [];
    var _tollSurcharge_extraInitializers = [];
    var _waitingCharge_decorators;
    var _waitingCharge_initializers = [];
    var _waitingCharge_extraInitializers = [];
    var _currency_decorators;
    var _currency_initializers = [];
    var _currency_extraInitializers = [];
    var _originCity_decorators;
    var _originCity_initializers = [];
    var _originCity_extraInitializers = [];
    var _destinationCity_decorators;
    var _destinationCity_initializers = [];
    var _destinationCity_extraInitializers = [];
    return _a = /** @class */ (function () {
            function CreateRateCardDto() {
                this.customerId = __runInitializers(this, _customerId_initializers, void 0);
                this.type = (__runInitializers(this, _customerId_extraInitializers), __runInitializers(this, _type_initializers, void 0));
                this.rate = (__runInitializers(this, _type_extraInitializers), __runInitializers(this, _rate_initializers, void 0));
                this.fuelSurcharge = (__runInitializers(this, _rate_extraInitializers), __runInitializers(this, _fuelSurcharge_initializers, void 0));
                this.tollSurcharge = (__runInitializers(this, _fuelSurcharge_extraInitializers), __runInitializers(this, _tollSurcharge_initializers, void 0));
                this.waitingCharge = (__runInitializers(this, _tollSurcharge_extraInitializers), __runInitializers(this, _waitingCharge_initializers, void 0));
                this.currency = (__runInitializers(this, _waitingCharge_extraInitializers), __runInitializers(this, _currency_initializers, void 0));
                this.originCity = (__runInitializers(this, _currency_extraInitializers), __runInitializers(this, _originCity_initializers, void 0));
                this.destinationCity = (__runInitializers(this, _originCity_extraInitializers), __runInitializers(this, _destinationCity_initializers, void 0));
                __runInitializers(this, _destinationCity_extraInitializers);
            }
            return CreateRateCardDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _customerId_decorators = [(0, swagger_1.ApiProperty)(), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _type_decorators = [(0, swagger_1.ApiProperty)({ enum: ['DISTANCE', 'WEIGHT', 'FLAT', 'ROUTE'] }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _rate_decorators = [(0, swagger_1.ApiProperty)(), (0, class_validator_1.IsNumber)()];
            _fuelSurcharge_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsNumber)(), (0, class_validator_1.IsOptional)()];
            _tollSurcharge_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsNumber)(), (0, class_validator_1.IsOptional)()];
            _waitingCharge_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsNumber)(), (0, class_validator_1.IsOptional)()];
            _currency_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _originCity_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _destinationCity_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _customerId_decorators, { kind: "field", name: "customerId", static: false, private: false, access: { has: function (obj) { return "customerId" in obj; }, get: function (obj) { return obj.customerId; }, set: function (obj, value) { obj.customerId = value; } }, metadata: _metadata }, _customerId_initializers, _customerId_extraInitializers);
            __esDecorate(null, null, _type_decorators, { kind: "field", name: "type", static: false, private: false, access: { has: function (obj) { return "type" in obj; }, get: function (obj) { return obj.type; }, set: function (obj, value) { obj.type = value; } }, metadata: _metadata }, _type_initializers, _type_extraInitializers);
            __esDecorate(null, null, _rate_decorators, { kind: "field", name: "rate", static: false, private: false, access: { has: function (obj) { return "rate" in obj; }, get: function (obj) { return obj.rate; }, set: function (obj, value) { obj.rate = value; } }, metadata: _metadata }, _rate_initializers, _rate_extraInitializers);
            __esDecorate(null, null, _fuelSurcharge_decorators, { kind: "field", name: "fuelSurcharge", static: false, private: false, access: { has: function (obj) { return "fuelSurcharge" in obj; }, get: function (obj) { return obj.fuelSurcharge; }, set: function (obj, value) { obj.fuelSurcharge = value; } }, metadata: _metadata }, _fuelSurcharge_initializers, _fuelSurcharge_extraInitializers);
            __esDecorate(null, null, _tollSurcharge_decorators, { kind: "field", name: "tollSurcharge", static: false, private: false, access: { has: function (obj) { return "tollSurcharge" in obj; }, get: function (obj) { return obj.tollSurcharge; }, set: function (obj, value) { obj.tollSurcharge = value; } }, metadata: _metadata }, _tollSurcharge_initializers, _tollSurcharge_extraInitializers);
            __esDecorate(null, null, _waitingCharge_decorators, { kind: "field", name: "waitingCharge", static: false, private: false, access: { has: function (obj) { return "waitingCharge" in obj; }, get: function (obj) { return obj.waitingCharge; }, set: function (obj, value) { obj.waitingCharge = value; } }, metadata: _metadata }, _waitingCharge_initializers, _waitingCharge_extraInitializers);
            __esDecorate(null, null, _currency_decorators, { kind: "field", name: "currency", static: false, private: false, access: { has: function (obj) { return "currency" in obj; }, get: function (obj) { return obj.currency; }, set: function (obj, value) { obj.currency = value; } }, metadata: _metadata }, _currency_initializers, _currency_extraInitializers);
            __esDecorate(null, null, _originCity_decorators, { kind: "field", name: "originCity", static: false, private: false, access: { has: function (obj) { return "originCity" in obj; }, get: function (obj) { return obj.originCity; }, set: function (obj, value) { obj.originCity = value; } }, metadata: _metadata }, _originCity_initializers, _originCity_extraInitializers);
            __esDecorate(null, null, _destinationCity_decorators, { kind: "field", name: "destinationCity", static: false, private: false, access: { has: function (obj) { return "destinationCity" in obj; }, get: function (obj) { return obj.destinationCity; }, set: function (obj, value) { obj.destinationCity = value; } }, metadata: _metadata }, _destinationCity_initializers, _destinationCity_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.CreateRateCardDto = CreateRateCardDto;
