import { Module } from '@nestjs/common';
import { FilePlatformService } from './file.service';

@Module({
  providers: [FilePlatformService],
  exports: [FilePlatformService],
})
export class FilePlatformModule {}
