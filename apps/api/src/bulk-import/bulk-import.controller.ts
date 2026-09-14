import {
  Controller,
  Post,
  Get,
  Param,
  UseInterceptors,
  UploadedFile,
  Res,
  BadRequestException,
  Req,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Response, Request } from 'express';
import { BulkImportService, ImportType } from './bulk-import.service';
import { ApiTags, ApiConsumes, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

const VALID_TYPES: ImportType[] = ['vehicles', 'drivers', 'customers', 'vendors', 'opening-balances'];

@ApiTags('Bulk Import')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('import')
export class BulkImportController {
  constructor(private readonly importService: BulkImportService) {}

  /**
   * Download a template .xlsx file with the correct column headers.
   * GET /api/v1/import/:type/template
   */
  @Get(':type/template')
  downloadTemplate(@Param('type') type: string, @Res() res: Response) {
    if (!VALID_TYPES.includes(type as ImportType)) {
      throw new BadRequestException(
        `Invalid import type "${type}". Valid types: ${VALID_TYPES.join(', ')}`,
      );
    }

    const buffer = this.importService.getTemplate(type as ImportType);
    res.set({
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="${type}-template.xlsx"`,
      'Content-Length': buffer.length,
    });
    res.end(buffer);
  }

  /**
   * Upload and process an import file (.xlsx or .csv).
   * POST /api/v1/import/:type
   * Multipart field: file
   */
  @Post(':type')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB max
      fileFilter: (_req, file, cb) => {
        const allowed = [
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'application/vnd.ms-excel',
          'text/csv',
          'application/csv',
        ];
        if (!allowed.includes(file.mimetype) && !file.originalname.match(/\.(xlsx|xls|csv)$/i)) {
          cb(new BadRequestException('Only .xlsx, .xls, and .csv files are accepted'), false);
        } else {
          cb(null, true);
        }
      },
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
      },
    },
  })
  async importFile(
    @Param('type') type: string,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
  ) {
    if (!VALID_TYPES.includes(type as ImportType)) {
      throw new BadRequestException(
        `Invalid import type "${type}". Valid types: ${VALID_TYPES.join(', ')}`,
      );
    }
    if (!file) {
      throw new BadRequestException('No file uploaded. Use multipart/form-data with field "file".');
    }

    // Extract companyId from JWT claims (attached by auth guard)
    const user = (req as any).user;
    const companyId = user?.companyId || user?.cid;
    const userId = user?.id || user?.sub;

    if (!companyId) {
      throw new BadRequestException('Cannot determine company from token. Ensure you are authenticated.');
    }

    const report = await this.importService.import(
      companyId,
      userId,
      type as ImportType,
      file.buffer,
      file.originalname,
    );

    return report;
  }
}
