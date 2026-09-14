import { IsObject, IsNotEmptyObject } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class CreateWebhookDto {
  @ApiProperty()
  @IsObject()
  @IsNotEmptyObject()
  payload!: Record<string, any>;
}

export class UpdateWebhookDto extends PartialType(CreateWebhookDto) {}
