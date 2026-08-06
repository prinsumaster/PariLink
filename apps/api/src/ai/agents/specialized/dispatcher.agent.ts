import { Injectable, Logger } from '@nestjs/common';
import { DynamicStructuredTool } from '@langchain/core/tools';
import { BaseAgent } from '../base.agent';
import { LlmManagerService } from '../../platform/llm-manager.service';
import { EventService } from '../../../platform/events/event.service';
import {
  AiDecisionProposalSchema,
  AiDecisionProposal,
} from '../schemas/ai-decision.schema';

@Injectable()
export class DispatcherAgent extends BaseAgent {
  readonly agentName = 'DispatcherAgent';
  readonly roleDescription =
    'Expert logistics Operations Manager capable of analyzing delays, re-routing fleets, and emitting structured AI decision proposals.';

  constructor(
    llmManager: LlmManagerService,
    private readonly eventService: EventService,
  ) {
    super(llmManager);
  }

  readonly tools = [
    new DynamicStructuredTool({
      name: 'propose_dispatch_decision',
      description:
        'Analyzes a logistics problem (e.g. delay, breakdown, unassigned load) and formulates a structured AI decision proposal. You MUST use this tool to output any recommendation.',
      schema: AiDecisionProposalSchema,
      func: async (proposal: AiDecisionProposal) => {
        // We use the inherited this.logger from BaseAgent now
        this.logger.log(
          `Generated AI Decision: [${proposal.riskLevel}] ${proposal.actionIntent}`,
        );

        // 1. Determine frontend event type based on risk
        const eventType =
          proposal.riskLevel === 'HIGH'
            ? 'AI_ALERT'
            : proposal.riskLevel === 'MEDIUM'
              ? 'AI_ALERT'
              : 'SYSTEM_NOTIFICATION';

        // 2. Broadcast via EventService. The RealtimeService will pick this up.
        this.eventService.publish('AiAlert.Generated', {
          tenantId: 'DEMO_COMPANY', // In real app, extract from context
          payload: {
            type: eventType,
            title: `AI Recommendation: ${proposal.category}`,
            description: proposal.reasoning,
            decision: proposal,
          },
        });

        return `Decision proposal successfully generated and broadcasted to the Operations Center.`;
      },
    }),
  ];
}
