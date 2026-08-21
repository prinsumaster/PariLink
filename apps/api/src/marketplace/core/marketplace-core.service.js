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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarketplaceCoreService = void 0;
var common_1 = require("@nestjs/common");
var crypto = __importStar(require("crypto"));
var MarketplaceCoreService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var MarketplaceCoreService = _classThis = /** @class */ (function () {
        function MarketplaceCoreService_1(prisma) {
            this.prisma = prisma;
            this.logger = new common_1.Logger(MarketplaceCoreService.name);
            // In a real production system, this would be injected via ConfigService
            this.encryptionKey = Buffer.from('vOVH6sdmpNWjRRIqCc7rdxs01lwHzfr3', 'utf-8'); // 32 bytes
        }
        /**
         * Retrieves the marketplace catalog with optional filtering
         */
        MarketplaceCoreService_1.prototype.getCatalog = function (query) {
            return __awaiter(this, void 0, void 0, function () {
                var whereClause, apps;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            whereClause = { status: 'ACTIVE' };
                            if (query.category && query.category !== 'all') {
                                whereClause.category = {
                                    name: { equals: query.category, mode: 'insensitive' },
                                };
                            }
                            if (query.search) {
                                whereClause.OR = [
                                    { name: { contains: query.search, mode: 'insensitive' } },
                                    { description: { contains: query.search, mode: 'insensitive' } },
                                ];
                            }
                            return [4 /*yield*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.marketplaceApp.findMany({
                                                where: whereClause,
                                                include: {
                                                    category: true,
                                                    developer: true,
                                                    versions: {
                                                        where: { isLatest: true },
                                                        take: 1,
                                                    },
                                                    permissions: true,
                                                },
                                                orderBy: { createdAt: 'desc' },
                                            })];
                                    });
                                }); })];
                        case 1:
                            apps = _a.sent();
                            return [2 /*return*/, apps];
                    }
                });
            });
        };
        /**
         * Retrieves a single app's details
         */
        MarketplaceCoreService_1.prototype.getAppDetails = function (appId) {
            return __awaiter(this, void 0, void 0, function () {
                var app;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    return [2 /*return*/, tx.marketplaceApp.findUnique({
                                            where: { id: appId },
                                            include: {
                                                category: true,
                                                developer: true,
                                                versions: {
                                                    orderBy: { createdAt: 'desc' },
                                                },
                                                permissions: true,
                                                screenshots: {
                                                    orderBy: { order: 'asc' },
                                                },
                                            },
                                        })];
                                });
                            }); })];
                        case 1:
                            app = _a.sent();
                            if (!app) {
                                throw new common_1.NotFoundException("App with ID ".concat(appId, " not found"));
                            }
                            return [2 /*return*/, app];
                    }
                });
            });
        };
        /**
         * Gets all installed apps for a company
         */
        MarketplaceCoreService_1.prototype.getInstalledApps = function (companyId) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                return [2 /*return*/, tx.appInstallation.findMany({
                                        where: { companyId: companyId },
                                        include: {
                                            app: {
                                                include: {
                                                    category: true,
                                                    developer: true,
                                                },
                                            },
                                            healths: {
                                                orderBy: { timestamp: 'desc' },
                                                take: 1,
                                            },
                                            usageStats: {
                                                orderBy: { date: 'desc' },
                                                take: 1,
                                            },
                                        },
                                    })];
                            });
                        }); })];
                });
            });
        };
        /**
         * Gets details for a specific installation
         */
        MarketplaceCoreService_1.prototype.getInstallationDetails = function (companyId, appId) {
            return __awaiter(this, void 0, void 0, function () {
                var installation, credentials, safeInstallation;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    return [2 /*return*/, tx.appInstallation.findUnique({
                                            where: {
                                                companyId_appId: {
                                                    companyId: companyId,
                                                    appId: appId,
                                                },
                                            },
                                            include: {
                                                app: true,
                                                configurations: true,
                                                webhooks: true,
                                                healths: {
                                                    orderBy: { timestamp: 'desc' },
                                                    take: 10,
                                                },
                                            },
                                        })];
                                });
                            }); })];
                        case 1:
                            installation = _a.sent();
                            if (!installation) {
                                throw new common_1.NotFoundException("Installation not found for app ".concat(appId));
                            }
                            credentials = installation.credentials, safeInstallation = __rest(installation, ["credentials"]);
                            return [2 /*return*/, safeInstallation];
                    }
                });
            });
        };
        /**
         * Encrypts sensitive credentials
         */
        MarketplaceCoreService_1.prototype.encryptSecret = function (text) {
            var iv = crypto.randomBytes(16);
            var cipher = crypto.createCipheriv('aes-256-gcm', this.encryptionKey, iv);
            var encrypted = cipher.update(text, 'utf8', 'hex');
            encrypted += cipher.final('hex');
            var authTag = cipher.getAuthTag().toString('hex');
            return "".concat(iv.toString('hex'), ":").concat(encrypted, ":").concat(authTag);
        };
        /**
         * Main installation workflow wrapped in a Prisma transaction
         */
        MarketplaceCoreService_1.prototype.installApp = function (companyId, userId, dto) {
            return __awaiter(this, void 0, void 0, function () {
                var app, existing, encryptedCredentials, _i, _a, _b, key, value;
                var _this = this;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0: return [4 /*yield*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    return [2 /*return*/, tx.marketplaceApp.findUnique({
                                            where: { id: dto.appId },
                                            include: { versions: { where: { isLatest: true } } },
                                        })];
                                });
                            }); })];
                        case 1:
                            app = _c.sent();
                            if (!app) {
                                throw new common_1.NotFoundException("App ".concat(dto.appId, " not found"));
                            }
                            return [4 /*yield*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.appInstallation.findUnique({
                                                where: {
                                                    companyId_appId: {
                                                        companyId: companyId,
                                                        appId: dto.appId,
                                                    },
                                                },
                                            })];
                                    });
                                }); })];
                        case 2:
                            existing = _c.sent();
                            if (existing) {
                                throw new common_1.BadRequestException('App is already installed');
                            }
                            encryptedCredentials = {};
                            if (dto.credentials) {
                                for (_i = 0, _a = Object.entries(dto.credentials); _i < _a.length; _i++) {
                                    _b = _a[_i], key = _b[0], value = _b[1];
                                    if (typeof value === 'string') {
                                        encryptedCredentials[key] = this.encryptSecret(value);
                                    }
                                }
                            }
                            // 4. Transactional Installation
                            return [2 /*return*/, this.prisma.$transaction(function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    var installation;
                                    var _a, _b;
                                    return __generator(this, function (_c) {
                                        switch (_c.label) {
                                            case 0: return [4 /*yield*/, tx.appInstallation.create({
                                                    data: {
                                                        companyId: companyId,
                                                        appId: dto.appId,
                                                        version: dto.version || ((_b = (_a = app.versions[0]) === null || _a === void 0 ? void 0 : _a.version) !== null && _b !== void 0 ? _b : '1.0.0'),
                                                        status: 'ACTIVE',
                                                        healthStatus: 'HEALTHY',
                                                        credentials: encryptedCredentials,
                                                        settings: dto.settings || {},
                                                        installedBy: userId,
                                                    },
                                                })];
                                            case 1:
                                                installation = _c.sent();
                                                if (!(dto.webhooks && dto.webhooks.length > 0)) return [3 /*break*/, 3];
                                                return [4 /*yield*/, tx.appWebhook.createMany({
                                                        data: dto.webhooks.map(function (wh) { return ({
                                                            appInstallationId: installation.id,
                                                            url: wh.url,
                                                            events: wh.events,
                                                        }); }),
                                                    })];
                                            case 2:
                                                _c.sent();
                                                _c.label = 3;
                                            case 3: 
                                            // Initialize Health Record
                                            return [4 /*yield*/, tx.appHealth.create({
                                                    data: {
                                                        appInstallationId: installation.id,
                                                        status: 'HEALTHY',
                                                        details: { message: 'Initial installation completed successfully' },
                                                    },
                                                })];
                                            case 4:
                                                // Initialize Health Record
                                                _c.sent();
                                                // Initialize Usage Stats
                                                return [4 /*yield*/, tx.appUsageStatistic.create({
                                                        data: {
                                                            appInstallationId: installation.id,
                                                        },
                                                    })];
                                            case 5:
                                                // Initialize Usage Stats
                                                _c.sent();
                                                this.logger.log("App ".concat(app.name, " installed successfully for company ").concat(companyId));
                                                return [2 /*return*/, installation];
                                        }
                                    });
                                }); })];
                    }
                });
            });
        };
        /**
         * App Lifecycle: Uninstall
         */
        MarketplaceCoreService_1.prototype.uninstallApp = function (companyId, appId) {
            return __awaiter(this, void 0, void 0, function () {
                var installation;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    return [2 /*return*/, tx.appInstallation.findUnique({
                                            where: { companyId_appId: { companyId: companyId, appId: appId } },
                                        })];
                                });
                            }); })];
                        case 1:
                            installation = _a.sent();
                            if (!installation) {
                                throw new common_1.NotFoundException('Installation not found');
                            }
                            // Cascade delete handles related records (webhooks, health, etc.)
                            return [4 /*yield*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.appInstallation.delete({
                                                where: { id: installation.id },
                                            })];
                                    });
                                }); })];
                        case 2:
                            // Cascade delete handles related records (webhooks, health, etc.)
                            _a.sent();
                            this.logger.log("App ".concat(appId, " uninstalled for company ").concat(companyId));
                            return [2 /*return*/, { success: true }];
                    }
                });
            });
        };
        /**
         * App Lifecycle: Toggle Status (Disable/Enable)
         */
        MarketplaceCoreService_1.prototype.toggleAppStatus = function (companyId, appId, status) {
            return __awaiter(this, void 0, void 0, function () {
                var installation;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    return [2 /*return*/, tx.appInstallation.findUnique({
                                            where: { companyId_appId: { companyId: companyId, appId: appId } },
                                        })];
                                });
                            }); })];
                        case 1:
                            installation = _a.sent();
                            if (!installation) {
                                throw new common_1.NotFoundException('Installation not found');
                            }
                            return [4 /*yield*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.appInstallation.update({
                                                where: { id: installation.id },
                                                data: {
                                                    status: status,
                                                    healthStatus: status === 'SUSPENDED' ? 'OFFLINE' : 'HEALTHY',
                                                },
                                            })];
                                    });
                                }); })];
                        case 2:
                            _a.sent();
                            this.logger.log("App ".concat(appId, " status changed to ").concat(status, " for company ").concat(companyId));
                            return [2 /*return*/, { success: true, status: status }];
                    }
                });
            });
        };
        // ─────────────────────────────────────────────────────────────
        // EXTENSION SYSTEM (V31.0)
        // ─────────────────────────────────────────────────────────────
        MarketplaceCoreService_1.prototype.getExtensionsBySlot = function (companyId, slotId) {
            return __awaiter(this, void 0, void 0, function () {
                var activeInstallations, extensions, _i, activeInstallations_1, installation, uiExtensions, matchingExtensions, _a, matchingExtensions_1, ext;
                var _this = this;
                var _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0: return [4 /*yield*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    return [2 /*return*/, tx.appInstallation.findMany({
                                            where: {
                                                companyId: companyId,
                                                status: 'ACTIVE',
                                            },
                                            include: {
                                                app: true,
                                            },
                                        })];
                                });
                            }); })];
                        case 1:
                            activeInstallations = _c.sent();
                            extensions = [];
                            for (_i = 0, activeInstallations_1 = activeInstallations; _i < activeInstallations_1.length; _i++) {
                                installation = activeInstallations_1[_i];
                                uiExtensions = installation.app.uiExtensions ||
                                    ((_b = installation.settings) === null || _b === void 0 ? void 0 : _b.uiExtensions) ||
                                    [];
                                matchingExtensions = uiExtensions.filter(function (ext) { return ext.type === slotId; });
                                for (_a = 0, matchingExtensions_1 = matchingExtensions; _a < matchingExtensions_1.length; _a++) {
                                    ext = matchingExtensions_1[_a];
                                    extensions.push(__assign(__assign({}, ext), { appId: installation.app.id, installationId: installation.id }));
                                }
                            }
                            return [2 /*return*/, extensions];
                    }
                });
            });
        };
        return MarketplaceCoreService_1;
    }());
    __setFunctionName(_classThis, "MarketplaceCoreService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        MarketplaceCoreService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return MarketplaceCoreService = _classThis;
}();
exports.MarketplaceCoreService = MarketplaceCoreService;
