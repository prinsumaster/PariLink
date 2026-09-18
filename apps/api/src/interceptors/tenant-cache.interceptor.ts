import {
  Injectable,
  ExecutionContext,
} from '@nestjs/common';
import { CacheInterceptor } from '@nestjs/cache-manager';

@Injectable()
export class TenantCacheInterceptor extends CacheInterceptor {
  trackBy(context: ExecutionContext): string | undefined {
    const request = context.switchToHttp().getRequest();
    const companyId = request.user?.companyId;
    
    // If no companyId is present, bypass cache (or could return just the URL for global routes)
    if (!companyId) {
      return undefined;
    }

    const routePath = super.trackBy(context);
    if (!routePath) {
      return undefined;
    }

    // Append companyId to completely isolate the cache key
    return `${routePath}_tenant_${companyId}`;
  }
}
