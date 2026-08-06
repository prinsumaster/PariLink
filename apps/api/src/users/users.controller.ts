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
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserQueryDto } from './dto/user-query.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @RequirePermissions('users:create')
  @ApiOperation({ summary: 'Create a new user' })
  create(
    @GetUser() user: AuthenticatedUser,
    @Body() createUserDto: CreateUserDto,
  ) {
    return this.usersService.create(user.companyId, createUserDto);
  }

  @Get()
  @RequirePermissions('users:read')
  @ApiOperation({ summary: 'List users for current company with pagination' })
  findAll(@GetUser() user: AuthenticatedUser, @Query() query: UserQueryDto) {
    return this.usersService.findAll(user.companyId, query);
  }

  @Get(':id')
  @RequirePermissions('users:read')
  @ApiOperation({ summary: 'Get a user by ID' })
  findOne(@GetUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.usersService.findOne(user.companyId, id);
  }

  @Patch(':id')
  @RequirePermissions('users:update')
  @ApiOperation({ summary: 'Update a user' })
  update(
    @GetUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(user.companyId, id, updateUserDto);
  }

  @Delete(':id')
  @RequirePermissions('users:delete')
  @ApiOperation({ summary: 'Soft delete a user' })
  remove(@GetUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.usersService.remove(user.companyId, id);
  }
}
