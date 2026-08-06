import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { randomUUID } from 'crypto';

@Injectable()
export class ObservabilityInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();

    // 1. Correlation ID for Distributed Tracing
    const traceId = request.headers['x-request-id'] || randomUUID();
    request.traceId = traceId;

    // 2. Tenant Context
    const tenantId = request.user?.companyId || 'SYSTEM';

    const { method, originalUrl, ip } = request;
    const userAgent = request.get('user-agent') || '';
    const startTime = Date.now();

    return next.handle().pipe(
      tap({
        next: () => {
          const duration = Date.now() - startTime;
          const { statusCode } = response;
          // Structured JSON Logging for Datadog / ELK
          this.logger.log(
            JSON.stringify({
              event: 'http_request_success',
              traceId,
              tenantId,
              method,
              url: originalUrl,
              statusCode,
              durationMs: duration,
              ip,
              userAgent,
            }),
          );
        },
        error: (error) => {
          const duration = Date.now() - startTime;
          const statusCode = error.status || 500;
          this.logger.error(
            JSON.stringify({
              event: 'http_request_error',
              traceId,
              tenantId,
              method,
              url: originalUrl,
              statusCode,
              durationMs: duration,
              error: error.message,
              stack: error.stack,
              ip,
              userAgent,
            }),
          );
        },
      }),
    );
  }
}
