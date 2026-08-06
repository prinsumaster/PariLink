import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ConnectorRegistryService } from '../framework/registry.service';
import { IntegrationAuthService } from '../auth/auth.service';
import { AuditService } from '../../platform/audit/audit.service';

@Injectable()
export class SyncEngineService {
  private readonly logger = new Logger(SyncEngineService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly registry: ConnectorRegistryService,
    private readonly auth: IntegrationAuthService,
    private readonly audit?: AuditService,
  ) {}

  async triggerSync(
    companyId: string,
    connectionId: string,
    entityType: string,
    payload?: any,
  ) {
    const connection = await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.integrationConnection.findUnique({
        where: { id: connectionId, companyId },
        include: { connector: true },
      }),
    );

    if (!connection) throw new Error('Connection not found');

    const connector = this.registry.getConnector(connection.connector.provider);
    if (!connector)
      throw new Error(`Connector ${connection.connector.provider} not loaded`);

    const job = await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.syncJob.create({
        data: {
          companyId,
          connectionId,
          entityType,
          direction: 'BIDIRECTIONAL',
          status: 'RUNNING',
        },
      }),
    );

    try {
      this.logger.log(
        `Starting Sync Job ${job.id} for ${connection.connector.provider}`,
      );

      const credentials = this.auth.decryptCredentials(
        connection.credentials as string,
      );

      const result = await connector.sync(
        companyId,
        credentials,
        entityType,
        payload,
      );

      await this.prisma.runAsTenant(companyId, async (tx) =>
        tx.syncJob.update({
          where: { id: job.id },
          data: {
            status: 'COMPLETED',
            recordsProcessed: result?.recordsProcessed || 1,
            completedAt: new Date(),
          },
        }),
      );

      await this.prisma.runAsTenant(companyId, async (tx) =>
        tx.integrationConnection.update({
          where: { id: connection.id },
          data: { lastSync: new Date() },
        }),
      );

      return {
        jobId: job.id,
        status: 'COMPLETED',
        recordsProcessed: result?.recordsProcessed || 1,
      };
    } catch (e: any) {
      this.logger.error(`Sync Job ${job.id} failed: ${e.message}`);
      await this.prisma.runAsTenant(companyId, async (tx) =>
        tx.syncJob.update({
          where: { id: job.id },
          data: { status: 'FAILED', error: e.message },
        }),
      );

      await this.prisma.runAsTenant(companyId, async (tx) =>
        tx.integrationConnection.update({
          where: { id: connection.id },
          data: { lastError: e.message, retryCount: connection.retryCount + 1 },
        }),
      );

      await this.prisma.runAsTenant(companyId, async (tx) =>
        tx.syncError.create({
          data: {
            connectionId: connection.id,
            errorMessage: e.message,
            errorStack: e.stack || null,
          },
        }),
      );

      throw e;
    }
  }

  async scheduleSync(
    companyId: string,
    userId: string,
    dto: {
      connectionId: string;
      cronExpression: string;
      isActive?: boolean;
    },
  ) {
    if (!dto.connectionId || !dto.cronExpression) {
      throw new BadRequestException(
        'connectionId and cronExpression are required',
      );
    }

    return this.prisma.runAsTenant(companyId, async (tx) => {
      const conn = await tx.integrationConnection.findUnique({
        where: { id: dto.connectionId },
      });
      if (!conn || conn.companyId !== companyId) {
        throw new NotFoundException('Connection not found');
      }

      const schedule = await tx.scheduledSync.create({
        data: {
          connectionId: dto.connectionId,
          cronExpression: dto.cronExpression,
          isActive: dto.isActive !== false,
          nextRunAt: new Date(Date.now() + 3600000), // Next hour estimate
        },
      });

      if (this.audit) {
        await this.audit.logEvent({
          companyId,
          userId,
          entity: 'ScheduledSync',
          entityId: schedule.id,
          action: 'CREATE_SYNC_SCHEDULE',
          details: { connectionId: dto.connectionId, cron: dto.cronExpression },
        });
      }

      return schedule;
    });
  }

  async listSchedules(companyId: string) {
    return this.prisma.runAsTenant(companyId, async (tx) =>
      tx.scheduledSync.findMany({
        where: { connection: { companyId } },
        include: { connection: { include: { connector: true } } },
      }),
    );
  }

  async getSyncHistory(
    companyId: string,
    query: { connectionId?: string; status?: string; limit?: number },
  ) {
    const where: any = { companyId };
    if (query.connectionId) where.connectionId = query.connectionId;
    if (query.status) where.status = query.status.toUpperCase();

    return this.prisma.runAsTenant(companyId, async (tx) =>
      tx.syncJob.findMany({
        where,
        take: query.limit || 50,
        orderBy: { createdAt: 'desc' },
      }),
    );
  }

  async getSyncErrors(companyId: string, connectionId?: string) {
    const where: any = { connection: { companyId } };
    if (connectionId) where.connectionId = connectionId;

    return this.prisma.runAsTenant(companyId, async (tx) =>
      tx.syncError.findMany({
        where,
        take: 50,
        orderBy: { createdAt: 'desc' },
        include: { connection: { include: { connector: true } } },
      }),
    );
  }

  async resolveError(companyId: string, errorId: string, userId: string) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      const err = await tx.syncError.findUnique({
        where: { id: errorId },
        include: { connection: true },
      });
      if (!err || err.connection.companyId !== companyId) {
        throw new NotFoundException('Sync error not found');
      }

      const updated = await tx.syncError.update({
        where: { id: errorId },
        data: { resolved: true },
      });

      if (this.audit) {
        await this.audit.logEvent({
          companyId,
          userId,
          entity: 'SyncError',
          entityId: errorId,
          action: 'RESOLVE_SYNC_ERROR',
          details: { errorMessage: err.errorMessage },
        });
      }

      return updated;
    });
  }
}
