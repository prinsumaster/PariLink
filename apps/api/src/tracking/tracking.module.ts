import { Module } from '@nestjs/common';
import { TrackingService } from './tracking.service';
import { TrackingController } from './tracking.controller';
import { GeofenceEngineService } from './services/geofence-engine.service';
import { TelematicsIngestionService } from './services/telematics-ingestion.service';
import { EnterpriseTelematicsController } from './controllers/enterprise-telematics.controller';
import { CommunicationsModule } from '../communications/communications.module';

@Module({
  imports: [CommunicationsModule],
  controllers: [TrackingController, EnterpriseTelematicsController],
  providers: [
    TrackingService,
    GeofenceEngineService,
    TelematicsIngestionService,
  ],
  exports: [TrackingService, GeofenceEngineService, TelematicsIngestionService],
})
export class TrackingModule {}
