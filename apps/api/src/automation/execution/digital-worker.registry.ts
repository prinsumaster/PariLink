import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

/**
 * Interface representing a Digital Worker capable of executing a graph node.
 */
export interface IDigitalWorker {
  name: string; // e.g. 'Dispatcher_AI', 'Finance_AI'
  executeTask(taskId: string, inputs: any): Promise<any>;
  rollbackTask(taskId: string, context: any): Promise<void>;
}

@Injectable()
export class DigitalWorkerRegistry {
  private readonly logger = new Logger(DigitalWorkerRegistry.name);
  private workers: Map<string, IDigitalWorker> = new Map();

  registerWorker(worker: IDigitalWorker) {
    if (this.workers.has(worker.name)) {
      this.logger.warn(`Worker ${worker.name} is already registered.`);
      return;
    }
    this.workers.set(worker.name, worker);
    this.logger.log(`Registered Digital Worker: ${worker.name}`);
  }

  getWorker(name: string): IDigitalWorker {
    const worker = this.workers.get(name);
    if (!worker) {
      throw new Error(`Digital Worker '${name}' not found in registry.`);
    }
    return worker;
  }
}
