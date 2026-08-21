"use strict";
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
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PiiEncryptionService = exports.PII_ENCRYPTED_FIELDS = void 0;
var common_1 = require("@nestjs/common");
// ---------------------------------------------------------------------------
// PII Field-Level Encryption Service
//
// Provides transparent encrypt/decrypt for sensitive PII fields across
// domain entities (Driver, Customer, Vendor, Broker, User, Company).
//
// Architecture:
//   Uses EnvelopeEncryptionService (AES-256-GCM) under the hood.
//   Encrypted values are prefixed with 'enc:' for auto-detection.
//
// Usage:
//   const encrypted = piiService.encryptFields(driverDto, ['licenseNumber', 'phone']);
//   const decrypted = piiService.decryptFields(driverRecord, ['licenseNumber', 'phone']);
//
// Compliance:
//   • DPDP Act 2023 (India) — data-at-rest encryption for personal data
//   • GDPR Art. 32 — pseudonymisation and encryption
//   • ISO 27001 A.10 — Cryptographic controls
//   • SOC 2 CC6.1 — Logical and physical access controls
// ---------------------------------------------------------------------------
/** Field names that contain PII and must be encrypted at rest. */
exports.PII_ENCRYPTED_FIELDS = {
    Driver: ['licenseNumber', 'phone', 'email'],
    Customer: ['phone', 'email', 'taxId'],
    Vendor: ['phone', 'email', 'taxId', 'bankAccount', 'ifscCode'],
    Broker: ['phone', 'email', 'panNumber', 'bankAccount', 'ifscCode'],
    User: ['phone', 'totpSecret'],
    Company: ['taxId', 'phone', 'email'],
};
var PiiEncryptionService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var PiiEncryptionService = _classThis = /** @class */ (function () {
        function PiiEncryptionService_1(encryption) {
            this.encryption = encryption;
            this.logger = new common_1.Logger(PiiEncryptionService.name);
        }
        /**
         * Encrypt specified fields in a data object.
         * Skips null/undefined values and already-encrypted values.
         * Returns a new object (does not mutate original).
         */
        PiiEncryptionService_1.prototype.encryptFields = function (data, fields) {
            var result = __assign({}, data);
            for (var _i = 0, fields_1 = fields; _i < fields_1.length; _i++) {
                var field = fields_1[_i];
                var value = result[field];
                if (value == null)
                    continue;
                if (typeof value !== 'string')
                    continue;
                if (value.startsWith('enc:'))
                    continue; // Already encrypted
                try {
                    result[field] = this.encryption.encryptField(value);
                }
                catch (err) {
                    this.logger.error("[PII] Failed to encrypt field '".concat(field, "': ").concat(err instanceof Error ? err.message : String(err)));
                }
            }
            return result;
        };
        /**
         * Decrypt specified fields in a data object.
         * Skips null/undefined values and non-encrypted values (backwards compat).
         * Returns a new object (does not mutate original).
         */
        PiiEncryptionService_1.prototype.decryptFields = function (data, fields) {
            var result = __assign({}, data);
            for (var _i = 0, fields_2 = fields; _i < fields_2.length; _i++) {
                var field = fields_2[_i];
                var value = result[field];
                if (value == null)
                    continue;
                if (typeof value !== 'string')
                    continue;
                if (!value.startsWith('enc:'))
                    continue; // Not encrypted
                try {
                    result[field] = this.encryption.decryptField(value);
                }
                catch (err) {
                    this.logger.error("[PII] Failed to decrypt field '".concat(field, "': ").concat(err instanceof Error ? err.message : String(err)));
                }
            }
            return result;
        };
        /**
         * Encrypt PII fields on a domain entity using the canonical registry.
         */
        PiiEncryptionService_1.prototype.encryptEntity = function (entityType, data) {
            var fields = exports.PII_ENCRYPTED_FIELDS[entityType];
            if (!fields)
                return data;
            return this.encryptFields(data, fields);
        };
        /**
         * Decrypt PII fields on a domain entity using the canonical registry.
         */
        PiiEncryptionService_1.prototype.decryptEntity = function (entityType, data) {
            var fields = exports.PII_ENCRYPTED_FIELDS[entityType];
            if (!fields)
                return data;
            return this.decryptFields(data, fields);
        };
        /**
         * Decrypt a list of entities (e.g. from findMany).
         */
        PiiEncryptionService_1.prototype.decryptEntities = function (entityType, data) {
            var _this = this;
            var fields = exports.PII_ENCRYPTED_FIELDS[entityType];
            if (!fields)
                return data;
            return data.map(function (item) { return _this.decryptFields(item, fields); });
        };
        /**
         * Check if a field value needs re-encryption (KEK rotated).
         */
        PiiEncryptionService_1.prototype.needsReEncryption = function (value) {
            return this.encryption.needsReEncryption(value);
        };
        /**
         * Returns the list of PII field names for a given entity type.
         */
        PiiEncryptionService_1.prototype.getFieldsForEntity = function (entityType) {
            var _a;
            return (_a = exports.PII_ENCRYPTED_FIELDS[entityType]) !== null && _a !== void 0 ? _a : [];
        };
        return PiiEncryptionService_1;
    }());
    __setFunctionName(_classThis, "PiiEncryptionService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        PiiEncryptionService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return PiiEncryptionService = _classThis;
}();
exports.PiiEncryptionService = PiiEncryptionService;
