import { Module } from '@nestjs/common';
import { EdiService } from './edi.service';

@Module({
  providers: [EdiService],
  exports: [EdiService],
})
export class EdiModule {}
