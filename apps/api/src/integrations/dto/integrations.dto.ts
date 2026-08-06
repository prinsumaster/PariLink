import {
  IsString,
  IsNotEmpty,
  IsObject,
  IsBoolean,
  IsOptional,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ConfigureIntegrationDto {
  @ApiProperty() @IsString() @IsNotEmpty() provider!: string;
  @ApiProperty() @IsObject() credentials!: Record<string, any>;
  @ApiPropertyOptional() @IsObject() @IsOptional() settings?: Record<
    string,
    any
  >;
  @ApiProperty() @IsBoolean() isActive!: boolean;
}

export class SyncIntegrationDto {
  @ApiProperty() @IsString() @IsNotEmpty() entityType!: string;
  @ApiProperty() @IsString() @IsNotEmpty() entityId!: string;
}
