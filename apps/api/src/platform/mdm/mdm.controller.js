"use strict";
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
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
exports.MdmController = void 0;
var common_1 = require("@nestjs/common");
var jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
var permissions_guard_1 = require("../../auth/guards/permissions.guard");
var permissions_decorator_1 = require("../../auth/decorators/permissions.decorator");
var MdmController = function () {
    var _classDecorators = [(0, common_1.Controller)('mdm'), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard)];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _createGoldenRecord_decorators;
    var _mergeRecords_decorators;
    var _evaluateQuality_decorators;
    var _resolveIdentity_decorators;
    var _getReferenceData_decorators;
    var _upsertReferenceData_decorators;
    var _searchMasterRecords_decorators;
    var MdmController = _classThis = /** @class */ (function () {
        function MdmController_1(goldenEngine, dqEngine, identityMap, refData, searchService) {
            this.goldenEngine = (__runInitializers(this, _instanceExtraInitializers), goldenEngine);
            this.dqEngine = dqEngine;
            this.identityMap = identityMap;
            this.refData = refData;
            this.searchService = searchService;
        }
        // ── 1. Golden Record APIs ────────────────────────────────────────────────
        MdmController_1.prototype.createGoldenRecord = function (user, entityType, payload) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.goldenEngine.createGoldenRecord(user.companyId, entityType, payload.masterData, payload.sourceSystem || 'API_MANUAL', user.userId)];
                });
            });
        };
        MdmController_1.prototype.mergeRecords = function (user, payload) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.goldenEngine.mergeRecords(user.companyId, payload.primaryId, payload.duplicateId, payload.survivorshipRules || [], user.userId)];
                });
            });
        };
        // ── 2. Data Quality APIs ─────────────────────────────────────────────────
        MdmController_1.prototype.evaluateQuality = function (user, entityType, payload) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.dqEngine.evaluateQuality(user.companyId, entityType, payload)];
                });
            });
        };
        // ── 3. External Identity APIs ────────────────────────────────────────────
        MdmController_1.prototype.resolveIdentity = function (sourceSystem, externalId) {
            return __awaiter(this, void 0, void 0, function () {
                var goldenId;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.identityMap.resolveToGoldenId(sourceSystem, externalId)];
                        case 1:
                            goldenId = _a.sent();
                            return [2 /*return*/, { goldenId: goldenId }];
                    }
                });
            });
        };
        // ── 4. Reference Data APIs (Public read, admin write) ───────────────────
        MdmController_1.prototype.getReferenceData = function (domain) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.refData.getReferenceData(domain)];
                });
            });
        };
        MdmController_1.prototype.upsertReferenceData = function (domain, payload) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.refData.upsertReferenceData(domain, payload.code, payload.name, payload.attributes)];
                });
            });
        };
        // ── 5. Enterprise Search APIs ────────────────────────────────────────────
        MdmController_1.prototype.searchMasterRecords = function (user, query, entityType, limit) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.searchService.searchMasterRecords({
                            companyId: user.companyId,
                            query: query,
                            entityType: entityType,
                            limit: limit ? parseInt(limit, 10) : 50,
                        })];
                });
            });
        };
        return MdmController_1;
    }());
    __setFunctionName(_classThis, "MdmController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _createGoldenRecord_decorators = [(0, common_1.Post)('records/:entityType'), (0, permissions_decorator_1.RequirePermissions)('mdm:record:write')];
        _mergeRecords_decorators = [(0, common_1.Post)('records/merge'), (0, permissions_decorator_1.RequirePermissions)('mdm:record:merge')];
        _evaluateQuality_decorators = [(0, common_1.Post)('quality/evaluate/:entityType'), (0, permissions_decorator_1.RequirePermissions)('mdm:quality:read')];
        _resolveIdentity_decorators = [(0, common_1.Get)('identities/:sourceSystem/:externalId'), (0, permissions_decorator_1.RequirePermissions)('mdm:identity:read')];
        _getReferenceData_decorators = [(0, common_1.Get)('reference/:domain')];
        _upsertReferenceData_decorators = [(0, common_1.Post)('reference/:domain'), (0, permissions_decorator_1.RequirePermissions)('mdm:reference:write')];
        _searchMasterRecords_decorators = [(0, common_1.Get)('search'), (0, permissions_decorator_1.RequirePermissions)('mdm:search')];
        __esDecorate(_classThis, null, _createGoldenRecord_decorators, { kind: "method", name: "createGoldenRecord", static: false, private: false, access: { has: function (obj) { return "createGoldenRecord" in obj; }, get: function (obj) { return obj.createGoldenRecord; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _mergeRecords_decorators, { kind: "method", name: "mergeRecords", static: false, private: false, access: { has: function (obj) { return "mergeRecords" in obj; }, get: function (obj) { return obj.mergeRecords; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _evaluateQuality_decorators, { kind: "method", name: "evaluateQuality", static: false, private: false, access: { has: function (obj) { return "evaluateQuality" in obj; }, get: function (obj) { return obj.evaluateQuality; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _resolveIdentity_decorators, { kind: "method", name: "resolveIdentity", static: false, private: false, access: { has: function (obj) { return "resolveIdentity" in obj; }, get: function (obj) { return obj.resolveIdentity; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getReferenceData_decorators, { kind: "method", name: "getReferenceData", static: false, private: false, access: { has: function (obj) { return "getReferenceData" in obj; }, get: function (obj) { return obj.getReferenceData; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _upsertReferenceData_decorators, { kind: "method", name: "upsertReferenceData", static: false, private: false, access: { has: function (obj) { return "upsertReferenceData" in obj; }, get: function (obj) { return obj.upsertReferenceData; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _searchMasterRecords_decorators, { kind: "method", name: "searchMasterRecords", static: false, private: false, access: { has: function (obj) { return "searchMasterRecords" in obj; }, get: function (obj) { return obj.searchMasterRecords; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        MdmController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return MdmController = _classThis;
}();
exports.MdmController = MdmController;
