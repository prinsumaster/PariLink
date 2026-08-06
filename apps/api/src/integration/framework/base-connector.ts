import { Injectable, Logger } from '@nestjs/common';

export interface ConnectorConfig {
  id: string;
  name: string;
  type: 'REST' | 'GRAPHQL' | 'SOAP' | 'WEBHOOK' | 'FTP' | 'QUEUE';
  authType: 'API_KEY' | 'OAUTH2' | 'BASIC' | 'NONE';
  credentials: Record<string, string>;
  direction: 'INBOUND' | 'OUTBOUND' | 'BIDIRECTIONAL';
  status: 'ACTIVE' | 'INACTIVE' | 'ERROR';
  rateLimitPerMin?: number;
}

export interface SyncPayload {
  aggregateId: string;
  aggregateType: string;
  data: any;
}

export interface SyncResult {
  success: boolean;
  externalId?: string;
  error?: string;
  latencyMs: number;
}

export abstract class BaseConnector {
  protected readonly logger = new Logger(this.constructor.name);

  constructor(protected readonly config: ConnectorConfig) {}

  abstract authenticate(): Promise<boolean>;
  abstract validate(payload: SyncPayload): boolean;
  abstract sync(payload: SyncPayload): Promise<SyncResult>;

  async execute(payload: SyncPayload): Promise<SyncResult> {
    const start = Date.now();
    try {
      if (this.config.status !== 'ACTIVE') {
        throw new Error(`Connector ${this.config.name} is not active`);
      }

      await this.authenticate();

      if (!this.validate(payload)) {
        throw new Error(`Invalid payload for connector ${this.config.name}`);
      }

      const result = await this.sync(payload);
      return {
        ...result,
        latencyMs: Date.now() - start,
      };
    } catch (err: any) {
      this.logger.error(`Sync failed for ${this.config.name}: ${err.message}`);
      return {
        success: false,
        error: err.message,
        latencyMs: Date.now() - start,
      };
    }
  }

  getConfig(): ConnectorConfig {
    return this.config;
  }
}
