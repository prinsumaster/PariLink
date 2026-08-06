import type { AuthenticatedUser } from '../auth/decorators/get-user.decorator';
import { GetUser } from '../auth/decorators/get-user.decorator';
import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { FactoringService } from './factoring.service';
import { SubmitFactoringDto } from './dto/submit-factoring.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('factoring')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('factoring')
export class FactoringController {
  constructor(private readonly factoringService: FactoringService) {}

  @Post('submit')
  @RequirePermissions('factoring:write')
  @ApiOperation({ summary: 'Submit an invoice and BOL for factoring' })
  submit(@GetUser() user: AuthenticatedUser, @Body() dto: SubmitFactoringDto) {
    return this.factoringService.submitInvoiceForFactoring(
      user.companyId,
      user.userId,
      dto,
    );
  }

  @Get('dashboard')
  @ApiOperation({ summary: 'Get factoring dashboard data' })
  getDashboard(@GetUser() user: AuthenticatedUser) {
    return this.factoringService.getFactoringDashboard(user.companyId);
  }

  @Post('stripe/connect')
  @ApiOperation({ summary: 'Generate Stripe Connect onboarding URL' })
  connectStripe(@GetUser() user: AuthenticatedUser) {
    return this.factoringService.connectStripe(user.companyId);
  }
}
