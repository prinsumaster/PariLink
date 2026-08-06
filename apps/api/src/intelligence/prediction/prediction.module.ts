import { Module } from '@nestjs/common';
import { PredictionService } from './prediction.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [PredictionService],
  exports: [PredictionService],
})
export class PredictionEngineModule {}
