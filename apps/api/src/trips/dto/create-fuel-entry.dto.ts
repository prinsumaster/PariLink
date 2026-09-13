import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsDateString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateFuelEntryDto {
  @ApiProperty({ description: 'Litres of fuel filled', example: 180 })
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  litres!: number;

  @ApiProperty({ description: 'Amount paid (INR)', example: 15200 })
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  amount!: number;

  @ApiPropertyOptional({ description: 'Pump / station name', example: 'HP Pump Nagpur' })
  @IsOptional()
  @IsString()
  pump?: string;

  @ApiPropertyOptional({ description: 'Fuel slip / bill number', example: 'SLIP-20260910-001' })
  @IsOptional()
  @IsString()
  slipNo?: string;

  @ApiPropertyOptional({ description: 'Date/time of fill', example: '2026-09-10T10:30:00Z' })
  @IsOptional()
  @IsDateString()
  filledAt?: string;
}
