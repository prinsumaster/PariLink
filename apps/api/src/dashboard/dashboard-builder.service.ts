import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardBuilderService {
  constructor(private prisma: PrismaService) {}

  // Dashboards
  async createDashboard(companyId: string, data: any, userId: string) {
    return this.prisma.runAsTenant(companyId, async (tx) =>
      tx.analyticsDashboard.create({
        data: {
          companyId,
          name: data.name,
          description: data.description,
          roleAccess: data.roleAccess || [],
          isDefault: data.isDefault || false,
          layoutType: data.layoutType || 'GRID',
          createdBy: userId,
        },
      }),
    );
  }

  async listDashboards(companyId: string) {
    return this.prisma.runAsTenant(companyId, async (tx) =>
      tx.analyticsDashboard.findMany({
        where: { companyId },
        include: { widgets: true },
      }),
    );
  }

  async getDashboard(companyId: string, id: string) {
    const dashboard = await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.analyticsDashboard.findUnique({
        where: { id, companyId },
        include: { widgets: true },
      }),
    );
    if (!dashboard) throw new NotFoundException('Dashboard not found');
    return dashboard;
  }

  // Widgets
  async addWidget(companyId: string, dashboardId: string, data: any) {
    return this.prisma.runAsTenant(companyId, async (tx) =>
      tx.dashboardWidget.create({
        data: {
          companyId,
          dashboardId,
          title: data.title,
          type: data.type,
          dataSource: data.dataSource,
          config: data.config || {},
          position: data.position || { x: 0, y: 0, w: 4, h: 4 },
        },
      }),
    );
  }

  async updateWidgetLayout(
    companyId: string,
    dashboardId: string,
    layouts: any[], // [{ id, position }]
  ) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      const updates = layouts.map((l) =>
        tx.dashboardWidget.update({
          where: { id: l.id, dashboardId, companyId },
          data: { position: l.position },
        }),
      );
      return Promise.all(updates);
    });
  }

  async deleteWidget(companyId: string, dashboardId: string, id: string) {
    return this.prisma.runAsTenant(companyId, async (tx) =>
      tx.dashboardWidget.delete({
        where: { id, dashboardId, companyId },
      }),
    );
  }
}
