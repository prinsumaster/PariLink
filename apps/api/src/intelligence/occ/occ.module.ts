import { Module } from '@nestjs/common';
import { OccController } from './occ.controller';
import { OccService } from './occ.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { AuthModule } from '../../auth/auth.module';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [OccController],
  providers: [OccService],
})
export class OccModule {}
