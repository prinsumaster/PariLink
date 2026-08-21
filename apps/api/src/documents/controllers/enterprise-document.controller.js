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
exports.EnterpriseDocumentController = void 0;
var common_1 = require("@nestjs/common");
var jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
var permissions_guard_1 = require("../../auth/guards/permissions.guard");
var permissions_decorator_1 = require("../../auth/decorators/permissions.decorator");
var swagger_1 = require("@nestjs/swagger");
var file_interceptor_1 = require("../../platform/files/file.interceptor");
var EnterpriseDocumentController = function () {
    var _classDecorators = [(0, swagger_1.ApiTags)('Enterprise Document Management & Compliance'), (0, swagger_1.ApiBearerAuth)(), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard), (0, common_1.Controller)('documents/enterprise')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _getFolderTree_decorators;
    var _createFolder_decorators;
    var _updateFolder_decorators;
    var _deleteFolder_decorators;
    var _moveDocument_decorators;
    var _checkoutDocument_decorators;
    var _checkinDocument_decorators;
    var _unlockDocument_decorators;
    var _getVersionHistory_decorators;
    var _revertVersion_decorators;
    var _requestSignature_decorators;
    var _getSignatures_decorators;
    var _signDocument_decorators;
    var _rejectSignature_decorators;
    var _getVerificationCertificate_decorators;
    var _getRequirements_decorators;
    var _createRequirement_decorators;
    var _deleteRequirement_decorators;
    var _evaluateCompliance_decorators;
    var _scanExpiring_decorators;
    var _classifyDocument_decorators;
    var EnterpriseDocumentController = _classThis = /** @class */ (function () {
        function EnterpriseDocumentController_1(folderService, versionService, signatureService, complianceService, aiService) {
            this.folderService = (__runInitializers(this, _instanceExtraInitializers), folderService);
            this.versionService = versionService;
            this.signatureService = signatureService;
            this.complianceService = complianceService;
            this.aiService = aiService;
        }
        // 1. Folder & Tree Management
        EnterpriseDocumentController_1.prototype.getFolderTree = function (user) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.folderService.getFolderTree(user.companyId)];
                });
            });
        };
        EnterpriseDocumentController_1.prototype.createFolder = function (dto, user) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.folderService.createFolder(user.companyId, user.userId, dto)];
                });
            });
        };
        EnterpriseDocumentController_1.prototype.updateFolder = function (id, dto, user) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.folderService.updateFolder(user.companyId, id, user.userId, dto)];
                });
            });
        };
        EnterpriseDocumentController_1.prototype.deleteFolder = function (id, user) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.folderService.deleteFolder(user.companyId, id, user.userId)];
                });
            });
        };
        EnterpriseDocumentController_1.prototype.moveDocument = function (documentId, folderId, user) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.folderService.moveDocument(user.companyId, documentId, folderId || null, user.userId)];
                });
            });
        };
        // 2. Version Control & Checkout/Checkin
        EnterpriseDocumentController_1.prototype.checkoutDocument = function (documentId, dto, user) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.versionService.checkout(user.companyId, documentId, user.userId, dto)];
                });
            });
        };
        EnterpriseDocumentController_1.prototype.checkinDocument = function (documentId, file, dto, user) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    if (!file)
                        throw new common_1.BadRequestException('File is required for check-in');
                    return [2 /*return*/, this.versionService.checkin(user.companyId, documentId, user.userId, file, dto)];
                });
            });
        };
        EnterpriseDocumentController_1.prototype.unlockDocument = function (documentId, user) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.versionService.unlock(user.companyId, documentId, user.userId, false)];
                });
            });
        };
        EnterpriseDocumentController_1.prototype.getVersionHistory = function (documentId, user) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.versionService.getVersionHistory(user.companyId, documentId)];
                });
            });
        };
        EnterpriseDocumentController_1.prototype.revertVersion = function (documentId, version, user) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.versionService.revertToVersion(user.companyId, documentId, Number(version), user.userId)];
                });
            });
        };
        // 3. E-Signatures & Verification
        EnterpriseDocumentController_1.prototype.requestSignature = function (documentId, dto, user) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.signatureService.requestSignature(user.companyId, documentId, user.userId, dto)];
                });
            });
        };
        EnterpriseDocumentController_1.prototype.getSignatures = function (documentId, user) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.signatureService.getDocumentSignatures(user.companyId, documentId)];
                });
            });
        };
        EnterpriseDocumentController_1.prototype.signDocument = function (signatureId, dto, user, req) {
            return __awaiter(this, void 0, void 0, function () {
                var ipAddress, userAgent;
                var _a;
                return __generator(this, function (_b) {
                    ipAddress = req.ip || ((_a = req.headers['x-forwarded-for']) === null || _a === void 0 ? void 0 : _a.toString()) || '127.0.0.1';
                    userAgent = req.headers['user-agent'] || 'Unknown Agent';
                    return [2 /*return*/, this.signatureService.signDocument(user.companyId, signatureId, dto, ipAddress, userAgent)];
                });
            });
        };
        EnterpriseDocumentController_1.prototype.rejectSignature = function (signatureId_1, reason_1) {
            return __awaiter(this, arguments, void 0, function (signatureId, reason, user) {
                if (user === void 0) { user = {}; }
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.signatureService.rejectSignature(user.companyId, signatureId, reason)];
                });
            });
        };
        EnterpriseDocumentController_1.prototype.getVerificationCertificate = function (signatureId, user) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.signatureService.generateVerificationCertificate(user.companyId, signatureId)];
                });
            });
        };
        // 4. Compliance & Expiration AI
        EnterpriseDocumentController_1.prototype.getRequirements = function (entityType_1) {
            return __awaiter(this, arguments, void 0, function (entityType, user) {
                if (user === void 0) { user = {}; }
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.complianceService.getRequirements(user.companyId, entityType)];
                });
            });
        };
        EnterpriseDocumentController_1.prototype.createRequirement = function (dto, user) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.complianceService.createRequirement(user.companyId, user.userId, dto)];
                });
            });
        };
        EnterpriseDocumentController_1.prototype.deleteRequirement = function (id, user) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.complianceService.deleteRequirement(user.companyId, id, user.userId)];
                });
            });
        };
        EnterpriseDocumentController_1.prototype.evaluateCompliance = function (entityType, entityId, user) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.complianceService.evaluateEntityCompliance(user.companyId, entityType, entityId)];
                });
            });
        };
        EnterpriseDocumentController_1.prototype.scanExpiring = function (user) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.complianceService.scanExpiringDocuments(user.companyId)];
                });
            });
        };
        // 5. AI OCR Classification & Auto-filing
        EnterpriseDocumentController_1.prototype.classifyDocument = function (documentId, dto, user) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.aiService.classifyAndExtractMetadata(user.companyId, documentId, user.userId, dto)];
                });
            });
        };
        return EnterpriseDocumentController_1;
    }());
    __setFunctionName(_classThis, "EnterpriseDocumentController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _getFolderTree_decorators = [(0, common_1.Get)('folders/tree'), (0, permissions_decorator_1.RequirePermissions)('documents:read'), (0, swagger_1.ApiOperation)({ summary: 'Get hierarchical document folder tree' })];
        _createFolder_decorators = [(0, common_1.Post)('folders'), (0, permissions_decorator_1.RequirePermissions)('documents:create'), (0, swagger_1.ApiOperation)({ summary: 'Create folder' })];
        _updateFolder_decorators = [(0, common_1.Put)('folders/:id'), (0, permissions_decorator_1.RequirePermissions)('documents:update'), (0, swagger_1.ApiOperation)({ summary: 'Update folder name or location' })];
        _deleteFolder_decorators = [(0, common_1.Delete)('folders/:id'), (0, permissions_decorator_1.RequirePermissions)('documents:delete'), (0, swagger_1.ApiOperation)({ summary: 'Delete empty folder' })];
        _moveDocument_decorators = [(0, common_1.Put)('move/:documentId'), (0, permissions_decorator_1.RequirePermissions)('documents:update'), (0, swagger_1.ApiOperation)({ summary: 'Move document to another folder' })];
        _checkoutDocument_decorators = [(0, common_1.Post)(':documentId/checkout'), (0, permissions_decorator_1.RequirePermissions)('documents:update'), (0, swagger_1.ApiOperation)({ summary: 'Lock document for editing (checkout)' })];
        _checkinDocument_decorators = [(0, common_1.Post)(':documentId/checkin'), (0, permissions_decorator_1.RequirePermissions)('documents:update'), (0, swagger_1.ApiOperation)({ summary: 'Check in a new version of a document' }), (0, swagger_1.ApiConsumes)('multipart/form-data'), (0, swagger_1.ApiBody)({
                schema: {
                    type: 'object',
                    properties: {
                        file: { type: 'string', format: 'binary' },
                        changeSummary: { type: 'string', example: 'Updated pricing and terms' },
                    },
                },
            }), (0, file_interceptor_1.PlatformFileInterceptor)('file', 5)];
        _unlockDocument_decorators = [(0, common_1.Post)(':documentId/unlock'), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, permissions_decorator_1.RequirePermissions)('documents:update'), (0, swagger_1.ApiOperation)({
                summary: 'Unlock document without checking in a new version',
            })];
        _getVersionHistory_decorators = [(0, common_1.Get)(':documentId/versions'), (0, permissions_decorator_1.RequirePermissions)('documents:read'), (0, swagger_1.ApiOperation)({ summary: 'Get full version history of a document' })];
        _revertVersion_decorators = [(0, common_1.Post)(':documentId/revert/:version'), (0, permissions_decorator_1.RequirePermissions)('documents:update'), (0, swagger_1.ApiOperation)({ summary: 'Revert document to an older version number' })];
        _requestSignature_decorators = [(0, common_1.Post)(':documentId/signatures'), (0, permissions_decorator_1.RequirePermissions)('documents:create'), (0, swagger_1.ApiOperation)({ summary: 'Request e-signature on document' })];
        _getSignatures_decorators = [(0, common_1.Get)(':documentId/signatures'), (0, permissions_decorator_1.RequirePermissions)('documents:read'), (0, swagger_1.ApiOperation)({ summary: 'List all signature requests for a document' })];
        _signDocument_decorators = [(0, common_1.Post)('signatures/:signatureId/sign'), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, permissions_decorator_1.RequirePermissions)('documents:update'), (0, swagger_1.ApiOperation)({ summary: 'Submit cryptographic e-signature' })];
        _rejectSignature_decorators = [(0, common_1.Post)('signatures/:signatureId/reject'), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, permissions_decorator_1.RequirePermissions)('documents:update'), (0, swagger_1.ApiOperation)({ summary: 'Reject signature request' })];
        _getVerificationCertificate_decorators = [(0, common_1.Get)('signatures/:signatureId/certificate'), (0, permissions_decorator_1.RequirePermissions)('documents:read'), (0, swagger_1.ApiOperation)({
                summary: 'Generate verifiable digital signature audit certificate',
            })];
        _getRequirements_decorators = [(0, common_1.Get)('compliance/requirements'), (0, permissions_decorator_1.RequirePermissions)('documents:read'), (0, swagger_1.ApiOperation)({ summary: 'List compliance requirements' })];
        _createRequirement_decorators = [(0, common_1.Post)('compliance/requirements'), (0, permissions_decorator_1.RequirePermissions)('documents:create'), (0, swagger_1.ApiOperation)({ summary: 'Create compliance requirement rule' })];
        _deleteRequirement_decorators = [(0, common_1.Delete)('compliance/requirements/:id'), (0, permissions_decorator_1.RequirePermissions)('documents:delete'), (0, swagger_1.ApiOperation)({ summary: 'Delete compliance requirement' })];
        _evaluateCompliance_decorators = [(0, common_1.Get)('compliance/evaluate/:entityType/:entityId'), (0, permissions_decorator_1.RequirePermissions)('documents:read'), (0, swagger_1.ApiOperation)({
                summary: 'Evaluate compliance status for an entity (Driver, Vehicle, Vendor)',
            })];
        _scanExpiring_decorators = [(0, common_1.Get)('compliance/scan-expiring'), (0, permissions_decorator_1.RequirePermissions)('documents:read'), (0, swagger_1.ApiOperation)({ summary: 'Scan all documents for expiring or expired items' })];
        _classifyDocument_decorators = [(0, common_1.Post)(':documentId/ai-classify'), (0, permissions_decorator_1.RequirePermissions)('documents:update'), (0, swagger_1.ApiOperation)({
                summary: 'Run AI OCR classification, metadata extraction, and auto-filing',
            })];
        __esDecorate(_classThis, null, _getFolderTree_decorators, { kind: "method", name: "getFolderTree", static: false, private: false, access: { has: function (obj) { return "getFolderTree" in obj; }, get: function (obj) { return obj.getFolderTree; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _createFolder_decorators, { kind: "method", name: "createFolder", static: false, private: false, access: { has: function (obj) { return "createFolder" in obj; }, get: function (obj) { return obj.createFolder; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _updateFolder_decorators, { kind: "method", name: "updateFolder", static: false, private: false, access: { has: function (obj) { return "updateFolder" in obj; }, get: function (obj) { return obj.updateFolder; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _deleteFolder_decorators, { kind: "method", name: "deleteFolder", static: false, private: false, access: { has: function (obj) { return "deleteFolder" in obj; }, get: function (obj) { return obj.deleteFolder; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _moveDocument_decorators, { kind: "method", name: "moveDocument", static: false, private: false, access: { has: function (obj) { return "moveDocument" in obj; }, get: function (obj) { return obj.moveDocument; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _checkoutDocument_decorators, { kind: "method", name: "checkoutDocument", static: false, private: false, access: { has: function (obj) { return "checkoutDocument" in obj; }, get: function (obj) { return obj.checkoutDocument; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _checkinDocument_decorators, { kind: "method", name: "checkinDocument", static: false, private: false, access: { has: function (obj) { return "checkinDocument" in obj; }, get: function (obj) { return obj.checkinDocument; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _unlockDocument_decorators, { kind: "method", name: "unlockDocument", static: false, private: false, access: { has: function (obj) { return "unlockDocument" in obj; }, get: function (obj) { return obj.unlockDocument; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getVersionHistory_decorators, { kind: "method", name: "getVersionHistory", static: false, private: false, access: { has: function (obj) { return "getVersionHistory" in obj; }, get: function (obj) { return obj.getVersionHistory; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _revertVersion_decorators, { kind: "method", name: "revertVersion", static: false, private: false, access: { has: function (obj) { return "revertVersion" in obj; }, get: function (obj) { return obj.revertVersion; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _requestSignature_decorators, { kind: "method", name: "requestSignature", static: false, private: false, access: { has: function (obj) { return "requestSignature" in obj; }, get: function (obj) { return obj.requestSignature; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getSignatures_decorators, { kind: "method", name: "getSignatures", static: false, private: false, access: { has: function (obj) { return "getSignatures" in obj; }, get: function (obj) { return obj.getSignatures; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _signDocument_decorators, { kind: "method", name: "signDocument", static: false, private: false, access: { has: function (obj) { return "signDocument" in obj; }, get: function (obj) { return obj.signDocument; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _rejectSignature_decorators, { kind: "method", name: "rejectSignature", static: false, private: false, access: { has: function (obj) { return "rejectSignature" in obj; }, get: function (obj) { return obj.rejectSignature; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getVerificationCertificate_decorators, { kind: "method", name: "getVerificationCertificate", static: false, private: false, access: { has: function (obj) { return "getVerificationCertificate" in obj; }, get: function (obj) { return obj.getVerificationCertificate; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getRequirements_decorators, { kind: "method", name: "getRequirements", static: false, private: false, access: { has: function (obj) { return "getRequirements" in obj; }, get: function (obj) { return obj.getRequirements; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _createRequirement_decorators, { kind: "method", name: "createRequirement", static: false, private: false, access: { has: function (obj) { return "createRequirement" in obj; }, get: function (obj) { return obj.createRequirement; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _deleteRequirement_decorators, { kind: "method", name: "deleteRequirement", static: false, private: false, access: { has: function (obj) { return "deleteRequirement" in obj; }, get: function (obj) { return obj.deleteRequirement; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _evaluateCompliance_decorators, { kind: "method", name: "evaluateCompliance", static: false, private: false, access: { has: function (obj) { return "evaluateCompliance" in obj; }, get: function (obj) { return obj.evaluateCompliance; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _scanExpiring_decorators, { kind: "method", name: "scanExpiring", static: false, private: false, access: { has: function (obj) { return "scanExpiring" in obj; }, get: function (obj) { return obj.scanExpiring; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _classifyDocument_decorators, { kind: "method", name: "classifyDocument", static: false, private: false, access: { has: function (obj) { return "classifyDocument" in obj; }, get: function (obj) { return obj.classifyDocument; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        EnterpriseDocumentController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return EnterpriseDocumentController = _classThis;
}();
exports.EnterpriseDocumentController = EnterpriseDocumentController;
