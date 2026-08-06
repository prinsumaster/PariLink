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
import { TrailersService } from './trailers.service';
import { CreateTrailerDto } from './dto/create-trailer.dto';
import { UpdateTrailerDto } from './dto/update-trailer.dto';
import { TrailerQueryDto } from './dto/trailer-query.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('trailers')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('trailers')
export class TrailersController {
  constructor(private readonly trailersService: TrailersService) {}

  @Post()
  @RequirePermissions('trailers:create')
  @ApiOperation({ summary: 'Create a new trailer' })
  create(
    @GetUser() user: AuthenticatedUser,
    @Body() createTrailerDto: CreateTrailerDto,
  ) {
    return this.trailersService.create(user.companyId, createTrailerDto);
  }

  @Get()
  @RequirePermissions('trailers:read')
  @ApiOperation({ summary: 'List trailers for current company' })
  findAll(@GetUser() user: AuthenticatedUser, @Query() query: TrailerQueryDto) {
    return this.trailersService.findAll(user.companyId, query);
  }

  @Get(':id')
  @RequirePermissions('trailers:read')
  @ApiOperation({ summary: 'Get a trailer by ID' })
  findOne(@GetUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.trailersService.findOne(user.companyId, id);
  }

  @Patch(':id')
  @RequirePermissions('trailers:update')
  @ApiOperation({ summary: 'Update a trailer' })
  update(
    @GetUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() updateTrailerDto: UpdateTrailerDto,
  ) {
    return this.trailersService.update(user.companyId, id, updateTrailerDto);
  }

  @Delete(':id')
  @RequirePermissions('trailers:delete')
  @ApiOperation({ summary: 'Soft delete a trailer' })
  remove(@GetUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.trailersService.remove(user.companyId, id);
  }
}
