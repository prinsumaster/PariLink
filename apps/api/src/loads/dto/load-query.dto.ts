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

export class LoadQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({
    enum: ['PENDING', 'ASSIGNED', 'IN_TRANSIT', 'DELIVERED', 'CANCELLED'],
  })
  @IsOptional()
  @IsIn(['PENDING', 'ASSIGNED', 'IN_TRANSIT', 'DELIVERED', 'CANCELLED'])
  status?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  customerId?: string;
}
