import { Module } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { DocumentsController } from './documents.controller';
import { EnterpriseDocumentController } from './controllers/enterprise-document.controller';
import { DocumentFolderService } from './services/document-folder.service';
import { DocumentVersionService } from './services/document-version.service';
import { DocumentSignatureService } from './services/document-signature.service';
import { DocumentComplianceService } from './services/document-compliance.service';
import { DocumentAiService } from './services/document-ai.service';

@Module({
  controllers: [DocumentsController, EnterpriseDocumentController],
  providers: [
    DocumentsService,
    DocumentFolderService,
    DocumentVersionService,
    DocumentSignatureService,
    DocumentComplianceService,
    DocumentAiService,
  ],
  exports: [
    DocumentsService,
    DocumentFolderService,
    DocumentVersionService,
    DocumentSignatureService,
    DocumentComplianceService,
    DocumentAiService,
  ],
})
export class DocumentsModule {}
