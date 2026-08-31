import { IsString, IsNotEmpty } from 'class-validator';
export class CreateCopilotSessionDto {
  @IsString()
  @IsNotEmpty()
  context: string;
}
export class CopilotChatDto {
  @IsString()
  @IsNotEmpty()
  message: string;
}
