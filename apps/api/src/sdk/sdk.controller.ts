import { Controller, Post, Get, Param, Res, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import type { Response } from 'express';
import { ApiV2AuthGuard } from '../api-platform/v2/guards/api-v2-auth.guard';

@ApiTags('SDK Automation')
@ApiBearerAuth('JWT-Auth')
@UseGuards(ApiV2AuthGuard)
@Controller({ path: 'developer/sdk', version: '2' })
export class SdkController {
  @Post('generate/:language')
  @ApiOperation({ summary: 'Generate client SDK for the specified language' })
  @ApiParam({
    name: 'language',
    enum: ['typescript-axios', 'python', 'java', 'go'],
  })
  async generateSdk(@Param('language') language: string, @Res() res: Response) {
    // In a real environment, this would call openapi-generator-cli
    // and stream the resulting ZIP file to the client.
    // For this implementation, we return a mock success response.

    res.setHeader('Content-Type', 'application/json');
    res.status(202).send({
      message: `SDK Generation for ${language} started`,
      status: 'PROCESSING',
      downloadUrl: `/api/v2/developer/sdk/download/mock-${language}-sdk.zip`,
    });
  }

  @Get('download/:filename')
  @ApiOperation({ summary: 'Download generated SDK' })
  async downloadSdk(@Param('filename') filename: string, @Res() res: Response) {
    // Mock download endpoint
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    // Send empty zip or dummy data
    res.send(
      Buffer.from(
        'PK\x05\x06\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00',
        'ascii',
      ),
    );
  }
}
