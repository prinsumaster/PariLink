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
exports.EnterpriseNotificationController = void 0;
var common_1 = require("@nestjs/common");
var jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
var permissions_guard_1 = require("../../auth/guards/permissions.guard");
var permissions_decorator_1 = require("../../auth/decorators/permissions.decorator");
var swagger_1 = require("@nestjs/swagger");
var EnterpriseNotificationController = function () {
    var _classDecorators = [(0, swagger_1.ApiTags)('Enterprise Notification & Multi-Channel Alerting Platform'), (0, swagger_1.ApiBearerAuth)(), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard), (0, common_1.Controller)('notifications/enterprise')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _createTemplate_decorators;
    var _getTemplates_decorators;
    var _updateTemplate_decorators;
    var _deleteTemplate_decorators;
    var _dispatch_decorators;
    var _getMetrics_decorators;
    var _retryFailed_decorators;
    var EnterpriseNotificationController = _classThis = /** @class */ (function () {
        function EnterpriseNotificationController_1(orchestrator) {
            this.orchestrator = (__runInitializers(this, _instanceExtraInitializers), orchestrator);
        }
        EnterpriseNotificationController_1.prototype.createTemplate = function (dto, user) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.orchestrator.createTemplate(user.companyId, user.id, dto)];
                });
            });
        };
        EnterpriseNotificationController_1.prototype.getTemplates = function (eventType_1) {
            return __awaiter(this, arguments, void 0, function (eventType, user) {
                if (user === void 0) { user = {}; }
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.orchestrator.getTemplates(user.companyId, eventType)];
                });
            });
        };
        EnterpriseNotificationController_1.prototype.updateTemplate = function (id, dto, user) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.orchestrator.updateTemplate(user.companyId, id, user.id, dto)];
                });
            });
        };
        EnterpriseNotificationController_1.prototype.deleteTemplate = function (id, user) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.orchestrator.deleteTemplate(user.companyId, id, user.id)];
                });
            });
        };
        EnterpriseNotificationController_1.prototype.dispatch = function (dto, user) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.orchestrator.dispatchNotification(user.companyId, user.id, dto)];
                });
            });
        };
        EnterpriseNotificationController_1.prototype.getMetrics = function (user) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.orchestrator.getDeliveryMetrics(user.companyId)];
                });
            });
        };
        EnterpriseNotificationController_1.prototype.retryFailed = function (user) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.orchestrator.retryFailedDeliveries(user.companyId, user.id)];
                });
            });
        };
        return EnterpriseNotificationController_1;
    }());
    __setFunctionName(_classThis, "EnterpriseNotificationController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _createTemplate_decorators = [(0, common_1.Post)('templates'), (0, permissions_decorator_1.RequirePermissions)('notifications:create'), (0, swagger_1.ApiOperation)({ summary: 'Create a notification template rule' })];
        _getTemplates_decorators = [(0, common_1.Get)('templates'), (0, permissions_decorator_1.RequirePermissions)('notifications:read'), (0, swagger_1.ApiOperation)({ summary: 'Get notification templates' })];
        _updateTemplate_decorators = [(0, common_1.Put)('templates/:id'), (0, permissions_decorator_1.RequirePermissions)('notifications:update'), (0, swagger_1.ApiOperation)({ summary: 'Update notification template rule' })];
        _deleteTemplate_decorators = [(0, common_1.Delete)('templates/:id'), (0, permissions_decorator_1.RequirePermissions)('notifications:delete'), (0, swagger_1.ApiOperation)({ summary: 'Delete notification template rule' })];
        _dispatch_decorators = [(0, common_1.Post)('dispatch'), (0, permissions_decorator_1.RequirePermissions)('notifications:create'), (0, swagger_1.ApiOperation)({
                summary: 'Dispatch multi-channel notification (In-App, SMS, Email, Slack)',
            })];
        _getMetrics_decorators = [(0, common_1.Get)('metrics'), (0, permissions_decorator_1.RequirePermissions)('notifications:read'), (0, swagger_1.ApiOperation)({
                summary: 'Get real-time notification delivery and channel metrics',
            })];
        _retryFailed_decorators = [(0, common_1.Post)('retry-failed'), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, permissions_decorator_1.RequirePermissions)('notifications:update'), (0, swagger_1.ApiOperation)({ summary: 'Batch retry failed notification deliveries' })];
        __esDecorate(_classThis, null, _createTemplate_decorators, { kind: "method", name: "createTemplate", static: false, private: false, access: { has: function (obj) { return "createTemplate" in obj; }, get: function (obj) { return obj.createTemplate; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getTemplates_decorators, { kind: "method", name: "getTemplates", static: false, private: false, access: { has: function (obj) { return "getTemplates" in obj; }, get: function (obj) { return obj.getTemplates; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _updateTemplate_decorators, { kind: "method", name: "updateTemplate", static: false, private: false, access: { has: function (obj) { return "updateTemplate" in obj; }, get: function (obj) { return obj.updateTemplate; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _deleteTemplate_decorators, { kind: "method", name: "deleteTemplate", static: false, private: false, access: { has: function (obj) { return "deleteTemplate" in obj; }, get: function (obj) { return obj.deleteTemplate; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _dispatch_decorators, { kind: "method", name: "dispatch", static: false, private: false, access: { has: function (obj) { return "dispatch" in obj; }, get: function (obj) { return obj.dispatch; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getMetrics_decorators, { kind: "method", name: "getMetrics", static: false, private: false, access: { has: function (obj) { return "getMetrics" in obj; }, get: function (obj) { return obj.getMetrics; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _retryFailed_decorators, { kind: "method", name: "retryFailed", static: false, private: false, access: { has: function (obj) { return "retryFailed" in obj; }, get: function (obj) { return obj.retryFailed; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        EnterpriseNotificationController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return EnterpriseNotificationController = _classThis;
}();
exports.EnterpriseNotificationController = EnterpriseNotificationController;
