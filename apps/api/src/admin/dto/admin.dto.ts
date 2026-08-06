import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsObject,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTenantDto {
  @ApiProperty() @IsString() @IsNotEmpty() name!: string;
  @ApiProperty() @IsString() @IsNotEmpty() adminEmail!: string;
  @ApiProperty() @IsString() @IsNotEmpty() adminPassword!: string;
  @ApiProperty() @IsString() @IsNotEmpty() adminFirstName!: string;
  @ApiProperty() @IsString() @IsNotEmpty() adminLastName!: string;
  @ApiPropertyOptional() @IsString() @IsOptional() subscriptionPlanId?: string;
}

export class CreateSubscriptionPlanDto {
  @ApiProperty() @IsString() @IsNotEmpty() name!: string;
  @ApiPropertyOptional() @IsString() @IsOptional() description?: string;
  @ApiProperty() @IsNumber() price!: number;
  @ApiPropertyOptional() @IsString() @IsOptional() currency?: string;
  @ApiPropertyOptional() @IsObject() @IsOptional() features?: Record<
    string,
    any
  >;
}

export class UpdateTenantConfigDto {
  @ApiPropertyOptional() @IsObject() @IsOptional() settings?: Record<
    string,
    any
  >;
  @ApiPropertyOptional() @IsObject() @IsOptional() theme?: Record<string, any>;
  @ApiPropertyOptional() @IsObject() @IsOptional() policies?: Record<
    string,
    any
  >;
}
