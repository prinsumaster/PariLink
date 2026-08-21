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
exports.WorkspaceController = void 0;
var common_1 = require("@nestjs/common");
var jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
var swagger_1 = require("@nestjs/swagger");
var WorkspaceController = function () {
    var _classDecorators = [(0, swagger_1.ApiTags)('Workspace'), (0, swagger_1.ApiBearerAuth)(), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard), (0, common_1.Controller)('workspace')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _getSnapshots_decorators;
    var _saveSnapshot_decorators;
    var _getDefaultSnapshot_decorators;
    var _deleteSnapshot_decorators;
    var _updatePreferences_decorators;
    var WorkspaceController = _classThis = /** @class */ (function () {
        function WorkspaceController_1(workspaceService) {
            this.workspaceService = (__runInitializers(this, _instanceExtraInitializers), workspaceService);
        }
        WorkspaceController_1.prototype.getSnapshots = function (user) {
            return this.workspaceService.getSnapshots(user.companyId, user.userId);
        };
        WorkspaceController_1.prototype.saveSnapshot = function (user, body) {
            return this.workspaceService.saveSnapshot(user.companyId, user.userId, body);
        };
        WorkspaceController_1.prototype.getDefaultSnapshot = function (user) {
            return this.workspaceService.getDefaultSnapshot(user.companyId, user.userId);
        };
        WorkspaceController_1.prototype.deleteSnapshot = function (user, id) {
            return this.workspaceService.deleteSnapshot(id, user.userId);
        };
        WorkspaceController_1.prototype.updatePreferences = function (user, body) {
            return this.workspaceService.updatePreferences(user.userId, body);
        };
        return WorkspaceController_1;
    }());
    __setFunctionName(_classThis, "WorkspaceController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _getSnapshots_decorators = [(0, common_1.Get)('snapshots'), (0, swagger_1.ApiOperation)({ summary: 'Get all workspace snapshots' })];
        _saveSnapshot_decorators = [(0, common_1.Post)('snapshots'), (0, swagger_1.ApiOperation)({ summary: 'Save current workspace state' })];
        _getDefaultSnapshot_decorators = [(0, common_1.Get)('snapshots/default'), (0, swagger_1.ApiOperation)({ summary: 'Get default workspace snapshot' })];
        _deleteSnapshot_decorators = [(0, common_1.Delete)('snapshots/:id'), (0, swagger_1.ApiOperation)({ summary: 'Delete a snapshot' })];
        _updatePreferences_decorators = [(0, common_1.Post)('preferences'), (0, swagger_1.ApiOperation)({ summary: 'Update user workspace preferences' })];
        __esDecorate(_classThis, null, _getSnapshots_decorators, { kind: "method", name: "getSnapshots", static: false, private: false, access: { has: function (obj) { return "getSnapshots" in obj; }, get: function (obj) { return obj.getSnapshots; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _saveSnapshot_decorators, { kind: "method", name: "saveSnapshot", static: false, private: false, access: { has: function (obj) { return "saveSnapshot" in obj; }, get: function (obj) { return obj.saveSnapshot; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getDefaultSnapshot_decorators, { kind: "method", name: "getDefaultSnapshot", static: false, private: false, access: { has: function (obj) { return "getDefaultSnapshot" in obj; }, get: function (obj) { return obj.getDefaultSnapshot; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _deleteSnapshot_decorators, { kind: "method", name: "deleteSnapshot", static: false, private: false, access: { has: function (obj) { return "deleteSnapshot" in obj; }, get: function (obj) { return obj.deleteSnapshot; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _updatePreferences_decorators, { kind: "method", name: "updatePreferences", static: false, private: false, access: { has: function (obj) { return "updatePreferences" in obj; }, get: function (obj) { return obj.updatePreferences; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        WorkspaceController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return WorkspaceController = _classThis;
}();
exports.WorkspaceController = WorkspaceController;
