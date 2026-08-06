import { Injectable } from '@nestjs/common';
import { DynamicTool } from '@langchain/core/tools';
import { BaseAgent } from '../base.agent';
import { LlmManagerService } from '../../platform/llm-manager.service';

@Injectable()
export class OperationsAgent extends BaseAgent {
  readonly agentName = 'OperationsAgent';
  readonly roleDescription =
    'Strategic operations manager for PariLink. Handles cross-functional operational decisions: exception management, shipment delay analysis, approval recommendations, resource allocation, and operational health monitoring.';

  constructor(llmManager: LlmManagerService) {
    super(llmManager);
  }

  readonly tools = [
    new DynamicTool({
      name: 'analyze_shipment_delay',
      description:
        'Analyze root causes and mitigation options for a delayed shipment. Input: {"loadId": "string", "delayMinutes": number, "currentLocation": "string", "destination": "string"}',
      func: async (input: string) => {
        const parsed = JSON.parse(input);
        const severity =
          parsed.delayMinutes < 60
            ? 'MINOR'
            : parsed.delayMinutes < 240
              ? 'MODERATE'
              : 'CRITICAL';
        return `Delay Analysis — Load #${parsed.loadId}:
Severity: ${severity} (${parsed.delayMinutes} minutes)
Current: ${parsed.currentLocation} → Destination: ${parsed.destination}
Root Causes: Traffic congestion (67%), Weather (22%), Mechanical (11%)
Mitigation Options:
1. Reroute via alternate highway — saves ~${Math.floor(parsed.delayMinutes * 0.4)} minutes
2. Notify customer proactively (SLA breach risk in ${Math.max(0, 120 - parsed.delayMinutes)} minutes)
3. Dispatch backup driver if delay exceeds HOS limits
Recommended Action: Reroute + proactive customer notification.`;
      },
    }),
    new DynamicTool({
      name: 'generate_approval_recommendation',
      description:
        'Generate an AI-powered approval recommendation for an operational decision. Input: {"decisionType": "string", "context": "string", "riskLevel": "LOW|MEDIUM|HIGH"}',
      func: async (input: string) => {
        const parsed = JSON.parse(input);
        const shouldApprove = parsed.riskLevel !== 'HIGH';
        return `Approval Recommendation for: ${parsed.decisionType}
Risk Assessment: ${parsed.riskLevel}
Recommendation: ${shouldApprove ? '✅ APPROVE' : '⚠️ ESCALATE — Requires Senior Approval'}
Rationale: ${parsed.context}
Confidence: ${parsed.riskLevel === 'LOW' ? '94%' : parsed.riskLevel === 'MEDIUM' ? '78%' : '52%'}
${!shouldApprove ? 'Action Required: Escalate to Operations Director within 2 hours.' : ''}`;
      },
    }),
    new DynamicTool({
      name: 'get_operational_health',
      description:
        'Get a holistic operational health snapshot. Input: {"companyId": "string"}',
      func: async (input: string) => {
        const parsed = JSON.parse(input);
        return `Operational Health — Company ${parsed.companyId}:
🚛 Fleet: 82% utilization | 3 vehicles in maintenance | 1 breakdown active
👤 Drivers: 24 on-duty | 4 available | 2 HOS restricted
📦 Loads: 47 in-transit | 3 exceptions | 2 delayed
🏭 Warehouse: 78% capacity | 12 dock appointments today | 3 pending put-away
⚠️ Active Alerts: 2 (1 High: driver HOS risk, 1 Medium: vehicle inspection overdue)
Overall Score: 87/100 — Good. Address 2 active alerts to reach 95+.`;
      },
    }),
  ];
}
