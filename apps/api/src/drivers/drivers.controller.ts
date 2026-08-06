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
import { DriversService } from './drivers.service';
import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateDriverDto } from './dto/update-driver.dto';
import { DriverQueryDto } from './dto/driver-query.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('drivers')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('drivers')
export class DriversController {
  constructor(private readonly driversService: DriversService) {}

  @Post()
  @RequirePermissions('drivers:create')
  @ApiOperation({ summary: 'Create a new driver' })
  create(
    @GetUser() user: AuthenticatedUser,
    @Body() createDriverDto: CreateDriverDto,
  ) {
    return this.driversService.create(user.companyId, createDriverDto);
  }

  @Get()
  @RequirePermissions('drivers:read')
  @ApiOperation({ summary: 'List drivers for current company' })
  findAll(@GetUser() user: AuthenticatedUser, @Query() query: DriverQueryDto) {
    return this.driversService.findAll(user.companyId, query);
  }

  @Get(':id')
  @RequirePermissions('drivers:read')
  @ApiOperation({ summary: 'Get a driver by ID' })
  findOne(@GetUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.driversService.findOne(user.companyId, id);
  }

  @Patch(':id')
  @RequirePermissions('drivers:update')
  @ApiOperation({ summary: 'Update a driver' })
  update(
    @GetUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() updateDriverDto: UpdateDriverDto,
  ) {
    return this.driversService.update(user.companyId, id, updateDriverDto);
  }

  @Delete(':id')
  @RequirePermissions('drivers:delete')
  @ApiOperation({ summary: 'Soft delete a driver' })
  remove(@GetUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.driversService.remove(user.companyId, id);
  }
}
