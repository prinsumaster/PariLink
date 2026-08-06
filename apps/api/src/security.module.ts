import { Module } from '@nestjs/common';
import { CryptoService } from './common/services/crypto.service';
import { DlpGuard } from './common/guards/dlp.guard';

@Module({
  providers: [CryptoService, DlpGuard],
  exports: [CryptoService, DlpGuard],
})
export class SecurityModule {}
