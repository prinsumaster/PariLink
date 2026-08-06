import { IsOptional, IsInt, Min, IsString, IsIn } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

import { PaginationQueryDto } from '../../platform/api/dto/pagination-query.dto';

export class DriverQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({
    enum: ['AVAILABLE', 'ON_DUTY', 'OFF_DUTY', 'TERMINATED'],
  })
  @IsOptional()
  @IsIn(['AVAILABLE', 'ON_DUTY', 'OFF_DUTY', 'TERMINATED'])
  status?: string;
}
