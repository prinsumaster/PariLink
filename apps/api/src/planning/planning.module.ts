import { Module } from '@nestjs/common';
import { PlanningController } from './planning.controller';
import { PlanningEngineService } from './planning-engine.service';
import { PrismaModule } from '../prisma/prisma.module';
import { OptimizationModule } from '../optimization/optimization.module';
import { AiModule } from '../ai/ai.module';
import { DispatchModule } from '../dispatch/dispatch.module';

@Module({
  imports: [PrismaModule, OptimizationModule, AiModule, DispatchModule],
  controllers: [PlanningController],
  providers: [PlanningEngineService],
  exports: [PlanningEngineService],
})
export class PlanningModule {}
