import {
  IsString,
  IsOptional,
  IsNumber,
  IsPositive,
  IsDateString,
} from 'class-validator';

export class CreateFuelTransactionDto {
  @IsNumber()
  @IsPositive()
  gallons: number;

  @IsNumber()
  @IsPositive()
  totalCost: number;

  @IsString()
  @IsOptional()
  vehicleId?: string;

  @IsString()
  @IsOptional()
  driverId?: string;

  @IsString()
  @IsOptional()
  fuelCardId?: string;

  @IsString()
  @IsOptional()
  stationName?: string;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  pricePerGallon?: number;

  @IsNumber()
  @IsOptional()
  odometer?: number;

  @IsDateString()
  @IsOptional()
  transactionTime?: string;
}
