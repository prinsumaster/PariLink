import {
  IsString,
  IsOptional,
  IsObject,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class WebhookConfigDto {
  @IsString()
  url!: string;

  @IsArray()
  @IsString({ each: true })
  events!: string[];
}

export class InstallAppDto {
  @IsString()
  appId!: string;

  @IsString()
  @IsOptional()
  version?: string;

  @IsObject()
  @IsOptional()
  credentials?: Record<string, any>;

  @IsObject()
  @IsOptional()
  settings?: Record<string, any>;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WebhookConfigDto)
  @IsOptional()
  webhooks?: WebhookConfigDto[];
}
