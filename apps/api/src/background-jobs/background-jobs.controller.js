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
exports.BackgroundJobsController = void 0;
var common_1 = require("@nestjs/common");
var jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
var swagger_1 = require("@nestjs/swagger");
var BackgroundJobsController = function () {
    var _classDecorators = [(0, swagger_1.ApiTags)('Background Jobs'), (0, swagger_1.ApiBearerAuth)(), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard), (0, common_1.Controller)('jobs')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _getJobs_decorators;
    var _getActiveJobs_decorators;
    var _cancelJob_decorators;
    var BackgroundJobsController = _classThis = /** @class */ (function () {
        function BackgroundJobsController_1(jobsService) {
            this.jobsService = (__runInitializers(this, _instanceExtraInitializers), jobsService);
        }
        BackgroundJobsController_1.prototype.getJobs = function (user, limit) {
            return this.jobsService.getJobs(user.companyId, user.userId, limit ? parseInt(limit) : 20);
        };
        BackgroundJobsController_1.prototype.getActiveJobs = function (user) {
            return this.jobsService.getActiveJobs(user.companyId, user.userId);
        };
        BackgroundJobsController_1.prototype.cancelJob = function (id) {
            return this.jobsService.cancelJob(id);
        };
        return BackgroundJobsController_1;
    }());
    __setFunctionName(_classThis, "BackgroundJobsController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _getJobs_decorators = [(0, common_1.Get)(), (0, swagger_1.ApiOperation)({ summary: 'Get recent background jobs for the user' })];
        _getActiveJobs_decorators = [(0, common_1.Get)('active'), (0, swagger_1.ApiOperation)({ summary: 'Get active background jobs for the user' })];
        _cancelJob_decorators = [(0, common_1.Post)(':id/cancel'), (0, swagger_1.ApiOperation)({ summary: 'Cancel a pending or processing background job' })];
        __esDecorate(_classThis, null, _getJobs_decorators, { kind: "method", name: "getJobs", static: false, private: false, access: { has: function (obj) { return "getJobs" in obj; }, get: function (obj) { return obj.getJobs; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getActiveJobs_decorators, { kind: "method", name: "getActiveJobs", static: false, private: false, access: { has: function (obj) { return "getActiveJobs" in obj; }, get: function (obj) { return obj.getActiveJobs; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _cancelJob_decorators, { kind: "method", name: "cancelJob", static: false, private: false, access: { has: function (obj) { return "cancelJob" in obj; }, get: function (obj) { return obj.cancelJob; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        BackgroundJobsController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return BackgroundJobsController = _classThis;
}();
exports.BackgroundJobsController = BackgroundJobsController;
