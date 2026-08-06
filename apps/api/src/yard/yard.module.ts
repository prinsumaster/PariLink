import { Module } from '@nestjs/common';
import { YardController } from './yard.controller';
import { YardService } from './engine/yard.service';
import { DigitalTwinModule } from '../platform/digital-twin/digital-twin.module';

@Module({
  imports: [DigitalTwinModule],
  controllers: [YardController],
  providers: [YardService],
  exports: [YardService],
})
export class YardModule {}
