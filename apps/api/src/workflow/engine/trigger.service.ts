import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { PrismaService } from '../../prisma/prisma.service';
import { ConditionEngineService } from './condition.service';
import { ExecutionEngineService } from './execution.service';

@Injectable()
export class TriggerEngineService {
  private readonly logger = new Logger(TriggerEngineService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly conditionEngine: ConditionEngineService,
    private readonly executionEngine: ExecutionEngineService,
  ) {}

  /**
   * Listen to all events and spawn relevant workflows
   */
  @OnEvent('**')
  async handleDomainEvent(eventName: string, eventPayload: any) {
    if (!eventPayload || !eventPayload.companyId) {
      return;
    }

    const companyId = eventPayload.companyId;

    // Fetch ALL published workflows for the company
    const activeWorkflows = await this.prisma.runAsSystem(async (tx) =>
      tx.workflowDefinition.findMany({
        where: {
          companyId,
          status: 'PUBLISHED',
        },
      }),
    );

    for (const wf of activeWorkflows) {
      if (wf.triggerEvent !== eventName) {
        continue;
      }

      const graph =
        typeof wf.graphPayload === 'string'
          ? JSON.parse(wf.graphPayload)
          : wf.graphPayload;

      // Look for the TRIGGER node in the graph
      const triggerNode = graph?.nodes?.find((n: any) => n.type === 'TRIGGER');
      if (!triggerNode) continue;

      // Evaluate conditions on the trigger node (if any)
      let passesCondition = true;
      if (triggerNode.data && triggerNode.data.condition) {
        passesCondition = this.conditionEngine.evaluate(
          triggerNode.data.condition,
          eventPayload,
        );
      }

      if (passesCondition) {
        this.logger.log(
          `Spawning Workflow Execution for ${wf.name} (Trigger: ${wf.triggerEvent})`,
        );
        await this.executionEngine.startExecution(
          wf.companyId,
          wf.id,
          eventPayload,
          graph,
        );
      }
    }
  }
}
