import { IsString, IsNumber, IsOptional, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SubmitFactoringDto {
  @ApiProperty()
  @IsString()
  customerId!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  loadId?: string;

  @ApiProperty()
  @IsString()
  invoiceNumber!: string;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  amount!: number;

  @ApiProperty()
  @IsString()
  bolFileUrl!: string;

  @ApiProperty()
  @IsString()
  bolFileName!: string;
}
