import { IsNumber, IsBoolean, IsNotEmpty, IsOptional } from 'class-validator';
export class DriverScoreDto {
  @IsBoolean()
  @IsNotEmpty()
  onTime: boolean;

  @IsBoolean()
  @IsNotEmpty()
  podUploaded: boolean;

  @IsNumber()
  @IsOptional()
  dispatcherScore?: number;

  @IsNumber()
  @IsOptional()
  fleetManagerScore?: number;

  @IsNumber()
  @IsOptional()
  workshopScore?: number;

  @IsNumber()
  @IsOptional()
  securityScore?: number;

  @IsNumber()
  @IsOptional()
  customerScore?: number;

  @IsNumber()
  @IsOptional()
  mileageScore?: number;
}
