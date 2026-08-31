import { IsString, IsNotEmpty, IsOptional, IsNumber, IsPositive, Min } from 'class-validator';

export class FitTyreDto {
  @IsString()
  @IsNotEmpty()
  position: string;

  @IsString()
  @IsNotEmpty()
  serialNo: string;

  @IsString()
  @IsNotEmpty()
  brand: string;

  @IsNumber()
  @Min(0)
  fittedAtKm: number;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  expectedLifeKm?: number;

  @IsNumber()
  @Min(0)
  cost: number;
}
