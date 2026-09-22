import { IsString, IsOptional, IsNumber, IsNotEmpty, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTyreLogDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  tyreId: string;

  @ApiPropertyOptional()
  @IsUUID()
  @IsOptional()
  vehicleId?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  action: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  oldPosition?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  newPosition?: string;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  odometer?: number;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  treadDepthMm?: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  reason?: string;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  cost?: number;
}
