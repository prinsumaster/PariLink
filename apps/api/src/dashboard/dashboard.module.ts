import { Module } from '@nestjs/common';
import { ExecutiveDashboardController } from './dashboard.controller';
import { DashboardBuilderController } from './dashboard-builder.controller';
import { DashboardBuilderService } from './dashboard-builder.service';

@Module({
  controllers: [ExecutiveDashboardController, DashboardBuilderController],
  providers: [DashboardBuilderService],
  exports: [DashboardBuilderService],
})
export class DashboardModule {}
