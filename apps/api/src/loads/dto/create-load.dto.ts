import {
  IsString,
  IsOptional,
  IsNotEmpty,
  IsUUID,
  IsIn,
  IsDateString,
  IsNumber,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateLoadDto {
  @ApiProperty({ example: 'c123d2ca-1122-3344-5566-778899aabbcc' })
  @IsUUID()
  @IsNotEmpty()
  customerId!: string;

  @ApiPropertyOptional({ example: 'LD-10045' })
  @IsString()
  @IsOptional()
  referenceNumber?: string;

  @ApiPropertyOptional({ example: 'Acme Corp' })
  @IsString()
  @IsOptional()
  consignor?: string;

  @ApiPropertyOptional({ example: 'Globex Inc' })
  @IsString()
  @IsOptional()
  consignee?: string;

  @ApiProperty({ example: '123 Origin St' })
  @IsString()
  @IsNotEmpty()
  originAddress!: string;

  @ApiProperty({ example: 'Dallas' })
  @IsString()
  @IsNotEmpty()
  originCity!: string;

  @ApiProperty({ example: 'TX' })
  @IsString()
  @IsNotEmpty()
  originState!: string;

  @ApiProperty({ example: '456 Dest Ave' })
  @IsString()
  @IsNotEmpty()
  destinationAddress!: string;

  @ApiProperty({ example: 'Austin' })
  @IsString()
  @IsNotEmpty()
  destinationCity!: string;

  @ApiProperty({ example: 'TX' })
  @IsString()
  @IsNotEmpty()
  destinationState!: string;

  @ApiPropertyOptional({ example: '2028-12-01T10:00:00Z' })
  @IsDateString()
  @IsOptional()
  pickupDate?: string;

  @ApiPropertyOptional({ example: '2028-12-02T14:00:00Z' })
  @IsDateString()
  @IsOptional()
  deliveryDate?: string;

  @ApiPropertyOptional({ example: 42000 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  weight?: number;

  @ApiPropertyOptional({ example: 3500 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  volume?: number;

  @ApiPropertyOptional({
    enum: ['DRY_VAN', 'REEFER', 'FLATBED'],
    default: 'DRY_VAN',
  })
  @IsIn(['DRY_VAN', 'REEFER', 'FLATBED'])
  @IsOptional()
  equipmentType?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  vehicleRequirement?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  trailerRequirement?: string;

  @ApiPropertyOptional({
    enum: ['PENDING', 'ASSIGNED', 'IN_TRANSIT', 'DELIVERED', 'CANCELLED'],
    default: 'PENDING',
  })
  @IsIn(['PENDING', 'ASSIGNED', 'IN_TRANSIT', 'DELIVERED', 'CANCELLED'])
  @IsOptional()
  status?: string;

  @ApiProperty({ example: 1500.5 })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  rate!: number;

  @ApiPropertyOptional({ example: 1200.0 })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @IsOptional()
  cost?: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  notes?: string;
}
