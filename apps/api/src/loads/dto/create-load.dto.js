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
exports.CreateLoadDto = void 0;
var class_validator_1 = require("class-validator");
var class_transformer_1 = require("class-transformer");
var swagger_1 = require("@nestjs/swagger");
var CreateLoadDto = function () {
    var _a;
    var _customerId_decorators;
    var _customerId_initializers = [];
    var _customerId_extraInitializers = [];
    var _referenceNumber_decorators;
    var _referenceNumber_initializers = [];
    var _referenceNumber_extraInitializers = [];
    var _consignor_decorators;
    var _consignor_initializers = [];
    var _consignor_extraInitializers = [];
    var _consignee_decorators;
    var _consignee_initializers = [];
    var _consignee_extraInitializers = [];
    var _originAddress_decorators;
    var _originAddress_initializers = [];
    var _originAddress_extraInitializers = [];
    var _originCity_decorators;
    var _originCity_initializers = [];
    var _originCity_extraInitializers = [];
    var _originState_decorators;
    var _originState_initializers = [];
    var _originState_extraInitializers = [];
    var _destinationAddress_decorators;
    var _destinationAddress_initializers = [];
    var _destinationAddress_extraInitializers = [];
    var _destinationCity_decorators;
    var _destinationCity_initializers = [];
    var _destinationCity_extraInitializers = [];
    var _destinationState_decorators;
    var _destinationState_initializers = [];
    var _destinationState_extraInitializers = [];
    var _pickupDate_decorators;
    var _pickupDate_initializers = [];
    var _pickupDate_extraInitializers = [];
    var _deliveryDate_decorators;
    var _deliveryDate_initializers = [];
    var _deliveryDate_extraInitializers = [];
    var _weight_decorators;
    var _weight_initializers = [];
    var _weight_extraInitializers = [];
    var _volume_decorators;
    var _volume_initializers = [];
    var _volume_extraInitializers = [];
    var _equipmentType_decorators;
    var _equipmentType_initializers = [];
    var _equipmentType_extraInitializers = [];
    var _vehicleRequirement_decorators;
    var _vehicleRequirement_initializers = [];
    var _vehicleRequirement_extraInitializers = [];
    var _trailerRequirement_decorators;
    var _trailerRequirement_initializers = [];
    var _trailerRequirement_extraInitializers = [];
    var _status_decorators;
    var _status_initializers = [];
    var _status_extraInitializers = [];
    var _rate_decorators;
    var _rate_initializers = [];
    var _rate_extraInitializers = [];
    var _cost_decorators;
    var _cost_initializers = [];
    var _cost_extraInitializers = [];
    var _notes_decorators;
    var _notes_initializers = [];
    var _notes_extraInitializers = [];
    return _a = /** @class */ (function () {
            function CreateLoadDto() {
                this.customerId = __runInitializers(this, _customerId_initializers, void 0);
                this.referenceNumber = (__runInitializers(this, _customerId_extraInitializers), __runInitializers(this, _referenceNumber_initializers, void 0));
                this.consignor = (__runInitializers(this, _referenceNumber_extraInitializers), __runInitializers(this, _consignor_initializers, void 0));
                this.consignee = (__runInitializers(this, _consignor_extraInitializers), __runInitializers(this, _consignee_initializers, void 0));
                this.originAddress = (__runInitializers(this, _consignee_extraInitializers), __runInitializers(this, _originAddress_initializers, void 0));
                this.originCity = (__runInitializers(this, _originAddress_extraInitializers), __runInitializers(this, _originCity_initializers, void 0));
                this.originState = (__runInitializers(this, _originCity_extraInitializers), __runInitializers(this, _originState_initializers, void 0));
                this.destinationAddress = (__runInitializers(this, _originState_extraInitializers), __runInitializers(this, _destinationAddress_initializers, void 0));
                this.destinationCity = (__runInitializers(this, _destinationAddress_extraInitializers), __runInitializers(this, _destinationCity_initializers, void 0));
                this.destinationState = (__runInitializers(this, _destinationCity_extraInitializers), __runInitializers(this, _destinationState_initializers, void 0));
                this.pickupDate = (__runInitializers(this, _destinationState_extraInitializers), __runInitializers(this, _pickupDate_initializers, void 0));
                this.deliveryDate = (__runInitializers(this, _pickupDate_extraInitializers), __runInitializers(this, _deliveryDate_initializers, void 0));
                this.weight = (__runInitializers(this, _deliveryDate_extraInitializers), __runInitializers(this, _weight_initializers, void 0));
                this.volume = (__runInitializers(this, _weight_extraInitializers), __runInitializers(this, _volume_initializers, void 0));
                this.equipmentType = (__runInitializers(this, _volume_extraInitializers), __runInitializers(this, _equipmentType_initializers, void 0));
                this.vehicleRequirement = (__runInitializers(this, _equipmentType_extraInitializers), __runInitializers(this, _vehicleRequirement_initializers, void 0));
                this.trailerRequirement = (__runInitializers(this, _vehicleRequirement_extraInitializers), __runInitializers(this, _trailerRequirement_initializers, void 0));
                this.status = (__runInitializers(this, _trailerRequirement_extraInitializers), __runInitializers(this, _status_initializers, void 0));
                this.rate = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _rate_initializers, void 0));
                this.cost = (__runInitializers(this, _rate_extraInitializers), __runInitializers(this, _cost_initializers, void 0));
                this.notes = (__runInitializers(this, _cost_extraInitializers), __runInitializers(this, _notes_initializers, void 0));
                __runInitializers(this, _notes_extraInitializers);
            }
            return CreateLoadDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _customerId_decorators = [(0, swagger_1.ApiProperty)({ example: 'c123d2ca-1122-3344-5566-778899aabbcc' }), (0, class_validator_1.IsUUID)(), (0, class_validator_1.IsNotEmpty)()];
            _referenceNumber_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: 'LD-10045' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _consignor_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: 'Acme Corp' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _consignee_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: 'Globex Inc' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _originAddress_decorators = [(0, swagger_1.ApiProperty)({ example: '123 Origin St' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _originCity_decorators = [(0, swagger_1.ApiProperty)({ example: 'Dallas' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _originState_decorators = [(0, swagger_1.ApiProperty)({ example: 'TX' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _destinationAddress_decorators = [(0, swagger_1.ApiProperty)({ example: '456 Dest Ave' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _destinationCity_decorators = [(0, swagger_1.ApiProperty)({ example: 'Austin' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _destinationState_decorators = [(0, swagger_1.ApiProperty)({ example: 'TX' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _pickupDate_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: '2028-12-01T10:00:00Z' }), (0, class_validator_1.IsDateString)(), (0, class_validator_1.IsOptional)()];
            _deliveryDate_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: '2028-12-02T14:00:00Z' }), (0, class_validator_1.IsDateString)(), (0, class_validator_1.IsOptional)()];
            _weight_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: 42000 }), (0, class_validator_1.IsOptional)(), (0, class_transformer_1.Type)(function () { return Number; }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _volume_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: 3500 }), (0, class_validator_1.IsOptional)(), (0, class_transformer_1.Type)(function () { return Number; }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _equipmentType_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    enum: ['DRY_VAN', 'REEFER', 'FLATBED'],
                    default: 'DRY_VAN',
                }), (0, class_validator_1.IsIn)(['DRY_VAN', 'REEFER', 'FLATBED']), (0, class_validator_1.IsOptional)()];
            _vehicleRequirement_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _trailerRequirement_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _status_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    enum: ['PENDING', 'ASSIGNED', 'IN_TRANSIT', 'DELIVERED', 'CANCELLED'],
                    default: 'PENDING',
                }), (0, class_validator_1.IsIn)(['PENDING', 'ASSIGNED', 'IN_TRANSIT', 'DELIVERED', 'CANCELLED']), (0, class_validator_1.IsOptional)()];
            _rate_decorators = [(0, swagger_1.ApiProperty)({ example: 1500.5 }), (0, class_transformer_1.Type)(function () { return Number; }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _cost_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: 1200.0 }), (0, class_transformer_1.Type)(function () { return Number; }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0), (0, class_validator_1.IsOptional)()];
            _notes_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _customerId_decorators, { kind: "field", name: "customerId", static: false, private: false, access: { has: function (obj) { return "customerId" in obj; }, get: function (obj) { return obj.customerId; }, set: function (obj, value) { obj.customerId = value; } }, metadata: _metadata }, _customerId_initializers, _customerId_extraInitializers);
            __esDecorate(null, null, _referenceNumber_decorators, { kind: "field", name: "referenceNumber", static: false, private: false, access: { has: function (obj) { return "referenceNumber" in obj; }, get: function (obj) { return obj.referenceNumber; }, set: function (obj, value) { obj.referenceNumber = value; } }, metadata: _metadata }, _referenceNumber_initializers, _referenceNumber_extraInitializers);
            __esDecorate(null, null, _consignor_decorators, { kind: "field", name: "consignor", static: false, private: false, access: { has: function (obj) { return "consignor" in obj; }, get: function (obj) { return obj.consignor; }, set: function (obj, value) { obj.consignor = value; } }, metadata: _metadata }, _consignor_initializers, _consignor_extraInitializers);
            __esDecorate(null, null, _consignee_decorators, { kind: "field", name: "consignee", static: false, private: false, access: { has: function (obj) { return "consignee" in obj; }, get: function (obj) { return obj.consignee; }, set: function (obj, value) { obj.consignee = value; } }, metadata: _metadata }, _consignee_initializers, _consignee_extraInitializers);
            __esDecorate(null, null, _originAddress_decorators, { kind: "field", name: "originAddress", static: false, private: false, access: { has: function (obj) { return "originAddress" in obj; }, get: function (obj) { return obj.originAddress; }, set: function (obj, value) { obj.originAddress = value; } }, metadata: _metadata }, _originAddress_initializers, _originAddress_extraInitializers);
            __esDecorate(null, null, _originCity_decorators, { kind: "field", name: "originCity", static: false, private: false, access: { has: function (obj) { return "originCity" in obj; }, get: function (obj) { return obj.originCity; }, set: function (obj, value) { obj.originCity = value; } }, metadata: _metadata }, _originCity_initializers, _originCity_extraInitializers);
            __esDecorate(null, null, _originState_decorators, { kind: "field", name: "originState", static: false, private: false, access: { has: function (obj) { return "originState" in obj; }, get: function (obj) { return obj.originState; }, set: function (obj, value) { obj.originState = value; } }, metadata: _metadata }, _originState_initializers, _originState_extraInitializers);
            __esDecorate(null, null, _destinationAddress_decorators, { kind: "field", name: "destinationAddress", static: false, private: false, access: { has: function (obj) { return "destinationAddress" in obj; }, get: function (obj) { return obj.destinationAddress; }, set: function (obj, value) { obj.destinationAddress = value; } }, metadata: _metadata }, _destinationAddress_initializers, _destinationAddress_extraInitializers);
            __esDecorate(null, null, _destinationCity_decorators, { kind: "field", name: "destinationCity", static: false, private: false, access: { has: function (obj) { return "destinationCity" in obj; }, get: function (obj) { return obj.destinationCity; }, set: function (obj, value) { obj.destinationCity = value; } }, metadata: _metadata }, _destinationCity_initializers, _destinationCity_extraInitializers);
            __esDecorate(null, null, _destinationState_decorators, { kind: "field", name: "destinationState", static: false, private: false, access: { has: function (obj) { return "destinationState" in obj; }, get: function (obj) { return obj.destinationState; }, set: function (obj, value) { obj.destinationState = value; } }, metadata: _metadata }, _destinationState_initializers, _destinationState_extraInitializers);
            __esDecorate(null, null, _pickupDate_decorators, { kind: "field", name: "pickupDate", static: false, private: false, access: { has: function (obj) { return "pickupDate" in obj; }, get: function (obj) { return obj.pickupDate; }, set: function (obj, value) { obj.pickupDate = value; } }, metadata: _metadata }, _pickupDate_initializers, _pickupDate_extraInitializers);
            __esDecorate(null, null, _deliveryDate_decorators, { kind: "field", name: "deliveryDate", static: false, private: false, access: { has: function (obj) { return "deliveryDate" in obj; }, get: function (obj) { return obj.deliveryDate; }, set: function (obj, value) { obj.deliveryDate = value; } }, metadata: _metadata }, _deliveryDate_initializers, _deliveryDate_extraInitializers);
            __esDecorate(null, null, _weight_decorators, { kind: "field", name: "weight", static: false, private: false, access: { has: function (obj) { return "weight" in obj; }, get: function (obj) { return obj.weight; }, set: function (obj, value) { obj.weight = value; } }, metadata: _metadata }, _weight_initializers, _weight_extraInitializers);
            __esDecorate(null, null, _volume_decorators, { kind: "field", name: "volume", static: false, private: false, access: { has: function (obj) { return "volume" in obj; }, get: function (obj) { return obj.volume; }, set: function (obj, value) { obj.volume = value; } }, metadata: _metadata }, _volume_initializers, _volume_extraInitializers);
            __esDecorate(null, null, _equipmentType_decorators, { kind: "field", name: "equipmentType", static: false, private: false, access: { has: function (obj) { return "equipmentType" in obj; }, get: function (obj) { return obj.equipmentType; }, set: function (obj, value) { obj.equipmentType = value; } }, metadata: _metadata }, _equipmentType_initializers, _equipmentType_extraInitializers);
            __esDecorate(null, null, _vehicleRequirement_decorators, { kind: "field", name: "vehicleRequirement", static: false, private: false, access: { has: function (obj) { return "vehicleRequirement" in obj; }, get: function (obj) { return obj.vehicleRequirement; }, set: function (obj, value) { obj.vehicleRequirement = value; } }, metadata: _metadata }, _vehicleRequirement_initializers, _vehicleRequirement_extraInitializers);
            __esDecorate(null, null, _trailerRequirement_decorators, { kind: "field", name: "trailerRequirement", static: false, private: false, access: { has: function (obj) { return "trailerRequirement" in obj; }, get: function (obj) { return obj.trailerRequirement; }, set: function (obj, value) { obj.trailerRequirement = value; } }, metadata: _metadata }, _trailerRequirement_initializers, _trailerRequirement_extraInitializers);
            __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: function (obj) { return "status" in obj; }, get: function (obj) { return obj.status; }, set: function (obj, value) { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
            __esDecorate(null, null, _rate_decorators, { kind: "field", name: "rate", static: false, private: false, access: { has: function (obj) { return "rate" in obj; }, get: function (obj) { return obj.rate; }, set: function (obj, value) { obj.rate = value; } }, metadata: _metadata }, _rate_initializers, _rate_extraInitializers);
            __esDecorate(null, null, _cost_decorators, { kind: "field", name: "cost", static: false, private: false, access: { has: function (obj) { return "cost" in obj; }, get: function (obj) { return obj.cost; }, set: function (obj, value) { obj.cost = value; } }, metadata: _metadata }, _cost_initializers, _cost_extraInitializers);
            __esDecorate(null, null, _notes_decorators, { kind: "field", name: "notes", static: false, private: false, access: { has: function (obj) { return "notes" in obj; }, get: function (obj) { return obj.notes; }, set: function (obj, value) { obj.notes = value; } }, metadata: _metadata }, _notes_initializers, _notes_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.CreateLoadDto = CreateLoadDto;
