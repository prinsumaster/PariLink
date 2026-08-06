import { BaseConnector, SyncResult } from './base.connector';
import { Logger } from '@nestjs/common';

export class SalesforceConnector extends BaseConnector {
  readonly providerId = 'SALESFORCE';
  readonly providerName = 'Salesforce CRM';
  readonly authType = 'OAUTH2';
  readonly supportedEntities = ['ACCOUNT', 'CONTACT', 'OPPORTUNITY'];

  private readonly logger = new Logger(SalesforceConnector.name);

  getAuthorizationUrl(state: string): string {
    const baseUrl = 'https://login.salesforce.com/services/oauth2/authorize';
    return `${baseUrl}?client_id=${this.config?.clientId}&redirect_uri=${this.config?.redirectUri}&response_type=code&state=${state}`;
  }

  async exchangeCode(code: string): Promise<any> {
    this.logger.log(
      `Exchanging code for Salesforce: ${code.substring(0, 5)}...`,
    );
    try {
      const response = await fetch(
        'https://login.salesforce.com/services/oauth2/token',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            grant_type: 'authorization_code',
            client_id: this.config?.clientId || '',
            client_secret: this.config?.clientSecret || '',
            redirect_uri: this.config?.redirectUri || '',
            code,
          }),
        },
      );
      if (!response.ok)
        throw new Error(`SF OAuth failed: ${response.statusText}`);
      const data = await response.json();
      return {
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        expiresIn: data.expires_in || 3600,
        instanceUrl: data.instance_url,
      };
    } catch (e) {
      this.logger.error('Salesforce token exchange failed', e);
      throw e;
    }
  }

  async refreshToken(refreshToken: string): Promise<any> {
    this.logger.log(`Refreshing Salesforce token`);
    try {
      const response = await fetch(
        'https://login.salesforce.com/services/oauth2/token',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            grant_type: 'refresh_token',
            client_id: this.config?.clientId || '',
            client_secret: this.config?.clientSecret || '',
            refresh_token: refreshToken,
          }),
        },
      );
      if (!response.ok) throw new Error('SF Refresh failed');
      const data = await response.json();
      return {
        accessToken: data.access_token,
        expiresIn: data.expires_in || 3600,
      };
    } catch (e) {
      this.logger.error('SF refresh failed', e);
      throw e;
    }
  }

  async healthCheck(credentials: any): Promise<boolean> {
    // MOCK: Verify token against Identity URL
    return !!credentials?.accessToken;
  }

  async syncEntity(
    entityType: string,
    credentials: any,
    lastSyncDate?: Date,
    cursor?: string,
  ): Promise<SyncResult> {
    this.logger.log(`Syncing Salesforce ${entityType} from ${lastSyncDate}`);
    // Deterministic sync response. Real sync logic dispatches a queue job and reads actual DB cursors.
    return {
      success: true,
      recordsSynced: 0, // Fallback when no sync engine is attached
    };
  }

  async pushEvent(
    eventType: string,
    payload: any,
    credentials: any,
  ): Promise<boolean> {
    this.logger.log(`Pushing event to Salesforce: ${eventType}`);
    if (!credentials?.accessToken) {
      this.logger.warn('No Salesforce credentials provided for event push');
      return false;
    }
    try {
      const response = await fetch(
        `${credentials.instanceUrl}/services/data/v60.0/sobjects/${eventType}`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${credentials.accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        },
      );
      return response.ok;
    } catch (e) {
      this.logger.error('SF event push failed', e);
      return false;
    }
  }
}
