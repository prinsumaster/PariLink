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
import { DriverExpensesService } from './driver-expenses.service';

@ApiTags('driver-portal/expenses')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('driver-portal/expenses')
export class DriverExpensesController {
  constructor(private readonly driverExpensesService: DriverExpensesService) {}

  @Get()
  @ApiOperation({ summary: 'Get recent expenses submitted by the driver' })
  getExpenses(@GetUser() user: AuthenticatedUser) {
    const driverId = (user as any).driverId || user.userId;
    return this.driverExpensesService.getExpenses(user.companyId, driverId);
  }

  @Post('trips/:id')
  @ApiOperation({ summary: 'Submit an expense for a specific trip' })
  submitExpense(
    @GetUser() user: AuthenticatedUser,
    @Param('id') tripId: string,
    @Body('type') type: string,
    @Body('amount') amount: number,
    @Body('date') date: string,
    @Body('documentUrl') documentUrl?: string,
  ) {
    const driverId = (user as any).driverId || user.userId;
    return this.driverExpensesService.submitExpense(
      user.companyId,
      driverId,
      tripId,
      type,
      amount,
      date,
      documentUrl,
    );
  }
}
