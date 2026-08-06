import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AuditLoggerService {
  private readonly logger = new Logger(AuditLoggerService.name);

  async logAction(payload: {
    tenantId: string;
    userId: string;
    action: string;
    resource: string;
    oldValue?: any;
    newValue?: any;
    ipAddress?: string;
    deviceInfo?: string;
  }) {
    this.logger.log(
      `Audit Log [${payload.tenantId}]: User ${payload.userId} performed ${payload.action} on ${payload.resource}`,
    );
    // Scaffolded: Push to immutable WORM storage (e.g. AWS QLDB or Kafka -> S3)
    return { success: true, timestamp: new Date().toISOString() };
  }
}
