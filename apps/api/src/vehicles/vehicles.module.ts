import { Module } from '@nestjs/common';
import { VehiclesService } from './vehicles.service';
import { VehiclesController } from './vehicles.controller';
import { MaintenanceEngine } from './fleet/maintenance.engine';
import { MaintenanceController } from './maintenance/maintenance.controller';
import { MaintenanceService } from './maintenance/maintenance.service';
import { FuelManagementService } from './fleet/fuel-management.service';
import { FuelController } from './fuel/fuel.controller';
import { FuelService } from './fuel/fuel.service';
import { TyreController } from './tyre/tyre.controller';
import { TyreService } from './tyre/tyre.service';
import { ComplianceEngine } from './fleet/compliance.engine';
import { ComplianceController } from './compliance/compliance.controller';
import { ComplianceService } from './compliance/compliance.service';
import { TyreManagementService } from './fleet/tyre-management.service';
import { FleetOrchestratorService } from './fleet/fleet-orchestrator.service';
import { FleetAnalyticsService } from './fleet/fleet-analytics.service';
import { PlatformModule } from '../platform/platform.module';
import { PermitsModule } from './permits/permits.module';
import { WorkflowModule } from '../workflow/workflow.module';

@Module({
  imports: [PlatformModule, WorkflowModule],
  controllers: [
    MaintenanceController,
    FuelController,
    TyreController,
    ComplianceController,
    VehiclesController,
  ],
  providers: [
    VehiclesService,
    MaintenanceEngine,
    MaintenanceService,
    FuelManagementService,
    FuelService,
    TyreService,
    ComplianceEngine,
    ComplianceService,
    TyreManagementService,
    FleetOrchestratorService,
    FleetAnalyticsService,
  ],
  exports: [
    VehiclesService,
    FleetAnalyticsService,
    MaintenanceService,
    FuelService,
    TyreService,
    ComplianceService,
  ],
})
export class VehiclesModule {}
