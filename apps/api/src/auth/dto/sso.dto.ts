import { IsObject, IsNotEmptyObject } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class CreateSsoDto {
  @ApiProperty()
  @IsObject()
  @IsNotEmptyObject()
  payload!: Record<string, any>;
}

export class UpdateSsoDto extends PartialType(CreateSsoDto) {}
