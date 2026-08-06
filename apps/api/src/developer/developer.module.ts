import { Module } from '@nestjs/common';
import { DeveloperController } from './developer.controller';
import { DeveloperService } from './developer.service';
import { PrismaModule } from '../prisma/prisma.module';
import { IamModule } from '../iam/iam.module';

@Module({
  imports: [PrismaModule, IamModule],
  controllers: [DeveloperController],
  providers: [DeveloperService],
  exports: [DeveloperService],
})
export class DeveloperModule {}
