"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
exports.BackgroundJobsDlqProcessor = exports.WebhooksDlqProcessor = void 0;
var common_1 = require("@nestjs/common");
var bullmq_1 = require("@nestjs/bullmq");
var WebhooksDlqProcessor = function () {
    var _classDecorators = [(0, common_1.Injectable)(), (0, bullmq_1.QueueEventsListener)('webhooks')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _classSuper = bullmq_1.QueueEventsHost;
    var _instanceExtraInitializers = [];
    var _onFailed_decorators;
    var WebhooksDlqProcessor = _classThis = /** @class */ (function (_super) {
        __extends(WebhooksDlqProcessor_1, _super);
        function WebhooksDlqProcessor_1() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.logger = (__runInitializers(_this, _instanceExtraInitializers), new common_1.Logger(WebhooksDlqProcessor.name));
            return _this;
        }
        WebhooksDlqProcessor_1.prototype.onFailed = function (_a) {
            var jobId = _a.jobId, failedReason = _a.failedReason;
            // Explicit DLQ Processor Hook
            // In an enterprise system, this could trigger PagerDuty, update a DB record, or move to a separate 'dlq' queue
            this.logger.error("[DLQ-WEBHOOKS] Job ".concat(jobId, " completely failed. Reason: ").concat(failedReason));
        };
        return WebhooksDlqProcessor_1;
    }(_classSuper));
    __setFunctionName(_classThis, "WebhooksDlqProcessor");
    (function () {
        var _a;
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create((_a = _classSuper[Symbol.metadata]) !== null && _a !== void 0 ? _a : null) : void 0;
        _onFailed_decorators = [(0, bullmq_1.OnQueueEvent)('failed')];
        __esDecorate(_classThis, null, _onFailed_decorators, { kind: "method", name: "onFailed", static: false, private: false, access: { has: function (obj) { return "onFailed" in obj; }, get: function (obj) { return obj.onFailed; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        WebhooksDlqProcessor = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return WebhooksDlqProcessor = _classThis;
}();
exports.WebhooksDlqProcessor = WebhooksDlqProcessor;
var BackgroundJobsDlqProcessor = function () {
    var _classDecorators = [(0, common_1.Injectable)(), (0, bullmq_1.QueueEventsListener)('background_jobs')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _classSuper = bullmq_1.QueueEventsHost;
    var _instanceExtraInitializers = [];
    var _onFailed_decorators;
    var BackgroundJobsDlqProcessor = _classThis = /** @class */ (function (_super) {
        __extends(BackgroundJobsDlqProcessor_1, _super);
        function BackgroundJobsDlqProcessor_1() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.logger = (__runInitializers(_this, _instanceExtraInitializers), new common_1.Logger(BackgroundJobsDlqProcessor.name));
            return _this;
        }
        BackgroundJobsDlqProcessor_1.prototype.onFailed = function (_a) {
            var jobId = _a.jobId, failedReason = _a.failedReason;
            // Explicit DLQ Processor Hook
            this.logger.error("[DLQ-BACKGROUND-JOBS] Job ".concat(jobId, " completely failed. Reason: ").concat(failedReason));
        };
        return BackgroundJobsDlqProcessor_1;
    }(_classSuper));
    __setFunctionName(_classThis, "BackgroundJobsDlqProcessor");
    (function () {
        var _a;
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create((_a = _classSuper[Symbol.metadata]) !== null && _a !== void 0 ? _a : null) : void 0;
        _onFailed_decorators = [(0, bullmq_1.OnQueueEvent)('failed')];
        __esDecorate(_classThis, null, _onFailed_decorators, { kind: "method", name: "onFailed", static: false, private: false, access: { has: function (obj) { return "onFailed" in obj; }, get: function (obj) { return obj.onFailed; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        BackgroundJobsDlqProcessor = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return BackgroundJobsDlqProcessor = _classThis;
}();
exports.BackgroundJobsDlqProcessor = BackgroundJobsDlqProcessor;
