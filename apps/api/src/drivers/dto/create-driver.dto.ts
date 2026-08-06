import {
  IsString,
  IsOptional,
  IsNotEmpty,
  IsUUID,
  IsIn,
  IsEmail,
  IsDateString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateDriverDto {
  @ApiPropertyOptional({ example: 'b567d2ca-1122-3344-5566-778899aabbcc' })
  @IsUUID()
  @IsOptional()
  companyId?: string;

  @ApiPropertyOptional()
  @IsUUID()
  @IsOptional()
  userId?: string;

  @ApiProperty({ example: 'John' })
  @IsString()
  @IsNotEmpty()
  firstName!: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  @IsNotEmpty()
  lastName!: string;

  @ApiPropertyOptional({ example: 'john.doe@example.com' })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ example: '+1234567890' })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional({ example: 'CDL123456789' })
  @IsString()
  @IsOptional()
  licenseNumber?: string;

  @ApiPropertyOptional({ example: 'TX' })
  @IsString()
  @IsOptional()
  licenseState?: string;

  @ApiPropertyOptional({ example: '2028-12-31' })
  @IsDateString()
  @IsOptional()
  licenseExpiry?: string;

  @ApiPropertyOptional({
    enum: ['AVAILABLE', 'ON_DUTY', 'OFF_DUTY', 'TERMINATED'],
    default: 'AVAILABLE',
  })
  @IsIn(['AVAILABLE', 'ON_DUTY', 'OFF_DUTY', 'TERMINATED'])
  @IsOptional()
  status?: string;
}
