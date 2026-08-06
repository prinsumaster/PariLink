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
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { CustomerQueryDto } from './dto/customer-query.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('customers')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post()
  @RequirePermissions('customers:create')
  @ApiOperation({ summary: 'Create a new customer' })
  create(
    @GetUser() user: AuthenticatedUser,
    @Body() createCustomerDto: CreateCustomerDto,
  ) {
    return this.customersService.create(user.companyId, createCustomerDto);
  }

  @Get()
  @RequirePermissions('customers:read')
  @ApiOperation({ summary: 'List customers for current company' })
  findAll(
    @GetUser() user: AuthenticatedUser,
    @Query() query: CustomerQueryDto,
  ) {
    return this.customersService.findAll(user.companyId, query);
  }

  @Get(':id')
  @RequirePermissions('customers:read')
  @ApiOperation({ summary: 'Get a customer by ID' })
  findOne(@GetUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.customersService.findOne(user.companyId, id);
  }

  @Patch(':id')
  @RequirePermissions('customers:update')
  @ApiOperation({ summary: 'Update a customer' })
  update(
    @GetUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ) {
    return this.customersService.update(user.companyId, id, updateCustomerDto);
  }

  @Delete(':id')
  @RequirePermissions('customers:delete')
  @ApiOperation({ summary: 'Soft delete a customer' })
  remove(@GetUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.customersService.remove(user.companyId, id);
  }
}
