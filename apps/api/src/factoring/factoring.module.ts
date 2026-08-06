import { Module } from '@nestjs/common';
import { FactoringService } from './factoring.service';
import { FactoringController } from './factoring.controller';

@Module({
  controllers: [FactoringController],
  providers: [FactoringService],
})
export class FactoringModule {}
