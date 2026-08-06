import { Processor, WorkerHost, OnWorkerEvent } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ConnectorFactoryService } from '../connectors/connector-factory.service';
import { CryptoService } from '../security/crypto.service';

export interface SyncJobPayload {
  connectionId: string;
  entityType: string;
  userId: string;
  isFullSync?: boolean;
}

@Processor('integration-sync', { concurrency: 20 })
export class SyncEngineProcessor extends WorkerHost {
  private readonly logger = new Logger(SyncEngineProcessor.name);

  constructor(
    private prisma: PrismaService,
    private factory: ConnectorFactoryService,
    private crypto: CryptoService,
  ) {
    super();
  }

  async process(job: Job<SyncJobPayload, any, string>): Promise<any> {
    this.logger.log(
      `Starting Sync Job ${job.id} for connection ${job.data.connectionId}`,
    );

    const connection = await this.prisma.runAsSystem(async (tx) =>
      tx.integrationConnection.findUnique({
        where: { id: job.data.connectionId },
        include: { connector: true },
      }),
    );

    if (!connection) {
      throw new Error(`Connection ${job.data.connectionId} not found`);
    }

    if (connection.status !== 'ACTIVE' && connection.status !== 'CONFIGURED') {
      throw new Error(`Connection is in invalid state: ${connection.status}`);
    }

    try {
      const connector = this.factory.getConnector(
        connection.connector.provider,
      );

      // Decrypt credentials
      // Note: In production, credentials should be decrypted properly.
      // Here we assume it's just parsed JSON for the MVP wrapper.
      const credentials =
        typeof connection.credentials === 'string'
          ? JSON.parse(connection.credentials)
          : connection.credentials;

      const lastSyncDate = job.data.isFullSync
        ? undefined
        : connection.lastSync || undefined;

      const result = await connector.syncEntity(
        job.data.entityType,
        credentials,
        lastSyncDate,
      );

      // Log success
      await this.prisma.runAsSystem(async (tx) =>
        tx.syncJob.create({
          data: {
            connectionId: connection.id,
            companyId: connection.companyId,
            entityType: job.data.entityType,
            direction: 'IMPORT',
            status: 'COMPLETED',
            recordsProcessed: result.recordsSynced,
            startedAt: new Date(job.timestamp),
            completedAt: new Date(),
          },
        }),
      );

      // Update connection
      await this.prisma.runAsSystem(async (tx) =>
        tx.integrationConnection.update({
          where: { id: connection.id },
          data: { lastSync: new Date(), lastError: null },
        }),
      );

      return result;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      const errorStack = error instanceof Error ? error.stack : undefined;
      this.logger.error(`Sync Job ${job.id} failed: ${errorMessage}`);

      // Log Error
      await this.prisma.runAsSystem(async (tx) =>
        tx.syncError.create({
          data: {
            connectionId: connection.id,
            errorMessage: errorMessage,
            errorStack: errorStack,
          },
        }),
      );

      // Update connection
      await this.prisma.runAsSystem(async (tx) =>
        tx.integrationConnection.update({
          where: { id: connection.id },
          data: { status: 'FAILED', lastError: errorMessage },
        }),
      );

      throw error;
    }
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job) {
    this.logger.log(`Job ${job.id} completed successfully`);
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job, error: Error) {
    this.logger.error(`Job ${job.id} failed: ${error.message}`);
  }
}
