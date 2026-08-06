import {
  Injectable,
  Logger,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ConnectorRegistryService } from '../framework/registry.service';
import { IntegrationAuthService } from '../auth/auth.service';
import { AuditService } from '../../platform/audit/audit.service';

@Injectable()
export class EnterpriseIntegrationHubService {
  private readonly logger = new Logger(EnterpriseIntegrationHubService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly registry: ConnectorRegistryService,
    private readonly auth: IntegrationAuthService,
    private readonly audit: AuditService,
  ) {}

  async getCatalog() {
    const dbConnectors = await this.prisma.runAsSystem(async (tx) =>
      tx.integrationConnector.findMany({
        where: { status: 'ACTIVE' },
        include: { category: true },
      }),
    );
    return dbConnectors;
  }

  async getInstalledIntegrations(companyId: string) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      return tx.integrationConnection.findMany({
        where: { companyId },
        include: {
          connector: true,
          syncJobs: { take: 5, orderBy: { createdAt: 'desc' } },
        },
      });
    });
  }

  async configureIntegration(
    companyId: string,
    userId: string,
    dto: {
      provider: string;
      credentials: any;
      settings?: any;
      isActive?: boolean;
    },
  ) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      const connector = this.registry.getConnector(dto.provider);
      if (!connector) {
        throw new BadRequestException(
          `Connector for provider ${dto.provider} is not available in registry.`,
        );
      }

      if (!connector.validateConfiguration(dto.credentials)) {
        throw new BadRequestException(
          `Invalid configuration credentials for ${dto.provider}. Required schema check failed.`,
        );
      }

      const isHealthy = await connector.testConnection(dto.credentials);
      if (!isHealthy) {
        throw new BadRequestException(
          `Connection test failed for provider ${dto.provider}. Please check your credentials.`,
        );
      }

      const encryptedCredentials = this.auth.encryptCredentials(
        dto.credentials,
      );

      let connectorRecord = await tx.integrationConnector.findUnique({
        where: { provider: dto.provider },
      });
      if (!connectorRecord) {
        connectorRecord = await tx.integrationConnector.create({
          data: {
            provider: dto.provider,
            version: connector.version,
            authType: connector.authType,
            status: 'ACTIVE',
          },
        });
      }

      const existing = await tx.integrationConnection.findFirst({
        where: { companyId, connectorId: connectorRecord.id },
      });

      let connection;
      if (existing) {
        connection = await tx.integrationConnection.update({
          where: { id: existing.id },
          data: {
            credentials: encryptedCredentials as any,
            settings: dto.settings || existing.settings,
            status: dto.isActive !== false ? 'ENABLED' : 'CONFIGURED',
          },
          include: { connector: true },
        });
      } else {
        connection = await tx.integrationConnection.create({
          data: {
            companyId,
            connectorId: connectorRecord.id,
            credentials: encryptedCredentials as any,
            settings: dto.settings || {},
            status: dto.isActive !== false ? 'ENABLED' : 'CONFIGURED',
          },
          include: { connector: true },
        });
      }

      await this.audit.logEvent({
        companyId,
        userId,
        entity: 'IntegrationConnection',
        entityId: connection.id,
        action: existing ? 'UPDATE_CONNECTION' : 'CREATE_CONNECTION',
        details: { provider: dto.provider, status: connection.status },
      });

      return connection;
    });
  }

  async enableIntegration(
    companyId: string,
    connectionId: string,
    userId: string,
  ) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      const conn = await tx.integrationConnection.update({
        where: { id: connectionId },
        data: { status: 'ENABLED' },
      });

      await this.audit.logEvent({
        companyId,
        userId,
        entity: 'IntegrationConnection',
        entityId: connectionId,
        action: 'ENABLE_INTEGRATION',
        details: { status: 'ENABLED' },
      });

      return conn;
    });
  }

  async disableIntegration(
    companyId: string,
    connectionId: string,
    userId: string,
  ) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      const conn = await tx.integrationConnection.update({
        where: { id: connectionId },
        data: { status: 'DISABLED' },
      });

      await this.audit.logEvent({
        companyId,
        userId,
        entity: 'IntegrationConnection',
        entityId: connectionId,
        action: 'DISABLE_INTEGRATION',
        details: { status: 'DISABLED' },
      });

      return conn;
    });
  }

  async updateVersion(
    companyId: string,
    connectionId: string,
    version: string,
    userId: string,
  ) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      const conn = await tx.integrationConnection.findUnique({
        where: { id: connectionId },
        include: { connector: true },
      });
      if (!conn) throw new NotFoundException('Connection not found');

      await tx.integrationConnector.update({
        where: { id: conn.connectorId },
        data: { version },
      });

      await this.audit.logEvent({
        companyId,
        userId,
        entity: 'IntegrationConnection',
        entityId: connectionId,
        action: 'UPGRADE_VERSION',
        details: { oldVersion: conn.connector.version, newVersion: version },
      });

      return { ...conn, version };
    });
  }

  async checkHealth(companyId: string, connectionId: string) {
    const conn = await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.integrationConnection.findUnique({
        where: { id: connectionId, companyId },
        include: { connector: true },
      }),
    );
    if (!conn) throw new NotFoundException('Connection not found');

    const connector = this.registry.getConnector(conn.connector.provider);
    if (!connector) {
      return {
        status: 'UNHEALTHY',
        error: 'Connector class not loaded',
        latencyMs: 0,
        lastChecked: new Date(),
      };
    }

    const start = Date.now();
    try {
      const credentials = this.auth.decryptCredentials(
        conn.credentials as string,
      );
      const isHealthy = await connector.healthCheck(credentials);
      const latencyMs = Date.now() - start;

      if (!isHealthy) {
        return { status: 'UNHEALTHY', latencyMs, lastChecked: new Date() };
      }
      return { status: 'HEALTHY', latencyMs, lastChecked: new Date() };
    } catch (e: any) {
      return {
        status: 'UNHEALTHY',
        error: e.message,
        latencyMs: Date.now() - start,
        lastChecked: new Date(),
      };
    }
  }
}
