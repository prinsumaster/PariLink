import { Module, forwardRef } from '@nestjs/common';
import { WarehouseController } from './warehouse.controller';
import { WarehouseMasterService } from './engine/warehouse-master.service';
import { InventoryService } from './engine/inventory.service';
import { InboundService } from './engine/inbound.service';
import { OutboundService } from './engine/outbound.service';
import { DockSchedulerService } from './engine/dock-scheduler.service';
import { MaterialEquipmentService } from './engine/material-equipment.service';
import { InventoryOptimizerService } from './engine/inventory-optimizer.service';
import { InventoryManagementService } from './engine/inventory-management.service';
import { InboundOutboundEngine } from './engine/inbound-outbound.engine';
import { WarehouseAnalyticsService } from './engine/warehouse-analytics.service';
import { WmsOrchestratorService } from './engine/wms-orchestrator.service';
import { DigitalTwinModule } from '../platform/digital-twin/digital-twin.module';
import { PlatformModule } from '../platform/platform.module';
import { InvoicesModule } from '../invoices/invoices.module';

import { AiModule } from '../ai/ai.module';
import { WorkflowModule } from '../workflow/workflow.module';

@Module({
  imports: [
    DigitalTwinModule,
    PlatformModule,
    InvoicesModule,
    WorkflowModule,
    forwardRef(() => AiModule),
  ],
  controllers: [WarehouseController],
  providers: [
    WarehouseMasterService,
    InventoryService,
    InboundService,
    OutboundService,
    DockSchedulerService,
    MaterialEquipmentService,
    InventoryOptimizerService,
    InventoryManagementService,
    InboundOutboundEngine,
    WarehouseAnalyticsService,
    WmsOrchestratorService,
  ],
  exports: [
    WarehouseMasterService,
    InventoryService,
    InboundService,
    OutboundService,
    WarehouseAnalyticsService,
  ],
})
export class WarehouseModule {}
