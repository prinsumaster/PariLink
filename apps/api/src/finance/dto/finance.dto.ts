import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsDateString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateExpenseDto {
  @ApiPropertyOptional() @IsString() @IsOptional() tripId?: string;
  @ApiPropertyOptional() @IsString() @IsOptional() driverId?: string;
  @ApiProperty() @IsString() @IsNotEmpty() type!: string;
  @ApiProperty() @IsNumber() amount!: number;
  @ApiProperty() @IsDateString() date!: string;
  @ApiPropertyOptional() @IsString() @IsOptional() notes?: string;
}

export class CreateSettlementDto {
  @ApiProperty() @IsString() @IsNotEmpty() driverId!: string;
  @ApiProperty() @IsNumber() amount!: number;
  @ApiProperty() @IsString() @IsNotEmpty() type!: string;
  @ApiProperty() @IsDateString() periodStart!: string;
  @ApiProperty() @IsDateString() periodEnd!: string;
  @ApiPropertyOptional() @IsNumber() @IsOptional() advances?: number;
  @ApiPropertyOptional() @IsNumber() @IsOptional() deductions?: number;
}

export class CreateVendorBillDto {
  @ApiProperty() @IsString() @IsNotEmpty() vendorId!: string;
  @ApiProperty() @IsString() @IsNotEmpty() billNumber!: string;
  @ApiProperty() @IsNumber() amount!: number;
  @ApiPropertyOptional() @IsDateString() @IsOptional() dueDate?: string;
}

export class CreatePaymentDto {
  @ApiProperty() @IsString() @IsNotEmpty() invoiceId!: string;
  @ApiProperty() @IsNumber() amount!: number;
  @ApiProperty() @IsString() @IsNotEmpty() method!: string;
  @ApiPropertyOptional() @IsString() @IsOptional() referenceNumber?: string;
  @ApiProperty() @IsDateString() paymentDate!: string;
  @ApiPropertyOptional() @IsString() @IsOptional() notes?: string;
}
