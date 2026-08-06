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

export class UserQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  roleId?: string;

  @ApiPropertyOptional({ enum: ['ACTIVE', 'INACTIVE', 'SUSPENDED'] })
  @IsOptional()
  @IsIn(['ACTIVE', 'INACTIVE', 'SUSPENDED'])
  status?: string;
}
