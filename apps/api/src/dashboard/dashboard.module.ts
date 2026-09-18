import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { ExecutiveDashboardController } from './dashboard.controller';
import { DashboardBuilderController } from './dashboard-builder.controller';
import { DashboardBuilderService } from './dashboard-builder.service';
import { OrdersController } from './orders.controller';
import { SettingsController } from './settings.controller';
import { TenantCacheInterceptor } from '../interceptors/tenant-cache.interceptor';

@Module({
  imports: [
    CacheModule.registerAsync({
      useFactory: () => {
        // Synchronous require so this works in both Node runtime and Jest
        // (jest doesn't support dynamic import() without --experimental-vm-modules)
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const store = require('cache-manager-redis-store');
        return {
          store: store.redisStore,
          url: process.env.REDIS_URL || 'redis://localhost:6379',
          ttl: 60,
        };
      },
    }),
  ],
  controllers: [ExecutiveDashboardController, DashboardBuilderController, OrdersController, SettingsController],
  providers: [DashboardBuilderService, TenantCacheInterceptor],
  exports: [DashboardBuilderService],
})
export class DashboardModule {}
