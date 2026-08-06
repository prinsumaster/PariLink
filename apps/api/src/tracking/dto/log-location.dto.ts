import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsDateString,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class LocationPointDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  tripId!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  driverId!: string;

  @ApiProperty()
  @IsNumber()
  latitude!: number;

  @ApiProperty()
  @IsNumber()
  longitude!: number;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  speed?: number;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  heading?: number;

  @ApiPropertyOptional()
  @IsDateString()
  @IsOptional()
  timestamp?: string;
}

export class LogLocationDto {
  @ApiProperty({ type: [LocationPointDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LocationPointDto)
  locations!: LocationPointDto[];
}
