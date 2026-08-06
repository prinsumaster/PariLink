import { Module } from '@nestjs/common';
import { ExportService } from './export.service';
import { ImportService } from './import.service';
import { DataController } from './data.controller';

@Module({
  controllers: [DataController],
  providers: [ExportService, ImportService],
  exports: [ExportService, ImportService],
})
export class DataModule {}
