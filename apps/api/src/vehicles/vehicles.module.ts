import { Module } from '@nestjs/common';
import { VehiclesService } from './vehicles.service';
import { VehiclesController } from './vehicles.controller';
import { MaintenanceEngine } from './fleet/maintenance.engine';
import { FuelManagementService } from './fleet/fuel-management.service';
import { ComplianceEngine } from './fleet/compliance.engine';
import { TyreManagementService } from './fleet/tyre-management.service';
import { FleetOrchestratorService } from './fleet/fleet-orchestrator.service';
import { FleetAnalyticsService } from './fleet/fleet-analytics.service';
import { PlatformModule } from '../platform/platform.module';
import { PermitsModule } from './permits/permits.module';
import { WorkflowModule } from '../workflow/workflow.module';

@Module({
  imports: [PlatformModule, PermitsModule, WorkflowModule],
  controllers: [VehiclesController],
  providers: [
    VehiclesService,
    MaintenanceEngine,
    FuelManagementService,
    ComplianceEngine,
    TyreManagementService,
    FleetOrchestratorService,
    FleetAnalyticsService,
  ],
  exports: [VehiclesService, FleetAnalyticsService],
})
export class VehiclesModule {}
