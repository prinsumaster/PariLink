import {
  IsOptional,
  IsInt,
  Min,
  IsString,
  IsIn,
  IsUUID,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

import { PaginationQueryDto } from '../../platform/api/dto/pagination-query.dto';

export class TripQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({
    enum: ['PLANNED', 'DISPATCHED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'],
  })
  @IsOptional()
  @IsIn(['PLANNED', 'DISPATCHED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'])
  status?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  driverId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  vehicleId?: string;
}
