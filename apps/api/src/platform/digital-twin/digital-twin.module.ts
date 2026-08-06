import { Module, Global } from '@nestjs/common';
import { EventStoreService } from './event-store.service';
import { TwinsModule } from './twins/twins.module';
import { DataQualityEngine } from './data-fabric/quality-engine.service';
import { FusionEngineService } from './data-fabric/fusion-engine.service';
import { DigitalTwinCoreService } from './data-fabric/digital-twin-core.service';
import { EnterpriseGraphService } from './graph/enterprise-graph.service';
import { TwinSyncService } from './sync/twin-sync.service';
import { PredictionEngine } from './prediction/prediction.engine';
import { SimulationEngine } from './simulation/simulation.engine';

@Global()
@Module({
  imports: [TwinsModule],
  providers: [
    EventStoreService,
    DataQualityEngine,
    FusionEngineService,
    DigitalTwinCoreService,
    EnterpriseGraphService,
    TwinSyncService,
    PredictionEngine,
    SimulationEngine,
  ],
  exports: [
    EventStoreService,
    TwinsModule,
    DigitalTwinCoreService,
    EnterpriseGraphService,
    TwinSyncService,
    PredictionEngine,
    SimulationEngine,
  ],
})
export class DigitalTwinModule {}
