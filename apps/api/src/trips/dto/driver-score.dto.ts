import { IsNumber, IsNotEmpty } from 'class-validator';
export class DriverScoreDto {
  @IsNumber()
  @IsNotEmpty()
  score: number;
}
