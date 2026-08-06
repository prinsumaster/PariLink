import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import type { AuthenticatedUser } from '../auth/decorators/get-user.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Comments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get(':entityType/:entityId')
  @ApiOperation({ summary: 'Get comments for an entity' })
  async getComments(
    @GetUser() user: AuthenticatedUser,
    @Param('entityType') entityType: string,
    @Param('entityId') entityId: string,
  ) {
    return this.commentsService.getComments(
      user.companyId,
      entityType,
      entityId,
    );
  }

  @Post(':entityType/:entityId')
  @ApiOperation({ summary: 'Add a comment to an entity' })
  async addComment(
    @GetUser() user: AuthenticatedUser,
    @Param('entityType') entityType: string,
    @Param('entityId') entityId: string,
    @Body() body: { content: string; parentId?: string },
  ) {
    return this.commentsService.addComment(
      user.companyId,
      user.userId,
      entityType,
      entityId,
      body.content,
      body.parentId,
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a comment' })
  async deleteComment(
    @GetUser() user: AuthenticatedUser,
    @Param('id') id: string,
  ) {
    return this.commentsService.deleteComment(user.companyId, user.userId, id);
  }
}
