import { IsString, IsNumber, IsOptional, IsDateString, IsObject } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class CreateBankStatementDto {
  @ApiProperty()
  @IsString()
  accountId!: string;

  @ApiProperty()
  @IsDateString()
  statementDate!: string;

  @ApiProperty()
  @IsNumber()
  closingBalance!: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  currency?: string;

  @ApiProperty({ required: false })
  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;
}

export class UpdateBankStatementDto extends PartialType(CreateBankStatementDto) {}
