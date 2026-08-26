import { IsString, IsNotEmpty, IsEmail, IsObject } from 'class-validator';

export class GenerateWebAuthnOptionsDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}

export class VerifyWebAuthnRegistrationDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsObject()
  @IsNotEmpty()
  response: Record<string, any>;
}

export class VerifyWebAuthnAuthDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsObject()
  @IsNotEmpty()
  response: Record<string, any>;

  @IsString()
  @IsNotEmpty()
  deviceFingerprint: string;
}
