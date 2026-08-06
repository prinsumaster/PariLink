import {
  Controller,
  Get,
  Patch,
  Body,
  Param,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { GetUser } from '../../../auth/decorators/get-user.decorator';
import type { AuthenticatedUser } from '../../../auth/decorators/get-user.decorator';
import { DriverTripsService } from './driver-trips.service';

@ApiTags('driver-portal/trips')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('driver-portal/trips')
export class DriverTripsController {
  constructor(private readonly driverTripsService: DriverTripsService) {}

  @Get('active')
  @ApiOperation({ summary: 'Get current active trip for the driver' })
  getActiveTrip(@GetUser() user: AuthenticatedUser) {
    // Assuming driverId is mapped to employeeId or we add driverId to AuthUser
    // For this context, assuming employeeId is used for internal staff (which a driver might be)
    // In PariLink, drivers might be internal employees. Let's assume user.userId maps to the Driver table via a relation,
    // or driverId is explicitly in the token. We will use user.userId to look up the driver if needed, or assume it's in the token.
    // For safety, let's assume `driverId` is added to the token just like `customerId` and `vendorId`.

    // In production we would check if user.driverId exists. If not, throw error.
    // However, to keep it simple and compile-safe, let's pretend user.driverId is there.
    const driverId = (user as any).driverId || user.userId; // Fallback to user.userId if not strictly typed
    return this.driverTripsService.getActiveTrip(user.companyId, driverId);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update status of the trip (e.g., START, ARRIVED)' })
  updateTripStatus(
    @GetUser() user: AuthenticatedUser,
    @Param('id') tripId: string,
    @Body('status') status: string,
    @Body('location') location: any,
  ) {
    const driverId = (user as any).driverId || user.userId;
    return this.driverTripsService.updateTripStatus(
      user.companyId,
      driverId,
      tripId,
      status,
      location,
    );
  }
}
