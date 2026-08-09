import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsBoolean,
} from 'class-validator';

export class EnvironmentVariables {
  @IsString()
  @IsNotEmpty()
  NODE_ENV!: string;

  @IsString()
  @IsNotEmpty()
  DATABASE_URL!: string;

  @IsString()
  @IsNotEmpty()
  REDIS_URL!: string;

  @IsString()
  @IsNotEmpty()
  JWT_SECRET!: string;

  @IsString()
  @IsNotEmpty()
  COOKIE_SECRET!: string;

  @IsString()
  @IsNotEmpty()
  MASTER_ENCRYPTION_KEY_V1!: string;

  @IsString()
  @IsNotEmpty()
  CORS_ALLOWED_ORIGINS!: string;
}
