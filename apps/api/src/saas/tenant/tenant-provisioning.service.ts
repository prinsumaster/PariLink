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

    await this.prisma.runAsTenant(companyId, async (tx) => {
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

      // Workshop Roles
      const workshopRoles = [
        { name: 'Workshop Gate', permissions: ['workshop:gate'] },
        { name: 'Workshop Mechanic', permissions: ['workshop:mechanic'] },
        { name: 'Workshop Supervisor', permissions: ['workshop:supervisor', 'workshop:gate'] },
        { name: 'Workshop Owner', permissions: ['workshop:owner', 'workshop:supervisor', 'workshop:mechanic', 'workshop:gate'] }
      ];

      for (const role of workshopRoles) {
        const existing = await tx.role.findFirst({
          where: { companyId, name: role.name },
        });
        if (!existing) {
          await tx.role.create({
            data: {
              companyId,
              name: role.name,
              description: `${role.name} access`,
              permissions: role.permissions,
            },
          });
        }
      }
    });

    return { success: true };
  }
}
