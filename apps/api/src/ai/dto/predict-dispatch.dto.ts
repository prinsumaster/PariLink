import { IsString, IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class PredictDispatchDto {
  @IsString()
  @IsNotEmpty()
  origin: string;

  @IsString()
  @IsNotEmpty()
  destination: string;

  @IsNumber()
  @IsPositive()
  loadWeight: number;
}
