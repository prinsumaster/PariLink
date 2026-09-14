import { IsString, IsNumber, IsNotEmpty } from 'class-validator';
import {
  Controller,
  Post,
  Body,
  UseGuards
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { GetUser } from '../../../auth/decorators/get-user.decorator';
import type { AuthenticatedUser } from '../../../auth/decorators/get-user.decorator';
import { DriverTelemetryService } from './driver-telemetry.service';

export class LogLocationDto {
  @IsString() @IsNotEmpty() tripId!: string;
  @IsNumber() latitude!: number;
  @IsNumber() longitude!: number;
}

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
    @Body() dto: LogLocationDto,
  ) {
    const driverId = (user as any).driverId || user.userId;
    return this.driverTelemetryService.logLocation(
      user.companyId,
      driverId,
      dto.tripId,
      dto.latitude,
      dto.longitude,
    );
  }
}
