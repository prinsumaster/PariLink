import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class RejectWorkflowStepDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  reason: string;
}
