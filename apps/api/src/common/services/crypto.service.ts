import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class CryptoService {
  private readonly algorithm = 'aes-256-gcm';
  private readonly key = Buffer.from(
    process.env.ENCRYPTION_KEY || crypto.randomBytes(32).toString('hex'),
    'hex',
  );

  encrypt(text: string): {
    encryptedData: string;
    iv: string;
    authTag: string;
  } {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(this.algorithm, this.key, iv);

    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const authTag = cipher.getAuthTag().toString('hex');

    return {
      encryptedData: encrypted,
      iv: iv.toString('hex'),
      authTag,
    };
  }

  decrypt(encryptedData: string, ivHex: string, authTagHex: string): string {
    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');
    const decipher = crypto.createDecipheriv(this.algorithm, this.key, iv);

    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  }

  maskPII(text: string, type: 'email' | 'phone' | 'ssn'): string {
    if (!text) return text;
    switch (type) {
      case 'email':
        const [name, domain] = text.split('@');
        return `${name.charAt(0)}***@${domain}`;
      case 'phone':
        return text.replace(/\d(?=\d{4})/g, '*');
      case 'ssn':
        return '***-**-' + text.slice(-4);
      default:
        return '***';
    }
  }
}
