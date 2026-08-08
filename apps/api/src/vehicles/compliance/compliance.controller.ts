import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ComplianceService } from './compliance.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../auth/guards/permissions.guard';
import { RequirePermissions } from '../../auth/decorators/permissions.decorator';
import { GetUser } from '../../auth/decorators/get-user.decorator';
import type { AuthenticatedUser } from '../../auth/decorators/get-user.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('compliance')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('vehicles/compliance')
export class ComplianceController {
  constructor(private readonly complianceService: ComplianceService) {}

  @Post('hos-violations')
  @RequirePermissions('vehicles:write')
  @ApiOperation({ summary: 'Log HOS violation' })
  async logHosViolation(@GetUser() user: AuthenticatedUser, @Body() data: any) {
    return this.complianceService.logHosViolation(
      user.companyId,
      data,
      user.id,
    );
  }

  @Get('hos-violations')
  @RequirePermissions('vehicles:read')
  @ApiOperation({ summary: 'Get HOS violations' })
  async getHosViolations(
    @GetUser() user: AuthenticatedUser,
    @Query('driverId') driverId?: string,
  ) {
    return this.complianceService.getHosViolations(user.companyId, driverId);
  }

  @Post('dvir')
  @RequirePermissions('vehicles:write')
  @ApiOperation({ summary: 'Submit DVIR (Driver Vehicle Inspection Report)' })
  async submitDvir(@GetUser() user: AuthenticatedUser, @Body() data: any) {
    return this.complianceService.submitDvir(user.companyId, data, user.id);
  }

  @Get('dvir')
  @RequirePermissions('vehicles:read')
  @ApiOperation({ summary: 'Get DVIR logs' })
  async getDvirLogs(
    @GetUser() user: AuthenticatedUser,
    @Query('vehicleId') vehicleId?: string,
  ) {
    return this.complianceService.getDvirLogs(user.companyId, vehicleId);
  }

  @Post('registration/:vehicleId')
  @RequirePermissions('vehicles:write')
  @ApiOperation({ summary: 'Register/Update vehicle registration' })
  async registerVehicle(
    @GetUser() user: AuthenticatedUser,
    @Param('vehicleId') vehicleId: string,
    @Body() data: any,
  ) {
    return this.complianceService.registerVehicle(
      user.companyId,
      vehicleId,
      data,
      user.id,
    );
  }

  @Post('insurance/:vehicleId')
  @RequirePermissions('vehicles:write')
  @ApiOperation({ summary: 'Log new insurance policy for a vehicle' })
  async logInsurance(
    @GetUser() user: AuthenticatedUser,
    @Param('vehicleId') vehicleId: string,
    @Body() data: any,
  ) {
    return this.complianceService.logInsurance(
      user.companyId,
      vehicleId,
      data,
      user.id,
    );
  }
}
