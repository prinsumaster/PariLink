import { Injectable, Logger } from '@nestjs/common';
import { BaseConnector } from '../framework/base.connector';

@Injectable()
export class MapboxConnector extends BaseConnector {
  readonly providerName = 'MAPBOX';
  readonly version = '1.0.0';
  readonly authType = 'API_KEY';

  private readonly logger = new Logger(MapboxConnector.name);

  validateConfiguration(config: Record<string, unknown>): boolean {
    return !!config?.apiKey;
  }

  async authenticate(credentials: Record<string, unknown>): Promise<unknown> {
    return { apiKey: credentials.apiKey }; // Stateless, just return the key
  }

  async sync(
    _companyId: string,
    _credentials: Record<string, unknown>,
    entityType: string,
    _payload: unknown,
  ): Promise<{
    recordsProcessed?: number;
    status?: string;
    [key: string]: unknown;
  } | void> {
    this.logger.log(`[Mapbox] Syncing ${entityType}...`);
    // Example: Getting distance matrix for routing optimization
    return { recordsProcessed: 1 };
  }

  async receiveWebhook(_headers: unknown, _body: unknown): Promise<unknown> {
    throw new Error('Mapbox does not send webhooks natively.');
  }

  async send(
    endpoint: string,
    method: string,
    _credentials: Record<string, unknown>,
    _data?: unknown,
  ): Promise<unknown> {
    this.logger.log(`[Mapbox] Request ${method} ${endpoint}`);
    return { success: true };
  }

  async healthCheck(_credentials: Record<string, unknown>): Promise<boolean> {
    return true; // Simulate ping to Mapbox API
  }

  async testConnection(credentials: Record<string, unknown>): Promise<boolean> {
    return this.validateConfiguration(credentials);
  }
}
