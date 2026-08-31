import { IsString, IsNotEmpty, IsIn, IsOptional, MaxLength } from 'class-validator';

export class SubmitFeedbackDto {
  @IsString()
  @IsNotEmpty()
  interactionId: string;

  // Was typed `1 | 2 | 3 | 4 | 5` in the controller signature before, but a
  // TS union type is compile-time only -- nothing at runtime rejected e.g.
  // rating: 99. @IsIn enforces it for real.
  @IsIn([1, 2, 3, 4, 5])
  rating: number;

  @IsString()
  @IsOptional()
  @MaxLength(2000)
  comment?: string;
}
