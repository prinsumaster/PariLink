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
exports.GoldenRecordEngineService = void 0;
var common_1 = require("@nestjs/common");
var uuid_1 = require("uuid");
var GoldenRecordEngineService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var GoldenRecordEngineService = _classThis = /** @class */ (function () {
        function GoldenRecordEngineService_1(prisma, events, audit) {
            this.prisma = prisma;
            this.events = events;
            this.audit = audit;
            this.logger = new common_1.Logger(GoldenRecordEngineService.name);
        }
        /** Create a new Golden Record for an entity */
        GoldenRecordEngineService_1.prototype.createGoldenRecord = function (companyId, entityType, masterData, sourceSystem, userId) {
            return __awaiter(this, void 0, void 0, function () {
                var globalId, record;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            globalId = "MDM-".concat(entityType, "-").concat((0, uuid_1.v4)());
                            return [4 /*yield*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.masterRecord.create({
                                                data: {
                                                    companyId: companyId,
                                                    entityType: entityType,
                                                    globalId: globalId,
                                                    isGolden: true,
                                                    confidenceScore: 1.0,
                                                    status: 'ACTIVE',
                                                    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
                                                    masterData: masterData,
                                                    externalRefs: {
                                                        create: {
                                                            sourceSystem: sourceSystem,
                                                            externalId: masterData.id || globalId,
                                                            priority: 100,
                                                            // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
                                                            rawData: masterData,
                                                        },
                                                    },
                                                    changeHistory: {
                                                        create: {
                                                            userId: userId,
                                                            sourceSystem: sourceSystem,
                                                            action: 'CREATE',
                                                            // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
                                                            changes: masterData,
                                                        },
                                                    },
                                                    dataQuality: {
                                                        create: {
                                                            overallScore: 100,
                                                            completeness: 100,
                                                            accuracy: 100,
                                                            uniqueness: 100,
                                                            consistency: 100,
                                                        },
                                                    },
                                                },
                                            })];
                                    });
                                }); })];
                        case 1:
                            record = _a.sent();
                            this.events.publish("mdm.".concat(entityType.toLowerCase(), ".created"), {
                                tenantId: companyId,
                                payload: {
                                    masterRecordId: record.id,
                                    globalId: globalId,
                                    data: masterData,
                                },
                            });
                            return [2 /*return*/, record];
                    }
                });
            });
        };
        /** Merge a duplicate record into a primary Golden Record */
        GoldenRecordEngineService_1.prototype.mergeRecords = function (companyId, primaryId, duplicateId, survivorshipRules, userId) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    if (primaryId === duplicateId) {
                        throw new common_1.ConflictException('Cannot merge a record into itself');
                    }
                    return [2 /*return*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                            var primary, duplicate, mergedData, updatedPrimary;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, tx.masterRecord.findUnique({
                                            where: { id: primaryId },
                                        })];
                                    case 1:
                                        primary = _a.sent();
                                        return [4 /*yield*/, tx.masterRecord.findUnique({
                                                where: { id: duplicateId },
                                            })];
                                    case 2:
                                        duplicate = _a.sent();
                                        if (!primary || !duplicate) {
                                            throw new common_1.NotFoundException('Master records not found');
                                        }
                                        if (primary.entityType !== duplicate.entityType) {
                                            throw new common_1.ConflictException('Cannot merge records of different entity types');
                                        }
                                        mergedData = this.applySurvivorship(primary.masterData, duplicate.masterData, survivorshipRules);
                                        return [4 /*yield*/, tx.masterRecord.update({
                                                where: { id: primaryId },
                                                data: {
                                                    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
                                                    masterData: mergedData,
                                                    changeHistory: {
                                                        create: {
                                                            userId: userId,
                                                            action: 'MERGE',
                                                            changes: {
                                                                mergedFrom: duplicateId,
                                                                priorData: primary.masterData,
                                                                // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
                                                                newData: mergedData,
                                                            },
                                                        },
                                                    },
                                                },
                                            })];
                                    case 3:
                                        updatedPrimary = _a.sent();
                                        // 3. Mark Duplicate as MERGED
                                        return [4 /*yield*/, tx.masterRecord.update({
                                                where: { id: duplicateId },
                                                data: {
                                                    isGolden: false,
                                                    status: 'MERGED',
                                                    mergedIntoId: primaryId,
                                                    changeHistory: {
                                                        create: {
                                                            userId: userId,
                                                            action: 'MERGED_INTO',
                                                            changes: { mergedInto: primaryId },
                                                        },
                                                    },
                                                },
                                            })];
                                    case 4:
                                        // 3. Mark Duplicate as MERGED
                                        _a.sent();
                                        // 4. Re-parent external references
                                        return [4 /*yield*/, tx.externalReference.updateMany({
                                                where: { masterRecordId: duplicateId },
                                                data: { masterRecordId: primaryId },
                                            })];
                                    case 5:
                                        // 4. Re-parent external references
                                        _a.sent();
                                        this.events.publish("mdm.".concat(primary.entityType.toLowerCase(), ".merged"), {
                                            tenantId: companyId,
                                            payload: {
                                                primaryId: primaryId,
                                                duplicateId: duplicateId,
                                                mergedData: mergedData,
                                            },
                                        });
                                        this.audit.logEvent({
                                            action: 'MDM_RECORD_MERGED',
                                            entity: 'MasterRecord',
                                            entityId: primaryId,
                                            companyId: companyId,
                                            userId: userId,
                                            details: { duplicateId: duplicateId, entityType: primary.entityType },
                                        });
                                        return [2 /*return*/, updatedPrimary];
                                }
                            });
                        }); })];
                });
            });
        };
        GoldenRecordEngineService_1.prototype.applySurvivorship = function (primary, duplicate, rules) {
            var merged = __assign({}, primary);
            for (var _i = 0, rules_1 = rules; _i < rules_1.length; _i++) {
                var rule = rules_1[_i];
                if (rule.strategy === 'LATEST') {
                    // Fallback: assume primary is latest for now unless metadata exists
                    merged[rule.field] = duplicate[rule.field] || primary[rule.field];
                }
                else if (rule.strategy === 'MANUAL' && duplicate[rule.field]) {
                    merged[rule.field] = duplicate[rule.field]; // In manual mode, we explicitly provide rules to override
                }
                // Expand strategies in V2 (TRUSTED_SOURCE, etc)
            }
            return merged;
        };
        return GoldenRecordEngineService_1;
    }());
    __setFunctionName(_classThis, "GoldenRecordEngineService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        GoldenRecordEngineService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return GoldenRecordEngineService = _classThis;
}();
exports.GoldenRecordEngineService = GoldenRecordEngineService;
