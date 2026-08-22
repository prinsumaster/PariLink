import { Injectable, Logger } from '@nestjs/common';
import * as crypto from 'crypto';
import { EnvelopeEncryptionService } from '../../platform/encryption/envelope/envelope-encryption.service';

@Injectable()
export class IntegrationAuthService {
  private readonly logger = new Logger(IntegrationAuthService.name);

  // In production, this MUST come from an environment variable (e.g. process.env.IPAAS_MASTER_KEY)
  // For V1 validation, we use a static 32-byte key
  private readonly ENCRYPTION_KEY = Buffer.from(
    '12345678901234567890123456789012',
  ); // 32 bytes
  private readonly ALGORITHM = 'aes-256-gcm';

  constructor(
    private readonly envelopeEncryption: EnvelopeEncryptionService
  ) {}

  /**
   * Encrypts sensitive credentials before storing in the database
   */
  encryptCredentials(credentials: any): string {
    try {
      const plaintext = JSON.stringify(credentials);
      return this.envelopeEncryption.encryptField(plaintext);
    } catch (e: any) {
      this.logger.error(`Failed to encrypt credentials: ${e.message}`);
      throw new Error('Encryption failed');
    }
  }

  /**
   * Decrypts credentials retrieved from the database
   */
  decryptCredentials(encryptedPayloadString: string): any {
    try {
      // Check if this is a modern envelope-encrypted payload
      if (encryptedPayloadString.startsWith('enc:')) {
        const decryptedString = this.envelopeEncryption.decryptField(encryptedPayloadString);
        return JSON.parse(decryptedString);
      }

      // Fallback: Legacy static key decryption (V0)
      const payload = JSON.parse(encryptedPayloadString);
      const decipher = crypto.createDecipheriv(
        this.ALGORITHM,
        this.ENCRYPTION_KEY,
        Buffer.from(payload.iv, 'hex'),
      );
      decipher.setAuthTag(Buffer.from(payload.tag, 'hex'));

      let decrypted = decipher.update(payload.content, 'hex', 'utf8');
      decrypted += decipher.final('utf8');

      return JSON.parse(decrypted);
    } catch (e: any) {
      this.logger.error(`Failed to decrypt credentials: ${e.message}`);
      throw new Error('Decryption failed');
    }
  }

  /**
   * Validates an HMAC signature for incoming webhooks
   */
  verifyWebhookSignature(
    payload: string | Buffer,
    signature: string,
    secret: string,
  ): boolean {
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex');

    const signatureBuffer = Buffer.from(signature, 'utf8');
    const expectedBuffer = Buffer.from(expectedSignature, 'utf8');

    if (signatureBuffer.length !== expectedBuffer.length) {
      return false;
    }

    return crypto.timingSafeEqual(signatureBuffer, expectedBuffer);
  }
}
