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
exports.CreateTripDto = void 0;
var class_validator_1 = require("class-validator");
var class_transformer_1 = require("class-transformer");
var swagger_1 = require("@nestjs/swagger");
var CreateTripDto = function () {
    var _a;
    var _tripNumber_decorators;
    var _tripNumber_initializers = [];
    var _tripNumber_extraInitializers = [];
    var _driverId_decorators;
    var _driverId_initializers = [];
    var _driverId_extraInitializers = [];
    var _vehicleId_decorators;
    var _vehicleId_initializers = [];
    var _vehicleId_extraInitializers = [];
    var _trailerId_decorators;
    var _trailerId_initializers = [];
    var _trailerId_extraInitializers = [];
    var _status_decorators;
    var _status_initializers = [];
    var _status_extraInitializers = [];
    var _startDate_decorators;
    var _startDate_initializers = [];
    var _startDate_extraInitializers = [];
    var _endDate_decorators;
    var _endDate_initializers = [];
    var _endDate_extraInitializers = [];
    var _eta_decorators;
    var _eta_initializers = [];
    var _eta_extraInitializers = [];
    var _startOdometer_decorators;
    var _startOdometer_initializers = [];
    var _startOdometer_extraInitializers = [];
    var _endOdometer_decorators;
    var _endOdometer_initializers = [];
    var _endOdometer_extraInitializers = [];
    var _estimatedDistance_decorators;
    var _estimatedDistance_initializers = [];
    var _estimatedDistance_extraInitializers = [];
    var _actualDistance_decorators;
    var _actualDistance_initializers = [];
    var _actualDistance_extraInitializers = [];
    var _route_decorators;
    var _route_initializers = [];
    var _route_extraInitializers = [];
    var _checklists_decorators;
    var _checklists_initializers = [];
    var _checklists_extraInitializers = [];
    var _timeline_decorators;
    var _timeline_initializers = [];
    var _timeline_extraInitializers = [];
    var _fuelExpenses_decorators;
    var _fuelExpenses_initializers = [];
    var _fuelExpenses_extraInitializers = [];
    var _otherExpenses_decorators;
    var _otherExpenses_initializers = [];
    var _otherExpenses_extraInitializers = [];
    var _notes_decorators;
    var _notes_initializers = [];
    var _notes_extraInitializers = [];
    return _a = /** @class */ (function () {
            function CreateTripDto() {
                this.tripNumber = __runInitializers(this, _tripNumber_initializers, void 0);
                this.driverId = (__runInitializers(this, _tripNumber_extraInitializers), __runInitializers(this, _driverId_initializers, void 0));
                this.vehicleId = (__runInitializers(this, _driverId_extraInitializers), __runInitializers(this, _vehicleId_initializers, void 0));
                this.trailerId = (__runInitializers(this, _vehicleId_extraInitializers), __runInitializers(this, _trailerId_initializers, void 0));
                this.status = (__runInitializers(this, _trailerId_extraInitializers), __runInitializers(this, _status_initializers, void 0));
                this.startDate = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _startDate_initializers, void 0));
                this.endDate = (__runInitializers(this, _startDate_extraInitializers), __runInitializers(this, _endDate_initializers, void 0));
                this.eta = (__runInitializers(this, _endDate_extraInitializers), __runInitializers(this, _eta_initializers, void 0));
                this.startOdometer = (__runInitializers(this, _eta_extraInitializers), __runInitializers(this, _startOdometer_initializers, void 0));
                this.endOdometer = (__runInitializers(this, _startOdometer_extraInitializers), __runInitializers(this, _endOdometer_initializers, void 0));
                this.estimatedDistance = (__runInitializers(this, _endOdometer_extraInitializers), __runInitializers(this, _estimatedDistance_initializers, void 0));
                this.actualDistance = (__runInitializers(this, _estimatedDistance_extraInitializers), __runInitializers(this, _actualDistance_initializers, void 0));
                this.route = (__runInitializers(this, _actualDistance_extraInitializers), __runInitializers(this, _route_initializers, void 0));
                this.checklists = (__runInitializers(this, _route_extraInitializers), __runInitializers(this, _checklists_initializers, void 0));
                this.timeline = (__runInitializers(this, _checklists_extraInitializers), __runInitializers(this, _timeline_initializers, void 0));
                this.fuelExpenses = (__runInitializers(this, _timeline_extraInitializers), __runInitializers(this, _fuelExpenses_initializers, void 0));
                this.otherExpenses = (__runInitializers(this, _fuelExpenses_extraInitializers), __runInitializers(this, _otherExpenses_initializers, void 0));
                this.notes = (__runInitializers(this, _otherExpenses_extraInitializers), __runInitializers(this, _notes_initializers, void 0));
                __runInitializers(this, _notes_extraInitializers);
            }
            return CreateTripDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _tripNumber_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: 'TRP-1001' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _driverId_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: 'd123d2ca-1122-3344-5566-778899aabbcc' }), (0, class_validator_1.IsUUID)(), (0, class_validator_1.IsOptional)()];
            _vehicleId_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: 'v123d2ca-1122-3344-5566-778899aabbcc' }), (0, class_validator_1.IsUUID)(), (0, class_validator_1.IsOptional)()];
            _trailerId_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: 'v456d2ca-1122-3344-5566-778899aabbcc' }), (0, class_validator_1.IsUUID)(), (0, class_validator_1.IsOptional)()];
            _status_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    enum: ['PLANNED', 'DISPATCHED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'],
                    default: 'PLANNED',
                }), (0, class_validator_1.IsIn)(['PLANNED', 'DISPATCHED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']), (0, class_validator_1.IsOptional)()];
            _startDate_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: '2028-12-01T10:00:00Z' }), (0, class_validator_1.IsDateString)(), (0, class_validator_1.IsOptional)()];
            _endDate_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: '2028-12-02T14:00:00Z' }), (0, class_validator_1.IsDateString)(), (0, class_validator_1.IsOptional)()];
            _eta_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: '2028-12-02T12:00:00Z' }), (0, class_validator_1.IsDateString)(), (0, class_validator_1.IsOptional)()];
            _startOdometer_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsOptional)(), (0, class_transformer_1.Type)(function () { return Number; }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _endOdometer_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsOptional)(), (0, class_transformer_1.Type)(function () { return Number; }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _estimatedDistance_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsOptional)(), (0, class_transformer_1.Type)(function () { return Number; }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _actualDistance_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsOptional)(), (0, class_transformer_1.Type)(function () { return Number; }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _route_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsOptional)()];
            _checklists_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsOptional)()];
            _timeline_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsOptional)()];
            _fuelExpenses_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsOptional)(), (0, class_transformer_1.Type)(function () { return Number; }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _otherExpenses_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsOptional)(), (0, class_transformer_1.Type)(function () { return Number; }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(0)];
            _notes_decorators = [(0, swagger_1.ApiPropertyOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _tripNumber_decorators, { kind: "field", name: "tripNumber", static: false, private: false, access: { has: function (obj) { return "tripNumber" in obj; }, get: function (obj) { return obj.tripNumber; }, set: function (obj, value) { obj.tripNumber = value; } }, metadata: _metadata }, _tripNumber_initializers, _tripNumber_extraInitializers);
            __esDecorate(null, null, _driverId_decorators, { kind: "field", name: "driverId", static: false, private: false, access: { has: function (obj) { return "driverId" in obj; }, get: function (obj) { return obj.driverId; }, set: function (obj, value) { obj.driverId = value; } }, metadata: _metadata }, _driverId_initializers, _driverId_extraInitializers);
            __esDecorate(null, null, _vehicleId_decorators, { kind: "field", name: "vehicleId", static: false, private: false, access: { has: function (obj) { return "vehicleId" in obj; }, get: function (obj) { return obj.vehicleId; }, set: function (obj, value) { obj.vehicleId = value; } }, metadata: _metadata }, _vehicleId_initializers, _vehicleId_extraInitializers);
            __esDecorate(null, null, _trailerId_decorators, { kind: "field", name: "trailerId", static: false, private: false, access: { has: function (obj) { return "trailerId" in obj; }, get: function (obj) { return obj.trailerId; }, set: function (obj, value) { obj.trailerId = value; } }, metadata: _metadata }, _trailerId_initializers, _trailerId_extraInitializers);
            __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: function (obj) { return "status" in obj; }, get: function (obj) { return obj.status; }, set: function (obj, value) { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
            __esDecorate(null, null, _startDate_decorators, { kind: "field", name: "startDate", static: false, private: false, access: { has: function (obj) { return "startDate" in obj; }, get: function (obj) { return obj.startDate; }, set: function (obj, value) { obj.startDate = value; } }, metadata: _metadata }, _startDate_initializers, _startDate_extraInitializers);
            __esDecorate(null, null, _endDate_decorators, { kind: "field", name: "endDate", static: false, private: false, access: { has: function (obj) { return "endDate" in obj; }, get: function (obj) { return obj.endDate; }, set: function (obj, value) { obj.endDate = value; } }, metadata: _metadata }, _endDate_initializers, _endDate_extraInitializers);
            __esDecorate(null, null, _eta_decorators, { kind: "field", name: "eta", static: false, private: false, access: { has: function (obj) { return "eta" in obj; }, get: function (obj) { return obj.eta; }, set: function (obj, value) { obj.eta = value; } }, metadata: _metadata }, _eta_initializers, _eta_extraInitializers);
            __esDecorate(null, null, _startOdometer_decorators, { kind: "field", name: "startOdometer", static: false, private: false, access: { has: function (obj) { return "startOdometer" in obj; }, get: function (obj) { return obj.startOdometer; }, set: function (obj, value) { obj.startOdometer = value; } }, metadata: _metadata }, _startOdometer_initializers, _startOdometer_extraInitializers);
            __esDecorate(null, null, _endOdometer_decorators, { kind: "field", name: "endOdometer", static: false, private: false, access: { has: function (obj) { return "endOdometer" in obj; }, get: function (obj) { return obj.endOdometer; }, set: function (obj, value) { obj.endOdometer = value; } }, metadata: _metadata }, _endOdometer_initializers, _endOdometer_extraInitializers);
            __esDecorate(null, null, _estimatedDistance_decorators, { kind: "field", name: "estimatedDistance", static: false, private: false, access: { has: function (obj) { return "estimatedDistance" in obj; }, get: function (obj) { return obj.estimatedDistance; }, set: function (obj, value) { obj.estimatedDistance = value; } }, metadata: _metadata }, _estimatedDistance_initializers, _estimatedDistance_extraInitializers);
            __esDecorate(null, null, _actualDistance_decorators, { kind: "field", name: "actualDistance", static: false, private: false, access: { has: function (obj) { return "actualDistance" in obj; }, get: function (obj) { return obj.actualDistance; }, set: function (obj, value) { obj.actualDistance = value; } }, metadata: _metadata }, _actualDistance_initializers, _actualDistance_extraInitializers);
            __esDecorate(null, null, _route_decorators, { kind: "field", name: "route", static: false, private: false, access: { has: function (obj) { return "route" in obj; }, get: function (obj) { return obj.route; }, set: function (obj, value) { obj.route = value; } }, metadata: _metadata }, _route_initializers, _route_extraInitializers);
            __esDecorate(null, null, _checklists_decorators, { kind: "field", name: "checklists", static: false, private: false, access: { has: function (obj) { return "checklists" in obj; }, get: function (obj) { return obj.checklists; }, set: function (obj, value) { obj.checklists = value; } }, metadata: _metadata }, _checklists_initializers, _checklists_extraInitializers);
            __esDecorate(null, null, _timeline_decorators, { kind: "field", name: "timeline", static: false, private: false, access: { has: function (obj) { return "timeline" in obj; }, get: function (obj) { return obj.timeline; }, set: function (obj, value) { obj.timeline = value; } }, metadata: _metadata }, _timeline_initializers, _timeline_extraInitializers);
            __esDecorate(null, null, _fuelExpenses_decorators, { kind: "field", name: "fuelExpenses", static: false, private: false, access: { has: function (obj) { return "fuelExpenses" in obj; }, get: function (obj) { return obj.fuelExpenses; }, set: function (obj, value) { obj.fuelExpenses = value; } }, metadata: _metadata }, _fuelExpenses_initializers, _fuelExpenses_extraInitializers);
            __esDecorate(null, null, _otherExpenses_decorators, { kind: "field", name: "otherExpenses", static: false, private: false, access: { has: function (obj) { return "otherExpenses" in obj; }, get: function (obj) { return obj.otherExpenses; }, set: function (obj, value) { obj.otherExpenses = value; } }, metadata: _metadata }, _otherExpenses_initializers, _otherExpenses_extraInitializers);
            __esDecorate(null, null, _notes_decorators, { kind: "field", name: "notes", static: false, private: false, access: { has: function (obj) { return "notes" in obj; }, get: function (obj) { return obj.notes; }, set: function (obj, value) { obj.notes = value; } }, metadata: _metadata }, _notes_initializers, _notes_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.CreateTripDto = CreateTripDto;
