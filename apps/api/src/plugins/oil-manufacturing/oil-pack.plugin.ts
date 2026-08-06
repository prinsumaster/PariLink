import {
  PariLinkPlugin,
  PluginManifest,
} from '../../platform/plugins/plugin-sdk.interface';
import { IDigitalWorker } from '../../automation/execution/digital-worker.registry';
import { Logger } from '@nestjs/common';

/**
 * Custom AI Worker injected by the Oil Manufacturing Pack
 */
export class RefineryAIWorker implements IDigitalWorker {
  name = 'Refinery_AI';
  private readonly logger = new Logger(RefineryAIWorker.name);

  async executeTask(taskId: string, inputs: any): Promise<any> {
    this.logger.log(
      `[OilPack] Refinery_AI executing task: ${taskId} with inputs:`,
      inputs,
    );
    // Custom domain logic for oil routing, e.g., allocating pipeline capacity
    return {
      status: 'ALLOCATED',
      pipelineId: 'PL-900',
      capacityBarrels: 15000,
    };
  }

  async rollbackTask(taskId: string, context: any): Promise<void> {
    this.logger.warn(`[OilPack] Refinery_AI rolling back task: ${taskId}`);
    // Custom compensation logic
  }
}

/**
 * The Oil Manufacturing Industry Pack Plugin
 */
export class OilManufacturingPack extends PariLinkPlugin {
  private readonly logger = new Logger(OilManufacturingPack.name);

  getManifest(): PluginManifest {
    return {
      id: 'com.parilink.packs.oil-manufacturing',
      name: 'Oil Manufacturing Pack',
      version: '1.0.0',
      author: 'PariLink FirstParty',
      description:
        'Extends PariLink core with Oil & Gas specialized routing, UI, and AI Workers.',
      pluginType: 'INDUSTRY_PACK',
      permissions: ['READ:TRIPS', 'WRITE:DISPATCH'],
      dependencies: [],
      requiredPlatformVersion: '>=1.5.0',
      industry: 'Oil & Gas',
      aiExtensions: {
        agents: [],
        skills: ['RefineryRoutingSkill'],
      },
      workerExtensions: {
        workers: ['Refinery_AI'],
      },
      healthExtensions: {
        metrics: ['barrel_throughput_efficiency'],
      },
      uiExtensions: {
        widgets: ['OilRefineryStatusWidget'],
        dashboardCards: ['ThroughputCard'],
        commands: ['Allocate Pipeline Capacity'],
      },
    };
  }

  async onInstall(companyId: string): Promise<void> {
    this.logger.log(`[OilPack] Installing for company ${companyId}`);
    // Run plugin-specific DB migrations or seed data
  }

  async onActivate(companyId: string): Promise<void> {
    this.logger.log(`[OilPack] Activating for company ${companyId}`);
  }

  registerAiWorkers(): IDigitalWorker[] {
    return [new RefineryAIWorker()];
  }

  registerHealthMetrics(): any[] {
    return [
      {
        id: 'barrel_throughput_efficiency',
        name: 'Barrel Throughput Efficiency',
        calculate: (tenantData: any) => {
          // Custom domain logic
          return 94.5;
        },
      },
    ];
  }
}
