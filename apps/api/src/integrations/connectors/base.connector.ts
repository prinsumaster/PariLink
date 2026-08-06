/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ConnectorConfig {
  clientId: string;
  clientSecret: string;
  scopes: string[];
  redirectUri: string;
}

export interface SyncResult {
  success: boolean;
  recordsSynced: number;
  errors?: any[];
  nextCursor?: string;
}

export abstract class BaseConnector {
  abstract readonly providerId: string;
  abstract readonly providerName: string;
  abstract readonly authType: 'OAUTH2' | 'API_KEY' | 'BASIC';
  abstract readonly supportedEntities: string[];

  constructor(protected config?: ConnectorConfig) {}

  /**
   * Generates the OAuth authorization URL for the provider.
   */
  abstract getAuthorizationUrl(state: string): string;

  /**
   * Exchanges an authorization code for access and refresh tokens.
   */
  abstract exchangeCode(code: string): Promise<any>;

  /**
   * Refreshes an expired access token.
   */
  abstract refreshToken(refreshToken: string): Promise<any>;

  /**
   * Verifies that the current connection credentials are valid.
   */
  abstract healthCheck(credentials: any): Promise<boolean>;

  /**
   * Syncs a specific entity type from the external system.
   */
  abstract syncEntity(
    entityType: string,
    credentials: any,
    lastSyncDate?: Date,
    cursor?: string,
  ): Promise<SyncResult>;

  /**
   * Pushes an event to the external system.
   */
  abstract pushEvent(
    eventType: string,
    payload: any,
    credentials: any,
  ): Promise<boolean>;
}
