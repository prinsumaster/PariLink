import { NotFoundException } from '@nestjs/common';

export async function assertTenantOwned(
  tx: any,
  modelName: string,
  id: string,
  companyId: string,
  notFoundMessage?: string,
) {
  const record = await tx[modelName].findFirst({
    where: { id, companyId },
  });
  if (!record) {
    throw new NotFoundException(notFoundMessage || `${modelName} not found in tenant`);
  }
  return record;
}
