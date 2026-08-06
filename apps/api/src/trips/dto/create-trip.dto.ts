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

export class CreateTripDto {
  @ApiPropertyOptional({ example: 'TRP-1001' })
  @IsString()
  @IsOptional()
  tripNumber?: string;

  @ApiPropertyOptional({ example: 'd123d2ca-1122-3344-5566-778899aabbcc' })
  @IsUUID()
  @IsOptional()
  driverId?: string;

  @ApiPropertyOptional({ example: 'v123d2ca-1122-3344-5566-778899aabbcc' })
  @IsUUID()
  @IsOptional()
  vehicleId?: string;

  @ApiPropertyOptional({ example: 'v456d2ca-1122-3344-5566-778899aabbcc' })
  @IsUUID()
  @IsOptional()
  trailerId?: string;

  @ApiPropertyOptional({
    enum: ['PLANNED', 'DISPATCHED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'],
    default: 'PLANNED',
  })
  @IsIn(['PLANNED', 'DISPATCHED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'])
  @IsOptional()
  status?: string;

  @ApiPropertyOptional({ example: '2028-12-01T10:00:00Z' })
  @IsDateString()
  @IsOptional()
  startDate?: string;

  @ApiPropertyOptional({ example: '2028-12-02T14:00:00Z' })
  @IsDateString()
  @IsOptional()
  endDate?: string;

  @ApiPropertyOptional({ example: '2028-12-02T12:00:00Z' })
  @IsDateString()
  @IsOptional()
  eta?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  startOdometer?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  endOdometer?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  estimatedDistance?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  actualDistance?: number;

  @ApiPropertyOptional()
  @IsOptional()
  route?: any;

  @ApiPropertyOptional()
  @IsOptional()
  checklists?: any;

  @ApiPropertyOptional()
  @IsOptional()
  timeline?: any;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  fuelExpenses?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  otherExpenses?: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  notes?: string;
}
