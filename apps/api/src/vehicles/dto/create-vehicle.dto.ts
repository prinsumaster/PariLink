import {
  IsString,
  IsOptional,
  IsNotEmpty,
  IsUUID,
  IsIn,
  IsNumber,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateVehicleDto {
  @ApiProperty({ example: 'b567d2ca-1122-3344-5566-778899aabbcc' })
  @IsUUID()
  @IsOptional()
  companyId?: string;

  @ApiProperty({ example: 'Freightliner' })
  @IsString()
  @IsNotEmpty()
  make!: string;

  @ApiProperty({ example: 'Cascadia' })
  @IsString()
  @IsNotEmpty()
  model!: string;

  @ApiPropertyOptional({ example: 2022 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  year?: number;

  @ApiProperty({ example: 'TX-123456' })
  @IsString()
  @IsNotEmpty()
  licensePlate!: string;

  @ApiPropertyOptional({ example: '1FUJGHDBXKL123456' })
  @IsString()
  @IsOptional()
  vin?: string;

  @ApiProperty({ enum: ['TRUCK', 'TRAILER', 'VAN'], default: 'TRUCK' })
  @IsIn(['TRUCK', 'TRAILER', 'VAN'])
  @IsNotEmpty()
  type!: string;

  @ApiProperty({
    enum: ['IN_SERVICE', 'MAINTENANCE', 'OUT_OF_SERVICE'],
    default: 'IN_SERVICE',
  })
  @IsIn(['IN_SERVICE', 'MAINTENANCE', 'OUT_OF_SERVICE'])
  @IsNotEmpty()
  status!: string;

  @ApiPropertyOptional({ example: 40000 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  capacityWeight?: number;

  @ApiPropertyOptional({ example: 3000 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  capacityVolume?: number;
}
