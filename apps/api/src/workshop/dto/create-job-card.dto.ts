import { IsString, IsOptional, IsNumber, IsNotEmpty, IsDateString, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateJobCardDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  vehicleId: string;

  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  workshopId: string;

  @ApiPropertyOptional()
  @IsUUID()
  @IsOptional()
  mechanicId?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  issueReported: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  status?: string;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  totalCost?: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  workDone?: string;

  @ApiPropertyOptional()
  @IsDateString()
  @IsOptional()
  closedAt?: Date;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  odometer?: number;

  @ApiPropertyOptional()
  @IsDateString()
  @IsOptional()
  openedAt?: Date;
}
