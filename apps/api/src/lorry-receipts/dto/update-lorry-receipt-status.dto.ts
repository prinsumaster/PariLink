import { IsIn, IsOptional, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateLorryReceiptStatusDto {
  @ApiProperty({ enum: ['ISSUED', 'IN_TRANSIT', 'DELIVERED', 'CANCELLED'] })
  @IsIn(['ISSUED', 'IN_TRANSIT', 'DELIVERED', 'CANCELLED'])
  status!: string;

  @ApiPropertyOptional({ description: 'POD document id, set on delivery' })
  @IsUUID()
  @IsOptional()
  podDocumentId?: string;
}
