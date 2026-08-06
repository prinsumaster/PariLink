const fs = require('fs');
const path = require('path');

const modules = [
  {
    module: 'crm',
    models: [
      { name: 'CrmLead', lower: 'crmLead', route: 'crm/leads', serviceName: 'CrmLeadService', controllerName: 'CrmLeadController' }
    ]
  },
  {
    module: 'gst',
    models: [
      { name: 'GstTaxRule', lower: 'gstTaxRule', route: 'gst/rules', serviceName: 'GstEngineService', controllerName: 'GstRuleController' }
    ]
  },
  {
    module: 'fastag',
    models: [
      { name: 'TollAccount', lower: 'tollAccount', route: 'fastag/accounts', serviceName: 'FastagWalletService', controllerName: 'FastagWalletController' }
    ]
  },
  {
    module: 'finance/bank-reconciliation',
    models: [
      { name: 'BankStatement', lower: 'bankStatement', route: 'finance/bank-statements', serviceName: 'BankSyncService', controllerName: 'BankStatementController' }
    ]
  },
  {
    module: 'vehicles/permits',
    models: [
      { name: 'VehiclePermit', lower: 'vehiclePermit', route: 'vehicles/permits', serviceName: 'PermitComplianceService', controllerName: 'PermitController' }
    ]
  },
  {
    module: 'finance/payroll',
    models: [
      { name: 'PayrollRun', lower: 'payrollRun', route: 'finance/payroll', serviceName: 'PayrollEngineService', controllerName: 'PayrollController' }
    ]
  },
  {
    module: 'drivers/attendance',
    models: [
      { name: 'DriverAttendance', lower: 'driverAttendance', route: 'drivers/attendance', serviceName: 'AttendanceTrackingService', controllerName: 'AttendanceController' }
    ]
  }
];

const dtosTpl = (model) => `
import { IsOptional, IsString, IsNumber, IsBoolean, IsDateString, IsEnum } from 'class-validator';

export class Create${model.name}Dto {
  @IsOptional() @IsString() id?: string;
  @IsOptional() @IsString() status?: string;
}

export class Update${model.name}Dto {
  @IsOptional() @IsString() status?: string;
  @IsOptional() @IsString() description?: string;
}

export class Query${model.name}Dto {
  @IsOptional() @IsString() status?: string;
  @IsOptional() @IsString() search?: string;
  @IsOptional() @IsString() skip?: string;
  @IsOptional() @IsString() take?: string;
}
`;

const serviceTpl = (model) => `
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class ${model.serviceName} {
  constructor(private readonly prisma: PrismaService) {}

  async create(companyId: string, userId: string, data: any) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      return tx.${model.lower}.create({
        data: { ...data, companyId }
      });
    });
  }

  async findAll(companyId: string, query: any) {
    const take = query.take ? parseInt(query.take, 10) : 50;
    const skip = query.skip ? parseInt(query.skip, 10) : 0;
    const where: any = { companyId };
    
    if (query.status) {
      where.status = query.status;
    }

    return this.prisma.runAsTenant(companyId, async (tx) => {
      const [items, total] = await Promise.all([
        tx.${model.lower}.findMany({ where, skip, take, orderBy: { createdAt: 'desc' } }),
        tx.${model.lower}.count({ where })
      ]);
      return { data: items, meta: { total, skip, take } };
    });
  }

  async findOne(companyId: string, id: string) {
    const item = await this.prisma.runAsTenant(companyId, async (tx) => {
      return tx.${model.lower}.findUnique({ where: { id } });
    });
    if (!item || item.companyId !== companyId) {
      throw new NotFoundException('${model.name} not found');
    }
    return item;
  }

  async update(companyId: string, id: string, userId: string, data: any) {
    await this.findOne(companyId, id); // verify access
    return this.prisma.runAsTenant(companyId, async (tx) => {
      return tx.${model.lower}.update({
        where: { id },
        data
      });
    });
  }

  async remove(companyId: string, id: string, userId: string) {
    await this.findOne(companyId, id);
    return this.prisma.runAsTenant(companyId, async (tx) => {
      return tx.${model.lower}.delete({
        where: { id }
      });
    });
  }
}
`;

const controllerTpl = (model) => `
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Query } from '@nestjs/common';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { ${model.serviceName} } from '../services/${model.lower.replace(/([A-Z])/g, '-$1').toLowerCase()}/${model.lower.replace(/([A-Z])/g, '-$1').toLowerCase()}.service';

@Controller('${model.route}')
@UseGuards(JwtAuthGuard)
export class ${model.controllerName} {
  constructor(private readonly service: ${model.serviceName}) {}

  @Post()
  create(@Req() req: any, @Body() data: any) {
    return this.service.create(req.user.companyId, req.user.id, data);
  }

  @Get()
  findAll(@Req() req: any, @Query() query: any) {
    return this.service.findAll(req.user.companyId, query);
  }

  @Get(':id')
  findOne(@Req() req: any, @Param('id') id: string) {
    return this.service.findOne(req.user.companyId, id);
  }

  @Patch(':id')
  update(@Req() req: any, @Param('id') id: string, @Body() data: any) {
    return this.service.update(req.user.companyId, id, req.user.id, data);
  }

  @Delete(':id')
  remove(@Req() req: any, @Param('id') id: string) {
    return this.service.remove(req.user.companyId, id, req.user.id);
  }
}
`;

modules.forEach(mod => {
  mod.models.forEach(model => {
    const basePath = path.join('/Users/vishalvirda/Desktop/PariLink/apps/api/src', mod.module);
    
    const dtoPath = path.join(basePath, 'dto');
    if (!fs.existsSync(dtoPath)) fs.mkdirSync(dtoPath, { recursive: true });
    fs.writeFileSync(path.join(dtoPath, model.lower + '.dto.ts'), dtosTpl(model));

    const serviceKebab = model.serviceName.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase().replace('-service', '');
    const serviceDir = path.join(basePath, 'services', serviceKebab);
    if (!fs.existsSync(serviceDir)) fs.mkdirSync(serviceDir, { recursive: true });
    
    let srvFileName = serviceKebab + '.service.ts';
    
    const srvFiles = fs.existsSync(path.join(basePath, 'services')) ? fs.readdirSync(path.join(basePath, 'services')) : [];
    let actualSrvDir = serviceDir;
    srvFiles.forEach(f => {
      if (fs.statSync(path.join(basePath, 'services', f)).isDirectory()) {
         if (model.serviceName.toLowerCase().includes(f.replace(/-/g, ''))) {
            actualSrvDir = path.join(basePath, 'services', f);
            srvFileName = f + '.service.ts';
         }
      }
    });

    let srvContent = serviceTpl(model);
    const depth = mod.module.split('/').length + 1;
    const prismaPath = '../'.repeat(depth) + 'prisma/prisma.service';
    srvContent = srvContent.replace('../../../prisma/prisma.service', prismaPath);
    
    fs.writeFileSync(path.join(actualSrvDir, srvFileName), srvContent);

    const controllerKebab = model.controllerName.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase().replace('-controller', '');
    let actualCtrlDir = path.join(basePath, 'controllers', controllerKebab);
    let ctrlFileName = controllerKebab + '.controller.ts';
    if (!fs.existsSync(actualCtrlDir)) fs.mkdirSync(actualCtrlDir, { recursive: true });

    const ctrlFiles = fs.existsSync(path.join(basePath, 'controllers')) ? fs.readdirSync(path.join(basePath, 'controllers')) : [];
    ctrlFiles.forEach(f => {
      if (fs.statSync(path.join(basePath, 'controllers', f)).isDirectory()) {
         if (model.controllerName.toLowerCase().includes(f.replace(/-/g, ''))) {
            actualCtrlDir = path.join(basePath, 'controllers', f);
            ctrlFileName = f + '.controller.ts';
         }
      }
    });

    let ctrlContent = controllerTpl(model);
    const authPath = '../'.repeat(depth) + 'auth/guards/jwt-auth.guard';
    ctrlContent = ctrlContent.replace('../../../auth/guards/jwt-auth.guard', authPath);
    
    const relServicePath = path.relative(actualCtrlDir, path.join(actualSrvDir, srvFileName.replace('.ts', ''))).replace(/\\/g, '/');
    ctrlContent = ctrlContent.replace(/from '\.\.\/services.*'/, "from '" + relServicePath + "'");
    
    fs.writeFileSync(path.join(actualCtrlDir, ctrlFileName), ctrlContent);
  });
});

console.log('Implementations generated successfully!');
