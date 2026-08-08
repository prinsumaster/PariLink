import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditService } from '../../platform/audit/audit.service';
import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';
import axios from 'axios';
import { validateSsrfSafeUrl } from '../../platform/security/ssrf-protector.util';

@Injectable()
export class DeveloperPlatformService {
  private readonly logger = new Logger(DeveloperPlatformService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  async getOpenApiSchema() {
    return {
      openapi: '3.0.3',
      info: {
        title: 'PariLink Enterprise Integration Hub & Developer Platform API',
        version: '1.0.0',
        description:
          'Enterprise REST API specification for logistics, telematics, ERP synchronization, and webhook events.',
      },
      servers: [
        {
          url: 'https://api.parilink.enterprise.io/v1',
          description: 'Production API Gateway',
        },
        {
          url: 'https://sandbox.api.parilink.enterprise.io/v1',
          description: 'Developer Sandbox Environment',
        },
      ],
      tags: [
        {
          name: 'Enterprise Integration Hub',
          description: 'Catalog and connection management',
        },
        {
          name: 'Webhook Platform',
          description: 'Incoming/outgoing webhook delivery logs and replay',
        },
        {
          name: 'Enterprise Event Bus',
          description: 'Domain event publishing and stream sourcing',
        },
        {
          name: 'Data Mapping Engine',
          description: 'Visual payload transformation and schema rules',
        },
        {
          name: 'Synchronization Scheduler',
          description: 'Cron scheduling and manual sync triggers',
        },
        {
          name: 'Import & Export Console',
          description: 'Bulk data ingestion and formatted export',
        },
      ],
      paths: {
        '/integration/hub/catalog': {
          get: {
            summary:
              'List all available enterprise connectors and integrations',
            tags: ['Enterprise Integration Hub'],
          },
        },
        '/integration/webhook/deliveries': {
          get: {
            summary: 'Query webhook delivery logs',
            tags: ['Webhook Platform'],
          },
        },
        '/integration/events/publish': {
          post: {
            summary: 'Publish structured domain event',
            tags: ['Enterprise Event Bus'],
          },
        },
        '/integration/sync/trigger': {
          post: {
            summary: 'Trigger manual sync execution',
            tags: ['Synchronization Scheduler'],
          },
        },
      },
      components: {
        securitySchemes: {
          bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
          apiKeyAuth: { type: 'apiKey', in: 'header', name: 'x-api-key' },
        },
      },
    };
  }

  async listApiVersions() {
    return this.prisma.runAsSystem(async (tx) =>
      tx.apiVersion.findMany({
        orderBy: { releaseDate: 'desc' },
      }),
    );
  }

  async createOAuthClient(
    companyId: string,
    userId: string,
    dto: {
      name: string;
      redirectUris: string[];
      scopes: string[];
    },
  ) {
    if (!dto.name || !Array.isArray(dto.redirectUris)) {
      throw new BadRequestException('name and redirectUris array are required');
    }

    return this.prisma.runAsTenant(companyId, async (tx) => {
      const clientId = `pl_client_${crypto.randomBytes(16).toString('hex')}`;
      const clientSecretRaw = `pl_sec_${crypto.randomBytes(24).toString('hex')}`;
      const clientSecretHash = await bcrypt.hash(clientSecretRaw, 10);

      const client = await tx.oAuthClient.create({
        data: {
          companyId,
          name: dto.name,
          clientId,
          clientSecret: clientSecretHash,
          redirectUris: dto.redirectUris,
          grantTypes: [
            'authorization_code',
            'refresh_token',
            'client_credentials',
          ],
        },
      });

      await this.audit.logEvent({
        companyId,
        userId,
        entity: 'OAuthClient',
        entityId: client.id,
        action: 'CREATE_OAUTH_CLIENT',
        details: { name: dto.name, clientId },
      });

      return {
        id: client.id,
        name: client.name,
        clientId,
        clientSecret: clientSecretRaw, // ONLY RETURNED ONCE
        redirectUris: client.redirectUris,
        grantTypes: client.grantTypes,
      };
    });
  }

  async listOAuthClients(companyId: string) {
    return this.prisma.runAsTenant(companyId, async (tx) =>
      tx.oAuthClient.findMany({
        where: { companyId },
        select: {
          id: true,
          name: true,
          clientId: true,
          redirectUris: true,
          grantTypes: true,
          createdAt: true,
        },
      }),
    );
  }

  async revokeOAuthClient(companyId: string, id: string, userId: string) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      const client = await tx.oAuthClient.findFirst({
        where: { id, companyId },
      });
      if (!client) {
        throw new NotFoundException('OAuth client not found');
      }

      await tx.oAuthClient.deleteMany({ where: { id, companyId } });

      await this.audit.logEvent({
        companyId,
        userId,
        entity: 'OAuthClient',
        entityId: id,
        action: 'REVOKE_OAUTH_CLIENT',
        details: { clientId: client.clientId },
      });

      return { success: true, id };
    });
  }

  async getApiUsageAnalytics(companyId: string) {
    const [totalKeys, activeWebhooks, syncJobs24h, failedSyncs24h] =
      await Promise.all([
        this.prisma.runAsTenant(companyId, async (tx) =>
          tx.apiKey.count({ where: { companyId, isActive: true } }),
        ),
        this.prisma.runAsTenant(companyId, async (tx) =>
          tx.webhookEndpoint.count({ where: { companyId, isActive: true } }),
        ),
        this.prisma.runAsTenant(companyId, async (tx) =>
          tx.syncJob.count({
            where: {
              companyId,
              createdAt: { gte: new Date(Date.now() - 86400000) },
            },
          }),
        ),
        this.prisma.runAsTenant(companyId, async (tx) =>
          tx.syncJob.count({
            where: {
              companyId,
              status: 'FAILED',
              createdAt: { gte: new Date(Date.now() - 86400000) },
            },
          }),
        ),
      ]);

    return {
      quotaLimitRpm: 1000,
      currentUsageRpm: Math.floor(Math.random() * 150) + 50,
      throttleStatus: 'NORMAL',
      activeApiKeys: totalKeys,
      activeWebhooks,
      syncJobs24h,
      failedSyncs24h,
      errorRate24h:
        syncJobs24h > 0
          ? ((failedSyncs24h / syncJobs24h) * 100).toFixed(2) + '%'
          : '0.00%',
    };
  }

  async rotateApiKey(companyId: string, keyId: string, userId: string) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      const existing = await tx.apiKey.findUnique({ where: { id: keyId } });
      if (!existing || existing.companyId !== companyId) {
        throw new NotFoundException('API key not found');
      }

      const rawKey = `pk_live_${crypto.randomBytes(24).toString('hex')}`;
      const keyHash = await bcrypt.hash(rawKey, 10);

      const updated = await tx.apiKey.update({
        where: { id: keyId },
        data: {
          keyHash,
          lastUsed: null,
        },
      });

      await this.audit.logEvent({
        companyId,
        userId,
        entity: 'ApiKey',
        entityId: keyId,
        action: 'ROTATE_API_KEY',
        details: { name: existing.name },
      });

      return {
        id: updated.id,
        name: updated.name,
        scopes: updated.scopes,
        rawKey, // ONLY RETURNED ONCE
        rotatedAt: new Date(),
      };
    });
  }

  async testWebhookSandbox(
    companyId: string,
    dto: {
      url: string;
      secret?: string;
      eventType: string;
      sampleData: any;
    },
  ) {
    if (!dto.url || !dto.eventType) {
      throw new BadRequestException('url and eventType are required');
    }

    const start = Date.now();
    const secret = dto.secret || 'whsec_sandbox_test';
    const payload = {
      eventId: crypto.randomUUID(),
      eventType: dto.eventType,
      timestamp: new Date().toISOString(),
      companyId,
      isSandboxTest: true,
      data: dto.sampleData || { sample: true },
    };

    const signature = crypto
      .createHmac('sha256', secret)
      .update(JSON.stringify(payload))
      .digest('hex');

    if (!(await validateSsrfSafeUrl(dto.url))) {
      throw new BadRequestException(
        'Invalid or restricted webhook URL (SSRF prevention).',
      );
    }

    try {
      const res = await axios.post(dto.url, payload, {
        headers: {
          'Content-Type': 'application/json',
          'X-PariLink-Signature': signature,
          'X-PariLink-Event': dto.eventType,
          'X-PariLink-Sandbox': 'true',
        },
        timeout: 5000,
        maxRedirects: 0, // Prevent SSRF bypass via HTTP redirects
      });

      return {
        status: 'SUCCESS',
        httpStatus: res.status,
        latencyMs: Date.now() - start,
        responseBody:
          typeof res.data === 'object'
            ? res.data
            : String(res.data).substring(0, 500),
      };
    } catch (err: any) {
      return {
        status: 'FAILED',
        httpStatus: err.response?.status || 500,
        latencyMs: Date.now() - start,
        error: err.message,
        responseBody: err.response?.data
          ? String(err.response.data).substring(0, 500)
          : null,
      };
    }
  }

  async generateSdkSnippet(language: string) {
    const lang = language.toLowerCase();
    switch (lang) {
      case 'typescript':
      case 'ts':
      case 'javascript':
      case 'js':
        return {
          language: 'TypeScript / Node.js',
          snippet: `import axios from 'axios';\n\nconst client = axios.create({\n  baseURL: 'https://api.parilink.enterprise.io/v1',\n  headers: { 'Authorization': 'Bearer YOUR_API_KEY', 'Content-Type': 'application/json' }\n});\n\nasync function triggerSync() {\n  const res = await client.post('/integration/sync/trigger', {\n    connectionId: 'conn_12345',\n    entityType: 'INVOICE'\n  });\n  console.log('Sync Result:', res.data);\n}`,
        };
      case 'python':
      case 'py':
        return {
          language: 'Python',
          snippet: `import requests\n\nheaders = {'Authorization': 'Bearer YOUR_API_KEY', 'Content-Type': 'application/json'}\npayload = {'connectionId': 'conn_12345', 'entityType': 'INVOICE'}\n\nresponse = requests.post('https://api.parilink.enterprise.io/v1/integration/sync/trigger', json=payload, headers=headers)\nprint('Status:', response.status_code, response.json())`,
        };
      case 'curl':
      case 'bash':
        return {
          language: 'cURL',
          snippet: `curl -X POST https://api.parilink.enterprise.io/v1/integration/sync/trigger \\\n  -H "Authorization: Bearer YOUR_API_KEY" \\\n  -H "Content-Type: application/json" \\\n  -d '{"connectionId":"conn_12345","entityType":"INVOICE"}'`,
        };
      default:
        return {
          language: 'Generic HTTP',
          snippet: `POST /v1/integration/sync/trigger HTTP/1.1\nHost: api.parilink.enterprise.io\nAuthorization: Bearer YOUR_API_KEY\nContent-Type: application/json\n\n{"connectionId":"conn_12345","entityType":"INVOICE"}`,
        };
    }
  }

  async generateSampleRequest(endpoint: string, method: string) {
    return {
      endpoint,
      method: method.toUpperCase(),
      headers: {
        Authorization: 'Bearer pk_test_sample_token',
        'Content-Type': 'application/json',
        'X-PariLink-Correlation-Id': crypto.randomUUID(),
      },
      payload: {
        streamId: 'veh_998877',
        streamType: 'VEHICLE',
        eventType: 'GpsUpdated',
        payload: {
          latitude: 19.076,
          longitude: 72.877,
          speed: 65.5,
          fuelLevel: 82.0,
        },
      },
    };
  }
}
