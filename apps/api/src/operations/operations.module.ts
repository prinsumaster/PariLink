import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

// Health
import { EnterpriseHealthService } from './health/enterprise-health.service';
import { EnterpriseHealthController } from './health/enterprise-health.controller';

// Metrics
import { MetricsPlatformService } from './metrics/metrics-platform.service';
import { MetricsPlatformController } from './metrics/metrics-platform.controller';

// Tracing
import { DistributedTracingService } from './tracing/distributed-tracing.service';
import { DistributedTracingController } from './tracing/distributed-tracing.controller';

// Logging
import { LoggingPlatformService } from './logging/logging-platform.service';
import { LoggingPlatformController } from './logging/logging-platform.controller';

// Alerts
import { AlertEngineService } from './alerts/alert-engine.service';
import { AlertEngineController } from './alerts/alert-engine.controller';

// Incidents
import { IncidentManagementService } from './incidents/incident-management.service';
import { IncidentManagementController } from './incidents/incident-management.controller';

// Backup & Recovery
import { BackupRecoveryService } from './backup/backup-recovery.service';
import { BackupRecoveryController } from './backup/backup-recovery.controller';

// Disaster Recovery
import { DisasterRecoveryService } from './dr/disaster-recovery.service';
import { DisasterRecoveryController } from './dr/disaster-recovery.controller';

// Performance
import { PerformancePlatformService } from './performance/performance-platform.service';
import { PerformancePlatformController } from './performance/performance-platform.controller';

// Dashboard
import { OperationsDashboardService } from './dashboard/operations-dashboard.service';
import { OperationsDashboardController } from './dashboard/operations-dashboard.controller';

// Background Scheduler
import { OperationsScheduler } from './operations.scheduler';

@Module({
  imports: [ScheduleModule.forRoot()],
  controllers: [
    EnterpriseHealthController,
    MetricsPlatformController,
    DistributedTracingController,
    LoggingPlatformController,
    AlertEngineController,
    IncidentManagementController,
    BackupRecoveryController,
    DisasterRecoveryController,
    PerformancePlatformController,
    OperationsDashboardController,
  ],
  providers: [
    EnterpriseHealthService,
    MetricsPlatformService,
    DistributedTracingService,
    LoggingPlatformService,
    AlertEngineService,
    IncidentManagementService,
    BackupRecoveryService,
    DisasterRecoveryService,
    PerformancePlatformService,
    OperationsDashboardService,
    OperationsScheduler,
  ],
  exports: [
    EnterpriseHealthService,
    MetricsPlatformService,
    DistributedTracingService,
    LoggingPlatformService,
    AlertEngineService,
    IncidentManagementService,
    BackupRecoveryService,
    DisasterRecoveryService,
    PerformancePlatformService,
    OperationsDashboardService,
  ],
})
export class OperationsModule {}
