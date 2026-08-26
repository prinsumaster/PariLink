import { IsOptional, IsIn } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationQueryDto } from '../../platform/api/dto/pagination-query.dto';

export class LorryReceiptQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({
    enum: ['ISSUED', 'IN_TRANSIT', 'DELIVERED', 'CANCELLED'],
  })
  @IsOptional()
  @IsIn(['ISSUED', 'IN_TRANSIT', 'DELIVERED', 'CANCELLED'])
  status?: string;
}
