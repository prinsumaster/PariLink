import { Module, Global } from '@nestjs/common';
import { GoldenRecordEngineService } from './golden-record-engine.service';
import { DataQualityEngineService } from './data-quality-engine.service';
import { ExternalIdentityMappingService } from './external-identity-mapping.service';
import { ReferenceDataService } from './reference-data.service';
import { MdmSearchService } from './mdm-search.service';
import { MdmController } from './mdm.controller';

const MDM_SERVICES = [
  GoldenRecordEngineService,
  DataQualityEngineService,
  ExternalIdentityMappingService,
  ReferenceDataService,
  MdmSearchService,
];

@Global()
@Module({
  controllers: [MdmController],
  providers: MDM_SERVICES,
  exports: MDM_SERVICES,
})
export class MdmModule {}
