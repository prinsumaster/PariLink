import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { PrismaService } from '../../prisma/prisma.service';

@ApiTags('Logistics Intelligence Network')
@Controller('lin')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class LinController {
  constructor(private readonly prisma: PrismaService) {}

  @Get('benchmarks')
  @ApiOperation({ summary: 'Get aggregated industry benchmarks' })
  async getBenchmarks() {
    const benchmarks = await this.prisma.runAsSystem(async (tx) =>
      tx.linBenchmark.findMany(),
    );
    return benchmarks;
  }
}
