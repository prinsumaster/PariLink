import {
  IsString,
  IsOptional,
  IsNotEmpty,
  IsUUID,
  IsIn,
  IsNumber,
  IsInt,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateLorryReceiptDto {
  @ApiProperty({ example: 'b567d2ca-1122-3344-5566-778899aabbcc' })
  @IsUUID()
  @IsNotEmpty()
  loadId!: string;

  @ApiPropertyOptional({ example: 'Bhonsle Transport' })
  @IsString()
  @IsOptional()
  consignorName?: string;

  @ApiPropertyOptional({ example: '27ABCDE1234F1Z5' })
  @IsString()
  @IsOptional()
  consignorGstin?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  consignorAddress?: string;

  @ApiPropertyOptional({ example: 'Gupta Roadways' })
  @IsString()
  @IsOptional()
  consigneeName?: string;

  @ApiPropertyOptional({ example: '07ABCDE1234F1Z5' })
  @IsString()
  @IsOptional()
  consigneeGstin?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  consigneeAddress?: string;

  @ApiPropertyOptional({ example: 'Mumbai' })
  @IsString()
  @IsOptional()
  fromStation?: string;

  @ApiPropertyOptional({ example: 'Delhi' })
  @IsString()
  @IsOptional()
  toStation?: string;

  @ApiPropertyOptional({ example: 'a1b2c3d4-1122-3344-5566-778899aabbcc' })
  @IsUUID()
  @IsOptional()
  vehicleId?: string;

  @ApiPropertyOptional({ example: 'MH-12-CD-5678' })
  @IsString()
  @IsOptional()
  vehicleNumber?: string;

  @ApiPropertyOptional({ example: 'Steel Coils' })
  @IsString()
  @IsOptional()
  goodsDescription?: string;

  @ApiPropertyOptional({ example: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  packagesCount?: number;

  @ApiPropertyOptional({ example: 'Bundles' })
  @IsString()
  @IsOptional()
  packingType?: string;

  @ApiPropertyOptional({ example: 12000 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  actualWeightKg?: number;

  @ApiPropertyOptional({ example: 12000 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  chargedWeightKg?: number;

  @ApiPropertyOptional({ example: 500000 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  invoiceValue?: number;

  @ApiPropertyOptional({ example: 25000 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  freightAmount?: number;

  @ApiPropertyOptional({ example: 1000 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  hamaliCharges?: number;

  @ApiPropertyOptional({ example: 500 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  otherCharges?: number;

  @ApiPropertyOptional({ example: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  gstAmount?: number;

  @ApiPropertyOptional({ enum: ['PAID', 'TOPAY', 'TBB'], default: 'TOPAY' })
  @IsIn(['PAID', 'TOPAY', 'TBB'])
  @IsOptional()
  paymentType?: string;

  @ApiPropertyOptional({ example: '1234-5678-9012' })
  @IsString()
  @IsOptional()
  ewayBillNumber?: string;
}
