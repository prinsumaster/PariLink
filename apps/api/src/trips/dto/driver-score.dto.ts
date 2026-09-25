import { IsNumber, IsBoolean, IsNotEmpty } from 'class-validator';
export class DriverScoreDto {
  @IsBoolean()
  @IsNotEmpty()
  onTime: boolean;

  @IsBoolean()
  @IsNotEmpty()
  podUploaded: boolean;

  @IsNumber()
  fuelScore: number;

  @IsNumber()
  damageScore: number;

  @IsNumber()
  behaviourScore: number;
}
