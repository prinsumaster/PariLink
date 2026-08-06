import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import * as crypto from 'crypto';

// ---------------------------------------------------------------------------
// Enterprise Envelope Encryption Service
//
// Architecture:
//   Key Encryption Key (KEK)  — loaded from environment / external KMS
//   Data Encryption Key (DEK) — generated per-tenant, stored encrypted
//
// Algorithm: AES-256-GCM (authenticated encryption — provides both
//            confidentiality AND integrity without a separate HMAC).
//
// Key Versioning:  Every encrypted payload is tagged with the KEK version
//                  used.  On rotation, old payloads remain decryptable via
//                  the versioned key store until re-encrypted.
//
// Compliance:
//   • FIPS 140-2 Level 1 compatible (Node.js native crypto)
//   • ISO 27001 A.10 — Cryptography
//   • DPDP Act 2023 — data-at-rest protection requirement
// ---------------------------------------------------------------------------

interface EncryptedPayload {
  v: string; // key version, e.g. "v1"
  iv: string; // 16 bytes hex (96-bit nonce for GCM is 12 bytes, we use 16 for CBC compat note)
  ct: string; // cipher text hex
  tag: string; // auth tag hex
}

interface DataKey {
  raw: Buffer; // never persisted; only used in-memory
  encryptedDek: string;
  iv: string;
  tag: string;
  version: string;
}

@Injectable()
export class EnvelopeEncryptionService implements OnModuleInit {
  private readonly logger = new Logger(EnvelopeEncryptionService.name);

  // Versioned KEK store — supports rotation without downtime.
  // Keys are 32-byte hex strings loaded from environment.
  private readonly kekStore: Map<string, Buffer> = new Map();
  private activeKekVersion: string = 'v1';

  onModuleInit() {
    this.loadKeys();
  }

  private loadKeys() {
    // Active key (v1)
    const kek1 = process.env.MASTER_ENCRYPTION_KEY_V1;
    if (!kek1 || Buffer.from(kek1, 'hex').length !== 32) {
      throw new Error(
        'CRITICAL: MASTER_ENCRYPTION_KEY_V1 is missing or invalid. Ephemeral keys are strictly forbidden.',
      );
    }
    this.kekStore.set('v1', Buffer.from(kek1, 'hex'));
    this.logger.log('KEK v1 loaded successfully');

    // Rotation key (v2) — pre-loaded for zero-downtime rotation
    const kek2 = process.env.MASTER_ENCRYPTION_KEY_V2;
    if (kek2 && Buffer.from(kek2, 'hex').length === 32) {
      this.kekStore.set('v2', Buffer.from(kek2, 'hex'));
      this.activeKekVersion = 'v2'; // promote to active on presence
      this.logger.log('KEK v2 loaded — rotation in progress, v2 is now active');
    }
  }

  private getKek(version = this.activeKekVersion): Buffer {
    const kek = this.kekStore.get(version);
    if (!kek) throw new Error(`KEK version ${version} not found`);
    return kek;
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Tenant Data Key Management
  // ─────────────────────────────────────────────────────────────────────────

  /** Generate a fresh DEK for a new tenant. Returns the encrypted form to
   *  persist in the database, and the raw key for immediate use. */
  generateTenantDataKey(tenantId: string): DataKey {
    const rawDek = crypto.randomBytes(32);
    const { ct, iv, tag } = this.encryptWithKek(rawDek.toString('hex'));
    this.logger.debug(`[KMS] Generated DEK for tenant ${tenantId}`);
    return {
      raw: rawDek,
      encryptedDek: ct,
      iv,
      tag,
      version: this.activeKekVersion,
    };
  }

  /** Decrypt a tenant's stored DEK to retrieve the raw key for use in
   *  encrypting/decrypting tenant data. */
  decryptTenantDataKey(
    encryptedDek: string,
    ivHex: string,
    tagHex: string,
    version = 'v1',
  ): Buffer {
    const rawHex = this.decryptWithKek(encryptedDek, ivHex, tagHex, version);
    return Buffer.from(rawHex, 'hex');
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Field-level Encryption (PII, Financial data, Secrets)
  // ─────────────────────────────────────────────────────────────────────────

  /** Encrypt a field with the platform's active KEK directly.
   *  Use this for secrets, credentials, and sensitive config fields. */
  encryptField(plaintext: string): string {
    const { ct, iv, tag } = this.encryptWithKek(plaintext);
    const payload: EncryptedPayload = { v: this.activeKekVersion, iv, ct, tag };
    return 'enc:' + Buffer.from(JSON.stringify(payload)).toString('base64url');
  }

  /** Decrypt a field encrypted by encryptField(). Auto-detects version. */
  decryptField(encryptedValue: string): string {
    if (!encryptedValue.startsWith('enc:')) {
      return encryptedValue; // Not encrypted — return as-is (backwards compat)
    }
    const payload: EncryptedPayload = JSON.parse(
      Buffer.from(encryptedValue.slice(4), 'base64url').toString('utf8'),
    );
    return this.decryptWithKek(payload.ct, payload.iv, payload.tag, payload.v);
  }

  /** Returns true if the field is encrypted with an older KEK version.
   *  Callers can use this to trigger background re-encryption during rotation. */
  needsReEncryption(encryptedValue: string): boolean {
    if (!encryptedValue.startsWith('enc:')) return false;
    const payload: EncryptedPayload = JSON.parse(
      Buffer.from(encryptedValue.slice(4), 'base64url').toString('utf8'),
    );
    return payload.v !== this.activeKekVersion;
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Password Hashing — Argon2id (recommended by OWASP 2024)
  // ─────────────────────────────────────────────────────────────────────────
  // NOTE: bcryptjs is already in use across the codebase (legacy).
  // New user accounts should use argon2 (memory-hard, side-channel resistant).
  // We expose the argon2 methods here so the AuthService can migrate gradually.

  async hashPasswordArgon2(password: string): Promise<string> {
    // Dynamic import — argon2 is an optional dependency.
    // Falls back to bcrypt gracefully if argon2 is not installed.
    try {
      const argon2 = require('argon2');
      return argon2.hash(password, {
        type: argon2.argon2id,
        memoryCost: 65536,
        timeCost: 3,
        parallelism: 4,
      });
    } catch {
      this.logger.warn(
        'argon2 not installed — falling back to bcrypt for password hashing',
      );
      const bcrypt = await import('bcryptjs');
      return bcrypt.hash(password, 14);
    }
  }

  async verifyPasswordArgon2(password: string, hash: string): Promise<boolean> {
    try {
      const argon2 = require('argon2');
      return argon2.verify(hash, password);
    } catch {
      const bcrypt = await import('bcryptjs');
      return bcrypt.compare(password, hash);
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Tamper-Evident Hashing (Audit Log integrity anchors)
  // ─────────────────────────────────────────────────────────────────────────

  /** HMAC-SHA256 using the active KEK as the signing key.
   *  Used for producing tamper-evident checksums on audit records. */
  hmacSign(data: string): string {
    return crypto
      .createHmac('sha256', this.getKek())
      .update(data)
      .digest('hex');
  }

  hmacVerify(data: string, expectedHmac: string): boolean {
    const actual = this.hmacSign(data);
    // Constant-time comparison to prevent timing attacks
    return crypto.timingSafeEqual(
      Buffer.from(actual, 'hex'),
      Buffer.from(expectedHmac, 'hex'),
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // API Key Generation
  // ─────────────────────────────────────────────────────────────────────────

  generateApiKey(prefix = 'pl'): { raw: string; hash: string } {
    const rawKey = `${prefix}_live_${crypto.randomBytes(24).toString('base64url')}`;
    const hash = crypto.createHash('sha256').update(rawKey).digest('hex');
    return { raw: rawKey, hash };
  }

  /** Secure random token generation for refresh tokens, invitation codes, etc. */
  generateSecureToken(byteLength = 32): string {
    return crypto.randomBytes(byteLength).toString('base64url');
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Internal helpers
  // ─────────────────────────────────────────────────────────────────────────

  private encryptWithKek(plaintext: string): {
    ct: string;
    iv: string;
    tag: string;
  } {
    const kek = this.getKek();
    const iv = crypto.randomBytes(12); // 96-bit nonce — optimal for AES-256-GCM
    const cipher = crypto.createCipheriv('aes-256-gcm', kek, iv);
    let ct = cipher.update(plaintext, 'utf8', 'hex');
    ct += cipher.final('hex');
    const tag = cipher.getAuthTag().toString('hex');
    return { ct, iv: iv.toString('hex'), tag };
  }

  private decryptWithKek(
    ct: string,
    ivHex: string,
    tagHex: string,
    version: string,
  ): string {
    const kek = this.getKek(version);
    const iv = Buffer.from(ivHex, 'hex');
    const tag = Buffer.from(tagHex, 'hex');
    const decipher = crypto.createDecipheriv('aes-256-gcm', kek, iv);
    decipher.setAuthTag(tag);
    let pt = decipher.update(ct, 'hex', 'utf8');
    pt += decipher.final('utf8');
    return pt;
  }
}
