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
exports.WebhookPlatformService = void 0;
var common_1 = require("@nestjs/common");
var axios_1 = __importDefault(require("axios"));
var ssrf_protector_util_1 = require("../../platform/security/ssrf-protector.util");
var crypto = __importStar(require("crypto"));
var WebhookPlatformService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var WebhookPlatformService = _classThis = /** @class */ (function () {
        function WebhookPlatformService_1(prisma, audit) {
            this.prisma = prisma;
            this.audit = audit;
            this.logger = new common_1.Logger(WebhookPlatformService.name);
        }
        WebhookPlatformService_1.prototype.getDeliveryHistory = function (companyId, query) {
            return __awaiter(this, void 0, void 0, function () {
                var where, _a, deliveries, total;
                var _this = this;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            where = { companyId: companyId };
                            if (query.direction)
                                where.direction = query.direction;
                            if (query.status)
                                where.status = query.status;
                            if (query.eventTopic)
                                where.eventTopic = query.eventTopic;
                            return [4 /*yield*/, Promise.all([
                                    this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                        return __generator(this, function (_a) {
                                            return [2 /*return*/, tx.webhookDelivery.findMany({
                                                    where: where,
                                                    take: query.limit || 50,
                                                    skip: query.offset || 0,
                                                    orderBy: { createdAt: 'desc' },
                                                })];
                                        });
                                    }); }),
                                    this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.webhookDelivery.count({ where: where })];
                                    }); }); }),
                                ])];
                        case 1:
                            _a = _b.sent(), deliveries = _a[0], total = _a[1];
                            return [2 /*return*/, {
                                    deliveries: deliveries,
                                    total: total,
                                    limit: query.limit || 50,
                                    offset: query.offset || 0,
                                }];
                    }
                });
            });
        };
        WebhookPlatformService_1.prototype.getDeliveryDetails = function (companyId, deliveryId) {
            return __awaiter(this, void 0, void 0, function () {
                var delivery;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    return [2 /*return*/, tx.webhookDelivery.findUnique({
                                            where: { id: deliveryId },
                                        })];
                                });
                            }); })];
                        case 1:
                            delivery = _a.sent();
                            if (!delivery || delivery.companyId !== companyId) {
                                throw new common_1.NotFoundException('Webhook delivery record not found');
                            }
                            return [2 /*return*/, delivery];
                    }
                });
            });
        };
        WebhookPlatformService_1.prototype.replayDelivery = function (companyId, deliveryId, userId) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                            var delivery, newDelivery, payloadStr, secret, signature, res, err_1, httpStatus, responseBody;
                            var _a, _b;
                            return __generator(this, function (_c) {
                                switch (_c.label) {
                                    case 0: return [4 /*yield*/, tx.webhookDelivery.findUnique({
                                            where: { id: deliveryId },
                                        })];
                                    case 1:
                                        delivery = _c.sent();
                                        if (!delivery || delivery.companyId !== companyId) {
                                            throw new common_1.NotFoundException('Webhook delivery record not found');
                                        }
                                        if (delivery.direction !== 'OUTGOING') {
                                            throw new common_1.BadRequestException('Only OUTGOING webhooks can be replayed from the developer platform');
                                        }
                                        this.logger.log("Replaying webhook delivery ".concat(deliveryId, " to ").concat(delivery.endpointUrl));
                                        return [4 /*yield*/, tx.webhookDelivery.create({
                                                data: {
                                                    companyId: companyId,
                                                    direction: 'OUTGOING',
                                                    endpointUrl: delivery.endpointUrl,
                                                    eventTopic: delivery.eventTopic,
                                                    payload: delivery.payload,
                                                    status: 'PENDING',
                                                    retryCount: delivery.retryCount + 1,
                                                },
                                            })];
                                    case 2:
                                        newDelivery = _c.sent();
                                        _c.label = 3;
                                    case 3:
                                        _c.trys.push([3, 7, , 9]);
                                        payloadStr = JSON.stringify(delivery.payload);
                                        secret = process.env.WEBHOOK_SECRET || 'REMOVED_PLACEHOLDER_WHSEC';
                                        signature = crypto
                                            .createHmac('sha256', secret)
                                            .update(payloadStr)
                                            .digest('hex');
                                        return [4 /*yield*/, (0, ssrf_protector_util_1.validateSsrfSafeUrl)(delivery.endpointUrl)];
                                    case 4:
                                        if (!(_c.sent())) {
                                            throw new Error('Invalid or restricted webhook URL (SSRF prevention).');
                                        }
                                        return [4 /*yield*/, axios_1.default.post(delivery.endpointUrl, delivery.payload, {
                                                headers: {
                                                    'Content-Type': 'application/json',
                                                    'X-PariLink-Signature': signature,
                                                    'X-PariLink-Delivery': newDelivery.id,
                                                    'X-PariLink-Event': delivery.eventTopic,
                                                    'X-PariLink-Replay-Of': delivery.id,
                                                },
                                                timeout: 10000,
                                                maxRedirects: 0, // Prevent SSRF bypass via HTTP redirects
                                            })];
                                    case 5:
                                        res = _c.sent();
                                        return [4 /*yield*/, tx.webhookDelivery.update({
                                                where: { id: newDelivery.id },
                                                data: {
                                                    status: 'SUCCESS',
                                                    httpStatus: res.status,
                                                    responseBody: JSON.stringify(res.data).substring(0, 1000),
                                                },
                                            })];
                                    case 6:
                                        _c.sent();
                                        return [3 /*break*/, 9];
                                    case 7:
                                        err_1 = _c.sent();
                                        httpStatus = ((_a = err_1.response) === null || _a === void 0 ? void 0 : _a.status) || 500;
                                        responseBody = ((_b = err_1.response) === null || _b === void 0 ? void 0 : _b.data)
                                            ? JSON.stringify(err_1.response.data)
                                            : err_1.message;
                                        return [4 /*yield*/, tx.webhookDelivery.update({
                                                where: { id: newDelivery.id },
                                                data: {
                                                    status: 'FAILED',
                                                    httpStatus: httpStatus,
                                                    responseBody: responseBody.substring(0, 1000),
                                                },
                                            })];
                                    case 8:
                                        _c.sent();
                                        return [3 /*break*/, 9];
                                    case 9: return [4 /*yield*/, this.audit.logEvent({
                                            companyId: companyId,
                                            userId: userId,
                                            entity: 'WebhookDelivery',
                                            entityId: delivery.id,
                                            action: 'REPLAY_WEBHOOK',
                                            details: {
                                                newDeliveryId: newDelivery.id,
                                                endpointUrl: delivery.endpointUrl,
                                            },
                                        })];
                                    case 10:
                                        _c.sent();
                                        return [2 /*return*/, tx.webhookDelivery.findUnique({ where: { id: newDelivery.id } })];
                                }
                            });
                        }); })];
                });
            });
        };
        WebhookPlatformService_1.prototype.getWebhookMetrics = function (companyId) {
            return __awaiter(this, void 0, void 0, function () {
                var _a, totalIncoming, totalOutgoing, successCount, failedCount, deadLetterCount;
                var _this = this;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, Promise.all([
                                this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.webhookDelivery.count({
                                                where: { companyId: companyId, direction: 'INCOMING' },
                                            })];
                                    });
                                }); }),
                                this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.webhookDelivery.count({
                                                where: { companyId: companyId, direction: 'OUTGOING' },
                                            })];
                                    });
                                }); }),
                                this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                    return [2 /*return*/, tx.webhookDelivery.count({ where: { companyId: companyId, status: 'SUCCESS' } })];
                                }); }); }),
                                this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                    return [2 /*return*/, tx.webhookDelivery.count({ where: { companyId: companyId, status: 'FAILED' } })];
                                }); }); }),
                                this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.webhookDelivery.count({
                                                where: { companyId: companyId, status: 'DEAD_LETTER' },
                                            })];
                                    });
                                }); }),
                            ])];
                        case 1:
                            _a = _b.sent(), totalIncoming = _a[0], totalOutgoing = _a[1], successCount = _a[2], failedCount = _a[3], deadLetterCount = _a[4];
                            return [2 /*return*/, {
                                    totalIncoming: totalIncoming,
                                    totalOutgoing: totalOutgoing,
                                    successCount: successCount,
                                    failedCount: failedCount,
                                    deadLetterCount: deadLetterCount,
                                    successRate: totalOutgoing + totalIncoming > 0
                                        ? ((successCount / (totalOutgoing + totalIncoming)) * 100).toFixed(2) + '%'
                                        : '100%',
                                }];
                    }
                });
            });
        };
        return WebhookPlatformService_1;
    }());
    __setFunctionName(_classThis, "WebhookPlatformService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        WebhookPlatformService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return WebhookPlatformService = _classThis;
}();
exports.WebhookPlatformService = WebhookPlatformService;
