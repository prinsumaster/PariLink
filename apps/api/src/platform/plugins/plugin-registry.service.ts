import { Injectable, Logger } from '@nestjs/common';
import { EventService } from '../events/event.service';
import { Request, Response } from 'express';

export interface PluginManifest {
  id: string;
  name: string;
  version: string;
  description?: string;
  author?: string;
  hooks?: {
    [eventName: string]: (payload: unknown) => Promise<void>;
  };
  apiExtensions?: {
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
    path: string;
    handler: (req: Request, res: Response) => Promise<void>;
  }[];
}

@Injectable()
export class PluginRegistryService {
  private readonly logger = new Logger(PluginRegistryService.name);
  private plugins = new Map<string, PluginManifest>();

  constructor(private eventService: EventService) {}

  /**
   * Register a new plugin in the system.
   * This allows external modules to hook into core events without modifying core code.
   */
  registerPlugin(manifest: PluginManifest) {
    if (this.plugins.has(manifest.id)) {
      this.logger.warn(
        `Plugin ${manifest.id} is already registered. Overwriting.`,
      );
    }

    this.plugins.set(manifest.id, manifest);
    this.logger.log(`Registered plugin: ${manifest.name} v${manifest.version}`);

    // If the plugin defines event hooks, subscribe them to the central EventBus
    // Note: Since we are using EventService (EventEmitter2), we listen to the global event emitter.
    // In a real implementation, we would map these cleanly.
  }

  getPlugin(id: string): PluginManifest | undefined {
    return this.plugins.get(id);
  }

  getAllPlugins(): PluginManifest[] {
    return Array.from(this.plugins.values());
  }

  removePlugin(id: string) {
    this.plugins.delete(id);
    this.logger.log(`Removed plugin: ${id}`);
  }
}
