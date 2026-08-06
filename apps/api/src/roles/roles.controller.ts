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
  Request,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RoleQueryDto } from './dto/role-query.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('roles')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  @RequirePermissions('roles:create')
  @ApiOperation({ summary: 'Create a new role' })
  create(
    @GetUser() user: AuthenticatedUser,
    @Body() createRoleDto: CreateRoleDto,
  ) {
    return this.rolesService.create(user.companyId, createRoleDto);
  }

  @Get()
  @RequirePermissions('roles:read')
  @ApiOperation({ summary: 'List roles for current company' })
  findAll(@GetUser() user: AuthenticatedUser, @Query() query: RoleQueryDto) {
    return this.rolesService.findAll(user.companyId, query);
  }

  @Get(':id')
  @RequirePermissions('roles:read')
  @ApiOperation({ summary: 'Get a role by ID' })
  findOne(@GetUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.rolesService.findOne(user.companyId, id);
  }

  @Patch(':id')
  @RequirePermissions('roles:update')
  @ApiOperation({ summary: 'Update a role' })
  update(
    @GetUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() updateRoleDto: UpdateRoleDto,
  ) {
    return this.rolesService.update(user.companyId, id, updateRoleDto);
  }

  @Delete(':id')
  @RequirePermissions('roles:delete')
  @ApiOperation({ summary: 'Soft delete a role' })
  remove(@GetUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.rolesService.remove(user.companyId, id);
  }
}
