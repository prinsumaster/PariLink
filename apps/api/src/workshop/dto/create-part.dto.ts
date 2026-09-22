import { IsString, IsOptional, IsNumber, IsNotEmpty, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePartDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  sku?: string;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  unitCost?: number;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  quantity?: number;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  reorderLevel?: number;

  @ApiPropertyOptional()
  @IsUUID()
  @IsOptional()
  vendorId?: string;
}
