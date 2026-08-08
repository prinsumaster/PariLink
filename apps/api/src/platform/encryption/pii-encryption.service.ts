import { Injectable, Logger } from '@nestjs/common';
import { EnvelopeEncryptionService } from './envelope/envelope-encryption.service';

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
export const PII_ENCRYPTED_FIELDS: Record<string, string[]> = {
  Driver: ['licenseNumber', 'phone', 'email'],
  Customer: ['phone', 'email', 'taxId'],
  Vendor: ['phone', 'email', 'taxId', 'bankAccount', 'ifscCode'],
  Broker: ['phone', 'email', 'panNumber', 'bankAccount', 'ifscCode'],
  User: ['phone', 'totpSecret'],
  Company: ['taxId', 'phone', 'email'],
};

@Injectable()
export class PiiEncryptionService {
  private readonly logger = new Logger(PiiEncryptionService.name);

  constructor(private readonly encryption: EnvelopeEncryptionService) {}

  /**
   * Encrypt specified fields in a data object.
   * Skips null/undefined values and already-encrypted values.
   * Returns a new object (does not mutate original).
   */
  encryptFields<T extends Record<string, any>>(data: T, fields: string[]): T {
    const result = { ...data };
    for (const field of fields) {
      const value = result[field];
      if (value == null) continue;
      if (typeof value !== 'string') continue;
      if (value.startsWith('enc:')) continue; // Already encrypted
      try {
        (result as any)[field] = this.encryption.encryptField(value);
      } catch (err) {
        this.logger.error(
          `[PII] Failed to encrypt field '${field}': ${err instanceof Error ? err.message : String(err)}`,
        );
      }
    }
    return result;
  }

  /**
   * Decrypt specified fields in a data object.
   * Skips null/undefined values and non-encrypted values (backwards compat).
   * Returns a new object (does not mutate original).
   */
  decryptFields<T extends Record<string, any>>(data: T, fields: string[]): T {
    const result = { ...data };
    for (const field of fields) {
      const value = result[field];
      if (value == null) continue;
      if (typeof value !== 'string') continue;
      if (!value.startsWith('enc:')) continue; // Not encrypted
      try {
        (result as any)[field] = this.encryption.decryptField(value);
      } catch (err) {
        this.logger.error(
          `[PII] Failed to decrypt field '${field}': ${err instanceof Error ? err.message : String(err)}`,
        );
      }
    }
    return result;
  }

  /**
   * Encrypt PII fields on a domain entity using the canonical registry.
   */
  encryptEntity<T extends Record<string, any>>(entityType: string, data: T): T {
    const fields = PII_ENCRYPTED_FIELDS[entityType];
    if (!fields) return data;
    return this.encryptFields(data, fields);
  }

  /**
   * Decrypt PII fields on a domain entity using the canonical registry.
   */
  decryptEntity<T extends Record<string, any>>(entityType: string, data: T): T {
    const fields = PII_ENCRYPTED_FIELDS[entityType];
    if (!fields) return data;
    return this.decryptFields(data, fields);
  }

  /**
   * Decrypt a list of entities (e.g. from findMany).
   */
  decryptEntities<T extends Record<string, any>>(
    entityType: string,
    data: T[],
  ): T[] {
    const fields = PII_ENCRYPTED_FIELDS[entityType];
    if (!fields) return data;
    return data.map((item) => this.decryptFields(item, fields));
  }

  /**
   * Check if a field value needs re-encryption (KEK rotated).
   */
  needsReEncryption(value: string): boolean {
    return this.encryption.needsReEncryption(value);
  }

  /**
   * Returns the list of PII field names for a given entity type.
   */
  getFieldsForEntity(entityType: string): string[] {
    return PII_ENCRYPTED_FIELDS[entityType] ?? [];
  }
}
