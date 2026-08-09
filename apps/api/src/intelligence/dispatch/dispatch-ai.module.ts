import { Module } from '@nestjs/common';
import { DispatchAiService } from './dispatch-ai.service';
import { DispatchAiController } from './dispatch-ai.controller';
import { BullModule } from '@nestjs/bullmq';
import { AiInferenceProcessor } from './ai-inference.processor';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'ai-inference',
    }),
  ],
  controllers: [DispatchAiController],
  providers: [DispatchAiService, ...(process.env.RUN_WORKERS === 'true' ? [AiInferenceProcessor] : [])],
  exports: [DispatchAiService],
})
export class DispatchAiModule {}
