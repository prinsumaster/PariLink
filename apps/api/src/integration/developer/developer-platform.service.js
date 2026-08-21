"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
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
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeveloperPlatformService = void 0;
var common_1 = require("@nestjs/common");
var crypto = __importStar(require("crypto"));
var bcrypt = __importStar(require("bcrypt"));
var axios_1 = __importDefault(require("axios"));
var ssrf_protector_util_1 = require("../../platform/security/ssrf-protector.util");
var DeveloperPlatformService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var DeveloperPlatformService = _classThis = /** @class */ (function () {
        function DeveloperPlatformService_1(prisma, audit) {
            this.prisma = prisma;
            this.audit = audit;
            this.logger = new common_1.Logger(DeveloperPlatformService.name);
        }
        DeveloperPlatformService_1.prototype.getOpenApiSchema = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, {
                            openapi: '3.0.3',
                            info: {
                                title: 'PariLink Enterprise Integration Hub & Developer Platform API',
                                version: '1.0.0',
                                description: 'Enterprise REST API specification for logistics, telematics, ERP synchronization, and webhook events.',
                            },
                            servers: [
                                {
                                    url: 'https://api.parilink.enterprise.io/v1',
                                    description: 'Production API Gateway',
                                },
                                {
                                    url: 'https://sandbox.api.parilink.enterprise.io/v1',
                                    description: 'Developer Sandbox Environment',
                                },
                            ],
                            tags: [
                                {
                                    name: 'Enterprise Integration Hub',
                                    description: 'Catalog and connection management',
                                },
                                {
                                    name: 'Webhook Platform',
                                    description: 'Incoming/outgoing webhook delivery logs and replay',
                                },
                                {
                                    name: 'Enterprise Event Bus',
                                    description: 'Domain event publishing and stream sourcing',
                                },
                                {
                                    name: 'Data Mapping Engine',
                                    description: 'Visual payload transformation and schema rules',
                                },
                                {
                                    name: 'Synchronization Scheduler',
                                    description: 'Cron scheduling and manual sync triggers',
                                },
                                {
                                    name: 'Import & Export Console',
                                    description: 'Bulk data ingestion and formatted export',
                                },
                            ],
                            paths: {
                                '/integration/hub/catalog': {
                                    get: {
                                        summary: 'List all available enterprise connectors and integrations',
                                        tags: ['Enterprise Integration Hub'],
                                    },
                                },
                                '/integration/webhook/deliveries': {
                                    get: {
                                        summary: 'Query webhook delivery logs',
                                        tags: ['Webhook Platform'],
                                    },
                                },
                                '/integration/events/publish': {
                                    post: {
                                        summary: 'Publish structured domain event',
                                        tags: ['Enterprise Event Bus'],
                                    },
                                },
                                '/integration/sync/trigger': {
                                    post: {
                                        summary: 'Trigger manual sync execution',
                                        tags: ['Synchronization Scheduler'],
                                    },
                                },
                            },
                            components: {
                                securitySchemes: {
                                    bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
                                    apiKeyAuth: { type: 'apiKey', in: 'header', name: 'x-api-key' },
                                },
                            },
                        }];
                });
            });
        };
        DeveloperPlatformService_1.prototype.listApiVersions = function () {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                return [2 /*return*/, tx.apiVersion.findMany({
                                        orderBy: { releaseDate: 'desc' },
                                    })];
                            });
                        }); })];
                });
            });
        };
        DeveloperPlatformService_1.prototype.createOAuthClient = function (companyId, userId, dto) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    if (!dto.name || !Array.isArray(dto.redirectUris)) {
                        throw new common_1.BadRequestException('name and redirectUris array are required');
                    }
                    return [2 /*return*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                            var clientId, clientSecretRaw, clientSecretHash, client;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        clientId = "pl_client_".concat(crypto.randomBytes(16).toString('hex'));
                                        clientSecretRaw = "pl_sec_".concat(crypto.randomBytes(24).toString('hex'));
                                        return [4 /*yield*/, bcrypt.hash(clientSecretRaw, 10)];
                                    case 1:
                                        clientSecretHash = _a.sent();
                                        return [4 /*yield*/, tx.oAuthClient.create({
                                                data: {
                                                    companyId: companyId,
                                                    name: dto.name,
                                                    clientId: clientId,
                                                    clientSecret: clientSecretHash,
                                                    redirectUris: dto.redirectUris,
                                                    grantTypes: [
                                                        'authorization_code',
                                                        'refresh_token',
                                                        'client_credentials',
                                                    ],
                                                },
                                            })];
                                    case 2:
                                        client = _a.sent();
                                        return [4 /*yield*/, this.audit.logEvent({
                                                companyId: companyId,
                                                userId: userId,
                                                entity: 'OAuthClient',
                                                entityId: client.id,
                                                action: 'CREATE_OAUTH_CLIENT',
                                                details: { name: dto.name, clientId: clientId },
                                            })];
                                    case 3:
                                        _a.sent();
                                        return [2 /*return*/, {
                                                id: client.id,
                                                name: client.name,
                                                clientId: clientId,
                                                clientSecret: clientSecretRaw, // ONLY RETURNED ONCE
                                                redirectUris: client.redirectUris,
                                                grantTypes: client.grantTypes,
                                            }];
                                }
                            });
                        }); })];
                });
            });
        };
        DeveloperPlatformService_1.prototype.listOAuthClients = function (companyId) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                return [2 /*return*/, tx.oAuthClient.findMany({
                                        where: { companyId: companyId },
                                        select: {
                                            id: true,
                                            name: true,
                                            clientId: true,
                                            redirectUris: true,
                                            grantTypes: true,
                                            createdAt: true,
                                        },
                                    })];
                            });
                        }); })];
                });
            });
        };
        DeveloperPlatformService_1.prototype.revokeOAuthClient = function (companyId, id, userId) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                            var client;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, tx.oAuthClient.findFirst({
                                            where: { id: id, companyId: companyId },
                                        })];
                                    case 1:
                                        client = _a.sent();
                                        if (!client) {
                                            throw new common_1.NotFoundException('OAuth client not found');
                                        }
                                        return [4 /*yield*/, tx.oAuthClient.deleteMany({ where: { id: id, companyId: companyId } })];
                                    case 2:
                                        _a.sent();
                                        return [4 /*yield*/, this.audit.logEvent({
                                                companyId: companyId,
                                                userId: userId,
                                                entity: 'OAuthClient',
                                                entityId: id,
                                                action: 'REVOKE_OAUTH_CLIENT',
                                                details: { clientId: client.clientId },
                                            })];
                                    case 3:
                                        _a.sent();
                                        return [2 /*return*/, { success: true, id: id }];
                                }
                            });
                        }); })];
                });
            });
        };
        DeveloperPlatformService_1.prototype.getApiUsageAnalytics = function (companyId) {
            return __awaiter(this, void 0, void 0, function () {
                var _a, totalKeys, activeWebhooks, syncJobs24h, failedSyncs24h;
                var _this = this;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, Promise.all([
                                this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                    return [2 /*return*/, tx.apiKey.count({ where: { companyId: companyId, isActive: true } })];
                                }); }); }),
                                this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                    return [2 /*return*/, tx.webhookEndpoint.count({ where: { companyId: companyId, isActive: true } })];
                                }); }); }),
                                this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.syncJob.count({
                                                where: {
                                                    companyId: companyId,
                                                    createdAt: { gte: new Date(Date.now() - 86400000) },
                                                },
                                            })];
                                    });
                                }); }),
                                this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.syncJob.count({
                                                where: {
                                                    companyId: companyId,
                                                    status: 'FAILED',
                                                    createdAt: { gte: new Date(Date.now() - 86400000) },
                                                },
                                            })];
                                    });
                                }); }),
                            ])];
                        case 1:
                            _a = _b.sent(), totalKeys = _a[0], activeWebhooks = _a[1], syncJobs24h = _a[2], failedSyncs24h = _a[3];
                            return [2 /*return*/, {
                                    quotaLimitRpm: 1000,
                                    currentUsageRpm: Math.floor(Math.random() * 150) + 50,
                                    throttleStatus: 'NORMAL',
                                    activeApiKeys: totalKeys,
                                    activeWebhooks: activeWebhooks,
                                    syncJobs24h: syncJobs24h,
                                    failedSyncs24h: failedSyncs24h,
                                    errorRate24h: syncJobs24h > 0
                                        ? ((failedSyncs24h / syncJobs24h) * 100).toFixed(2) + '%'
                                        : '0.00%',
                                }];
                    }
                });
            });
        };
        DeveloperPlatformService_1.prototype.rotateApiKey = function (companyId, keyId, userId) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                            var existing, rawKey, keyHash, updated;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, tx.apiKey.findUnique({ where: { id: keyId } })];
                                    case 1:
                                        existing = _a.sent();
                                        if (!existing || existing.companyId !== companyId) {
                                            throw new common_1.NotFoundException('API key not found');
                                        }
                                        rawKey = "pk_live_".concat(crypto.randomBytes(24).toString('hex'));
                                        return [4 /*yield*/, bcrypt.hash(rawKey, 10)];
                                    case 2:
                                        keyHash = _a.sent();
                                        return [4 /*yield*/, tx.apiKey.update({
                                                where: { id: keyId },
                                                data: {
                                                    keyHash: keyHash,
                                                    lastUsed: null,
                                                },
                                            })];
                                    case 3:
                                        updated = _a.sent();
                                        return [4 /*yield*/, this.audit.logEvent({
                                                companyId: companyId,
                                                userId: userId,
                                                entity: 'ApiKey',
                                                entityId: keyId,
                                                action: 'ROTATE_API_KEY',
                                                details: { name: existing.name },
                                            })];
                                    case 4:
                                        _a.sent();
                                        return [2 /*return*/, {
                                                id: updated.id,
                                                name: updated.name,
                                                scopes: updated.scopes,
                                                rawKey: rawKey, // ONLY RETURNED ONCE
                                                rotatedAt: new Date(),
                                            }];
                                }
                            });
                        }); })];
                });
            });
        };
        DeveloperPlatformService_1.prototype.testWebhookSandbox = function (companyId, dto) {
            return __awaiter(this, void 0, void 0, function () {
                var start, secret, payload, signature, res, err_1;
                var _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            if (!dto.url || !dto.eventType) {
                                throw new common_1.BadRequestException('url and eventType are required');
                            }
                            start = Date.now();
                            secret = dto.secret || 'REMOVED_PLACEHOLDER_WHSEC';
                            payload = {
                                eventId: crypto.randomUUID(),
                                eventType: dto.eventType,
                                timestamp: new Date().toISOString(),
                                companyId: companyId,
                                isSandboxTest: true,
                                data: dto.sampleData || { sample: true },
                            };
                            signature = crypto
                                .createHmac('sha256', secret)
                                .update(JSON.stringify(payload))
                                .digest('hex');
                            return [4 /*yield*/, (0, ssrf_protector_util_1.validateSsrfSafeUrl)(dto.url)];
                        case 1:
                            if (!(_c.sent())) {
                                throw new common_1.BadRequestException('Invalid or restricted webhook URL (SSRF prevention).');
                            }
                            _c.label = 2;
                        case 2:
                            _c.trys.push([2, 4, , 5]);
                            return [4 /*yield*/, axios_1.default.post(dto.url, payload, {
                                    headers: {
                                        'Content-Type': 'application/json',
                                        'X-PariLink-Signature': signature,
                                        'X-PariLink-Event': dto.eventType,
                                        'X-PariLink-Sandbox': 'true',
                                    },
                                    timeout: 5000,
                                    maxRedirects: 0, // Prevent SSRF bypass via HTTP redirects
                                })];
                        case 3:
                            res = _c.sent();
                            return [2 /*return*/, {
                                    status: 'SUCCESS',
                                    httpStatus: res.status,
                                    latencyMs: Date.now() - start,
                                    responseBody: typeof res.data === 'object'
                                        ? res.data
                                        : String(res.data).substring(0, 500),
                                }];
                        case 4:
                            err_1 = _c.sent();
                            return [2 /*return*/, {
                                    status: 'FAILED',
                                    httpStatus: ((_a = err_1.response) === null || _a === void 0 ? void 0 : _a.status) || 500,
                                    latencyMs: Date.now() - start,
                                    error: err_1.message,
                                    responseBody: ((_b = err_1.response) === null || _b === void 0 ? void 0 : _b.data)
                                        ? String(err_1.response.data).substring(0, 500)
                                        : null,
                                }];
                        case 5: return [2 /*return*/];
                    }
                });
            });
        };
        DeveloperPlatformService_1.prototype.generateSdkSnippet = function (language) {
            return __awaiter(this, void 0, void 0, function () {
                var lang;
                return __generator(this, function (_a) {
                    lang = language.toLowerCase();
                    switch (lang) {
                        case 'typescript':
                        case 'ts':
                        case 'javascript':
                        case 'js':
                            return [2 /*return*/, {
                                    language: 'TypeScript / Node.js',
                                    snippet: "import axios from 'axios';\n\nconst client = axios.create({\n  baseURL: 'https://api.parilink.enterprise.io/v1',\n  headers: { 'Authorization': 'Bearer YOUR_API_KEY', 'Content-Type': 'application/json' }\n});\n\nasync function triggerSync() {\n  const res = await client.post('/integration/sync/trigger', {\n    connectionId: 'conn_12345',\n    entityType: 'INVOICE'\n  });\n  console.log('Sync Result:', res.data);\n}",
                                }];
                        case 'python':
                        case 'py':
                            return [2 /*return*/, {
                                    language: 'Python',
                                    snippet: "import requests\n\nheaders = {'Authorization': 'Bearer YOUR_API_KEY', 'Content-Type': 'application/json'}\npayload = {'connectionId': 'conn_12345', 'entityType': 'INVOICE'}\n\nresponse = requests.post('https://api.parilink.enterprise.io/v1/integration/sync/trigger', json=payload, headers=headers)\nprint('Status:', response.status_code, response.json())",
                                }];
                        case 'curl':
                        case 'bash':
                            return [2 /*return*/, {
                                    language: 'cURL',
                                    snippet: "curl -X POST https://api.parilink.enterprise.io/v1/integration/sync/trigger \\\n  -H \"Authorization: Bearer YOUR_API_KEY\" \\\n  -H \"Content-Type: application/json\" \\\n  -d '{\"connectionId\":\"conn_12345\",\"entityType\":\"INVOICE\"}'",
                                }];
                        default:
                            return [2 /*return*/, {
                                    language: 'Generic HTTP',
                                    snippet: "POST /v1/integration/sync/trigger HTTP/1.1\nHost: api.parilink.enterprise.io\nAuthorization: Bearer YOUR_API_KEY\nContent-Type: application/json\n\n{\"connectionId\":\"conn_12345\",\"entityType\":\"INVOICE\"}",
                                }];
                    }
                    return [2 /*return*/];
                });
            });
        };
        DeveloperPlatformService_1.prototype.generateSampleRequest = function (endpoint, method) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, {
                            endpoint: endpoint,
                            method: method.toUpperCase(),
                            headers: {
                                Authorization: 'Bearer pk_test_sample_token',
                                'Content-Type': 'application/json',
                                'X-PariLink-Correlation-Id': crypto.randomUUID(),
                            },
                            payload: {
                                streamId: 'veh_998877',
                                streamType: 'VEHICLE',
                                eventType: 'GpsUpdated',
                                payload: {
                                    latitude: 19.076,
                                    longitude: 72.877,
                                    speed: 65.5,
                                    fuelLevel: 82.0,
                                },
                            },
                        }];
                });
            });
        };
        return DeveloperPlatformService_1;
    }());
    __setFunctionName(_classThis, "DeveloperPlatformService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        DeveloperPlatformService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return DeveloperPlatformService = _classThis;
}();
exports.DeveloperPlatformService = DeveloperPlatformService;
