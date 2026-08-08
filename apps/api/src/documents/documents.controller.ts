import type { AuthenticatedUser } from '../auth/decorators/get-user.decorator';
import { GetUser } from '../auth/decorators/get-user.decorator';
import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { PlatformFileInterceptor } from '../platform/files/file.interceptor';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('documents')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post('upload')
  @RequirePermissions('documents:create')
  @ApiOperation({ summary: 'Upload a document' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
        type: { type: 'string', example: 'POD' },
        loadId: { type: 'string' },
        entityId: { type: 'string' },
        entityType: { type: 'string' },
        folderId: { type: 'string' },
        tags: { type: 'string' },
      },
    },
  })
  @PlatformFileInterceptor('file', 5)
  uploadDocument(
    @GetUser() user: AuthenticatedUser,
    @UploadedFile() file: Express.Multer.File,
    @Body()
    body: {
      loadId?: string;
      entityId?: string;
      entityType?: string;
      type: string;
      folderId?: string;
      tags?: string;
    },
  ) {
    if (!file) {
      throw new BadRequestException('File is required');
    }
    return this.documentsService.uploadDocument(
      user.companyId,
      user.id,
      file,
      body,
    );
  }

  @Get()
  @RequirePermissions('documents:read')
  @ApiOperation({ summary: 'Get all documents globally or in a folder' })
  getAllDocuments(
    @GetUser() user: AuthenticatedUser,
    @Query('folderId') folderId?: string,
  ) {
    return this.documentsService.getAllDocuments(user.companyId, folderId);
  }

  @Get('folders')
  @RequirePermissions('documents:read')
  @ApiOperation({ summary: 'Get document folders' })
  getFolders(
    @GetUser() user: AuthenticatedUser,
    @Query('parentId') parentId?: string,
  ) {
    return this.documentsService.getFolders(user.companyId, parentId);
  }

  @Post('folders')
  @RequirePermissions('documents:create')
  @ApiOperation({ summary: 'Create a document folder' })
  createFolder(
    @GetUser() user: AuthenticatedUser,
    @Body() body: { name: string; parentId?: string },
  ) {
    if (!body.name) throw new BadRequestException('Folder name is required');
    return this.documentsService.createFolder(
      user.companyId,
      body.name,
      body.parentId,
    );
  }

  @Get('loads/:loadId')
  @RequirePermissions('documents:read')
  @ApiOperation({ summary: 'Get all documents for a specific load' })
  getLoadDocuments(
    @GetUser() user: AuthenticatedUser,
    @Param('loadId') loadId: string,
  ) {
    return this.documentsService.getLoadDocuments(user.companyId, loadId);
  }

  @Get('entity/:entityType/:entityId')
  @RequirePermissions('documents:read')
  @ApiOperation({ summary: 'Get all documents for a generic entity' })
  getEntityDocuments(
    @GetUser() user: AuthenticatedUser,
    @Param('entityType') entityType: string,
    @Param('entityId') entityId: string,
  ) {
    return this.documentsService.getEntityDocuments(
      user.companyId,
      entityType,
      entityId,
    );
  }
}
