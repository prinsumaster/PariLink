import { PartialType } from '@nestjs/swagger';
import { CreateLoadDto } from './create-load.dto';

import { IsOptional, IsUUID } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateLoadDto extends PartialType(CreateLoadDto) {
  @ApiPropertyOptional()
  @IsUUID()
  @IsOptional()
  tripId?: string;

  @ApiPropertyOptional()
  @IsUUID()
  @IsOptional()
  driverId?: string;

  @ApiPropertyOptional()
  @IsUUID()
  @IsOptional()
  vehicleId?: string;
}
