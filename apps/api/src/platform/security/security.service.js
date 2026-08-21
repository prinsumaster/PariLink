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
exports.SecurityContextService = void 0;
var common_1 = require("@nestjs/common");
var crypto = __importStar(require("crypto"));
var SecurityContextService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var SecurityContextService = _classThis = /** @class */ (function () {
        function SecurityContextService_1() {
            this.logger = new common_1.Logger(SecurityContextService.name);
            this.IV_LENGTH = 16;
            var key = process.env.ENCRYPTION_KEY;
            if (process.env.NODE_ENV === 'production') {
                if (!key || key === 'default-32-byte-secret-key-0000') {
                    throw new Error('CRITICAL: ENCRYPTION_KEY is not set or uses a default insecure value in production.');
                }
                if (Buffer.from(key).length !== 32) {
                    throw new Error('CRITICAL: ENCRYPTION_KEY must be exactly 32 bytes.');
                }
                this.ENCRYPTION_KEY = key;
            }
            else {
                // Development fallback
                this.ENCRYPTION_KEY = key || 'default-32-byte-secret-key-0000';
            }
        }
        /**
         * Generates a secure API key for third-party integrations
         */
        SecurityContextService_1.prototype.generateApiKey = function (prefix) {
            if (prefix === void 0) { prefix = 'pl'; }
            var rawKey = "".concat(prefix, "_").concat(crypto.randomBytes(24).toString('base64url'));
            var hash = crypto.createHash('sha256').update(rawKey).digest('hex');
            return { raw: rawKey, hash: hash };
        };
        /**
         * Symmetrically encrypts a secret (e.g., vendor credentials, third-party API keys)
         */
        SecurityContextService_1.prototype.encryptSecret = function (text) {
            var iv = crypto.randomBytes(this.IV_LENGTH);
            var cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(this.ENCRYPTION_KEY.padEnd(32, '0').slice(0, 32)), iv);
            var encrypted = cipher.update(text, 'utf8', 'hex');
            encrypted += cipher.final('hex');
            return iv.toString('hex') + ':' + encrypted;
        };
        /**
         * Decrypts a stored secret
         */
        SecurityContextService_1.prototype.decryptSecret = function (text) {
            var textParts = text.split(':');
            var iv = Buffer.from(textParts.shift(), 'hex');
            var encryptedText = Buffer.from(textParts.join(':'), 'hex');
            var decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(this.ENCRYPTION_KEY.padEnd(32, '0').slice(0, 32)), iv);
            var decrypted = decipher.update(encryptedText);
            decrypted = Buffer.concat([decrypted, decipher.final()]);
            return decrypted.toString();
        };
        return SecurityContextService_1;
    }());
    __setFunctionName(_classThis, "SecurityContextService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        SecurityContextService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return SecurityContextService = _classThis;
}();
exports.SecurityContextService = SecurityContextService;
