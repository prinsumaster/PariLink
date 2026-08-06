import { IsString, IsOptional, IsArray, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateApiKeyDto {
  @ApiProperty({ description: 'Name of the API key' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'List of granted scopes', required: false })
  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  scopes?: string[];

  @ApiProperty({
    description: 'Environment (e.g., sandbox, production)',
    required: false,
  })
  @IsString()
  @IsOptional()
  environment?: string;

  @ApiProperty({
    description: 'Optional user ID if this is a per-user key',
    required: false,
  })
  @IsString()
  @IsOptional()
  userId?: string;

  @ApiProperty({
    description: 'Number of days until the key expires',
    required: false,
  })
  @IsNumber()
  @IsOptional()
  expiresInDays?: number;
}

export class CreateOAuthClientDto {
  @ApiProperty({ description: 'Name of the OAuth Client' })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Description of the OAuth Client',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'List of granted scopes', required: false })
  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  scopes?: string[];
}

export class CreatePatDto {
  @ApiProperty({ description: 'Name of the Personal Access Token' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'List of granted scopes', required: false })
  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  scopes?: string[];

  @ApiProperty({
    description: 'Number of days until the token expires',
    required: false,
  })
  @IsNumber()
  @IsOptional()
  expiresInDays?: number;
}
