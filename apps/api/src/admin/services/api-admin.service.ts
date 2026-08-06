import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditService } from '../../platform/audit/audit.service';
import {
  CreateApiClientDto,
  CreateWebhookSecretDto,
} from '../dto/enterprise-admin.dto';
import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class ApiAdminService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  async getApiClients(companyId: string) {
    const keys = await this.prisma.runAsSystem(async (tx) =>
      tx.apiKey.findMany({
        where: { companyId },
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          scopes: true,
          environment: true,
          expiresAt: true,
          lastUsed: true,
          isActive: true,
          createdAt: true,
        },
      }),
    );

    const config = await this.prisma.runAsSystem(async (tx) =>
      tx.tenantConfig.findUnique({ where: { companyId } }),
    );
    const defaultRateLimit = config?.apiRateLimit ?? 1000;

    return keys.map((k) => ({
      ...k,
      rateLimitOverride: defaultRateLimit,
    }));
  }

  async createApiClient(
    companyId: string,
    dto: CreateApiClientDto,
    adminUserId: string,
  ) {
    const rawKey = `pk_${crypto.randomBytes(24).toString('hex')}`;
    const keyHash = await bcrypt.hash(rawKey, 10);

    const apiKey = await this.prisma.runAsSystem(async (tx) =>
      tx.apiKey.create({
        data: {
          companyId,
          name: dto.name,
          keyHash,
          scopes: dto.scopes ?? ['api:read', 'api:write'],
          isActive: true,
        },
      }),
    );

    if (dto.rateLimitOverride) {
      await this.prisma.runAsSystem(async (tx) =>
        tx.tenantConfig.upsert({
          where: { companyId },
          update: { apiRateLimit: dto.rateLimitOverride },
          create: { companyId, apiRateLimit: dto.rateLimitOverride },
        }),
      );
    }

    await this.audit.logEvent({
      action: 'admin:api:create_client',
      entity: 'ApiKey',
      entityId: apiKey.id,
      userId: adminUserId,
      companyId,
      details: { name: dto.name, scopes: dto.scopes },
    });

    return {
      id: apiKey.id,
      name: apiKey.name,
      scopes: apiKey.scopes,
      isActive: apiKey.isActive,
      apiKey: rawKey,
      rateLimitOverride: dto.rateLimitOverride ?? 1000,
    };
  }

  async revokeApiClient(companyId: string, keyId: string, adminUserId: string) {
    const existing = await this.prisma.runAsSystem(async (tx) =>
      tx.apiKey.findFirst({
        where: { id: keyId, companyId },
      }),
    );
    if (!existing) throw new NotFoundException(`API key ${keyId} not found`);

    await this.prisma.runAsSystem(async (tx) =>
      tx.apiKey.update({
        where: { id: keyId },
        data: { isActive: false },
      }),
    );

    await this.audit.logEvent({
      action: 'admin:api:revoke_client',
      entity: 'ApiKey',
      entityId: keyId,
      userId: adminUserId,
      companyId,
      details: { name: existing.name },
    });

    return { success: true, message: `API Key ${existing.name} revoked` };
  }

  async getOAuthClients(companyId: string) {
    return this.prisma.runAsSystem(async (tx) =>
      tx.oAuthClient.findMany({
        where: { companyId },
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          clientId: true,
          name: true,
          description: true,
          scopes: true,
          redirectUris: true,
          grantTypes: true,
          isActive: true,
          createdAt: true,
        },
      }),
    );
  }

  getAvailableScopes() {
    return [
      { scope: 'api:read', description: 'Read access to REST APIs' },
      { scope: 'api:write', description: 'Write access to REST APIs' },
      {
        scope: 'webhooks:manage',
        description: 'Manage webhook endpoints and secrets',
      },
      { scope: 'trips:read', description: 'Read trip schedules and telemetry' },
      { scope: 'trips:write', description: 'Create and update trips' },
      {
        scope: 'billing:read',
        description: 'Read invoices and financial ledger',
      },
    ];
  }

  async getWebhookEndpoints(companyId: string) {
    return this.prisma.runAsSystem(async (tx) =>
      tx.webhookEndpoint.findMany({
        where: { companyId },
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          url: true,
          events: true,
          isActive: true,
          retryCount: true,
          createdAt: true,
        },
      }),
    );
  }

  async createWebhookSecret(
    companyId: string,
    dto: CreateWebhookSecretDto,
    adminUserId: string,
  ) {
    const secret = `whsec_${crypto.randomBytes(24).toString('hex')}`;

    const endpoint = await this.prisma.runAsSystem(async (tx) =>
      tx.webhookEndpoint.create({
        data: {
          companyId,
          url: dto.endpointUrl,
          secret,
          events: dto.events ?? ['*'],
          isActive: true,
        },
      }),
    );

    await this.audit.logEvent({
      action: 'admin:api:create_webhook',
      entity: 'WebhookEndpoint',
      entityId: endpoint.id,
      userId: adminUserId,
      companyId,
      details: { url: dto.endpointUrl, events: dto.events },
    });

    return {
      id: endpoint.id,
      url: endpoint.url,
      events: endpoint.events,
      isActive: endpoint.isActive,
      signingSecret: secret,
    };
  }
}
