import { Module } from '@nestjs/common';
import { LifecycleController } from '../api-platform/lifecycle/lifecycle.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [LifecycleController],
})
export class LifecycleModule {}
