import { Module } from '@nestjs/common';
import { SimulatorController } from './simulator.controller';
import { SimulatorService } from './simulator.service';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { PlatformModule } from '../platform/platform.module';

@Module({
  imports: [PrismaModule, AuthModule, PlatformModule],
  controllers: [SimulatorController],
  providers: [SimulatorService],
})
export class SimulatorModule {}
