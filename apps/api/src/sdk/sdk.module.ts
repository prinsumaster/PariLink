import { Module } from '@nestjs/common';
import { SdkController } from './sdk.controller';
import { IamModule } from '../iam/iam.module';

@Module({
  imports: [IamModule],
  controllers: [SdkController],
})
export class SdkModule {}
