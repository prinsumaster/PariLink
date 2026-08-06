import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../platform/audit/audit.service';
import {
  CreateDeveloperAppDto,
  UpdateDeveloperAppDto,
} from './dto/developer.dto';
import * as crypto from 'crypto';

@Injectable()
export class DeveloperService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  private generateClientSecret(): string {
    return 'sk_dev_' + crypto.randomBytes(32).toString('hex');
  }

  async createApp(
    companyId: string,
    userId: string,
    dto: CreateDeveloperAppDto,
  ) {
    const clientId = 'ca_' + crypto.randomBytes(16).toString('hex');
    const clientSecret = this.generateClientSecret();

    const app = await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.developerApp.create({
        data: {
          companyId,
          name: dto.name,
          description: dto.description,
          websiteUrl: dto.websiteUrl,
          clientId,
          clientSecret,
          environment: dto.environment || 'DEVELOPMENT',
          scopes: dto.scopes || [],
          redirectUris: dto.redirectUris || [],
          webhookUrl: dto.webhookUrl,
        },
      }),
    );

    await this.audit.logEvent({
      companyId,
      userId,
      entity: 'DeveloperApp',
      entityId: app.id,
      action: 'CREATE',
      details: { name: app.name, environment: app.environment },
    });

    return app;
  }

  async getApps(companyId: string) {
    return this.prisma.runAsTenant(companyId, async (tx) =>
      tx.developerApp.findMany({
        where: { companyId },
        orderBy: { createdAt: 'desc' },
      }),
    );
  }

  async getApp(companyId: string, id: string) {
    const app = await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.developerApp.findUnique({
        where: { id },
      }),
    );

    if (!app || app.companyId !== companyId) {
      throw new NotFoundException('Developer Application not found');
    }

    return app;
  }

  async updateApp(
    companyId: string,
    id: string,
    userId: string,
    dto: UpdateDeveloperAppDto,
  ) {
    const app = await this.getApp(companyId, id);

    const updated = await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.developerApp.update({
        where: { id },
        data: {
          name: dto.name,
          description: dto.description,
          websiteUrl: dto.websiteUrl,
          scopes: dto.scopes,
          redirectUris: dto.redirectUris,
          webhookUrl: dto.webhookUrl,
        },
      }),
    );

    await this.audit.logEvent({
      companyId,
      userId,
      entity: 'DeveloperApp',
      entityId: id,
      action: 'UPDATE',
      details: { updates: Object.keys(dto) },
    });

    return updated;
  }

  async rotateSecret(companyId: string, id: string, userId: string) {
    const app = await this.getApp(companyId, id);
    const newSecret = this.generateClientSecret();

    const updated = await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.developerApp.update({
        where: { id },
        data: { clientSecret: newSecret },
      }),
    );

    await this.audit.logEvent({
      companyId,
      userId,
      entity: 'DeveloperApp',
      entityId: id,
      action: 'UPDATE',
      details: { action: 'ROTATE_SECRET' },
    });

    return { clientSecret: updated.clientSecret };
  }

  async deleteApp(companyId: string, id: string, userId: string) {
    const app = await this.getApp(companyId, id);

    await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.developerApp.delete({ where: { id } }),
    );

    await this.audit.logEvent({
      companyId,
      userId,
      entity: 'DeveloperApp',
      entityId: id,
      action: 'DELETE',
      details: { name: app.name },
    });

    return { success: true };
  }
}
