import { Injectable, Logger } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class SecurityContextService {
  private readonly logger = new Logger(SecurityContextService.name);

  private readonly ENCRYPTION_KEY: string;
  private readonly IV_LENGTH = 16;

  constructor() {
    const key = process.env.ENCRYPTION_KEY;
    if (process.env.NODE_ENV === 'production') {
      if (!key || key === 'default-32-byte-secret-key-0000') {
        throw new Error(
          'CRITICAL: ENCRYPTION_KEY is not set or uses a default insecure value in production.',
        );
      }
      if (Buffer.from(key).length !== 32) {
        throw new Error('CRITICAL: ENCRYPTION_KEY must be exactly 32 bytes.');
      }
      this.ENCRYPTION_KEY = key;
    } else {
      // Development fallback
      this.ENCRYPTION_KEY = key || 'default-32-byte-secret-key-0000';
    }
  }

  /**
   * Generates a secure API key for third-party integrations
   */
  generateApiKey(prefix = 'pl'): { raw: string; hash: string } {
    const rawKey = `${prefix}_${crypto.randomBytes(24).toString('base64url')}`;
    const hash = crypto.createHash('sha256').update(rawKey).digest('hex');
    return { raw: rawKey, hash };
  }

  /**
   * Symmetrically encrypts a secret (e.g., vendor credentials, third-party API keys)
   */
  encryptSecret(text: string): string {
    const iv = crypto.randomBytes(this.IV_LENGTH);
    const cipher = crypto.createCipheriv(
      'aes-256-cbc',
      Buffer.from(this.ENCRYPTION_KEY.padEnd(32, '0').slice(0, 32)),
      iv,
    );
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return iv.toString('hex') + ':' + encrypted;
  }

  /**
   * Decrypts a stored secret
   */
  decryptSecret(text: string): string {
    const textParts = text.split(':');
    const iv = Buffer.from(textParts.shift() as string, 'hex');
    const encryptedText = Buffer.from(textParts.join(':'), 'hex');
    const decipher = crypto.createDecipheriv(
      'aes-256-cbc',
      Buffer.from(this.ENCRYPTION_KEY.padEnd(32, '0').slice(0, 32)),
      iv,
    );
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
  }
}
