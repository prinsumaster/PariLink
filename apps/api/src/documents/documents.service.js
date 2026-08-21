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
exports.DocumentsService = void 0;
var common_1 = require("@nestjs/common");
var DocumentsService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var DocumentsService = _classThis = /** @class */ (function () {
        function DocumentsService_1(prisma, storage, auditService, eventStore) {
            this.prisma = prisma;
            this.storage = storage;
            this.auditService = auditService;
            this.eventStore = eventStore;
            this.logger = new common_1.Logger(DocumentsService.name);
        }
        DocumentsService_1.prototype.uploadDocument = function (companyId, userId, file, body) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                            var fileUrl, parsedTags, errorMessage, load, folder, document;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, this.storage.upload(file.buffer, file.originalname, file.mimetype, companyId)];
                                    case 1:
                                        fileUrl = _a.sent();
                                        parsedTags = [];
                                        try {
                                            if (body.tags)
                                                parsedTags = JSON.parse(body.tags);
                                        }
                                        catch (err) {
                                            errorMessage = (err === null || err === void 0 ? void 0 : err.message) || 'Unknown error';
                                            this.logger.error("Failed to handle document processing: ".concat(errorMessage));
                                        }
                                        if (!body.loadId) return [3 /*break*/, 3];
                                        return [4 /*yield*/, tx.load.findFirst({
                                                where: { id: body.loadId, companyId: companyId },
                                            })];
                                    case 2:
                                        load = _a.sent();
                                        if (!load)
                                            throw new common_1.BadRequestException('Load not found or unauthorized');
                                        _a.label = 3;
                                    case 3:
                                        if (!body.folderId) return [3 /*break*/, 5];
                                        return [4 /*yield*/, tx.documentFolder.findFirst({
                                                where: { id: body.folderId, companyId: companyId },
                                            })];
                                    case 4:
                                        folder = _a.sent();
                                        if (!folder)
                                            throw new common_1.BadRequestException('Folder not found or unauthorized');
                                        _a.label = 5;
                                    case 5: return [4 /*yield*/, tx.document.create({
                                            data: {
                                                companyId: companyId,
                                                loadId: body.loadId || null,
                                                entityId: body.entityId || null,
                                                entityType: body.entityType || null,
                                                type: body.type,
                                                fileUrl: fileUrl,
                                                fileName: file.originalname,
                                                mimeType: file.mimetype,
                                                sizeBytes: file.size,
                                                uploadedById: userId,
                                                folderId: body.folderId || null,
                                                tags: parsedTags,
                                            },
                                        })];
                                    case 6:
                                        document = _a.sent();
                                        return [4 /*yield*/, this.auditService.logEvent({
                                                companyId: companyId,
                                                entity: 'Document',
                                                entityType: 'Document',
                                                entityId: document.id,
                                                action: 'CREATE',
                                                details: { fileName: file.originalname },
                                                source: 'API',
                                            }, null, tx)];
                                    case 7:
                                        _a.sent();
                                        return [4 /*yield*/, this.eventStore.append({
                                                tenantId: companyId,
                                                streamType: 'DOCUMENT',
                                                streamId: document.id,
                                                eventType: 'DocumentUploaded',
                                                payload: { fileName: file.originalname },
                                                userId: userId,
                                            })];
                                    case 8:
                                        _a.sent();
                                        return [2 /*return*/, document];
                                }
                            });
                        }); })];
                });
            });
        };
        DocumentsService_1.prototype.getLoadDocuments = function (companyId, loadId) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                return [2 /*return*/, tx.document.findMany({
                                        where: { loadId: loadId, companyId: companyId },
                                        orderBy: { createdAt: 'desc' },
                                        include: {
                                            uploadedBy: {
                                                select: { id: true, firstName: true, lastName: true },
                                            },
                                        },
                                    })];
                            });
                        }); })];
                });
            });
        };
        DocumentsService_1.prototype.getEntityDocuments = function (companyId, entityType, entityId) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                return [2 /*return*/, tx.document.findMany({
                                        where: { entityType: entityType, entityId: entityId, companyId: companyId },
                                        orderBy: { createdAt: 'desc' },
                                        include: {
                                            uploadedBy: {
                                                select: { id: true, firstName: true, lastName: true },
                                            },
                                        },
                                    })];
                            });
                        }); })];
                });
            });
        };
        DocumentsService_1.prototype.getAllDocuments = function (companyId, folderId) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                return [2 /*return*/, tx.document.findMany({
                                        where: {
                                            companyId: companyId,
                                            folderId: folderId || null,
                                        },
                                        orderBy: { createdAt: 'desc' },
                                        include: {
                                            uploadedBy: { select: { id: true, firstName: true, lastName: true } },
                                        },
                                    })];
                            });
                        }); })];
                });
            });
        };
        // Folders API
        DocumentsService_1.prototype.getFolders = function (companyId, parentId) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                return [2 /*return*/, tx.documentFolder.findMany({
                                        where: {
                                            companyId: companyId,
                                            parentId: parentId || null,
                                        },
                                        orderBy: { name: 'asc' },
                                    })];
                            });
                        }); })];
                });
            });
        };
        DocumentsService_1.prototype.createFolder = function (companyId, name, parentId) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                            var folder;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, tx.documentFolder.create({
                                            data: {
                                                companyId: companyId,
                                                name: name,
                                                parentId: parentId || null,
                                            },
                                        })];
                                    case 1:
                                        folder = _a.sent();
                                        return [4 /*yield*/, this.auditService.logEvent({
                                                companyId: companyId,
                                                entity: 'DocumentFolder',
                                                entityType: 'DocumentFolder',
                                                entityId: folder.id,
                                                action: 'CREATE',
                                                details: { name: name },
                                                source: 'API',
                                            }, null, tx)];
                                    case 2:
                                        _a.sent();
                                        return [4 /*yield*/, this.eventStore.append({
                                                tenantId: companyId,
                                                streamType: 'DOCUMENT_FOLDER',
                                                streamId: folder.id,
                                                eventType: 'FolderCreated',
                                                payload: { name: name },
                                            })];
                                    case 3:
                                        _a.sent();
                                        return [2 /*return*/, folder];
                                }
                            });
                        }); })];
                });
            });
        };
        return DocumentsService_1;
    }());
    __setFunctionName(_classThis, "DocumentsService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        DocumentsService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return DocumentsService = _classThis;
}();
exports.DocumentsService = DocumentsService;
