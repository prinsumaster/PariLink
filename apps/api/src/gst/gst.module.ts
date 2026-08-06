import { Module } from '@nestjs/common';
import { GstEngineService } from './services/gst-engine/gst-engine.service';
import { GstRuleController } from './controllers/gst-rule/gst-rule.controller';

@Module({
  providers: [GstEngineService],
  controllers: [GstRuleController],
})
export class GstModule {}
