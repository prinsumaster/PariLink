import { IsString, IsNotEmpty, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSupportTicketDto {
  @ApiProperty() @IsString() @IsNotEmpty() subject!: string;
  @ApiProperty() @IsString() @IsNotEmpty() description!: string;
  @ApiProperty() @IsString() @IsNotEmpty() priority!: string;
}

export class CreateLeaveRequestDto {
  @ApiProperty() @IsDateString() startDate!: string;
  @ApiProperty() @IsDateString() endDate!: string;
  @ApiProperty() @IsString() @IsNotEmpty() reason!: string;
}
