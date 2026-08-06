import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RefreshDto {
  @ApiProperty({
    required: false,
    description: 'Client hardware fingerprint for device binding',
  })
  @IsString()
  @IsOptional()
  deviceFingerprint?: string;
}
