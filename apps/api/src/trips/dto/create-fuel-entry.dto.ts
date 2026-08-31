import { IsString, IsNotEmpty, IsNumber } from 'class-validator';
export class CreateFuelEntryDto {
  @IsNumber()
  @IsNotEmpty()
  quantity: number;

  @IsNumber()
  @IsNotEmpty()
  amount: number;
}
