import { AuditService } from '../../platform/audit/audit.service';
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { PrismaService } from '../../prisma/prisma.service';
import { redactPii } from '../utils/pii-redaction.util';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(
    private readonly auditService: AuditService,
    private readonly prisma: PrismaService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, originalUrl, user, body, params } = request;

    // We only want to log mutations (POST, PUT, PATCH, DELETE)
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
      return next.handle().pipe(
        tap(() => {
          if (user && user.companyId) {
            // Asynchronously log the action
            this.prisma
              .runAsSystem(async (tx) =>
                this.auditService.logEvent(
                  {
                    action: method,
                    entity: originalUrl.split('/')[3] || 'unknown',
                    entityId: params.id || 'N/A',
                    details: body
                      ? redactPii(JSON.parse(JSON.stringify(body)))
                      : {},
                    userId: user.id,
                    companyId: user.companyId,
                  },
                  null,
                  tx,
                ),
              )
              .catch((err) => {
                console.error('Failed to write audit log', err);
              });
          }
        }),
      );
    }

    return next.handle();
  }
}
