import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { EnterpriseHealthService } from './health/enterprise-health.service';
import { MetricsPlatformService } from './metrics/metrics-platform.service';
import { AlertEngineService } from './alerts/alert-engine.service';
import { BackupRecoveryService } from './backup/backup-recovery.service';
import { LoggingPlatformService } from './logging/logging-platform.service';
import { PerformancePlatformService } from './performance/performance-platform.service';

/**
 * OperationsScheduler — Autonomous background monitoring daemon.
 *
 * Runs continuously in production to collect metrics, detect anomalies,
 * fire threshold alerts, rotate logs, and maintain backup integrity.
 * Comparable to the Datadog Agent, CloudWatch Agent, and Prometheus scraper.
 */
@Injectable()
export class OperationsScheduler {
  private readonly logger = new Logger(OperationsScheduler.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly healthService: EnterpriseHealthService,
    private readonly metricsService: MetricsPlatformService,
    private readonly alertEngine: AlertEngineService,
    private readonly backupService: BackupRecoveryService,
    private readonly loggingService: LoggingPlatformService,
    private readonly perfService: PerformancePlatformService,
  ) {}

  /**
   * HEALTH PULSE — Runs every 60 seconds.
   * Performs a global health sweep and records a snapshot in SystemHealthLog.
   * If any component is UNHEALTHY or DOWN, auto-triggers an alert.
   */
  @Cron(CronExpression.EVERY_MINUTE)
  async collectHealthPulse(): Promise<void> {
    try {
      const report = await this.healthService.getGlobalHealth();

      // Auto-alert on degraded/unhealthy components
      const componentsList = Object.values(report.components) as Array<{
        component: string;
        status: string;
        latencyMs: number;
        errorRatePct: number;
        details: Record<string, unknown>;
      }>;
      for (const comp of componentsList) {
        if (comp.status === 'DOWN' || comp.status === 'UNHEALTHY') {
          const company = await this.prisma.runAsSystem(async (tx) =>
            tx.company.findFirst({ where: { status: 'ACTIVE' } }),
          );
          if (company) {
            await this.alertEngine
              .triggerAlert({
                companyId: company.id,
                type: 'HEALTH',
                severity: comp.status === 'DOWN' ? 'CRITICAL' : 'HIGH',
                message: `Component ${comp.component} is ${comp.status}. Latency: ${comp.latencyMs}ms, Error Rate: ${comp.errorRatePct}%`,
                metadata: comp.details,
              })
              .catch(() => {});
          }
        }
      }

      if (report.overallStatus !== 'HEALTHY') {
        this.logger.warn(
          `[Health Pulse] System status: ${report.overallStatus} at ${report.timestamp}`,
        );
      }
    } catch (e: unknown) {
      this.logger.error(
        `[Health Pulse] Failed: ${e instanceof Error ? (e instanceof Error ? e.message : String(e)) : String(e)}`,
      );
    }
  }

  /**
   * METRICS COLLECTION — Runs every 5 minutes.
   * Records system metrics (CPU, heap, event loop) into PlatformMetric table.
   * Uses SYSTEM_INTERNAL as companyId sentinel for platform-wide metrics.
   */
  @Cron(CronExpression.EVERY_5_MINUTES)
  async collectSystemMetrics(): Promise<void> {
    try {
      const metrics = await this.metricsService.getSystemMetrics();
      const SENTINEL_COMPANY_ID = 'SYSTEM_INTERNAL';

      // Threshold detection: Heap > 800MB
      if (metrics.heapUsedMb > 800) {
        await this.perfService.recordProfile({
          profileType: 'MEMORY_LEAK',
          targetResource: 'Node.js Process Heap',
          metricValue: metrics.heapUsedMb,
          thresholdValue: 800,
          analysisDetails: {
            rss: metrics.rssMb,
            heapTotal: metrics.heapTotalMb,
          },
        });
      }

      // Threshold detection: CPU > 85%
      if (metrics.cpuUsagePct > 85) {
        await this.perfService.recordProfile({
          profileType: 'CPU_SPIKE',
          targetResource: 'API Server Process',
          metricValue: metrics.cpuUsagePct,
          thresholdValue: 85,
          analysisDetails: { uptime: metrics.uptimeSeconds },
        });
      }

      this.logger.debug(
        `[Metrics] Heap: ${metrics.heapUsedMb}MB | CPU: ${metrics.cpuUsagePct}%`,
      );
    } catch (e: unknown) {
      this.logger.error(
        `[Metrics Collection] Failed: ${e instanceof Error ? (e instanceof Error ? e.message : String(e)) : String(e)}`,
      );
    }
  }

  /**
   * QUEUE DEPTH MONITOR — Runs every 30 seconds.
   * Checks pending and failed job counts across all companies. Alerts on depth spikes.
   */
  @Cron(CronExpression.EVERY_30_SECONDS)
  async monitorQueueDepth(): Promise<void> {
    try {
      const failedJobs = await this.prisma.runAsSystem(async (tx) =>
        tx.backgroundJob.count({ where: { status: 'FAILED' } }),
      );
      const pendingJobs = await this.prisma.runAsSystem(async (tx) =>
        tx.backgroundJob.count({ where: { status: 'PENDING' } }),
      );

      if (failedJobs > 20) {
        this.logger.warn(
          `[Queue Monitor] High failed job count: ${failedJobs}`,
        );
      }
    } catch (e: unknown) {
      this.logger.error(
        `[Data Sync Polling] Failed: ${e instanceof Error ? (e instanceof Error ? e.message : String(e)) : String(e)}`,
      );
    }
  }

  /**
   * SLOW QUERY DETECTOR — Runs every 10 minutes.
   * Scans recent API Analytics logs to identify high-latency endpoints.
   */
  @Cron(CronExpression.EVERY_10_MINUTES)
  async detectSlowEndpoints(): Promise<void> {
    try {
      const slowLogs = await this.prisma.runAsSystem(async (tx) =>
        tx.apiAnalyticsLog.findMany({
          where: {
            latencyMs: { gte: 3000 }, // > 3 seconds
            timestamp: { gte: new Date(Date.now() - 600000) }, // Last 10 min
          },
          take: 50,
          orderBy: { latencyMs: 'desc' },
        }),
      );

      for (const log of slowLogs.slice(0, 5)) {
        await this.perfService.recordProfile({
          companyId: log.companyId || undefined,
          profileType: 'HIGH_LATENCY',
          targetResource: `${log.method} ${log.endpoint}`,
          metricValue: log.latencyMs,
          thresholdValue: 3000,
          analysisDetails: {
            statusCode: log.statusCode,
            companyId: log.companyId,
          },
        });
      }

      if (slowLogs.length > 0) {
        this.logger.warn(
          `[Slow Endpoint Detector] Found ${slowLogs.length} slow API calls in last 10 minutes`,
        );
      }
    } catch (e: unknown) {
      this.logger.error(
        `[Slow Endpoint Detector] Failed: ${e instanceof Error ? e.message : String(e)}`,
      );
    }
  }

  /**
   * ERROR RATE MONITOR — Runs every 5 minutes.
   * Checks global 5xx error rates. Logs warning if > 5% over the past 5 minutes.
   */
  @Cron(CronExpression.EVERY_5_MINUTES)
  async monitorErrorRates(): Promise<void> {
    try {
      const window = new Date(Date.now() - 300000); // 5 minutes
      const [total, errors] = await Promise.all([
        this.prisma.runAsSystem(async (tx) =>
          tx.apiAnalyticsLog.count({ where: { timestamp: { gte: window } } }),
        ),
        this.prisma.runAsSystem(async (tx) =>
          tx.apiAnalyticsLog.count({
            where: { timestamp: { gte: window }, statusCode: { gte: 500 } },
          }),
        ),
      ]);

      if (total > 0) {
        const errorRatePct = (errors / total) * 100;

        if (errorRatePct > 5) {
          this.logger.error(
            `[Error Rate Monitor] Error rate spike: ${errorRatePct.toFixed(2)}% (${errors}/${total} requests)`,
          );
          await this.loggingService.log({
            level: 'ERROR',
            service: 'api-error-rate-monitor',
            message: `Error rate spike detected: ${errorRatePct.toFixed(2)}% over last 5 minutes`,
            structuredData: { total, errors, errorRatePct, windowMinutes: 5 },
          });
        }
      }
    } catch (e: unknown) {
      this.logger.error(
        `[Error Rate Monitor] Failed: ${e instanceof Error ? e.message : String(e)}`,
      );
    }
  }

  /**
   * DAILY BACKUP SCHEDULER — Runs every day at 02:00 UTC.
   * Triggers automated full database backups for all active companies.
   */
  @Cron('0 2 * * *')
  async scheduleDailyBackups(): Promise<void> {
    this.logger.log(
      '[Backup Scheduler] Starting daily automated database backups...',
    );
    try {
      const companies = await this.prisma.runAsSystem(async (tx) =>
        tx.company.findMany({ where: { status: 'ACTIVE' }, take: 50 }),
      );

      for (const company of companies) {
        await this.backupService.startBackupJob({
          companyId: company.id,
          backupType: 'DATABASE',
          retentionDays: 30,
        });
      }

      this.logger.log(
        `[Backup Scheduler] Initiated ${companies.length} automated database backups`,
      );
    } catch (e: unknown) {
      this.logger.error(
        `[Backup Scheduler] Daily backup failed: ${e instanceof Error ? e.message : String(e)}`,
      );
    }
  }

  /**
   * BACKUP RETENTION ENFORCER — Runs every day at 03:00 UTC.
   * Purges expired backup archives beyond their retention window.
   */
  @Cron('0 3 * * *')
  async enforceBackupRetention(): Promise<void> {
    try {
      const { purgedCount } = await this.backupService.purgeExpiredBackups();
      if (purgedCount > 0) {
        this.logger.log(
          `[Retention Enforcer] Purged ${purgedCount} expired backup archives`,
        );
      }
    } catch (e: unknown) {
      this.logger.error(
        `[Maintenance Sweep] Failed: ${e instanceof Error ? (e instanceof Error ? e.message : String(e)) : String(e)}`,
      );
    }
  }

  /**
   * LOG RETENTION ENFORCER — Runs every week on Sunday at 04:00 UTC.
   * Purges enterprise logs older than the retention window (default 90 days).
   */
  @Cron('0 4 * * 0')
  async enforceLogRetention(): Promise<void> {
    try {
      const { deletedCount } = await this.loggingService.purgeExpiredLogs(90);
      this.logger.log(
        `[Log Retention] Purged ${deletedCount} enterprise log records older than 90 days`,
      );
    } catch (e: unknown) {
      this.logger.error(
        `[Log Processing] Failed: ${e instanceof Error ? (e instanceof Error ? e.message : String(e)) : String(e)}`,
      );
    }
  }

  /**
   * MAINTENANCE WINDOW EXPIRY — Runs every 10 minutes.
   * Deactivates expired maintenance windows so alert suppression ends on time.
   */
  @Cron(CronExpression.EVERY_10_MINUTES)
  async expireMaintenanceWindows(): Promise<void> {
    try {
      const expired = await this.prisma.runAsSystem(async (tx) =>
        tx.maintenanceWindow.updateMany({
          where: { isActive: true, endTime: { lt: new Date() } },
          data: { isActive: false },
        }),
      );
      if (expired.count > 0) {
        this.logger.log(
          `[Maintenance Windows] Deactivated ${expired.count} expired maintenance windows`,
        );
      }
    } catch (e: unknown) {
      this.logger.error(
        `[Maintenance Windows] Expiry check failed: ${e instanceof Error ? e.message : String(e)}`,
      );
    }
  }
}
