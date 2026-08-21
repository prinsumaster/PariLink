"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
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
exports.DocumentFolderService = void 0;
var common_1 = require("@nestjs/common");
var DocumentFolderService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var DocumentFolderService = _classThis = /** @class */ (function () {
        function DocumentFolderService_1(prisma, audit) {
            this.prisma = prisma;
            this.audit = audit;
        }
        DocumentFolderService_1.prototype.createFolder = function (companyId, userId, dto) {
            return __awaiter(this, void 0, void 0, function () {
                var parent_1, folder;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!dto.parentId) return [3 /*break*/, 2];
                            return [4 /*yield*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                    return [2 /*return*/, tx.documentFolder.findUnique({ where: { id: dto.parentId } })];
                                }); }); })];
                        case 1:
                            parent_1 = _a.sent();
                            if (!parent_1 || parent_1.companyId !== companyId) {
                                throw new common_1.NotFoundException('Parent folder not found');
                            }
                            _a.label = 2;
                        case 2: return [4 /*yield*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    return [2 /*return*/, tx.documentFolder.create({
                                            data: {
                                                companyId: companyId,
                                                name: dto.name,
                                                parentId: dto.parentId || null,
                                            },
                                        })];
                                });
                            }); })];
                        case 3:
                            folder = _a.sent();
                            return [4 /*yield*/, this.audit.logEvent({
                                    action: 'document:folder:create',
                                    entity: 'DocumentFolder',
                                    entityId: folder.id,
                                    userId: userId,
                                    companyId: companyId,
                                    details: { name: folder.name, parentId: folder.parentId },
                                })];
                        case 4:
                            _a.sent();
                            return [2 /*return*/, folder];
                    }
                });
            });
        };
        DocumentFolderService_1.prototype.getFolders = function (companyId, parentId) {
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
                                        include: {
                                            _count: {
                                                select: {
                                                    subFolders: true,
                                                    documents: {},
                                                },
                                            },
                                        },
                                        orderBy: { name: 'asc' },
                                    })];
                            });
                        }); })];
                });
            });
        };
        DocumentFolderService_1.prototype.getFolderTree = function (companyId) {
            return __awaiter(this, void 0, void 0, function () {
                var allFolders, folderMap, rootFolders;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    return [2 /*return*/, tx.documentFolder.findMany({
                                            where: { companyId: companyId },
                                            orderBy: { name: 'asc' },
                                        })];
                                });
                            }); })];
                        case 1:
                            allFolders = _a.sent();
                            folderMap = new Map();
                            allFolders.forEach(function (f) { return folderMap.set(f.id, __assign(__assign({}, f), { subFolders: [] })); });
                            rootFolders = [];
                            folderMap.forEach(function (folder) {
                                if (folder.parentId && folderMap.has(folder.parentId)) {
                                    folderMap.get(folder.parentId).subFolders.push(folder);
                                }
                                else {
                                    rootFolders.push(folder);
                                }
                            });
                            return [2 /*return*/, rootFolders];
                    }
                });
            });
        };
        DocumentFolderService_1.prototype.updateFolder = function (companyId, id, userId, dto) {
            return __awaiter(this, void 0, void 0, function () {
                var folder, updated;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, tx.documentFolder.findFirst({ where: { id: id, companyId: companyId } })];
                            }); }); })];
                        case 1:
                            folder = _a.sent();
                            if (!folder || folder.companyId !== companyId) {
                                throw new common_1.NotFoundException('Folder not found');
                            }
                            if (dto.parentId === id) {
                                throw new common_1.BadRequestException('A folder cannot be its own parent');
                            }
                            return [4 /*yield*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.documentFolder.updateMany({
                                                where: { id: id, companyId: companyId },
                                                data: {
                                                    name: dto.name,
                                                    parentId: dto.parentId !== undefined ? dto.parentId : folder.parentId,
                                                },
                                            })];
                                    });
                                }); })];
                        case 2:
                            updated = _a.sent();
                            return [4 /*yield*/, this.audit.logEvent({
                                    action: 'document:folder:update',
                                    entity: 'DocumentFolder',
                                    entityId: id,
                                    userId: userId,
                                    companyId: companyId,
                                    details: { updates: dto },
                                })];
                        case 3:
                            _a.sent();
                            return [2 /*return*/, updated];
                    }
                });
            });
        };
        DocumentFolderService_1.prototype.deleteFolder = function (companyId, id, userId) {
            return __awaiter(this, void 0, void 0, function () {
                var folder;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    return [2 /*return*/, tx.documentFolder.findUnique({
                                            where: { id: id, companyId: companyId },
                                            include: {
                                                subFolders: true,
                                                documents: {},
                                            },
                                        })];
                                });
                            }); })];
                        case 1:
                            folder = _a.sent();
                            if (!folder || folder.companyId !== companyId) {
                                throw new common_1.NotFoundException('Folder not found');
                            }
                            if (folder.subFolders.length > 0 || folder.documents.length > 0) {
                                throw new common_1.BadRequestException('Cannot delete non-empty folder. Move or remove items first.');
                            }
                            return [4 /*yield*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.documentFolder.deleteMany({
                                                where: { id: id, companyId: companyId },
                                            })];
                                    });
                                }); })];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, this.audit.logEvent({
                                    action: 'document:folder:delete',
                                    entity: 'DocumentFolder',
                                    entityId: id,
                                    userId: userId,
                                    companyId: companyId,
                                    details: { name: folder.name },
                                })];
                        case 3:
                            _a.sent();
                            return [2 /*return*/, { success: true, id: id }];
                    }
                });
            });
        };
        DocumentFolderService_1.prototype.moveDocument = function (companyId, documentId, folderId, userId) {
            return __awaiter(this, void 0, void 0, function () {
                var doc, targetFolder, updated;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, tx.document.findUnique({ where: { id: documentId } })];
                            }); }); })];
                        case 1:
                            doc = _a.sent();
                            if (!doc || doc.companyId !== companyId) {
                                throw new common_1.NotFoundException('Document not found');
                            }
                            if (!folderId) return [3 /*break*/, 3];
                            return [4 /*yield*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                    return [2 /*return*/, tx.documentFolder.findUnique({ where: { id: folderId } })];
                                }); }); })];
                        case 2:
                            targetFolder = _a.sent();
                            if (!targetFolder || targetFolder.companyId !== companyId) {
                                throw new common_1.NotFoundException('Target folder not found');
                            }
                            _a.label = 3;
                        case 3: return [4 /*yield*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    return [2 /*return*/, tx.document.update({
                                            where: { id: documentId },
                                            data: { folderId: folderId },
                                        })];
                                });
                            }); })];
                        case 4:
                            updated = _a.sent();
                            return [4 /*yield*/, this.audit.logEvent({
                                    action: 'document:move',
                                    entity: 'Document',
                                    entityId: documentId,
                                    userId: userId,
                                    companyId: companyId,
                                    details: { previousFolderId: doc.folderId, newFolderId: folderId },
                                })];
                        case 5:
                            _a.sent();
                            return [2 /*return*/, updated];
                    }
                });
            });
        };
        return DocumentFolderService_1;
    }());
    __setFunctionName(_classThis, "DocumentFolderService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        DocumentFolderService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return DocumentFolderService = _classThis;
}();
exports.DocumentFolderService = DocumentFolderService;
