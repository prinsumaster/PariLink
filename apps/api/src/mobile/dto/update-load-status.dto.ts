import { IsString, IsNotEmpty, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateLoadStatusDto {
  @ApiProperty({
    enum: ['PENDING', 'ASSIGNED', 'IN_TRANSIT', 'DELIVERED', 'CANCELLED'],
  })
  @IsString()
  @IsNotEmpty()
  @IsIn(['PENDING', 'ASSIGNED', 'IN_TRANSIT', 'DELIVERED', 'CANCELLED'])
  status!: string;
}
