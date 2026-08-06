import {
  Controller,
  Get,
  Param,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { DriverIntelligenceService } from './driver-intelligence.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { TenantInterceptor } from '../../platform/security/tenant.interceptor';
import { PermissionsGuard } from '../../auth/guards/permissions.guard';
import { RequirePermissions } from '../../auth/decorators/permissions.decorator';

@Controller('intelligence/drivers')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@UseInterceptors(TenantInterceptor)
export class DriverIntelligenceController {
  constructor(
    private readonly driverIntelligenceService: DriverIntelligenceService,
  ) {}

  @Get(':id/score')
  @RequirePermissions('fleet:ai:read')
  async getDriverScore(@Param('id') driverId: string, @Req() req: any) {
    return this.driverIntelligenceService.getDriverScore(
      req.user.companyId,
      driverId,
    );
  }
}
