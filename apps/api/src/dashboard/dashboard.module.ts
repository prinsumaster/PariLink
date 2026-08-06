import { Module } from '@nestjs/common';
import { ExecutiveDashboardController } from './dashboard.controller';

@Module({
  controllers: [ExecutiveDashboardController],
})
export class DashboardModule {}
