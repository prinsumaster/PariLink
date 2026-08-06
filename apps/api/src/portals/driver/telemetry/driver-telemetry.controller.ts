import {
  Controller,
  Post,
  Body,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { GetUser } from '../../../auth/decorators/get-user.decorator';
import type { AuthenticatedUser } from '../../../auth/decorators/get-user.decorator';
import { DriverTelemetryService } from './driver-telemetry.service';

@ApiTags('driver-portal/telemetry')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('driver-portal/telemetry')
export class DriverTelemetryController {
  constructor(
    private readonly driverTelemetryService: DriverTelemetryService,
  ) {}

  @Post('location')
  @ApiOperation({
    summary: 'Log a high-frequency GPS ping for the active trip',
  })
  logLocation(
    @GetUser() user: AuthenticatedUser,
    @Body('tripId') tripId: string,
    @Body('latitude') latitude: number,
    @Body('longitude') longitude: number,
  ) {
    const driverId = (user as any).driverId || user.userId;
    return this.driverTelemetryService.logLocation(
      user.companyId,
      driverId,
      tripId,
      latitude,
      longitude,
    );
  }
}
