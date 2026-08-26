import { IsObject, IsOptional, IsNotEmptyObject, IsString, IsBoolean, IsNumber } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class CreateGatewayDto {
  @ApiProperty()
  @IsObject()
  @IsNotEmptyObject()
  payload!: Record<string, any>;
}

export class UpdateGatewayDto extends PartialType(CreateGatewayDto) {}
