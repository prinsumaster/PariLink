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
exports.PaymentGatewayConnector = exports.WhatsAppConnector = exports.EmailGatewayConnector = exports.SmsGatewayConnector = exports.GstConnector = exports.EwayBillConnector = exports.FastagConnector = exports.FuelCardConnector = exports.GpsProviderConnector = void 0;
var common_1 = require("@nestjs/common");
var base_connector_1 = require("../framework/base.connector");
var GpsProviderConnector = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _classSuper = base_connector_1.BaseConnector;
    var GpsProviderConnector = _classThis = /** @class */ (function (_super) {
        __extends(GpsProviderConnector_1, _super);
        function GpsProviderConnector_1() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.providerName = 'GPS_TELEMATICS_HUB';
            _this.version = '2.0.0';
            _this.authType = 'API_KEY';
            _this.logger = new common_1.Logger(GpsProviderConnector.name);
            return _this;
        }
        GpsProviderConnector_1.prototype.validateConfiguration = function (config) {
            return !!((config === null || config === void 0 ? void 0 : config.apiKey) && (config === null || config === void 0 ? void 0 : config.providerType)); // e.g., GEOTAB, LOCONAV, WHEELSEYE, TRACCAR
        };
        GpsProviderConnector_1.prototype.authenticate = function (credentials) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, { token: "gps_token_".concat(Date.now()) }];
                });
            });
        };
        GpsProviderConnector_1.prototype.sync = function (companyId, credentials, entityType, payload) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    this.logger.log("[GPS Hub] Ingesting real-time telemetry stream for ".concat(entityType));
                    return [2 /*return*/, { recordsProcessed: 1, status: 'SUCCESS' }];
                });
            });
        };
        GpsProviderConnector_1.prototype.receiveWebhook = function (headers, body) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, { event: 'gps.location.update', data: body }];
                });
            });
        };
        GpsProviderConnector_1.prototype.send = function (endpoint, method, credentials, data) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, { status: 200, data: { success: true } }];
                });
            });
        };
        GpsProviderConnector_1.prototype.healthCheck = function (credentials) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.validateConfiguration(credentials)];
                });
            });
        };
        GpsProviderConnector_1.prototype.testConnection = function (credentials) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.validateConfiguration(credentials)];
                });
            });
        };
        return GpsProviderConnector_1;
    }(_classSuper));
    __setFunctionName(_classThis, "GpsProviderConnector");
    (function () {
        var _a;
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create((_a = _classSuper[Symbol.metadata]) !== null && _a !== void 0 ? _a : null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        GpsProviderConnector = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return GpsProviderConnector = _classThis;
}();
exports.GpsProviderConnector = GpsProviderConnector;
var FuelCardConnector = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _classSuper = base_connector_1.BaseConnector;
    var FuelCardConnector = _classThis = /** @class */ (function (_super) {
        __extends(FuelCardConnector_1, _super);
        function FuelCardConnector_1() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.providerName = 'FUEL_CARD_NETWORK';
            _this.version = '1.1.0';
            _this.authType = 'API_KEY';
            _this.logger = new common_1.Logger(FuelCardConnector.name);
            return _this;
        }
        FuelCardConnector_1.prototype.validateConfiguration = function (config) {
            return !!((config === null || config === void 0 ? void 0 : config.merchantId) && (config === null || config === void 0 ? void 0 : config.apiKey) && (config === null || config === void 0 ? void 0 : config.network)); // HPCL, BPCL, IOCL
        };
        FuelCardConnector_1.prototype.authenticate = function (credentials) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, { status: 'AUTHENTICATED' }];
                });
            });
        };
        FuelCardConnector_1.prototype.sync = function (companyId, credentials, entityType, payload) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    this.logger.log("[Fuel Cards] Synchronizing fuel transactions and mileage logs");
                    return [2 /*return*/, { recordsProcessed: 1, status: 'SUCCESS' }];
                });
            });
        };
        FuelCardConnector_1.prototype.receiveWebhook = function (headers, body) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, { event: 'fuel.transaction.completed', data: body }];
                });
            });
        };
        FuelCardConnector_1.prototype.send = function (endpoint, method, credentials, data) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, { status: 200, data: { status: 'OK' } }];
                });
            });
        };
        FuelCardConnector_1.prototype.healthCheck = function (credentials) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.validateConfiguration(credentials)];
                });
            });
        };
        FuelCardConnector_1.prototype.testConnection = function (credentials) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.validateConfiguration(credentials)];
                });
            });
        };
        return FuelCardConnector_1;
    }(_classSuper));
    __setFunctionName(_classThis, "FuelCardConnector");
    (function () {
        var _a;
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create((_a = _classSuper[Symbol.metadata]) !== null && _a !== void 0 ? _a : null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        FuelCardConnector = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return FuelCardConnector = _classThis;
}();
exports.FuelCardConnector = FuelCardConnector;
var FastagConnector = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _classSuper = base_connector_1.BaseConnector;
    var FastagConnector = _classThis = /** @class */ (function (_super) {
        __extends(FastagConnector_1, _super);
        function FastagConnector_1() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.providerName = 'NETC_FASTAG';
            _this.version = '2.5.0';
            _this.authType = 'API_KEY';
            _this.logger = new common_1.Logger(FastagConnector.name);
            return _this;
        }
        FastagConnector_1.prototype.validateConfiguration = function (config) {
            return !!((config === null || config === void 0 ? void 0 : config.acquirerBank) && (config === null || config === void 0 ? void 0 : config.merchantKey) && (config === null || config === void 0 ? void 0 : config.walletId));
        };
        FastagConnector_1.prototype.authenticate = function (credentials) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, { token: "fastag_netc_".concat(Date.now()) }];
                });
            });
        };
        FastagConnector_1.prototype.sync = function (companyId, credentials, entityType, payload) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    this.logger.log("[FASTag] Syncing toll plaza deduction events and wallet balances");
                    return [2 /*return*/, { recordsProcessed: 1, status: 'SUCCESS' }];
                });
            });
        };
        FastagConnector_1.prototype.receiveWebhook = function (headers, body) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, { event: 'fastag.toll.deduction', data: body }];
                });
            });
        };
        FastagConnector_1.prototype.send = function (endpoint, method, credentials, data) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, { status: 200, data: { balance: 5000, status: 'ACTIVE' } }];
                });
            });
        };
        FastagConnector_1.prototype.healthCheck = function (credentials) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.validateConfiguration(credentials)];
                });
            });
        };
        FastagConnector_1.prototype.testConnection = function (credentials) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.validateConfiguration(credentials)];
                });
            });
        };
        return FastagConnector_1;
    }(_classSuper));
    __setFunctionName(_classThis, "FastagConnector");
    (function () {
        var _a;
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create((_a = _classSuper[Symbol.metadata]) !== null && _a !== void 0 ? _a : null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        FastagConnector = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return FastagConnector = _classThis;
}();
exports.FastagConnector = FastagConnector;
var EwayBillConnector = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _classSuper = base_connector_1.BaseConnector;
    var EwayBillConnector = _classThis = /** @class */ (function (_super) {
        __extends(EwayBillConnector_1, _super);
        function EwayBillConnector_1() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.providerName = 'NIC_EWAY_BILL';
            _this.version = '3.0.0';
            _this.authType = 'BASIC';
            _this.logger = new common_1.Logger(EwayBillConnector.name);
            return _this;
        }
        EwayBillConnector_1.prototype.validateConfiguration = function (config) {
            return !!((config === null || config === void 0 ? void 0 : config.gstin) && (config === null || config === void 0 ? void 0 : config.username) && (config === null || config === void 0 ? void 0 : config.password));
        };
        EwayBillConnector_1.prototype.authenticate = function (credentials) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, {
                            authToken: "nic_eway_auth_".concat(Date.now()),
                            sek: "secret_key_".concat(Date.now()),
                        }];
                });
            });
        };
        EwayBillConnector_1.prototype.sync = function (companyId, credentials, entityType, payload) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    this.logger.log("[E-Way Bill] Generating / updating e-way bill for load/trip");
                    return [2 /*return*/, {
                            ewayBillNo: "EWB".concat(Date.now()),
                            validUpto: new Date(Date.now() + 86400000).toISOString(),
                            status: 'GENERATED',
                        }];
                });
            });
        };
        EwayBillConnector_1.prototype.receiveWebhook = function (headers, body) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, { event: 'ewaybill.status.changed', data: body }];
                });
            });
        };
        EwayBillConnector_1.prototype.send = function (endpoint, method, credentials, data) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, { status: 200, data: { success: true } }];
                });
            });
        };
        EwayBillConnector_1.prototype.healthCheck = function (credentials) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.validateConfiguration(credentials)];
                });
            });
        };
        EwayBillConnector_1.prototype.testConnection = function (credentials) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.validateConfiguration(credentials)];
                });
            });
        };
        return EwayBillConnector_1;
    }(_classSuper));
    __setFunctionName(_classThis, "EwayBillConnector");
    (function () {
        var _a;
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create((_a = _classSuper[Symbol.metadata]) !== null && _a !== void 0 ? _a : null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        EwayBillConnector = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return EwayBillConnector = _classThis;
}();
exports.EwayBillConnector = EwayBillConnector;
var GstConnector = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _classSuper = base_connector_1.BaseConnector;
    var GstConnector = _classThis = /** @class */ (function (_super) {
        __extends(GstConnector_1, _super);
        function GstConnector_1() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.providerName = 'GSTN_EINVOICE';
            _this.version = '2.0.0';
            _this.authType = 'API_KEY';
            _this.logger = new common_1.Logger(GstConnector.name);
            return _this;
        }
        GstConnector_1.prototype.validateConfiguration = function (config) {
            return !!((config === null || config === void 0 ? void 0 : config.gstin) &&
                (config === null || config === void 0 ? void 0 : config.clientId) &&
                (config === null || config === void 0 ? void 0 : config.clientSecret) &&
                (config === null || config === void 0 ? void 0 : config.gspToken));
        };
        GstConnector_1.prototype.authenticate = function (credentials) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, { token: "gstn_irn_token_".concat(Date.now()) }];
                });
            });
        };
        GstConnector_1.prototype.sync = function (companyId, credentials, entityType, payload) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    this.logger.log("[GSTN] Generating Invoice Reference Number (IRN) and QR Code");
                    return [2 /*return*/, {
                            irn: "IRN_".concat(crypto.randomUUID()),
                            ackNo: "".concat(Date.now()),
                            status: 'SUCCESS',
                        }];
                });
            });
        };
        GstConnector_1.prototype.receiveWebhook = function (headers, body) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, { event: 'gst.einvoice.generated', data: body }];
                });
            });
        };
        GstConnector_1.prototype.send = function (endpoint, method, credentials, data) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, { status: 200, data: { gstinValid: true } }];
                });
            });
        };
        GstConnector_1.prototype.healthCheck = function (credentials) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.validateConfiguration(credentials)];
                });
            });
        };
        GstConnector_1.prototype.testConnection = function (credentials) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.validateConfiguration(credentials)];
                });
            });
        };
        return GstConnector_1;
    }(_classSuper));
    __setFunctionName(_classThis, "GstConnector");
    (function () {
        var _a;
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create((_a = _classSuper[Symbol.metadata]) !== null && _a !== void 0 ? _a : null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        GstConnector = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return GstConnector = _classThis;
}();
exports.GstConnector = GstConnector;
var SmsGatewayConnector = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _classSuper = base_connector_1.BaseConnector;
    var SmsGatewayConnector = _classThis = /** @class */ (function (_super) {
        __extends(SmsGatewayConnector_1, _super);
        function SmsGatewayConnector_1() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.providerName = 'SMS_GATEWAY';
            _this.version = '1.0.0';
            _this.authType = 'API_KEY';
            _this.logger = new common_1.Logger(SmsGatewayConnector.name);
            return _this;
        }
        SmsGatewayConnector_1.prototype.validateConfiguration = function (config) {
            return !!((config === null || config === void 0 ? void 0 : config.apiKey) && (config === null || config === void 0 ? void 0 : config.senderId) && (config === null || config === void 0 ? void 0 : config.provider)); // TWILIO, GUPSHUP, MSG91
        };
        SmsGatewayConnector_1.prototype.authenticate = function (credentials) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, { ok: true }];
                });
            });
        };
        SmsGatewayConnector_1.prototype.sync = function (companyId, credentials, entityType, payload) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    this.logger.log("[SMS Gateway] Dispatching SMS broadcast");
                    return [2 /*return*/, { messageId: "sms_".concat(Date.now()), status: 'SENT' }];
                });
            });
        };
        SmsGatewayConnector_1.prototype.receiveWebhook = function (headers, body) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, { event: 'sms.delivery.status', data: body }];
                });
            });
        };
        SmsGatewayConnector_1.prototype.send = function (endpoint, method, credentials, data) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, { status: 200, data: { sent: true } }];
                });
            });
        };
        SmsGatewayConnector_1.prototype.healthCheck = function (credentials) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.validateConfiguration(credentials)];
                });
            });
        };
        SmsGatewayConnector_1.prototype.testConnection = function (credentials) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.validateConfiguration(credentials)];
                });
            });
        };
        return SmsGatewayConnector_1;
    }(_classSuper));
    __setFunctionName(_classThis, "SmsGatewayConnector");
    (function () {
        var _a;
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create((_a = _classSuper[Symbol.metadata]) !== null && _a !== void 0 ? _a : null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        SmsGatewayConnector = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return SmsGatewayConnector = _classThis;
}();
exports.SmsGatewayConnector = SmsGatewayConnector;
var EmailGatewayConnector = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _classSuper = base_connector_1.BaseConnector;
    var EmailGatewayConnector = _classThis = /** @class */ (function (_super) {
        __extends(EmailGatewayConnector_1, _super);
        function EmailGatewayConnector_1() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.providerName = 'EMAIL_GATEWAY';
            _this.version = '1.0.0';
            _this.authType = 'API_KEY';
            _this.logger = new common_1.Logger(EmailGatewayConnector.name);
            return _this;
        }
        EmailGatewayConnector_1.prototype.validateConfiguration = function (config) {
            return !!((config === null || config === void 0 ? void 0 : config.apiKey) && (config === null || config === void 0 ? void 0 : config.fromEmail)); // SENDGRID, SES, POSTMARK
        };
        EmailGatewayConnector_1.prototype.authenticate = function (credentials) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, { ok: true }];
                });
            });
        };
        EmailGatewayConnector_1.prototype.sync = function (companyId, credentials, entityType, payload) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    this.logger.log("[Email Gateway] Dispatching transactional email");
                    return [2 /*return*/, { messageId: "email_".concat(Date.now()), status: 'QUEUED' }];
                });
            });
        };
        EmailGatewayConnector_1.prototype.receiveWebhook = function (headers, body) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, { event: 'email.event', data: body }];
                });
            });
        };
        EmailGatewayConnector_1.prototype.send = function (endpoint, method, credentials, data) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, { status: 200, data: { accepted: true } }];
                });
            });
        };
        EmailGatewayConnector_1.prototype.healthCheck = function (credentials) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.validateConfiguration(credentials)];
                });
            });
        };
        EmailGatewayConnector_1.prototype.testConnection = function (credentials) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.validateConfiguration(credentials)];
                });
            });
        };
        return EmailGatewayConnector_1;
    }(_classSuper));
    __setFunctionName(_classThis, "EmailGatewayConnector");
    (function () {
        var _a;
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create((_a = _classSuper[Symbol.metadata]) !== null && _a !== void 0 ? _a : null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        EmailGatewayConnector = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return EmailGatewayConnector = _classThis;
}();
exports.EmailGatewayConnector = EmailGatewayConnector;
var WhatsAppConnector = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _classSuper = base_connector_1.BaseConnector;
    var WhatsAppConnector = _classThis = /** @class */ (function (_super) {
        __extends(WhatsAppConnector_1, _super);
        function WhatsAppConnector_1() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.providerName = 'WHATSAPP_CLOUD_API';
            _this.version = '2.0.0';
            _this.authType = 'OAUTH2';
            _this.logger = new common_1.Logger(WhatsAppConnector.name);
            return _this;
        }
        WhatsAppConnector_1.prototype.validateConfiguration = function (config) {
            return !!((config === null || config === void 0 ? void 0 : config.phoneNumberId) &&
                (config === null || config === void 0 ? void 0 : config.accessToken) &&
                (config === null || config === void 0 ? void 0 : config.businessAccountId));
        };
        WhatsAppConnector_1.prototype.authenticate = function (credentials) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, { ok: true }];
                });
            });
        };
        WhatsAppConnector_1.prototype.sync = function (companyId, credentials, entityType, payload) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    this.logger.log("[WhatsApp] Sending interactive template message");
                    return [2 /*return*/, { wamid: "wamid.HBg".concat(Date.now()), status: 'SENT' }];
                });
            });
        };
        WhatsAppConnector_1.prototype.receiveWebhook = function (headers, body) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, { event: 'whatsapp.message.received', data: body }];
                });
            });
        };
        WhatsAppConnector_1.prototype.send = function (endpoint, method, credentials, data) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, { status: 200, data: { success: true } }];
                });
            });
        };
        WhatsAppConnector_1.prototype.healthCheck = function (credentials) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.validateConfiguration(credentials)];
                });
            });
        };
        WhatsAppConnector_1.prototype.testConnection = function (credentials) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.validateConfiguration(credentials)];
                });
            });
        };
        return WhatsAppConnector_1;
    }(_classSuper));
    __setFunctionName(_classThis, "WhatsAppConnector");
    (function () {
        var _a;
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create((_a = _classSuper[Symbol.metadata]) !== null && _a !== void 0 ? _a : null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        WhatsAppConnector = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return WhatsAppConnector = _classThis;
}();
exports.WhatsAppConnector = WhatsAppConnector;
var PaymentGatewayConnector = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _classSuper = base_connector_1.BaseConnector;
    var PaymentGatewayConnector = _classThis = /** @class */ (function (_super) {
        __extends(PaymentGatewayConnector_1, _super);
        function PaymentGatewayConnector_1() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.providerName = 'ENTERPRISE_PAYMENTS';
            _this.version = '2.0.0';
            _this.authType = 'API_KEY';
            _this.logger = new common_1.Logger(PaymentGatewayConnector.name);
            return _this;
        }
        PaymentGatewayConnector_1.prototype.validateConfiguration = function (config) {
            return !!((config === null || config === void 0 ? void 0 : config.keyId) && (config === null || config === void 0 ? void 0 : config.keySecret) && (config === null || config === void 0 ? void 0 : config.provider)); // RAZORPAY, STRIPE, CASHFREE
        };
        PaymentGatewayConnector_1.prototype.authenticate = function (credentials) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, { ok: true }];
                });
            });
        };
        PaymentGatewayConnector_1.prototype.sync = function (companyId, credentials, entityType, payload) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    this.logger.log("[Payment Gateway] Processing settlement / payout / refund");
                    return [2 /*return*/, { transactionId: "pay_".concat(Date.now()), status: 'SETTLED' }];
                });
            });
        };
        PaymentGatewayConnector_1.prototype.receiveWebhook = function (headers, body) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, { event: 'payment.captured', data: body }];
                });
            });
        };
        PaymentGatewayConnector_1.prototype.send = function (endpoint, method, credentials, data) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, { status: 200, data: { id: "order_".concat(Date.now()) } }];
                });
            });
        };
        PaymentGatewayConnector_1.prototype.healthCheck = function (credentials) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.validateConfiguration(credentials)];
                });
            });
        };
        PaymentGatewayConnector_1.prototype.testConnection = function (credentials) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.validateConfiguration(credentials)];
                });
            });
        };
        return PaymentGatewayConnector_1;
    }(_classSuper));
    __setFunctionName(_classThis, "PaymentGatewayConnector");
    (function () {
        var _a;
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create((_a = _classSuper[Symbol.metadata]) !== null && _a !== void 0 ? _a : null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        PaymentGatewayConnector = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return PaymentGatewayConnector = _classThis;
}();
exports.PaymentGatewayConnector = PaymentGatewayConnector;
