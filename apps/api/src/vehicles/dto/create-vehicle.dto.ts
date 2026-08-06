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

  @ApiPropertyOptional({ example: 'Freightliner' })
  @IsString()
  @IsOptional()
  make?: string;

  @ApiPropertyOptional({ example: 'Cascadia' })
  @IsString()
  @IsOptional()
  model?: string;

  @ApiPropertyOptional({ example: 2022 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  year?: number;

  @ApiPropertyOptional({ example: 'TX-123456' })
  @IsString()
  @IsOptional()
  licensePlate?: string;

  @ApiPropertyOptional({ example: '1FUJGHDBXKL123456' })
  @IsString()
  @IsOptional()
  vin?: string;

  @ApiPropertyOptional({ enum: ['TRUCK', 'TRAILER', 'VAN'], default: 'TRUCK' })
  @IsIn(['TRUCK', 'TRAILER', 'VAN'])
  @IsOptional()
  type?: string;

  @ApiPropertyOptional({
    enum: ['IN_SERVICE', 'MAINTENANCE', 'OUT_OF_SERVICE'],
    default: 'IN_SERVICE',
  })
  @IsIn(['IN_SERVICE', 'MAINTENANCE', 'OUT_OF_SERVICE'])
  @IsOptional()
  status?: string;

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
