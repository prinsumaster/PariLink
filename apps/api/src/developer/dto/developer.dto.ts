import {
  IsString,
  IsOptional,
  IsArray,
  IsUrl,
  IsEnum,
  IsBoolean,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateDeveloperAppDto {
  @ApiProperty({ example: 'My Integration App' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ example: 'Fetches load data for logistics' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ example: 'https://myapp.com' })
  @IsUrl()
  @IsOptional()
  websiteUrl?: string;

  @ApiPropertyOptional({ example: 'DEVELOPMENT' })
  @IsString()
  @IsOptional()
  environment?: string;

  @ApiPropertyOptional({
    type: [String],
    example: ['read:loads', 'write:loads'],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  scopes?: string[];

  @ApiPropertyOptional({
    type: [String],
    example: ['https://myapp.com/callback'],
  })
  @IsArray()
  @IsUrl({}, { each: true })
  @IsOptional()
  redirectUris?: string[];

  @ApiPropertyOptional({ example: 'https://myapp.com/webhook' })
  @IsUrl()
  @IsOptional()
  webhookUrl?: string;
}

export class UpdateDeveloperAppDto {
  @ApiPropertyOptional({ example: 'My Integration App' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ example: 'Fetches load data for logistics' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ example: 'https://myapp.com' })
  @IsUrl()
  @IsOptional()
  websiteUrl?: string;

  @ApiPropertyOptional({
    type: [String],
    example: ['read:loads', 'write:loads'],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  scopes?: string[];

  @ApiPropertyOptional({
    type: [String],
    example: ['https://myapp.com/callback'],
  })
  @IsArray()
  @IsUrl({}, { each: true })
  @IsOptional()
  redirectUris?: string[];

  @ApiPropertyOptional({ example: 'https://myapp.com/webhook' })
  @IsUrl()
  @IsOptional()
  webhookUrl?: string;
}
