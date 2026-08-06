import { Injectable, Logger } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class CryptoPlatformService {
  private readonly logger = new Logger(CryptoPlatformService.name);

  // In a real cloud environment, this Master Key (KEK) is managed by AWS KMS / Azure Key Vault
  private readonly kek = Buffer.from(
    process.env.MASTER_ENCRYPTION_KEY || crypto.randomBytes(32).toString('hex'),
    'hex',
  );

  /**
   * Generates a Data Encryption Key (DEK) and encrypts it using the KEK (Envelope Encryption)
   */
  generateTenantDataKey(tenantId: string) {
    this.logger.debug(`[Enterprise KMS] Generating DEK for tenant ${tenantId}`);

    // The raw DEK is used to encrypt data (should never be stored directly)
    const rawDek = crypto.randomBytes(32);

    // Encrypt the DEK with the KEK
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-gcm', this.kek, iv);

    let encryptedDek = cipher.update(rawDek.toString('hex'), 'utf8', 'hex');
    encryptedDek += cipher.final('hex');
    const authTag = cipher.getAuthTag().toString('hex');

    return {
      encryptedDek,
      iv: iv.toString('hex'),
      authTag,
      version: 'v1',
    };
  }

  /**
   * Decrypts the DEK using the KEK so the application can use it to encrypt/decrypt tenant data in memory
   */
  decryptTenantDataKey(
    encryptedDek: string,
    ivHex: string,
    authTagHex: string,
  ): Buffer {
    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');
    const decipher = crypto.createDecipheriv('aes-256-gcm', this.kek, iv);

    decipher.setAuthTag(authTag);

    let rawDekHex = decipher.update(encryptedDek, 'hex', 'utf8');
    rawDekHex += decipher.final('utf8');

    return Buffer.from(rawDekHex, 'hex');
  }
}
