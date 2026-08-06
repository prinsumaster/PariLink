import {
  IsString,
  IsOptional,
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsUUID,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'b567d2ca-1122-3344-5566-778899aabbcc' })
  @IsUUID()
  @IsOptional()
  companyId?: string;

  @ApiProperty({ example: 'driver@parilink.com' })
  @IsEmail()
  @IsOptional()
  email!: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  @MinLength(8)
  @IsOptional()
  password!: string;

  @ApiProperty({ example: 'John' })
  @IsString()
  @IsOptional()
  firstName!: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  @IsOptional()
  lastName!: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  avatar?: string;

  @ApiPropertyOptional()
  @IsUUID()
  @IsOptional()
  roleId?: string;

  @ApiPropertyOptional({
    enum: ['ACTIVE', 'INACTIVE', 'SUSPENDED'],
    default: 'ACTIVE',
  })
  @IsIn(['ACTIVE', 'INACTIVE', 'SUSPENDED'])
  @IsOptional()
  status?: string;
}
