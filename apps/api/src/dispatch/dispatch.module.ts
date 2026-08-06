import { Module } from '@nestjs/common';
import { DispatchService } from './dispatch.service';
import { DispatchController } from './dispatch.controller';
import { ConstraintEngine } from './engine/constraint.engine';
import { ScoringEngine } from './engine/scoring.engine';
import { PlanningService } from './engine/planning.service';
import { ExceptionService } from './engine/exception.service';
import { CustomerPromiseService } from './engine/customer-promise.service';
import { DispatchKpiService } from './engine/dispatch-kpi.service';
import { PlanningController } from './engine/planning.controller';
import { ControlTowerService } from './engine/control-tower.service';
import { AiOperationsService } from './engine/ai-operations.service';
import { LiveFleetService } from './engine/live-fleet.service';
import { AiModule } from '../ai/ai.module';
import { PlatformModule } from '../platform/platform.module';
import { DispatchOperationsController } from './dispatch-operations.controller';
import { WorkflowModule } from '../workflow/workflow.module';

@Module({
  imports: [AiModule, PlatformModule, WorkflowModule],
  controllers: [
    DispatchController,
    PlanningController,
    DispatchOperationsController,
  ],
  providers: [
    DispatchService,
    ConstraintEngine,
    ScoringEngine,
    PlanningService,
    ExceptionService,
    CustomerPromiseService,
    DispatchKpiService,
    ControlTowerService,
    AiOperationsService,
    LiveFleetService,
  ],
  exports: [
    PlanningService,
    DispatchKpiService,
    ConstraintEngine,
    ControlTowerService,
    AiOperationsService,
    LiveFleetService,
  ],
})
export class DispatchModule {}
