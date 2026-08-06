import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Version,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiOAuth2,
  ApiHeader,
  ApiSecurity,
} from '@nestjs/swagger';
import { ApiV2AuthGuard } from '../guards/api-v2-auth.guard';
import { LoadsService } from '../../../loads/loads.service';
import { CreateLoadDto } from '../../../loads/dto/create-load.dto';
import { UpdateLoadDto } from '../../../loads/dto/update-load.dto';
import { LoadQueryDto } from '../../../loads/dto/load-query.dto';
import { GetUser } from '../../../auth/decorators/get-user.decorator';
import type { AuthenticatedUser } from '../../../auth/decorators/get-user.decorator';

@ApiTags('Loads')
@ApiBearerAuth('JWT-Auth')
@ApiOAuth2([])
@ApiSecurity('API-Key')
@ApiSecurity('OAuth2')
@UseGuards(ApiV2AuthGuard)
@Controller({ path: 'loads', version: '2' })
export class LoadsV2Controller {
  constructor(private readonly loadsService: LoadsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new load (v2)' })
  async create(@GetUser() user: AuthenticatedUser, @Body() dto: CreateLoadDto) {
    return this.loadsService.create(user.companyId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'List loads (v2)' })
  async findAll(
    @GetUser() user: AuthenticatedUser,
    @Query() query: LoadQueryDto,
  ) {
    return this.loadsService.findAll(user.companyId, query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific load (v2)' })
  async findOne(@GetUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.loadsService.findOne(user.companyId, id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a load (v2)' })
  async update(
    @GetUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() dto: UpdateLoadDto,
  ) {
    return this.loadsService.update(user.companyId, id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a load (v2)' })
  async remove(@GetUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.loadsService.remove(user.companyId, id);
  }
}
