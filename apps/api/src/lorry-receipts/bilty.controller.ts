import {
  Controller,
  Get,
  Param,
  Query,
  UseGuards,
  Res,
} from '@nestjs/common';
import { LorryReceiptsService } from './lorry-receipts.service';
import { PdfGeneratorService } from './pdf-generator.service';
import type { AuthenticatedUser } from '../auth/decorators/get-user.decorator';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('bilty')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('bilty')
export class BiltyController {
  constructor(
    private readonly lorryReceiptsService: LorryReceiptsService,
    private readonly pdfGeneratorService: PdfGeneratorService,
  ) {}

  @Get(':id/pdf')
  @RequirePermissions('documents:read')
  @ApiOperation({ summary: 'Generate a proper A4 PDF for a Bilty' })
  async generatePdf(
    @GetUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Query('copy') copy: string,
    @Res() res: any,
  ) {
    const lr = await this.lorryReceiptsService.findOnePopulated(user.companyId, id);
    const pdfBuffer = await this.pdfGeneratorService.generateBiltyPdf(lr, copy || 'OFFICE');
    
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="Bilty_${lr.lrNumber}.pdf"`,
      'Content-Length': pdfBuffer.length,
    });
    
    res.end(pdfBuffer);
  }
}
