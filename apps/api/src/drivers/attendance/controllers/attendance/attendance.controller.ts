/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../../../auth/guards/jwt-auth.guard';
import { AttendanceTrackingService } from '../../services/attendance-tracking/attendance-tracking.service';

@Controller('drivers/attendance')
@UseGuards(JwtAuthGuard)
export class AttendanceController {
  constructor(private readonly service: AttendanceTrackingService) {}

  @Post()
  create(@Req() req: any, @Body() data: Record<string, unknown>) {
    return this.service.create(req.user.companyId, req.user.id, data);
  }

  @Get()
  findAll(@Req() req: any, @Query() query: any) {
    return this.service.findAll(req.user.companyId, query);
  }

  @Get(':id')
  findOne(@Req() req: any, @Param('id') id: string) {
    return this.service.findOne(req.user.companyId, id);
  }

  @Patch(':id')
  update(
    @Req() req: any,
    @Param('id') id: string,
    @Body() data: Record<string, unknown>,
  ) {
    return this.service.update(req.user.companyId, id, req.user.id, data);
  }

  @Delete(':id')
  remove(@Req() req: any, @Param('id') id: string) {
    return this.service.remove(req.user.companyId, id, req.user.id);
  }
}
