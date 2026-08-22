import { IsString, IsNumber, IsOptional, IsDateString, IsArray, ValidateNested, IsBoolean, IsObject } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRateCardDto {
  @ApiProperty()
  @IsString()
  customerId: string;

  @ApiProperty()
  @IsString()
  serviceType: string;

  @ApiProperty()
  @IsNumber()
  baseRate: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  currency?: string;

  @ApiProperty({ required: false })
  @IsObject()
  @IsOptional()
  terms?: Record<string, any>;
}

export class CreateQuotationDto {
  @ApiProperty()
  @IsString()
  origin: string;

  @ApiProperty()
  @IsString()
  destination: string;

  @ApiProperty()
  @IsString()
  equipmentType: string;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  estimatedWeight?: number;

  @ApiProperty({ required: false })
  @IsObject()
  @IsOptional()
  requirements?: Record<string, any>;
}

export class CreateContractDto {
  @ApiProperty()
  @IsString()
  partyId: string; // Customer or Vendor ID

  @ApiProperty()
  @IsString()
  type: string; // MSA, SLA, Carrier Agreement

  @ApiProperty()
  @IsDateString()
  startDate: string;

  @ApiProperty()
  @IsDateString()
  endDate: string;

  @ApiProperty({ required: false })
  @IsObject()
  @IsOptional()
  clauses?: Record<string, any>;
}

export class CreateTenderDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsDateString()
  deadline: string;

  @ApiProperty({ required: false })
  @IsObject()
  @IsOptional()
  requirements?: Record<string, any>;

  @ApiProperty({ required: false })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  invitedVendors?: string[];
}

export class SubmitBidDto {
  @ApiProperty()
  @IsString()
  vendorId: string;

  @ApiProperty()
  @IsNumber()
  amount: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  currency?: string;

  @ApiProperty({ required: false })
  @IsObject()
  @IsOptional()
  proposedTerms?: Record<string, any>;
}
