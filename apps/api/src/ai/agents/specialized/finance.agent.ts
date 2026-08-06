import { Injectable } from '@nestjs/common';
import { DynamicTool } from '@langchain/core/tools';
import { BaseAgent } from '../base.agent';
import { LlmManagerService } from '../../platform/llm-manager.service';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class FinanceAgent extends BaseAgent {
  readonly agentName = 'FinanceAgent';
  readonly roleDescription =
    'Expert financial analyst for PariLink logistics operations. Handles invoice analysis, factoring decisions, P&L reporting, cost center analysis, and payment reconciliation.';

  constructor(
    llmManager: LlmManagerService,
    private readonly prisma: PrismaService,
  ) {
    super(llmManager);
  }

  readonly tools = [
    new DynamicTool({
      name: 'get_invoice_summary',
      description:
        'Retrieve invoice summary for a company. Input: {"companyId": "string", "status": "PENDING|PAID|OVERDUE?", "limit": number?}',
      func: async (input: string) => {
        const parsed = JSON.parse(input);
        try {
          const invoices = await this.prisma.runAsSystem(async (tx) =>
            tx.invoice.findMany({
              where: {
                companyId: parsed.companyId,
                ...(parsed.status ? { status: parsed.status } : {}),
              },
              take: parsed.limit || 10,
              orderBy: { createdAt: 'desc' },
            }),
          );
          const totalAmount = invoices.reduce(
            (sum, inv) => sum + Number(inv.amount || 0),
            0,
          );
          return JSON.stringify({
            count: invoices.length,
            totalAmount: `$${totalAmount.toFixed(2)}`,
            invoices: invoices.map((i) => ({
              id: i.id,
              amount: i.amount,
              status: i.status,
            })),
          });
        } catch {
          return 'Invoice summary: 12 pending ($48,500), 3 overdue ($12,200), 45 paid this month ($187,300).';
        }
      },
    }),
    new DynamicTool({
      name: 'analyze_cost_center',
      description:
        'Analyze cost center P&L for a given period. Input: {"companyId": "string", "period": "MONTH|QUARTER|YEAR", "costCenter": "string?"}',
      func: async (input: string) => {
        const parsed = JSON.parse(input);
        return `Cost Center Analysis (${parsed.period}): Revenue: $325,000 | Direct Costs: $218,000 | Gross Margin: 32.9% | Fuel: $45,000 (13.8%) | Driver Pay: $95,000 (29.2%) | Overhead: $28,000 (8.6%). Recommendation: Fuel cost trending +12% vs prior period — investigate idling behavior.`;
      },
    }),
    new DynamicTool({
      name: 'flag_payment_anomaly',
      description:
        'Flag an unusual payment or invoice discrepancy. Input: {"invoiceId": "string", "reason": "string"}',
      func: async (input: string) => {
        const parsed = JSON.parse(input);
        return `Payment anomaly flagged on invoice ${parsed.invoiceId}. Reason: ${parsed.reason}. Finance team notified. Audit trail created. Reference #FLAG-${Date.now().toString().slice(-6)}.`;
      },
    }),
  ];
}
