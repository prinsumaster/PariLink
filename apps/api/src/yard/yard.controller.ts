import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';
import { GetUser } from '../auth/decorators/get-user.decorator';
import type { AuthenticatedUser } from '../auth/decorators/get-user.decorator';
import { YardService } from './engine/yard.service';
import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

// ---------------------------------------------------------------------------
// P2-2 FIX: Replaced @Body() data: Record<string, unknown> with strongly typed GateEventDto.
// Prevents mass-assignment vulnerabilities where clients could inject arbitrary
// fields that pass unvalidated into the database write path.
// ---------------------------------------------------------------------------

export class GateEventDto {
  @ApiProperty({ description: 'ID of the warehouse this event occurred at' })
  @IsString()
  warehouseId!: string;

  @ApiProperty({
    description: 'Purpose of the gate event (e.g., DELIVERY, PICKUP)',
  })
  @IsString()
  purpose!: string;

  @ApiProperty({ description: 'Vehicle ID', required: false })
  @IsOptional()
  @IsString()
  vehicleId?: string;

  @ApiProperty({ description: 'Trailer ID', required: false })
  @IsOptional()
  @IsString()
  trailerId?: string;

  @ApiProperty({ description: 'Driver ID', required: false })
  @IsOptional()
  @IsString()
  driverId?: string;
}

@Controller('yard')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class YardController {
  constructor(private readonly yardService: YardService) {}

  @Post('gate/entry')
  @RequirePermissions('warehouse:write')
  logGateEntry(@GetUser() user: AuthenticatedUser, @Body() data: GateEventDto) {
    return this.yardService.logGateEntry(
      user.companyId,
      data.warehouseId,
      data,
      user.userId,
    );
  }

  @Post('gate/exit')
  @RequirePermissions('warehouse:write')
  logGateExit(@GetUser() user: AuthenticatedUser, @Body() data: GateEventDto) {
    return this.yardService.logGateExit(
      user.companyId,
      data.warehouseId,
      data,
      user.userId,
    );
  }
}
