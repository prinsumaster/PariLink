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
exports.ImportExportController = void 0;
var common_1 = require("@nestjs/common");
var swagger_1 = require("@nestjs/swagger");
var jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
var permissions_guard_1 = require("../../auth/guards/permissions.guard");
var permissions_decorator_1 = require("../../auth/decorators/permissions.decorator");
var ImportExportController = function () {
    var _classDecorators = [(0, swagger_1.ApiTags)('Import & Export Console'), (0, swagger_1.ApiBearerAuth)(), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard), (0, common_1.Controller)('integration')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _previewImport_decorators;
    var _executeImport_decorators;
    var _executeExport_decorators;
    var _listJobs_decorators;
    var _getJobStatus_decorators;
    var ImportExportController = _classThis = /** @class */ (function () {
        function ImportExportController_1(importExportService) {
            this.importExportService = (__runInitializers(this, _instanceExtraInitializers), importExportService);
        }
        ImportExportController_1.prototype.previewImport = function (user, dto) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.importExportService.previewImport(user.companyId, dto.entityType, dto.format, dto.rows)];
                });
            });
        };
        ImportExportController_1.prototype.executeImport = function (user, dto) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.importExportService.executeImport(user.companyId, user.userId, dto.entityType, dto.format, dto.rows, dto.rollbackOnError !== false)];
                });
            });
        };
        ImportExportController_1.prototype.executeExport = function (user, dto) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.importExportService.executeExport(user.companyId, user.userId, dto.entityType, dto.format, dto.filter)];
                });
            });
        };
        ImportExportController_1.prototype.listJobs = function (user, type) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.importExportService.listJobs(user.companyId, type)];
                });
            });
        };
        ImportExportController_1.prototype.getJobStatus = function (user, jobId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.importExportService.getJobStatus(user.companyId, jobId)];
                });
            });
        };
        return ImportExportController_1;
    }());
    __setFunctionName(_classThis, "ImportExportController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _previewImport_decorators = [(0, common_1.Post)('import/preview'), (0, permissions_decorator_1.RequirePermissions)('integrations:read'), (0, swagger_1.ApiOperation)({
                summary: 'Preview bulk data import with validation and duplicate detection',
            })];
        _executeImport_decorators = [(0, common_1.Post)('import/execute'), (0, permissions_decorator_1.RequirePermissions)('integrations:write'), (0, swagger_1.ApiOperation)({
                summary: 'Execute bulk data import in transaction with rollback on error',
            })];
        _executeExport_decorators = [(0, common_1.Post)('export/execute'), (0, permissions_decorator_1.RequirePermissions)('integrations:read'), (0, swagger_1.ApiOperation)({
                summary: 'Execute bulk data export into CSV, XML, JSON, or Excel format',
            })];
        _listJobs_decorators = [(0, common_1.Get)('jobs'), (0, permissions_decorator_1.RequirePermissions)('integrations:read'), (0, swagger_1.ApiOperation)({ summary: 'List background sync, import, and export jobs' })];
        _getJobStatus_decorators = [(0, common_1.Get)('jobs/:id'), (0, permissions_decorator_1.RequirePermissions)('integrations:read'), (0, swagger_1.ApiOperation)({
                summary: 'Get status and results of a background import/export job',
            })];
        __esDecorate(_classThis, null, _previewImport_decorators, { kind: "method", name: "previewImport", static: false, private: false, access: { has: function (obj) { return "previewImport" in obj; }, get: function (obj) { return obj.previewImport; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _executeImport_decorators, { kind: "method", name: "executeImport", static: false, private: false, access: { has: function (obj) { return "executeImport" in obj; }, get: function (obj) { return obj.executeImport; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _executeExport_decorators, { kind: "method", name: "executeExport", static: false, private: false, access: { has: function (obj) { return "executeExport" in obj; }, get: function (obj) { return obj.executeExport; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _listJobs_decorators, { kind: "method", name: "listJobs", static: false, private: false, access: { has: function (obj) { return "listJobs" in obj; }, get: function (obj) { return obj.listJobs; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getJobStatus_decorators, { kind: "method", name: "getJobStatus", static: false, private: false, access: { has: function (obj) { return "getJobStatus" in obj; }, get: function (obj) { return obj.getJobStatus; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ImportExportController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ImportExportController = _classThis;
}();
exports.ImportExportController = ImportExportController;
