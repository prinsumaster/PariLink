import {
  IsString,
  IsOptional,
  IsNotEmpty,
  IsUUID,
  IsIn,
  IsEmail,
  IsNumber,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCustomerDto {
  @ApiPropertyOptional({ example: 'b567d2ca-1122-3344-5566-778899aabbcc' })
  @IsUUID()
  @IsOptional()
  companyId?: string;

  @ApiProperty({ example: 'Acme Logistics' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiPropertyOptional({ example: 'ACME-001' })
  @IsString()
  @IsOptional()
  code?: string;

  @ApiPropertyOptional({ example: 'billing@acme.com' })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ example: '+1234567890' })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional({ example: '123 Business Rd, Dallas, TX' })
  @IsString()
  @IsOptional()
  billingAddress?: string;

  @ApiPropertyOptional({ example: 'XX-XXXXXXX' })
  @IsString()
  @IsOptional()
  taxId?: string;

  @ApiPropertyOptional({
    enum: ['NET_15', 'NET_30', 'NET_60', 'DUE_ON_RECEIPT'],
    default: 'NET_30',
  })
  @IsIn(['NET_15', 'NET_30', 'NET_60', 'DUE_ON_RECEIPT'])
  @IsOptional()
  paymentTerms?: string;

  @ApiPropertyOptional({ example: 50000 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  creditLimit?: number;

  @ApiPropertyOptional({
    enum: ['ACTIVE', 'INACTIVE', 'CREDIT_HOLD'],
    default: 'ACTIVE',
  })
  @IsIn(['ACTIVE', 'INACTIVE', 'CREDIT_HOLD'])
  @IsOptional()
  status?: string;
}
