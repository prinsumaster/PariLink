import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ApiAnalyticsInterceptor implements NestInterceptor {
  private readonly logger = new Logger(ApiAnalyticsInterceptor.name);

  constructor(private readonly prisma: PrismaService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const req = ctx.getRequest();
    const res = ctx.getResponse();

    const start = Date.now();

    return next.handle().pipe(
      tap(() => {
        this.logApiCall(req, res, Date.now() - start);
      }),
      catchError((error) => {
        this.logApiCall(req, res, Date.now() - start, error);
        throw error;
      }),
    );
  }

  private logApiCall(req: any, res: any, latencyMs: number, error?: any) {
    // Fire and forget, don't block request
    process.nextTick(async () => {
      try {
        const statusCode = error ? error.status || 500 : res.statusCode;
        const user = req.user;

        await this.prisma.runAsSystem(async (tx) =>
          tx.apiAnalyticsLog.create({
            data: {
              companyId: user?.companyId,
              appId: user?.appId, // For future OAuth integration
              apiKeyId: user?.apiKeyId, // For Api Key integration
              endpoint: req.originalUrl || req.url,
              method: req.method,
              statusCode,
              latencyMs,
              errorMessage: error?.message,
              userAgent: req.headers['user-agent'],
              ipAddress: req.ip || req.connection?.remoteAddress,
            },
          }),
        );
      } catch (err) {
        // Silently fail logging in case of DB issues so we don't crash the server
        this.logger.error('Failed to log API analytics', err);
      }
    });
  }
}
