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
  create(@Body() createCompanyDto: CreateCompanyDto) {
    return this.companiesService.create(createCompanyDto);
  }

  @Get()
  @RequirePermissions('companies:read')
  @ApiOperation({ summary: 'List companies with pagination and search' })
  findAll(@Query() query: CompanyQueryDto) {
    return this.companiesService.findAll(query);
  }

  @Get(':id')
  @RequirePermissions('companies:read')
  @ApiOperation({ summary: 'Get a company by ID' })
  findOne(@Param('id') id: string) {
    return this.companiesService.findOne(id);
  }

  @Patch(':id')
  @RequirePermissions('companies:update')
  @ApiOperation({ summary: 'Update a company' })
  update(@Param('id') id: string, @Body() updateCompanyDto: UpdateCompanyDto) {
    return this.companiesService.update(id, updateCompanyDto);
  }

  @Delete(':id')
  @RequirePermissions('companies:delete')
  @ApiOperation({ summary: 'Soft delete a company' })
  remove(@Param('id') id: string) {
    return this.companiesService.remove(id);
  }
}
