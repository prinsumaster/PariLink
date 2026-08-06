import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { BaseConnector } from './base.connector';

@Injectable()
export class ConnectorRegistryService implements OnModuleInit {
  private readonly logger = new Logger(ConnectorRegistryService.name);
  private readonly connectors: Map<string, BaseConnector> = new Map();

  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit() {
    this.logger.log('Initializing Connector Registry...');
    // We will auto-register connectors when they are implemented
  }

  /**
   * Registers a connector into the memory map and DB
   */
  async registerConnector(connector: BaseConnector) {
    this.connectors.set(connector.providerName, connector);

    // Upsert into DB to keep the Marketplace catalogue updated
    await this.prisma.runAsSystem(async (tx) =>
      tx.integrationConnector.upsert({
        where: { provider: connector.providerName },
        update: {
          version: connector.version,
          authType: connector.authType,
          status: 'ACTIVE',
        },
        create: {
          provider: connector.providerName,
          version: connector.version,
          authType: connector.authType,
          status: 'ACTIVE',
        },
      }),
    );

    this.logger.log(
      `Registered Connector: ${connector.providerName} v${connector.version}`,
    );
  }

  /**
   * Retrieves an instance of a registered connector
   */
  getConnector(providerName: string): BaseConnector | undefined {
    return this.connectors.get(providerName);
  }

  /**
   * Lists all available connectors from the Registry
   */
  async listAvailableConnectors() {
    return this.prisma.runAsSystem(async (tx) =>
      tx.integrationConnector.findMany({
        where: { status: 'ACTIVE' },
      }),
    );
  }
}
