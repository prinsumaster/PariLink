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
exports.RealtimeService = void 0;
var common_1 = require("@nestjs/common");
var event_emitter_1 = require("@nestjs/event-emitter");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var RealtimeService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _handleAllEvents_decorators;
    var RealtimeService = _classThis = /** @class */ (function () {
        function RealtimeService_1() {
            this.logger = (__runInitializers(this, _instanceExtraInitializers), new common_1.Logger(RealtimeService.name));
            // Single global subject for all internal events.
            // In a multi-instance production environment, this would be backed by Redis Pub/Sub.
            this.globalEventSubject = new rxjs_1.Subject();
        }
        // Subscribe to ALL events fired by the application's EventEmitter
        RealtimeService_1.prototype.handleAllEvents = function (payload) {
            // The EventEmitter2 passes the event payload directly, but we don't necessarily get the event name here
            // unless we use the event context. NestJS @OnEvent doesn't inject the name into the args.
            // However, to keep it simple, if it's a PlatformEvent we just broadcast it.
            // Safety check - we only broadcast events that have a tenantId to avoid leaking system events
            if (payload && payload.tenantId) {
                this.globalEventSubject.next({
                    // Extract type from payload if it exists, otherwise default
                    eventName: payload.type || 'SYSTEM_EVENT',
                    payload: payload,
                });
            }
        };
        // Allow a client to subscribe to events for their specific company
        RealtimeService_1.prototype.subscribeToCompanyEvents = function (tenantId) {
            var _this = this;
            this.logger.log("Client subscribed to real-time events for tenant: ".concat(tenantId));
            return this.globalEventSubject.asObservable().pipe(
            // 1. Filter events so users only see their own company's data
            (0, operators_1.filter)(function (event) { return event.payload.tenantId === tenantId; }), 
            // 2. Map to the SSE format required by NestJS (MessageEvent)
            (0, operators_1.map)(function (event) {
                // Map backend event structure to the frontend's expected RealtimeEvent structure
                var sseData = {
                    id: event.payload.correlationId || "evt-".concat(Date.now()),
                    type: _this.mapEventNameToFrontendType(event.eventName),
                    payload: event.payload.payload, // The actual data
                    timestamp: event.payload.timestamp || new Date().toISOString(),
                };
                return { data: sseData };
            }));
        };
        RealtimeService_1.prototype.mapEventNameToFrontendType = function (eventName) {
            if (eventName.includes('AiAlert') || eventName.includes('Anomaly')) {
                return 'AI_ALERT';
            }
            if (eventName.includes('Location') || eventName.includes('Telemetry')) {
                return 'TELEMETRY_UPDATED';
            }
            if (eventName.includes('Created') || eventName.includes('Updated')) {
                return 'ENTITY_UPDATED';
            }
            return 'SYSTEM_NOTIFICATION';
        };
        return RealtimeService_1;
    }());
    __setFunctionName(_classThis, "RealtimeService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _handleAllEvents_decorators = [(0, event_emitter_1.OnEvent)('**')];
        __esDecorate(_classThis, null, _handleAllEvents_decorators, { kind: "method", name: "handleAllEvents", static: false, private: false, access: { has: function (obj) { return "handleAllEvents" in obj; }, get: function (obj) { return obj.handleAllEvents; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        RealtimeService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return RealtimeService = _classThis;
}();
exports.RealtimeService = RealtimeService;
