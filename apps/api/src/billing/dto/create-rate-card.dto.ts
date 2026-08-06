import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsBoolean,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateRateCardDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  customerId!: string;

  @ApiProperty({ enum: ['DISTANCE', 'WEIGHT', 'FLAT', 'ROUTE'] })
  @IsString()
  @IsNotEmpty()
  type!: string;

  @ApiProperty()
  @IsNumber()
  rate!: number;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  fuelSurcharge?: number;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  tollSurcharge?: number;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  waitingCharge?: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  currency?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  originCity?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  destinationCity?: string;
}
