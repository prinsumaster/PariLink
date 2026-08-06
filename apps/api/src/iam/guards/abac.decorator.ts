import { SetMetadata } from '@nestjs/common';

export const ABAC_KEY = 'abac_attributes';
export const RequireAttributes = (attributes: Record<string, any>) =>
  SetMetadata(ABAC_KEY, attributes);
