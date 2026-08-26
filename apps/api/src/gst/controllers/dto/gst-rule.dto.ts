import { IsObject, IsOptional, IsNotEmptyObject, IsString, IsBoolean, IsNumber } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class CreateGstRuleDto {
  @ApiProperty()
  @IsObject()
  @IsNotEmptyObject()
  payload!: Record<string, any>;
}

export class UpdateGstRuleDto extends PartialType(CreateGstRuleDto) {}
