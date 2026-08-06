import { IsString, IsNotEmpty, IsArray, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateApiKeyDto {
  @ApiProperty() @IsString() @IsNotEmpty() name!: string;
  @ApiProperty() @IsArray() scopes!: string[];
}

export class CreateWebhookDto {
  @ApiProperty() @IsString() @IsNotEmpty() url!: string;
  @ApiProperty() @IsString() @IsNotEmpty() secret!: string;
  @ApiProperty() @IsArray() events!: string[];
}
