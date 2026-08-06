import { IsNumber, IsOptional, IsUUID, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class LocationPingDto {
  @ApiProperty({ example: 't123-uuid' })
  @IsUUID()
  @IsNotEmpty()
  tripId!: string;

  @ApiProperty({ example: 32.7767 })
  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  latitude!: number;

  @ApiProperty({ example: -96.797 })
  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  longitude!: number;

  @ApiPropertyOptional({ example: 55.2 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  speed?: number;

  @ApiPropertyOptional({ example: 180.5 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  heading?: number;

  @ApiPropertyOptional({ example: 10.0 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  accuracy?: number;
}
