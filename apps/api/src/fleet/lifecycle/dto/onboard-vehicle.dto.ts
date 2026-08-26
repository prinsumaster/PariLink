import { IsString, IsNotEmpty } from 'class-validator';

export class OnboardVehicleDto {
  @IsString()
  @IsNotEmpty()
  vin: string;

  @IsString()
  @IsNotEmpty()
  make: string;
}
