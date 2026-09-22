import { IsString, IsOptional, IsNumber, IsNotEmpty, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateJobPartDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  maintenanceJobId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  qty?: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  unitCost: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @ApiPropertyOptional()
  @IsUUID()
  @IsOptional()
  vendorId?: string;

  @ApiPropertyOptional()
  @IsUUID()
  @IsOptional()
  jobCardId?: string;

  @ApiPropertyOptional()
  @IsUUID()
  @IsOptional()
  partId?: string;
}
