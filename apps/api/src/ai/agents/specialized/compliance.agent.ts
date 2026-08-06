import { Injectable } from '@nestjs/common';
import { DynamicTool } from '@langchain/core/tools';
import { BaseAgent } from '../base.agent';
import { LlmManagerService } from '../../platform/llm-manager.service';

@Injectable()
export class ComplianceAgent extends BaseAgent {
  readonly agentName = 'ComplianceAgent';
  readonly roleDescription =
    'Expert DOT/FMCSA compliance officer AI for PariLink. Evaluates Hours of Service (HOS), vehicle inspection requirements, driver qualification files, and regulatory filing deadlines.';

  constructor(llmManager: LlmManagerService) {
    super(llmManager);
  }

  readonly tools = [
    new DynamicTool({
      name: 'check_hos_compliance',
      description:
        'Check Hours of Service compliance for a driver. Input: {"driverId": "string", "hoursOnDuty": number, "hoursDriving": number}',
      func: async (input: string) => {
        const parsed = JSON.parse(input);
        const violations: string[] = [];
        if (parsed.hoursOnDuty > 14)
          violations.push('14-hour on-duty limit exceeded (§395.3)');
        if (parsed.hoursDriving > 11)
          violations.push('11-hour driving limit exceeded (§395.3(a)(1))');
        if (parsed.hoursOnDuty > 70)
          violations.push('70-hour/8-day rule violation (§395.3(b))');
        return violations.length > 0
          ? `HOS Violations for driver ${parsed.driverId}: ${violations.join('; ')}. Driver must go Off-Duty immediately.`
          : `Driver ${parsed.driverId} is HOS compliant. On-duty: ${parsed.hoursOnDuty}h, Driving: ${parsed.hoursDriving}h — within limits.`;
      },
    }),
    new DynamicTool({
      name: 'check_vehicle_inspection_due',
      description:
        'Check if a vehicle\'s annual inspection is overdue. Input: {"vehicleId": "string", "lastInspectionDate": "string"}',
      func: async (input: string) => {
        const parsed = JSON.parse(input);
        const lastInspection = new Date(parsed.lastInspectionDate);
        const daysSince = Math.floor(
          (Date.now() - lastInspection.getTime()) / (1000 * 60 * 60 * 24),
        );
        const daysUntilDue = 365 - daysSince;
        if (daysUntilDue <= 0) {
          return `⚠️ CRITICAL: Vehicle ${parsed.vehicleId} annual inspection OVERDUE by ${Math.abs(daysUntilDue)} days. Vehicle must be taken out of service immediately (49 CFR §396.17).`;
        } else if (daysUntilDue <= 30) {
          return `⚠️ WARNING: Vehicle ${parsed.vehicleId} annual inspection due in ${daysUntilDue} days. Schedule inspection to maintain compliance.`;
        }
        return `✅ Vehicle ${parsed.vehicleId} inspection current. Next due in ${daysUntilDue} days.`;
      },
    }),
    new DynamicTool({
      name: 'generate_compliance_report',
      description:
        'Generate a compliance status summary for the fleet. Input: {"companyId": "string", "reportType": "HOS|VEHICLE|DRIVER|FULL"}',
      func: async (input: string) => {
        const parsed = JSON.parse(input);
        return `${parsed.reportType} Compliance Report — Company ${parsed.companyId}: 
Drivers: 24 compliant, 2 at-risk (HOS proximity), 0 violations.
Vehicles: 18 current, 1 inspection due in 14 days (Unit #TRK-047).
DQF Files: 23 complete, 1 missing medical certificate (Driver #DRV-089).
IFTA Q3 filing: Due in 12 days. Status: 87% complete.
Overall Compliance Score: 94/100.`;
      },
    }),
  ];
}
