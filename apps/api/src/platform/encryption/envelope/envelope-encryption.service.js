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
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnvelopeEncryptionService = void 0;
var common_1 = require("@nestjs/common");
var crypto = __importStar(require("crypto"));
var EnvelopeEncryptionService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var EnvelopeEncryptionService = _classThis = /** @class */ (function () {
        function EnvelopeEncryptionService_1() {
            this.logger = new common_1.Logger(EnvelopeEncryptionService.name);
            // Versioned KEK store — supports rotation without downtime.
            // Keys are 32-byte hex strings loaded from environment.
            this.kekStore = new Map();
            this.activeKekVersion = 'v1';
        }
        EnvelopeEncryptionService_1.prototype.onModuleInit = function () {
            this.loadKeys();
        };
        EnvelopeEncryptionService_1.prototype.loadKeys = function () {
            // Active key (v1)
            var kek1 = process.env.MASTER_ENCRYPTION_KEY_V1;
            if (!kek1 || Buffer.from(kek1, 'hex').length !== 32) {
                throw new Error('CRITICAL: MASTER_ENCRYPTION_KEY_V1 is missing or invalid. Ephemeral keys are strictly forbidden.');
            }
            this.kekStore.set('v1', Buffer.from(kek1, 'hex'));
            this.logger.log('KEK v1 loaded successfully');
            // Rotation key (v2) — pre-loaded for zero-downtime rotation
            var kek2 = process.env.MASTER_ENCRYPTION_KEY_V2;
            if (kek2 && Buffer.from(kek2, 'hex').length === 32) {
                this.kekStore.set('v2', Buffer.from(kek2, 'hex'));
                this.activeKekVersion = 'v2'; // promote to active on presence
                this.logger.log('KEK v2 loaded — rotation in progress, v2 is now active');
            }
        };
        EnvelopeEncryptionService_1.prototype.getKek = function (version) {
            if (version === void 0) { version = this.activeKekVersion; }
            var kek = this.kekStore.get(version);
            if (!kek)
                throw new Error("KEK version ".concat(version, " not found"));
            return kek;
        };
        // ─────────────────────────────────────────────────────────────────────────
        // Tenant Data Key Management
        // ─────────────────────────────────────────────────────────────────────────
        /** Generate a fresh DEK for a new tenant. Returns the encrypted form to
         *  persist in the database, and the raw key for immediate use. */
        EnvelopeEncryptionService_1.prototype.generateTenantDataKey = function (tenantId) {
            var rawDek = crypto.randomBytes(32);
            var _a = this.encryptWithKek(rawDek.toString('hex')), ct = _a.ct, iv = _a.iv, tag = _a.tag;
            this.logger.debug("[KMS] Generated DEK for tenant ".concat(tenantId));
            return {
                raw: rawDek,
                encryptedDek: ct,
                iv: iv,
                tag: tag,
                version: this.activeKekVersion,
            };
        };
        /** Decrypt a tenant's stored DEK to retrieve the raw key for use in
         *  encrypting/decrypting tenant data. */
        EnvelopeEncryptionService_1.prototype.decryptTenantDataKey = function (encryptedDek, ivHex, tagHex, version) {
            if (version === void 0) { version = 'v1'; }
            var rawHex = this.decryptWithKek(encryptedDek, ivHex, tagHex, version);
            return Buffer.from(rawHex, 'hex');
        };
        // ─────────────────────────────────────────────────────────────────────────
        // Field-level Encryption (PII, Financial data, Secrets)
        // ─────────────────────────────────────────────────────────────────────────
        /** Encrypt a field with the platform's active KEK directly.
         *  Use this for secrets, credentials, and sensitive config fields. */
        EnvelopeEncryptionService_1.prototype.encryptField = function (plaintext) {
            var _a = this.encryptWithKek(plaintext), ct = _a.ct, iv = _a.iv, tag = _a.tag;
            var payload = { v: this.activeKekVersion, iv: iv, ct: ct, tag: tag };
            return 'enc:' + Buffer.from(JSON.stringify(payload)).toString('base64url');
        };
        /** Decrypt a field encrypted by encryptField(). Auto-detects version. */
        EnvelopeEncryptionService_1.prototype.decryptField = function (encryptedValue) {
            if (!encryptedValue.startsWith('enc:')) {
                return encryptedValue; // Not encrypted — return as-is (backwards compat)
            }
            var payload = JSON.parse(Buffer.from(encryptedValue.slice(4), 'base64url').toString('utf8'));
            return this.decryptWithKek(payload.ct, payload.iv, payload.tag, payload.v);
        };
        /** Returns true if the field is encrypted with an older KEK version.
         *  Callers can use this to trigger background re-encryption during rotation. */
        EnvelopeEncryptionService_1.prototype.needsReEncryption = function (encryptedValue) {
            if (!encryptedValue.startsWith('enc:'))
                return false;
            var payload = JSON.parse(Buffer.from(encryptedValue.slice(4), 'base64url').toString('utf8'));
            return payload.v !== this.activeKekVersion;
        };
        // ─────────────────────────────────────────────────────────────────────────
        // Password Hashing — Argon2id (recommended by OWASP 2024)
        // ─────────────────────────────────────────────────────────────────────────
        // NOTE: bcryptjs is already in use across the codebase (legacy).
        // New user accounts should use argon2 (memory-hard, side-channel resistant).
        // We expose the argon2 methods here so the AuthService can migrate gradually.
        EnvelopeEncryptionService_1.prototype.hashPasswordArgon2 = function (password) {
            return __awaiter(this, void 0, void 0, function () {
                var argon2, _a, bcrypt_1;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 1, , 3]);
                            argon2 = require('argon2');
                            return [2 /*return*/, argon2.hash(password, {
                                    type: argon2.argon2id,
                                    memoryCost: 65536,
                                    timeCost: 3,
                                    parallelism: 4,
                                })];
                        case 1:
                            _a = _b.sent();
                            this.logger.warn('argon2 not installed — falling back to bcrypt for password hashing');
                            return [4 /*yield*/, Promise.resolve().then(function () { return __importStar(require('bcryptjs')); })];
                        case 2:
                            bcrypt_1 = _b.sent();
                            return [2 /*return*/, bcrypt_1.hash(password, 14)];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        EnvelopeEncryptionService_1.prototype.verifyPasswordArgon2 = function (password, hash) {
            return __awaiter(this, void 0, void 0, function () {
                var argon2, _a, bcrypt_2;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 1, , 3]);
                            argon2 = require('argon2');
                            return [2 /*return*/, argon2.verify(hash, password)];
                        case 1:
                            _a = _b.sent();
                            return [4 /*yield*/, Promise.resolve().then(function () { return __importStar(require('bcryptjs')); })];
                        case 2:
                            bcrypt_2 = _b.sent();
                            return [2 /*return*/, bcrypt_2.compare(password, hash)];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        // ─────────────────────────────────────────────────────────────────────────
        // Tamper-Evident Hashing (Audit Log integrity anchors)
        // ─────────────────────────────────────────────────────────────────────────
        /** HMAC-SHA256 using the active KEK as the signing key.
         *  Used for producing tamper-evident checksums on audit records. */
        EnvelopeEncryptionService_1.prototype.hmacSign = function (data) {
            return crypto
                .createHmac('sha256', this.getKek())
                .update(data)
                .digest('hex');
        };
        EnvelopeEncryptionService_1.prototype.hmacVerify = function (data, expectedHmac) {
            var actual = this.hmacSign(data);
            // Constant-time comparison to prevent timing attacks
            return crypto.timingSafeEqual(Buffer.from(actual, 'hex'), Buffer.from(expectedHmac, 'hex'));
        };
        // ─────────────────────────────────────────────────────────────────────────
        // API Key Generation
        // ─────────────────────────────────────────────────────────────────────────
        EnvelopeEncryptionService_1.prototype.generateApiKey = function (prefix) {
            if (prefix === void 0) { prefix = 'pl'; }
            var rawKey = "".concat(prefix, "_live_").concat(crypto.randomBytes(24).toString('base64url'));
            var hash = crypto.createHash('sha256').update(rawKey).digest('hex');
            return { raw: rawKey, hash: hash };
        };
        /** Secure random token generation for refresh tokens, invitation codes, etc. */
        EnvelopeEncryptionService_1.prototype.generateSecureToken = function (byteLength) {
            if (byteLength === void 0) { byteLength = 32; }
            return crypto.randomBytes(byteLength).toString('base64url');
        };
        // ─────────────────────────────────────────────────────────────────────────
        // Internal helpers
        // ─────────────────────────────────────────────────────────────────────────
        EnvelopeEncryptionService_1.prototype.encryptWithKek = function (plaintext) {
            var kek = this.getKek();
            var iv = crypto.randomBytes(12); // 96-bit nonce — optimal for AES-256-GCM
            var cipher = crypto.createCipheriv('aes-256-gcm', kek, iv);
            var ct = cipher.update(plaintext, 'utf8', 'hex');
            ct += cipher.final('hex');
            var tag = cipher.getAuthTag().toString('hex');
            return { ct: ct, iv: iv.toString('hex'), tag: tag };
        };
        EnvelopeEncryptionService_1.prototype.decryptWithKek = function (ct, ivHex, tagHex, version) {
            var kek = this.getKek(version);
            var iv = Buffer.from(ivHex, 'hex');
            var tag = Buffer.from(tagHex, 'hex');
            var decipher = crypto.createDecipheriv('aes-256-gcm', kek, iv);
            decipher.setAuthTag(tag);
            var pt = decipher.update(ct, 'hex', 'utf8');
            pt += decipher.final('utf8');
            return pt;
        };
        return EnvelopeEncryptionService_1;
    }());
    __setFunctionName(_classThis, "EnvelopeEncryptionService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        EnvelopeEncryptionService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return EnvelopeEncryptionService = _classThis;
}();
exports.EnvelopeEncryptionService = EnvelopeEncryptionService;
