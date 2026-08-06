import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class GenerateInvoiceDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  loadId!: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  rateCardId?: string;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  manualAmount?: number;
}
