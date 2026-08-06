import { Module } from '@nestjs/common';
import { AlertEngineService } from './alert.engine.service';

@Module({
  providers: [AlertEngineService],
  exports: [AlertEngineService],
})
export class AlertModule {}
