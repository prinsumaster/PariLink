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
exports.GenerateInvoiceDto = void 0;
var class_validator_1 = require("class-validator");
var swagger_1 = require("@nestjs/swagger");
var GenerateInvoiceDto = function () {
    var _a;
    var _loadId_decorators;
    var _loadId_initializers = [];
    var _loadId_extraInitializers = [];
    var _rateCardId_decorators;
    var _rateCardId_initializers = [];
    var _rateCardId_extraInitializers = [];
    var _manualAmount_decorators;
    var _manualAmount_initializers = [];
    var _manualAmount_extraInitializers = [];
    return _a = /** @class */ (function () {
            function GenerateInvoiceDto() {
                this.loadId = __runInitializers(this, _loadId_initializers, void 0);
                this.rateCardId = (__runInitializers(this, _loadId_extraInitializers), __runInitializers(this, _rateCardId_initializers, void 0));
                this.manualAmount = (__runInitializers(this, _rateCardId_extraInitializers), __runInitializers(this, _manualAmount_initializers, void 0));
                __runInitializers(this, _manualAmount_extraInitializers);
            }
            return GenerateInvoiceDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _loadId_decorators = [(0, swagger_1.ApiProperty)(), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _rateCardId_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _manualAmount_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsNumber)(), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _loadId_decorators, { kind: "field", name: "loadId", static: false, private: false, access: { has: function (obj) { return "loadId" in obj; }, get: function (obj) { return obj.loadId; }, set: function (obj, value) { obj.loadId = value; } }, metadata: _metadata }, _loadId_initializers, _loadId_extraInitializers);
            __esDecorate(null, null, _rateCardId_decorators, { kind: "field", name: "rateCardId", static: false, private: false, access: { has: function (obj) { return "rateCardId" in obj; }, get: function (obj) { return obj.rateCardId; }, set: function (obj, value) { obj.rateCardId = value; } }, metadata: _metadata }, _rateCardId_initializers, _rateCardId_extraInitializers);
            __esDecorate(null, null, _manualAmount_decorators, { kind: "field", name: "manualAmount", static: false, private: false, access: { has: function (obj) { return "manualAmount" in obj; }, get: function (obj) { return obj.manualAmount; }, set: function (obj, value) { obj.manualAmount = value; } }, metadata: _metadata }, _manualAmount_initializers, _manualAmount_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.GenerateInvoiceDto = GenerateInvoiceDto;
