import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, Min } from 'class-validator';

export class CreateTrailerDto {
  @ApiPropertyOptional({ example: 'Utility' })
  @IsOptional()
  @IsString()
  make?: string;

  @ApiPropertyOptional({ example: '4000D-X' })
  @IsOptional()
  @IsString()
  model?: string;

  @ApiPropertyOptional({ example: 2024 })
  @IsOptional()
  @IsNumber()
  @Min(1980)
  year?: number;

  @ApiPropertyOptional({ example: 'TR-90088' })
  @IsOptional()
  @IsString()
  licensePlate?: string;

  @ApiPropertyOptional({ example: '123456789ABCDEFG' })
  @IsOptional()
  @IsString()
  vin?: string;

  @ApiPropertyOptional({ example: 45000 })
  @IsOptional()
  @IsNumber()
  capacityWeight?: number;

  @ApiPropertyOptional({ example: 4000 })
  @IsOptional()
  @IsNumber()
  capacityVolume?: number;
}
