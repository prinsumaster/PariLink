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
exports.EnterpriseIntegrationHubService = void 0;
var common_1 = require("@nestjs/common");
var EnterpriseIntegrationHubService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var EnterpriseIntegrationHubService = _classThis = /** @class */ (function () {
        function EnterpriseIntegrationHubService_1(prisma, registry, auth, audit) {
            this.prisma = prisma;
            this.registry = registry;
            this.auth = auth;
            this.audit = audit;
            this.logger = new common_1.Logger(EnterpriseIntegrationHubService.name);
        }
        EnterpriseIntegrationHubService_1.prototype.getCatalog = function () {
            return __awaiter(this, void 0, void 0, function () {
                var dbConnectors;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    return [2 /*return*/, tx.integrationConnector.findMany({
                                            where: { status: 'ACTIVE' },
                                            include: { category: true },
                                        })];
                                });
                            }); })];
                        case 1:
                            dbConnectors = _a.sent();
                            return [2 /*return*/, dbConnectors];
                    }
                });
            });
        };
        EnterpriseIntegrationHubService_1.prototype.getInstalledIntegrations = function (companyId) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                return [2 /*return*/, tx.integrationConnection.findMany({
                                        where: { companyId: companyId },
                                        include: {
                                            connector: true,
                                            syncJobs: { take: 5, orderBy: { createdAt: 'desc' } },
                                        },
                                    })];
                            });
                        }); })];
                });
            });
        };
        EnterpriseIntegrationHubService_1.prototype.configureIntegration = function (companyId, userId, dto) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                            var connector, isHealthy, encryptedCredentials, connectorRecord, existing, connection;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        connector = this.registry.getConnector(dto.provider);
                                        if (!connector) {
                                            throw new common_1.BadRequestException("Connector for provider ".concat(dto.provider, " is not available in registry."));
                                        }
                                        if (!connector.validateConfiguration(dto.credentials)) {
                                            throw new common_1.BadRequestException("Invalid configuration credentials for ".concat(dto.provider, ". Required schema check failed."));
                                        }
                                        return [4 /*yield*/, connector.testConnection(dto.credentials)];
                                    case 1:
                                        isHealthy = _a.sent();
                                        if (!isHealthy) {
                                            throw new common_1.BadRequestException("Connection test failed for provider ".concat(dto.provider, ". Please check your credentials."));
                                        }
                                        encryptedCredentials = this.auth.encryptCredentials(dto.credentials);
                                        return [4 /*yield*/, tx.integrationConnector.findUnique({
                                                where: { provider: dto.provider },
                                            })];
                                    case 2:
                                        connectorRecord = _a.sent();
                                        if (!!connectorRecord) return [3 /*break*/, 4];
                                        return [4 /*yield*/, tx.integrationConnector.create({
                                                data: {
                                                    provider: dto.provider,
                                                    version: connector.version,
                                                    authType: connector.authType,
                                                    status: 'ACTIVE',
                                                },
                                            })];
                                    case 3:
                                        connectorRecord = _a.sent();
                                        _a.label = 4;
                                    case 4: return [4 /*yield*/, tx.integrationConnection.findFirst({
                                            where: { companyId: companyId, connectorId: connectorRecord.id },
                                        })];
                                    case 5:
                                        existing = _a.sent();
                                        if (!existing) return [3 /*break*/, 7];
                                        return [4 /*yield*/, tx.integrationConnection.update({
                                                where: { id: existing.id },
                                                data: {
                                                    credentials: encryptedCredentials,
                                                    settings: dto.settings || existing.settings,
                                                    status: dto.isActive !== false ? 'ENABLED' : 'CONFIGURED',
                                                },
                                                include: { connector: true },
                                            })];
                                    case 6:
                                        connection = _a.sent();
                                        return [3 /*break*/, 9];
                                    case 7: return [4 /*yield*/, tx.integrationConnection.create({
                                            data: {
                                                companyId: companyId,
                                                connectorId: connectorRecord.id,
                                                credentials: encryptedCredentials,
                                                settings: dto.settings || {},
                                                status: dto.isActive !== false ? 'ENABLED' : 'CONFIGURED',
                                            },
                                            include: { connector: true },
                                        })];
                                    case 8:
                                        connection = _a.sent();
                                        _a.label = 9;
                                    case 9: return [4 /*yield*/, this.audit.logEvent({
                                            companyId: companyId,
                                            userId: userId,
                                            entity: 'IntegrationConnection',
                                            entityId: connection.id,
                                            action: existing ? 'UPDATE_CONNECTION' : 'CREATE_CONNECTION',
                                            details: { provider: dto.provider, status: connection.status },
                                        })];
                                    case 10:
                                        _a.sent();
                                        return [2 /*return*/, connection];
                                }
                            });
                        }); })];
                });
            });
        };
        EnterpriseIntegrationHubService_1.prototype.enableIntegration = function (companyId, connectionId, userId) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                            var conn;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, tx.integrationConnection.update({
                                            where: { id: connectionId },
                                            data: { status: 'ENABLED' },
                                        })];
                                    case 1:
                                        conn = _a.sent();
                                        return [4 /*yield*/, this.audit.logEvent({
                                                companyId: companyId,
                                                userId: userId,
                                                entity: 'IntegrationConnection',
                                                entityId: connectionId,
                                                action: 'ENABLE_INTEGRATION',
                                                details: { status: 'ENABLED' },
                                            })];
                                    case 2:
                                        _a.sent();
                                        return [2 /*return*/, conn];
                                }
                            });
                        }); })];
                });
            });
        };
        EnterpriseIntegrationHubService_1.prototype.disableIntegration = function (companyId, connectionId, userId) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                            var conn;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, tx.integrationConnection.update({
                                            where: { id: connectionId },
                                            data: { status: 'DISABLED' },
                                        })];
                                    case 1:
                                        conn = _a.sent();
                                        return [4 /*yield*/, this.audit.logEvent({
                                                companyId: companyId,
                                                userId: userId,
                                                entity: 'IntegrationConnection',
                                                entityId: connectionId,
                                                action: 'DISABLE_INTEGRATION',
                                                details: { status: 'DISABLED' },
                                            })];
                                    case 2:
                                        _a.sent();
                                        return [2 /*return*/, conn];
                                }
                            });
                        }); })];
                });
            });
        };
        EnterpriseIntegrationHubService_1.prototype.updateVersion = function (companyId, connectionId, version, userId) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                            var conn;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, tx.integrationConnection.findUnique({
                                            where: { id: connectionId },
                                            include: { connector: true },
                                        })];
                                    case 1:
                                        conn = _a.sent();
                                        if (!conn)
                                            throw new common_1.NotFoundException('Connection not found');
                                        return [4 /*yield*/, tx.integrationConnector.update({
                                                where: { id: conn.connectorId },
                                                data: { version: version },
                                            })];
                                    case 2:
                                        _a.sent();
                                        return [4 /*yield*/, this.audit.logEvent({
                                                companyId: companyId,
                                                userId: userId,
                                                entity: 'IntegrationConnection',
                                                entityId: connectionId,
                                                action: 'UPGRADE_VERSION',
                                                details: { oldVersion: conn.connector.version, newVersion: version },
                                            })];
                                    case 3:
                                        _a.sent();
                                        return [2 /*return*/, __assign(__assign({}, conn), { version: version })];
                                }
                            });
                        }); })];
                });
            });
        };
        EnterpriseIntegrationHubService_1.prototype.checkHealth = function (companyId, connectionId) {
            return __awaiter(this, void 0, void 0, function () {
                var conn, connector, start, credentials, isHealthy, latencyMs, e_1;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    return [2 /*return*/, tx.integrationConnection.findUnique({
                                            where: { id: connectionId, companyId: companyId },
                                            include: { connector: true },
                                        })];
                                });
                            }); })];
                        case 1:
                            conn = _a.sent();
                            if (!conn)
                                throw new common_1.NotFoundException('Connection not found');
                            connector = this.registry.getConnector(conn.connector.provider);
                            if (!connector) {
                                return [2 /*return*/, {
                                        status: 'UNHEALTHY',
                                        error: 'Connector class not loaded',
                                        latencyMs: 0,
                                        lastChecked: new Date(),
                                    }];
                            }
                            start = Date.now();
                            _a.label = 2;
                        case 2:
                            _a.trys.push([2, 4, , 5]);
                            credentials = this.auth.decryptCredentials(conn.credentials);
                            return [4 /*yield*/, connector.healthCheck(credentials)];
                        case 3:
                            isHealthy = _a.sent();
                            latencyMs = Date.now() - start;
                            if (!isHealthy) {
                                return [2 /*return*/, { status: 'UNHEALTHY', latencyMs: latencyMs, lastChecked: new Date() }];
                            }
                            return [2 /*return*/, { status: 'HEALTHY', latencyMs: latencyMs, lastChecked: new Date() }];
                        case 4:
                            e_1 = _a.sent();
                            return [2 /*return*/, {
                                    status: 'UNHEALTHY',
                                    error: e_1.message,
                                    latencyMs: Date.now() - start,
                                    lastChecked: new Date(),
                                }];
                        case 5: return [2 /*return*/];
                    }
                });
            });
        };
        return EnterpriseIntegrationHubService_1;
    }());
    __setFunctionName(_classThis, "EnterpriseIntegrationHubService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        EnterpriseIntegrationHubService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return EnterpriseIntegrationHubService = _classThis;
}();
exports.EnterpriseIntegrationHubService = EnterpriseIntegrationHubService;
