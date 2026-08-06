import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditService } from '../../platform/audit/audit.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import * as crypto from 'crypto';

export interface LogEntryInput {
  companyId?: string;
  level: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG' | 'FATAL';
  service: string;
  message: string;
  structuredData?: Record<string, unknown>;
  correlationId?: string;
  traceId?: string;
  spanId?: string;
  error?: unknown;
}

export interface LogSearchFilter {
  companyId?: string;
  level?: string;
  service?: string;
  query?: string;
  correlationId?: string;
  traceId?: string;
  errorGroup?: string;
  startTime?: Date;
  endTime?: Date;
  limit?: number;
}

@Injectable()
export class LoggingPlatformService {
  private readonly logger = new Logger(LoggingPlatformService.name);
  private readonly sensitiveKeys = [
    'password',
    'secret',
    'token',
    'apiKey',
    'creditCard',
    'cvv',
    'ssn',
    'authorization',
    'access_token',
  ];

  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  /**
   * Ingests a structured log entry, redacts sensitive PII/secrets, computes error grouping, and persists.
   */
  async log(input: LogEntryInput): Promise<unknown> {
    let structuredData = input.structuredData
      ? { ...input.structuredData }
      : {};
    let isRedacted = false;

    // Sensitive Data Redaction
    const redactedResult = this.redactSensitiveData(structuredData);
    structuredData = redactedResult.data as Record<string, unknown>;
    isRedacted = redactedResult.redacted;

    // Error Grouping Computation
    let errorGroup: string | null = null;
    if (input.error || input.level === 'ERROR' || input.level === 'FATAL') {
      const errObj =
        input.error instanceof Error
          ? input.error
          : (input.error as Record<string, unknown> | undefined);
      const errMsg = (errObj?.message as string) || input.message;
      const stack = (errObj?.stack as string) || '';

      const normalizedSignature = `${input.service}:${errMsg.replace(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi, '<UUID>').replace(/\b\d+\b/g, '<NUM>')}`;
      errorGroup = `err_${crypto.createHash('sha256').update(normalizedSignature).digest('hex').slice(0, 16)}`;

      if (input.error) {
        structuredData.errorDetails = {
          message: errMsg,
          stack: stack.slice(0, 1000), // Cap stack trace length
        };
      }
    }

    try {
      const logRecord = await this.prisma.runAsSystem(async (tx) =>
        tx.enterpriseLog.create({
          data: {
            companyId: input.companyId || null,
            level: input.level,
            service: input.service,
            message: input.message,
            // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
            structuredData: structuredData as object,
            correlationId: input.correlationId || null,
            traceId: input.traceId || null,
            spanId: input.spanId || null,
            errorGroup,
            isRedacted,
          },
        }),
      );

      if (input.level === 'ERROR' || input.level === 'FATAL') {
        this.eventEmitter.emit('Operations.LogError.Recorded', {
          logId: logRecord.id,
          companyId: input.companyId,
          service: input.service,
          message: input.message,
          errorGroup,
        });
      }

      return logRecord;
    } catch (e: unknown) {
      this.logger.error(
        `Log ingestion persistence failure: ${e instanceof Error ? e.message : String(e)}`,
      );
      return null;
    }
  }

  /**
   * Central Log Aggregation & Search: Queries logs by keyword, correlation ID, error group, or date range.
   */
  async searchLogs(
    filter: LogSearchFilter,
  ): Promise<import('@prisma/client').EnterpriseLog[]> {
    const where: import('@prisma/client').Prisma.EnterpriseLogWhereInput = {};
    if (filter.companyId) where.companyId = filter.companyId;
    if (filter.level) where.level = filter.level;
    if (filter.service) where.service = filter.service;
    if (filter.correlationId) where.correlationId = filter.correlationId;
    if (filter.traceId) where.traceId = filter.traceId;
    if (filter.errorGroup) where.errorGroup = filter.errorGroup;
    if (filter.query)
      where.message = { contains: filter.query, mode: 'insensitive' };
    if (filter.startTime || filter.endTime) {
      where.timestamp = {};
      if (filter.startTime) where.timestamp.gte = filter.startTime;
      if (filter.endTime) where.timestamp.lte = filter.endTime;
    }

    const logs = await this.prisma.runAsSystem(async (tx) =>
      tx.enterpriseLog.findMany({
        where,
        orderBy: { timestamp: 'desc' },
        take: filter.limit || 250,
      }),
    );

    return logs;
  }

  /**
   * Correlation Search: Retrieves all logs across all microservices tied to a specific correlationId or traceId.
   */
  async getCorrelationStream(
    correlationId: string,
  ): Promise<import('@prisma/client').EnterpriseLog[]> {
    return this.searchLogs({ correlationId, limit: 500 });
  }

  /**
   * Error Grouping Summary: Groups recent errors by signature frequency and returns top recurring exceptions.
   */
  async getErrorGroupsSummary(
    companyId?: string,
    limit = 20,
  ): Promise<unknown[]> {
    const where: import('@prisma/client').Prisma.EnterpriseLogWhereInput = {
      level: { in: ['ERROR', 'FATAL'] },
      errorGroup: { not: null },
    };
    if (companyId) where.companyId = companyId;

    const errors = await this.prisma.runAsSystem(async (tx) =>
      tx.enterpriseLog.findMany({
        where,
        orderBy: { timestamp: 'desc' },
        take: 1000,
      }),
    );

    const counts: Record<
      string,
      { count: number; lastOccurred: string; message: string; service: string }
    > = {};
    for (const err of errors) {
      const grp = err.errorGroup!;
      if (!counts[grp]) {
        counts[grp] = {
          count: 0,
          lastOccurred: err.timestamp.toISOString(),
          message: err.message,
          service: err.service,
        };
      }
      counts[grp].count++;
    }

    return Object.entries(counts)
      .map(([errorGroup, data]) => ({ errorGroup, ...data }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  }

  /**
   * Exports matching log entries to JSON or CSV format for external auditing or archiving.
   */
  async exportLogs(
    filter: LogSearchFilter,
    format: 'JSON' | 'CSV' = 'JSON',
  ): Promise<string> {
    const logs = await this.searchLogs({ ...filter, limit: 5000 });
    if (format === 'JSON') {
      return JSON.stringify(logs, null, 2);
    }

    // CSV Formatting
    const headers = [
      'ID',
      'Timestamp',
      'Level',
      'Service',
      'Message',
      'CorrelationID',
      'ErrorGroup',
    ];
    const rows = logs.map((l) => [
      l.id,
      l.timestamp.toISOString(),
      l.level,
      l.service,
      `"${l.message.replace(/"/g, '""')}"`,
      l.correlationId || '',
      l.errorGroup || '',
    ]);
    return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  }

  /**
   * Log Retention Purge: Deletes log records older than the specified retention window (default 30 days).
   */
  async purgeExpiredLogs(
    retentionDays = 30,
  ): Promise<{ deletedCount: number }> {
    const cutoffDate = new Date(Date.now() - retentionDays * 86400000);
    const result = await this.prisma.runAsSystem(async (tx) =>
      tx.enterpriseLog.deleteMany({
        where: {
          timestamp: { lt: cutoffDate },
        },
      }),
    );
    this.logger.log(
      `[Log Retention] Purged ${result.count} expired enterprise logs older than ${retentionDays} days.`,
    );
    return { deletedCount: result.count };
  }

  /**
   * Recursively scans object trees and redacts sensitive PII/credential values.
   */
  private redactSensitiveData(obj: unknown): {
    data: unknown;
    redacted: boolean;
  } {
    if (obj === null || typeof obj !== 'object')
      return { data: obj, redacted: false };
    let redacted = false;
    const copy: Record<string, unknown> = (
      Array.isArray(obj) ? [] : {}
    ) as Record<string, unknown>;

    for (const [key, val] of Object.entries(obj)) {
      const lowerKey = key.toLowerCase();
      if (this.sensitiveKeys.some((k) => lowerKey.includes(k.toLowerCase()))) {
        copy[key] = '[REDACTED_CONFIDENTIAL]';
        redacted = true;
      } else if (typeof val === 'object' && val !== null) {
        const res = this.redactSensitiveData(val);
        copy[key] = res.data;
        if (res.redacted) redacted = true;
      } else {
        copy[key] = val;
      }
    }
    return { data: copy, redacted };
  }
}
