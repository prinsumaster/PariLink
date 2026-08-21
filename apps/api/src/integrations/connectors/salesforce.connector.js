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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SalesforceConnector = void 0;
var base_connector_1 = require("./base.connector");
var common_1 = require("@nestjs/common");
var ssrf_protector_util_1 = require("../../platform/security/ssrf-protector.util");
var SalesforceConnector = /** @class */ (function (_super) {
    __extends(SalesforceConnector, _super);
    function SalesforceConnector() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.providerId = 'SALESFORCE';
        _this.providerName = 'Salesforce CRM';
        _this.authType = 'OAUTH2';
        _this.supportedEntities = ['ACCOUNT', 'CONTACT', 'OPPORTUNITY'];
        _this.logger = new common_1.Logger(SalesforceConnector.name);
        return _this;
    }
    SalesforceConnector.prototype.getAuthorizationUrl = function (state) {
        var _a, _b;
        var baseUrl = 'https://login.salesforce.com/services/oauth2/authorize';
        return "".concat(baseUrl, "?client_id=").concat((_a = this.config) === null || _a === void 0 ? void 0 : _a.clientId, "&redirect_uri=").concat((_b = this.config) === null || _b === void 0 ? void 0 : _b.redirectUri, "&response_type=code&state=").concat(state);
    };
    SalesforceConnector.prototype.exchangeCode = function (code) {
        return __awaiter(this, void 0, void 0, function () {
            var response, data, e_1;
            var _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        this.logger.log("Exchanging code for Salesforce: ".concat(code.substring(0, 5), "..."));
                        _d.label = 1;
                    case 1:
                        _d.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, fetch('https://login.salesforce.com/services/oauth2/token', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                                body: new URLSearchParams({
                                    grant_type: 'authorization_code',
                                    client_id: ((_a = this.config) === null || _a === void 0 ? void 0 : _a.clientId) || '',
                                    client_secret: ((_b = this.config) === null || _b === void 0 ? void 0 : _b.clientSecret) || '',
                                    redirect_uri: ((_c = this.config) === null || _c === void 0 ? void 0 : _c.redirectUri) || '',
                                    code: code,
                                }),
                            })];
                    case 2:
                        response = _d.sent();
                        if (!response.ok)
                            throw new Error("SF OAuth failed: ".concat(response.statusText));
                        return [4 /*yield*/, response.json()];
                    case 3:
                        data = _d.sent();
                        return [2 /*return*/, {
                                accessToken: data.access_token,
                                refreshToken: data.refresh_token,
                                expiresIn: data.expires_in || 3600,
                                instanceUrl: data.instance_url,
                            }];
                    case 4:
                        e_1 = _d.sent();
                        this.logger.error('Salesforce token exchange failed', e_1);
                        throw e_1;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    SalesforceConnector.prototype.refreshToken = function (refreshToken) {
        return __awaiter(this, void 0, void 0, function () {
            var response, data, e_2;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        this.logger.log("Refreshing Salesforce token");
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, fetch('https://login.salesforce.com/services/oauth2/token', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                                body: new URLSearchParams({
                                    grant_type: 'refresh_token',
                                    client_id: ((_a = this.config) === null || _a === void 0 ? void 0 : _a.clientId) || '',
                                    client_secret: ((_b = this.config) === null || _b === void 0 ? void 0 : _b.clientSecret) || '',
                                    refresh_token: refreshToken,
                                }),
                            })];
                    case 2:
                        response = _c.sent();
                        if (!response.ok)
                            throw new Error('SF Refresh failed');
                        return [4 /*yield*/, response.json()];
                    case 3:
                        data = _c.sent();
                        return [2 /*return*/, {
                                accessToken: data.access_token,
                                expiresIn: data.expires_in || 3600,
                            }];
                    case 4:
                        e_2 = _c.sent();
                        this.logger.error('SF refresh failed', e_2);
                        throw e_2;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    SalesforceConnector.prototype.healthCheck = function (credentials) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // MOCK: Verify token against Identity URL
                return [2 /*return*/, !!(credentials === null || credentials === void 0 ? void 0 : credentials.accessToken)];
            });
        });
    };
    SalesforceConnector.prototype.syncEntity = function (entityType, credentials, lastSyncDate, cursor) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.logger.log("Syncing Salesforce ".concat(entityType, " from ").concat(lastSyncDate));
                // Deterministic sync response. Real sync logic dispatches a queue job and reads actual DB cursors.
                return [2 /*return*/, {
                        success: true,
                        recordsSynced: 0, // Fallback when no sync engine is attached
                    }];
            });
        });
    };
    SalesforceConnector.prototype.pushEvent = function (eventType, payload, credentials) {
        return __awaiter(this, void 0, void 0, function () {
            var response, e_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.logger.log("Pushing event to Salesforce: ".concat(eventType));
                        if (!(credentials === null || credentials === void 0 ? void 0 : credentials.accessToken)) {
                            this.logger.warn('No Salesforce credentials provided for event push');
                            return [2 /*return*/, false];
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, (0, ssrf_protector_util_1.validateSsrfSafeUrl)(credentials.instanceUrl)];
                    case 2:
                        if (!(_a.sent())) {
                            throw new Error('SSRF blocked: Invalid Salesforce instance URL');
                        }
                        return [4 /*yield*/, fetch("".concat(credentials.instanceUrl, "/services/data/v60.0/sobjects/").concat(eventType), {
                                method: 'POST',
                                headers: {
                                    Authorization: "Bearer ".concat(credentials.accessToken),
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify(payload),
                                redirect: 'error',
                            })];
                    case 3:
                        response = _a.sent();
                        return [2 /*return*/, response.ok];
                    case 4:
                        e_3 = _a.sent();
                        this.logger.error('SF event push failed', e_3);
                        return [2 /*return*/, false];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    return SalesforceConnector;
}(base_connector_1.BaseConnector));
exports.SalesforceConnector = SalesforceConnector;
