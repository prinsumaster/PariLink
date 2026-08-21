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
exports.DataMappingService = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
var common_1 = require("@nestjs/common");
var DataMappingService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var DataMappingService = _classThis = /** @class */ (function () {
        function DataMappingService_1(prisma, audit) {
            this.prisma = prisma;
            this.audit = audit;
            this.logger = new common_1.Logger(DataMappingService.name);
        }
        DataMappingService_1.prototype.createTemplate = function (companyId, userId, dto) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    if (!dto.name ||
                        !dto.sourceEntity ||
                        !dto.targetEntity ||
                        !Array.isArray(dto.mappingRules)) {
                        throw new common_1.BadRequestException('name, sourceEntity, targetEntity, and mappingRules array are required');
                    }
                    return [2 /*return*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                            var template;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, tx.dataMappingTemplate.create({
                                            data: {
                                                companyId: companyId,
                                                name: dto.name,
                                                sourceEntity: dto.sourceEntity,
                                                targetEntity: dto.targetEntity,
                                                mappingRules: dto.mappingRules,
                                                isActive: dto.isActive !== false,
                                            },
                                        })];
                                    case 1:
                                        template = _a.sent();
                                        if (!this.audit) return [3 /*break*/, 3];
                                        return [4 /*yield*/, this.audit.logEvent({
                                                companyId: companyId,
                                                userId: userId,
                                                entity: 'DataMappingTemplate',
                                                entityId: template.id,
                                                action: 'CREATE_MAPPING_TEMPLATE',
                                                details: {
                                                    name: dto.name,
                                                    source: dto.sourceEntity,
                                                    target: dto.targetEntity,
                                                },
                                            })];
                                    case 2:
                                        _a.sent();
                                        _a.label = 3;
                                    case 3: return [2 /*return*/, template];
                                }
                            });
                        }); })];
                });
            });
        };
        DataMappingService_1.prototype.getTemplates = function (companyId) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                return [2 /*return*/, tx.dataMappingTemplate.findMany({
                                        where: { companyId: companyId },
                                        orderBy: { createdAt: 'desc' },
                                    })];
                            });
                        }); })];
                });
            });
        };
        DataMappingService_1.prototype.getTemplate = function (companyId, templateId) {
            return __awaiter(this, void 0, void 0, function () {
                var template;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    return [2 /*return*/, tx.dataMappingTemplate.findUnique({
                                            where: { id: templateId },
                                        })];
                                });
                            }); })];
                        case 1:
                            template = _a.sent();
                            if (!template || template.companyId !== companyId) {
                                throw new common_1.NotFoundException('Data mapping template not found');
                            }
                            return [2 /*return*/, template];
                    }
                });
            });
        };
        DataMappingService_1.prototype.previewMapping = function (companyId, templateIdOrName, sampleSourcePayload) {
            return __awaiter(this, void 0, void 0, function () {
                var template, mappingRules, targetPayload, validationWarnings, rulesApplied, rulesSkipped, _i, mappingRules_1, rule, val, lookupKey, lookupVal;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    return [2 /*return*/, tx.dataMappingTemplate.findFirst({
                                            where: {
                                                companyId: companyId,
                                                OR: [{ id: templateIdOrName }, { name: templateIdOrName }],
                                                isActive: true,
                                            },
                                        })];
                                });
                            }); })];
                        case 1:
                            template = _a.sent();
                            if (!template) {
                                throw new common_1.NotFoundException("Mapping template ".concat(templateIdOrName, " not found"));
                            }
                            mappingRules = template.mappingRules;
                            targetPayload = {};
                            validationWarnings = [];
                            rulesApplied = 0;
                            rulesSkipped = 0;
                            for (_i = 0, mappingRules_1 = mappingRules; _i < mappingRules_1.length; _i++) {
                                rule = mappingRules_1[_i];
                                // Check conditional mapping
                                if (rule.condition &&
                                    !this.evaluateCondition(sampleSourcePayload, rule.condition)) {
                                    rulesSkipped++;
                                    continue;
                                }
                                val = rule.sourceField
                                    ? this.getValueFromPath(sampleSourcePayload, rule.sourceField)
                                    : undefined;
                                // Fallback to default value
                                if (val === undefined && rule.defaultValue !== undefined) {
                                    val = rule.defaultValue;
                                }
                                // Apply lookup table mapping
                                if (val !== undefined &&
                                    rule.lookupTable &&
                                    typeof rule.lookupTable === 'object') {
                                    lookupKey = typeof val === 'object' && val !== null
                                        ? JSON.stringify(val)
                                        : "".concat(val);
                                    lookupVal = rule.lookupTable[lookupKey];
                                    if (lookupVal !== undefined) {
                                        val = lookupVal;
                                    }
                                    else {
                                        validationWarnings.push("Value \"".concat(val, "\" for source field \"").concat(rule.sourceField, "\" not found in lookup table"));
                                    }
                                }
                                // Apply transformation functions
                                if (val !== undefined && rule.transformFn) {
                                    val = this.applyTransformation(val, rule.transformFn);
                                }
                                // Set to target path
                                if (val !== undefined) {
                                    this.setValueToPath(targetPayload, rule.targetField, val);
                                    rulesApplied++;
                                }
                                else {
                                    validationWarnings.push("Target field \"".concat(rule.targetField, "\" evaluated to undefined (no source or default value)"));
                                }
                            }
                            return [2 /*return*/, {
                                    templateId: template.id,
                                    templateName: template.name,
                                    sourceEntity: template.sourceEntity,
                                    targetEntity: template.targetEntity,
                                    sampleSourcePayload: sampleSourcePayload,
                                    transformedPayload: targetPayload,
                                    rulesApplied: rulesApplied,
                                    rulesSkipped: rulesSkipped,
                                    validationWarnings: validationWarnings,
                                }];
                    }
                });
            });
        };
        DataMappingService_1.prototype.transformPayload = function (companyId, templateName, sourcePayload) {
            return __awaiter(this, void 0, void 0, function () {
                var res;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.previewMapping(companyId, templateName, sourcePayload)];
                        case 1:
                            res = _a.sent();
                            return [2 /*return*/, res.transformedPayload];
                    }
                });
            });
        };
        DataMappingService_1.prototype.evaluateCondition = function (obj, cond) {
            var _a, _b;
            var val = this.getValueFromPath(obj, cond.ifField);
            switch (cond.ifOperator) {
                case 'EXISTS':
                    return val !== undefined && val !== null;
                case 'EQUALS':
                    return val === cond.ifValue;
                case 'NOT_EQUALS':
                    return val !== cond.ifValue;
                case 'CONTAINS':
                    return String((_a = val) !== null && _a !== void 0 ? _a : '').includes(String((_b = cond.ifValue) !== null && _b !== void 0 ? _b : ''));
                default:
                    return true;
            }
        };
        DataMappingService_1.prototype.getValueFromPath = function (obj, path) {
            if (!path)
                return undefined;
            return path
                .split('.')
                .reduce(function (acc, part) { return (acc && acc[part] !== undefined ? acc[part] : undefined); }, obj);
        };
        DataMappingService_1.prototype.setValueToPath = function (obj, path, value) {
            var parts = path.split('.');
            var current = obj;
            for (var i = 0; i < parts.length - 1; i++) {
                if (!current[parts[i]])
                    current[parts[i]] = {};
                current = current[parts[i]];
            }
            current[parts[parts.length - 1]] = value;
        };
        DataMappingService_1.prototype.applyTransformation = function (value, transformFn) {
            switch (transformFn) {
                case 'UPPERCASE':
                    return String(value).toUpperCase();
                case 'LOWERCASE':
                    return String(value).toLowerCase();
                case 'TO_INT':
                    return parseInt(String(value), 10);
                case 'TO_FLOAT':
                    return parseFloat(String(value));
                case 'ISO_DATE':
                    return new Date(value).toISOString();
                case 'BOOLEAN':
                    return value === 'true' || value === true || value === 1;
                case 'TRIM':
                    return String(value).trim();
                case 'STRINGIFY':
                    return typeof value === 'object' && value !== null
                        ? JSON.stringify(value)
                        : String(value);
                default:
                    return value;
            }
        };
        return DataMappingService_1;
    }());
    __setFunctionName(_classThis, "DataMappingService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        DataMappingService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return DataMappingService = _classThis;
}();
exports.DataMappingService = DataMappingService;
