import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CacheManagerService } from '../performance/cache-manager.service';
import * as os from 'os';

// ---------------------------------------------------------------------------
// Health Service — Kubernetes / Cloud-native Grade
//
// Probe types:
//   /health/liveness  — Is the process alive? (never hits DB — k8s restart gate)
//   /health/readiness — Can we serve traffic? (checks DB + critical deps)
//   /health/startup   — Has the app fully initialized? (checked only at boot)
//   /health/deep      — Full diagnostic including subsystem health scores
//
// Readiness check strategy:
//   - Passes only if ALL critical dependencies respond within 3 seconds
//   - Non-critical failures (Redis, Queue) degrade gracefully
//   - Used by load balancers to drain traffic before deploys
// ---------------------------------------------------------------------------

export interface HealthCheckResult {
  status: 'UP' | 'DOWN' | 'DEGRADED';
  timestamp: string;
  version: string;
  uptime: number;
  components?: Record<string, ComponentHealth>;
  memory?: { heapUsedMb: number; heapTotalMb: number; rssM: number };
}

export interface ComponentHealth {
  status: 'UP' | 'DOWN' | 'UNKNOWN' | 'DEGRADED';
  responseTimeMs?: number;
  detail?: string;
}

const APP_VERSION = process.env.npm_package_version ?? '0.0.0';
const READINESS_TIMEOUT_MS = 3000;

@Injectable()
export class HealthService {
  private readonly logger = new Logger(HealthService.name);
  private startedAt = new Date();

  constructor(
    private readonly prisma: PrismaService,
    private readonly cache: CacheManagerService,
  ) {}

  /** Liveness probe — minimal check. Must NEVER fail after startup. */
  async liveness(): Promise<HealthCheckResult> {
    return {
      status: 'UP',
      timestamp: new Date().toISOString(),
      version: APP_VERSION,
      uptime: Math.floor((Date.now() - this.startedAt.getTime()) / 1000),
    };
  }

  /** Readiness probe — checks all critical dependencies. */
  async readiness(): Promise<HealthCheckResult> {
    const [dbHealth, cacheHealth] = await Promise.all([
      this.checkDatabase(),
      this.checkCache(),
    ]);

    const allCriticalUp =
      dbHealth.status === 'UP' && cacheHealth.status === 'UP';

    return {
      status: allCriticalUp ? 'UP' : 'DOWN',
      timestamp: new Date().toISOString(),
      version: APP_VERSION,
      uptime: Math.floor((Date.now() - this.startedAt.getTime()) / 1000),
      components: { database: dbHealth, cache: cacheHealth },
    };
  }

  /** Deep health — full diagnostic with memory and subsystem metrics. */
  async deepHealth(): Promise<HealthCheckResult> {
    const [dbHealth, cacheHealth] = await Promise.all([
      this.checkDatabase(),
      this.checkCache(),
    ]);

    const memUsage = process.memoryUsage();

    const components: Record<string, ComponentHealth> = {
      database: dbHealth,
      cache: cacheHealth,
    };

    const statuses = Object.values(components).map((c) => c.status);
    const overallStatus = statuses.every((s) => s === 'UP')
      ? 'UP'
      : statuses.some((s) => s === 'UP')
        ? 'DEGRADED'
        : 'DOWN';

    return {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      version: APP_VERSION,
      uptime: Math.floor((Date.now() - this.startedAt.getTime()) / 1000),
      components,
      memory: {
        heapUsedMb: Math.round(memUsage.heapUsed / 1024 / 1024),
        heapTotalMb: Math.round(memUsage.heapTotal / 1024 / 1024),
        rssM: Math.round(memUsage.rss / 1024 / 1024),
      },
    };
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Component checks
  // ─────────────────────────────────────────────────────────────────────────

  private async checkDatabase(): Promise<ComponentHealth> {
    const start = Date.now();
    try {
      await Promise.race([
        this.prisma.runAsSystem(async (tx) => tx.$queryRaw`SELECT 1`),
        this.timeout(READINESS_TIMEOUT_MS, 'Database timeout'),
      ]);
      return { status: 'UP', responseTimeMs: Date.now() - start };
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : String(e);
      this.logger.error(`[Health] Database check failed: ${errorMessage}`);
      return {
        status: 'DOWN',
        responseTimeMs: Date.now() - start,
        detail: errorMessage,
      };
    }
  }

  private async checkCache(): Promise<ComponentHealth> {
    const start = Date.now();
    try {
      await Promise.race([
        this.cache.set('_health_check', 'ok', 1),
        this.timeout(READINESS_TIMEOUT_MS, 'Cache timeout'),
      ]);
      return { status: 'UP', responseTimeMs: Date.now() - start };
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : String(e);
      this.logger.error(`[Health] Cache check failed: ${errorMessage}`);
      // Cache can degrade gracefully
      return {
        status: 'DEGRADED',
        responseTimeMs: Date.now() - start,
        detail: errorMessage,
      };
    }
  }

  private timeout(ms: number, message: string): Promise<never> {
    return new Promise((_, reject) =>
      setTimeout(() => reject(new Error(message)), ms),
    );
  }
}
