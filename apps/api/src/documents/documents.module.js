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
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentsModule = void 0;
var common_1 = require("@nestjs/common");
var documents_service_1 = require("./documents.service");
var documents_controller_1 = require("./documents.controller");
var enterprise_document_controller_1 = require("./controllers/enterprise-document.controller");
var document_folder_service_1 = require("./services/document-folder.service");
var document_version_service_1 = require("./services/document-version.service");
var document_signature_service_1 = require("./services/document-signature.service");
var document_compliance_service_1 = require("./services/document-compliance.service");
var document_ai_service_1 = require("./services/document-ai.service");
var storage_service_1 = require("./services/storage.service");
var DocumentsModule = function () {
    var _classDecorators = [(0, common_1.Module)({
            controllers: [documents_controller_1.DocumentsController, enterprise_document_controller_1.EnterpriseDocumentController],
            providers: [
                documents_service_1.DocumentsService,
                document_folder_service_1.DocumentFolderService,
                document_version_service_1.DocumentVersionService,
                document_signature_service_1.DocumentSignatureService,
                document_compliance_service_1.DocumentComplianceService,
                document_ai_service_1.DocumentAiService,
                storage_service_1.StorageService,
            ],
            exports: [
                documents_service_1.DocumentsService,
                document_folder_service_1.DocumentFolderService,
                document_version_service_1.DocumentVersionService,
                document_signature_service_1.DocumentSignatureService,
                document_compliance_service_1.DocumentComplianceService,
                document_ai_service_1.DocumentAiService,
            ],
        })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var DocumentsModule = _classThis = /** @class */ (function () {
        function DocumentsModule_1() {
        }
        return DocumentsModule_1;
    }());
    __setFunctionName(_classThis, "DocumentsModule");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        DocumentsModule = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return DocumentsModule = _classThis;
}();
exports.DocumentsModule = DocumentsModule;
