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
exports.WebhookProcessor = void 0;
var bullmq_1 = require("@nestjs/bullmq");
var bullmq_2 = require("bullmq");
var common_1 = require("@nestjs/common");
var crypto = __importStar(require("crypto"));
var axios_1 = __importDefault(require("axios"));
var ssrf_protector_util_1 = require("../../platform/security/ssrf-protector.util");
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
    var _classDecorators = [(0, bullmq_1.Processor)('webhooks', { concurrency: 50 })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _classSuper = bullmq_1.WorkerHost;
    var WebhookProcessor = _classThis = /** @class */ (function (_super) {
        __extends(WebhookProcessor_1, _super);
        function WebhookProcessor_1(prisma) {
            var _this = _super.call(this) || this;
            _this.prisma = prisma;
            _this.logger = new common_1.Logger(WebhookProcessor.name);
            return _this;
        }
        WebhookProcessor_1.prototype.process = function (job) {
            return __awaiter(this, void 0, void 0, function () {
                var _a, url, payload, secret, installationId, webhookId, payloadString, signature, startTime, status, success, errorMessage, response, error_1, duration_1;
                var _this = this;
                var _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            _a = job.data, url = _a.url, payload = _a.payload, secret = _a.secret, installationId = _a.installationId, webhookId = _a.webhookId;
                            this.logger.log("Processing webhook delivery to ".concat(url, " (Job ID: ").concat(job.id, ")"));
                            payloadString = JSON.stringify(payload);
                            signature = crypto
                                .createHmac('sha256', secret)
                                .update(payloadString)
                                .digest('hex');
                            startTime = Date.now();
                            status = 0;
                            success = false;
                            errorMessage = '';
                            _c.label = 1;
                        case 1:
                            _c.trys.push([1, 4, 5, 9]);
                            return [4 /*yield*/, (0, ssrf_protector_util_1.validateSsrfSafeUrl)(url)];
                        case 2:
                            if (!(_c.sent())) {
                                throw new Error('SSRF attempt blocked: Webhook URL is invalid or targets restricted internal IPs');
                            }
                            return [4 /*yield*/, axios_1.default.post(url, payloadString, {
                                    headers: {
                                        'Content-Type': 'application/json',
                                        'X-PariLink-Signature': signature,
                                        'X-PariLink-Event': payload.eventType,
                                        'X-PariLink-Delivery': job.id,
                                    },
                                    timeout: 10000, // 10 second timeout for webhooks
                                    maxRedirects: 0, // Prevent SSRF bypass via HTTP redirects
                                })];
                        case 3:
                            response = _c.sent();
                            status = response.status;
                            success = status >= 200 && status < 300;
                            return [3 /*break*/, 9];
                        case 4:
                            error_1 = _c.sent();
                            status = ((_b = error_1.response) === null || _b === void 0 ? void 0 : _b.status) || 0;
                            errorMessage = error_1.message;
                            this.logger.error("Webhook delivery failed for ".concat(url, ": ").concat(errorMessage));
                            // If it's a 4xx error (except 429), don't retry as it's a client issue
                            if (status >= 400 && status < 500 && status !== 429) {
                                throw new bullmq_2.UnrecoverableError("Client error ".concat(status, ", aborting retries."));
                            }
                            // For 5xx, timeouts, or network issues, throw to trigger BullMQ retry
                            throw error_1;
                        case 5:
                            duration_1 = Date.now() - startTime;
                            // Log the delivery attempt in the database
                            return [4 /*yield*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.marketplaceWebhookDelivery.create({
                                                data: {
                                                    webhookId: webhookId,
                                                    eventId: payload.eventId,
                                                    status: status,
                                                    success: success,
                                                    duration: duration_1,
                                                    error: errorMessage || null,
                                                    payload: payload,
                                                },
                                            })];
                                    });
                                }); })];
                        case 6:
                            // Log the delivery attempt in the database
                            _c.sent();
                            if (!success) return [3 /*break*/, 8];
                            return [4 /*yield*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.marketplaceUsageStats.upsert({
                                                where: {
                                                    appId_companyId_periodStart: {
                                                        appId: installationId.split('_')[1] || 'unknown', // Workaround for missing direct appId reference
                                                        companyId: payload.companyId,
                                                        periodStart: new Date(new Date().setHours(0, 0, 0, 0)),
                                                    },
                                                },
                                                update: {
                                                    apiCallsCount: { increment: 1 },
                                                },
                                                create: {
                                                    appId: installationId.split('_')[1] || 'unknown',
                                                    companyId: payload.companyId,
                                                    periodStart: new Date(new Date().setHours(0, 0, 0, 0)),
                                                    apiCallsCount: 1,
                                                    bandwidthBytes: Buffer.byteLength(payloadString, 'utf8'),
                                                },
                                            })];
                                    });
                                }); })];
                        case 7:
                            _c.sent();
                            _c.label = 8;
                        case 8: return [7 /*endfinally*/];
                        case 9: return [2 /*return*/, { success: success, status: status }];
                    }
                });
            });
        };
        return WebhookProcessor_1;
    }(_classSuper));
    __setFunctionName(_classThis, "WebhookProcessor");
    (function () {
        var _a;
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create((_a = _classSuper[Symbol.metadata]) !== null && _a !== void 0 ? _a : null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        WebhookProcessor = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return WebhookProcessor = _classThis;
}();
exports.WebhookProcessor = WebhookProcessor;
