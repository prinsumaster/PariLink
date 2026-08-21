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
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntegrationAuthService = void 0;
var common_1 = require("@nestjs/common");
var crypto = __importStar(require("crypto"));
var IntegrationAuthService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var IntegrationAuthService = _classThis = /** @class */ (function () {
        function IntegrationAuthService_1() {
            this.logger = new common_1.Logger(IntegrationAuthService.name);
            // In production, this MUST come from an environment variable (e.g. process.env.IPAAS_MASTER_KEY)
            // For V1 validation, we use a static 32-byte key
            this.ENCRYPTION_KEY = Buffer.from('12345678901234567890123456789012'); // 32 bytes
            this.ALGORITHM = 'aes-256-gcm';
        }
        /**
         * Encrypts sensitive credentials before storing in the database
         */
        IntegrationAuthService_1.prototype.encryptCredentials = function (credentials) {
            try {
                var iv = crypto.randomBytes(16);
                var cipher = crypto.createCipheriv(this.ALGORITHM, this.ENCRYPTION_KEY, iv);
                var encrypted = cipher.update(JSON.stringify(credentials), 'utf8', 'hex');
                encrypted += cipher.final('hex');
                var authTag = cipher.getAuthTag().toString('hex');
                // Store IV and AuthTag alongside the encrypted payload
                return JSON.stringify({
                    iv: iv.toString('hex'),
                    content: encrypted,
                    tag: authTag,
                });
            }
            catch (e) {
                this.logger.error("Failed to encrypt credentials: ".concat(e.message));
                throw new Error('Encryption failed');
            }
        };
        /**
         * Decrypts credentials retrieved from the database
         */
        IntegrationAuthService_1.prototype.decryptCredentials = function (encryptedPayloadString) {
            try {
                var payload = JSON.parse(encryptedPayloadString);
                var decipher = crypto.createDecipheriv(this.ALGORITHM, this.ENCRYPTION_KEY, Buffer.from(payload.iv, 'hex'));
                decipher.setAuthTag(Buffer.from(payload.tag, 'hex'));
                var decrypted = decipher.update(payload.content, 'hex', 'utf8');
                decrypted += decipher.final('utf8');
                return JSON.parse(decrypted);
            }
            catch (e) {
                this.logger.error("Failed to decrypt credentials: ".concat(e.message));
                throw new Error('Decryption failed');
            }
        };
        /**
         * Validates an HMAC signature for incoming webhooks
         */
        IntegrationAuthService_1.prototype.verifyWebhookSignature = function (payload, signature, secret) {
            var expectedSignature = crypto
                .createHmac('sha256', secret)
                .update(payload)
                .digest('hex');
            var signatureBuffer = Buffer.from(signature, 'utf8');
            var expectedBuffer = Buffer.from(expectedSignature, 'utf8');
            if (signatureBuffer.length !== expectedBuffer.length) {
                return false;
            }
            return crypto.timingSafeEqual(signatureBuffer, expectedBuffer);
        };
        return IntegrationAuthService_1;
    }());
    __setFunctionName(_classThis, "IntegrationAuthService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        IntegrationAuthService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return IntegrationAuthService = _classThis;
}();
exports.IntegrationAuthService = IntegrationAuthService;
