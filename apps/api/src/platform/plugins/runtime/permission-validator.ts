import { Injectable, Logger, ForbiddenException } from '@nestjs/common';
import { PluginManifest } from '../plugin-sdk.interface';

@Injectable()
export class PermissionValidator {
  private readonly logger = new Logger(PermissionValidator.name);

  /**
   * Validates if a plugin has declared a specific permission scope.
   * Throws ForbiddenException if the permission is missing, ensuring
   * the plugin cannot exceed its bounded context.
   */
  validatePermission(manifest: PluginManifest, requiredScope: string) {
    if (!manifest.permissions.includes(requiredScope)) {
      this.logger.error(
        `[Security] Plugin ${manifest.id} attempted to access unauthorized scope: ${requiredScope}`,
      );
      throw new ForbiddenException(
        `Plugin ${manifest.id} is missing required permission: ${requiredScope}`,
      );
    }
    return true;
  }

  /**
   * Pre-execution validation of a Digital Worker task.
   */
  validateWorkerExecution(manifest: PluginManifest, workerName: string) {
    if (!manifest.workerExtensions?.workers.includes(workerName)) {
      this.logger.error(
        `[Security] Plugin ${manifest.id} attempted to execute unregistered worker: ${workerName}`,
      );
      throw new ForbiddenException(
        `Worker ${workerName} is not registered in plugin manifest.`,
      );
    }
    return true;
  }
}
