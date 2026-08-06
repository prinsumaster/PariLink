import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuditService } from '../audit/audit.service';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(private readonly auditService: AuditService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const method = req.method;

    // We only want to automatically audit mutations (POST, PUT, PATCH, DELETE)
    // GET requests shouldn't flood the audit log unless specifically requested.
    if (['GET', 'OPTIONS', 'HEAD'].includes(method)) {
      return next.handle();
    }

    return next.handle().pipe(
      tap(async (data) => {
        if (!req.user || !req.user.companyId) return;

        // Try to infer entity ID from params or response
        const entityId = req.params?.id || data?.id || 'UNKNOWN';
        const entityType = this.inferEntityType(req.url);

        await this.auditService.logEvent({
          action: this.mapMethodToAction(method),
          entity: entityType,
          entityType: entityType,
          entityId: entityId,
          companyId: req.user.companyId,
          userId: req.user.id,
          afterValue: data, // The response object is usually the new state
          correlationId: req['correlationId'],
          source: 'API_INTERCEPTOR',
        });
      }),
    );
  }

  private mapMethodToAction(method: string): string {
    switch (method) {
      case 'POST':
        return 'CREATE';
      case 'PUT':
        return 'UPDATE';
      case 'PATCH':
        return 'UPDATE';
      case 'DELETE':
        return 'DELETE';
      default:
        return 'UNKNOWN';
    }
  }

  private inferEntityType(url: string): string {
    const parts = url
      .split('?')[0]
      .split('/')
      .filter((p) => p);
    // e.g. /api/v1/dispatch/trips -> "trips"
    // e.g. /api/v1/warehouse/inventory/123 -> "inventory"
    const relevantPart =
      parts.length > 2
        ? parts[
            parts.length -
              (url.includes(':id') ||
              parts[parts.length - 1].match(/^[0-9a-fA-F-]+$/)
                ? 2
                : 1)
          ]
        : 'SYSTEM';
    return relevantPart.toUpperCase();
  }
}
