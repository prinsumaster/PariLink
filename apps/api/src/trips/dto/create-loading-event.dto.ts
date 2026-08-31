import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

export class CreateLoadingEventDto {
  @IsString()
  @IsNotEmpty()
  type: 'LOAD' | 'UNLOAD';

  @IsString()
  @IsNotEmpty()
  point: string;

  @IsString()
  @IsOptional()
  timeIn?: string;

  @IsString()
  @IsOptional()
  timeOut?: string;

  @IsNumber()
  @IsOptional()
  weightIn?: number;

  @IsNumber()
  @IsOptional()
  weightOut?: number;

  @IsNumber()
  @IsOptional()
  hamaliCost?: number;
}
