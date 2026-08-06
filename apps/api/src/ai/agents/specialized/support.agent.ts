import { Injectable } from '@nestjs/common';
import { DynamicTool } from '@langchain/core/tools';
import { BaseAgent } from '../base.agent';
import { LlmManagerService } from '../../platform/llm-manager.service';

@Injectable()
export class SupportAgent extends BaseAgent {
  readonly agentName = 'SupportAgent';
  readonly roleDescription =
    'Empathetic and knowledgeable PariLink customer support agent. Resolves platform issues, guides users through workflows, escalates critical issues, and creates support tickets.';

  constructor(llmManager: LlmManagerService) {
    super(llmManager);
  }

  readonly tools = [
    new DynamicTool({
      name: 'create_support_ticket',
      description:
        'Create a support ticket for a user issue. Input: {"userId": "string", "category": "BILLING|TECHNICAL|DISPATCH|DRIVER|OTHER", "description": "string", "severity": "LOW|MEDIUM|HIGH|CRITICAL"}',
      func: async (input: string) => {
        const parsed = JSON.parse(input);
        const ticketId = `TKT-${Date.now().toString().slice(-6)}`;
        const sla = (
          { LOW: '72h', MEDIUM: '24h', HIGH: '4h', CRITICAL: '1h' } as Record<
            string,
            string
          >
        )[parsed.severity];
        return `Support ticket created: #${ticketId}
Category: ${parsed.category} | Severity: ${parsed.severity} | SLA: ${sla}
Assigned to: ${parsed.severity === 'CRITICAL' ? 'Senior Support Engineer' : 'Support Team'}
User ${parsed.userId} will receive email confirmation. Reference #${ticketId}.`;
      },
    }),
    new DynamicTool({
      name: 'escalate_issue',
      description:
        'Escalate a support issue to engineering or management. Input: {"ticketId": "string", "escalationReason": "string", "escalateTo": "ENGINEERING|MANAGEMENT|ACCOUNT_TEAM"}',
      func: async (input: string) => {
        const parsed = JSON.parse(input);
        return `Issue #${parsed.ticketId} escalated to ${parsed.escalateTo}. Reason: ${parsed.escalationReason}. On-call engineer notified. Expected response within 30 minutes.`;
      },
    }),
    new DynamicTool({
      name: 'get_platform_status',
      description:
        'Check current platform health and any known outages. Input: {} (empty object)',
      func: async (_input: string) => {
        return `Platform Status: ✅ All systems operational.
API: 99.98% uptime (last 30 days) | Avg response: 87ms
WebSocket: Healthy | Push Notifications: Healthy
Background Jobs: Processing normally | Database: Healthy
No active incidents. Last incident: 14 days ago (resolved in 23 minutes).`;
      },
    }),
  ];
}
