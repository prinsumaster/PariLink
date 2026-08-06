import {
  Controller,
  Get,
  Param,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { GetUser } from '../../../auth/decorators/get-user.decorator';
import type { AuthenticatedUser } from '../../../auth/decorators/get-user.decorator';
import { CustomerTrackingService } from './customer-tracking.service';

@ApiTags('customer-portal/tracking')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('customer-portal/tracking')
export class CustomerTrackingController {
  constructor(private readonly trackingService: CustomerTrackingService) {}

  @Get(':loadId')
  @ApiOperation({
    summary: 'Get live tracking data and ETA for a specific load',
  })
  getTrackingData(
    @GetUser() user: AuthenticatedUser,
    @Param('loadId') loadId: string,
  ) {
    if (!user.customerId)
      throw new UnauthorizedException('Customer context missing');
    return this.trackingService.getTrackingLink(
      user.companyId,
      user.customerId,
      loadId,
    );
  }
}
