import {
  Injectable,
  Logger,
  BadRequestException,
  NotImplementedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  ConfigureIntegrationDto,
  SyncIntegrationDto,
} from './dto/integrations.dto';

interface IntegrationAdapter {
  syncEntity(
    entityType: string,
    entityData: Record<string, unknown>,
    config: Record<string, unknown>,
  ): Promise<boolean>;
  checkHealth(config: Record<string, unknown>): Promise<boolean>;
}

class SapAdapter implements IntegrationAdapter {
  async syncEntity(
    entityType: string,
    entityData: Record<string, unknown>,
    config: Record<string, unknown>,
  ): Promise<boolean> {
    // Mock SAP OData call
    return true;
  }
  async checkHealth(config: Record<string, unknown>): Promise<boolean> {
    return true;
  }
}

class OracleAdapter implements IntegrationAdapter {
  async syncEntity(
    entityType: string,
    entityData: Record<string, unknown>,
    config: Record<string, unknown>,
  ): Promise<boolean> {
    // Mock Oracle ERP Cloud call
    return true;
  }
  async checkHealth(config: Record<string, unknown>): Promise<boolean> {
    return true;
  }
}

class DynamicsAdapter implements IntegrationAdapter {
  async syncEntity(
    entityType: string,
    entityData: Record<string, unknown>,
    config: Record<string, unknown>,
  ): Promise<boolean> {
    // Mock Dynamics 365 Dataverse call
    return true;
  }
  async checkHealth(config: Record<string, unknown>): Promise<boolean> {
    return true;
  }
}

@Injectable()
export class IntegrationsService {
  private readonly logger = new Logger(IntegrationsService.name);
  private readonly adapters: Record<string, IntegrationAdapter> = {
    SAP: new SapAdapter(),
    ORACLE: new OracleAdapter(),
    DYNAMICS: new DynamicsAdapter(),
  };

  constructor(private prisma: PrismaService) {}

  async configureIntegration(companyId: string, dto: ConfigureIntegrationDto) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      // Upsert integration config
      const existing = await tx.integrationConfig.findFirst({
        where: { provider: dto.provider },
      });

      if (existing) {
        return tx.integrationConfig.update({
          where: { id: existing.id },
          data: {
            credentials: dto.credentials,
            settings: (dto.settings || existing.settings) as object,
            isActive: dto.isActive,
          },
        });
      }

      return tx.integrationConfig.create({
        data: {
          companyId,
          provider: dto.provider,
          credentials: dto.credentials,
          settings: dto.settings || {},
          isActive: dto.isActive,
        },
      });
    });
  }

  async syncEntity(companyId: string, dto: SyncIntegrationDto) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      const activeIntegrations = await tx.integrationConfig.findMany({
        where: { isActive: true },
      });

      if (activeIntegrations.length === 0) {
        throw new BadRequestException('No active integrations found');
      }

      let entityData = null;
      if (dto.entityType === 'INVOICE') {
        entityData = await tx.invoice.findUnique({
          where: { id: dto.entityId },
        });
      } else if (dto.entityType === 'TRIP') {
        entityData = await tx.trip.findUnique({ where: { id: dto.entityId } });
      }

      if (!entityData) {
        throw new BadRequestException(
          `Entity ${dto.entityType} with ID ${dto.entityId} not found`,
        );
      }

      const results = [];

      for (const config of activeIntegrations) {
        const adapter = this.adapters[config.provider.toUpperCase()];
        if (!adapter) {
          this.logger.warn(`No adapter found for provider ${config.provider}`);
          results.push({
            provider: config.provider,
            success: false,
            error: 'Adapter missing',
          });
          continue;
        }

        try {
          const success = await adapter.syncEntity(
            dto.entityType,
            entityData,
            config,
          );
          results.push({ provider: config.provider, success });
        } catch (error: unknown) {
          results.push({
            provider: config.provider,
            success: false,
            error: error instanceof Error ? error.message : String(error),
          });
        }
      }

      return { results };
    });
  }

  async getIntegrations(companyId: string) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      return tx.integrationConfig.findMany({
        select: {
          id: true,
          provider: true,
          isActive: true,
          createdAt: true,
        },
      });
    });
  }
}
