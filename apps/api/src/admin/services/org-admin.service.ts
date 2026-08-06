import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditService } from '../../platform/audit/audit.service';
import {
  CreateDepartmentDto,
  UpdateDepartmentDto,
  CreateTeamDto,
  UpdateTeamDto,
  CreateCostCenterDto,
  UpdateCostCenterDto,
} from '../dto/enterprise-admin.dto';

@Injectable()
export class OrgAdminService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  async getOrgOverview(companyId: string) {
    const [branches, warehouses, departments, teams, costCenters] =
      await Promise.all([
        this.prisma.runAsSystem(async (tx) =>
          tx.branch.findMany({ where: { companyId } }),
        ),
        this.prisma.runAsSystem(async (tx) =>
          tx.warehouse.findMany({ where: { companyId } }),
        ),
        this.prisma.runAsSystem(async (tx) =>
          tx.department.findMany({ where: { companyId } }),
        ),
        this.prisma.runAsSystem(async (tx) =>
          tx.team.findMany({ where: { companyId } }),
        ),
        this.prisma.runAsSystem(async (tx) =>
          tx.costCenter.findMany({ where: { companyId } }),
        ),
      ]);

    return {
      companyId,
      branches,
      warehouses,
      departments,
      teams,
      costCenters,
    };
  }

  async getDepartments(companyId: string) {
    return this.prisma.runAsSystem(async (tx) =>
      tx.department.findMany({
        where: { companyId },
        include: { _count: { select: { users: true, teams: true } } },
        orderBy: { name: 'asc' },
      }),
    );
  }

  async createDepartment(
    companyId: string,
    dto: CreateDepartmentDto,
    adminUserId: string,
  ) {
    const existing = await this.prisma.runAsSystem(async (tx) =>
      tx.department.findFirst({
        where: { companyId, name: dto.name },
      }),
    );
    if (existing)
      throw new ConflictException(
        `Department ${dto.name} already exists in tenant`,
      );

    const dept = await this.prisma.runAsSystem(async (tx) =>
      tx.department.create({
        data: {
          companyId,
          name: dto.name,
          code: dto.code,
          description: dto.description,
          managerId: dto.managerId,
        },
      }),
    );

    await this.audit.logEvent({
      action: 'admin:org:create_department',
      entity: 'Department',
      entityId: dept.id,
      userId: adminUserId,
      companyId,
      details: { department: dto },
    });

    return dept;
  }

  async updateDepartment(
    companyId: string,
    deptId: string,
    dto: UpdateDepartmentDto,
    adminUserId: string,
  ) {
    const existing = await this.prisma.runAsSystem(async (tx) =>
      tx.department.findFirst({
        where: { id: deptId, companyId },
      }),
    );
    if (!existing)
      throw new NotFoundException(`Department ${deptId} not found`);

    const updated = await this.prisma.runAsSystem(async (tx) =>
      tx.department.update({
        where: { id: deptId },
        data: dto,
      }),
    );

    await this.audit.logEvent({
      action: 'admin:org:update_department',
      entity: 'Department',
      entityId: deptId,
      userId: adminUserId,
      companyId,
      details: { dto },
    });

    return updated;
  }

  async deleteDepartment(
    companyId: string,
    deptId: string,
    adminUserId: string,
  ) {
    const existing = await this.prisma.runAsSystem(async (tx) =>
      tx.department.findFirst({
        where: { id: deptId, companyId },
      }),
    );
    if (!existing)
      throw new NotFoundException(`Department ${deptId} not found`);

    await this.prisma.runAsSystem(async (tx) =>
      tx.department.delete({ where: { id: deptId } }),
    );

    await this.audit.logEvent({
      action: 'admin:org:delete_department',
      entity: 'Department',
      entityId: deptId,
      userId: adminUserId,
      companyId,
      details: { name: existing.name },
    });

    return { success: true };
  }

  async getTeams(companyId: string, departmentId?: string) {
    const where: any = { companyId };
    if (departmentId) where.departmentId = departmentId;
    return this.prisma.runAsSystem(async (tx) =>
      tx.team.findMany({
        where,
        include: {
          department: { select: { id: true, name: true } },
          _count: { select: { users: true } },
        },
        orderBy: { name: 'asc' },
      }),
    );
  }

  async createTeam(companyId: string, dto: CreateTeamDto, adminUserId: string) {
    const existing = await this.prisma.runAsSystem(async (tx) =>
      tx.team.findFirst({
        where: { companyId, name: dto.name },
      }),
    );
    if (existing)
      throw new ConflictException(`Team ${dto.name} already exists in tenant`);

    const team = await this.prisma.runAsSystem(async (tx) =>
      tx.team.create({
        data: {
          companyId,
          name: dto.name,
          description: dto.description,
          departmentId: dto.departmentId,
          leadId: dto.leadId,
        },
      }),
    );

    await this.audit.logEvent({
      action: 'admin:org:create_team',
      entity: 'Team',
      entityId: team.id,
      userId: adminUserId,
      companyId,
      details: { team: dto },
    });

    return team;
  }

  async updateTeam(
    companyId: string,
    teamId: string,
    dto: UpdateTeamDto,
    adminUserId: string,
  ) {
    const existing = await this.prisma.runAsSystem(async (tx) =>
      tx.team.findFirst({
        where: { id: teamId, companyId },
      }),
    );
    if (!existing) throw new NotFoundException(`Team ${teamId} not found`);

    const updated = await this.prisma.runAsSystem(async (tx) =>
      tx.team.update({
        where: { id: teamId },
        data: dto,
      }),
    );

    await this.audit.logEvent({
      action: 'admin:org:update_team',
      entity: 'Team',
      entityId: teamId,
      userId: adminUserId,
      companyId,
      details: { dto },
    });

    return updated;
  }

  async deleteTeam(companyId: string, teamId: string, adminUserId: string) {
    const existing = await this.prisma.runAsSystem(async (tx) =>
      tx.team.findFirst({
        where: { id: teamId, companyId },
      }),
    );
    if (!existing) throw new NotFoundException(`Team ${teamId} not found`);

    await this.prisma.runAsSystem(async (tx) =>
      tx.team.delete({ where: { id: teamId } }),
    );

    await this.audit.logEvent({
      action: 'admin:org:delete_team',
      entity: 'Team',
      entityId: teamId,
      userId: adminUserId,
      companyId,
      details: { name: existing.name },
    });

    return { success: true };
  }

  async getCostCenters(companyId: string) {
    return this.prisma.runAsSystem(async (tx) =>
      tx.costCenter.findMany({
        where: { companyId },
        include: { _count: { select: { users: true } } },
        orderBy: { code: 'asc' },
      }),
    );
  }

  async createCostCenter(
    companyId: string,
    dto: CreateCostCenterDto,
    adminUserId: string,
  ) {
    const existing = await this.prisma.runAsSystem(async (tx) =>
      tx.costCenter.findFirst({
        where: { companyId, code: dto.code },
      }),
    );
    if (existing)
      throw new ConflictException(
        `Cost center with code ${dto.code} already exists`,
      );

    const cc = await this.prisma.runAsSystem(async (tx) =>
      tx.costCenter.create({
        data: {
          companyId,
          code: dto.code,
          name: dto.name,
          budget: dto.budget ?? 0,
          currency: dto.currency ?? 'USD',
        },
      }),
    );

    await this.audit.logEvent({
      action: 'admin:org:create_cost_center',
      entity: 'CostCenter',
      entityId: cc.id,
      userId: adminUserId,
      companyId,
      details: { costCenter: dto },
    });

    return cc;
  }

  async updateCostCenter(
    companyId: string,
    ccId: string,
    dto: UpdateCostCenterDto,
    adminUserId: string,
  ) {
    const existing = await this.prisma.runAsSystem(async (tx) =>
      tx.costCenter.findFirst({
        where: { id: ccId, companyId },
      }),
    );
    if (!existing) throw new NotFoundException(`Cost center ${ccId} not found`);

    const updated = await this.prisma.runAsSystem(async (tx) =>
      tx.costCenter.update({
        where: { id: ccId },
        data: dto,
      }),
    );

    await this.audit.logEvent({
      action: 'admin:org:update_cost_center',
      entity: 'CostCenter',
      entityId: ccId,
      userId: adminUserId,
      companyId,
      details: { dto },
    });

    return updated;
  }

  async deleteCostCenter(companyId: string, ccId: string, adminUserId: string) {
    const existing = await this.prisma.runAsSystem(async (tx) =>
      tx.costCenter.findFirst({
        where: { id: ccId, companyId },
      }),
    );
    if (!existing) throw new NotFoundException(`Cost center ${ccId} not found`);

    await this.prisma.runAsSystem(async (tx) =>
      tx.costCenter.delete({ where: { id: ccId } }),
    );

    await this.audit.logEvent({
      action: 'admin:org:delete_cost_center',
      entity: 'CostCenter',
      entityId: ccId,
      userId: adminUserId,
      companyId,
      details: { code: existing.code },
    });

    return { success: true };
  }
}
