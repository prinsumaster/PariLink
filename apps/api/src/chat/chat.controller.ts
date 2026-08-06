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
  HttpCode,
  HttpStatus,
  Request,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import type { AuthenticatedUser } from '../auth/decorators/get-user.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Chat')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('channels')
  @ApiOperation({ summary: 'Get all channels for the current user' })
  getChannels(@GetUser() user: AuthenticatedUser) {
    return this.chatService.getChannels(user.companyId, user.userId);
  }

  @Post('channels')
  @ApiOperation({ summary: 'Create a new channel' })
  createChannel(
    @GetUser() user: AuthenticatedUser,
    @Body()
    body: {
      name: string;
      description?: string;
      type?: string;
      isPrivate?: boolean;
      memberIds?: string[];
    },
  ) {
    return this.chatService.createChannel(user.companyId, user.userId, body);
  }

  @Get('channels/:channelId/messages')
  @ApiOperation({ summary: 'Get messages in a channel' })
  getMessages(
    @GetUser() user: AuthenticatedUser,
    @Param('channelId') channelId: string,
    @Query('cursor') cursor?: string,
    @Query('limit') limit?: string,
  ) {
    return this.chatService.getMessages(
      user.companyId,
      user.userId,
      channelId,
      cursor,
      limit ? parseInt(limit) : 50,
    );
  }

  @Post('channels/:channelId/messages')
  @ApiOperation({ summary: 'Send a message to a channel' })
  sendMessage(
    @GetUser() user: AuthenticatedUser,
    @Param('channelId') channelId: string,
    @Body() body: { content: string; attachments?: any[]; mentions?: string[] },
  ) {
    return this.chatService.sendMessage(
      user.companyId,
      user.userId,
      channelId,
      body.content,
      body.attachments,
      body.mentions,
    );
  }

  @Put('messages/:messageId')
  @ApiOperation({ summary: 'Edit a message' })
  editMessage(
    @GetUser() user: AuthenticatedUser,
    @Param('messageId') messageId: string,
    @Body() body: { content: string },
  ) {
    return this.chatService.editMessage(
      user.companyId,
      user.userId,
      messageId,
      body.content,
    );
  }

  @Delete('messages/:messageId')
  @ApiOperation({ summary: 'Delete a message' })
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteMessage(
    @GetUser() user: AuthenticatedUser,
    @Param('messageId') messageId: string,
  ) {
    return this.chatService.deleteMessage(
      user.companyId,
      user.userId,
      messageId,
    );
  }

  @Post('messages/:messageId/reactions')
  @ApiOperation({ summary: 'Add a reaction to a message' })
  addReaction(
    @GetUser() user: AuthenticatedUser,
    @Param('messageId') messageId: string,
    @Body() body: { emoji: string },
  ) {
    return this.chatService.addReaction(user.userId, messageId, body.emoji);
  }

  @Delete('messages/:messageId/reactions/:emoji')
  @ApiOperation({ summary: 'Remove a reaction from a message' })
  @HttpCode(HttpStatus.NO_CONTENT)
  removeReaction(
    @GetUser() user: AuthenticatedUser,
    @Param('messageId') messageId: string,
    @Param('emoji') emoji: string,
  ) {
    return this.chatService.removeReaction(user.userId, messageId, emoji);
  }

  @Post('channels/:channelId/join')
  @ApiOperation({ summary: 'Join a public channel' })
  joinChannel(
    @GetUser() user: AuthenticatedUser,
    @Param('channelId') channelId: string,
  ) {
    return this.chatService.joinChannel(user.userId, channelId);
  }

  @Post('dm/:otherUserId')
  @ApiOperation({ summary: 'Open or create a DM with a user' })
  getOrCreateDm(
    @GetUser() user: AuthenticatedUser,
    @Param('otherUserId') otherUserId: string,
  ) {
    return this.chatService.getOrCreateDm(
      user.companyId,
      user.userId,
      otherUserId,
    );
  }
}
