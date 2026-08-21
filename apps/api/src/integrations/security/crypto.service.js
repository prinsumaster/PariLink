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
exports.CryptoService = void 0;
var common_1 = require("@nestjs/common");
var crypto = __importStar(require("crypto"));
var CryptoService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var CryptoService = _classThis = /** @class */ (function () {
        function CryptoService_1() {
            this.logger = new common_1.Logger(CryptoService.name);
            // In production, this would be injected via AWS KMS or HashiCorp Vault.
            // Using an environment variable for MVP.
            this.algorithm = 'aes-256-gcm';
            var keyString = process.env.ENCRYPTION_KEY || 'default_integration_secret_key_32'; // Must be exactly 32 bytes for aes-256
            // Pad or truncate to 32 bytes
            this.encryptionKey = crypto.scryptSync(keyString, 'salt', 32);
        }
        CryptoService_1.prototype.encrypt = function (text) {
            try {
                var iv = crypto.randomBytes(16);
                var cipher = crypto.createCipheriv(this.algorithm, this.encryptionKey, iv);
                var encrypted = cipher.update(text, 'utf8', 'hex');
                encrypted += cipher.final('hex');
                var authTag = cipher.getAuthTag().toString('hex');
                return {
                    iv: iv.toString('hex'),
                    content: encrypted,
                    authTag: authTag,
                };
            }
            catch (e) {
                var errorMessage = e instanceof Error ? e.message : String(e);
                this.logger.error("Encryption failed: ".concat(errorMessage));
                throw new Error('Encryption failed');
            }
        };
        CryptoService_1.prototype.decrypt = function (hash) {
            try {
                var decipher = crypto.createDecipheriv(this.algorithm, this.encryptionKey, Buffer.from(hash.iv, 'hex'));
                decipher.setAuthTag(Buffer.from(hash.authTag, 'hex'));
                var decrypted = decipher.update(hash.content, 'hex', 'utf8');
                decrypted += decipher.final('utf8');
                return decrypted;
            }
            catch (e) {
                var errorMessage = e instanceof Error ? e.message : String(e);
                this.logger.error("Decryption failed: ".concat(errorMessage));
                throw new Error('Decryption failed');
            }
        };
        CryptoService_1.prototype.generateApiKey = function () {
            return 'sk_live_' + crypto.randomBytes(24).toString('base64url');
        };
        CryptoService_1.prototype.hashApiKey = function (apiKey) {
            return crypto.createHash('sha256').update(apiKey).digest('hex');
        };
        return CryptoService_1;
    }());
    __setFunctionName(_classThis, "CryptoService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        CryptoService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return CryptoService = _classThis;
}();
exports.CryptoService = CryptoService;
