import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';

import { ObservabilityInterceptor } from '../observability/logging.interceptor';
import { AuditInterceptor } from '../audit/audit.interceptor';
import { TenantInterceptor } from '../security/tenant.interceptor';

@Module({
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ObservabilityInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TenantInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: AuditInterceptor,
    },
  ],
})
export class ApiPlatformModule {}
