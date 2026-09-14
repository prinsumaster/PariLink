import { Injectable, Logger } from '@nestjs/common';
import { BaseConnector } from '../framework/base.connector';

@Injectable()
export class AccountingSoftwareConnector extends BaseConnector {
  readonly providerName = 'XERO_FINANCE';
  readonly version = 'v1.0';
  readonly authType = 'OAUTH2';

  private readonly logger = new Logger(AccountingSoftwareConnector.name);

  validateConfiguration(config: Record<string, unknown>): boolean {
    return !!(config.clientId && config.clientSecret && config.tenantId);
  }

  async authenticate(credentials: Record<string, unknown>): Promise<unknown> {
    this.logger.log(
      `Authenticating with Xero OAuth2 for tenant ${credentials.tenantId}`,
    );
    return { accessToken: 'xero_mock_token_8891' };
  }

  async syncInvoice(
    invoicePayload: unknown,
  ): Promise<{ recordsProcessed: number }> {
    const id = (invoicePayload as { invoiceId?: string })?.invoiceId;
    this.logger.log(`Syncing Invoice ${id} to Xero`);
    // Mock HTTP call to Xero /api.xro/2.0/Invoices
    return { recordsProcessed: 1 };
  }

  async sync(
    _companyId: string,
    _credentials: Record<string, unknown>,
    entityType: string,
    payload: unknown,
  ): Promise<{
    recordsProcessed?: number;
    status?: string;
    [key: string]: unknown;
  } | void> {
    if (entityType === 'INVOICE') return this.syncInvoice(payload);
    return;
  }

  async receiveWebhook(_headers: unknown, _body: unknown): Promise<unknown> {
    return { received: true };
  }

  async send(
    _endpoint: string,
    _method: string,
    _credentials: Record<string, unknown>,
    _data?: unknown,
  ): Promise<unknown> {
    return { success: true };
  }

  async healthCheck(_credentials: Record<string, unknown>): Promise<boolean> {
    return true;
  }

  async testConnection(_credentials: Record<string, unknown>): Promise<boolean> {
    return true;
  }
}
