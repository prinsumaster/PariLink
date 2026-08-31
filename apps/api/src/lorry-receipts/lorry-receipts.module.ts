import { Module } from '@nestjs/common';
import { LorryReceiptsService } from './lorry-receipts.service';
import { LorryReceiptsController } from './lorry-receipts.controller';
import { BiltyController } from './bilty.controller';
import { PdfGeneratorService } from './pdf-generator.service';

@Module({
  controllers: [LorryReceiptsController, BiltyController],
  providers: [LorryReceiptsService, PdfGeneratorService],
  exports: [LorryReceiptsService, PdfGeneratorService],
})
export class LorryReceiptsModule {}
