import { Injectable, Logger } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class IntegrationAuthService {
  private readonly logger = new Logger(IntegrationAuthService.name);

  // In production, this MUST come from an environment variable (e.g. process.env.IPAAS_MASTER_KEY)
  // For V1 validation, we use a static 32-byte key
  private readonly ENCRYPTION_KEY = Buffer.from(
    '12345678901234567890123456789012',
  ); // 32 bytes
  private readonly ALGORITHM = 'aes-256-gcm';

  /**
   * Encrypts sensitive credentials before storing in the database
   */
  encryptCredentials(credentials: any): string {
    try {
      const iv = crypto.randomBytes(16);
      const cipher = crypto.createCipheriv(
        this.ALGORITHM,
        this.ENCRYPTION_KEY,
        iv,
      );

      let encrypted = cipher.update(JSON.stringify(credentials), 'utf8', 'hex');
      encrypted += cipher.final('hex');
      const authTag = cipher.getAuthTag().toString('hex');

      // Store IV and AuthTag alongside the encrypted payload
      return JSON.stringify({
        iv: iv.toString('hex'),
        content: encrypted,
        tag: authTag,
      });
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
    payload: string,
    signature: string,
    secret: string,
  ): boolean {
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex');

    return signature === expectedSignature;
  }
}
