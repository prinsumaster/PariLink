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
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.YardController = exports.GateEventDto = void 0;
var common_1 = require("@nestjs/common");
var jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
var permissions_guard_1 = require("../auth/guards/permissions.guard");
var permissions_decorator_1 = require("../auth/decorators/permissions.decorator");
var class_validator_1 = require("class-validator");
var swagger_1 = require("@nestjs/swagger");
// ---------------------------------------------------------------------------
// P2-2 FIX: Replaced @Body() data: Record<string, unknown> with strongly typed GateEventDto.
// Prevents mass-assignment vulnerabilities where clients could inject arbitrary
// fields that pass unvalidated into the database write path.
// ---------------------------------------------------------------------------
var GateEventDto = function () {
    var _a;
    var _warehouseId_decorators;
    var _warehouseId_initializers = [];
    var _warehouseId_extraInitializers = [];
    var _purpose_decorators;
    var _purpose_initializers = [];
    var _purpose_extraInitializers = [];
    var _vehicleId_decorators;
    var _vehicleId_initializers = [];
    var _vehicleId_extraInitializers = [];
    var _trailerId_decorators;
    var _trailerId_initializers = [];
    var _trailerId_extraInitializers = [];
    var _driverId_decorators;
    var _driverId_initializers = [];
    var _driverId_extraInitializers = [];
    return _a = /** @class */ (function () {
            function GateEventDto() {
                this.warehouseId = __runInitializers(this, _warehouseId_initializers, void 0);
                this.purpose = (__runInitializers(this, _warehouseId_extraInitializers), __runInitializers(this, _purpose_initializers, void 0));
                this.vehicleId = (__runInitializers(this, _purpose_extraInitializers), __runInitializers(this, _vehicleId_initializers, void 0));
                this.trailerId = (__runInitializers(this, _vehicleId_extraInitializers), __runInitializers(this, _trailerId_initializers, void 0));
                this.driverId = (__runInitializers(this, _trailerId_extraInitializers), __runInitializers(this, _driverId_initializers, void 0));
                __runInitializers(this, _driverId_extraInitializers);
            }
            return GateEventDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _warehouseId_decorators = [(0, swagger_1.ApiProperty)({ description: 'ID of the warehouse this event occurred at' }), (0, class_validator_1.IsString)()];
            _purpose_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Purpose of the gate event (e.g., DELIVERY, PICKUP)',
                }), (0, class_validator_1.IsString)()];
            _vehicleId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Vehicle ID', required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _trailerId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Trailer ID', required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _driverId_decorators = [(0, swagger_1.ApiProperty)({ description: 'Driver ID', required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            __esDecorate(null, null, _warehouseId_decorators, { kind: "field", name: "warehouseId", static: false, private: false, access: { has: function (obj) { return "warehouseId" in obj; }, get: function (obj) { return obj.warehouseId; }, set: function (obj, value) { obj.warehouseId = value; } }, metadata: _metadata }, _warehouseId_initializers, _warehouseId_extraInitializers);
            __esDecorate(null, null, _purpose_decorators, { kind: "field", name: "purpose", static: false, private: false, access: { has: function (obj) { return "purpose" in obj; }, get: function (obj) { return obj.purpose; }, set: function (obj, value) { obj.purpose = value; } }, metadata: _metadata }, _purpose_initializers, _purpose_extraInitializers);
            __esDecorate(null, null, _vehicleId_decorators, { kind: "field", name: "vehicleId", static: false, private: false, access: { has: function (obj) { return "vehicleId" in obj; }, get: function (obj) { return obj.vehicleId; }, set: function (obj, value) { obj.vehicleId = value; } }, metadata: _metadata }, _vehicleId_initializers, _vehicleId_extraInitializers);
            __esDecorate(null, null, _trailerId_decorators, { kind: "field", name: "trailerId", static: false, private: false, access: { has: function (obj) { return "trailerId" in obj; }, get: function (obj) { return obj.trailerId; }, set: function (obj, value) { obj.trailerId = value; } }, metadata: _metadata }, _trailerId_initializers, _trailerId_extraInitializers);
            __esDecorate(null, null, _driverId_decorators, { kind: "field", name: "driverId", static: false, private: false, access: { has: function (obj) { return "driverId" in obj; }, get: function (obj) { return obj.driverId; }, set: function (obj, value) { obj.driverId = value; } }, metadata: _metadata }, _driverId_initializers, _driverId_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.GateEventDto = GateEventDto;
var YardController = function () {
    var _classDecorators = [(0, common_1.Controller)('yard'), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard)];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _logGateEntry_decorators;
    var _logGateExit_decorators;
    var YardController = _classThis = /** @class */ (function () {
        function YardController_1(yardService) {
            this.yardService = (__runInitializers(this, _instanceExtraInitializers), yardService);
        }
        YardController_1.prototype.logGateEntry = function (user, data) {
            return this.yardService.logGateEntry(user.companyId, data.warehouseId, data, user.userId);
        };
        YardController_1.prototype.logGateExit = function (user, data) {
            return this.yardService.logGateExit(user.companyId, data.warehouseId, data, user.userId);
        };
        return YardController_1;
    }());
    __setFunctionName(_classThis, "YardController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _logGateEntry_decorators = [(0, common_1.Post)('gate/entry'), (0, permissions_decorator_1.RequirePermissions)('warehouse:write')];
        _logGateExit_decorators = [(0, common_1.Post)('gate/exit'), (0, permissions_decorator_1.RequirePermissions)('warehouse:write')];
        __esDecorate(_classThis, null, _logGateEntry_decorators, { kind: "method", name: "logGateEntry", static: false, private: false, access: { has: function (obj) { return "logGateEntry" in obj; }, get: function (obj) { return obj.logGateEntry; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _logGateExit_decorators, { kind: "method", name: "logGateExit", static: false, private: false, access: { has: function (obj) { return "logGateExit" in obj; }, get: function (obj) { return obj.logGateExit; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        YardController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return YardController = _classThis;
}();
exports.YardController = YardController;
