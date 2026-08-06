import type { AuthenticatedUser } from '../auth/decorators/get-user.decorator';
import { GetUser } from '../auth/decorators/get-user.decorator';
import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { PortalsService } from './portals.service';
import {
  CreateSupportTicketDto,
  CreateLeaveRequestDto,
} from './dto/portals.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('portals')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('portals')
export class PortalsController {
  constructor(private readonly portalsService: PortalsService) {}

  @Post('support-tickets')
  @RequirePermissions('portals:access')
  @ApiOperation({ summary: 'Create a support ticket' })
  createSupportTicket(
    @GetUser() user: AuthenticatedUser,
    @Body() dto: CreateSupportTicketDto,
  ) {
    return this.portalsService.createSupportTicket(
      user.companyId,
      user.userId,
      dto,
    );
  }

  @Get('support-tickets')
  @RequirePermissions('portals:access')
  @ApiOperation({ summary: 'Get support tickets for logged-in user' })
  getSupportTickets(@GetUser() user: AuthenticatedUser) {
    return this.portalsService.getSupportTickets(user.companyId, user.userId);
  }

  @Post('leave-requests')
  @RequirePermissions('portals:access')
  @ApiOperation({ summary: 'Create a leave request (Driver)' })
  createLeaveRequest(
    @GetUser() user: AuthenticatedUser,
    @Body() dto: CreateLeaveRequestDto,
  ) {
    return this.portalsService.createLeaveRequest(
      user.companyId,
      user.userId,
      dto,
    );
  }

  @Get('leave-requests')
  @RequirePermissions('portals:access')
  @ApiOperation({ summary: 'Get leave requests (Driver)' })
  getLeaveRequests(@GetUser() user: AuthenticatedUser) {
    return this.portalsService.getLeaveRequests(user.companyId, user.userId);
  }
}
