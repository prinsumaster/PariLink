import { IsString, IsNotEmpty, IsDefined } from 'class-validator';

export class SetWorkspaceMemoryDto {
  @IsString()
  @IsNotEmpty()
  key: string;

  // Genuinely arbitrary JSON value by design (memory.service.ts's setMemory
  // takes `value: any`) -- only required that it's present at all.
  @IsDefined()
  value: unknown;
}
