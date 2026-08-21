"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.ScoringEngine = exports.DEFAULT_SCORING_WEIGHTS = void 0;
var common_1 = require("@nestjs/common");
exports.DEFAULT_SCORING_WEIGHTS = {
    distanceKm: 30,
    driverHoursRemaining: 20,
    vehicleUtilization: 20,
    driverSafetyScore: 20,
    idleTimeDays: 10,
};
var ScoringEngine = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var ScoringEngine = _classThis = /** @class */ (function () {
        function ScoringEngine_1() {
        }
        /**
         * Scores each candidate against the configured weights.
         * Returns candidates sorted best-first (highest score).
         */
        ScoringEngine_1.prototype.score = function (candidates, weights) {
            if (weights === void 0) { weights = {}; }
            var w = __assign(__assign({}, exports.DEFAULT_SCORING_WEIGHTS), weights);
            var totalWeight = Object.values(w).reduce(function (a, b) { return a + b; }, 0);
            var scored = candidates.map(function (c) {
                // Normalize each dimension 0–100 then apply weight
                var distanceScore = Math.max(0, 100 - c.distanceToPickupKm); // closer = higher
                var hoursScore = (c.driverHoursRemainingToday / 11) * 100;
                var utilizationScore = c.vehicleUtilizationPct;
                var safetyScore = c.driverSafetyScore;
                var idleScore = Math.max(0, 100 - c.vehicleIdleDays * 10); // fresh vehicles preferred
                var weighted = (distanceScore * w.distanceKm +
                    hoursScore * w.driverHoursRemaining +
                    utilizationScore * w.vehicleUtilization +
                    safetyScore * w.driverSafetyScore +
                    idleScore * w.idleTimeDays) /
                    totalWeight;
                return __assign(__assign({}, c), { totalScore: Math.round(weighted * 100) / 100, scoreBreakdown: {
                        distance: Math.round(distanceScore),
                        hours: Math.round(hoursScore),
                        utilization: Math.round(utilizationScore),
                        safety: Math.round(safetyScore),
                        idle: Math.round(idleScore),
                    } });
            });
            return scored.sort(function (a, b) { return b.totalScore - a.totalScore; });
        };
        return ScoringEngine_1;
    }());
    __setFunctionName(_classThis, "ScoringEngine");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ScoringEngine = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ScoringEngine = _classThis;
}();
exports.ScoringEngine = ScoringEngine;
