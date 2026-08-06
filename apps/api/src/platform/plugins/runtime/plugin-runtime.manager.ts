import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { PariLinkPlugin } from '../plugin-sdk.interface';
import { PermissionValidator } from './permission-validator';
import * as semver from 'semver';

@Injectable()
export class PluginRuntimeManager {
  private readonly logger = new Logger(PluginRuntimeManager.name);
  private readonly CORE_VERSION = '6.2.0';

  constructor(
    private readonly prisma: PrismaService,
    private readonly permissionValidator: PermissionValidator,
  ) {}

  /**
   * Safely loads and validates a plugin before execution.
   */
  async loadPluginSafely(
    plugin: PariLinkPlugin,
    companyId: string,
  ): Promise<boolean> {
    const manifest = plugin.getManifest();

    try {
      this.logger.log(
        `[Runtime] Validating plugin ${manifest.id} (v${manifest.version}) for tenant ${companyId}`,
      );

      // 1. Version Compatibility Validation
      if (
        !semver.satisfies(this.CORE_VERSION, manifest.requiredPlatformVersion)
      ) {
        throw new Error(
          `Core version ${this.CORE_VERSION} does not satisfy plugin requirement ${manifest.requiredPlatformVersion}`,
        );
      }

      // 2. Dependency Resolution (Mock implementation for MVP)
      if (manifest.dependencies.length > 0) {
        this.logger.debug(
          `[Runtime] Resolving dependencies: ${manifest.dependencies.join(', ')}`,
        );
        // Here we would verify that dependencies are active for the tenant
      }

      // 3. Update Health Status to RUNNING
      await this.updatePluginHealth(companyId, manifest.id, 'RUNNING');

      return true;
    } catch (error) {
      this.logger.error(
        `[Runtime] Plugin ${manifest.id} failed validation: ${error.message}`,
      );
      await this.updatePluginHealth(
        companyId,
        manifest.id,
        'FAILED',
        error.message,
      );
      return false; // Prevent loading
    }
  }

  /**
   * Executes a plugin lifecycle hook within a logical sandbox (try/catch boundary).
   * This prevents a failing plugin from crashing the main Node.js process.
   * Note: True resource isolation (CPU/Memory) requires Worker Threads.
   */
  async executeSafely(
    plugin: PariLinkPlugin,
    companyId: string,
    actionName: string,
    actionFn: () => Promise<void>,
  ): Promise<void> {
    const manifest = plugin.getManifest();
    const startTime = Date.now();

    try {
      this.logger.log(
        `[Runtime] Executing ${actionName} for plugin ${manifest.id}`,
      );

      // Execute the plugin logic
      await actionFn();

      // Observability: Log execution metrics
      const durationMs = Date.now() - startTime;
      this.logger.debug(
        `[Runtime] Plugin ${manifest.id} ${actionName} completed in ${durationMs}ms`,
      );
    } catch (error) {
      this.logger.error(
        `[Runtime] CRITICAL: Plugin ${manifest.id} crashed during ${actionName}: ${error.message}`,
      );

      // Isolate the failure and protect the tenant
      await this.updatePluginHealth(
        companyId,
        manifest.id,
        'UNHEALTHY',
        error.message,
      );

      // Do NOT throw the error up to the global Node.js context.
      // The error is trapped here to protect the core platform.
    }
  }

  /**
   * Updates the runtime state and health status of the plugin in the DB.
   */
  private async updatePluginHealth(
    companyId: string,
    appId: string,
    status: string,
    error?: string,
  ) {
    // In a real system, we look up the MarketplaceApp by ID, then update the installation.
    // For this MVP, we query by the manifest name directly for simplicity.
    const app = await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.marketplaceApp.findUnique({ where: { name: appId } }),
    );
    if (!app) return;

    await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.appInstallation.update({
        where: { companyId_appId: { companyId, appId: app.id } },
        data: {
          healthStatus: status,
          runtimeState: error
            ? { lastError: error, timestamp: new Date().toISOString() }
            : {},
        },
      }),
    );
  }
}
