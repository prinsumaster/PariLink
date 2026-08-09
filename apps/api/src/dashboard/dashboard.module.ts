import { Module } from '@nestjs/common';
import { ExecutiveDashboardController } from './dashboard.controller';
import { DashboardBuilderController } from './dashboard-builder.controller';
import { DashboardBuilderService } from './dashboard-builder.service';
import { OrdersController } from './orders.controller';
import { SettingsController } from './settings.controller';

@Module({
  controllers: [ExecutiveDashboardController, DashboardBuilderController, OrdersController, SettingsController],
  providers: [DashboardBuilderService],
  exports: [DashboardBuilderService],
})
export class DashboardModule {}
