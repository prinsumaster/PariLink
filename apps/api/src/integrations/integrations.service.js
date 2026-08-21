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
exports.IntegrationsService = void 0;
var common_1 = require("@nestjs/common");
var SapAdapter = /** @class */ (function () {
    function SapAdapter() {
    }
    SapAdapter.prototype.syncEntity = function (entityType, entityData, config) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // Mock SAP OData call
                return [2 /*return*/, true];
            });
        });
    };
    SapAdapter.prototype.checkHealth = function (config) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, true];
            });
        });
    };
    return SapAdapter;
}());
var OracleAdapter = /** @class */ (function () {
    function OracleAdapter() {
    }
    OracleAdapter.prototype.syncEntity = function (entityType, entityData, config) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // Mock Oracle ERP Cloud call
                return [2 /*return*/, true];
            });
        });
    };
    OracleAdapter.prototype.checkHealth = function (config) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, true];
            });
        });
    };
    return OracleAdapter;
}());
var DynamicsAdapter = /** @class */ (function () {
    function DynamicsAdapter() {
    }
    DynamicsAdapter.prototype.syncEntity = function (entityType, entityData, config) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // Mock Dynamics 365 Dataverse call
                return [2 /*return*/, true];
            });
        });
    };
    DynamicsAdapter.prototype.checkHealth = function (config) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, true];
            });
        });
    };
    return DynamicsAdapter;
}());
var IntegrationsService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var IntegrationsService = _classThis = /** @class */ (function () {
        function IntegrationsService_1(prisma) {
            this.prisma = prisma;
            this.logger = new common_1.Logger(IntegrationsService.name);
            this.adapters = {
                SAP: new SapAdapter(),
                ORACLE: new OracleAdapter(),
                DYNAMICS: new DynamicsAdapter(),
            };
        }
        IntegrationsService_1.prototype.configureIntegration = function (companyId, dto) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                            var existing;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, tx.integrationConfig.findFirst({
                                            where: { provider: dto.provider },
                                        })];
                                    case 1:
                                        existing = _a.sent();
                                        if (existing) {
                                            return [2 /*return*/, tx.integrationConfig.update({
                                                    where: { id: existing.id },
                                                    data: {
                                                        credentials: dto.credentials,
                                                        settings: (dto.settings || existing.settings),
                                                        isActive: dto.isActive,
                                                    },
                                                })];
                                        }
                                        return [2 /*return*/, tx.integrationConfig.create({
                                                data: {
                                                    companyId: companyId,
                                                    provider: dto.provider,
                                                    credentials: dto.credentials,
                                                    settings: dto.settings || {},
                                                    isActive: dto.isActive,
                                                },
                                            })];
                                }
                            });
                        }); })];
                });
            });
        };
        IntegrationsService_1.prototype.syncEntity = function (companyId, dto) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                            var activeIntegrations, entityData, results;
                            var _this = this;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, tx.integrationConfig.findMany({
                                            where: { isActive: true },
                                        })];
                                    case 1:
                                        activeIntegrations = _a.sent();
                                        if (activeIntegrations.length === 0) {
                                            throw new common_1.BadRequestException('No active integrations found');
                                        }
                                        entityData = null;
                                        if (!(dto.entityType === 'INVOICE')) return [3 /*break*/, 3];
                                        return [4 /*yield*/, tx.invoice.findUnique({
                                                where: { id: dto.entityId },
                                            })];
                                    case 2:
                                        entityData = _a.sent();
                                        return [3 /*break*/, 5];
                                    case 3:
                                        if (!(dto.entityType === 'TRIP')) return [3 /*break*/, 5];
                                        return [4 /*yield*/, tx.trip.findUnique({ where: { id: dto.entityId } })];
                                    case 4:
                                        entityData = _a.sent();
                                        _a.label = 5;
                                    case 5:
                                        if (!entityData) {
                                            throw new common_1.BadRequestException("Entity ".concat(dto.entityType, " with ID ").concat(dto.entityId, " not found"));
                                        }
                                        return [4 /*yield*/, Promise.all(activeIntegrations.map(function (config) { return __awaiter(_this, void 0, void 0, function () {
                                                var adapter, success, error_1;
                                                return __generator(this, function (_a) {
                                                    switch (_a.label) {
                                                        case 0:
                                                            adapter = this.adapters[config.provider.toUpperCase()];
                                                            if (!adapter) {
                                                                this.logger.warn("No adapter found for provider ".concat(config.provider));
                                                                return [2 /*return*/, {
                                                                        provider: config.provider,
                                                                        success: false,
                                                                        error: 'Adapter missing',
                                                                    }];
                                                            }
                                                            _a.label = 1;
                                                        case 1:
                                                            _a.trys.push([1, 3, , 4]);
                                                            return [4 /*yield*/, adapter.syncEntity(dto.entityType, entityData, config)];
                                                        case 2:
                                                            success = _a.sent();
                                                            return [2 /*return*/, { provider: config.provider, success: success }];
                                                        case 3:
                                                            error_1 = _a.sent();
                                                            this.logger.error("Sync failed for provider ".concat(config.provider, ": ").concat(error_1.message), error_1.stack);
                                                            return [2 /*return*/, {
                                                                    provider: config.provider,
                                                                    success: false,
                                                                    error: error_1.message,
                                                                }];
                                                        case 4: return [2 /*return*/];
                                                    }
                                                });
                                            }); }))];
                                    case 6:
                                        results = _a.sent();
                                        return [2 /*return*/, { results: results }];
                                }
                            });
                        }); })];
                });
            });
        };
        IntegrationsService_1.prototype.getIntegrations = function (companyId) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                return [2 /*return*/, tx.integrationConfig.findMany({
                                        select: {
                                            id: true,
                                            provider: true,
                                            isActive: true,
                                            createdAt: true,
                                        },
                                    })];
                            });
                        }); })];
                });
            });
        };
        return IntegrationsService_1;
    }());
    __setFunctionName(_classThis, "IntegrationsService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        IntegrationsService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return IntegrationsService = _classThis;
}();
exports.IntegrationsService = IntegrationsService;
