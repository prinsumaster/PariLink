import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { ExecutionService } from './execution.service';
import { DigitalWorkerRegistry } from './digital-worker.registry';

@Module({
  imports: [PrismaModule],
  providers: [ExecutionService, DigitalWorkerRegistry],
  exports: [ExecutionService, DigitalWorkerRegistry],
})
export class ExecutionModule {}
