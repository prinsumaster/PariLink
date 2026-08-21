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
exports.ConstraintEngine = void 0;
var common_1 = require("@nestjs/common");
var ConstraintEngine = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var ConstraintEngine = _classThis = /** @class */ (function () {
        function ConstraintEngine_1() {
            this.logger = new common_1.Logger(ConstraintEngine.name);
        }
        ConstraintEngine_1.prototype.evaluate = function (ctx, config) {
            var violations = [];
            // Default strictness to true if not provided in config
            var strictWeight = (config === null || config === void 0 ? void 0 : config.strictWeight) !== false;
            var strictVolume = (config === null || config === void 0 ? void 0 : config.strictVolume) !== false;
            // ── Vehicle Constraints ─────────────────────────────────
            // 1. Vehicle must be IN_SERVICE
            if (ctx.vehicle.status !== 'IN_SERVICE') {
                violations.push({
                    constraint: 'VEHICLE_NOT_AVAILABLE',
                    message: "Vehicle ".concat(ctx.vehicle.id, " status is ").concat(ctx.vehicle.status, ", not IN_SERVICE."),
                    isFatal: true,
                    vehicleId: ctx.vehicle.id,
                });
            }
            // 2. Weight Capacity
            if (ctx.load.weight && ctx.vehicle.capacityWeight) {
                if (ctx.load.weight > ctx.vehicle.capacityWeight) {
                    violations.push({
                        constraint: 'WEIGHT_EXCEEDED',
                        message: "Load weight ".concat(ctx.load.weight, "kg exceeds vehicle capacity ").concat(ctx.vehicle.capacityWeight, "kg."),
                        isFatal: strictWeight,
                        vehicleId: ctx.vehicle.id,
                    });
                }
            }
            // 3. Volume Capacity
            if (ctx.load.volume && ctx.vehicle.capacityVolume) {
                if (ctx.load.volume > ctx.vehicle.capacityVolume) {
                    violations.push({
                        constraint: 'VOLUME_EXCEEDED',
                        message: "Load volume ".concat(ctx.load.volume, "m\u00B3 exceeds vehicle capacity ").concat(ctx.vehicle.capacityVolume, "m\u00B3."),
                        isFatal: strictVolume,
                        vehicleId: ctx.vehicle.id,
                    });
                }
            }
            // 4. Equipment Type Compatibility
            if (ctx.load.equipmentType && ctx.vehicle.type) {
                if (ctx.load.equipmentType === 'REFRIGERATED' &&
                    ctx.vehicle.type !== 'REEFER') {
                    violations.push({
                        constraint: 'EQUIPMENT_MISMATCH',
                        message: "Load requires REFRIGERATED equipment but vehicle type is ".concat(ctx.vehicle.type, "."),
                        isFatal: true,
                        vehicleId: ctx.vehicle.id,
                    });
                }
            }
            // ── Driver Constraints ──────────────────────────────────
            // 5. Driver must be AVAILABLE
            if (ctx.driver.status !== 'AVAILABLE') {
                violations.push({
                    constraint: 'DRIVER_NOT_AVAILABLE',
                    message: "Driver ".concat(ctx.driver.id, " status is ").concat(ctx.driver.status, ", not AVAILABLE."),
                    isFatal: true,
                    driverId: ctx.driver.id,
                });
            }
            // 6. Driver Licence Expiry
            if (ctx.driver.licenseExpiry) {
                var now = new Date();
                if (ctx.driver.licenseExpiry < now) {
                    violations.push({
                        constraint: 'LICENSE_EXPIRED',
                        message: "Driver ".concat(ctx.driver.id, " licence expired on ").concat(ctx.driver.licenseExpiry.toISOString(), "."),
                        isFatal: true,
                        driverId: ctx.driver.id,
                    });
                }
                // Warn if licence expires within 30 days
                var thirtyDays = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
                if (ctx.driver.licenseExpiry < thirtyDays) {
                    violations.push({
                        constraint: 'LICENSE_EXPIRING_SOON',
                        message: "Driver ".concat(ctx.driver.id, " licence expires on ").concat(ctx.driver.licenseExpiry.toISOString(), "."),
                        isFatal: false,
                        driverId: ctx.driver.id,
                    });
                }
            }
            return {
                passed: violations.filter(function (v) { return v.isFatal; }).length === 0,
                violations: violations,
            };
        };
        return ConstraintEngine_1;
    }());
    __setFunctionName(_classThis, "ConstraintEngine");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ConstraintEngine = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ConstraintEngine = _classThis;
}();
exports.ConstraintEngine = ConstraintEngine;
