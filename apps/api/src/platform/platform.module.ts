import { Module, Global } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { EventService } from './events/event.service';
import { AuditService } from './audit/audit.service';
import { CryptoPlatformService } from './encryption/crypto-platform.service';
import { PlatformDataModule } from './data/platform-data.module';
import { ApiPlatformModule } from './api/api-platform.module';
import { FilePlatformModule } from './files/file.module';
import { DigitalTwinModule } from './digital-twin/digital-twin.module';
import { RealtimeModule } from './realtime/realtime.module';
import { RuntimeModule } from './runtime/runtime.module';
import { MdmModule } from './mdm/mdm.module';
import { BpmModule } from './bpm/bpm.module';
import { SecurityContextService } from './security/security.service';
import { CircuitBreakerService } from './resilience/circuit-breaker.service';
import { CacheManagerService } from './performance/cache-manager.service';
import { FeatureToggleService } from './feature-management/feature-toggle.service';
import { HealthService } from './api/health.service';
import { PlatformController } from './api/platform.controller';
import { EnvelopeEncryptionService } from './encryption/envelope/envelope-encryption.service';
import { IamPolicyEngineService } from './iam/iam-policy-engine.service';
import { LicenseService } from './licensing/license.service';
import { DataGovernanceService } from './data-governance/data-governance.service';
import { LifecycleEngineService } from './lifecycle/lifecycle-engine.service';
import { ExceptionManagementService } from './resilience/exception-management.service';
import { AnalyticsRegistryService } from './analytics/analytics-registry.service';
import { PiiEncryptionService } from './encryption/pii-encryption.service';
import { SecretsService } from './security/secrets/secrets.service';

const PLATFORM_SERVICES = [
  EventService,
  AuditService,
  CryptoPlatformService,
  SecurityContextService,
  CircuitBreakerService,
  CacheManagerService,
  FeatureToggleService,
  HealthService,
  EnvelopeEncryptionService,
  IamPolicyEngineService,
  LicenseService,
  DataGovernanceService,
  LifecycleEngineService,
  ExceptionManagementService,
  AnalyticsRegistryService,
  PiiEncryptionService,
  SecretsService,
];

@Global()
@Module({
  imports: [
    EventEmitterModule.forRoot({
      wildcard: true,
      delimiter: '.',
      newListener: false,
      removeListener: false,
      maxListeners: 20,
      verboseMemoryLeak: true,
      ignoreErrors: false,
    }),
    PlatformDataModule,
    ApiPlatformModule,
    FilePlatformModule,
    DigitalTwinModule,
    RealtimeModule,
    RuntimeModule,
    MdmModule,
    BpmModule,
  ],
  controllers: [PlatformController],
  providers: PLATFORM_SERVICES,
  exports: [
    ...PLATFORM_SERVICES,
    PlatformDataModule,
    ApiPlatformModule,
    FilePlatformModule,
    DigitalTwinModule,
    RealtimeModule,
    RuntimeModule,
    MdmModule,
    BpmModule,
  ],
})
export class PlatformModule {}
