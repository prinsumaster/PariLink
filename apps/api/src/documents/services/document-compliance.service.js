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
exports.DocumentComplianceService = void 0;
var common_1 = require("@nestjs/common");
var document_dto_1 = require("../dto/document.dto");
var DocumentComplianceService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var DocumentComplianceService = _classThis = /** @class */ (function () {
        function DocumentComplianceService_1(prisma, audit) {
            this.prisma = prisma;
            this.audit = audit;
        }
        DocumentComplianceService_1.prototype.createRequirement = function (companyId, userId, dto) {
            return __awaiter(this, void 0, void 0, function () {
                var req;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    return [2 /*return*/, tx.complianceRequirement.create({
                                            data: {
                                                companyId: companyId,
                                                entityType: dto.entityType,
                                                docType: dto.docType,
                                                name: dto.name,
                                                description: dto.description || null,
                                                isMandatory: dto.isMandatory !== undefined ? dto.isMandatory : true,
                                                validityDays: dto.validityDays || null,
                                                warningDays: dto.warningDays || 30,
                                            },
                                        })];
                                });
                            }); })];
                        case 1:
                            req = _a.sent();
                            return [4 /*yield*/, this.audit.logEvent({
                                    action: 'document:compliance_req:create',
                                    entity: 'ComplianceRequirement',
                                    entityId: req.id,
                                    userId: userId,
                                    companyId: companyId,
                                    details: {
                                        entityType: req.entityType,
                                        docType: req.docType,
                                        name: req.name,
                                    },
                                })];
                        case 2:
                            _a.sent();
                            return [2 /*return*/, req];
                    }
                });
            });
        };
        DocumentComplianceService_1.prototype.getRequirements = function (companyId, entityType) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                return [2 /*return*/, tx.complianceRequirement.findMany({
                                        where: {
                                            companyId: companyId,
                                            entityType: entityType || undefined,
                                        },
                                        orderBy: { entityType: 'asc' },
                                    })];
                            });
                        }); })];
                });
            });
        };
        DocumentComplianceService_1.prototype.deleteRequirement = function (companyId, id, userId) {
            return __awaiter(this, void 0, void 0, function () {
                var req;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, tx.complianceRequirement.findFirst({ where: { id: id, companyId: companyId } })];
                            }); }); })];
                        case 1:
                            req = _a.sent();
                            if (!req || req.companyId !== companyId) {
                                throw new common_1.NotFoundException('Compliance requirement not found');
                            }
                            return [4 /*yield*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.complianceRequirement.deleteMany({
                                                where: { id: id, companyId: companyId },
                                            })];
                                    });
                                }); })];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, this.audit.logEvent({
                                    action: 'document:compliance_req:delete',
                                    entity: 'ComplianceRequirement',
                                    entityId: id,
                                    userId: userId,
                                    companyId: companyId,
                                    details: { name: req.name },
                                })];
                        case 3:
                            _a.sent();
                            return [2 /*return*/, { success: true, id: id }];
                    }
                });
            });
        };
        DocumentComplianceService_1.prototype.evaluateEntityCompliance = function (companyId, entityType, entityId) {
            return __awaiter(this, void 0, void 0, function () {
                var requirements, documents, now, thirtyDaysFromNow, docMap, evaluations, hasExpiredOrMissingMandatory, hasExpiringSoon, _i, requirements_1, req, doc, status_1, reason, expiresAt, expDate, warningDate, overallStatus;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    return [2 /*return*/, tx.complianceRequirement.findMany({
                                            where: { companyId: companyId, entityType: entityType },
                                        })];
                                });
                            }); })];
                        case 1:
                            requirements = _a.sent();
                            return [4 /*yield*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.document.findMany({
                                                where: {
                                                    companyId: companyId,
                                                    entityType: entityType,
                                                    entityId: entityId,
                                                    status: 'ACTIVE',
                                                },
                                                orderBy: { createdAt: 'desc' },
                                            })];
                                    });
                                }); })];
                        case 2:
                            documents = _a.sent();
                            now = new Date();
                            thirtyDaysFromNow = new Date();
                            thirtyDaysFromNow.setDate(now.getDate() + 30);
                            docMap = new Map();
                            documents.forEach(function (doc) {
                                if (!docMap.has(doc.type)) {
                                    docMap.set(doc.type, doc);
                                }
                            });
                            evaluations = [];
                            hasExpiredOrMissingMandatory = false;
                            hasExpiringSoon = false;
                            for (_i = 0, requirements_1 = requirements; _i < requirements_1.length; _i++) {
                                req = requirements_1[_i];
                                doc = docMap.get(req.docType);
                                status_1 = document_dto_1.EntityComplianceStatus.COMPLIANT;
                                reason = 'Valid document on file';
                                expiresAt = null;
                                if (!doc) {
                                    if (req.isMandatory) {
                                        status_1 = document_dto_1.EntityComplianceStatus.NON_COMPLIANT;
                                        reason = 'Mandatory document missing';
                                        hasExpiredOrMissingMandatory = true;
                                    }
                                    else {
                                        status_1 = document_dto_1.EntityComplianceStatus.COMPLIANT;
                                        reason = 'Optional document not provided';
                                    }
                                }
                                else {
                                    expiresAt = doc.expiresAt;
                                    if (doc.expiresAt) {
                                        expDate = new Date(doc.expiresAt);
                                        if (expDate <= now) {
                                            status_1 = document_dto_1.EntityComplianceStatus.NON_COMPLIANT;
                                            reason = 'Document has expired';
                                            if (req.isMandatory)
                                                hasExpiredOrMissingMandatory = true;
                                        }
                                        else {
                                            warningDate = new Date();
                                            warningDate.setDate(now.getDate() + req.warningDays);
                                            if (expDate <= warningDate) {
                                                status_1 = document_dto_1.EntityComplianceStatus.EXPIRING_SOON;
                                                reason = "Document expires in less than ".concat(req.warningDays, " days");
                                                hasExpiringSoon = true;
                                            }
                                        }
                                    }
                                }
                                evaluations.push({
                                    requirementId: req.id,
                                    docType: req.docType,
                                    requirementName: req.name,
                                    isMandatory: req.isMandatory,
                                    documentId: doc ? doc.id : null,
                                    expiresAt: expiresAt,
                                    status: status_1,
                                    reason: reason,
                                });
                            }
                            overallStatus = document_dto_1.EntityComplianceStatus.COMPLIANT;
                            if (hasExpiredOrMissingMandatory) {
                                overallStatus = document_dto_1.EntityComplianceStatus.NON_COMPLIANT;
                            }
                            else if (hasExpiringSoon) {
                                overallStatus = document_dto_1.EntityComplianceStatus.EXPIRING_SOON;
                            }
                            return [2 /*return*/, {
                                    companyId: companyId,
                                    entityType: entityType,
                                    entityId: entityId,
                                    overallStatus: overallStatus,
                                    evaluatedAt: now.toISOString(),
                                    requirementsCount: requirements.length,
                                    evaluations: evaluations,
                                }];
                    }
                });
            });
        };
        DocumentComplianceService_1.prototype.scanExpiringDocuments = function (companyId) {
            return __awaiter(this, void 0, void 0, function () {
                var now, warningThreshold, expiringDocs, expiredDocs;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            now = new Date();
                            warningThreshold = new Date();
                            warningThreshold.setDate(now.getDate() + 30);
                            return [4 /*yield*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.document.findMany({
                                                where: {
                                                    companyId: companyId,
                                                    status: 'ACTIVE',
                                                    expiresAt: {
                                                        lte: warningThreshold,
                                                        gte: now,
                                                    },
                                                },
                                                include: {
                                                    uploadedBy: {
                                                        select: { id: true, email: true, firstName: true, lastName: true },
                                                    },
                                                },
                                                orderBy: { expiresAt: 'asc' },
                                            })];
                                    });
                                }); })];
                        case 1:
                            expiringDocs = _a.sent();
                            return [4 /*yield*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.document.findMany({
                                                where: {
                                                    companyId: companyId,
                                                    status: 'ACTIVE',
                                                    expiresAt: {
                                                        lt: now,
                                                    },
                                                },
                                                include: {
                                                    uploadedBy: {
                                                        select: { id: true, email: true, firstName: true, lastName: true },
                                                    },
                                                },
                                                orderBy: { expiresAt: 'asc' },
                                            })];
                                    });
                                }); })];
                        case 2:
                            expiredDocs = _a.sent();
                            return [2 /*return*/, {
                                    companyId: companyId,
                                    scannedAt: now.toISOString(),
                                    expiringCount: expiringDocs.length,
                                    expiredCount: expiredDocs.length,
                                    expiringWithin30Days: expiringDocs,
                                    expired: expiredDocs,
                                }];
                    }
                });
            });
        };
        return DocumentComplianceService_1;
    }());
    __setFunctionName(_classThis, "DocumentComplianceService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        DocumentComplianceService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return DocumentComplianceService = _classThis;
}();
exports.DocumentComplianceService = DocumentComplianceService;
