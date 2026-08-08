import { Injectable, Logger } from '@nestjs/common';
import { EnvelopeEncryptionService } from '../../encryption/envelope/envelope-encryption.service';
import { PrismaService } from '../../../prisma/prisma.service';
import { AuditService } from '../../audit/audit.service';
import * as crypto from 'crypto';

// ---------------------------------------------------------------------------
// Secrets Platform Service
//
// Manages application and tenant secrets (API keys, webhook secrets, OAuth tokens)
// using Envelope Encryption. Provides rotation capabilities and strict audit trails.
//
// Compliance:
//   • SOC 2 CC6.1 — Logical access controls (Secrets Management)
//   • ISO 27001 A.10.1.2 — Key management
//   • PCI DSS Req 3.5 — Protect cryptographic keys
// ---------------------------------------------------------------------------

@Injectable()
export class SecretsService {
  private readonly logger = new Logger(SecretsService.name);

  constructor(
    private readonly encryption: EnvelopeEncryptionService,
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  /**
   * Encrypt and store a secret for a tenant integration.
   * Merges with existing credentials JSON.
   */
  async storeIntegrationSecret(
    companyId: string,
    provider: string,
    key: string,
    plaintextValue: string,
    userId: string,
  ): Promise<void> {
    const encryptedValue = this.encryption.encryptField(plaintextValue);

    await this.prisma.runAsSystem(async (tx) => {
      let config = await tx.integrationConfig.findFirst({
        where: { companyId, provider },
      });

      if (!config) {
        config = await tx.integrationConfig.create({
          data: {
            companyId,
            provider,
            credentials: {},
          },
        });
      }

      const credentials = (config.credentials as Record<string, string>) || {};
      credentials[key] = encryptedValue;

      await tx.integrationConfig.update({
        where: { id: config.id },
        data: { credentials },
      });
    });

    await this.audit.logEvent({
      action: 'SECRET_STORED',
      entity: 'IntegrationConfig',
      entityId: `${companyId}:${provider}`,
      companyId,
      userId,
      source: 'SECRETS_PLATFORM',
      details: { provider, key },
    });

    this.logger.log(
      `[Secrets] Stored secret '${key}' for ${provider} (Tenant: ${companyId})`,
    );
  }

  /**
   * Retrieve and decrypt a secret for a tenant integration.
   * Used during runtime execution (e.g. calling Stripe API).
   */
  async retrieveIntegrationSecret(
    companyId: string,
    provider: string,
    key: string,
  ): Promise<string | null> {
    const config = await this.prisma.runAsSystem(async (tx) =>
      tx.integrationConfig.findFirst({
        where: { companyId, provider },
      }),
    );

    if (!config || !config.credentials) return null;

    const credentials = config.credentials as Record<string, string>;
    const encryptedValue = credentials[key];

    if (!encryptedValue) return null;

    if (!encryptedValue.startsWith('enc:')) {
      this.logger.warn(
        `[Secrets] Legacy unencrypted secret found for ${provider}.${key}`,
      );
      return encryptedValue; // Backwards compatibility
    }

    try {
      const plaintext = this.encryption.decryptField(encryptedValue);
      return plaintext;
    } catch (err) {
      this.logger.error(
        `[Secrets] Failed to decrypt secret ${provider}.${key}`,
      );
      return null;
    }
  }

  /**
   * Generate a secure random API secret (e.g., for Webhook signing)
   */
  generateRandomSecret(length = 32): string {
    return crypto.randomBytes(length).toString('base64url');
  }

  /**
   * Hash a secret for one-way verification (e.g., API Keys).
   * We use SHA-256 for fast API key verification, not bcrypt (which is for passwords).
   */
  hashSecret(plaintext: string): string {
    return crypto.createHash('sha256').update(plaintext).digest('hex');
  }
}
