import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditService } from '../../platform/audit/audit.service';
import * as crypto from 'crypto';

@Injectable()
export class ApiKeyService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  private hashKey(key: string): string {
    return crypto.createHash('sha256').update(key).digest('hex');
  }

  private generateKeyString(): string {
    return `pk_${crypto.randomBytes(32).toString('hex')}`;
  }

  async createApiKey(
    companyId: string,
    name: string,
    scopes: string[] = [],
    userId?: string,
    environment = 'production',
    expiresInDays?: number,
  ) {
    const rawKey = this.generateKeyString();
    const keyHash = this.hashKey(rawKey);

    let expiresAt: Date | null = null;
    if (expiresInDays) {
      expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + expiresInDays);
    }

    const apiKey = await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.apiKey.create({
        data: {
          companyId,
          userId,
          name,
          keyHash,
          scopes: JSON.stringify(scopes),
          environment,
          expiresAt,
        },
      }),
    );

    await this.audit.logEvent({
      companyId,
      userId,
      entity: 'ApiKey',
      entityId: apiKey.id,
      action: 'CREATE',
      details: { name, environment, scopes },
      source: 'IAM',
    });

    // Return raw key only once
    return {
      id: apiKey.id,
      name: apiKey.name,
      rawKey, // Plain text key to be shown only once
      expiresAt: apiKey.expiresAt,
    };
  }

  async validateApiKey(rawKey: string) {
    const keyHash = this.hashKey(rawKey);

    const apiKey = await this.prisma.runAsSystem(async (tx) =>
      tx.apiKey.findFirst({
        where: { keyHash, isActive: true },
        include: { user: true, company: true },
      }),
    );

    if (!apiKey) {
      throw new UnauthorizedException('Invalid API Key');
    }

    if (apiKey.expiresAt && apiKey.expiresAt < new Date()) {
      throw new UnauthorizedException('API Key has expired');
    }

    // Update lastUsed asynchronously
    this.prisma
      .runAsSystem(async (tx) =>
        tx.apiKey.update({
          where: { id: apiKey.id },
          data: { lastUsed: new Date() },
        }),
      )
      .catch(() => {}); // Fire and forget

    return apiKey;
  }

  async revokeApiKey(id: string, companyId: string, userId?: string) {
    const apiKey = await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.apiKey.findFirst({
        where: { id, companyId },
      }),
    );

    if (!apiKey) {
      throw new NotFoundException('API Key not found');
    }

    await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.apiKey.updateMany({
        where: { id, companyId },
        data: { isActive: false },
      }),
    );

    await this.audit.logEvent({
      companyId,
      userId,
      entity: 'ApiKey',
      entityId: id,
      action: 'REVOKE',
      source: 'IAM',
    });

    return { success: true };
  }
}
