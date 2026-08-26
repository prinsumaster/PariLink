import { IsString, IsNumber, IsOptional, IsDateString, IsObject } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class CreatePayrollDto {
  @ApiProperty()
  @IsString()
  employeeId!: string;

  @ApiProperty()
  @IsDateString()
  payPeriodStart!: string;

  @ApiProperty()
  @IsDateString()
  payPeriodEnd!: string;

  @ApiProperty()
  @IsNumber()
  grossAmount!: number;

  @ApiProperty()
  @IsNumber()
  netAmount!: number;

  @ApiProperty({ required: false })
  @IsObject()
  @IsOptional()
  deductions?: Record<string, any>;
}

export class UpdatePayrollDto extends PartialType(CreatePayrollDto) {}
