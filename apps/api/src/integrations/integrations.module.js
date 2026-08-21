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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntegrationsModule = void 0;
var common_1 = require("@nestjs/common");
var integrations_controller_1 = require("./integrations.controller");
var integrations_service_1 = require("./integrations.service");
var crypto_service_1 = require("./security/crypto.service");
var connector_factory_service_1 = require("./connectors/connector-factory.service");
var sync_engine_processor_1 = require("./sync/sync-engine.processor");
var webhook_controller_1 = require("./webhooks/webhook.controller");
var gateway_controller_1 = require("./gateway/gateway.controller");
var razorpay_service_1 = require("./razorpay.service");
var resend_service_1 = require("./resend.service");
var twilio_service_1 = require("./twilio.service");
var loconav_service_1 = require("./loconav.service");
var bullmq_1 = require("@nestjs/bullmq");
var IntegrationsModule = function () {
    var _classDecorators = [(0, common_1.Module)({
            imports: [
                bullmq_1.BullModule.registerQueue({
                    name: 'integration-sync',
                }),
            ],
            controllers: [integrations_controller_1.IntegrationsController, webhook_controller_1.WebhookController, gateway_controller_1.GatewayController],
            providers: __spreadArray(__spreadArray([
                integrations_service_1.IntegrationsService,
                crypto_service_1.CryptoService,
                connector_factory_service_1.ConnectorFactoryService
            ], (process.env.RUN_WORKERS === 'true' ? __spreadArray([], (process.env.RUN_WORKERS === 'true' ? [sync_engine_processor_1.SyncEngineProcessor] : []), true) : []), true), [
                razorpay_service_1.RazorpayService,
                resend_service_1.ResendService,
                twilio_service_1.TwilioService,
                loconav_service_1.LocoNavService,
            ], false),
            exports: [
                integrations_service_1.IntegrationsService,
                crypto_service_1.CryptoService,
                connector_factory_service_1.ConnectorFactoryService,
                razorpay_service_1.RazorpayService,
                resend_service_1.ResendService,
                twilio_service_1.TwilioService,
                loconav_service_1.LocoNavService,
            ],
        })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var IntegrationsModule = _classThis = /** @class */ (function () {
        function IntegrationsModule_1() {
        }
        return IntegrationsModule_1;
    }());
    __setFunctionName(_classThis, "IntegrationsModule");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        IntegrationsModule = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return IntegrationsModule = _classThis;
}();
exports.IntegrationsModule = IntegrationsModule;
