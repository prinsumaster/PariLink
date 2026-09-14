import { IsOptional, IsIn } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

import { PaginationQueryDto } from '../../platform/api/dto/pagination-query.dto';

export class CustomerQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({ enum: ['ACTIVE', 'INACTIVE', 'CREDIT_HOLD'] })
  @IsOptional()
  @IsIn(['ACTIVE', 'INACTIVE', 'CREDIT_HOLD'])
  status?: string;
}
