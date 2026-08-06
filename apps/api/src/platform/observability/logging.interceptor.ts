import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { PrismaService } from '../../prisma/prisma.service';

// ---------------------------------------------------------------------------
// Observability Interceptor — Distributed Tracing + Structured Logging
//
// Every request produces:
//   1. A correlation ID (X-Correlation-Id header, propagated downstream)
//   2. A request ID (X-Request-Id — unique per HTTP hop)
//   3. Structured JSON log line with timing, status, tenant, user
//   4. PlatformMetric record for p95/p99 slow-query analysis when > 500ms
//   5. Error tracking for 5xx responses (without stack trace in response body)
//
// Trace Context format:
//   {
//     requestId: "uuid",
//     correlationId: "uuid",        // spans multiple services
//     tenantId: "company-id",
//     userId: "user-id",
//     method: "GET",
//     path: "/api/v1/trips",
//     statusCode: 200,
//     durationMs: 45,
//     timestamp: "2026-01-01T00:00:00.000Z"
//   }
// ---------------------------------------------------------------------------

const SLOW_THRESHOLD_MS = 500; // Record metric above this
const ALERT_THRESHOLD_MS = 3000; // Warn above this

@Injectable()
export class ObservabilityInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  constructor(private readonly prisma: PrismaService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const req = ctx.getRequest();
    const res = ctx.getResponse();

    // Correlation ID — propagated from upstream (e.g., API Gateway, frontend)
    const correlationId =
      (req.headers['x-correlation-id'] as string) || uuidv4();
    // Request ID — unique per hop
    const requestId = uuidv4();

    req['correlationId'] = correlationId;
    req['requestId'] = requestId;

    res.setHeader('X-Correlation-Id', correlationId);
    res.setHeader('X-Request-Id', requestId);

    const startMs = Date.now();
    const { method, url } = req;
    const tenantId: string = req.user?.companyId ?? 'anon';
    const userId: string = req.user?.id ?? 'anon';

    return next.handle().pipe(
      tap(() => {
        const durationMs = Date.now() - startMs;
        const { statusCode } = res;

        this.emitStructuredLog({
          requestId,
          correlationId,
          tenantId,
          userId,
          method,
          path: req.route?.path ?? url,
          statusCode,
          durationMs,
        });

        if (durationMs >= SLOW_THRESHOLD_MS) {
          this.recordSlowRequest(
            tenantId,
            method,
            req.route?.path ?? url,
            durationMs,
            correlationId,
          );
        }
      }),
      catchError((error) => {
        const durationMs = Date.now() - startMs;
        this.emitStructuredLog({
          requestId,
          correlationId,
          tenantId,
          userId,
          method,
          path: req.route?.path ?? url,
          statusCode: error.status ?? 500,
          durationMs,
          error: error.message,
        });
        return throwError(() => error);
      }),
    );
  }

  private emitStructuredLog(fields: {
    requestId: string;
    correlationId: string;
    tenantId: string;
    userId: string;
    method: string;
    path: string;
    statusCode: number;
    durationMs: number;
    error?: string;
  }): void {
    const level =
      fields.statusCode >= 500
        ? 'error'
        : fields.statusCode >= 400
          ? 'warn'
          : 'log';
    const msg = `${fields.method} ${fields.path} ${fields.statusCode} ${fields.durationMs}ms`;

    if (fields.durationMs >= ALERT_THRESHOLD_MS) {
      this.logger.warn(
        `[SLOW] ${msg} [cid=${fields.correlationId}] [tenant=${fields.tenantId}]`,
      );
    } else {
      this.logger[level](
        `${msg} [cid=${fields.correlationId}] [tenant=${fields.tenantId}]`,
      );
    }
  }

  private recordSlowRequest(
    companyId: string,
    method: string,
    path: string,
    durationMs: number,
    correlationId: string,
  ): void {
    if (companyId === 'anon') return;
    // Fire-and-forget — never blocks the response
    this.prisma
      .runAsTenant(companyId, async (tx) =>
        tx.platformMetric.create({
          data: {
            companyId,
            category: 'API_LATENCY',
            metricName: `${method}_${path}`.replace(/[/:]/g, '_').slice(0, 100),
            metricValue: durationMs,
            dimensions: { correlationId, threshold: SLOW_THRESHOLD_MS },
          },
        }),
      )
      .catch(() => {}); // Silently ignore — observability must never break business logic
  }
}
