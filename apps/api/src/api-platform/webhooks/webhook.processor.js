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
exports.WebhookProcessor = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
var bullmq_1 = require("@nestjs/bullmq");
var common_1 = require("@nestjs/common");
var axios_1 = __importDefault(require("axios"));
var ssrf_protector_util_1 = require("../../platform/security/ssrf-protector.util");
var crypto = __importStar(require("crypto"));
var url_1 = require("url");
function validateWebhookUrl(targetUrl) {
    var parsed = new url_1.URL(targetUrl);
    var blockedHosts = [
        'localhost',
        '127.0.0.1',
        '0.0.0.0',
        '169.254.169.254',
        '::1',
    ];
    if (blockedHosts.includes(parsed.hostname) ||
        parsed.hostname.endsWith('.internal')) {
        throw new Error('SSRF Blocked: Cannot dispatch webhooks to internal infrastructure.');
    }
}
var WebhookProcessor = function () {
    var _classDecorators = [(0, bullmq_1.Processor)('webhooks_v2', { concurrency: 50 })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _classSuper = bullmq_1.WorkerHost;
    var _instanceExtraInitializers = [];
    var _onFailed_decorators;
    var WebhookProcessor = _classThis = /** @class */ (function (_super) {
        __extends(WebhookProcessor_1, _super);
        function WebhookProcessor_1(prisma) {
            var _this = _super.call(this) || this;
            _this.prisma = (__runInitializers(_this, _instanceExtraInitializers), prisma);
            _this.logger = new common_1.Logger(WebhookProcessor.name);
            return _this;
        }
        WebhookProcessor_1.prototype.process = function (job) {
            return __awaiter(this, void 0, void 0, function () {
                var _a, endpointId, url, secret, payload, companyId, signature, deliveryId_1, response_1, error_1, httpStatus_1, responseBody_1, isLastAttempt, newStatus_1;
                var _this = this;
                var _b, _c;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            if (!(job.name === 'deliver_webhook')) return [3 /*break*/, 8];
                            _a = job.data, endpointId = _a.endpointId, url = _a.url, secret = _a.secret, payload = _a.payload, companyId = _a.companyId;
                            signature = this.generateSignature(payload, secret);
                            return [4 /*yield*/, this.recordDeliveryAttempt(job, companyId, url, payload.eventType, payload)];
                        case 1:
                            deliveryId_1 = _d.sent();
                            _d.label = 2;
                        case 2:
                            _d.trys.push([2, 6, , 8]);
                            return [4 /*yield*/, (0, ssrf_protector_util_1.validateSsrfSafeUrl)(url)];
                        case 3:
                            if (!(_d.sent())) {
                                throw new Error('SSRF attempt blocked: Webhook URL is invalid or targets restricted internal IPs');
                            }
                            return [4 /*yield*/, axios_1.default.post(url, payload, {
                                    headers: {
                                        'Content-Type': 'application/json',
                                        'X-PariLink-Signature': signature,
                                        'X-PariLink-Delivery': deliveryId_1,
                                        'X-PariLink-Event': payload.eventType,
                                        'X-PariLink-Retry-Count': job.attemptsMade,
                                    },
                                    timeout: 10000, // 10s timeout
                                    maxRedirects: 0, // Prevent SSRF bypass via HTTP redirects to internal IPs
                                })];
                        case 4:
                            response_1 = _d.sent();
                            // 2. Mark Delivery Success
                            return [4 /*yield*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.webhookDelivery.update({
                                                where: { id: deliveryId_1 },
                                                data: {
                                                    status: 'SUCCESS',
                                                    httpStatus: response_1.status,
                                                    responseBody: JSON.stringify(response_1.data).substring(0, 1000), // Trim body
                                                },
                                            })];
                                    });
                                }); })];
                        case 5:
                            // 2. Mark Delivery Success
                            _d.sent();
                            this.logger.log("Webhook delivery ".concat(deliveryId_1, " SUCCESS to ").concat(url));
                            return [2 /*return*/, { deliveryId: deliveryId_1, status: 'SUCCESS' }];
                        case 6:
                            error_1 = _d.sent();
                            httpStatus_1 = ((_b = error_1.response) === null || _b === void 0 ? void 0 : _b.status) || 500;
                            responseBody_1 = ((_c = error_1.response) === null || _c === void 0 ? void 0 : _c.data)
                                ? JSON.stringify(error_1.response.data)
                                : error_1.message;
                            isLastAttempt = job.attemptsMade >= job.opts.attempts - 1;
                            newStatus_1 = isLastAttempt ? 'DEAD_LETTER' : 'FAILED';
                            return [4 /*yield*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.webhookDelivery.update({
                                                where: { id: deliveryId_1 },
                                                data: {
                                                    status: newStatus_1,
                                                    httpStatus: httpStatus_1,
                                                    responseBody: responseBody_1.substring(0, 1000),
                                                    retryCount: job.attemptsMade + 1,
                                                },
                                            })];
                                    });
                                }); })];
                        case 7:
                            _d.sent();
                            this.logger.error("Webhook delivery ".concat(deliveryId_1, " FAILED to ").concat(url, ". Attempt ").concat(job.attemptsMade + 1));
                            if (!isLastAttempt) {
                                throw error_1; // Throwing triggers BullMQ to retry (Exponential Backoff)
                            }
                            return [3 /*break*/, 8];
                        case 8: return [2 /*return*/];
                    }
                });
            });
        };
        WebhookProcessor_1.prototype.generateSignature = function (payload, secret) {
            var stringifiedPayload = JSON.stringify(payload);
            return crypto
                .createHmac('sha256', secret)
                .update(stringifiedPayload)
                .digest('hex');
        };
        WebhookProcessor_1.prototype.recordDeliveryAttempt = function (job, companyId, url, eventTopic, payload) {
            return __awaiter(this, void 0, void 0, function () {
                var endpointId, endpoint, delivery;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            endpointId = job.data.endpointId;
                            if (!(job.attemptsMade === 0)) return [3 /*break*/, 5];
                            if (!endpointId) return [3 /*break*/, 2];
                            return [4 /*yield*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.webhookEndpoint.findFirst({
                                                where: { id: endpointId, companyId: companyId },
                                            })];
                                    });
                                }); })];
                        case 1:
                            endpoint = _a.sent();
                            if (!endpoint) {
                                throw new Error("Unauthorized: Endpoint ".concat(endpointId, " does not belong to company ").concat(companyId));
                            }
                            _a.label = 2;
                        case 2: return [4 /*yield*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    return [2 /*return*/, tx.webhookDelivery.create({
                                            data: {
                                                companyId: companyId,
                                                direction: 'OUTGOING',
                                                endpointUrl: url,
                                                eventTopic: eventTopic,
                                                payload: payload,
                                                status: 'PENDING',
                                                retryCount: 0,
                                            },
                                        })];
                                });
                            }); })];
                        case 3:
                            delivery = _a.sent();
                            // Store deliveryId in job data for retries
                            return [4 /*yield*/, job.updateData(__assign(__assign({}, job.data), { deliveryId: delivery.id }))];
                        case 4:
                            // Store deliveryId in job data for retries
                            _a.sent();
                            return [2 /*return*/, delivery.id];
                        case 5: 
                        // Retry attempt
                        return [2 /*return*/, job.data.deliveryId];
                    }
                });
            });
        };
        WebhookProcessor_1.prototype.onFailed = function (job, error) {
            this.logger.error("Job ".concat(job.id, " failed: ").concat(error.message));
        };
        return WebhookProcessor_1;
    }(_classSuper));
    __setFunctionName(_classThis, "WebhookProcessor");
    (function () {
        var _a;
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create((_a = _classSuper[Symbol.metadata]) !== null && _a !== void 0 ? _a : null) : void 0;
        _onFailed_decorators = [(0, bullmq_1.OnWorkerEvent)('failed')];
        __esDecorate(_classThis, null, _onFailed_decorators, { kind: "method", name: "onFailed", static: false, private: false, access: { has: function (obj) { return "onFailed" in obj; }, get: function (obj) { return obj.onFailed; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        WebhookProcessor = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return WebhookProcessor = _classThis;
}();
exports.WebhookProcessor = WebhookProcessor;
