import {
  IsString,
  IsNumber,
  IsOptional,
  IsBoolean,
  IsArray,
  IsEnum,
  IsNotEmpty,
  ValidateNested,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class VehicleTelemetryDto {
  @ApiProperty({ example: 'veh-uuid-001' })
  @IsString()
  @IsNotEmpty()
  vehicleId!: string;

  @ApiPropertyOptional({ example: 'drv-uuid-001' })
  @IsOptional()
  @IsString()
  driverId?: string;

  @ApiPropertyOptional({ example: 124500.5 })
  @IsOptional()
  @IsNumber()
  odometer?: number;

  @ApiPropertyOptional({ example: 4500.2 })
  @IsOptional()
  @IsNumber()
  engineHours?: number;

  @ApiPropertyOptional({ example: 78.5 })
  @IsOptional()
  @IsNumber()
  fuelLevel?: number;

  @ApiPropertyOptional({ example: 13.8 })
  @IsOptional()
  @IsNumber()
  batteryVolts?: number;

  @ApiPropertyOptional({ example: 195.0 })
  @IsOptional()
  @IsNumber()
  coolantTemp?: number;

  @ApiPropertyOptional({ example: 65.0 })
  @IsOptional()
  @IsNumber()
  engineLoad?: number;

  @ApiPropertyOptional({ example: 1500.0 })
  @IsOptional()
  @IsNumber()
  rpm?: number;

  @ApiPropertyOptional({ example: 68.5 })
  @IsOptional()
  @IsNumber()
  speed?: number;

  @ApiPropertyOptional({ example: ['P0171', 'P0300'] })
  @IsOptional()
  @IsArray()
  dtcCodes?: string[];

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  ignition?: boolean;

  @ApiPropertyOptional({ example: '2026-07-27T10:00:00Z' })
  @IsOptional()
  @IsString()
  timestamp?: string;
}

export class CreateGeofenceDto {
  @ApiProperty({ example: 'Acme Chicago Distribution Center' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiPropertyOptional({ example: 'Main receiving dock for Acme Midwest' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    example: 'CUSTOMER',
    enum: ['CUSTOMER', 'WAREHOUSE', 'DEPOT', 'TOLL', 'PORT', 'BORDER'],
  })
  @IsString()
  @IsNotEmpty()
  type!: string;

  @ApiProperty({ example: 41.8781 })
  @IsNumber()
  latitude!: number;

  @ApiProperty({ example: -87.6298 })
  @IsNumber()
  longitude!: number;

  @ApiPropertyOptional({ example: 250.0 })
  @IsOptional()
  @IsNumber()
  @Min(10)
  radiusMeters?: number;

  @ApiPropertyOptional({
    example: [
      { lat: 41.88, lng: -87.63 },
      { lat: 41.87, lng: -87.63 },
    ],
  })
  @IsOptional()
  @IsArray()
  polygon?: any[];

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class CreateAlertRuleDto {
  @ApiProperty({ example: 'Engine Overheating Alert' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({
    example: 'MAINTENANCE',
    enum: [
      'SPEEDING',
      'IDLING',
      'DEVIATION',
      'OFF_HOURS',
      'BATTERY',
      'MAINTENANCE',
      'LOW_FUEL',
    ],
  })
  @IsString()
  @IsNotEmpty()
  type!: string;

  @ApiProperty({
    example: 'EXCEEDS',
    enum: ['EXCEEDS', 'LESS_THAN', 'MATCHES'],
  })
  @IsString()
  @IsNotEmpty()
  condition!: string;

  @ApiProperty({ example: 220.0 })
  @IsNumber()
  threshold!: number;

  @ApiPropertyOptional({
    example: 'HIGH',
    enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
  })
  @IsOptional()
  @IsString()
  severity?: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdateAlertStatusDto {
  @ApiProperty({
    example: 'ACKNOWLEDGED',
    enum: ['NEW', 'ACKNOWLEDGED', 'RESOLVED'],
  })
  @IsString()
  @IsNotEmpty()
  status!: string;

  @ApiPropertyOptional({ example: 'Driver contacted, coolant checked' })
  @IsOptional()
  @IsString()
  notes?: string;
}
