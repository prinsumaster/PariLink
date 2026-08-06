import { Injectable, Logger } from '@nestjs/common';
import { BaseConnector } from '../framework/base.connector';

@Injectable()
export class SamsaraTelematicsConnector extends BaseConnector {
  readonly providerName = 'SAMSARA_TELEMATICS';
  readonly version = 'v1.0';
  readonly authType = 'API_KEY';

  private readonly logger = new Logger(SamsaraTelematicsConnector.name);

  validateConfiguration(config: Record<string, unknown>): boolean {
    return !!(config.apiKey && config.region);
  }

  async authenticate(credentials: Record<string, unknown>): Promise<unknown> {
    this.logger.log(`Authenticating with Samsara API Key`);
    return { authenticated: true };
  }

  async fetchGpsStream(vehicleId: string): Promise<unknown> {
    this.logger.log(`Fetching live GPS stream for vehicle ${vehicleId}`);
    return {
      lat: 19.076,
      lng: 72.8777,
      speed: 55,
      heading: 120,
      timestamp: new Date().toISOString(),
    };
  }

  async sync(
    companyId: string,
    credentials: Record<string, unknown>,
    entityType: string,
    payload: unknown,
  ): Promise<{
    recordsProcessed?: number;
    status?: string;
    [key: string]: unknown;
  } | void> {
    if (entityType === 'TELEMETRY') {
      await this.fetchGpsStream((payload as { vehicleId: string }).vehicleId);
      return { recordsProcessed: 1 };
    }
    return;
  }

  async receiveWebhook(headers: unknown, body: unknown): Promise<unknown> {
    const b = body as { eventType?: string };
    return { event: b?.eventType || 'telematics.update', data: body };
  }

  async send(
    endpoint: string,
    method: string,
    credentials: Record<string, unknown>,
    data?: unknown,
  ): Promise<unknown> {
    return { success: true };
  }

  async healthCheck(credentials: Record<string, unknown>): Promise<boolean> {
    return true;
  }

  async testConnection(credentials: Record<string, unknown>): Promise<boolean> {
    return true;
  }
}
