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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TwilioService = void 0;
var common_1 = require("@nestjs/common");
var twilio_1 = __importDefault(require("twilio"));
var TwilioService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var TwilioService = _classThis = /** @class */ (function () {
        function TwilioService_1(secretsService, circuitBreaker) {
            this.secretsService = secretsService;
            this.circuitBreaker = circuitBreaker;
            this.logger = new common_1.Logger(TwilioService.name);
        }
        TwilioService_1.prototype.getClientInfo = function () {
            return __awaiter(this, void 0, void 0, function () {
                var sid, token, phone;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.secretsService.retrieveIntegrationSecret('SYSTEM', 'TWILIO', 'ACCOUNT_SID')];
                        case 1:
                            sid = _a.sent();
                            return [4 /*yield*/, this.secretsService.retrieveIntegrationSecret('SYSTEM', 'TWILIO', 'AUTH_TOKEN')];
                        case 2:
                            token = _a.sent();
                            return [4 /*yield*/, this.secretsService.retrieveIntegrationSecret('SYSTEM', 'TWILIO', 'PHONE_NUMBER')];
                        case 3:
                            phone = _a.sent();
                            if (!sid || !token || !phone) {
                                this.logger.warn('Twilio credentials missing from SecretsService. WhatsApp dispatch disabled.');
                                return [2 /*return*/, null];
                            }
                            return [2 /*return*/, {
                                    client: (0, twilio_1.default)(sid, token),
                                    fromPhone: phone,
                                }];
                    }
                });
            });
        };
        TwilioService_1.prototype.sendWhatsAppMessage = function (to, message) {
            return __awaiter(this, void 0, void 0, function () {
                var twilioInfo, response, error_1;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.getClientInfo()];
                        case 1:
                            twilioInfo = _a.sent();
                            if (!twilioInfo) {
                                this.logger.warn("Simulating WhatsApp to ".concat(to, ": ").concat(message));
                                return [2 /*return*/, { sid: 'mock_sid' }];
                            }
                            _a.label = 2;
                        case 2:
                            _a.trys.push([2, 4, , 5]);
                            return [4 /*yield*/, this.circuitBreaker.execute('TWILIO', function () { return __awaiter(_this, void 0, void 0, function () {
                                    var timeoutMs, timeoutPromise;
                                    return __generator(this, function (_a) {
                                        timeoutMs = 5000;
                                        timeoutPromise = new Promise(function (_, reject) {
                                            return setTimeout(function () { return reject(new Error('Twilio request timed out')); }, timeoutMs);
                                        });
                                        return [2 /*return*/, Promise.race([
                                                twilioInfo.client.messages.create({
                                                    body: message,
                                                    from: "whatsapp:".concat(twilioInfo.fromPhone),
                                                    to: "whatsapp:".concat(to),
                                                }),
                                                timeoutPromise,
                                            ])];
                                    });
                                }); }, { retryCount: 3, resetTimeoutMs: 15000, retryBaseDelayMs: 200 })];
                        case 3:
                            response = _a.sent();
                            this.logger.log("WhatsApp message sent to ".concat(to, ", SID: ").concat(response.sid));
                            return [2 /*return*/, response];
                        case 4:
                            error_1 = _a.sent();
                            this.logger.error('Failed to send WhatsApp message via Twilio', error_1);
                            throw error_1;
                        case 5: return [2 /*return*/];
                    }
                });
            });
        };
        return TwilioService_1;
    }());
    __setFunctionName(_classThis, "TwilioService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        TwilioService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return TwilioService = _classThis;
}();
exports.TwilioService = TwilioService;
