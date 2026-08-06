import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { PariLinkPlugin } from './plugin-sdk.interface';
import { DigitalWorkerRegistry } from '../../automation/execution/digital-worker.registry';
import { PluginRuntimeManager } from './runtime/plugin-runtime.manager';
import { PermissionValidator } from './runtime/permission-validator';

@Injectable()
export class PluginRegistry {
  private readonly logger = new Logger(PluginRegistry.name);

  // In-memory store of loaded plugin instances
  private loadedPlugins: Map<string, PariLinkPlugin> = new Map();

  constructor(
    private readonly prisma: PrismaService,
    private readonly workerRegistry: DigitalWorkerRegistry,
    private readonly runtimeManager: PluginRuntimeManager,
    private readonly permissionValidator: PermissionValidator,
  ) {}

  /**
   * Registers a plugin into the runtime memory.
   */
  async registerPlugin(plugin: PariLinkPlugin) {
    const manifest = plugin.getManifest();

    if (this.loadedPlugins.has(manifest.id)) {
      this.logger.warn(`Plugin ${manifest.id} is already loaded.`);
      return;
    }

    this.loadedPlugins.set(manifest.id, plugin);
    this.logger.log(`Loaded Plugin: ${manifest.name} v${manifest.version}`);

    // Dynamically wire up Extension Points
    this.wireExtensions(plugin);
  }

  private wireExtensions(plugin: PariLinkPlugin) {
    const manifest = plugin.getManifest();

    // 1. Digital Workers (Validating permissions before registration)
    if (plugin.registerAiWorkers) {
      const workers = plugin.registerAiWorkers();
      workers.forEach((w) => {
        // Enforce Isolation Rule: Only allow registration if manifested
        if (
          this.permissionValidator.validateWorkerExecution(manifest, w.name)
        ) {
          this.workerRegistry.registerWorker(w);
        }
      });
      this.logger.debug(
        `[${manifest.id}] Registered ${workers.length} Digital Workers`,
      );
    }

    // 2. Health Metrics
    if (plugin.registerHealthMetrics) {
      const metrics = plugin.registerHealthMetrics();
      this.logger.debug(
        `[${manifest.id}] Registered ${metrics.length} Health Metrics`,
      );
    }
  }

  /**
   * Called during tenant initialization to activate their specific installed plugins via the Runtime.
   */
  async activateTenantPlugins(companyId: string) {
    const installations = await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.appInstallation.findMany({
        where: { companyId, status: 'ACTIVE' },
        include: { app: true },
      }),
    );

    for (const install of installations) {
      const plugin = this.loadedPlugins.get(install.app.name);
      if (plugin) {
        // Delegate to the PluginRuntimeManager to handle safety, SemVer validation, and isolation
        const isValid = await this.runtimeManager.loadPluginSafely(
          plugin,
          companyId,
        );

        if (isValid) {
          // Execute the lifecycle hook within a secure try/catch boundary
          await this.runtimeManager.executeSafely(
            plugin,
            companyId,
            'onActivate',
            async () => {
              await plugin.onActivate(companyId);
            },
          );
        }
      }
    }
  }
}
