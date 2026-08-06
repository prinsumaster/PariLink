import { Module } from '@nestjs/common';
import { UniversalSearchController } from './search.controller';
import { SearchService } from './search.service';

@Module({
  controllers: [UniversalSearchController],
  providers: [SearchService],
})
export class SearchModule {}
