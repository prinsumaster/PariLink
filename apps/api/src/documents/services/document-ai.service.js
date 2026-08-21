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
exports.DocumentAiService = void 0;
var common_1 = require("@nestjs/common");
var DocumentAiService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var DocumentAiService = _classThis = /** @class */ (function () {
        function DocumentAiService_1(prisma, audit) {
            this.prisma = prisma;
            this.audit = audit;
        }
        DocumentAiService_1.prototype.classifyAndExtractMetadata = function (companyId, documentId, userId, dto) {
            return __awaiter(this, void 0, void 0, function () {
                var doc, text, detectedType, confidence, extractedMetadata, loadMatch, weightMatch, dateMatch, amountMatch, policyMatch, autoFolderId, folders, matchingFolder, updatedDoc;
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
                            text = dto.ocrText.toUpperCase();
                            detectedType = doc.type;
                            confidence = 0.5;
                            extractedMetadata = {};
                            // 1. Classification rules
                            if (text.includes('BILL OF LADING') ||
                                text.includes('BOL #') ||
                                text.includes('B/L')) {
                                detectedType = 'BILL_OF_LADING';
                                confidence = 0.95;
                            }
                            else if (text.includes('PROOF OF DELIVERY') ||
                                text.includes('POD') ||
                                text.includes('RECEIVED BY') ||
                                text.includes('CONSIGNEE SIGNATURE')) {
                                detectedType = 'PROOF_OF_DELIVERY';
                                confidence = 0.92;
                            }
                            else if (text.includes('COMMERCIAL DRIVER') ||
                                text.includes('CDL') ||
                                text.includes('DRIVER LICENSE') ||
                                text.includes('CLASS A')) {
                                detectedType = 'DRIVER_LICENSE';
                                confidence = 0.94;
                            }
                            else if (text.includes('CERTIFICATE OF LIABILITY INSURANCE') ||
                                text.includes('ACORD') ||
                                text.includes('INSURED') ||
                                text.includes('POLICY NUMBER')) {
                                detectedType = 'INSURANCE_COI';
                                confidence = 0.96;
                            }
                            else if (text.includes('RATE CONFIRMATION') ||
                                text.includes('RATE CONF') ||
                                text.includes('CARRIER PAY')) {
                                detectedType = 'RATE_CONFIRMATION';
                                confidence = 0.9;
                            }
                            else if (text.includes('INVOICE') ||
                                text.includes('AMOUNT DUE') ||
                                text.includes('REMIT TO')) {
                                detectedType = 'INVOICE';
                                confidence = 0.89;
                            }
                            loadMatch = text.match(/(?:LOAD|LD|TRIP|ORDER|BOL)\s*[#:]?\s*([A-Z0-9-]{4,15})/i);
                            if (loadMatch && loadMatch[1]) {
                                extractedMetadata.loadNumber = loadMatch[1];
                            }
                            weightMatch = text.match(/([0-9,]+)\s*(?:LBS|POUNDS|KG)/i);
                            if (weightMatch && weightMatch[1]) {
                                extractedMetadata.weight = parseInt(weightMatch[1].replace(/,/g, ''), 10);
                            }
                            dateMatch = text.match(/(\d{4}-\d{2}-\d{2}|\d{2}\/\d{2}\/\d{4})/);
                            if (dateMatch && dateMatch[1]) {
                                extractedMetadata.documentDate = dateMatch[1];
                            }
                            amountMatch = text.match(/(?:\$|USD|TOTAL|AMOUNT)\s*([0-9,]+\.\d{2})/i);
                            if (amountMatch && amountMatch[1]) {
                                extractedMetadata.totalAmount = parseFloat(amountMatch[1].replace(/,/g, ''));
                            }
                            policyMatch = text.match(/(?:POLICY|POL)\s*[#:]?\s*([A-Z0-9-]{6,20})/i);
                            if (policyMatch && policyMatch[1]) {
                                extractedMetadata.policyNumber = policyMatch[1];
                            }
                            autoFolderId = doc.folderId;
                            if (!!autoFolderId) return [3 /*break*/, 3];
                            return [4 /*yield*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                    return [2 /*return*/, tx.documentFolder.findMany({ where: { companyId: companyId } })];
                                }); }); })];
                        case 2:
                            folders = _a.sent();
                            matchingFolder = folders.find(function (f) {
                                return f.name.toUpperCase().includes(detectedType.replace(/_/g, ' '));
                            });
                            if (matchingFolder) {
                                autoFolderId = matchingFolder.id;
                            }
                            _a.label = 3;
                        case 3: return [4 /*yield*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    return [2 /*return*/, tx.document.update({
                                            where: { id: documentId },
                                            data: {
                                                type: detectedType,
                                                folderId: autoFolderId,
                                                metadata: __assign(__assign(__assign({}, (typeof doc.metadata === 'object' && doc.metadata !== null
                                                    ? doc.metadata
                                                    : {})), extractedMetadata), { aiClassification: {
                                                        detectedType: detectedType,
                                                        confidence: confidence,
                                                        processedAt: new Date().toISOString(),
                                                    } }),
                                            },
                                        })];
                                });
                            }); })];
                        case 4:
                            updatedDoc = _a.sent();
                            return [4 /*yield*/, this.audit.logEvent({
                                    action: 'document:ai:classify',
                                    entity: 'Document',
                                    entityId: documentId,
                                    userId: userId,
                                    companyId: companyId,
                                    details: { detectedType: detectedType, confidence: confidence, extractedMetadata: extractedMetadata, autoFolderId: autoFolderId },
                                })];
                        case 5:
                            _a.sent();
                            return [2 /*return*/, {
                                    documentId: doc.id,
                                    originalType: doc.type,
                                    detectedType: detectedType,
                                    confidence: confidence,
                                    extractedMetadata: extractedMetadata,
                                    autoFiledFolderId: autoFolderId,
                                    updatedDocument: updatedDoc,
                                }];
                    }
                });
            });
        };
        return DocumentAiService_1;
    }());
    __setFunctionName(_classThis, "DocumentAiService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        DocumentAiService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return DocumentAiService = _classThis;
}();
exports.DocumentAiService = DocumentAiService;
