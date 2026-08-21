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
exports.UpdateAlertStatusDto = exports.CreateAlertRuleDto = exports.CreateGeofenceDto = exports.VehicleTelemetryDto = void 0;
var class_validator_1 = require("class-validator");
var swagger_1 = require("@nestjs/swagger");
var VehicleTelemetryDto = function () {
    var _a;
    var _vehicleId_decorators;
    var _vehicleId_initializers = [];
    var _vehicleId_extraInitializers = [];
    var _driverId_decorators;
    var _driverId_initializers = [];
    var _driverId_extraInitializers = [];
    var _odometer_decorators;
    var _odometer_initializers = [];
    var _odometer_extraInitializers = [];
    var _engineHours_decorators;
    var _engineHours_initializers = [];
    var _engineHours_extraInitializers = [];
    var _fuelLevel_decorators;
    var _fuelLevel_initializers = [];
    var _fuelLevel_extraInitializers = [];
    var _batteryVolts_decorators;
    var _batteryVolts_initializers = [];
    var _batteryVolts_extraInitializers = [];
    var _coolantTemp_decorators;
    var _coolantTemp_initializers = [];
    var _coolantTemp_extraInitializers = [];
    var _engineLoad_decorators;
    var _engineLoad_initializers = [];
    var _engineLoad_extraInitializers = [];
    var _rpm_decorators;
    var _rpm_initializers = [];
    var _rpm_extraInitializers = [];
    var _speed_decorators;
    var _speed_initializers = [];
    var _speed_extraInitializers = [];
    var _dtcCodes_decorators;
    var _dtcCodes_initializers = [];
    var _dtcCodes_extraInitializers = [];
    var _ignition_decorators;
    var _ignition_initializers = [];
    var _ignition_extraInitializers = [];
    var _timestamp_decorators;
    var _timestamp_initializers = [];
    var _timestamp_extraInitializers = [];
    return _a = /** @class */ (function () {
            function VehicleTelemetryDto() {
                this.vehicleId = __runInitializers(this, _vehicleId_initializers, void 0);
                this.driverId = (__runInitializers(this, _vehicleId_extraInitializers), __runInitializers(this, _driverId_initializers, void 0));
                this.odometer = (__runInitializers(this, _driverId_extraInitializers), __runInitializers(this, _odometer_initializers, void 0));
                this.engineHours = (__runInitializers(this, _odometer_extraInitializers), __runInitializers(this, _engineHours_initializers, void 0));
                this.fuelLevel = (__runInitializers(this, _engineHours_extraInitializers), __runInitializers(this, _fuelLevel_initializers, void 0));
                this.batteryVolts = (__runInitializers(this, _fuelLevel_extraInitializers), __runInitializers(this, _batteryVolts_initializers, void 0));
                this.coolantTemp = (__runInitializers(this, _batteryVolts_extraInitializers), __runInitializers(this, _coolantTemp_initializers, void 0));
                this.engineLoad = (__runInitializers(this, _coolantTemp_extraInitializers), __runInitializers(this, _engineLoad_initializers, void 0));
                this.rpm = (__runInitializers(this, _engineLoad_extraInitializers), __runInitializers(this, _rpm_initializers, void 0));
                this.speed = (__runInitializers(this, _rpm_extraInitializers), __runInitializers(this, _speed_initializers, void 0));
                this.dtcCodes = (__runInitializers(this, _speed_extraInitializers), __runInitializers(this, _dtcCodes_initializers, void 0));
                this.ignition = (__runInitializers(this, _dtcCodes_extraInitializers), __runInitializers(this, _ignition_initializers, void 0));
                this.timestamp = (__runInitializers(this, _ignition_extraInitializers), __runInitializers(this, _timestamp_initializers, void 0));
                __runInitializers(this, _timestamp_extraInitializers);
            }
            return VehicleTelemetryDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _vehicleId_decorators = [(0, swagger_1.ApiProperty)({ example: 'veh-uuid-001' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _driverId_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: 'drv-uuid-001' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _odometer_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: 124500.5 }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)()];
            _engineHours_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: 4500.2 }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)()];
            _fuelLevel_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: 78.5 }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)()];
            _batteryVolts_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: 13.8 }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)()];
            _coolantTemp_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: 195.0 }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)()];
            _engineLoad_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: 65.0 }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)()];
            _rpm_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: 1500.0 }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)()];
            _speed_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: 68.5 }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)()];
            _dtcCodes_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: ['P0171', 'P0300'] }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsArray)()];
            _ignition_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: true }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsBoolean)()];
            _timestamp_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: '2026-07-27T10:00:00Z' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            __esDecorate(null, null, _vehicleId_decorators, { kind: "field", name: "vehicleId", static: false, private: false, access: { has: function (obj) { return "vehicleId" in obj; }, get: function (obj) { return obj.vehicleId; }, set: function (obj, value) { obj.vehicleId = value; } }, metadata: _metadata }, _vehicleId_initializers, _vehicleId_extraInitializers);
            __esDecorate(null, null, _driverId_decorators, { kind: "field", name: "driverId", static: false, private: false, access: { has: function (obj) { return "driverId" in obj; }, get: function (obj) { return obj.driverId; }, set: function (obj, value) { obj.driverId = value; } }, metadata: _metadata }, _driverId_initializers, _driverId_extraInitializers);
            __esDecorate(null, null, _odometer_decorators, { kind: "field", name: "odometer", static: false, private: false, access: { has: function (obj) { return "odometer" in obj; }, get: function (obj) { return obj.odometer; }, set: function (obj, value) { obj.odometer = value; } }, metadata: _metadata }, _odometer_initializers, _odometer_extraInitializers);
            __esDecorate(null, null, _engineHours_decorators, { kind: "field", name: "engineHours", static: false, private: false, access: { has: function (obj) { return "engineHours" in obj; }, get: function (obj) { return obj.engineHours; }, set: function (obj, value) { obj.engineHours = value; } }, metadata: _metadata }, _engineHours_initializers, _engineHours_extraInitializers);
            __esDecorate(null, null, _fuelLevel_decorators, { kind: "field", name: "fuelLevel", static: false, private: false, access: { has: function (obj) { return "fuelLevel" in obj; }, get: function (obj) { return obj.fuelLevel; }, set: function (obj, value) { obj.fuelLevel = value; } }, metadata: _metadata }, _fuelLevel_initializers, _fuelLevel_extraInitializers);
            __esDecorate(null, null, _batteryVolts_decorators, { kind: "field", name: "batteryVolts", static: false, private: false, access: { has: function (obj) { return "batteryVolts" in obj; }, get: function (obj) { return obj.batteryVolts; }, set: function (obj, value) { obj.batteryVolts = value; } }, metadata: _metadata }, _batteryVolts_initializers, _batteryVolts_extraInitializers);
            __esDecorate(null, null, _coolantTemp_decorators, { kind: "field", name: "coolantTemp", static: false, private: false, access: { has: function (obj) { return "coolantTemp" in obj; }, get: function (obj) { return obj.coolantTemp; }, set: function (obj, value) { obj.coolantTemp = value; } }, metadata: _metadata }, _coolantTemp_initializers, _coolantTemp_extraInitializers);
            __esDecorate(null, null, _engineLoad_decorators, { kind: "field", name: "engineLoad", static: false, private: false, access: { has: function (obj) { return "engineLoad" in obj; }, get: function (obj) { return obj.engineLoad; }, set: function (obj, value) { obj.engineLoad = value; } }, metadata: _metadata }, _engineLoad_initializers, _engineLoad_extraInitializers);
            __esDecorate(null, null, _rpm_decorators, { kind: "field", name: "rpm", static: false, private: false, access: { has: function (obj) { return "rpm" in obj; }, get: function (obj) { return obj.rpm; }, set: function (obj, value) { obj.rpm = value; } }, metadata: _metadata }, _rpm_initializers, _rpm_extraInitializers);
            __esDecorate(null, null, _speed_decorators, { kind: "field", name: "speed", static: false, private: false, access: { has: function (obj) { return "speed" in obj; }, get: function (obj) { return obj.speed; }, set: function (obj, value) { obj.speed = value; } }, metadata: _metadata }, _speed_initializers, _speed_extraInitializers);
            __esDecorate(null, null, _dtcCodes_decorators, { kind: "field", name: "dtcCodes", static: false, private: false, access: { has: function (obj) { return "dtcCodes" in obj; }, get: function (obj) { return obj.dtcCodes; }, set: function (obj, value) { obj.dtcCodes = value; } }, metadata: _metadata }, _dtcCodes_initializers, _dtcCodes_extraInitializers);
            __esDecorate(null, null, _ignition_decorators, { kind: "field", name: "ignition", static: false, private: false, access: { has: function (obj) { return "ignition" in obj; }, get: function (obj) { return obj.ignition; }, set: function (obj, value) { obj.ignition = value; } }, metadata: _metadata }, _ignition_initializers, _ignition_extraInitializers);
            __esDecorate(null, null, _timestamp_decorators, { kind: "field", name: "timestamp", static: false, private: false, access: { has: function (obj) { return "timestamp" in obj; }, get: function (obj) { return obj.timestamp; }, set: function (obj, value) { obj.timestamp = value; } }, metadata: _metadata }, _timestamp_initializers, _timestamp_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.VehicleTelemetryDto = VehicleTelemetryDto;
var CreateGeofenceDto = function () {
    var _a;
    var _name_decorators;
    var _name_initializers = [];
    var _name_extraInitializers = [];
    var _description_decorators;
    var _description_initializers = [];
    var _description_extraInitializers = [];
    var _type_decorators;
    var _type_initializers = [];
    var _type_extraInitializers = [];
    var _latitude_decorators;
    var _latitude_initializers = [];
    var _latitude_extraInitializers = [];
    var _longitude_decorators;
    var _longitude_initializers = [];
    var _longitude_extraInitializers = [];
    var _radiusMeters_decorators;
    var _radiusMeters_initializers = [];
    var _radiusMeters_extraInitializers = [];
    var _polygon_decorators;
    var _polygon_initializers = [];
    var _polygon_extraInitializers = [];
    var _isActive_decorators;
    var _isActive_initializers = [];
    var _isActive_extraInitializers = [];
    return _a = /** @class */ (function () {
            function CreateGeofenceDto() {
                this.name = __runInitializers(this, _name_initializers, void 0);
                this.description = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.type = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _type_initializers, void 0));
                this.latitude = (__runInitializers(this, _type_extraInitializers), __runInitializers(this, _latitude_initializers, void 0));
                this.longitude = (__runInitializers(this, _latitude_extraInitializers), __runInitializers(this, _longitude_initializers, void 0));
                this.radiusMeters = (__runInitializers(this, _longitude_extraInitializers), __runInitializers(this, _radiusMeters_initializers, void 0));
                this.polygon = (__runInitializers(this, _radiusMeters_extraInitializers), __runInitializers(this, _polygon_initializers, void 0));
                this.isActive = (__runInitializers(this, _polygon_extraInitializers), __runInitializers(this, _isActive_initializers, void 0));
                __runInitializers(this, _isActive_extraInitializers);
            }
            return CreateGeofenceDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _name_decorators = [(0, swagger_1.ApiProperty)({ example: 'Acme Chicago Distribution Center' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _description_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: 'Main receiving dock for Acme Midwest' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _type_decorators = [(0, swagger_1.ApiProperty)({
                    example: 'CUSTOMER',
                    enum: ['CUSTOMER', 'WAREHOUSE', 'DEPOT', 'TOLL', 'PORT', 'BORDER'],
                }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _latitude_decorators = [(0, swagger_1.ApiProperty)({ example: 41.8781 }), (0, class_validator_1.IsNumber)()];
            _longitude_decorators = [(0, swagger_1.ApiProperty)({ example: -87.6298 }), (0, class_validator_1.IsNumber)()];
            _radiusMeters_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: 250.0 }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(10)];
            _polygon_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    example: [
                        { lat: 41.88, lng: -87.63 },
                        { lat: 41.87, lng: -87.63 },
                    ],
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsArray)()];
            _isActive_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: true }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsBoolean)()];
            __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: function (obj) { return "name" in obj; }, get: function (obj) { return obj.name; }, set: function (obj, value) { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: function (obj) { return "description" in obj; }, get: function (obj) { return obj.description; }, set: function (obj, value) { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _type_decorators, { kind: "field", name: "type", static: false, private: false, access: { has: function (obj) { return "type" in obj; }, get: function (obj) { return obj.type; }, set: function (obj, value) { obj.type = value; } }, metadata: _metadata }, _type_initializers, _type_extraInitializers);
            __esDecorate(null, null, _latitude_decorators, { kind: "field", name: "latitude", static: false, private: false, access: { has: function (obj) { return "latitude" in obj; }, get: function (obj) { return obj.latitude; }, set: function (obj, value) { obj.latitude = value; } }, metadata: _metadata }, _latitude_initializers, _latitude_extraInitializers);
            __esDecorate(null, null, _longitude_decorators, { kind: "field", name: "longitude", static: false, private: false, access: { has: function (obj) { return "longitude" in obj; }, get: function (obj) { return obj.longitude; }, set: function (obj, value) { obj.longitude = value; } }, metadata: _metadata }, _longitude_initializers, _longitude_extraInitializers);
            __esDecorate(null, null, _radiusMeters_decorators, { kind: "field", name: "radiusMeters", static: false, private: false, access: { has: function (obj) { return "radiusMeters" in obj; }, get: function (obj) { return obj.radiusMeters; }, set: function (obj, value) { obj.radiusMeters = value; } }, metadata: _metadata }, _radiusMeters_initializers, _radiusMeters_extraInitializers);
            __esDecorate(null, null, _polygon_decorators, { kind: "field", name: "polygon", static: false, private: false, access: { has: function (obj) { return "polygon" in obj; }, get: function (obj) { return obj.polygon; }, set: function (obj, value) { obj.polygon = value; } }, metadata: _metadata }, _polygon_initializers, _polygon_extraInitializers);
            __esDecorate(null, null, _isActive_decorators, { kind: "field", name: "isActive", static: false, private: false, access: { has: function (obj) { return "isActive" in obj; }, get: function (obj) { return obj.isActive; }, set: function (obj, value) { obj.isActive = value; } }, metadata: _metadata }, _isActive_initializers, _isActive_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.CreateGeofenceDto = CreateGeofenceDto;
var CreateAlertRuleDto = function () {
    var _a;
    var _name_decorators;
    var _name_initializers = [];
    var _name_extraInitializers = [];
    var _type_decorators;
    var _type_initializers = [];
    var _type_extraInitializers = [];
    var _condition_decorators;
    var _condition_initializers = [];
    var _condition_extraInitializers = [];
    var _threshold_decorators;
    var _threshold_initializers = [];
    var _threshold_extraInitializers = [];
    var _severity_decorators;
    var _severity_initializers = [];
    var _severity_extraInitializers = [];
    var _isActive_decorators;
    var _isActive_initializers = [];
    var _isActive_extraInitializers = [];
    return _a = /** @class */ (function () {
            function CreateAlertRuleDto() {
                this.name = __runInitializers(this, _name_initializers, void 0);
                this.type = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _type_initializers, void 0));
                this.condition = (__runInitializers(this, _type_extraInitializers), __runInitializers(this, _condition_initializers, void 0));
                this.threshold = (__runInitializers(this, _condition_extraInitializers), __runInitializers(this, _threshold_initializers, void 0));
                this.severity = (__runInitializers(this, _threshold_extraInitializers), __runInitializers(this, _severity_initializers, void 0));
                this.isActive = (__runInitializers(this, _severity_extraInitializers), __runInitializers(this, _isActive_initializers, void 0));
                __runInitializers(this, _isActive_extraInitializers);
            }
            return CreateAlertRuleDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _name_decorators = [(0, swagger_1.ApiProperty)({ example: 'Engine Overheating Alert' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _type_decorators = [(0, swagger_1.ApiProperty)({
                    example: 'MAINTENANCE',
                    enum: [
                        'SPEEDING',
                        'IDLING',
                        'DEVIATION',
                        'OFF_HOURS',
                        'BATTERY',
                        'MAINTENANCE',
                        'LOW_FUEL',
                    ],
                }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _condition_decorators = [(0, swagger_1.ApiProperty)({
                    example: 'EXCEEDS',
                    enum: ['EXCEEDS', 'LESS_THAN', 'MATCHES'],
                }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _threshold_decorators = [(0, swagger_1.ApiProperty)({ example: 220.0 }), (0, class_validator_1.IsNumber)()];
            _severity_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    example: 'HIGH',
                    enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _isActive_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: true }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsBoolean)()];
            __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: function (obj) { return "name" in obj; }, get: function (obj) { return obj.name; }, set: function (obj, value) { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
            __esDecorate(null, null, _type_decorators, { kind: "field", name: "type", static: false, private: false, access: { has: function (obj) { return "type" in obj; }, get: function (obj) { return obj.type; }, set: function (obj, value) { obj.type = value; } }, metadata: _metadata }, _type_initializers, _type_extraInitializers);
            __esDecorate(null, null, _condition_decorators, { kind: "field", name: "condition", static: false, private: false, access: { has: function (obj) { return "condition" in obj; }, get: function (obj) { return obj.condition; }, set: function (obj, value) { obj.condition = value; } }, metadata: _metadata }, _condition_initializers, _condition_extraInitializers);
            __esDecorate(null, null, _threshold_decorators, { kind: "field", name: "threshold", static: false, private: false, access: { has: function (obj) { return "threshold" in obj; }, get: function (obj) { return obj.threshold; }, set: function (obj, value) { obj.threshold = value; } }, metadata: _metadata }, _threshold_initializers, _threshold_extraInitializers);
            __esDecorate(null, null, _severity_decorators, { kind: "field", name: "severity", static: false, private: false, access: { has: function (obj) { return "severity" in obj; }, get: function (obj) { return obj.severity; }, set: function (obj, value) { obj.severity = value; } }, metadata: _metadata }, _severity_initializers, _severity_extraInitializers);
            __esDecorate(null, null, _isActive_decorators, { kind: "field", name: "isActive", static: false, private: false, access: { has: function (obj) { return "isActive" in obj; }, get: function (obj) { return obj.isActive; }, set: function (obj, value) { obj.isActive = value; } }, metadata: _metadata }, _isActive_initializers, _isActive_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.CreateAlertRuleDto = CreateAlertRuleDto;
var UpdateAlertStatusDto = function () {
    var _a;
    var _status_decorators;
    var _status_initializers = [];
    var _status_extraInitializers = [];
    var _notes_decorators;
    var _notes_initializers = [];
    var _notes_extraInitializers = [];
    return _a = /** @class */ (function () {
            function UpdateAlertStatusDto() {
                this.status = __runInitializers(this, _status_initializers, void 0);
                this.notes = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _notes_initializers, void 0));
                __runInitializers(this, _notes_extraInitializers);
            }
            return UpdateAlertStatusDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _status_decorators = [(0, swagger_1.ApiProperty)({
                    example: 'ACKNOWLEDGED',
                    enum: ['NEW', 'ACKNOWLEDGED', 'RESOLVED'],
                }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _notes_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: 'Driver contacted, coolant checked' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: function (obj) { return "status" in obj; }, get: function (obj) { return obj.status; }, set: function (obj, value) { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
            __esDecorate(null, null, _notes_decorators, { kind: "field", name: "notes", static: false, private: false, access: { has: function (obj) { return "notes" in obj; }, get: function (obj) { return obj.notes; }, set: function (obj, value) { obj.notes = value; } }, metadata: _metadata }, _notes_initializers, _notes_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.UpdateAlertStatusDto = UpdateAlertStatusDto;
