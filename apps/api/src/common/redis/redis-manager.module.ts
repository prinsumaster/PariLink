import { Module, Global } from '@nestjs/common';
import { RedisManagerService } from './redis-manager.service';

@Global()
@Module({
  providers: [RedisManagerService],
  exports: [RedisManagerService],
})
export class RedisManagerModule {}
