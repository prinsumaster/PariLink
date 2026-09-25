import type { AuthenticatedUser } from '../auth/decorators/get-user.decorator';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { LorryReceiptsService } from './lorry-receipts.service';
import { ShareLorryReceiptDto } from './dto/share-lorry-receipt.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Res } from '@nestjs/common';

@ApiTags('lorry-receipts')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('lorry-receipts')
export class LorryReceiptsController {
  constructor(private readonly lorryReceiptsService: LorryReceiptsService) {}

  @Post(':id/share')
  @RequirePermissions('lr:share')
  @ApiOperation({ summary: 'Share Lorry Receipt with a driver' })
  share(
    @GetUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() dto: ShareLorryReceiptDto,
  ) {
    return this.lorryReceiptsService.share(user.companyId, id, dto);
  }

  @Get()
  @RequirePermissions('documents:read')
  @ApiOperation({ summary: 'List Lorry Receipts' })
  findAll(@GetUser() user: AuthenticatedUser) {
    return this.lorryReceiptsService.findAll(user.companyId);
  }

  @Get(':id')
  @RequirePermissions('documents:read')
  @ApiOperation({ summary: 'Get a Lorry Receipt by ID' })
  findOne(@GetUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.lorryReceiptsService.findOne(user.companyId, id);
  }

  @Get(':id/pdf')
  @RequirePermissions('documents:read')
  @ApiOperation({ summary: 'Generate Lorry Receipt PDF' })
  async generatePdf(
    @GetUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Res() res: any,
  ) {
    const stream = await this.lorryReceiptsService.generatePdf(
      user.companyId,
      id,
    );
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="lr-${id}.pdf"`,
    });
    stream.pipe(res);
  }
}
