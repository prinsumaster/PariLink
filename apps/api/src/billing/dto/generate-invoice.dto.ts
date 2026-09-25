import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsArray,
  ArrayMinSize,
} from 'class-validator';
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

export class GenerateInvoiceFromTripsDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  customerId!: string;

  @ApiProperty({ type: [String] })
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  tripIds!: string[];
}
