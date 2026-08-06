import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { InstallAppDto } from './dto/install-app.dto';
import * as crypto from 'crypto';

@Injectable()
export class MarketplaceCoreService {
  private readonly logger = new Logger(MarketplaceCoreService.name);

  // In a real production system, this would be injected via ConfigService
  private readonly encryptionKey = Buffer.from(
    'vOVH6sdmpNWjRRIqCc7rdxs01lwHzfr3',
    'utf-8',
  ); // 32 bytes

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Retrieves the marketplace catalog with optional filtering
   */
  async getCatalog(query: { search?: string; category?: string }) {
    const whereClause: any = { status: 'ACTIVE' };

    if (query.category && query.category !== 'all') {
      whereClause.category = {
        name: { equals: query.category, mode: 'insensitive' },
      };
    }

    if (query.search) {
      whereClause.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const apps = await this.prisma.runAsSystem(async (tx) =>
      tx.marketplaceApp.findMany({
        where: whereClause,
        include: {
          category: true,
          developer: true,
          versions: {
            where: { isLatest: true },
            take: 1,
          },
          permissions: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
    );

    return apps;
  }

  /**
   * Retrieves a single app's details
   */
  async getAppDetails(appId: string) {
    const app = await this.prisma.runAsSystem(async (tx) =>
      tx.marketplaceApp.findUnique({
        where: { id: appId },
        include: {
          category: true,
          developer: true,
          versions: {
            orderBy: { createdAt: 'desc' },
          },
          permissions: true,
          screenshots: {
            orderBy: { order: 'asc' },
          },
        },
      }),
    );

    if (!app) {
      throw new NotFoundException(`App with ID ${appId} not found`);
    }

    return app;
  }

  /**
   * Gets all installed apps for a company
   */
  async getInstalledApps(companyId: string) {
    return this.prisma.runAsTenant(companyId, async (tx) =>
      tx.appInstallation.findMany({
        where: { companyId },
        include: {
          app: {
            include: {
              category: true,
              developer: true,
            },
          },
          healths: {
            orderBy: { timestamp: 'desc' },
            take: 1,
          },
          usageStats: {
            orderBy: { date: 'desc' },
            take: 1,
          },
        },
      }),
    );
  }

  /**
   * Gets details for a specific installation
   */
  async getInstallationDetails(companyId: string, appId: string) {
    const installation = await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.appInstallation.findUnique({
        where: {
          companyId_appId: {
            companyId,
            appId,
          },
        },
        include: {
          app: true,
          configurations: true,
          webhooks: true,
          healths: {
            orderBy: { timestamp: 'desc' },
            take: 10,
          },
        },
      }),
    );

    if (!installation) {
      throw new NotFoundException(`Installation not found for app ${appId}`);
    }

    // Do NOT return decrypted credentials to the client.
    const { credentials, ...safeInstallation } = installation;
    return safeInstallation;
  }

  /**
   * Encrypts sensitive credentials
   */
  private encryptSecret(text: string): string {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-gcm', this.encryptionKey, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const authTag = cipher.getAuthTag().toString('hex');
    return `${iv.toString('hex')}:${encrypted}:${authTag}`;
  }

  /**
   * Main installation workflow wrapped in a Prisma transaction
   */
  async installApp(companyId: string, userId: string, dto: InstallAppDto) {
    // 1. Validate App exists
    const app = await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.marketplaceApp.findUnique({
        where: { id: dto.appId },
        include: { versions: { where: { isLatest: true } } },
      }),
    );

    if (!app) {
      throw new NotFoundException(`App ${dto.appId} not found`);
    }

    // 2. Check if already installed
    const existing = await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.appInstallation.findUnique({
        where: {
          companyId_appId: {
            companyId,
            appId: dto.appId,
          },
        },
      }),
    );

    if (existing) {
      throw new BadRequestException('App is already installed');
    }

    // 3. Encrypt credentials if provided
    const encryptedCredentials: Record<string, string> = {};
    if (dto.credentials) {
      for (const [key, value] of Object.entries(dto.credentials)) {
        if (typeof value === 'string') {
          encryptedCredentials[key] = this.encryptSecret(value);
        }
      }
    }

    // 4. Transactional Installation
    return this.prisma.$transaction(async (tx) => {
      // Create Base Installation
      const installation = await tx.appInstallation.create({
        data: {
          companyId,
          appId: dto.appId,
          version: dto.version || (app.versions[0]?.version ?? '1.0.0'),
          status: 'ACTIVE',
          healthStatus: 'HEALTHY',
          credentials: encryptedCredentials,
          settings: dto.settings || {},
          installedBy: userId,
        },
      });

      // Create Webhooks if provided
      if (dto.webhooks && dto.webhooks.length > 0) {
        await tx.appWebhook.createMany({
          data: dto.webhooks.map((wh) => ({
            appInstallationId: installation.id,
            url: wh.url,
            events: wh.events,
          })),
        });
      }

      // Initialize Health Record
      await tx.appHealth.create({
        data: {
          appInstallationId: installation.id,
          status: 'HEALTHY',
          details: { message: 'Initial installation completed successfully' },
        },
      });

      // Initialize Usage Stats
      await tx.appUsageStatistic.create({
        data: {
          appInstallationId: installation.id,
        },
      });

      this.logger.log(
        `App ${app.name} installed successfully for company ${companyId}`,
      );
      return installation;
    });
  }

  /**
   * App Lifecycle: Uninstall
   */
  async uninstallApp(companyId: string, appId: string) {
    const installation = await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.appInstallation.findUnique({
        where: { companyId_appId: { companyId, appId } },
      }),
    );

    if (!installation) {
      throw new NotFoundException('Installation not found');
    }

    // Cascade delete handles related records (webhooks, health, etc.)
    await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.appInstallation.delete({
        where: { id: installation.id },
      }),
    );

    this.logger.log(`App ${appId} uninstalled for company ${companyId}`);
    return { success: true };
  }

  /**
   * App Lifecycle: Toggle Status (Disable/Enable)
   */
  async toggleAppStatus(
    companyId: string,
    appId: string,
    status: 'ACTIVE' | 'SUSPENDED',
  ) {
    const installation = await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.appInstallation.findUnique({
        where: { companyId_appId: { companyId, appId } },
      }),
    );

    if (!installation) {
      throw new NotFoundException('Installation not found');
    }

    await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.appInstallation.update({
        where: { id: installation.id },
        data: {
          status,
          healthStatus: status === 'SUSPENDED' ? 'OFFLINE' : 'HEALTHY',
        },
      }),
    );

    this.logger.log(
      `App ${appId} status changed to ${status} for company ${companyId}`,
    );
    return { success: true, status };
  }

  // ─────────────────────────────────────────────────────────────
  // EXTENSION SYSTEM (V31.0)
  // ─────────────────────────────────────────────────────────────

  async getExtensionsBySlot(companyId: string, slotId: string) {
    // 1. Get all active installations for this company
    const activeInstallations = await this.prisma.runAsTenant(
      companyId,
      async (tx) =>
        tx.appInstallation.findMany({
          where: {
            companyId,
            status: 'ACTIVE',
          },
          include: {
            app: true,
          },
        }),
    );

    // 2. Parse the UI Extensions from the apps (assuming it's stored in app.manifest or settings)
    const extensions = [];

    for (const installation of activeInstallations) {
      const uiExtensions =
        (installation.app as any).uiExtensions ||
        (installation.settings as any)?.uiExtensions ||
        [];

      const matchingExtensions = uiExtensions.filter(
        (ext: any) => ext.type === slotId,
      );
      for (const ext of matchingExtensions) {
        extensions.push({
          ...ext,
          appId: installation.app.id,
          installationId: installation.id,
        });
      }
    }

    return extensions;
  }
}
