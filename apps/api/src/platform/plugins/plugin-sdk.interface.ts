import { IDigitalWorker } from '../../automation/execution/digital-worker.registry';

export interface PluginManifest {
  id: string;
  name: string;
  version: string;
  author: string;
  description: string;
  pluginType: 'INDUSTRY_PACK' | 'AI_AGENT' | 'UI_EXTENSION' | 'STANDARD';
  permissions: string[];
  dependencies: string[];
  requiredPlatformVersion: string;
  industry?: string;

  // Extension Points Declarations
  uiExtensions?: {
    widgets: string[];
    dashboardCards: string[];
    commands: string[];
  };
  aiExtensions?: {
    agents: string[];
    skills: string[];
  };
  healthExtensions?: {
    metrics: string[];
  };
  workerExtensions?: {
    workers: string[];
  };
}

export abstract class PariLinkPlugin {
  abstract getManifest(): PluginManifest;

  // Lifecycle Hooks
  async onInstall(_companyId: string): Promise<void> {}
  async onActivate(_companyId: string): Promise<void> {}
  async onDeactivate(_companyId: string): Promise<void> {}
  async onUninstall(_companyId: string): Promise<void> {}

  // Extension Registrations
  registerAiWorkers?(): IDigitalWorker[];
  registerHealthMetrics?(): unknown[];
  registerUiWidgets?(): unknown[];
}
