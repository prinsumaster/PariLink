import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { EventStoreService } from '../digital-twin/event-store.service';

export interface FormSchema {
  id: string;
  version: number;
  fields: Array<{
    name: string;
    type: 'TEXT' | 'NUMBER' | 'DATE' | 'FILE' | 'SIGNATURE';
    required: boolean;
    validationRegex?: string;
  }>;
}

@Injectable()
export class FormEngine {
  private readonly logger = new Logger(FormEngine.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly eventStore: EventStoreService,
  ) {}

  /**
   * Validates dynamic form submission against its versioned schema.
   */
  async submitForm(
    companyId: string,
    schemaId: string,
    payload: any,
    userId: string,
  ) {
    this.logger.log(`Validating Form ${schemaId} submission by ${userId}`);

    const schema = this.mockSchemaLookup(schemaId);
    if (!schema) throw new BadRequestException('Form Schema not found');

    // 1. Dynamic Validation
    for (const field of schema.fields) {
      const val = payload[field.name];
      if (field.required && (val === undefined || val === null || val === '')) {
        throw new BadRequestException(`Field ${field.name} is required`);
      }
      if (val && field.validationRegex) {
        const regex = new RegExp(field.validationRegex);
        if (!regex.test(val)) {
          throw new BadRequestException(
            `Field ${field.name} failed validation`,
          );
        }
      }
      if (field.type === 'SIGNATURE' && !val) {
        // Enforce digital signature compliance
        throw new BadRequestException(
          `Digital signature missing for ${field.name}`,
        );
      }
    }

    // 2. Persist Form Data Immutaably
    const submissionId = `FORM-SUB-${Date.now()}`;
    await this.eventStore.append({
      tenantId: companyId,
      streamId: submissionId,
      streamType: 'FORM_SUBMISSION',
      eventType: 'FormSubmitted',
      payload: { schemaId, version: schema.version, data: payload },
      userId,
    });

    return { submissionId, status: 'VALIDATED' };
  }

  // --- Mocks ---
  private mockSchemaLookup(schemaId: string): FormSchema {
    return {
      id: schemaId,
      version: 1,
      fields: [
        { name: 'approvalNotes', type: 'TEXT', required: true },
        { name: 'managerSignature', type: 'SIGNATURE', required: true },
      ],
    };
  }
}
