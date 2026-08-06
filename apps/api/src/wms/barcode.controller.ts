import { Controller, Post, Body, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('WMS')
@Controller('wms/barcode')
export class BarcodeController {
  private readonly logger = new Logger(BarcodeController.name);

  @Post('scan')
  @ApiOperation({ summary: 'Process Barcode/QR Scan for Warehouse Operations' })
  async processScan(
    @Body()
    payload: {
      code: string;
      locationId: string;
      operation: 'RECEIVE' | 'PUTAWAY' | 'PICK';
    },
  ) {
    this.logger.log(
      `Processing barcode scan: ${payload.code} for ${payload.operation}`,
    );
    // Scaffolded: Map to inventory item and update state
    return {
      success: true,
      item: { sku: payload.code, description: 'Scanned Item' },
      status: 'VERIFIED',
    };
  }
}
