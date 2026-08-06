import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WorkspaceService {
  constructor(private prisma: PrismaService) {}

  async getSnapshots(companyId: string, userId: string) {
    return this.prisma.runAsTenant(companyId, async (tx) =>
      tx.workspaceSnapshot.findMany({
        where: { companyId, userId },
        orderBy: { createdAt: 'desc' },
      }),
    );
  }

  async saveSnapshot(
    companyId: string,
    userId: string,
    data: {
      name: string;
      description?: string;
      state: any;
      isDefault?: boolean;
    },
  ) {
    if (data.isDefault) {
      await this.prisma.runAsTenant(companyId, async (tx) =>
        tx.workspaceSnapshot.updateMany({
          where: { companyId, userId, isDefault: true },
          data: { isDefault: false },
        }),
      );
    }

    return this.prisma.runAsTenant(companyId, async (tx) =>
      tx.workspaceSnapshot.create({
        data: {
          companyId,
          userId,
          name: data.name,
          description: data.description,
          state: data.state,
          isDefault: data.isDefault || false,
        },
      }),
    );
  }

  async getDefaultSnapshot(companyId: string, userId: string) {
    return this.prisma.runAsTenant(companyId, async (tx) =>
      tx.workspaceSnapshot.findFirst({
        where: { companyId, userId, isDefault: true },
      }),
    );
  }

  async deleteSnapshot(id: string, userId: string) {
    return this.prisma.runAsSystem(async (tx) =>
      tx.workspaceSnapshot.delete({
        where: { id, userId }, // Ensure user owns it
      }),
    );
  }

  // Preferences
  async updatePreferences(userId: string, preferences: any) {
    return this.prisma.runAsSystem(async (tx) =>
      tx.user.update({
        where: { id: userId },
        data: { preferences },
        select: { preferences: true },
      }),
    );
  }
}
