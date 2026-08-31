import { IsString, IsOptional, MaxLength } from 'class-validator';

// This file pre-existed with `title: string` (required, @IsNotEmpty). The
// live endpoint (`POST ai/copilot/sessions`) has always taken `title` as
// optional (`@Body('title') title?: string`), so wiring the old version in
// as-is would have 400'd every session creation that didn't pass a title --
// same shape of bug as remove-tyre.dto.ts in the previous pass. Corrected
// to match actual behavior.
export class CreateSessionDto {
  @IsString()
  @IsOptional()
  @MaxLength(200)
  title?: string;
}
