import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { BaseConnector, SyncPayload } from './base-connector';
import { EventStoreService } from '../../platform/digital-twin/event-store.service';

@Injectable()
export class IntegrationHubService {
  private readonly logger = new Logger(IntegrationHubService.name);
  private readonly connectors = new Map<string, BaseConnector>();

  constructor(private readonly eventStore: EventStoreService) {}

  registerConnector(connector: BaseConnector) {
    const config = connector.getConfig();
    this.connectors.set(config.id, connector);
    this.logger.log(`Registered connector: ${config.name} (${config.type})`);
  }

  getConnector(id: string): BaseConnector {
    const connector = this.connectors.get(id);
    if (!connector) {
      throw new NotFoundException(`Connector ${id} not found`);
    }
    return connector;
  }

  getRegisteredConnectors() {
    return Array.from(this.connectors.values()).map((c) => c.getConfig());
  }

  async syncOutbound(connectorId: string, payload: SyncPayload) {
    const connector = this.getConnector(connectorId);
    this.logger.log(
      `Initiating outbound sync to ${connector.getConfig().name}`,
    );

    const result = await connector.execute(payload);

    // Audit the sync attempt
    await this.eventStore.append({
      tenantId: 'SYSTEM',
      streamId: payload.aggregateId,
      streamType: 'INTEGRATION_SYNC',
      eventType: result.success ? 'SYNC_SUCCESS' : 'SYNC_FAILED',
      payload: {
        connectorId,
        latencyMs: result.latencyMs,
        externalId: result.externalId,
        error: result.error,
      },
      userId: 'INTEGRATION_HUB',
    });

    return result;
  }
}
