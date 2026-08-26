import { IsString, IsNotEmpty, IsArray, ValidateNested, ArrayNotEmpty, IsDateString, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class WorkOrderItemDto {
  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsNumber()
  cost!: number;
}

export class CreateWorkOrderDto {
  @IsString()
  @IsNotEmpty()
  vehicleId!: string;

  @IsString()
  @IsNotEmpty()
  type!: string;

  @IsDateString()
  scheduledDate!: string;

  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => WorkOrderItemDto)
  items!: WorkOrderItemDto[];
}
