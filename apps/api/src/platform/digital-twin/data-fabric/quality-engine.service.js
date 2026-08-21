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
exports.DataQualityEngine = void 0;
var common_1 = require("@nestjs/common");
var DataQualityEngine = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var DataQualityEngine = _classThis = /** @class */ (function () {
        function DataQualityEngine_1() {
            this.logger = new common_1.Logger(DataQualityEngine.name);
        }
        DataQualityEngine_1.prototype.validateAndCleanse = function (event) {
            var score = 100;
            // 1. Validate Geospatial integrity
            if (event.latitude !== undefined && event.longitude !== undefined) {
                if (event.latitude < -90 ||
                    event.latitude > 90 ||
                    event.longitude < -180 ||
                    event.longitude > 180 ||
                    (event.latitude === 0 && event.longitude === 0)) {
                    return {
                        isValid: false,
                        score: 0,
                        rejectionReason: 'INVALID_COORDINATES',
                        cleansedEvent: event,
                    };
                }
            }
            // 2. Validate Speed limits (Impossible physics)
            if (event.speed !== undefined) {
                if (event.speed < 0 || event.speed > 250) {
                    // Max realistic speed is < 250 km/h for fleet
                    this.logger.warn("Dropping impossible speed ".concat(event.speed, " km/h from provider ").concat(event.provider));
                    event.speed = undefined;
                    score -= 20;
                }
            }
            // 3. Impute missing heading if speed > 0 and coordinates exist
            // (A real AI model might interpolate from the last known state, here we just penalize quality)
            if (event.speed && event.speed > 0 && event.heading === undefined) {
                score -= 5;
            }
            // 4. Timestamp anomalies
            var ageInMinutes = (new Date().getTime() - new Date(event.timestamp).getTime()) / 60000;
            if (ageInMinutes > 60) {
                score -= Math.min(30, Math.floor(ageInMinutes / 60)); // Penalize old data
            }
            else if (ageInMinutes < -5) {
                return {
                    isValid: false,
                    score: 0,
                    rejectionReason: 'FUTURE_TIMESTAMP',
                    cleansedEvent: event,
                };
            }
            return {
                isValid: true,
                score: score,
                cleansedEvent: event,
            };
        };
        return DataQualityEngine_1;
    }());
    __setFunctionName(_classThis, "DataQualityEngine");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        DataQualityEngine = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return DataQualityEngine = _classThis;
}();
exports.DataQualityEngine = DataQualityEngine;
