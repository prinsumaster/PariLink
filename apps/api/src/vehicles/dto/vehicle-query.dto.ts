import { IsOptional, IsIn } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

import { PaginationQueryDto } from '../../platform/api/dto/pagination-query.dto';

export class VehicleQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({ enum: ['TRUCK', 'TRAILER', 'VAN'] })
  @IsOptional()
  @IsIn(['TRUCK', 'TRAILER', 'VAN'])
  type?: string;

  @ApiPropertyOptional({
    enum: ['IN_SERVICE', 'MAINTENANCE', 'OUT_OF_SERVICE'],
  })
  @IsOptional()
  @IsIn(['IN_SERVICE', 'MAINTENANCE', 'OUT_OF_SERVICE'])
  status?: string;
}
