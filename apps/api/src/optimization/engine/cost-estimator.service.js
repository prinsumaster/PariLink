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
exports.CostEstimatorService = void 0;
var common_1 = require("@nestjs/common");
var CostEstimatorService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var CostEstimatorService = _classThis = /** @class */ (function () {
        function CostEstimatorService_1() {
            this.logger = new common_1.Logger(CostEstimatorService.name);
            // Default metric constants (in production, read from RateCard or TenantConfiguration)
            this.DEFAULT_FUEL_COST_PER_KM = 0.45;
            this.DEFAULT_DRIVER_COST_PER_HOUR = 25.0;
            this.DEFAULT_MAINTENANCE_COST_PER_KM = 0.15;
            this.DEFAULT_SPEED_KMH = 65.0; // average speed
        }
        /**
         * Estimates cost and revenue for a specific assignment (Vehicle + Load).
         */
        CostEstimatorService_1.prototype.estimate = function (load, vehicle, driver, vehicleState) {
            var _a, _b;
            // 1. Calculate rough distance (Heuristic: in reality use Google Maps/Mapbox API)
            // We mock distance using a stable hash based on origin and destination strings to be deterministic.
            var distanceKm = this.mockDeterministicDistance(load.originCity, load.destinationCity);
            // Add deadhead distance if vehicle GPS is known from state
            var deadheadDistance = 0;
            if (((_a = vehicleState === null || vehicleState === void 0 ? void 0 : vehicleState.location) === null || _a === void 0 ? void 0 : _a.latitude) && ((_b = vehicleState === null || vehicleState === void 0 ? void 0 : vehicleState.location) === null || _b === void 0 ? void 0 : _b.longitude)) {
                // Mocked deadhead distance
                deadheadDistance = 50;
            }
            var totalDistance = distanceKm + deadheadDistance;
            // 2. Estimate duration
            var durationHours = totalDistance / this.DEFAULT_SPEED_KMH;
            // 3. Estimate Costs
            var fuelCost = totalDistance * this.DEFAULT_FUEL_COST_PER_KM;
            var maintenanceCost = totalDistance * this.DEFAULT_MAINTENANCE_COST_PER_KM;
            var driverCost = durationHours * this.DEFAULT_DRIVER_COST_PER_HOUR;
            // Additional heuristics: apply penalty if vehicle idle for long
            var idlePenalty = 0;
            if ((vehicleState === null || vehicleState === void 0 ? void 0 : vehicleState.idleDays) && vehicleState.idleDays > 3) {
                // We want to reward taking idle vehicles, so we effectively reduce cost internally?
                // No, cost is financial. We might adjust the objective function later.
                // But actually, long idle vehicles might require a minor prep cost.
                idlePenalty = 50;
            }
            var estimatedCost = fuelCost + maintenanceCost + driverCost + idlePenalty;
            // 4. Determine Revenue
            // Realistically, Load rate might already be set. If not, use a basic markup.
            var estimatedRevenue = load.rate;
            if (!estimatedRevenue || estimatedRevenue <= 0) {
                estimatedRevenue = estimatedCost * 1.3; // 30% margin default
            }
            var expectedMargin = estimatedRevenue - estimatedCost;
            // 5. Confidence Score
            // Decreases if we are missing real driver assignment or if deadhead is high
            var confidenceScore = 1.0;
            if (!driver)
                confidenceScore -= 0.2;
            if (deadheadDistance > 200)
                confidenceScore -= 0.1;
            return {
                estimatedCost: parseFloat(estimatedCost.toFixed(2)),
                estimatedRevenue: parseFloat(estimatedRevenue.toFixed(2)),
                expectedMargin: parseFloat(expectedMargin.toFixed(2)),
                confidenceScore: Math.max(0, confidenceScore),
                distanceKm: totalDistance,
                durationHours: parseFloat(durationHours.toFixed(1)),
            };
        };
        /**
         * Deterministic mock distance for stable testing without an external API.
         */
        CostEstimatorService_1.prototype.mockDeterministicDistance = function (origin, destination) {
            var str = "".concat(origin, "-").concat(destination).toLowerCase();
            var hash = 0;
            for (var i = 0; i < str.length; i++) {
                hash = (hash << 5) - hash + str.charCodeAt(i);
                hash |= 0;
            }
            // Return a pseudo-random distance between 100 and 1500 km
            return 100 + (Math.abs(hash) % 1400);
        };
        return CostEstimatorService_1;
    }());
    __setFunctionName(_classThis, "CostEstimatorService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        CostEstimatorService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return CostEstimatorService = _classThis;
}();
exports.CostEstimatorService = CostEstimatorService;
