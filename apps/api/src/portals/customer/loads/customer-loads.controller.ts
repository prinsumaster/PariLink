import {
  Controller,
  Get,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { GetUser } from '../../../auth/decorators/get-user.decorator';
import type { AuthenticatedUser } from '../../../auth/decorators/get-user.decorator';
import { CustomerLoadsService } from './customer-loads.service';

@ApiTags('customer-portal/loads')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('customer-portal/loads')
export class CustomerLoadsController {
  constructor(private readonly customerLoadsService: CustomerLoadsService) {}

  @Get('active')
  @ApiOperation({ summary: 'Get active loads for the logged-in customer' })
  getActiveLoads(@GetUser() user: AuthenticatedUser) {
    if (!user.customerId) {
      throw new UnauthorizedException(
        'User is not associated with a Customer account',
      );
    }
    return this.customerLoadsService.getActiveLoads(
      user.companyId,
      user.customerId,
    );
  }

  @Get('history')
  @ApiOperation({ summary: 'Get load history for the logged-in customer' })
  getLoadHistory(@GetUser() user: AuthenticatedUser) {
    if (!user.customerId) {
      throw new UnauthorizedException(
        'User is not associated with a Customer account',
      );
    }
    return this.customerLoadsService.getLoadHistory(
      user.companyId,
      user.customerId,
    );
  }
}
