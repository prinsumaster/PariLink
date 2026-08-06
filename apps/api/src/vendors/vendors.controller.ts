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
import { VendorsService } from './vendors.service';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { UpdateVendorDto } from './dto/update-vendor.dto';
import { VendorQueryDto } from './dto/vendor-query.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('vendors')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('vendors')
export class VendorsController {
  constructor(private readonly vendorsService: VendorsService) {}

  @Post()
  @RequirePermissions('vendors:create')
  @ApiOperation({ summary: 'Create a new vendor' })
  create(
    @GetUser() user: AuthenticatedUser,
    @Body() createVendorDto: CreateVendorDto,
  ) {
    return this.vendorsService.create(user.companyId, createVendorDto);
  }

  @Get()
  @RequirePermissions('vendors:read')
  @ApiOperation({ summary: 'List vendors for current company' })
  findAll(@GetUser() user: AuthenticatedUser, @Query() query: VendorQueryDto) {
    return this.vendorsService.findAll(user.companyId, query);
  }

  @Get(':id')
  @RequirePermissions('vendors:read')
  @ApiOperation({ summary: 'Get a vendor by ID' })
  findOne(@GetUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.vendorsService.findOne(user.companyId, id);
  }

  @Patch(':id')
  @RequirePermissions('vendors:update')
  @ApiOperation({ summary: 'Update a vendor' })
  update(
    @GetUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() updateVendorDto: UpdateVendorDto,
  ) {
    return this.vendorsService.update(user.companyId, id, updateVendorDto);
  }

  @Delete(':id')
  @RequirePermissions('vendors:delete')
  @ApiOperation({ summary: 'Soft delete a vendor' })
  remove(@GetUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.vendorsService.remove(user.companyId, id);
  }
}
