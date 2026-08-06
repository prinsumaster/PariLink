import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { GetUser } from '../../../auth/decorators/get-user.decorator';
import type { AuthenticatedUser } from '../../../auth/decorators/get-user.decorator';
import { VendorOperationsService } from './vendor-operations.service';

@ApiTags('vendor-portal/operations')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('vendor-portal/operations')
export class VendorOperationsController {
  constructor(
    private readonly vendorOperationsService: VendorOperationsService,
  ) {}

  @Get('assigned')
  @ApiOperation({
    summary: 'Get assigned loads (accepted tenders) for the vendor',
  })
  getAssignedTenders(@GetUser() user: AuthenticatedUser) {
    if (!user.vendorId)
      throw new UnauthorizedException(
        'User is not associated with a Vendor account',
      );
    return this.vendorOperationsService.getAssignedTenders(
      user.companyId,
      user.vendorId,
    );
  }

  @Post('assigned/:id/pod')
  @ApiOperation({ summary: 'Upload POD for an assigned tender' })
  uploadPod(
    @GetUser() user: AuthenticatedUser,
    @Param('id') tenderBidId: string,
    @Body('documentUrl') documentUrl: string,
  ) {
    if (!user.vendorId)
      throw new UnauthorizedException(
        'User is not associated with a Vendor account',
      );
    return this.vendorOperationsService.uploadPod(
      user.companyId,
      user.vendorId,
      tenderBidId,
      documentUrl,
    );
  }
}
