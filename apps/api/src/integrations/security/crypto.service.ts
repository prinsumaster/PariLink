import { Injectable, Logger } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class CryptoService {
  private readonly logger = new Logger(CryptoService.name);

  // In production, this would be injected via AWS KMS or HashiCorp Vault.
  // Using an environment variable for MVP.
  private readonly algorithm = 'aes-256-gcm';
  private readonly encryptionKey: Buffer;

  constructor() {
    const keyString =
      process.env.ENCRYPTION_KEY || 'default_integration_secret_key_32'; // Must be exactly 32 bytes for aes-256
    // Pad or truncate to 32 bytes
    this.encryptionKey = crypto.scryptSync(keyString, 'salt', 32);
  }

  encrypt(text: string): { iv: string; content: string; authTag: string } {
    try {
      const iv = crypto.randomBytes(16);
      const cipher = crypto.createCipheriv(
        this.algorithm,
        this.encryptionKey,
        iv,
      );

      let encrypted = cipher.update(text, 'utf8', 'hex');
      encrypted += cipher.final('hex');
      const authTag = cipher.getAuthTag().toString('hex');

      return {
        iv: iv.toString('hex'),
        content: encrypted,
        authTag: authTag,
      };
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : String(e);
      this.logger.error(`Encryption failed: ${errorMessage}`);
      throw new Error('Encryption failed');
    }
  }

  decrypt(hash: { iv: string; content: string; authTag: string }): string {
    try {
      const decipher = crypto.createDecipheriv(
        this.algorithm,
        this.encryptionKey,
        Buffer.from(hash.iv, 'hex'),
      );
      decipher.setAuthTag(Buffer.from(hash.authTag, 'hex'));

      let decrypted = decipher.update(hash.content, 'hex', 'utf8');
      decrypted += decipher.final('utf8');

      return decrypted;
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : String(e);
      this.logger.error(`Decryption failed: ${errorMessage}`);
      throw new Error('Decryption failed');
    }
  }

  generateApiKey(): string {
    return 'sk_live_' + crypto.randomBytes(24).toString('base64url');
  }

  hashApiKey(apiKey: string): string {
    return crypto.createHash('sha256').update(apiKey).digest('hex');
  }
}
