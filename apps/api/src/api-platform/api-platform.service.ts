import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateApiKeyDto, CreateWebhookDto } from './dto/api-platform.dto';
import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class ApiPlatformService {
  constructor(private prisma: PrismaService) {}

  async createApiKey(companyId: string, dto: CreateApiKeyDto) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      const rawKey = `pk_test_${crypto.randomBytes(24).toString('hex')}`;
      const keyHash = await bcrypt.hash(rawKey, 10);

      const apiKey = await tx.apiKey.create({
        data: {
          companyId,
          name: dto.name,
          scopes: dto.scopes,
          keyHash,
        },
      });

      return {
        id: apiKey.id,
        name: apiKey.name,
        scopes: apiKey.scopes,
        rawKey, // ONLY RETURNED ONCE
      };
    });
  }

  async getApiKeys(companyId: string) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      return tx.apiKey.findMany({
        select: {
          id: true,
          name: true,
          scopes: true,
          isActive: true,
          lastUsed: true,
          createdAt: true,
        },
      });
    });
  }

  async registerWebhook(companyId: string, dto: CreateWebhookDto) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      return tx.webhookEndpoint.create({
        data: {
          companyId,
          url: dto.url,
          secret: dto.secret,
          events: dto.events,
        },
      });
    });
  }

  async getWebhooks(companyId: string) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      return tx.webhookEndpoint.findMany();
    });
  }
}
