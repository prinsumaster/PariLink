import { Module } from '@nestjs/common';
import { ApiKeyService } from './services/api-keys.service';
import { OAuth2Service } from './services/oauth2.service';
import { PatService } from './services/pat.service';
import { IamController } from './controllers/iam.controller';
import { PlatformModule } from '../platform/platform.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule, PlatformModule],
  controllers: [IamController],
  providers: [ApiKeyService, OAuth2Service, PatService],
  exports: [ApiKeyService, OAuth2Service, PatService],
})
export class IamModule {}
