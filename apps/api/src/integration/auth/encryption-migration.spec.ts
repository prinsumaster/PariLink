import { Test, TestingModule } from '@nestjs/testing';
import { IntegrationAuthService } from './auth.service';
import { EnvelopeEncryptionService } from '../../platform/encryption/envelope/envelope-encryption.service';
import * as crypto from 'crypto';

describe('BE3: Encryption Migration', () => {
  let authService: IntegrationAuthService;
  let envelopeService: EnvelopeEncryptionService;

  beforeAll(async () => {
    // We need to set mock environment variables for the EnvelopeEncryptionService
    process.env.MASTER_ENCRYPTION_KEY_V1 = '1234567890123456789012345678901212345678901234567890123456789012'; // 32 bytes hex
    
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [EnvelopeEncryptionService, IntegrationAuthService],
    }).compile();

    envelopeService = moduleRef.get<EnvelopeEncryptionService>(EnvelopeEncryptionService);
    // manually trigger init to load keys
    envelopeService.onModuleInit();
    
    authService = moduleRef.get<IntegrationAuthService>(IntegrationAuthService);
  });

  it('should decrypt legacy AES-GCM credentials', () => {
    const legacyKey = Buffer.from('12345678901234567890123456789012');
    const iv = crypto.randomBytes(16);
    const credentials = { apiKey: 'legacy-api-key-123' };
    
    const cipher = crypto.createCipheriv('aes-256-gcm', legacyKey, iv);
    let encrypted = cipher.update(JSON.stringify(credentials), 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const authTag = cipher.getAuthTag().toString('hex');
    
    const legacyPayloadString = JSON.stringify({
      iv: iv.toString('hex'),
      content: encrypted,
      tag: authTag,
    });
    
    const decrypted = authService.decryptCredentials(legacyPayloadString);
    expect(decrypted).toEqual(credentials);
  });

  it('should encrypt using EnvelopeEncryptionService and decrypt properly', () => {
    const credentials = { apiKey: 'modern-api-key-456' };
    
    const encrypted = authService.encryptCredentials(credentials);
    
    // Prove it uses the new system (starts with enc:)
    expect(encrypted.startsWith('enc:')).toBe(true);
    
    const decrypted = authService.decryptCredentials(encrypted);
    expect(decrypted).toEqual(credentials);
  });
});
