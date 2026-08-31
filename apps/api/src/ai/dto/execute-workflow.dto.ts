import { IsString, IsNotEmpty, IsObject, IsOptional } from 'class-validator';

export class ExecuteWorkflowDto {
  @IsString()
  @IsNotEmpty()
  workflowName: string;

  // Workflow-specific payload — shape varies per named workflow, so it isn't
  // narrowed further here. The point of this DTO is that `workflowName` is
  // now validated and unexpected top-level properties are rejected
  // (whitelist + forbidNonWhitelisted), where before neither field went
  // through the ValidationPipe at all.
  @IsObject()
  @IsOptional()
  input?: Record<string, unknown>;
}
