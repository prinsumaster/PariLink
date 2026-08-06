import { Module } from '@nestjs/common';
import { FastagWalletService } from './services/fastag-wallet/fastag-wallet.service';
import { FastagWalletController } from './controllers/fastag-wallet/fastag-wallet.controller';

@Module({
  providers: [FastagWalletService],
  controllers: [FastagWalletController],
})
export class FastagModule {}
