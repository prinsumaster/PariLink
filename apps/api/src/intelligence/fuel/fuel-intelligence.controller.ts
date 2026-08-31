import type { AuthenticatedUser } from '../../auth/decorators/get-user.decorator';
import { GetUser } from '../../auth/decorators/get-user.decorator';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { FuelIntelligenceService } from './fuel-intelligence.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../auth/guards/permissions.guard';
import { RequirePermissions } from '../../auth/decorators/permissions.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('intelligence/fuel')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('intelligence/fuel')
export class FuelIntelligenceController {
  constructor(private readonly fuelIntelligenceService: FuelIntelligenceService) {}

  @Get('anomalies')
  @RequirePermissions('reports:read')
  @ApiOperation({ summary: 'Get fuel anomalies feed' })
  getAnomalies(@GetUser() user: AuthenticatedUser) {
    return this.fuelIntelligenceService.getAnomalies(user.companyId);
  }

  @Get('summary')
  @RequirePermissions('reports:read')
  @ApiOperation({ summary: 'Get fuel anomalies summary' })
  getSummary(@GetUser() user: AuthenticatedUser) {
    return this.fuelIntelligenceService.getSummary(user.companyId);
  }
}
