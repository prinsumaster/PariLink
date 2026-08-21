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
exports.RealtimeController = void 0;
var common_1 = require("@nestjs/common");
// import { JwtAuthGuard } from '../../auth/jwt-auth.guard'; // Assume auth guard exists, keeping simple for demo
var RealtimeController = function () {
    var _classDecorators = [(0, common_1.Controller)('realtime')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _stream_decorators;
    var RealtimeController = _classThis = /** @class */ (function () {
        function RealtimeController_1(realtimeService) {
            this.realtimeService = (__runInitializers(this, _instanceExtraInitializers), realtimeService);
        }
        // @UseGuards(JwtAuthGuard) // Commented out to avoid setup issues for this phase
        RealtimeController_1.prototype.stream = function (req) {
            var _a;
            // In a real app, we extract tenantId/userId from req.user
            // For this implementation, we use a global demo tenant
            var tenantId = ((_a = req.user) === null || _a === void 0 ? void 0 : _a.companyId) || 'DEMO_COMPANY';
            return this.realtimeService.subscribeToCompanyEvents(tenantId);
        };
        return RealtimeController_1;
    }());
    __setFunctionName(_classThis, "RealtimeController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _stream_decorators = [(0, common_1.Sse)('stream')];
        __esDecorate(_classThis, null, _stream_decorators, { kind: "method", name: "stream", static: false, private: false, access: { has: function (obj) { return "stream" in obj; }, get: function (obj) { return obj.stream; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        RealtimeController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return RealtimeController = _classThis;
}();
exports.RealtimeController = RealtimeController;
