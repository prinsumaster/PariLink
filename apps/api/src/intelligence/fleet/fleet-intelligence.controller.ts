import {
  Controller,
  Get,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FleetIntelligenceService } from './fleet-intelligence.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { TenantInterceptor } from '../../platform/security/tenant.interceptor';
import { PermissionsGuard } from '../../auth/guards/permissions.guard';
import { RequirePermissions } from '../../auth/decorators/permissions.decorator';

@Controller('intelligence/fleet')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@UseInterceptors(TenantInterceptor)
export class FleetIntelligenceController {
  constructor(
    private readonly fleetIntelligenceService: FleetIntelligenceService,
  ) {}

  @Get('kpis')
  @RequirePermissions('fleet:ai:read')
  async getFleetKpis(@Req() req: any) {
    return this.fleetIntelligenceService.getKpis(req.user.companyId);
  }
}
