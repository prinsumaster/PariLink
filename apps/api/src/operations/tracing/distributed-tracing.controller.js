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
exports.DistributedTracingController = void 0;
var common_1 = require("@nestjs/common");
var jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
var permissions_guard_1 = require("../../auth/guards/permissions.guard");
var permissions_decorator_1 = require("../../auth/decorators/permissions.decorator");
var swagger_1 = require("@nestjs/swagger");
var throttler_1 = require("@nestjs/throttler");
var DistributedTracingController = function () {
    var _classDecorators = [(0, swagger_1.ApiTags)('Operations - Distributed Tracing'), (0, swagger_1.ApiBearerAuth)(), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard), (0, throttler_1.SkipThrottle)(), (0, common_1.Controller)('operations/tracing')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _recordSpan_decorators;
    var _getTrace_decorators;
    var _searchTraces_decorators;
    var _getSlowestSpans_decorators;
    var DistributedTracingController = _classThis = /** @class */ (function () {
        function DistributedTracingController_1(tracingService) {
            this.tracingService = (__runInitializers(this, _instanceExtraInitializers), tracingService);
        }
        DistributedTracingController_1.prototype.recordSpan = function (user, body) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.tracingService.recordSpan({
                            traceId: body.traceId,
                            spanId: body.spanId,
                            parentSpanId: body.parentSpanId || null,
                            companyId: user.companyId,
                            serviceName: body.serviceName,
                            operationName: body.operationName,
                            startTime: new Date(body.startTime),
                            endTime: new Date(body.endTime),
                            durationMs: body.durationMs,
                            status: body.status,
                            tags: body.tags || {},
                            events: body.events || [],
                        })];
                });
            });
        };
        DistributedTracingController_1.prototype.getTrace = function (user, traceId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.tracingService.getTraceTree(traceId)];
                });
            });
        };
        DistributedTracingController_1.prototype.searchTraces = function (user, filter) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.tracingService.searchTraces(__assign(__assign({}, filter), { companyId: user.companyId }))];
                });
            });
        };
        DistributedTracingController_1.prototype.getSlowestSpans = function (user_1) {
            return __awaiter(this, arguments, void 0, function (user, limit) {
                if (limit === void 0) { limit = '20'; }
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.tracingService.searchTraces({
                            companyId: user.companyId,
                            minDurationMs: 500,
                            limit: parseInt(limit, 10),
                        })];
                });
            });
        };
        return DistributedTracingController_1;
    }());
    __setFunctionName(_classThis, "DistributedTracingController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _recordSpan_decorators = [(0, common_1.Post)('span'), (0, permissions_decorator_1.RequirePermissions)('operations:tracing:write'), (0, swagger_1.ApiOperation)({
                summary: 'Record a trace span (HTTP, Queue, Workflow, DB, ExternalAPI, Webhook)',
            })];
        _getTrace_decorators = [(0, common_1.Get)('trace/:traceId'), (0, permissions_decorator_1.RequirePermissions)('operations:tracing:read'), (0, swagger_1.ApiOperation)({
                summary: 'Get full distributed trace with all child spans assembled in waterfall order (Trace Explorer)',
            })];
        _searchTraces_decorators = [(0, common_1.Post)('search'), (0, permissions_decorator_1.RequirePermissions)('operations:tracing:read'), (0, swagger_1.ApiOperation)({
                summary: 'Search traces by service, operation, status, or minimum duration',
            })];
        _getSlowestSpans_decorators = [(0, common_1.Get)('slowest'), (0, permissions_decorator_1.RequirePermissions)('operations:tracing:read'), (0, swagger_1.ApiOperation)({ summary: 'Get top-N slowest trace spans sorted by duration' })];
        __esDecorate(_classThis, null, _recordSpan_decorators, { kind: "method", name: "recordSpan", static: false, private: false, access: { has: function (obj) { return "recordSpan" in obj; }, get: function (obj) { return obj.recordSpan; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getTrace_decorators, { kind: "method", name: "getTrace", static: false, private: false, access: { has: function (obj) { return "getTrace" in obj; }, get: function (obj) { return obj.getTrace; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _searchTraces_decorators, { kind: "method", name: "searchTraces", static: false, private: false, access: { has: function (obj) { return "searchTraces" in obj; }, get: function (obj) { return obj.searchTraces; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getSlowestSpans_decorators, { kind: "method", name: "getSlowestSpans", static: false, private: false, access: { has: function (obj) { return "getSlowestSpans" in obj; }, get: function (obj) { return obj.getSlowestSpans; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        DistributedTracingController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return DistributedTracingController = _classThis;
}();
exports.DistributedTracingController = DistributedTracingController;
