import {
  IsString,
  IsOptional,
  IsNotEmpty,
  IsUUID,
  IsArray,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateRoleDto {
  @ApiProperty({ example: 'b567d2ca-1122-3344-5566-778899aabbcc' })
  @IsUUID()
  @IsOptional()
  companyId?: string;

  @ApiProperty({ example: 'Senior Dispatcher' })
  @IsString()
  @IsOptional()
  name!: string;

  @ApiPropertyOptional({ example: 'Can manage all dispatch boards' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    type: [String],
    example: ['DISPATCH:VIEW', 'DISPATCH:CREATE'],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  permissions?: string[];
}
