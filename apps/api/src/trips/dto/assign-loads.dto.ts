import { IsArray, IsUUID, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AssignLoadsDto {
  @ApiProperty({
    type: [String],
    example: ['b567d2ca-1122-3344-5566-778899aabbcc'],
  })
  @IsArray()
  @IsUUID(4, { each: true })
  @IsNotEmpty()
  loadIds!: string[];
}
