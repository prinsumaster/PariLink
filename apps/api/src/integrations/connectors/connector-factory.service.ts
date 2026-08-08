import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { BaseConnector } from './base.connector';
import { SalesforceConnector } from './salesforce.connector';
import { QuickBooksConnector } from './quickbooks.connector';

@Injectable()
export class ConnectorFactoryService {
  private readonly logger = new Logger(ConnectorFactoryService.name);

  // Example generic environment variables for OAuth clients
  private readonly sfConfig = {
    clientId: process.env.SF_CLIENT_ID || 'mock_sf_client',
    clientSecret: process.env.SF_CLIENT_SECRET || 'mock_sf_secret',
    scopes: ['api', 'refresh_token', 'offline_access'],
    redirectUri:
      process.env.OAUTH_REDIRECT_URI ||
      `${process.env.APP_URL || 'http://localhost:3000'}/api/integrations/callback`,
  };

  private readonly qbConfig = {
    clientId: process.env.QB_CLIENT_ID || 'mock_qb_client',
    clientSecret: process.env.QB_CLIENT_SECRET || 'mock_qb_secret',
    scopes: ['com.intuit.quickbooks.accounting'],
    redirectUri:
      process.env.OAUTH_REDIRECT_URI ||
      `${process.env.APP_URL || 'http://localhost:3000'}/api/integrations/callback`,
  };

  getConnector(providerId: string): BaseConnector {
    switch (providerId.toUpperCase()) {
      case 'SALESFORCE':
        return new SalesforceConnector(this.sfConfig);
      case 'QUICKBOOKS':
        return new QuickBooksConnector(this.qbConfig);
      default:
        this.logger.error(`Connector not found for provider: ${providerId}`);
        throw new BadRequestException(`Connector not supported: ${providerId}`);
    }
  }

  getAllSupportedProviders(): string[] {
    return ['SALESFORCE', 'QUICKBOOKS'];
  }
}
