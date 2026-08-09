import type { AuthenticatedUser } from '../auth/decorators/get-user.decorator';
import { GetUser } from '../auth/decorators/get-user.decorator';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { CompanyQueryDto } from './dto/company-query.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('companies')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Post()
  @RequirePermissions('companies:create')
  @ApiOperation({ summary: 'Create a new company' })
  create(
    @GetUser() user: AuthenticatedUser,
    @Body() createCompanyDto: CreateCompanyDto,
  ) {
    return this.companiesService.create(createCompanyDto, user.id);
  }

  @Get()
  @RequirePermissions('companies:read')
  @ApiOperation({ summary: 'List companies with pagination and search' })
  findAll(@GetUser() user: AuthenticatedUser, @Query() query: CompanyQueryDto) {
    return this.companiesService.findAll(query, user.companyId);
  }

  @Get(':id')
  @RequirePermissions('companies:read')
  @ApiOperation({ summary: 'Get a company by ID' })
  findOne(@GetUser() user: AuthenticatedUser, @Param('id') id: string) {
    // In a multi-tenant system, users can only access their own company
    if (id !== user.companyId) {
      throw new Error('Unauthorized cross-tenant access');
    }
    return this.companiesService.findOne(id);
  }

  @Patch(':id')
  @RequirePermissions('companies:update')
  @ApiOperation({ summary: 'Update a company' })
  update(
    @GetUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() updateCompanyDto: UpdateCompanyDto,
  ) {
    if (id !== user.companyId) {
      throw new Error('Unauthorized cross-tenant access');
    }
    return this.companiesService.update(id, updateCompanyDto, user.id);
  }

  @Delete(':id')
  @RequirePermissions('companies:delete')
  @ApiOperation({ summary: 'Soft delete a company' })
  remove(@GetUser() user: AuthenticatedUser, @Param('id') id: string) {
    if (id !== user.companyId) {
      throw new Error('Unauthorized cross-tenant access');
    }
    return this.companiesService.remove(id, user.id);
  }
}
