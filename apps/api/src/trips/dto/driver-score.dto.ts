import { IsNumber, IsBoolean, IsNotEmpty } from 'class-validator';
export class DriverScoreDto {
  @IsBoolean()
  @IsNotEmpty()
  onTime: boolean;

  @IsBoolean()
  @IsNotEmpty()
  podUploaded: boolean;

  @IsNumber()
  @IsNotEmpty()
  fuelScore: number;

  @IsNumber()
  @IsNotEmpty()
  damageScore: number;

  @IsNumber()
  @IsNotEmpty()
  behaviourScore: number;
}
