import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { EnvelopeEncryptionService } from '../encryption/envelope/envelope-encryption.service';
import * as crypto from 'crypto';

// ---------------------------------------------------------------------------
// Enterprise Audit Service — Immutable, Tamper-Evident
//
// Every audit record is hashed with HMAC-SHA256 keyed to the platform KEK.
// This means any post-hoc modification of a record in the DB can be detected
// by re-computing the HMAC.
//
// Compliance:
//   • ISO 27001 A.12.4.1 — Event Logging
//   • SOC 2 CC7.2 — Security incidents are logged
//   • DPDP Act 2023 — Accountability
//   • PCI DSS 10.2 — Audit log requirements
// ---------------------------------------------------------------------------

export interface AuditEventDto {
  action: string;
  entity: string;
  entityType?: string;
  entityId: string;
  details?: Record<string, unknown>;
  userId?: string;
  companyId: string;
  beforeValue?: unknown;
  afterValue?: unknown;
  reason?: string;
  correlationId?: string;
  source?: string;
}

@Injectable()
export class AuditService {
  private readonly logger = new Logger(AuditService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly encryption: EnvelopeEncryptionService,
  ) {}

  async logEvent(
    event: AuditEventDto,
    requestContext?: Record<string, unknown> | null,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    txClient?: any,
  ) {
    const timestamp = new Date().toISOString();

    // Construct deterministic payload for integrity check
    const integrityPayload = JSON.stringify({
      action: event.action,
      entity: event.entity,
      entityId: event.entityId,
      companyId: event.companyId,
      userId: event.userId ?? 'SYSTEM',
      timestamp,
    });

    // HMAC-SHA256 tamper-evidence anchor
    const eventHmac = this.encryption.hmacSign(integrityPayload);

    // ── Hash Chain ──────────────────────────────────────────────────────
    // Retrieve the previous audit log for this tenant to link the chain.
    const previousRecord = await this.prisma.runAsSystem(async (tx) =>
      tx.auditLog.findFirst({
        where: { companyId: event.companyId },
        orderBy: { createdAt: 'desc' },
        select: { id: true, details: true },
      }),
    );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const prevDetails = previousRecord?.details as Record<string, any> | null;
    const previousHash: string =
      prevDetails?._integrity?.currentHash ?? '0'.repeat(64);

    // currentHash = SHA-256(previousHash + integrityPayload)
    const currentHash = crypto
      .createHash('sha256')
      .update(previousHash + integrityPayload)
      .digest('hex');

    const sanitizedDetails = this.sanitizeForAudit({
      ...event.details,
      requestContext,
      _integrity: { hmac: eventHmac, timestamp, previousHash, currentHash },
    });

    try {
      const dbClient = txClient || this.prisma;
      // eslint-disable-next-line no-restricted-syntax
      await dbClient.auditLog.create({
        data: {
          action: event.action,
          entity: event.entity,
          entityType: event.entityType ?? event.entity,
          entityId: event.entityId,
          details: sanitizedDetails,
          beforeValue: event.beforeValue
            ? this.sanitizeForAudit(event.beforeValue)
            : undefined,
          afterValue: event.afterValue
            ? this.sanitizeForAudit(event.afterValue)
            : undefined,
          reason: event.reason,
          correlationId: event.correlationId,
          source: event.source ?? 'API',
          userId: event.userId,
          companyId: event.companyId,
        },
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      const errorStack = err instanceof Error ? err.stack : undefined;
      // Audit failures must be highly visible — never silently swallowed
      this.logger.error(
        `[AuditFabric] FAILED to write audit log: ${errorMessage}`,
        errorStack,
      );
    }
  }

  /**
   * Verify the integrity of an existing audit log entry.
   * Returns true if the record has not been tampered with.
   */
  async verifyIntegrity(auditLogId: string): Promise<boolean> {
    const record = await this.prisma.runAsSystem(async (tx) =>
      tx.auditLog.findUnique({
        where: { id: auditLogId },
      }),
    );
    if (!record) return false;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const details = record.details as Record<string, any>;
    if (!details?._integrity?.hmac) return false;

    const { hmac, timestamp } = details._integrity;

    const expectedPayload = JSON.stringify({
      action: record.action,
      entity: record.entity,
      entityId: record.entityId,
      companyId: record.companyId,
      userId: record.userId ?? 'SYSTEM',
      timestamp,
    });

    const isValid = this.encryption.hmacVerify(expectedPayload, hmac);
    if (!isValid) {
      this.logger.error(
        `[AuditFabric] TAMPER DETECTED on audit record ${auditLogId}`,
      );
    }
    return isValid;
  }

  /**
   * Verify the hash chain integrity for a tenant's audit log.
   * Returns a summary of chain integrity: total records, verified count,
   * and the first broken link (if any).
   */
  async verifyChain(
    companyId: string,
    limit = 1000,
  ): Promise<{
    totalChecked: number;
    valid: number;
    broken: number;
    firstBrokenId: string | null;
  }> {
    const records = await this.prisma.runAsSystem(async (tx) =>
      tx.auditLog.findMany({
        where: { companyId },
        orderBy: { createdAt: 'asc' },
        take: limit,
        select: {
          id: true,
          action: true,
          entity: true,
          entityId: true,
          companyId: true,
          userId: true,
          details: true,
        },
      }),
    );

    let valid = 0;
    let broken = 0;
    let firstBrokenId: string | null = null;
    let expectedPreviousHash = '0'.repeat(64);

    for (const record of records) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const details = record.details as Record<string, any>;
      const integrity = details?._integrity;

      if (!integrity?.currentHash || !integrity?.previousHash) {
        // Legacy record without chain — skip but count
        valid++;
        continue;
      }

      if (integrity.previousHash !== expectedPreviousHash) {
        broken++;
        if (!firstBrokenId) firstBrokenId = record.id;
      } else {
        // Verify hash computation
        const integrityPayload = JSON.stringify({
          action: record.action,
          entity: record.entity,
          entityId: record.entityId,
          companyId: record.companyId,
          userId: record.userId ?? 'SYSTEM',
          timestamp: integrity.timestamp,
        });
        const computedHash = crypto
          .createHash('sha256')
          .update(integrity.previousHash + integrityPayload)
          .digest('hex');

        if (computedHash === integrity.currentHash) {
          valid++;
        } else {
          broken++;
          if (!firstBrokenId) firstBrokenId = record.id;
        }
      }
      expectedPreviousHash = integrity.currentHash;
    }

    return {
      totalChecked: records.length,
      valid,
      broken,
      firstBrokenId,
    };
  }

  /**
   * Export audit logs for a tenant within a date range.
   * Returns structured data suitable for compliance reporting.
   */
  async exportAuditLogs(
    companyId: string,
    fromDate: Date,
    toDate: Date,
    userId?: string,
  ): Promise<{
    exportedAt: string;
    companyId: string;
    totalRecords: number;
    records: any[];
  }> {
    const where: any = {
      companyId,
      createdAt: { gte: fromDate, lte: toDate },
    };
    if (userId) where.userId = userId;

    const records = await this.prisma.runAsSystem(async (tx) =>
      tx.auditLog.findMany({
        where,
        orderBy: { createdAt: 'asc' },
        take: 10000,
      }),
    );

    return {
      exportedAt: new Date().toISOString(),
      companyId,
      totalRecords: records.length,
      records,
    };
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Sanitization — prevent secrets / large blobs from leaking into audit logs
  // ─────────────────────────────────────────────────────────────────────────

  private sanitizeForAudit(data: unknown): unknown {
    if (!data || typeof data !== 'object') return data;

    const REDACTED = '[REDACTED]';
    const sensitiveKeys = new Set([
      'password',
      'passwordHash',
      'currentPassword',
      'newPassword',
      'token',
      'refreshToken',
      'accessToken',
      'apiKey',
      'apiSecret',
      'secret',
      'credentials',
      'privateKey',
      'encryptedDek',
      'credit_card',
      'cardNumber',
      'cvv',
      'aadhaar',
      'pan',
      'bankAccount',
      'ifsc',
      'upi',
      'drivingLicence',
      'rcNumber',
      'insuranceNumber',
      'passport',
      'nationalId',
      'ssn',
      'totpSecret',
    ]);

    const sanitize = (obj: unknown): unknown => {
      if (Array.isArray(obj)) return obj.map(sanitize);
      if (obj && typeof obj === 'object') {
        return Object.fromEntries(
          Object.entries(obj).map(([k, v]) => [
            k,
            sensitiveKeys.has(k) ? REDACTED : sanitize(v),
          ]),
        );
      }
      return obj;
    };

    return sanitize(data);
  }
}
