import {
  IsString,
  IsEmail,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'Acme Logistics' })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  companyName: string;

  @ApiProperty({ example: 'admin@acmelogistics.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Password123!' })
  @IsString()
  @MinLength(8)
  @MaxLength(100)
  password: string;
}
