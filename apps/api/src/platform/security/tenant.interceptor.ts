import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class TenantInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();

    // In PariLink, all authenticated requests MUST belong to a tenant (Company)
    // The JwtAuthGuard should have already populated req.user.companyId
    if (request.user && !request.user.companyId) {
      throw new UnauthorizedException('Tenant context missing from token');
    }

    // For APIs that require explicit tenant headers (e.g. Server-to-Server Integrations)
    if (!request.user) {
      const tenantHeader = request.headers['x-tenant-id'];
      if (!tenantHeader) {
        // We do not throw here because some endpoints (like login/public webhooks) are tenant-less
      } else {
        request['tenantId'] = tenantHeader;
      }
    } else {
      request['tenantId'] = request.user.companyId;
    }

    // Body mutation removed: Controllers correctly pass user.companyId to services directly.
    // Mutating request.body breaks ValidationPipe when forbidNonWhitelisted is true.

    return next.handle();
  }
}
