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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnterpriseTelematicsController = void 0;
var common_1 = require("@nestjs/common");
var jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
var permissions_guard_1 = require("../../auth/guards/permissions.guard");
var permissions_decorator_1 = require("../../auth/decorators/permissions.decorator");
var swagger_1 = require("@nestjs/swagger");
var EnterpriseTelematicsController = function () {
    var _classDecorators = [(0, swagger_1.ApiTags)('Enterprise Fleet Telematics, IoT & Geofence Intelligence Platform'), (0, swagger_1.ApiBearerAuth)(), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard), (0, common_1.Controller)('tracking/enterprise')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _ingestTelemetry_decorators;
    var _createGeofence_decorators;
    var _getGeofences_decorators;
    var _getGeofenceById_decorators;
    var _deleteGeofence_decorators;
    var _evaluateLocation_decorators;
    var _getGeofenceEvents_decorators;
    var _createAlertRule_decorators;
    var _getAlertRules_decorators;
    var _deleteAlertRule_decorators;
    var _getAlerts_decorators;
    var _updateAlertStatus_decorators;
    var _getAnalytics_decorators;
    var EnterpriseTelematicsController = _classThis = /** @class */ (function () {
        function EnterpriseTelematicsController_1(geofenceEngine, telematicsService) {
            this.geofenceEngine = (__runInitializers(this, _instanceExtraInitializers), geofenceEngine);
            this.telematicsService = telematicsService;
        }
        // --- TELEMETRY INGESTION ---
        EnterpriseTelematicsController_1.prototype.ingestTelemetry = function (dto, user) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.telematicsService.ingestTelemetry(user.companyId, dto)];
                });
            });
        };
        // --- GEOFENCE MANAGEMENT ---
        EnterpriseTelematicsController_1.prototype.createGeofence = function (dto, user) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.geofenceEngine.createGeofence(user.companyId, user.userId, dto)];
                });
            });
        };
        EnterpriseTelematicsController_1.prototype.getGeofences = function (type_1) {
            return __awaiter(this, arguments, void 0, function (type, user) {
                if (user === void 0) { user = {}; }
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.geofenceEngine.getGeofences(user.companyId, type)];
                });
            });
        };
        EnterpriseTelematicsController_1.prototype.getGeofenceById = function (id, user) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.geofenceEngine.getGeofenceById(user.companyId, id)];
                });
            });
        };
        EnterpriseTelematicsController_1.prototype.deleteGeofence = function (id, user) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.geofenceEngine.deleteGeofence(user.companyId, id, user.userId)];
                });
            });
        };
        EnterpriseTelematicsController_1.prototype.evaluateLocation = function (dto, user) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.geofenceEngine.evaluateLocationAgainstGeofences(user.companyId, dto.vehicleId, dto.latitude, dto.longitude, dto.timestamp ? new Date(dto.timestamp) : new Date())];
                });
            });
        };
        EnterpriseTelematicsController_1.prototype.getGeofenceEvents = function (geofenceId_1, vehicleId_1) {
            return __awaiter(this, arguments, void 0, function (geofenceId, vehicleId, user) {
                if (user === void 0) { user = {}; }
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.geofenceEngine.getGeofenceEvents(user.companyId, geofenceId, vehicleId)];
                });
            });
        };
        // --- ALERT RULES & FLEET HEALTH ---
        EnterpriseTelematicsController_1.prototype.createAlertRule = function (dto, user) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.telematicsService.createAlertRule(user.companyId, user.userId, dto)];
                });
            });
        };
        EnterpriseTelematicsController_1.prototype.getAlertRules = function (user) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.telematicsService.getAlertRules(user.companyId)];
                });
            });
        };
        EnterpriseTelematicsController_1.prototype.deleteAlertRule = function (id, user) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.telematicsService.deleteAlertRule(user.companyId, id, user.userId)];
                });
            });
        };
        EnterpriseTelematicsController_1.prototype.getAlerts = function (status_1, vehicleId_1) {
            return __awaiter(this, arguments, void 0, function (status, vehicleId, user) {
                if (user === void 0) { user = {}; }
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.telematicsService.getAlerts(user.companyId, status, vehicleId)];
                });
            });
        };
        EnterpriseTelematicsController_1.prototype.updateAlertStatus = function (id, dto, user) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.telematicsService.updateAlertStatus(user.companyId, id, user.userId, dto)];
                });
            });
        };
        EnterpriseTelematicsController_1.prototype.getAnalytics = function (user) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.telematicsService.getFleetHealthAnalytics(user.companyId)];
                });
            });
        };
        return EnterpriseTelematicsController_1;
    }());
    __setFunctionName(_classThis, "EnterpriseTelematicsController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _ingestTelemetry_decorators = [(0, common_1.Post)('telemetry'), (0, permissions_decorator_1.RequirePermissions)('tracking:write'), (0, swagger_1.ApiOperation)({
                summary: 'Ingest real-time OBD-II and CAN-bus telemetry and evaluate alert rules',
            })];
        _createGeofence_decorators = [(0, common_1.Post)('geofences'), (0, permissions_decorator_1.RequirePermissions)('tracking:write'), (0, swagger_1.ApiOperation)({ summary: 'Create circular or polygon geofence' })];
        _getGeofences_decorators = [(0, common_1.Get)('geofences'), (0, permissions_decorator_1.RequirePermissions)('tracking:read'), (0, swagger_1.ApiOperation)({ summary: 'List active geofences' })];
        _getGeofenceById_decorators = [(0, common_1.Get)('geofences/:id'), (0, permissions_decorator_1.RequirePermissions)('tracking:read'), (0, swagger_1.ApiOperation)({ summary: 'Get geofence by ID with recent transition events' })];
        _deleteGeofence_decorators = [(0, common_1.Delete)('geofences/:id'), (0, permissions_decorator_1.RequirePermissions)('tracking:write'), (0, swagger_1.ApiOperation)({ summary: 'Delete geofence' })];
        _evaluateLocation_decorators = [(0, common_1.Post)('geofences/evaluate'), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, permissions_decorator_1.RequirePermissions)('tracking:write'), (0, swagger_1.ApiOperation)({
                summary: 'Evaluate GPS location against geofences and record boundary transitions',
            })];
        _getGeofenceEvents_decorators = [(0, common_1.Get)('geofence-events'), (0, permissions_decorator_1.RequirePermissions)('tracking:read'), (0, swagger_1.ApiOperation)({
                summary: 'View recent geofence boundary transition and dwell time events',
            })];
        _createAlertRule_decorators = [(0, common_1.Post)('alert-rules'), (0, permissions_decorator_1.RequirePermissions)('tracking:write'), (0, swagger_1.ApiOperation)({ summary: 'Create IoT/telematics alert rule' })];
        _getAlertRules_decorators = [(0, common_1.Get)('alert-rules'), (0, permissions_decorator_1.RequirePermissions)('tracking:read'), (0, swagger_1.ApiOperation)({ summary: 'List alert rules' })];
        _deleteAlertRule_decorators = [(0, common_1.Delete)('alert-rules/:id'), (0, permissions_decorator_1.RequirePermissions)('tracking:write'), (0, swagger_1.ApiOperation)({ summary: 'Delete alert rule' })];
        _getAlerts_decorators = [(0, common_1.Get)('alerts'), (0, permissions_decorator_1.RequirePermissions)('tracking:read'), (0, swagger_1.ApiOperation)({ summary: 'List generated telematics and safety alerts' })];
        _updateAlertStatus_decorators = [(0, common_1.Put)('alerts/:id/status'), (0, permissions_decorator_1.RequirePermissions)('tracking:write'), (0, swagger_1.ApiOperation)({ summary: 'Acknowledge or resolve an alert' })];
        _getAnalytics_decorators = [(0, common_1.Get)('analytics'), (0, permissions_decorator_1.RequirePermissions)('tracking:read'), (0, swagger_1.ApiOperation)({ summary: 'Get real-time fleet health and safety analytics' })];
        __esDecorate(_classThis, null, _ingestTelemetry_decorators, { kind: "method", name: "ingestTelemetry", static: false, private: false, access: { has: function (obj) { return "ingestTelemetry" in obj; }, get: function (obj) { return obj.ingestTelemetry; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _createGeofence_decorators, { kind: "method", name: "createGeofence", static: false, private: false, access: { has: function (obj) { return "createGeofence" in obj; }, get: function (obj) { return obj.createGeofence; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getGeofences_decorators, { kind: "method", name: "getGeofences", static: false, private: false, access: { has: function (obj) { return "getGeofences" in obj; }, get: function (obj) { return obj.getGeofences; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getGeofenceById_decorators, { kind: "method", name: "getGeofenceById", static: false, private: false, access: { has: function (obj) { return "getGeofenceById" in obj; }, get: function (obj) { return obj.getGeofenceById; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _deleteGeofence_decorators, { kind: "method", name: "deleteGeofence", static: false, private: false, access: { has: function (obj) { return "deleteGeofence" in obj; }, get: function (obj) { return obj.deleteGeofence; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _evaluateLocation_decorators, { kind: "method", name: "evaluateLocation", static: false, private: false, access: { has: function (obj) { return "evaluateLocation" in obj; }, get: function (obj) { return obj.evaluateLocation; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getGeofenceEvents_decorators, { kind: "method", name: "getGeofenceEvents", static: false, private: false, access: { has: function (obj) { return "getGeofenceEvents" in obj; }, get: function (obj) { return obj.getGeofenceEvents; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _createAlertRule_decorators, { kind: "method", name: "createAlertRule", static: false, private: false, access: { has: function (obj) { return "createAlertRule" in obj; }, get: function (obj) { return obj.createAlertRule; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getAlertRules_decorators, { kind: "method", name: "getAlertRules", static: false, private: false, access: { has: function (obj) { return "getAlertRules" in obj; }, get: function (obj) { return obj.getAlertRules; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _deleteAlertRule_decorators, { kind: "method", name: "deleteAlertRule", static: false, private: false, access: { has: function (obj) { return "deleteAlertRule" in obj; }, get: function (obj) { return obj.deleteAlertRule; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getAlerts_decorators, { kind: "method", name: "getAlerts", static: false, private: false, access: { has: function (obj) { return "getAlerts" in obj; }, get: function (obj) { return obj.getAlerts; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _updateAlertStatus_decorators, { kind: "method", name: "updateAlertStatus", static: false, private: false, access: { has: function (obj) { return "updateAlertStatus" in obj; }, get: function (obj) { return obj.updateAlertStatus; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getAnalytics_decorators, { kind: "method", name: "getAnalytics", static: false, private: false, access: { has: function (obj) { return "getAnalytics" in obj; }, get: function (obj) { return obj.getAnalytics; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        EnterpriseTelematicsController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return EnterpriseTelematicsController = _classThis;
}();
exports.EnterpriseTelematicsController = EnterpriseTelematicsController;
