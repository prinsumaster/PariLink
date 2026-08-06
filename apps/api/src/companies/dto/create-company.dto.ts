import {
  IsString,
  IsOptional,
  IsEmail,
  IsIn,
  IsNotEmpty,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCompanyDto {
  @ApiProperty({ example: 'Acme Logistics' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiPropertyOptional({ example: 'US-123456789' })
  @IsString()
  @IsOptional()
  taxId?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  address?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  city?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  state?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  country?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  postalCode?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional()
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  website?: string;

  @ApiPropertyOptional({
    enum: ['ACTIVE', 'INACTIVE', 'SUSPENDED'],
    default: 'ACTIVE',
  })
  @IsIn(['ACTIVE', 'INACTIVE', 'SUSPENDED'])
  @IsOptional()
  status?: string;
}
