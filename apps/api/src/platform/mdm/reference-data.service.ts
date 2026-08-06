import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  CacheManagerService,
  CacheTTL,
} from '../performance/cache-manager.service';

@Injectable()
export class ReferenceDataService {
  private readonly logger = new Logger(ReferenceDataService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly cache: CacheManagerService,
  ) {}

  /** Get all active reference data for a specific domain (e.g. 'STATE', 'CURRENCY') */
  async getReferenceData(domain: string) {
    const cacheKey = `refdata:${domain}`;
    const cached = await this.cache.get(cacheKey);
    if (cached) return cached;

    const data = await this.prisma.runAsSystem(async (tx) =>
      tx.referenceData.findMany({
        where: { domain, isActive: true },
        orderBy: { code: 'asc' },
      }),
    );

    await this.cache.set(cacheKey, data, CacheTTL.FROZEN, ['refdata']);
    return data;
  }

  /** Get a specific reference record by domain and code */
  async getReferenceRecord(domain: string, code: string) {
    const cacheKey = `refdata:${domain}:${code}`;
    const cached = await this.cache.get(cacheKey);
    if (cached) return cached;

    const data = await this.prisma.runAsSystem(async (tx) =>
      tx.referenceData.findUnique({
        where: { domain_code: { domain, code } },
      }),
    );

    if (data) {
      await this.cache.set(cacheKey, data, CacheTTL.FROZEN, [
        'refdata',
        `refdata:${domain}`,
      ]);
    }
    return data;
  }

  /** Create or update a reference data record (Admin only) */
  async upsertReferenceData(
    domain: string,
    code: string,
    name: string,
    attributes?: Record<string, any>,
  ) {
    const result = await this.prisma.runAsSystem(async (tx) =>
      tx.referenceData.upsert({
        where: { domain_code: { domain, code } },
        update: { name, attributes, version: { increment: 1 } },
        create: { domain, code, name, attributes },
      }),
    );

    // Invalidate caches
    await this.cache.invalidateByTag(`refdata:${domain}`);
    return result;
  }
}
