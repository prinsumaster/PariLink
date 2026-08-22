import { Controller, Post, Body, Logger, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsIn } from 'class-validator';

export class ProcessScanDto {
  @IsString() @IsNotEmpty() code!: string;
  @IsString() @IsNotEmpty() locationId!: string;
  @IsString() @IsIn(['RECEIVE', 'PUTAWAY', 'PICK']) operation!: 'RECEIVE' | 'PUTAWAY' | 'PICK';
}

@ApiTags('WMS')
@Controller('wms/barcode')
@UseGuards(JwtAuthGuard)
export class BarcodeController {
  private readonly logger = new Logger(BarcodeController.name);

  @Post('scan')
  @ApiOperation({ summary: 'Process Barcode/QR Scan for Warehouse Operations' })
  async processScan(@Body() payload: ProcessScanDto) {
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
