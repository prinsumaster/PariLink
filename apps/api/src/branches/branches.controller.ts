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
import { BranchesService } from './branches.service';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';
import { BranchQueryDto } from './dto/branch-query.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('branches')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('branches')
export class BranchesController {
  constructor(private readonly branchesService: BranchesService) {}

  @Post()
  @RequirePermissions('branches:create')
  @ApiOperation({ summary: 'Create a new branch' })
  create(
    @GetUser() user: AuthenticatedUser,
    @Body() createBranchDto: CreateBranchDto,
  ) {
    return this.branchesService.create(user.companyId, createBranchDto);
  }

  @Get()
  @RequirePermissions('branches:read')
  @ApiOperation({
    summary: 'List branches for current company with pagination',
  })
  findAll(@GetUser() user: AuthenticatedUser, @Query() query: BranchQueryDto) {
    return this.branchesService.findAll(user.companyId, query);
  }

  @Get(':id')
  @RequirePermissions('branches:read')
  @ApiOperation({ summary: 'Get a branch by ID' })
  findOne(@GetUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.branchesService.findOne(user.companyId, id);
  }

  @Patch(':id')
  @RequirePermissions('branches:update')
  @ApiOperation({ summary: 'Update a branch' })
  update(
    @GetUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() updateBranchDto: UpdateBranchDto,
  ) {
    return this.branchesService.update(user.companyId, id, updateBranchDto);
  }

  @Delete(':id')
  @RequirePermissions('branches:delete')
  @ApiOperation({ summary: 'Soft delete a branch' })
  remove(@GetUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.branchesService.remove(user.companyId, id);
  }
}
