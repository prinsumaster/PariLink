import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ShareLorryReceiptDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  driverId!: string;
}
