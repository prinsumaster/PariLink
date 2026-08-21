"use strict";
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
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClassifyDocumentDto = exports.CreateComplianceRequirementDto = exports.SignDocumentDto = exports.CreateSignatureRequestDto = exports.CheckinDocumentDto = exports.CheckoutDocumentDto = exports.UploadDocumentDto = exports.UpdateFolderDto = exports.CreateFolderDto = exports.EntityComplianceStatus = void 0;
var class_validator_1 = require("class-validator");
var swagger_1 = require("@nestjs/swagger");
var EntityComplianceStatus;
(function (EntityComplianceStatus) {
    EntityComplianceStatus["COMPLIANT"] = "COMPLIANT";
    EntityComplianceStatus["EXPIRING_SOON"] = "EXPIRING_SOON";
    EntityComplianceStatus["NON_COMPLIANT"] = "NON_COMPLIANT";
})(EntityComplianceStatus || (exports.EntityComplianceStatus = EntityComplianceStatus = {}));
var CreateFolderDto = function () {
    var _a;
    var _name_decorators;
    var _name_initializers = [];
    var _name_extraInitializers = [];
    var _parentId_decorators;
    var _parentId_initializers = [];
    var _parentId_extraInitializers = [];
    return _a = /** @class */ (function () {
            function CreateFolderDto() {
                this.name = __runInitializers(this, _name_initializers, void 0);
                this.parentId = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _parentId_initializers, void 0));
                __runInitializers(this, _parentId_extraInitializers);
            }
            return CreateFolderDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _name_decorators = [(0, swagger_1.ApiProperty)({ example: 'Driver Licenses' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _parentId_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: 'folder-uuid' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: function (obj) { return "name" in obj; }, get: function (obj) { return obj.name; }, set: function (obj, value) { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
            __esDecorate(null, null, _parentId_decorators, { kind: "field", name: "parentId", static: false, private: false, access: { has: function (obj) { return "parentId" in obj; }, get: function (obj) { return obj.parentId; }, set: function (obj, value) { obj.parentId = value; } }, metadata: _metadata }, _parentId_initializers, _parentId_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.CreateFolderDto = CreateFolderDto;
var UpdateFolderDto = function () {
    var _a;
    var _name_decorators;
    var _name_initializers = [];
    var _name_extraInitializers = [];
    var _parentId_decorators;
    var _parentId_initializers = [];
    var _parentId_extraInitializers = [];
    return _a = /** @class */ (function () {
            function UpdateFolderDto() {
                this.name = __runInitializers(this, _name_initializers, void 0);
                this.parentId = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _parentId_initializers, void 0));
                __runInitializers(this, _parentId_extraInitializers);
            }
            return UpdateFolderDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _name_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: 'Updated Folder Name' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _parentId_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: 'parent-folder-uuid' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: function (obj) { return "name" in obj; }, get: function (obj) { return obj.name; }, set: function (obj, value) { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
            __esDecorate(null, null, _parentId_decorators, { kind: "field", name: "parentId", static: false, private: false, access: { has: function (obj) { return "parentId" in obj; }, get: function (obj) { return obj.parentId; }, set: function (obj, value) { obj.parentId = value; } }, metadata: _metadata }, _parentId_initializers, _parentId_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.UpdateFolderDto = UpdateFolderDto;
var UploadDocumentDto = function () {
    var _a;
    var _type_decorators;
    var _type_initializers = [];
    var _type_extraInitializers = [];
    var _category_decorators;
    var _category_initializers = [];
    var _category_extraInitializers = [];
    var _loadId_decorators;
    var _loadId_initializers = [];
    var _loadId_extraInitializers = [];
    var _entityId_decorators;
    var _entityId_initializers = [];
    var _entityId_extraInitializers = [];
    var _entityType_decorators;
    var _entityType_initializers = [];
    var _entityType_extraInitializers = [];
    var _folderId_decorators;
    var _folderId_initializers = [];
    var _folderId_extraInitializers = [];
    var _tags_decorators;
    var _tags_initializers = [];
    var _tags_extraInitializers = [];
    var _expiresAt_decorators;
    var _expiresAt_initializers = [];
    var _expiresAt_extraInitializers = [];
    var _metadata_decorators;
    var _metadata_initializers = [];
    var _metadata_extraInitializers = [];
    var _retentionPolicy_decorators;
    var _retentionPolicy_initializers = [];
    var _retentionPolicy_extraInitializers = [];
    return _a = /** @class */ (function () {
            function UploadDocumentDto() {
                this.type = __runInitializers(this, _type_initializers, void 0);
                this.category = (__runInitializers(this, _type_extraInitializers), __runInitializers(this, _category_initializers, void 0));
                this.loadId = (__runInitializers(this, _category_extraInitializers), __runInitializers(this, _loadId_initializers, void 0));
                this.entityId = (__runInitializers(this, _loadId_extraInitializers), __runInitializers(this, _entityId_initializers, void 0));
                this.entityType = (__runInitializers(this, _entityId_extraInitializers), __runInitializers(this, _entityType_initializers, void 0));
                this.folderId = (__runInitializers(this, _entityType_extraInitializers), __runInitializers(this, _folderId_initializers, void 0));
                this.tags = (__runInitializers(this, _folderId_extraInitializers), __runInitializers(this, _tags_initializers, void 0));
                this.expiresAt = (__runInitializers(this, _tags_extraInitializers), __runInitializers(this, _expiresAt_initializers, void 0));
                this.metadata = (__runInitializers(this, _expiresAt_extraInitializers), __runInitializers(this, _metadata_initializers, void 0));
                this.retentionPolicy = (__runInitializers(this, _metadata_extraInitializers), __runInitializers(this, _retentionPolicy_initializers, void 0));
                __runInitializers(this, _retentionPolicy_extraInitializers);
            }
            return UploadDocumentDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _type_decorators = [(0, swagger_1.ApiProperty)({ example: 'BILL_OF_LADING' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _category_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: 'Shipping' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _loadId_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: 'load-uuid' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _entityId_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: 'driver-uuid' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _entityType_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: 'DRIVER' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _folderId_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: 'folder-uuid' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _tags_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: '["urgent", "verified"]' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _expiresAt_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: '2027-12-31T23:59:59.000Z' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsDateString)()];
            _metadata_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    example: '{"loadNumber": "LD-1001", "weight": 45000}',
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _retentionPolicy_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: '7_YEARS' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            __esDecorate(null, null, _type_decorators, { kind: "field", name: "type", static: false, private: false, access: { has: function (obj) { return "type" in obj; }, get: function (obj) { return obj.type; }, set: function (obj, value) { obj.type = value; } }, metadata: _metadata }, _type_initializers, _type_extraInitializers);
            __esDecorate(null, null, _category_decorators, { kind: "field", name: "category", static: false, private: false, access: { has: function (obj) { return "category" in obj; }, get: function (obj) { return obj.category; }, set: function (obj, value) { obj.category = value; } }, metadata: _metadata }, _category_initializers, _category_extraInitializers);
            __esDecorate(null, null, _loadId_decorators, { kind: "field", name: "loadId", static: false, private: false, access: { has: function (obj) { return "loadId" in obj; }, get: function (obj) { return obj.loadId; }, set: function (obj, value) { obj.loadId = value; } }, metadata: _metadata }, _loadId_initializers, _loadId_extraInitializers);
            __esDecorate(null, null, _entityId_decorators, { kind: "field", name: "entityId", static: false, private: false, access: { has: function (obj) { return "entityId" in obj; }, get: function (obj) { return obj.entityId; }, set: function (obj, value) { obj.entityId = value; } }, metadata: _metadata }, _entityId_initializers, _entityId_extraInitializers);
            __esDecorate(null, null, _entityType_decorators, { kind: "field", name: "entityType", static: false, private: false, access: { has: function (obj) { return "entityType" in obj; }, get: function (obj) { return obj.entityType; }, set: function (obj, value) { obj.entityType = value; } }, metadata: _metadata }, _entityType_initializers, _entityType_extraInitializers);
            __esDecorate(null, null, _folderId_decorators, { kind: "field", name: "folderId", static: false, private: false, access: { has: function (obj) { return "folderId" in obj; }, get: function (obj) { return obj.folderId; }, set: function (obj, value) { obj.folderId = value; } }, metadata: _metadata }, _folderId_initializers, _folderId_extraInitializers);
            __esDecorate(null, null, _tags_decorators, { kind: "field", name: "tags", static: false, private: false, access: { has: function (obj) { return "tags" in obj; }, get: function (obj) { return obj.tags; }, set: function (obj, value) { obj.tags = value; } }, metadata: _metadata }, _tags_initializers, _tags_extraInitializers);
            __esDecorate(null, null, _expiresAt_decorators, { kind: "field", name: "expiresAt", static: false, private: false, access: { has: function (obj) { return "expiresAt" in obj; }, get: function (obj) { return obj.expiresAt; }, set: function (obj, value) { obj.expiresAt = value; } }, metadata: _metadata }, _expiresAt_initializers, _expiresAt_extraInitializers);
            __esDecorate(null, null, _metadata_decorators, { kind: "field", name: "metadata", static: false, private: false, access: { has: function (obj) { return "metadata" in obj; }, get: function (obj) { return obj.metadata; }, set: function (obj, value) { obj.metadata = value; } }, metadata: _metadata }, _metadata_initializers, _metadata_extraInitializers);
            __esDecorate(null, null, _retentionPolicy_decorators, { kind: "field", name: "retentionPolicy", static: false, private: false, access: { has: function (obj) { return "retentionPolicy" in obj; }, get: function (obj) { return obj.retentionPolicy; }, set: function (obj, value) { obj.retentionPolicy = value; } }, metadata: _metadata }, _retentionPolicy_initializers, _retentionPolicy_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.UploadDocumentDto = UploadDocumentDto;
var CheckoutDocumentDto = function () {
    var _a;
    var _lockReason_decorators;
    var _lockReason_initializers = [];
    var _lockReason_extraInitializers = [];
    return _a = /** @class */ (function () {
            function CheckoutDocumentDto() {
                this.lockReason = __runInitializers(this, _lockReason_initializers, void 0);
                __runInitializers(this, _lockReason_extraInitializers);
            }
            return CheckoutDocumentDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _lockReason_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: 'Updating rate confirmation details' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            __esDecorate(null, null, _lockReason_decorators, { kind: "field", name: "lockReason", static: false, private: false, access: { has: function (obj) { return "lockReason" in obj; }, get: function (obj) { return obj.lockReason; }, set: function (obj, value) { obj.lockReason = value; } }, metadata: _metadata }, _lockReason_initializers, _lockReason_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.CheckoutDocumentDto = CheckoutDocumentDto;
var CheckinDocumentDto = function () {
    var _a;
    var _changeSummary_decorators;
    var _changeSummary_initializers = [];
    var _changeSummary_extraInitializers = [];
    return _a = /** @class */ (function () {
            function CheckinDocumentDto() {
                this.changeSummary = __runInitializers(this, _changeSummary_initializers, void 0);
                __runInitializers(this, _changeSummary_extraInitializers);
            }
            return CheckinDocumentDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _changeSummary_decorators = [(0, swagger_1.ApiProperty)({ example: 'Updated weight and delivery instructions' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            __esDecorate(null, null, _changeSummary_decorators, { kind: "field", name: "changeSummary", static: false, private: false, access: { has: function (obj) { return "changeSummary" in obj; }, get: function (obj) { return obj.changeSummary; }, set: function (obj, value) { obj.changeSummary = value; } }, metadata: _metadata }, _changeSummary_initializers, _changeSummary_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.CheckinDocumentDto = CheckinDocumentDto;
var CreateSignatureRequestDto = function () {
    var _a;
    var _signerEmail_decorators;
    var _signerEmail_initializers = [];
    var _signerEmail_extraInitializers = [];
    var _signerName_decorators;
    var _signerName_initializers = [];
    var _signerName_extraInitializers = [];
    var _signerId_decorators;
    var _signerId_initializers = [];
    var _signerId_extraInitializers = [];
    return _a = /** @class */ (function () {
            function CreateSignatureRequestDto() {
                this.signerEmail = __runInitializers(this, _signerEmail_initializers, void 0);
                this.signerName = (__runInitializers(this, _signerEmail_extraInitializers), __runInitializers(this, _signerName_initializers, void 0));
                this.signerId = (__runInitializers(this, _signerName_extraInitializers), __runInitializers(this, _signerId_initializers, void 0));
                __runInitializers(this, _signerId_extraInitializers);
            }
            return CreateSignatureRequestDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _signerEmail_decorators = [(0, swagger_1.ApiProperty)({ example: 'driver@parilink.com' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _signerName_decorators = [(0, swagger_1.ApiProperty)({ example: 'John Doe' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _signerId_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: 'user-uuid' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            __esDecorate(null, null, _signerEmail_decorators, { kind: "field", name: "signerEmail", static: false, private: false, access: { has: function (obj) { return "signerEmail" in obj; }, get: function (obj) { return obj.signerEmail; }, set: function (obj, value) { obj.signerEmail = value; } }, metadata: _metadata }, _signerEmail_initializers, _signerEmail_extraInitializers);
            __esDecorate(null, null, _signerName_decorators, { kind: "field", name: "signerName", static: false, private: false, access: { has: function (obj) { return "signerName" in obj; }, get: function (obj) { return obj.signerName; }, set: function (obj, value) { obj.signerName = value; } }, metadata: _metadata }, _signerName_initializers, _signerName_extraInitializers);
            __esDecorate(null, null, _signerId_decorators, { kind: "field", name: "signerId", static: false, private: false, access: { has: function (obj) { return "signerId" in obj; }, get: function (obj) { return obj.signerId; }, set: function (obj, value) { obj.signerId = value; } }, metadata: _metadata }, _signerId_initializers, _signerId_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.CreateSignatureRequestDto = CreateSignatureRequestDto;
var SignDocumentDto = function () {
    var _a;
    var _signatureUrl_decorators;
    var _signatureUrl_initializers = [];
    var _signatureUrl_extraInitializers = [];
    var _documentHash_decorators;
    var _documentHash_initializers = [];
    var _documentHash_extraInitializers = [];
    return _a = /** @class */ (function () {
            function SignDocumentDto() {
                this.signatureUrl = __runInitializers(this, _signatureUrl_initializers, void 0);
                this.documentHash = (__runInitializers(this, _signatureUrl_extraInitializers), __runInitializers(this, _documentHash_initializers, void 0));
                __runInitializers(this, _documentHash_extraInitializers);
            }
            return SignDocumentDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _signatureUrl_decorators = [(0, swagger_1.ApiProperty)({ example: 'data:image/png;base64,iVBORw0KGgo...' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _documentHash_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    example: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            __esDecorate(null, null, _signatureUrl_decorators, { kind: "field", name: "signatureUrl", static: false, private: false, access: { has: function (obj) { return "signatureUrl" in obj; }, get: function (obj) { return obj.signatureUrl; }, set: function (obj, value) { obj.signatureUrl = value; } }, metadata: _metadata }, _signatureUrl_initializers, _signatureUrl_extraInitializers);
            __esDecorate(null, null, _documentHash_decorators, { kind: "field", name: "documentHash", static: false, private: false, access: { has: function (obj) { return "documentHash" in obj; }, get: function (obj) { return obj.documentHash; }, set: function (obj, value) { obj.documentHash = value; } }, metadata: _metadata }, _documentHash_initializers, _documentHash_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.SignDocumentDto = SignDocumentDto;
var CreateComplianceRequirementDto = function () {
    var _a;
    var _entityType_decorators;
    var _entityType_initializers = [];
    var _entityType_extraInitializers = [];
    var _docType_decorators;
    var _docType_initializers = [];
    var _docType_extraInitializers = [];
    var _name_decorators;
    var _name_initializers = [];
    var _name_extraInitializers = [];
    var _description_decorators;
    var _description_initializers = [];
    var _description_extraInitializers = [];
    var _isMandatory_decorators;
    var _isMandatory_initializers = [];
    var _isMandatory_extraInitializers = [];
    var _validityDays_decorators;
    var _validityDays_initializers = [];
    var _validityDays_extraInitializers = [];
    var _warningDays_decorators;
    var _warningDays_initializers = [];
    var _warningDays_extraInitializers = [];
    return _a = /** @class */ (function () {
            function CreateComplianceRequirementDto() {
                this.entityType = __runInitializers(this, _entityType_initializers, void 0);
                this.docType = (__runInitializers(this, _entityType_extraInitializers), __runInitializers(this, _docType_initializers, void 0));
                this.name = (__runInitializers(this, _docType_extraInitializers), __runInitializers(this, _name_initializers, void 0));
                this.description = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.isMandatory = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _isMandatory_initializers, void 0));
                this.validityDays = (__runInitializers(this, _isMandatory_extraInitializers), __runInitializers(this, _validityDays_initializers, void 0));
                this.warningDays = (__runInitializers(this, _validityDays_extraInitializers), __runInitializers(this, _warningDays_initializers, void 0));
                __runInitializers(this, _warningDays_extraInitializers);
            }
            return CreateComplianceRequirementDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _entityType_decorators = [(0, swagger_1.ApiProperty)({ example: 'DRIVER' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _docType_decorators = [(0, swagger_1.ApiProperty)({ example: 'CDL' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _name_decorators = [(0, swagger_1.ApiProperty)({ example: 'Commercial Driver License' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _description_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    example: 'Valid Class A CDL required for all interstate drivers',
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _isMandatory_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: true }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsBoolean)()];
            _validityDays_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: 365 }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsInt)(), (0, class_validator_1.Min)(1)];
            _warningDays_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: 30 }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsInt)(), (0, class_validator_1.Min)(1)];
            __esDecorate(null, null, _entityType_decorators, { kind: "field", name: "entityType", static: false, private: false, access: { has: function (obj) { return "entityType" in obj; }, get: function (obj) { return obj.entityType; }, set: function (obj, value) { obj.entityType = value; } }, metadata: _metadata }, _entityType_initializers, _entityType_extraInitializers);
            __esDecorate(null, null, _docType_decorators, { kind: "field", name: "docType", static: false, private: false, access: { has: function (obj) { return "docType" in obj; }, get: function (obj) { return obj.docType; }, set: function (obj, value) { obj.docType = value; } }, metadata: _metadata }, _docType_initializers, _docType_extraInitializers);
            __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: function (obj) { return "name" in obj; }, get: function (obj) { return obj.name; }, set: function (obj, value) { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: function (obj) { return "description" in obj; }, get: function (obj) { return obj.description; }, set: function (obj, value) { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _isMandatory_decorators, { kind: "field", name: "isMandatory", static: false, private: false, access: { has: function (obj) { return "isMandatory" in obj; }, get: function (obj) { return obj.isMandatory; }, set: function (obj, value) { obj.isMandatory = value; } }, metadata: _metadata }, _isMandatory_initializers, _isMandatory_extraInitializers);
            __esDecorate(null, null, _validityDays_decorators, { kind: "field", name: "validityDays", static: false, private: false, access: { has: function (obj) { return "validityDays" in obj; }, get: function (obj) { return obj.validityDays; }, set: function (obj, value) { obj.validityDays = value; } }, metadata: _metadata }, _validityDays_initializers, _validityDays_extraInitializers);
            __esDecorate(null, null, _warningDays_decorators, { kind: "field", name: "warningDays", static: false, private: false, access: { has: function (obj) { return "warningDays" in obj; }, get: function (obj) { return obj.warningDays; }, set: function (obj, value) { obj.warningDays = value; } }, metadata: _metadata }, _warningDays_initializers, _warningDays_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.CreateComplianceRequirementDto = CreateComplianceRequirementDto;
var ClassifyDocumentDto = function () {
    var _a;
    var _ocrText_decorators;
    var _ocrText_initializers = [];
    var _ocrText_extraInitializers = [];
    return _a = /** @class */ (function () {
            function ClassifyDocumentDto() {
                this.ocrText = __runInitializers(this, _ocrText_initializers, void 0);
                __runInitializers(this, _ocrText_extraInitializers);
            }
            return ClassifyDocumentDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _ocrText_decorators = [(0, swagger_1.ApiProperty)({
                    example: 'BILL OF LADING Load # LD-99201 Weight 42000 lbs Date: 2026-07-27',
                }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            __esDecorate(null, null, _ocrText_decorators, { kind: "field", name: "ocrText", static: false, private: false, access: { has: function (obj) { return "ocrText" in obj; }, get: function (obj) { return obj.ocrText; }, set: function (obj, value) { obj.ocrText = value; } }, metadata: _metadata }, _ocrText_initializers, _ocrText_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.ClassifyDocumentDto = ClassifyDocumentDto;
