"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
exports.XeroConnector = exports.ZohoBooksConnector = exports.TallyConnector = exports.Dynamics365Connector = exports.OracleErpConnector = exports.SapConnector = void 0;
var common_1 = require("@nestjs/common");
var base_connector_1 = require("../framework/base.connector");
var SapConnector = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _classSuper = base_connector_1.BaseConnector;
    var SapConnector = _classThis = /** @class */ (function (_super) {
        __extends(SapConnector_1, _super);
        function SapConnector_1() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.providerName = 'SAP_ERP';
            _this.version = '2.1.0';
            _this.authType = 'OAUTH2';
            _this.logger = new common_1.Logger(SapConnector.name);
            return _this;
        }
        SapConnector_1.prototype.validateConfiguration = function (config) {
            return !!((config === null || config === void 0 ? void 0 : config.clientId) &&
                (config === null || config === void 0 ? void 0 : config.clientSecret) &&
                (config === null || config === void 0 ? void 0 : config.baseUrl) &&
                (config === null || config === void 0 ? void 0 : config.clientNumber));
        };
        SapConnector_1.prototype.authenticate = function (credentials) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    this.logger.log("[SAP ERP] Authenticating client ".concat(credentials === null || credentials === void 0 ? void 0 : credentials.clientId, "..."));
                    return [2 /*return*/, {
                            accessToken: "sap_access_".concat(Date.now()),
                            tokenType: 'Bearer',
                            expiresIn: 3600,
                        }];
                });
            });
        };
        SapConnector_1.prototype.sync = function (companyId, credentials, entityType, payload) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    this.logger.log("[SAP ERP] Synchronizing entity ".concat(entityType, " for tenant ").concat(companyId));
                    // Simulate mapping and conflict resolution (e.g. timestamp comparison)
                    return [2 /*return*/, {
                            recordsProcessed: Array.isArray(payload) ? payload.length : 1,
                            status: 'SUCCESS',
                            conflictsResolved: 0,
                            timestamp: new Date().toISOString(),
                        }];
                });
            });
        };
        SapConnector_1.prototype.receiveWebhook = function (headers, body) {
            return __awaiter(this, void 0, void 0, function () {
                var b;
                var _a;
                return __generator(this, function (_b) {
                    this.logger.log("[SAP ERP] Received OData event notification");
                    b = body;
                    return [2 /*return*/, {
                            event: ((_a = b === null || b === void 0 ? void 0 : b.d) === null || _a === void 0 ? void 0 : _a.event) || 'sap.entity.updated',
                            data: (b === null || b === void 0 ? void 0 : b.d) || body,
                        }];
                });
            });
        };
        SapConnector_1.prototype.send = function (endpoint, method, credentials, data) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    this.logger.log("[SAP ERP] Executing ".concat(method, " ").concat(endpoint));
                    return [2 /*return*/, { status: 200, data: { success: true, endpoint: endpoint } }];
                });
            });
        };
        SapConnector_1.prototype.healthCheck = function (credentials) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.validateConfiguration(credentials)];
                });
            });
        };
        SapConnector_1.prototype.testConnection = function (credentials) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.validateConfiguration(credentials)];
                });
            });
        };
        return SapConnector_1;
    }(_classSuper));
    __setFunctionName(_classThis, "SapConnector");
    (function () {
        var _a;
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create((_a = _classSuper[Symbol.metadata]) !== null && _a !== void 0 ? _a : null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        SapConnector = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return SapConnector = _classThis;
}();
exports.SapConnector = SapConnector;
var OracleErpConnector = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _classSuper = base_connector_1.BaseConnector;
    var OracleErpConnector = _classThis = /** @class */ (function (_super) {
        __extends(OracleErpConnector_1, _super);
        function OracleErpConnector_1() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.providerName = 'ORACLE_ERP';
            _this.version = '1.5.0';
            _this.authType = 'OAUTH2';
            _this.logger = new common_1.Logger(OracleErpConnector.name);
            return _this;
        }
        OracleErpConnector_1.prototype.validateConfiguration = function (config) {
            return !!((config === null || config === void 0 ? void 0 : config.clientId) && (config === null || config === void 0 ? void 0 : config.clientSecret) && (config === null || config === void 0 ? void 0 : config.instanceUrl));
        };
        OracleErpConnector_1.prototype.authenticate = function (credentials) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    this.logger.log("[Oracle ERP] Authenticating via OAuth2...");
                    return [2 /*return*/, {
                            accessToken: "oracle_access_".concat(Date.now()),
                            tokenType: 'Bearer',
                            expiresIn: 7200,
                        }];
                });
            });
        };
        OracleErpConnector_1.prototype.sync = function (companyId, credentials, entityType, payload) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    this.logger.log("[Oracle ERP] Synchronizing ".concat(entityType));
                    return [2 /*return*/, { recordsProcessed: 1, status: 'SUCCESS' }];
                });
            });
        };
        OracleErpConnector_1.prototype.receiveWebhook = function (headers, body) {
            return __awaiter(this, void 0, void 0, function () {
                var b;
                return __generator(this, function (_a) {
                    b = body;
                    return [2 /*return*/, { event: (b === null || b === void 0 ? void 0 : b.eventType) || 'oracle.erp.event', data: body }];
                });
            });
        };
        OracleErpConnector_1.prototype.send = function (endpoint, method, credentials, data) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, { status: 200, data: { ok: true } }];
                });
            });
        };
        OracleErpConnector_1.prototype.healthCheck = function (credentials) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.validateConfiguration(credentials)];
                });
            });
        };
        OracleErpConnector_1.prototype.testConnection = function (credentials) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.validateConfiguration(credentials)];
                });
            });
        };
        return OracleErpConnector_1;
    }(_classSuper));
    __setFunctionName(_classThis, "OracleErpConnector");
    (function () {
        var _a;
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create((_a = _classSuper[Symbol.metadata]) !== null && _a !== void 0 ? _a : null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        OracleErpConnector = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return OracleErpConnector = _classThis;
}();
exports.OracleErpConnector = OracleErpConnector;
var Dynamics365Connector = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _classSuper = base_connector_1.BaseConnector;
    var Dynamics365Connector = _classThis = /** @class */ (function (_super) {
        __extends(Dynamics365Connector_1, _super);
        function Dynamics365Connector_1() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.providerName = 'MICROSOFT_DYNAMICS';
            _this.version = '3.0.0';
            _this.authType = 'OAUTH2';
            _this.logger = new common_1.Logger(Dynamics365Connector.name);
            return _this;
        }
        Dynamics365Connector_1.prototype.validateConfiguration = function (config) {
            return !!((config === null || config === void 0 ? void 0 : config.clientId) &&
                (config === null || config === void 0 ? void 0 : config.clientSecret) &&
                (config === null || config === void 0 ? void 0 : config.tenantId) &&
                (config === null || config === void 0 ? void 0 : config.resourceUri));
        };
        Dynamics365Connector_1.prototype.authenticate = function (credentials) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    this.logger.log("[Dynamics 365] Authenticating with Azure AD...");
                    return [2 /*return*/, { accessToken: "dyn_access_".concat(Date.now()), tokenType: 'Bearer' }];
                });
            });
        };
        Dynamics365Connector_1.prototype.sync = function (companyId, credentials, entityType, payload) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    this.logger.log("[Dynamics 365] Synchronizing Dataverse entity ".concat(entityType));
                    return [2 /*return*/, { recordsProcessed: 1, status: 'SUCCESS' }];
                });
            });
        };
        Dynamics365Connector_1.prototype.receiveWebhook = function (headers, body) {
            return __awaiter(this, void 0, void 0, function () {
                var b;
                return __generator(this, function (_a) {
                    b = body;
                    return [2 /*return*/, { event: (b === null || b === void 0 ? void 0 : b.MessageName) || 'dynamics.event', data: body }];
                });
            });
        };
        Dynamics365Connector_1.prototype.send = function (endpoint, method, credentials, data) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, { status: 200, data: { value: [] } }];
                });
            });
        };
        Dynamics365Connector_1.prototype.healthCheck = function (credentials) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.validateConfiguration(credentials)];
                });
            });
        };
        Dynamics365Connector_1.prototype.testConnection = function (credentials) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.validateConfiguration(credentials)];
                });
            });
        };
        return Dynamics365Connector_1;
    }(_classSuper));
    __setFunctionName(_classThis, "Dynamics365Connector");
    (function () {
        var _a;
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create((_a = _classSuper[Symbol.metadata]) !== null && _a !== void 0 ? _a : null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        Dynamics365Connector = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return Dynamics365Connector = _classThis;
}();
exports.Dynamics365Connector = Dynamics365Connector;
var TallyConnector = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _classSuper = base_connector_1.BaseConnector;
    var TallyConnector = _classThis = /** @class */ (function (_super) {
        __extends(TallyConnector_1, _super);
        function TallyConnector_1() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.providerName = 'TALLY_PRIME';
            _this.version = '1.2.0';
            _this.authType = 'BASIC';
            _this.logger = new common_1.Logger(TallyConnector.name);
            return _this;
        }
        TallyConnector_1.prototype.validateConfiguration = function (config) {
            return !!((config === null || config === void 0 ? void 0 : config.serverUrl) && (config === null || config === void 0 ? void 0 : config.companyName) && (config === null || config === void 0 ? void 0 : config.port));
        };
        TallyConnector_1.prototype.authenticate = function (credentials) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    this.logger.log("[TallyPrime] Establishing HTTP XML handshake on port ".concat(credentials === null || credentials === void 0 ? void 0 : credentials.port, "..."));
                    return [2 /*return*/, { session: "tally_sess_".concat(Date.now()) }];
                });
            });
        };
        TallyConnector_1.prototype.sync = function (companyId, credentials, entityType, payload) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    this.logger.log("[TallyPrime] Syncing accounting voucher/ledger for ".concat(entityType));
                    return [2 /*return*/, { recordsProcessed: 1, status: 'SUCCESS', format: 'XML' }];
                });
            });
        };
        TallyConnector_1.prototype.receiveWebhook = function (headers, body) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, { event: 'tally.voucher.created', data: body }];
                });
            });
        };
        TallyConnector_1.prototype.send = function (endpoint, method, credentials, data) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, { status: 200, data: { response: 'SUCCESS' } }];
                });
            });
        };
        TallyConnector_1.prototype.healthCheck = function (credentials) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.validateConfiguration(credentials)];
                });
            });
        };
        TallyConnector_1.prototype.testConnection = function (credentials) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.validateConfiguration(credentials)];
                });
            });
        };
        return TallyConnector_1;
    }(_classSuper));
    __setFunctionName(_classThis, "TallyConnector");
    (function () {
        var _a;
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create((_a = _classSuper[Symbol.metadata]) !== null && _a !== void 0 ? _a : null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        TallyConnector = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return TallyConnector = _classThis;
}();
exports.TallyConnector = TallyConnector;
var ZohoBooksConnector = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _classSuper = base_connector_1.BaseConnector;
    var ZohoBooksConnector = _classThis = /** @class */ (function (_super) {
        __extends(ZohoBooksConnector_1, _super);
        function ZohoBooksConnector_1() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.providerName = 'ZOHO_BOOKS';
            _this.version = '2.0.0';
            _this.authType = 'OAUTH2';
            _this.logger = new common_1.Logger(ZohoBooksConnector.name);
            return _this;
        }
        ZohoBooksConnector_1.prototype.validateConfiguration = function (config) {
            return !!((config === null || config === void 0 ? void 0 : config.clientId) &&
                (config === null || config === void 0 ? void 0 : config.clientSecret) &&
                (config === null || config === void 0 ? void 0 : config.organizationId));
        };
        ZohoBooksConnector_1.prototype.authenticate = function (credentials) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, { accessToken: "zoho_access_".concat(Date.now()), expiresIn: 3600 }];
                });
            });
        };
        ZohoBooksConnector_1.prototype.sync = function (companyId, credentials, entityType, payload) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    this.logger.log("[Zoho Books] Synchronizing ".concat(entityType));
                    return [2 /*return*/, { recordsProcessed: 1, status: 'SUCCESS' }];
                });
            });
        };
        ZohoBooksConnector_1.prototype.receiveWebhook = function (headers, body) {
            return __awaiter(this, void 0, void 0, function () {
                var b;
                return __generator(this, function (_a) {
                    b = body;
                    return [2 /*return*/, { event: (b === null || b === void 0 ? void 0 : b.event_type) || 'zoho.entity.changed', data: body }];
                });
            });
        };
        ZohoBooksConnector_1.prototype.send = function (endpoint, method, credentials, data) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, { status: 200, data: { code: 0, message: 'success' } }];
                });
            });
        };
        ZohoBooksConnector_1.prototype.healthCheck = function (credentials) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.validateConfiguration(credentials)];
                });
            });
        };
        ZohoBooksConnector_1.prototype.testConnection = function (credentials) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.validateConfiguration(credentials)];
                });
            });
        };
        return ZohoBooksConnector_1;
    }(_classSuper));
    __setFunctionName(_classThis, "ZohoBooksConnector");
    (function () {
        var _a;
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create((_a = _classSuper[Symbol.metadata]) !== null && _a !== void 0 ? _a : null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ZohoBooksConnector = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ZohoBooksConnector = _classThis;
}();
exports.ZohoBooksConnector = ZohoBooksConnector;
var XeroConnector = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _classSuper = base_connector_1.BaseConnector;
    var XeroConnector = _classThis = /** @class */ (function (_super) {
        __extends(XeroConnector_1, _super);
        function XeroConnector_1() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.providerName = 'XERO';
            _this.version = '2.0.0';
            _this.authType = 'OAUTH2';
            _this.logger = new common_1.Logger(XeroConnector.name);
            return _this;
        }
        XeroConnector_1.prototype.validateConfiguration = function (config) {
            return !!((config === null || config === void 0 ? void 0 : config.clientId) && (config === null || config === void 0 ? void 0 : config.clientSecret) && (config === null || config === void 0 ? void 0 : config.tenantId));
        };
        XeroConnector_1.prototype.authenticate = function (credentials) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, { accessToken: "xero_access_".concat(Date.now()), expiresIn: 1800 }];
                });
            });
        };
        XeroConnector_1.prototype.sync = function (companyId, credentials, entityType, payload) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    this.logger.log("[Xero] Synchronizing accounting entity ".concat(entityType));
                    return [2 /*return*/, { recordsProcessed: 1, status: 'SUCCESS' }];
                });
            });
        };
        XeroConnector_1.prototype.receiveWebhook = function (headers, body) {
            return __awaiter(this, void 0, void 0, function () {
                var b;
                var _a, _b;
                return __generator(this, function (_c) {
                    b = body;
                    return [2 /*return*/, { event: ((_b = (_a = b === null || b === void 0 ? void 0 : b.events) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.eventType) || 'xero.event', data: body }];
                });
            });
        };
        XeroConnector_1.prototype.send = function (endpoint, method, credentials, data) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, { status: 200, data: { Status: 'OK' } }];
                });
            });
        };
        XeroConnector_1.prototype.healthCheck = function (credentials) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.validateConfiguration(credentials)];
                });
            });
        };
        XeroConnector_1.prototype.testConnection = function (credentials) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.validateConfiguration(credentials)];
                });
            });
        };
        return XeroConnector_1;
    }(_classSuper));
    __setFunctionName(_classThis, "XeroConnector");
    (function () {
        var _a;
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create((_a = _classSuper[Symbol.metadata]) !== null && _a !== void 0 ? _a : null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        XeroConnector = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return XeroConnector = _classThis;
}();
exports.XeroConnector = XeroConnector;
