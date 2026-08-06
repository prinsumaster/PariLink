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
import { LoadsService } from './loads.service';
import { CreateLoadDto } from './dto/create-load.dto';
import { UpdateLoadDto } from './dto/update-load.dto';
import { LoadQueryDto } from './dto/load-query.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('loads')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('loads')
export class LoadsController {
  constructor(private readonly loadsService: LoadsService) {}

  @Post()
  @RequirePermissions('loads:create')
  @ApiOperation({ summary: 'Create a new load' })
  create(
    @GetUser() user: AuthenticatedUser,
    @Body() createLoadDto: CreateLoadDto,
  ) {
    return this.loadsService.create(user.companyId, createLoadDto);
  }

  @Get()
  @RequirePermissions('loads:read')
  @ApiOperation({ summary: 'List loads for current company' })
  findAll(@GetUser() user: AuthenticatedUser, @Query() query: LoadQueryDto) {
    return this.loadsService.findAll(user.companyId, query);
  }

  @Get(':id')
  @RequirePermissions('loads:read')
  @ApiOperation({ summary: 'Get a load by ID' })
  findOne(@GetUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.loadsService.findOne(user.companyId, id);
  }

  @Patch(':id')
  @RequirePermissions('loads:update')
  @ApiOperation({ summary: 'Update a load' })
  update(
    @GetUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() updateLoadDto: UpdateLoadDto,
  ) {
    return this.loadsService.update(user.companyId, id, updateLoadDto);
  }

  @Delete(':id')
  @RequirePermissions('loads:delete')
  @ApiOperation({ summary: 'Soft delete a load' })
  remove(@GetUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.loadsService.remove(user.companyId, id);
  }
}
