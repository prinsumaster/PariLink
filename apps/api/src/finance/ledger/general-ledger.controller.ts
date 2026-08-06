import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { GetUser } from '../../auth/decorators/get-user.decorator';
import type { AuthenticatedUser } from '../../auth/decorators/get-user.decorator';
import { GeneralLedgerService } from './general-ledger.service';

@ApiTags('finance/ledger')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('finance/ledger')
export class GeneralLedgerController {
  constructor(private readonly ledgerService: GeneralLedgerService) {}

  @Get('entries')
  @ApiOperation({ summary: 'Get recent general ledger journal entries' })
  getJournalEntries(@GetUser() user: AuthenticatedUser) {
    return this.ledgerService.getJournalEntries(user.companyId);
  }

  @Post('entries')
  @ApiOperation({ summary: 'Post a new double-entry journal' })
  createJournalEntry(@GetUser() user: AuthenticatedUser, @Body() payload: any) {
    return this.ledgerService.createJournalEntry(user.companyId, payload);
  }
}
