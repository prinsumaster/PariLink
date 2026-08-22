import { IsString, IsNumber, IsOptional, IsNotEmpty, IsNotEmptyObject } from 'class-validator';
import {
  Controller,
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
import { DriverChecklistsService } from './driver-checklists.service';

export class SubmitChecklistDto {
  @IsNotEmptyObject() data!: any;
}

@ApiTags('driver-portal/checklists')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)


@Controller('driver-portal/checklists')
export class DriverChecklistsController {
  constructor(
    private readonly driverChecklistsService: DriverChecklistsService,
  ) {}

  @Post('trips/:id')
  @ApiOperation({
    summary: 'Submit pre-trip or post-trip vehicle inspection checklist',
  })
  submitChecklist(
    @GetUser() user: AuthenticatedUser,
    @Param('id') tripId: string,
    @Body() dto: SubmitChecklistDto,
  ) {
    const driverId = (user as any).driverId || user.userId;
    return this.driverChecklistsService.submitChecklist(
      user.companyId,
      driverId,
      tripId,
      dto.data,
    );
  }
}
