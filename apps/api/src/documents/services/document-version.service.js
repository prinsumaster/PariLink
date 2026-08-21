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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentVersionService = void 0;
var common_1 = require("@nestjs/common");
var DocumentVersionService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var DocumentVersionService = _classThis = /** @class */ (function () {
        function DocumentVersionService_1(prisma, audit) {
            this.prisma = prisma;
            this.audit = audit;
        }
        DocumentVersionService_1.prototype.checkout = function (companyId, documentId, userId, dto) {
            return __awaiter(this, void 0, void 0, function () {
                var doc, updated;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, tx.document.findUnique({ where: { id: documentId } })];
                            }); }); })];
                        case 1:
                            doc = _a.sent();
                            if (!doc || doc.companyId !== companyId || doc.deletedAt) {
                                throw new common_1.NotFoundException('Document not found');
                            }
                            if (doc.isLocked && doc.lockedById !== userId) {
                                throw new common_1.ForbiddenException("Document is currently locked for editing by user ".concat(doc.lockedById));
                            }
                            return [4 /*yield*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.document.update({
                                                where: { id: documentId },
                                                data: {
                                                    isLocked: true,
                                                    lockedById: userId,
                                                },
                                            })];
                                    });
                                }); })];
                        case 2:
                            updated = _a.sent();
                            return [4 /*yield*/, this.audit.logEvent({
                                    action: 'document:checkout',
                                    entity: 'Document',
                                    entityId: documentId,
                                    userId: userId,
                                    companyId: companyId,
                                    details: { lockReason: dto.lockReason },
                                })];
                        case 3:
                            _a.sent();
                            return [2 /*return*/, updated];
                    }
                });
            });
        };
        DocumentVersionService_1.prototype.checkin = function (companyId, documentId, userId, file, dto) {
            return __awaiter(this, void 0, void 0, function () {
                var doc;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, tx.document.findUnique({ where: { id: documentId } })];
                            }); }); })];
                        case 1:
                            doc = _a.sent();
                            if (!doc || doc.companyId !== companyId || doc.deletedAt) {
                                throw new common_1.NotFoundException('Document not found');
                            }
                            if (doc.isLocked && doc.lockedById !== userId) {
                                throw new common_1.ForbiddenException("Document is locked by user ".concat(doc.lockedById, ". You cannot check in a new version."));
                            }
                            return [2 /*return*/, this.prisma.$transaction(function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    var newVersion, fileUrl, updatedDoc;
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0: 
                                            // Archive previous version
                                            return [4 /*yield*/, tx.documentVersion.create({
                                                    data: {
                                                        documentId: documentId,
                                                        version: doc.version,
                                                        fileUrl: doc.fileUrl,
                                                        fileName: doc.fileName,
                                                        sizeBytes: doc.sizeBytes,
                                                        mimeType: doc.mimeType,
                                                        uploadedById: doc.uploadedById || userId,
                                                        changeSummary: dto.changeSummary,
                                                    },
                                                })];
                                            case 1:
                                                // Archive previous version
                                                _a.sent();
                                                newVersion = doc.version + 1;
                                                fileUrl = "/uploads/".concat(file.filename);
                                                return [4 /*yield*/, tx.document.update({
                                                        where: { id: documentId },
                                                        data: {
                                                            version: newVersion,
                                                            fileUrl: fileUrl,
                                                            fileName: file.originalname,
                                                            mimeType: file.mimetype,
                                                            sizeBytes: file.size,
                                                            uploadedById: userId,
                                                            isLocked: false,
                                                            lockedById: null,
                                                        },
                                                    })];
                                            case 2:
                                                updatedDoc = _a.sent();
                                                return [4 /*yield*/, this.audit.logEvent({
                                                        action: 'document:checkin',
                                                        entity: 'Document',
                                                        entityId: documentId,
                                                        userId: userId,
                                                        companyId: companyId,
                                                        details: {
                                                            newVersion: newVersion,
                                                            changeSummary: dto.changeSummary,
                                                            fileName: file.originalname,
                                                        },
                                                    })];
                                            case 3:
                                                _a.sent();
                                                return [2 /*return*/, updatedDoc];
                                        }
                                    });
                                }); })];
                    }
                });
            });
        };
        DocumentVersionService_1.prototype.unlock = function (companyId_1, documentId_1, userId_1) {
            return __awaiter(this, arguments, void 0, function (companyId, documentId, userId, isAdmin) {
                var doc, updated;
                var _this = this;
                if (isAdmin === void 0) { isAdmin = false; }
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, tx.document.findUnique({ where: { id: documentId } })];
                            }); }); })];
                        case 1:
                            doc = _a.sent();
                            if (!doc || doc.companyId !== companyId || doc.deletedAt) {
                                throw new common_1.NotFoundException('Document not found');
                            }
                            if (!doc.isLocked) {
                                return [2 /*return*/, doc];
                            }
                            if (doc.lockedById !== userId && !isAdmin) {
                                throw new common_1.ForbiddenException('Only the locking user or an administrator can force unlock this document');
                            }
                            return [4 /*yield*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.document.update({
                                                where: { id: documentId },
                                                data: {
                                                    isLocked: false,
                                                    lockedById: null,
                                                },
                                            })];
                                    });
                                }); })];
                        case 2:
                            updated = _a.sent();
                            return [4 /*yield*/, this.audit.logEvent({
                                    action: 'document:unlock',
                                    entity: 'Document',
                                    entityId: documentId,
                                    userId: userId,
                                    companyId: companyId,
                                    details: { forcedByAdmin: isAdmin && doc.lockedById !== userId },
                                })];
                        case 3:
                            _a.sent();
                            return [2 /*return*/, updated];
                    }
                });
            });
        };
        DocumentVersionService_1.prototype.getVersionHistory = function (companyId, documentId) {
            return __awaiter(this, void 0, void 0, function () {
                var doc, archivedVersions, currentVersion;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, tx.document.findUnique({ where: { id: documentId } })];
                            }); }); })];
                        case 1:
                            doc = _a.sent();
                            if (!doc || doc.companyId !== companyId || doc.deletedAt) {
                                throw new common_1.NotFoundException('Document not found');
                            }
                            return [4 /*yield*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.documentVersion.findMany({
                                                where: { documentId: documentId },
                                                orderBy: { version: 'desc' },
                                            })];
                                    });
                                }); })];
                        case 2:
                            archivedVersions = _a.sent();
                            currentVersion = {
                                id: doc.id,
                                documentId: doc.id,
                                version: doc.version,
                                fileUrl: doc.fileUrl,
                                fileName: doc.fileName,
                                sizeBytes: doc.sizeBytes,
                                mimeType: doc.mimeType,
                                uploadedById: doc.uploadedById,
                                changeSummary: 'Current active version',
                                createdAt: doc.updatedAt,
                                isCurrent: true,
                            };
                            return [2 /*return*/, __spreadArray([
                                    currentVersion
                                ], archivedVersions.map(function (v) { return (__assign(__assign({}, v), { isCurrent: false })); }), true)];
                    }
                });
            });
        };
        DocumentVersionService_1.prototype.revertToVersion = function (companyId, documentId, targetVersion, userId) {
            return __awaiter(this, void 0, void 0, function () {
                var doc, archived;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, tx.document.findUnique({ where: { id: documentId } })];
                            }); }); })];
                        case 1:
                            doc = _a.sent();
                            if (!doc || doc.companyId !== companyId || doc.deletedAt) {
                                throw new common_1.NotFoundException('Document not found');
                            }
                            if (doc.isLocked && doc.lockedById !== userId) {
                                throw new common_1.ForbiddenException('Cannot revert a locked document');
                            }
                            if (targetVersion >= doc.version) {
                                throw new common_1.BadRequestException('Can only revert to an older version number');
                            }
                            return [4 /*yield*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.documentVersion.findFirst({
                                                where: { documentId: documentId, version: targetVersion },
                                            })];
                                    });
                                }); })];
                        case 2:
                            archived = _a.sent();
                            if (!archived) {
                                throw new common_1.NotFoundException("Version ".concat(targetVersion, " not found in archive"));
                            }
                            return [2 /*return*/, this.prisma.$transaction(function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    var newVersion, updatedDoc;
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0: 
                                            // Archive current before reverting
                                            return [4 /*yield*/, tx.documentVersion.create({
                                                    data: {
                                                        documentId: documentId,
                                                        version: doc.version,
                                                        fileUrl: doc.fileUrl,
                                                        fileName: doc.fileName,
                                                        sizeBytes: doc.sizeBytes,
                                                        mimeType: doc.mimeType,
                                                        uploadedById: doc.uploadedById || userId,
                                                        changeSummary: "Reverted to version ".concat(targetVersion),
                                                    },
                                                })];
                                            case 1:
                                                // Archive current before reverting
                                                _a.sent();
                                                newVersion = doc.version + 1;
                                                return [4 /*yield*/, tx.document.update({
                                                        where: { id: documentId },
                                                        data: {
                                                            version: newVersion,
                                                            fileUrl: archived.fileUrl,
                                                            fileName: archived.fileName,
                                                            sizeBytes: archived.sizeBytes,
                                                            mimeType: archived.mimeType,
                                                            uploadedById: userId,
                                                            isLocked: false,
                                                            lockedById: null,
                                                        },
                                                    })];
                                            case 2:
                                                updatedDoc = _a.sent();
                                                return [4 /*yield*/, this.audit.logEvent({
                                                        action: 'document:revert_version',
                                                        entity: 'Document',
                                                        entityId: documentId,
                                                        userId: userId,
                                                        companyId: companyId,
                                                        details: {
                                                            revertedFrom: doc.version,
                                                            revertedTo: targetVersion,
                                                            newVersion: newVersion,
                                                        },
                                                    })];
                                            case 3:
                                                _a.sent();
                                                return [2 /*return*/, updatedDoc];
                                        }
                                    });
                                }); })];
                    }
                });
            });
        };
        return DocumentVersionService_1;
    }());
    __setFunctionName(_classThis, "DocumentVersionService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        DocumentVersionService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return DocumentVersionService = _classThis;
}();
exports.DocumentVersionService = DocumentVersionService;
