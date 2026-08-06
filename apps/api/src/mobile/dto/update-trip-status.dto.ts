import { IsString, IsNotEmpty, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateTripStatusDto {
  @ApiProperty({
    enum: ['PLANNED', 'DISPATCHED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'],
  })
  @IsString()
  @IsNotEmpty()
  @IsIn(['PLANNED', 'DISPATCHED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'])
  status!: string;
}
