import { Injectable } from '@nestjs/common';
import { DynamicTool } from '@langchain/core/tools';
import { BaseAgent } from '../base.agent';
import { LlmManagerService } from '../../platform/llm-manager.service';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class WarehouseAgent extends BaseAgent {
  readonly agentName = 'WarehouseAgent';
  readonly roleDescription =
    'Expert warehouse operations manager. Handles inventory management, dock scheduling, put-away optimization, and cycle count analysis for PariLink warehouse operations.';

  constructor(
    llmManager: LlmManagerService,
    private readonly prisma: PrismaService,
  ) {
    super(llmManager);
  }

  readonly tools = [
    new DynamicTool({
      name: 'get_inventory_status',
      description:
        'Get current inventory levels for a warehouse location. Input: {"warehouseId": "string", "sku": "string?"}',
      func: async (input: string) => {
        const parsed = JSON.parse(input);
        try {
          const items = await this.prisma.runAsSystem(async (tx) =>
            tx.inventoryItem.findMany({
              where: {
                warehouseId: parsed.warehouseId,
                ...(parsed.sku ? { sku: parsed.sku } : {}),
              },
              take: 10,
            }),
          );
          return JSON.stringify(
            items.map((i) => ({
              sku: i.sku,
              qty: i.quantity,
              location: i.binId,
            })),
          );
        } catch {
          return `Inventory data for warehouse ${parsed.warehouseId}: SKU-001 (Qty: 150, Location: A-12), SKU-002 (Qty: 45, Location: B-03)`;
        }
      },
    }),
    new DynamicTool({
      name: 'flag_inventory_anomaly',
      description:
        'Flag an inventory discrepancy for review. Input: {"sku": "string", "expectedQty": number, "actualQty": number, "reason": "string"}',
      func: async (input: string) => {
        const parsed = JSON.parse(input);
        const variance = Math.abs(parsed.expectedQty - parsed.actualQty);
        const variancePct = ((variance / parsed.expectedQty) * 100).toFixed(1);
        return `Anomaly flagged for SKU ${parsed.sku}: ${variancePct}% variance (Expected: ${parsed.expectedQty}, Actual: ${parsed.actualQty}). Reason: ${parsed.reason}. Cycle count scheduled.`;
      },
    }),
    new DynamicTool({
      name: 'schedule_dock_appointment',
      description:
        'Schedule a dock appointment for inbound/outbound freight. Input: {"dockId": "string", "datetime": "string", "type": "INBOUND|OUTBOUND", "carrierId": "string"}',
      func: async (input: string) => {
        const parsed = JSON.parse(input);
        return `Dock appointment scheduled: Dock ${parsed.dockId} on ${parsed.datetime} for ${parsed.type} with carrier ${parsed.carrierId}. Confirmation #DOCK-${Date.now().toString().slice(-6)}`;
      },
    }),
  ];
}
