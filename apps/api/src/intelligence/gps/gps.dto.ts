import {
  IsNumber,
  IsString,
  IsOptional,
  IsBoolean,
  IsDateString,
} from 'class-validator';

export class GpsPingDto {
  @IsString()
  vehicleId!: string;

  @IsNumber()
  latitude!: number;

  @IsNumber()
  longitude!: number;

  @IsNumber()
  @IsOptional()
  speed?: number;

  @IsNumber()
  @IsOptional()
  heading?: number;

  @IsNumber()
  @IsOptional()
  accuracy?: number;

  @IsNumber()
  @IsOptional()
  odometer?: number;

  @IsNumber()
  @IsOptional()
  fuelLevel?: number;

  @IsBoolean()
  @IsOptional()
  ignition?: boolean;

  @IsDateString()
  timestamp!: string;
}
