import {
  IsString,
  IsOptional,
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsUUID,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateBranchDto {
  @ApiProperty({ example: 'b567d2ca-1122-3344-5566-778899aabbcc' })
  @IsUUID()
  @IsOptional()
  companyId?: string;

  @ApiProperty({ example: 'Dallas Terminal' })
  @IsString()
  @IsOptional()
  name!: string;

  @ApiPropertyOptional({ example: 'DFW-01' })
  @IsString()
  @IsOptional()
  code?: string;

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

  @ApiPropertyOptional({
    enum: ['ACTIVE', 'INACTIVE', 'SUSPENDED'],
    default: 'ACTIVE',
  })
  @IsIn(['ACTIVE', 'INACTIVE', 'SUSPENDED'])
  @IsOptional()
  status?: string;
}
