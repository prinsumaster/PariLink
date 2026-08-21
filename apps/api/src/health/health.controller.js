"use strict";
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
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
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthController = void 0;
var common_1 = require("@nestjs/common");
var terminus_1 = require("@nestjs/terminus");
var HealthController = function () {
    var _classDecorators = [(0, common_1.Controller)('health')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _checkLiveness_decorators;
    var _checkReadiness_decorators;
    var HealthController = _classThis = /** @class */ (function () {
        function HealthController_1(health, http, memory, prismaHealth, prismaService, redisIndicator, bullmqIndicator, jobsQueue) {
            this.health = (__runInitializers(this, _instanceExtraInitializers), health);
            this.http = http;
            this.memory = memory;
            this.prismaHealth = prismaHealth;
            this.prismaService = prismaService;
            this.redisIndicator = redisIndicator;
            this.bullmqIndicator = bullmqIndicator;
            this.jobsQueue = jobsQueue;
        }
        HealthController_1.prototype.checkLiveness = function () {
            var _this = this;
            return this.health.check([
                function () { return _this.memory.checkHeap('memory_heap', 500 * 1024 * 1024); },
            ]);
        };
        HealthController_1.prototype.checkReadiness = function () {
            var _this = this;
            return this.health.check([
                // Database health
                function () { return _this.prismaHealth.pingCheck('database', _this.prismaService); },
                // Memory heap health - alert if > 500MB
                function () { return _this.memory.checkHeap('memory_heap', 500 * 1024 * 1024); },
                // RSS memory health - alert if > 800MB
                function () { return _this.memory.checkRSS('memory_rss', 800 * 1024 * 1024); },
                // Redis health
                function () { return _this.redisIndicator.isHealthy('redis'); },
                // BullMQ health
                function () { return _this.bullmqIndicator.isHealthy('queues', [_this.jobsQueue]); },
            ]);
        };
        return HealthController_1;
    }());
    __setFunctionName(_classThis, "HealthController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _checkLiveness_decorators = [(0, common_1.Get)('liveness'), (0, terminus_1.HealthCheck)()];
        _checkReadiness_decorators = [(0, common_1.Get)('readiness'), (0, terminus_1.HealthCheck)()];
        __esDecorate(_classThis, null, _checkLiveness_decorators, { kind: "method", name: "checkLiveness", static: false, private: false, access: { has: function (obj) { return "checkLiveness" in obj; }, get: function (obj) { return obj.checkLiveness; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _checkReadiness_decorators, { kind: "method", name: "checkReadiness", static: false, private: false, access: { has: function (obj) { return "checkReadiness" in obj; }, get: function (obj) { return obj.checkReadiness; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        HealthController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return HealthController = _classThis;
}();
exports.HealthController = HealthController;
