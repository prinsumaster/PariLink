import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { WorkspaceService } from './workspace.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import type { AuthenticatedUser } from '../auth/decorators/get-user.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Workspace')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('workspace')
export class WorkspaceController {
  constructor(private readonly workspaceService: WorkspaceService) {}

  @Get('snapshots')
  @ApiOperation({ summary: 'Get all workspace snapshots' })
  getSnapshots(@GetUser() user: AuthenticatedUser) {
    return this.workspaceService.getSnapshots(user.companyId, user.userId);
  }

  @Post('snapshots')
  @ApiOperation({ summary: 'Save current workspace state' })
  saveSnapshot(
    @GetUser() user: AuthenticatedUser,
    @Body()
    body: {
      name: string;
      description?: string;
      state: any;
      isDefault?: boolean;
    },
  ) {
    return this.workspaceService.saveSnapshot(
      user.companyId,
      user.userId,
      body,
    );
  }

  @Get('snapshots/default')
  @ApiOperation({ summary: 'Get default workspace snapshot' })
  getDefaultSnapshot(@GetUser() user: AuthenticatedUser) {
    return this.workspaceService.getDefaultSnapshot(
      user.companyId,
      user.userId,
    );
  }

  @Delete('snapshots/:id')
  @ApiOperation({ summary: 'Delete a snapshot' })
  deleteSnapshot(@GetUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.workspaceService.deleteSnapshot(id, user.userId);
  }

  @Post('preferences')
  @ApiOperation({ summary: 'Update user workspace preferences' })
  updatePreferences(
    @GetUser() user: AuthenticatedUser,
    @Body() body: Record<string, unknown>,
  ) {
    return this.workspaceService.updatePreferences(user.userId, body);
  }
}
