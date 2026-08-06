import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { EventStoreService } from '../digital-twin/event-store.service';
import { AutomationEngine } from './automation.engine';
import { TaskManagementService } from './task-management.service';

export interface ProcessInstance {
  id: string;
  definitionId: string;
  status: 'RUNNING' | 'PAUSED' | 'COMPLETED' | 'CANCELLED' | 'ERROR';
  variables: Record<string, unknown>;
  currentNodeId: string;
}

export interface NodeDefinition {
  type: string;
  nextNodes: string[];
  action?: string;
  assignee?: string;
  formId?: string;
  slaHours?: number;
  conditions?: { targetNode: string }[];
}

@Injectable()
export class ProcessEngine {
  private readonly logger = new Logger(ProcessEngine.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly eventStore: EventStoreService,
    private readonly automation: AutomationEngine,
    private readonly tasks: TaskManagementService,
  ) {}

  /**
   * Starts a dynamic BPMN process instance.
   */
  async startProcess(
    companyId: string,
    definitionId: string,
    variables: Record<string, unknown>,
    userId: string,
  ) {
    this.logger.log(
      `Starting Process ${definitionId} for Company ${companyId}`,
    );

    const processInstanceId = `PI-${Date.now()}`;
    const startNodeId = 'StartEvent_1';

    // 1. Audit initialization
    await this.eventStore.append({
      tenantId: companyId,
      streamId: processInstanceId,
      streamType: 'PROCESS_INSTANCE',
      eventType: 'ProcessStarted',
      payload: { definitionId, variables, currentNodeId: startNodeId },
      userId,
    });

    // 2. Execute first step immediately
    await this.executeNode(
      {
        id: processInstanceId,
        definitionId,
        status: 'RUNNING',
        variables,
        currentNodeId: startNodeId,
      },
      companyId,
      userId,
    );

    return { processInstanceId, status: 'RUNNING' };
  }

  /**
   * Core execution loop for process nodes (System Tasks, Gateways, Human Tasks).
   */
  async executeNode(
    instance: ProcessInstance,
    companyId: string,
    userId: string,
  ) {
    this.logger.debug(
      `Executing Node ${instance.currentNodeId} for Process ${instance.id}`,
    );

    // Mock Process Definition Lookup (Would be stored as JSON/XML in DB)
    const nodeDef = this.mockDefinitionLookup(
      instance.definitionId,
      instance.currentNodeId,
    );

    if (!nodeDef) {
      return this.transitionStatus(
        companyId,
        instance.id,
        'ERROR',
        userId,
        'Definition node not found',
      );
    }

    try {
      switch (nodeDef.type) {
        case 'SYSTEM_TASK':
          // Delegate to Automation Engine
          const result = await this.automation.executeSystemTask(
            companyId,
            nodeDef.action || '',
            instance.variables,
          );
          instance.variables = { ...instance.variables, ...result };
          await this.advanceToNextNode(
            instance,
            nodeDef.nextNodes,
            companyId,
            userId,
          );
          break;

        case 'USER_TASK':
          // Halt execution loop, assign Human Task to Inbox
          await this.tasks.createHumanTask(
            {
              companyId,
              processInstanceId: instance.id,
              nodeId: instance.currentNodeId,
              assigneeId: nodeDef.assignee,
              formId: nodeDef.formId,
              dueDate: new Date(
                Date.now() + (nodeDef.slaHours || 24) * 3600 * 1000,
              ),
              variables: instance.variables,
            },
            userId,
          );
          break;

        case 'EXCLUSIVE_GATEWAY':
          // Evaluate condition against variables
          const nextNode = this.evaluateGateway(
            nodeDef.conditions || [],
            instance.variables,
          );
          await this.advanceToNextNode(instance, [nextNode], companyId, userId);
          break;

        case 'END_EVENT':
          await this.transitionStatus(
            companyId,
            instance.id,
            'COMPLETED',
            userId,
            'Process Reached End Event',
          );
          break;

        default:
          throw new BadRequestException(
            `Unsupported Node Type: ${nodeDef.type}`,
          );
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      this.logger.error(`Node Execution Error: ${errorMessage}`);
      await this.transitionStatus(
        companyId,
        instance.id,
        'ERROR',
        userId,
        errorMessage,
      );
    }
  }

  async resumeProcess(
    companyId: string,
    instanceId: string,
    nodeId: string,
    variables: Record<string, unknown>,
    userId: string,
  ) {
    this.logger.log(`Resuming Process ${instanceId} from Node ${nodeId}`);

    await this.eventStore.append({
      tenantId: companyId,
      streamId: instanceId,
      streamType: 'PROCESS_INSTANCE',
      eventType: 'ProcessResumed',
      payload: { nodeId, variables },
      userId,
    });

    const instance: ProcessInstance = {
      id: instanceId,
      definitionId: 'MOCK_DEF', // Fetch from DB in real implementation
      status: 'RUNNING',
      variables,
      currentNodeId: nodeId,
    };

    // Find next node and continue loop
    const nodeDef = this.mockDefinitionLookup(instance.definitionId, nodeId);
    await this.advanceToNextNode(
      instance,
      nodeDef.nextNodes,
      companyId,
      userId,
    );
  }

  private async advanceToNextNode(
    instance: ProcessInstance,
    nextNodes: string[],
    companyId: string,
    userId: string,
  ) {
    if (nextNodes && nextNodes.length > 0) {
      instance.currentNodeId = nextNodes[0];
      await this.executeNode(instance, companyId, userId);
    } else {
      await this.transitionStatus(
        companyId,
        instance.id,
        'COMPLETED',
        userId,
        'Implicit End',
      );
    }
  }

  private async transitionStatus(
    companyId: string,
    instanceId: string,
    status: string,
    userId: string,
    reason: string,
  ) {
    await this.eventStore.append({
      tenantId: companyId,
      streamId: instanceId,
      streamType: 'PROCESS_INSTANCE',
      eventType: 'ProcessStatusChanged',
      payload: { status, reason },
      userId,
    });
  }

  // --- Mocks for Compilation ---
  private evaluateGateway(
    conditions: { targetNode: string }[],
    variables: Record<string, unknown>,
  ): string {
    return conditions[0].targetNode;
  }
  private mockDefinitionLookup(defId: string, nodeId: string): NodeDefinition {
    return { type: 'END_EVENT', nextNodes: [] };
  }
}
