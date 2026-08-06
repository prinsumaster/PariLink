import type { AuthenticatedUser } from '../../auth/decorators/get-user.decorator';
import { GetUser } from '../../auth/decorators/get-user.decorator';
import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  UploadedFile,
  BadRequestException,
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../auth/guards/permissions.guard';
import { RequirePermissions } from '../../auth/decorators/permissions.decorator';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { PlatformFileInterceptor } from '../../platform/files/file.interceptor';
import type { Request } from 'express';

import {
  CreateFolderDto,
  UpdateFolderDto,
  CheckoutDocumentDto,
  CheckinDocumentDto,
  CreateSignatureRequestDto,
  SignDocumentDto,
  CreateComplianceRequirementDto,
  ClassifyDocumentDto,
} from '../dto/document.dto';

import { DocumentFolderService } from '../services/document-folder.service';
import { DocumentVersionService } from '../services/document-version.service';
import { DocumentSignatureService } from '../services/document-signature.service';
import { DocumentComplianceService } from '../services/document-compliance.service';
import { DocumentAiService } from '../services/document-ai.service';

@ApiTags('Enterprise Document Management & Compliance')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('documents/enterprise')
export class EnterpriseDocumentController {
  constructor(
    private readonly folderService: DocumentFolderService,
    private readonly versionService: DocumentVersionService,
    private readonly signatureService: DocumentSignatureService,
    private readonly complianceService: DocumentComplianceService,
    private readonly aiService: DocumentAiService,
  ) {}

  // 1. Folder & Tree Management
  @Get('folders/tree')
  @RequirePermissions('documents:read')
  @ApiOperation({ summary: 'Get hierarchical document folder tree' })
  async getFolderTree(@GetUser() user: AuthenticatedUser) {
    return this.folderService.getFolderTree(user.companyId);
  }

  @Post('folders')
  @RequirePermissions('documents:create')
  @ApiOperation({ summary: 'Create folder' })
  async createFolder(
    @Body() dto: CreateFolderDto,
    @GetUser() user: AuthenticatedUser,
  ) {
    return this.folderService.createFolder(user.companyId, user.userId, dto);
  }

  @Put('folders/:id')
  @RequirePermissions('documents:update')
  @ApiOperation({ summary: 'Update folder name or location' })
  async updateFolder(
    @Param('id') id: string,
    @Body() dto: UpdateFolderDto,
    @GetUser() user: AuthenticatedUser,
  ) {
    return this.folderService.updateFolder(
      user.companyId,
      id,
      user.userId,
      dto,
    );
  }

  @Delete('folders/:id')
  @RequirePermissions('documents:delete')
  @ApiOperation({ summary: 'Delete empty folder' })
  async deleteFolder(
    @Param('id') id: string,
    @GetUser() user: AuthenticatedUser,
  ) {
    return this.folderService.deleteFolder(user.companyId, id, user.userId);
  }

  @Put('move/:documentId')
  @RequirePermissions('documents:update')
  @ApiOperation({ summary: 'Move document to another folder' })
  async moveDocument(
    @Param('documentId') documentId: string,
    @Body('folderId') folderId: string | null,
    @GetUser() user: AuthenticatedUser,
  ) {
    return this.folderService.moveDocument(
      user.companyId,
      documentId,
      folderId || null,
      user.userId,
    );
  }

  // 2. Version Control & Checkout/Checkin
  @Post(':documentId/checkout')
  @RequirePermissions('documents:update')
  @ApiOperation({ summary: 'Lock document for editing (checkout)' })
  async checkoutDocument(
    @Param('documentId') documentId: string,
    @Body() dto: CheckoutDocumentDto,
    @GetUser() user: AuthenticatedUser,
  ) {
    return this.versionService.checkout(
      user.companyId,
      documentId,
      user.userId,
      dto,
    );
  }

  @Post(':documentId/checkin')
  @RequirePermissions('documents:update')
  @ApiOperation({ summary: 'Check in a new version of a document' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
        changeSummary: { type: 'string', example: 'Updated pricing and terms' },
      },
    },
  })
  @PlatformFileInterceptor('file', 5)
  async checkinDocument(
    @Param('documentId') documentId: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: CheckinDocumentDto,
    @GetUser() user: AuthenticatedUser,
  ) {
    if (!file) throw new BadRequestException('File is required for check-in');
    return this.versionService.checkin(
      user.companyId,
      documentId,
      user.userId,
      file,
      dto,
    );
  }

  @Post(':documentId/unlock')
  @HttpCode(HttpStatus.OK)
  @RequirePermissions('documents:update')
  @ApiOperation({
    summary: 'Unlock document without checking in a new version',
  })
  async unlockDocument(
    @Param('documentId') documentId: string,
    @GetUser() user: AuthenticatedUser,
  ) {
    return this.versionService.unlock(
      user.companyId,
      documentId,
      user.userId,
      false,
    );
  }

  @Get(':documentId/versions')
  @RequirePermissions('documents:read')
  @ApiOperation({ summary: 'Get full version history of a document' })
  async getVersionHistory(
    @Param('documentId') documentId: string,
    @GetUser() user: AuthenticatedUser,
  ) {
    return this.versionService.getVersionHistory(user.companyId, documentId);
  }

  @Post(':documentId/revert/:version')
  @RequirePermissions('documents:update')
  @ApiOperation({ summary: 'Revert document to an older version number' })
  async revertVersion(
    @Param('documentId') documentId: string,
    @Param('version') version: number,
    @GetUser() user: AuthenticatedUser,
  ) {
    return this.versionService.revertToVersion(
      user.companyId,
      documentId,
      Number(version),
      user.userId,
    );
  }

  // 3. E-Signatures & Verification
  @Post(':documentId/signatures')
  @RequirePermissions('documents:create')
  @ApiOperation({ summary: 'Request e-signature on document' })
  async requestSignature(
    @Param('documentId') documentId: string,
    @Body() dto: CreateSignatureRequestDto,
    @GetUser() user: AuthenticatedUser,
  ) {
    return this.signatureService.requestSignature(
      user.companyId,
      documentId,
      user.userId,
      dto,
    );
  }

  @Get(':documentId/signatures')
  @RequirePermissions('documents:read')
  @ApiOperation({ summary: 'List all signature requests for a document' })
  async getSignatures(
    @Param('documentId') documentId: string,
    @GetUser() user: AuthenticatedUser,
  ) {
    return this.signatureService.getDocumentSignatures(
      user.companyId,
      documentId,
    );
  }

  @Post('signatures/:signatureId/sign')
  @HttpCode(HttpStatus.OK)
  @RequirePermissions('documents:update')
  @ApiOperation({ summary: 'Submit cryptographic e-signature' })
  async signDocument(
    @Param('signatureId') signatureId: string,
    @Body() dto: SignDocumentDto,
    @GetUser() user: AuthenticatedUser,
    @Req() req: Request,
  ) {
    const ipAddress =
      req.ip || req.headers['x-forwarded-for']?.toString() || '127.0.0.1';
    const userAgent = req.headers['user-agent'] || 'Unknown Agent';
    return this.signatureService.signDocument(
      user.companyId,
      signatureId,
      dto,
      ipAddress,
      userAgent,
    );
  }

  @Post('signatures/:signatureId/reject')
  @HttpCode(HttpStatus.OK)
  @RequirePermissions('documents:update')
  @ApiOperation({ summary: 'Reject signature request' })
  async rejectSignature(
    @Param('signatureId') signatureId: string,
    @Body('reason') reason?: string,
    @GetUser() user: AuthenticatedUser = {} as any,
  ) {
    return this.signatureService.rejectSignature(
      user.companyId,
      signatureId,
      reason,
    );
  }

  @Get('signatures/:signatureId/certificate')
  @RequirePermissions('documents:read')
  @ApiOperation({
    summary: 'Generate verifiable digital signature audit certificate',
  })
  async getVerificationCertificate(
    @Param('signatureId') signatureId: string,
    @GetUser() user: AuthenticatedUser,
  ) {
    return this.signatureService.generateVerificationCertificate(
      user.companyId,
      signatureId,
    );
  }

  // 4. Compliance & Expiration AI
  @Get('compliance/requirements')
  @RequirePermissions('documents:read')
  @ApiOperation({ summary: 'List compliance requirements' })
  async getRequirements(
    @Query('entityType') entityType?: string,
    @GetUser() user: AuthenticatedUser = {} as any,
  ) {
    return this.complianceService.getRequirements(user.companyId, entityType);
  }

  @Post('compliance/requirements')
  @RequirePermissions('documents:create')
  @ApiOperation({ summary: 'Create compliance requirement rule' })
  async createRequirement(
    @Body() dto: CreateComplianceRequirementDto,
    @GetUser() user: AuthenticatedUser,
  ) {
    return this.complianceService.createRequirement(
      user.companyId,
      user.userId,
      dto,
    );
  }

  @Delete('compliance/requirements/:id')
  @RequirePermissions('documents:delete')
  @ApiOperation({ summary: 'Delete compliance requirement' })
  async deleteRequirement(
    @Param('id') id: string,
    @GetUser() user: AuthenticatedUser,
  ) {
    return this.complianceService.deleteRequirement(
      user.companyId,
      id,
      user.userId,
    );
  }

  @Get('compliance/evaluate/:entityType/:entityId')
  @RequirePermissions('documents:read')
  @ApiOperation({
    summary:
      'Evaluate compliance status for an entity (Driver, Vehicle, Vendor)',
  })
  async evaluateCompliance(
    @Param('entityType') entityType: string,
    @Param('entityId') entityId: string,
    @GetUser() user: AuthenticatedUser,
  ) {
    return this.complianceService.evaluateEntityCompliance(
      user.companyId,
      entityType,
      entityId,
    );
  }

  @Get('compliance/scan-expiring')
  @RequirePermissions('documents:read')
  @ApiOperation({ summary: 'Scan all documents for expiring or expired items' })
  async scanExpiring(@GetUser() user: AuthenticatedUser) {
    return this.complianceService.scanExpiringDocuments(user.companyId);
  }

  // 5. AI OCR Classification & Auto-filing
  @Post(':documentId/ai-classify')
  @RequirePermissions('documents:update')
  @ApiOperation({
    summary: 'Run AI OCR classification, metadata extraction, and auto-filing',
  })
  async classifyDocument(
    @Param('documentId') documentId: string,
    @Body() dto: ClassifyDocumentDto,
    @GetUser() user: AuthenticatedUser,
  ) {
    return this.aiService.classifyAndExtractMetadata(
      user.companyId,
      documentId,
      user.userId,
      dto,
    );
  }
}
