import { IsString, IsNotEmpty, IsArray, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateWorkflowRuleDto {
  @ApiProperty() @IsString() @IsNotEmpty() name!: string;
  @ApiProperty() @IsString() @IsNotEmpty() entityType!: string;
  @ApiProperty() @IsString() @IsNotEmpty() trigger!: string;
  @ApiProperty() @IsOptional() conditions!: any;
  @ApiProperty() @IsArray() actions!: any[];
  @ApiProperty() @IsOptional() priority?: number;
}

export class EvaluateWorkflowDto {
  @ApiProperty() @IsString() @IsNotEmpty() entityType!: string;
  @ApiProperty() @IsString() @IsNotEmpty() trigger!: string;
  @ApiProperty() entityData!: Record<string, any>;
}

export class UpdateWorkflowRuleDto {
  @ApiProperty({ required: false }) @IsString() @IsOptional() name?: string;
  @ApiProperty({ required: false }) @IsString() @IsOptional() trigger?: string;
  @ApiProperty({ required: false }) @IsOptional() conditions?: any;
  @ApiProperty({ required: false }) @IsArray() @IsOptional() actions?: any[];
  @ApiProperty({ required: false }) @IsOptional() priority?: number;
}

export class SimulateRuleDto {
  @ApiProperty() @IsOptional() ruleDefinition?: CreateWorkflowRuleDto;
  @ApiProperty() @IsString() @IsOptional() ruleId?: string;
  @ApiProperty() entityData!: Record<string, any>;
}

export class ImportRulesDto {
  @ApiProperty() @IsArray() rules!: CreateWorkflowRuleDto[];
}
