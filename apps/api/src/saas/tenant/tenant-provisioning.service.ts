import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class TenantProvisioningService {
  private readonly logger = new Logger(TenantProvisioningService.name);

  constructor(private readonly prisma: PrismaService) {}

  async provisionDefaults(companyId: string) {
    this.logger.log(
      `Provisioning default roles and seed data for ${companyId}`,
    );

    await this.prisma.runAsSystem(async (tx) => {
      // Create default Admin role if it doesn't exist
      const existingAdmin = await tx.role.findFirst({
        where: { companyId, name: 'Admin' },
      });

      if (!existingAdmin) {
        await tx.role.create({
          data: {
            companyId,
            name: 'Admin',
            description: 'Full administrative access',
            permissions: ['*'],
          },
        });
      }

      // Create default Manager role
      const existingManager = await tx.role.findFirst({
        where: { companyId, name: 'Manager' },
      });

      if (!existingManager) {
        await tx.role.create({
          data: {
            companyId,
            name: 'Manager',
            description: 'Managerial access for operations',
            permissions: [
              'dispatch:read',
              'dispatch:write',
              'fleet:read',
              'driver:read',
            ],
          },
        });
      }
    });

    return { success: true };
  }
}
