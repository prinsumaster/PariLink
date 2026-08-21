"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
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
exports.DataQualityEngineService = void 0;
var common_1 = require("@nestjs/common");
var client_1 = require("@prisma/client");
var DataQualityEngineService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var DataQualityEngineService = _classThis = /** @class */ (function () {
        function DataQualityEngineService_1(prisma) {
            this.prisma = prisma;
            this.logger = new common_1.Logger(DataQualityEngineService.name);
        }
        /**
         * Evaluate data quality for a master record payload.
         * Checks completeness, validity (PAN/GST formats), and looks for potential duplicates.
         */
        DataQualityEngineService_1.prototype.evaluateQuality = function (companyId, entityType, data) {
            return __awaiter(this, void 0, void 0, function () {
                var flags, duplicates, score, requiredFields, _i, requiredFields_1, field, duplicateIds;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            flags = [];
                            duplicates = [];
                            score = 100;
                            requiredFields = this.getRequiredFields(entityType);
                            for (_i = 0, requiredFields_1 = requiredFields; _i < requiredFields_1.length; _i++) {
                                field = requiredFields_1[_i];
                                if (!data[field]) {
                                    flags.push("Missing required field: ".concat(field));
                                    score -= 10;
                                }
                            }
                            // 2. Format Validation
                            if (data.pan && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(data.pan)) {
                                flags.push('Invalid PAN format');
                                score -= 15;
                            }
                            if (data.gstin &&
                                !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(data.gstin)) {
                                flags.push('Invalid GSTIN format');
                                score -= 15;
                            }
                            if (data.email &&
                                !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
                                flags.push('Invalid email format');
                                score -= 10;
                            }
                            return [4 /*yield*/, this.findPotentialDuplicates(companyId, entityType, data)];
                        case 1:
                            duplicateIds = _a.sent();
                            if (duplicateIds.length > 0) {
                                flags.push("Found ".concat(duplicateIds.length, " potential duplicates"));
                                score -= 20;
                                duplicates.push.apply(duplicates, duplicateIds);
                            }
                            return [2 /*return*/, {
                                    score: Math.max(0, score),
                                    flags: flags,
                                    duplicates: duplicates,
                                }];
                    }
                });
            });
        };
        /** Run a bulk quality evaluation across all active master records for a tenant */
        DataQualityEngineService_1.prototype.reevaluateTenant = function (companyId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    this.logger.log("Starting bulk MDM quality re-evaluation for tenant ".concat(companyId));
                    return [2 /*return*/];
                });
            });
        };
        DataQualityEngineService_1.prototype.getRequiredFields = function (entityType) {
            switch (entityType) {
                case 'CUSTOMER':
                    return ['name', 'phone'];
                case 'VENDOR':
                    return ['name', 'type'];
                case 'DRIVER':
                    return ['firstName', 'lastName', 'licenseNumber'];
                case 'VEHICLE':
                    return ['licensePlate', 'type'];
                default:
                    return [];
            }
        };
        DataQualityEngineService_1.prototype.findPotentialDuplicates = function (companyId, entityType, data) {
            return __awaiter(this, void 0, void 0, function () {
                var orConditions, conditions, orClause_1, records, err_1, errorMessage;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            orConditions = [];
                            // Exact match keys
                            if (data.pan)
                                orConditions.push({ path: ['pan'], equals: data.pan });
                            if (data.gstin)
                                orConditions.push({ path: ['gstin'], equals: data.gstin });
                            if (data.phone)
                                orConditions.push({ path: ['phone'], equals: data.phone });
                            if (data.email)
                                orConditions.push({ path: ['email'], equals: data.email });
                            if (data.licensePlate)
                                orConditions.push({ path: ['licensePlate'], equals: data.licensePlate });
                            if (data.licenseNumber)
                                orConditions.push({
                                    path: ['licenseNumber'],
                                    equals: data.licenseNumber,
                                });
                            if (orConditions.length === 0)
                                return [2 /*return*/, []];
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            conditions = orConditions.map(function (c) { return client_1.Prisma.sql(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\"masterData\"->>", " = ", ""], ["\"masterData\"->>", " = ", ""])), c.path[0], c.equals); });
                            orClause_1 = client_1.Prisma.join(conditions, ' OR ');
                            return [4 /*yield*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.$queryRaw(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n          SELECT id \n          FROM \"MasterRecord\" \n          WHERE \"companyId\" = ", " \n            AND \"entityType\" = ", " \n            AND \"isGolden\" = true \n            AND (", ") \n          LIMIT 5\n        "], ["\n          SELECT id \n          FROM \"MasterRecord\" \n          WHERE \"companyId\" = ", " \n            AND \"entityType\" = ", " \n            AND \"isGolden\" = true \n            AND (", ") \n          LIMIT 5\n        "])), companyId, entityType, orClause_1)];
                                    });
                                }); })];
                        case 2:
                            records = _a.sent();
                            return [2 /*return*/, records.map(function (r) { return r.id; })];
                        case 3:
                            err_1 = _a.sent();
                            errorMessage = err_1 instanceof Error ? err_1.message : String(err_1);
                            this.logger.error("Duplicate check failed: ".concat(errorMessage));
                            return [2 /*return*/, []];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        return DataQualityEngineService_1;
    }());
    __setFunctionName(_classThis, "DataQualityEngineService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        DataQualityEngineService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return DataQualityEngineService = _classThis;
}();
exports.DataQualityEngineService = DataQualityEngineService;
var templateObject_1, templateObject_2;
