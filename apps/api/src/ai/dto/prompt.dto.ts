import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

// Shared by workflow/generate and recommend/:domain/:id -- both endpoints
// take nothing but a free-text prompt for the LLM.
export class PromptDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(4000)
  prompt: string;
}
