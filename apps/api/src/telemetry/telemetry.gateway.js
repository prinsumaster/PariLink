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
exports.TelemetryGateway = void 0;
var websockets_1 = require("@nestjs/websockets");
var common_1 = require("@nestjs/common");
var event_emitter_1 = require("@nestjs/event-emitter");
var TelemetryGateway = function () {
    var _classDecorators = [(0, websockets_1.WebSocketGateway)({
            cors: {
                origin: '*',
            },
            namespace: '/telemetry',
        })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _server_decorators;
    var _server_initializers = [];
    var _server_extraInitializers = [];
    var _handleGpsPingReceived_decorators;
    var _handleGeofenceEntered_decorators;
    var _handleGeofenceExited_decorators;
    var _handleAlertTriggered_decorators;
    var TelemetryGateway = _classThis = /** @class */ (function () {
        function TelemetryGateway_1() {
            this.server = (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, _server_initializers, void 0));
            this.logger = (__runInitializers(this, _server_extraInitializers), new common_1.Logger(TelemetryGateway.name));
        }
        TelemetryGateway_1.prototype.handleConnection = function (client) {
            this.logger.log("Client connected: ".concat(client.id));
            // In production, we extract the token from headers/query, verify JWT,
            // and then join the user to their company's room.
            var companyId = client.handshake.query.companyId;
            if (companyId) {
                client.join("company_".concat(companyId));
                this.logger.log("Client ".concat(client.id, " joined room company_").concat(companyId));
            }
        };
        TelemetryGateway_1.prototype.handleDisconnect = function (client) {
            this.logger.log("Client disconnected: ".concat(client.id));
        };
        /**
         * Broadcast a telemetry update (location, speed, ETA) for a specific vehicle.
         * This is typically called internally by our TelemetryIngressService when
         * a truck's IoT device sends a ping via REST or MQTT.
         */
        TelemetryGateway_1.prototype.broadcastVehicleUpdate = function (companyId, update) {
            // We broadcast to all clients joined in this company's room
            this.server.to("company_".concat(companyId)).emit('vehicle_update', update);
        };
        /**
         * Broadcast an event stream item (e.g. Geofence entered, delayed)
         */
        TelemetryGateway_1.prototype.broadcastEvent = function (companyId, event) {
            this.server.to("company_".concat(companyId)).emit('event_stream', event);
        };
        /**
         * Broadcast an exception (e.g. Overspeeding, Late Delivery)
         */
        TelemetryGateway_1.prototype.broadcastException = function (companyId, exception) {
            this.server.to("company_".concat(companyId)).emit('exception_alert', exception);
        };
        TelemetryGateway_1.prototype.handleGpsPingReceived = function (event) {
            var tenantId = event.tenantId, payload = event.payload;
            // Broadcast the full vehicle update (location, speed, etc.)
            this.broadcastVehicleUpdate(tenantId, payload);
        };
        TelemetryGateway_1.prototype.handleGeofenceEntered = function (event) {
            var tenantId = event.tenantId, payload = event.payload, timestamp = event.timestamp;
            this.broadcastEvent(tenantId, {
                type: 'GEOFENCE_ENTERED',
                vehicleId: payload.vehicleId,
                geofenceName: payload.geofenceName,
                timestamp: timestamp,
            });
        };
        TelemetryGateway_1.prototype.handleGeofenceExited = function (event) {
            var tenantId = event.tenantId, payload = event.payload, timestamp = event.timestamp;
            this.broadcastEvent(tenantId, {
                type: 'GEOFENCE_EXITED',
                vehicleId: payload.vehicleId,
                geofenceName: payload.geofenceName,
                timestamp: timestamp,
            });
        };
        TelemetryGateway_1.prototype.handleAlertTriggered = function (event) {
            var tenantId = event.tenantId, payload = event.payload, timestamp = event.timestamp;
            this.broadcastException(tenantId, {
                alertId: payload.alertId,
                ruleType: payload.ruleType,
                timestamp: timestamp,
            });
        };
        return TelemetryGateway_1;
    }());
    __setFunctionName(_classThis, "TelemetryGateway");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _server_decorators = [(0, websockets_1.WebSocketServer)()];
        _handleGpsPingReceived_decorators = [(0, event_emitter_1.OnEvent)('GpsPing.Received')];
        _handleGeofenceEntered_decorators = [(0, event_emitter_1.OnEvent)('Geofence.Entered')];
        _handleGeofenceExited_decorators = [(0, event_emitter_1.OnEvent)('Geofence.Exited')];
        _handleAlertTriggered_decorators = [(0, event_emitter_1.OnEvent)('Alert.Triggered')];
        __esDecorate(_classThis, null, _handleGpsPingReceived_decorators, { kind: "method", name: "handleGpsPingReceived", static: false, private: false, access: { has: function (obj) { return "handleGpsPingReceived" in obj; }, get: function (obj) { return obj.handleGpsPingReceived; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _handleGeofenceEntered_decorators, { kind: "method", name: "handleGeofenceEntered", static: false, private: false, access: { has: function (obj) { return "handleGeofenceEntered" in obj; }, get: function (obj) { return obj.handleGeofenceEntered; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _handleGeofenceExited_decorators, { kind: "method", name: "handleGeofenceExited", static: false, private: false, access: { has: function (obj) { return "handleGeofenceExited" in obj; }, get: function (obj) { return obj.handleGeofenceExited; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _handleAlertTriggered_decorators, { kind: "method", name: "handleAlertTriggered", static: false, private: false, access: { has: function (obj) { return "handleAlertTriggered" in obj; }, get: function (obj) { return obj.handleAlertTriggered; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, null, _server_decorators, { kind: "field", name: "server", static: false, private: false, access: { has: function (obj) { return "server" in obj; }, get: function (obj) { return obj.server; }, set: function (obj, value) { obj.server = value; } }, metadata: _metadata }, _server_initializers, _server_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        TelemetryGateway = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return TelemetryGateway = _classThis;
}();
exports.TelemetryGateway = TelemetryGateway;
