import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsOptional,
  MinLength,
  IsBoolean,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'admin@parilink.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  @IsNotEmpty()
  password!: string;

  @ApiProperty({ example: '123456', required: false })
  @IsString()
  @IsOptional()
  mfaToken?: string;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  trustDevice?: boolean;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  deviceIdentifier?: string;

  @ApiProperty({
    required: false,
    description: 'Hardware fingerprint for refresh token binding',
  })
  @IsString()
  @IsOptional()
  deviceFingerprint?: string;
}
