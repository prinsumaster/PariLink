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
exports.SubmitFactoringDto = void 0;
var class_validator_1 = require("class-validator");
var swagger_1 = require("@nestjs/swagger");
var SubmitFactoringDto = function () {
    var _a;
    var _customerId_decorators;
    var _customerId_initializers = [];
    var _customerId_extraInitializers = [];
    var _loadId_decorators;
    var _loadId_initializers = [];
    var _loadId_extraInitializers = [];
    var _invoiceNumber_decorators;
    var _invoiceNumber_initializers = [];
    var _invoiceNumber_extraInitializers = [];
    var _amount_decorators;
    var _amount_initializers = [];
    var _amount_extraInitializers = [];
    var _bolFileUrl_decorators;
    var _bolFileUrl_initializers = [];
    var _bolFileUrl_extraInitializers = [];
    var _bolFileName_decorators;
    var _bolFileName_initializers = [];
    var _bolFileName_extraInitializers = [];
    return _a = /** @class */ (function () {
            function SubmitFactoringDto() {
                this.customerId = __runInitializers(this, _customerId_initializers, void 0);
                this.loadId = (__runInitializers(this, _customerId_extraInitializers), __runInitializers(this, _loadId_initializers, void 0));
                this.invoiceNumber = (__runInitializers(this, _loadId_extraInitializers), __runInitializers(this, _invoiceNumber_initializers, void 0));
                this.amount = (__runInitializers(this, _invoiceNumber_extraInitializers), __runInitializers(this, _amount_initializers, void 0));
                this.bolFileUrl = (__runInitializers(this, _amount_extraInitializers), __runInitializers(this, _bolFileUrl_initializers, void 0));
                this.bolFileName = (__runInitializers(this, _bolFileUrl_extraInitializers), __runInitializers(this, _bolFileName_initializers, void 0));
                __runInitializers(this, _bolFileName_extraInitializers);
            }
            return SubmitFactoringDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _customerId_decorators = [(0, swagger_1.ApiProperty)(), (0, class_validator_1.IsString)()];
            _loadId_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _invoiceNumber_decorators = [(0, swagger_1.ApiProperty)(), (0, class_validator_1.IsString)()];
            _amount_decorators = [(0, swagger_1.ApiProperty)(), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _bolFileUrl_decorators = [(0, swagger_1.ApiProperty)(), (0, class_validator_1.IsString)()];
            _bolFileName_decorators = [(0, swagger_1.ApiProperty)(), (0, class_validator_1.IsString)()];
            __esDecorate(null, null, _customerId_decorators, { kind: "field", name: "customerId", static: false, private: false, access: { has: function (obj) { return "customerId" in obj; }, get: function (obj) { return obj.customerId; }, set: function (obj, value) { obj.customerId = value; } }, metadata: _metadata }, _customerId_initializers, _customerId_extraInitializers);
            __esDecorate(null, null, _loadId_decorators, { kind: "field", name: "loadId", static: false, private: false, access: { has: function (obj) { return "loadId" in obj; }, get: function (obj) { return obj.loadId; }, set: function (obj, value) { obj.loadId = value; } }, metadata: _metadata }, _loadId_initializers, _loadId_extraInitializers);
            __esDecorate(null, null, _invoiceNumber_decorators, { kind: "field", name: "invoiceNumber", static: false, private: false, access: { has: function (obj) { return "invoiceNumber" in obj; }, get: function (obj) { return obj.invoiceNumber; }, set: function (obj, value) { obj.invoiceNumber = value; } }, metadata: _metadata }, _invoiceNumber_initializers, _invoiceNumber_extraInitializers);
            __esDecorate(null, null, _amount_decorators, { kind: "field", name: "amount", static: false, private: false, access: { has: function (obj) { return "amount" in obj; }, get: function (obj) { return obj.amount; }, set: function (obj, value) { obj.amount = value; } }, metadata: _metadata }, _amount_initializers, _amount_extraInitializers);
            __esDecorate(null, null, _bolFileUrl_decorators, { kind: "field", name: "bolFileUrl", static: false, private: false, access: { has: function (obj) { return "bolFileUrl" in obj; }, get: function (obj) { return obj.bolFileUrl; }, set: function (obj, value) { obj.bolFileUrl = value; } }, metadata: _metadata }, _bolFileUrl_initializers, _bolFileUrl_extraInitializers);
            __esDecorate(null, null, _bolFileName_decorators, { kind: "field", name: "bolFileName", static: false, private: false, access: { has: function (obj) { return "bolFileName" in obj; }, get: function (obj) { return obj.bolFileName; }, set: function (obj, value) { obj.bolFileName = value; } }, metadata: _metadata }, _bolFileName_initializers, _bolFileName_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.SubmitFactoringDto = SubmitFactoringDto;
