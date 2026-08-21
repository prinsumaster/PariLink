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
exports.GatewayController = void 0;
var common_1 = require("@nestjs/common");
var swagger_1 = require("@nestjs/swagger");
/**
 * Very simple mock API Guard for MVP Gateway
 */
var common_2 = require("@nestjs/common");
var ApiKeyAuthGuard = function () {
    var _classDecorators = [(0, common_2.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var ApiKeyAuthGuard = _classThis = /** @class */ (function () {
        function ApiKeyAuthGuard_1(prisma, crypto) {
            this.prisma = prisma;
            this.crypto = crypto;
            this.logger = new common_2.Logger(ApiKeyAuthGuard.name);
        }
        ApiKeyAuthGuard_1.prototype.canActivate = function (context) {
            return __awaiter(this, void 0, void 0, function () {
                var request, apiKey, hashedKey, credential;
                var _this = this;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            request = context.switchToHttp().getRequest();
                            apiKey = request.headers['x-api-key'] ||
                                ((_a = request.headers['authorization']) === null || _a === void 0 ? void 0 : _a.replace('Bearer ', ''));
                            if (!apiKey) {
                                throw new common_2.UnauthorizedException('API Key missing');
                            }
                            hashedKey = this.crypto.hashApiKey(apiKey);
                            return [4 /*yield*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.apiCredential.findFirst({
                                                where: { apiKeyHash: hashedKey },
                                            })];
                                    });
                                }); })];
                        case 1:
                            credential = _b.sent();
                            if (!credential) {
                                throw new common_2.UnauthorizedException('Invalid API Key');
                            }
                            if (credential.expiresAt && credential.expiresAt < new Date()) {
                                throw new common_2.UnauthorizedException('API Key expired');
                            }
                            // Attach company info to request
                            request.companyId = credential.companyId;
                            // Log request asynchronously
                            this.prisma
                                .runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    return [2 /*return*/, tx.apiRequestLog.create({
                                            data: {
                                                companyId: credential.companyId,
                                                endpoint: request.url,
                                                method: request.method,
                                                statusCode: 200,
                                                latencyMs: 0,
                                                ipAddress: request.ip,
                                                userAgent: request.headers['user-agent'],
                                            },
                                        })];
                                });
                            }); })
                                .catch(function (e) { return _this.logger.error('Failed to log API request', e); });
                            return [2 /*return*/, true];
                    }
                });
            });
        };
        return ApiKeyAuthGuard_1;
    }());
    __setFunctionName(_classThis, "ApiKeyAuthGuard");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ApiKeyAuthGuard = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ApiKeyAuthGuard = _classThis;
}();
var GatewayController = function () {
    var _classDecorators = [(0, swagger_1.ApiTags)('gateway'), (0, swagger_1.ApiSecurity)('x-api-key'), (0, common_1.UseGuards)(ApiKeyAuthGuard), (0, common_1.Controller)('gateway/v1')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _healthCheck_decorators;
    var _getLoads_decorators;
    var GatewayController = _classThis = /** @class */ (function () {
        function GatewayController_1(prisma) {
            this.prisma = (__runInitializers(this, _instanceExtraInitializers), prisma);
        }
        GatewayController_1.prototype.healthCheck = function () {
            return { status: 'OK', version: '1.0.0' };
        };
        GatewayController_1.prototype.getLoads = function (req) {
            return __awaiter(this, void 0, void 0, function () {
                var loads;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    return [2 /*return*/, tx.load.findMany({
                                            where: { companyId: req.companyId },
                                            take: 50,
                                        })];
                                });
                            }); })];
                        case 1:
                            loads = _a.sent();
                            return [2 /*return*/, { data: loads }];
                    }
                });
            });
        };
        return GatewayController_1;
    }());
    __setFunctionName(_classThis, "GatewayController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _healthCheck_decorators = [(0, common_1.Get)('health'), (0, swagger_1.ApiOperation)({ summary: 'API Gateway Health Check' })];
        _getLoads_decorators = [(0, common_1.Get)('loads'), (0, swagger_1.ApiOperation)({ summary: 'Get loads via API Gateway' })];
        __esDecorate(_classThis, null, _healthCheck_decorators, { kind: "method", name: "healthCheck", static: false, private: false, access: { has: function (obj) { return "healthCheck" in obj; }, get: function (obj) { return obj.healthCheck; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getLoads_decorators, { kind: "method", name: "getLoads", static: false, private: false, access: { has: function (obj) { return "getLoads" in obj; }, get: function (obj) { return obj.getLoads; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        GatewayController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return GatewayController = _classThis;
}();
exports.GatewayController = GatewayController;
