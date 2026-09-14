import { IsOptional, IsString, IsIn } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

import { PaginationQueryDto } from '../../platform/api/dto/pagination-query.dto';

export class DriverQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({
    enum: ['AVAILABLE', 'ON_DUTY', 'OFF_DUTY', 'TERMINATED'],
  })
  @IsOptional()
  @IsIn(['AVAILABLE', 'ON_DUTY', 'OFF_DUTY', 'TERMINATED'])
  status?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  sort?: string;
}
