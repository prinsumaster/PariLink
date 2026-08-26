import { Module } from '@nestjs/common';
import { LorryReceiptsService } from './lorry-receipts.service';
import { LorryReceiptsController } from './lorry-receipts.controller';

@Module({
  controllers: [LorryReceiptsController],
  providers: [LorryReceiptsService],
  exports: [LorryReceiptsService],
})
export class LorryReceiptsModule {}
