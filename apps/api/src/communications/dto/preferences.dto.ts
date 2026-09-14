import { IsObject, IsNotEmptyObject } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class CreatePreferencesDto {
  @ApiProperty()
  @IsObject()
  @IsNotEmptyObject()
  payload!: Record<string, any>;
}

export class UpdatePreferencesDto extends PartialType(CreatePreferencesDto) {}
