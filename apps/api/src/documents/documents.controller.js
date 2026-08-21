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
exports.DocumentsController = void 0;
var common_1 = require("@nestjs/common");
var file_interceptor_1 = require("../platform/files/file.interceptor");
var jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
var permissions_guard_1 = require("../auth/guards/permissions.guard");
var permissions_decorator_1 = require("../auth/decorators/permissions.decorator");
var swagger_1 = require("@nestjs/swagger");
var DocumentsController = function () {
    var _classDecorators = [(0, swagger_1.ApiTags)('documents'), (0, swagger_1.ApiBearerAuth)(), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard), (0, common_1.Controller)('documents')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _uploadDocument_decorators;
    var _getAllDocuments_decorators;
    var _getFolders_decorators;
    var _createFolder_decorators;
    var _getLoadDocuments_decorators;
    var _getEntityDocuments_decorators;
    var DocumentsController = _classThis = /** @class */ (function () {
        function DocumentsController_1(documentsService) {
            this.documentsService = (__runInitializers(this, _instanceExtraInitializers), documentsService);
        }
        DocumentsController_1.prototype.uploadDocument = function (user, file, body) {
            if (!file) {
                throw new common_1.BadRequestException('File is required');
            }
            return this.documentsService.uploadDocument(user.companyId, user.id, file, body);
        };
        DocumentsController_1.prototype.getAllDocuments = function (user, folderId) {
            return this.documentsService.getAllDocuments(user.companyId, folderId);
        };
        DocumentsController_1.prototype.getFolders = function (user, parentId) {
            return this.documentsService.getFolders(user.companyId, parentId);
        };
        DocumentsController_1.prototype.createFolder = function (user, body) {
            if (!body.name)
                throw new common_1.BadRequestException('Folder name is required');
            return this.documentsService.createFolder(user.companyId, body.name, body.parentId);
        };
        DocumentsController_1.prototype.getLoadDocuments = function (user, loadId) {
            return this.documentsService.getLoadDocuments(user.companyId, loadId);
        };
        DocumentsController_1.prototype.getEntityDocuments = function (user, entityType, entityId) {
            return this.documentsService.getEntityDocuments(user.companyId, entityType, entityId);
        };
        return DocumentsController_1;
    }());
    __setFunctionName(_classThis, "DocumentsController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _uploadDocument_decorators = [(0, common_1.Post)('upload'), (0, permissions_decorator_1.RequirePermissions)('documents:create'), (0, swagger_1.ApiOperation)({ summary: 'Upload a document' }), (0, swagger_1.ApiConsumes)('multipart/form-data'), (0, swagger_1.ApiBody)({
                schema: {
                    type: 'object',
                    properties: {
                        file: { type: 'string', format: 'binary' },
                        type: { type: 'string', example: 'POD' },
                        loadId: { type: 'string' },
                        entityId: { type: 'string' },
                        entityType: { type: 'string' },
                        folderId: { type: 'string' },
                        tags: { type: 'string' },
                    },
                },
            }), (0, file_interceptor_1.PlatformFileInterceptor)('file', 5)];
        _getAllDocuments_decorators = [(0, common_1.Get)(), (0, permissions_decorator_1.RequirePermissions)('documents:read'), (0, swagger_1.ApiOperation)({ summary: 'Get all documents globally or in a folder' })];
        _getFolders_decorators = [(0, common_1.Get)('folders'), (0, permissions_decorator_1.RequirePermissions)('documents:read'), (0, swagger_1.ApiOperation)({ summary: 'Get document folders' })];
        _createFolder_decorators = [(0, common_1.Post)('folders'), (0, permissions_decorator_1.RequirePermissions)('documents:create'), (0, swagger_1.ApiOperation)({ summary: 'Create a document folder' })];
        _getLoadDocuments_decorators = [(0, common_1.Get)('loads/:loadId'), (0, permissions_decorator_1.RequirePermissions)('documents:read'), (0, swagger_1.ApiOperation)({ summary: 'Get all documents for a specific load' })];
        _getEntityDocuments_decorators = [(0, common_1.Get)('entity/:entityType/:entityId'), (0, permissions_decorator_1.RequirePermissions)('documents:read'), (0, swagger_1.ApiOperation)({ summary: 'Get all documents for a generic entity' })];
        __esDecorate(_classThis, null, _uploadDocument_decorators, { kind: "method", name: "uploadDocument", static: false, private: false, access: { has: function (obj) { return "uploadDocument" in obj; }, get: function (obj) { return obj.uploadDocument; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getAllDocuments_decorators, { kind: "method", name: "getAllDocuments", static: false, private: false, access: { has: function (obj) { return "getAllDocuments" in obj; }, get: function (obj) { return obj.getAllDocuments; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getFolders_decorators, { kind: "method", name: "getFolders", static: false, private: false, access: { has: function (obj) { return "getFolders" in obj; }, get: function (obj) { return obj.getFolders; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _createFolder_decorators, { kind: "method", name: "createFolder", static: false, private: false, access: { has: function (obj) { return "createFolder" in obj; }, get: function (obj) { return obj.createFolder; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getLoadDocuments_decorators, { kind: "method", name: "getLoadDocuments", static: false, private: false, access: { has: function (obj) { return "getLoadDocuments" in obj; }, get: function (obj) { return obj.getLoadDocuments; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getEntityDocuments_decorators, { kind: "method", name: "getEntityDocuments", static: false, private: false, access: { has: function (obj) { return "getEntityDocuments" in obj; }, get: function (obj) { return obj.getEntityDocuments; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        DocumentsController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return DocumentsController = _classThis;
}();
exports.DocumentsController = DocumentsController;
