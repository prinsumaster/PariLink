import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { PrismaService } from '../../prisma/prisma.service';

@ApiTags('Logistics Intelligence Network')
@Controller('lin')
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
