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
exports.SyncSchedulerController = void 0;
var common_1 = require("@nestjs/common");
var swagger_1 = require("@nestjs/swagger");
var jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
var permissions_guard_1 = require("../../auth/guards/permissions.guard");
var permissions_decorator_1 = require("../../auth/decorators/permissions.decorator");
var SyncSchedulerController = function () {
    var _classDecorators = [(0, swagger_1.ApiTags)('Synchronization Scheduler'), (0, swagger_1.ApiBearerAuth)(), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard), (0, common_1.Controller)('integration/sync')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _scheduleSync_decorators;
    var _listSchedules_decorators;
    var _triggerSync_decorators;
    var _getSyncHistory_decorators;
    var _getSyncErrors_decorators;
    var _resolveError_decorators;
    var SyncSchedulerController = _classThis = /** @class */ (function () {
        function SyncSchedulerController_1(syncEngine) {
            this.syncEngine = (__runInitializers(this, _instanceExtraInitializers), syncEngine);
        }
        SyncSchedulerController_1.prototype.scheduleSync = function (user, dto) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.syncEngine.scheduleSync(user.companyId, user.userId, dto)];
                });
            });
        };
        SyncSchedulerController_1.prototype.listSchedules = function (user) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.syncEngine.listSchedules(user.companyId)];
                });
            });
        };
        SyncSchedulerController_1.prototype.triggerSync = function (user, dto) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.syncEngine.triggerSync(user.companyId, dto.connectionId, dto.entityType, dto.payload)];
                });
            });
        };
        SyncSchedulerController_1.prototype.getSyncHistory = function (user, connectionId, status, limit) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.syncEngine.getSyncHistory(user.companyId, {
                            connectionId: connectionId,
                            status: status,
                            limit: limit ? Number(limit) : 50,
                        })];
                });
            });
        };
        SyncSchedulerController_1.prototype.getSyncErrors = function (user, connectionId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.syncEngine.getSyncErrors(user.companyId, connectionId)];
                });
            });
        };
        SyncSchedulerController_1.prototype.resolveError = function (user, errorId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.syncEngine.resolveError(user.companyId, errorId, user.userId)];
                });
            });
        };
        return SyncSchedulerController_1;
    }());
    __setFunctionName(_classThis, "SyncSchedulerController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _scheduleSync_decorators = [(0, common_1.Post)('schedules'), (0, permissions_decorator_1.RequirePermissions)('integrations:write'), (0, swagger_1.ApiOperation)({
                summary: 'Schedule an automated recurring sync job using cron expression',
            })];
        _listSchedules_decorators = [(0, common_1.Get)('schedules'), (0, permissions_decorator_1.RequirePermissions)('integrations:read'), (0, swagger_1.ApiOperation)({
                summary: 'List all active and inactive recurring sync schedules',
            })];
        _triggerSync_decorators = [(0, common_1.Post)('trigger'), (0, permissions_decorator_1.RequirePermissions)('integrations:write'), (0, swagger_1.ApiOperation)({
                summary: 'Manually trigger an immediate full or incremental synchronization',
            })];
        _getSyncHistory_decorators = [(0, common_1.Get)('history'), (0, permissions_decorator_1.RequirePermissions)('integrations:read'), (0, swagger_1.ApiOperation)({
                summary: 'List sync job execution history and processed record counts',
            })];
        _getSyncErrors_decorators = [(0, common_1.Get)('errors'), (0, permissions_decorator_1.RequirePermissions)('integrations:read'), (0, swagger_1.ApiOperation)({
                summary: 'List synchronization failure logs and exception stack traces',
            })];
        _resolveError_decorators = [(0, common_1.Post)('errors/:id/resolve'), (0, permissions_decorator_1.RequirePermissions)('integrations:write'), (0, swagger_1.ApiOperation)({ summary: 'Mark a synchronization error as resolved' })];
        __esDecorate(_classThis, null, _scheduleSync_decorators, { kind: "method", name: "scheduleSync", static: false, private: false, access: { has: function (obj) { return "scheduleSync" in obj; }, get: function (obj) { return obj.scheduleSync; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _listSchedules_decorators, { kind: "method", name: "listSchedules", static: false, private: false, access: { has: function (obj) { return "listSchedules" in obj; }, get: function (obj) { return obj.listSchedules; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _triggerSync_decorators, { kind: "method", name: "triggerSync", static: false, private: false, access: { has: function (obj) { return "triggerSync" in obj; }, get: function (obj) { return obj.triggerSync; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getSyncHistory_decorators, { kind: "method", name: "getSyncHistory", static: false, private: false, access: { has: function (obj) { return "getSyncHistory" in obj; }, get: function (obj) { return obj.getSyncHistory; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getSyncErrors_decorators, { kind: "method", name: "getSyncErrors", static: false, private: false, access: { has: function (obj) { return "getSyncErrors" in obj; }, get: function (obj) { return obj.getSyncErrors; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _resolveError_decorators, { kind: "method", name: "resolveError", static: false, private: false, access: { has: function (obj) { return "resolveError" in obj; }, get: function (obj) { return obj.resolveError; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        SyncSchedulerController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return SyncSchedulerController = _classThis;
}();
exports.SyncSchedulerController = SyncSchedulerController;
