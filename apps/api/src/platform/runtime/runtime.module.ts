import { Module } from '@nestjs/common';
// The RuntimeModule currently only serves as a structural placeholder for the V6.3 Architecture.
// Once Temporal.io or another orchestration engine is fully integrated,
// the Worker configurations and Job Dispatchers will be provided here.

import { Global } from '@nestjs/common';
import { ResourceOrchestratorService } from './resource-orchestrator.service';
import { BusinessRuleEngineService } from './business-rule-engine.service';

@Global()
@Module({
  providers: [ResourceOrchestratorService, BusinessRuleEngineService],
  exports: [ResourceOrchestratorService, BusinessRuleEngineService],
})
export class RuntimeModule {}
