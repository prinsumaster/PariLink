export abstract class BaseConnector {
  abstract readonly providerName: string;
  abstract readonly version: string;
  abstract readonly authType: 'OAUTH2' | 'API_KEY' | 'BASIC';

  /**
   * Validates the configuration schema required for this connector
   */
  abstract validateConfiguration(config: Record<string, unknown>): boolean;

  /**
   * Authenticate and return an access token or session
   */
  abstract authenticate(credentials: Record<string, unknown>): Promise<unknown>;

  /**
   * Establish a persistent connection if needed (e.g. WebSockets)
   */
  async connect(credentials: Record<string, unknown>): Promise<boolean> {
    return true; // Default implementation
  }

  /**
   * Disconnect any persistent connections
   */
  async disconnect(): Promise<void> {
    return;
  }

  /**
   * Perform a data synchronization (Pull from external, Push to external)
   */
  abstract sync(
    companyId: string,
    credentials: unknown,
    entityType: string,
    payload: unknown,
  ): Promise<{
    recordsProcessed?: number;
    status?: string;
    [key: string]: unknown;
  } | void>;

  /**
   * Handle incoming webhooks mapped to this connector
   */
  abstract receiveWebhook(headers: unknown, body: unknown): Promise<unknown>;

  /**
   * Generic outbound HTTP request utilizing the connector's auth context
   */
  abstract send(
    endpoint: string,
    method: string,
    credentials: unknown,
    data?: unknown,
  ): Promise<unknown>;

  /**
   * Verify the third party system is reachable
   */
  abstract healthCheck(credentials: Record<string, unknown>): Promise<boolean>;

  /**
   * Test the provided credentials before saving
   */
  abstract testConnection(
    credentials: Record<string, unknown>,
  ): Promise<boolean>;
}
