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
exports.MobileController = void 0;
var common_1 = require("@nestjs/common");
var jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
var permissions_guard_1 = require("../auth/guards/permissions.guard");
var permissions_decorator_1 = require("../auth/decorators/permissions.decorator");
var swagger_1 = require("@nestjs/swagger");
var file_interceptor_1 = require("../platform/files/file.interceptor");
var MobileController = function () {
    var _classDecorators = [(0, swagger_1.ApiTags)('mobile'), (0, swagger_1.ApiBearerAuth)(), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard), (0, common_1.Controller)('mobile')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _getActiveTrip_decorators;
    var _updateTripStatus_decorators;
    var _updateLoadStatus_decorators;
    var _recordLocation_decorators;
    var _processOfflineQueue_decorators;
    var _uploadDocument_decorators;
    var MobileController = _classThis = /** @class */ (function () {
        function MobileController_1(mobileService) {
            this.mobileService = (__runInitializers(this, _instanceExtraInitializers), mobileService);
        }
        MobileController_1.prototype.getActiveTrip = function (user) {
            return this.mobileService.getActiveTrip(user.companyId, user.userId);
        };
        MobileController_1.prototype.updateTripStatus = function (user, id, dto) {
            return this.mobileService.updateTripStatus(user.companyId, user.userId, id, dto);
        };
        MobileController_1.prototype.updateLoadStatus = function (user, id, dto) {
            return this.mobileService.updateLoadStatus(user.companyId, user.userId, id, dto);
        };
        MobileController_1.prototype.recordLocation = function (user, dto) {
            return this.mobileService.recordLocation(user.companyId, user.userId, dto);
        };
        MobileController_1.prototype.processOfflineQueue = function (user, queueData) {
            return this.mobileService.processOfflineQueue(user.companyId, user.userId, queueData);
        };
        MobileController_1.prototype.uploadDocument = function (user, type, file, body) {
            if (!file)
                throw new common_1.BadRequestException('File is required');
            return this.mobileService.uploadDocument(user.companyId, user.userId, type, file, body.referenceId);
        };
        return MobileController_1;
    }());
    __setFunctionName(_classThis, "MobileController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _getActiveTrip_decorators = [(0, common_1.Get)('trips/active'), (0, permissions_decorator_1.RequirePermissions)('mobile:access'), (0, swagger_1.ApiOperation)({ summary: 'Get current active trip for logged-in driver' })];
        _updateTripStatus_decorators = [(0, common_1.Patch)('trips/:id/status'), (0, permissions_decorator_1.RequirePermissions)('mobile:access'), (0, swagger_1.ApiOperation)({ summary: 'Update trip status' })];
        _updateLoadStatus_decorators = [(0, common_1.Patch)('loads/:id/status'), (0, permissions_decorator_1.RequirePermissions)('mobile:access'), (0, swagger_1.ApiOperation)({ summary: 'Update individual load status' })];
        _recordLocation_decorators = [(0, common_1.Post)('location'), (0, permissions_decorator_1.RequirePermissions)('mobile:access'), (0, swagger_1.ApiOperation)({ summary: 'Ping driver location for active trip' })];
        _processOfflineQueue_decorators = [(0, common_1.Post)('sync'), (0, permissions_decorator_1.RequirePermissions)('mobile:access'), (0, swagger_1.ApiOperation)({
                summary: 'Offline sync queue processor with conflict resolution',
            })];
        _uploadDocument_decorators = [(0, common_1.Post)('upload/:type'), (0, permissions_decorator_1.RequirePermissions)('mobile:access'), (0, swagger_1.ApiOperation)({
                summary: 'Upload POD, Signature, Fuel Receipt, Expense Image',
            }), (0, swagger_1.ApiConsumes)('multipart/form-data'), (0, swagger_1.ApiBody)({
                schema: {
                    type: 'object',
                    properties: {
                        file: { type: 'string', format: 'binary' },
                        referenceId: {
                            type: 'string',
                            description: 'tripId or loadId depending on type',
                        },
                    },
                },
            }), (0, file_interceptor_1.PlatformFileInterceptor)('file', 10)];
        __esDecorate(_classThis, null, _getActiveTrip_decorators, { kind: "method", name: "getActiveTrip", static: false, private: false, access: { has: function (obj) { return "getActiveTrip" in obj; }, get: function (obj) { return obj.getActiveTrip; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _updateTripStatus_decorators, { kind: "method", name: "updateTripStatus", static: false, private: false, access: { has: function (obj) { return "updateTripStatus" in obj; }, get: function (obj) { return obj.updateTripStatus; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _updateLoadStatus_decorators, { kind: "method", name: "updateLoadStatus", static: false, private: false, access: { has: function (obj) { return "updateLoadStatus" in obj; }, get: function (obj) { return obj.updateLoadStatus; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _recordLocation_decorators, { kind: "method", name: "recordLocation", static: false, private: false, access: { has: function (obj) { return "recordLocation" in obj; }, get: function (obj) { return obj.recordLocation; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _processOfflineQueue_decorators, { kind: "method", name: "processOfflineQueue", static: false, private: false, access: { has: function (obj) { return "processOfflineQueue" in obj; }, get: function (obj) { return obj.processOfflineQueue; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _uploadDocument_decorators, { kind: "method", name: "uploadDocument", static: false, private: false, access: { has: function (obj) { return "uploadDocument" in obj; }, get: function (obj) { return obj.uploadDocument; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        MobileController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return MobileController = _classThis;
}();
exports.MobileController = MobileController;
