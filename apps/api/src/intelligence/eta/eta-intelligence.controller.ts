import {
  Controller,
  Get,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { EtaIntelligenceService } from './eta-intelligence.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { TenantInterceptor } from '../../platform/security/tenant.interceptor';
import { PermissionsGuard } from '../../auth/guards/permissions.guard';
import { RequirePermissions } from '../../auth/decorators/permissions.decorator';

@Controller('intelligence/eta')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@UseInterceptors(TenantInterceptor)
export class EtaIntelligenceController {
  constructor(
    private readonly etaIntelligenceService: EtaIntelligenceService,
  ) {}

  @Get('predict')
  @RequirePermissions('dispatch:ai:read')
  async predictEta(@Query('tripId') tripId: string, @Req() req: any) {
    if (!tripId) {
      throw new BadRequestException('tripId is required');
    }
    return this.etaIntelligenceService.predictEta(req.user.companyId, tripId);
  }
}
