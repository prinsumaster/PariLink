import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, Max, Min, IsUUID } from 'class-validator';
import { ReviewRole } from '@prisma/client';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTripReviewDto {
  @ApiProperty({ enum: ReviewRole, description: 'The role of the reviewer' })
  @IsNotEmpty()
  @IsEnum(ReviewRole)
  reviewerRole: ReviewRole;

  @ApiProperty({ description: 'Rating from 1 to 5' })
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiPropertyOptional({ description: 'Optional comments about the trip' })
  @IsOptional()
  @IsString()
  comment?: string;
}
