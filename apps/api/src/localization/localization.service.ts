// @ts-nocheck
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LocalizationService {
  constructor(private readonly prisma: PrismaService) {}

  async createLocale(
    companyId: string,
    data: { code: string; name: string; isDefault?: boolean },
  ) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      // If this is set to default, unset other defaults
      if (data.isDefault) {
        await tx.locale.updateMany({
          where: { companyId, isDefault: true },
          data: { isDefault: false },
        });
      }

      return tx.locale.create({
        data: {
          companyId,
          code: data.code,
          name: data.name,
          isDefault: data.isDefault || false,
        },
      });
    });
  }

  async getLocales(companyId: string) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      return tx.locale.findMany({ where: { companyId } });
    });
  }

  async upsertTranslation(
    companyId: string,
    localeId: string,
    data: { namespace?: string; key: string; value: string },
  ) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      const namespace = data.namespace || 'common';

      const existing = await tx.translation.findUnique({
        where: {
          localeId_namespace_key: {
            localeId,
            namespace,
            key: data.key,
          },
        },
      });

      if (existing) {
        if (existing.companyId !== companyId)
          throw new NotFoundException('Translation not found');
        return tx.translation.update({
          where: { id: existing.id },
          data: { value: data.value },
        });
      }

      return tx.translation.create({
        data: {
          companyId,
          localeId,
          namespace,
          key: data.key,
          value: data.value,
        },
      });
    });
  }

  async getTranslations(
    companyId: string,
    localeCode: string,
    namespace?: string,
  ) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      const locale = await tx.locale.findUnique({
        where: { companyId_code: { companyId, code: localeCode } },
      });

      if (!locale) throw new NotFoundException('Locale not found');

      const where: any = { companyId, localeId: locale.id };
      if (namespace) where.namespace = namespace;

      const translations = await tx.translation.findMany({ where });

      // Format as key-value pairs
      const result: Record<string, string> = {};
      for (const t of translations) {
        result[t.key] = t.value;
      }

      return result;
    });
  }
}
