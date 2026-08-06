import { Injectable, Logger } from '@nestjs/common';
import { BaseConnector } from '../framework/base.connector';

@Injectable()
export class QuickBooksConnector extends BaseConnector {
  readonly providerName = 'QUICKBOOKS';
  readonly version = '1.0.0';
  readonly authType = 'OAUTH2';

  private readonly logger = new Logger(QuickBooksConnector.name);

  validateConfiguration(config: Record<string, unknown>): boolean {
    return !!(config?.clientId && config?.clientSecret && config?.realmId);
  }

  async authenticate(credentials: Record<string, unknown>): Promise<unknown> {
    // In reality, this exchanges OAuth codes for Access & Refresh Tokens
    this.logger.log(`[QuickBooks] Authenticating...`);
    return { accessToken: 'dummy_token', refreshToken: 'dummy_refresh' };
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
    this.logger.log(`[QuickBooks] Syncing ${entityType}...`);
    // Push Invoice to QB, or Pull payments from QB
    return { recordsProcessed: 1 };
  }

  async receiveWebhook(headers: unknown, body: unknown): Promise<unknown> {
    const b = body as {
      eventNotifications?: {
        dataChangeEvent?: { entities?: { name?: string }[] };
      }[];
    };
    return {
      event: b?.eventNotifications?.[0]?.dataChangeEvent?.entities?.[0]?.name,
    };
  }

  async send(
    endpoint: string,
    method: string,
    credentials: Record<string, unknown>,
    data?: unknown,
  ): Promise<unknown> {
    this.logger.log(`[QuickBooks] Request ${method} ${endpoint}`);
    return { success: true };
  }

  async healthCheck(credentials: Record<string, unknown>): Promise<boolean> {
    return true;
  }

  async testConnection(credentials: Record<string, unknown>): Promise<boolean> {
    return this.validateConfiguration(credentials);
  }
}
