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
import { VehicleLifecycleService } from './vehicle-lifecycle.service';

@ApiTags('fleet/lifecycle')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('fleet/lifecycle')
export class VehicleLifecycleController {
  constructor(
    private readonly vehicleLifecycleService: VehicleLifecycleService,
  ) {}

  @Get('status')
  @ApiOperation({ summary: 'Get overall fleet operational status' })
  getFleetStatus(@GetUser() user: AuthenticatedUser) {
    return this.vehicleLifecycleService.getFleetStatus(user.companyId);
  }

  @Post('onboard')
  @ApiOperation({ summary: 'Onboard a new vehicle into the fleet' })
  onboardVehicle(@GetUser() user: AuthenticatedUser, @Body() data: any) {
    return this.vehicleLifecycleService.onboardVehicle(user.companyId, data);
  }
}
