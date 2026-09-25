import {
  IsString,
  IsOptional,
  IsNotEmpty,
  IsNumber,
  IsDateString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateLorryReceiptDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  consignorName!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  consigneeName!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  product!: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  grossWeight!: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  tareWeight!: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  netWeight!: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  gstNo?: string;

  @ApiPropertyOptional()
  @IsDateString()
  @IsOptional()
  gateInTime?: string;

  @ApiPropertyOptional()
  @IsDateString()
  @IsOptional()
  gateOutTime?: string;
}
