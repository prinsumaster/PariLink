import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Req,
  Param,
  HttpStatus,
  HttpException,
  Header,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiSecurity } from '@nestjs/swagger';
import { PrismaService } from '../../prisma/prisma.service';
import { CryptoService } from '../security/crypto.service';

/**
 * Very simple mock API Guard for MVP Gateway
 */
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';

@Injectable()
class ApiKeyAuthGuard implements CanActivate {
  private readonly logger = new Logger(ApiKeyAuthGuard.name);

  constructor(
    private prisma: PrismaService,
    private crypto: CryptoService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const apiKey =
      request.headers['x-api-key'] ||
      request.headers['authorization']?.replace('Bearer ', '');

    if (!apiKey) {
      throw new UnauthorizedException('API Key missing');
    }

    const hashedKey = this.crypto.hashApiKey(apiKey);

    const credential = await this.prisma.runAsSystem(async (tx) =>
      tx.apiCredential.findFirst({
        where: { apiKeyHash: hashedKey },
      }),
    );

    if (!credential) {
      throw new UnauthorizedException('Invalid API Key');
    }

    if (credential.expiresAt && credential.expiresAt < new Date()) {
      throw new UnauthorizedException('API Key expired');
    }

    // Attach company info to request
    request.companyId = credential.companyId;

    // Log request asynchronously
    this.prisma
      .runAsSystem(async (tx) =>
        tx.apiRequestLog.create({
          data: {
            companyId: credential.companyId,
            endpoint: request.url,
            method: request.method,
            statusCode: 200,
            latencyMs: 0,
            ipAddress: request.ip,
            userAgent: request.headers['user-agent'],
          },
        }),
      )
      .catch((e: any) => this.logger.error('Failed to log API request', e));

    return true;
  }
}

@ApiTags('gateway')
@ApiSecurity('x-api-key')
@UseGuards(ApiKeyAuthGuard)
@Controller('gateway/v1')
export class GatewayController {
  constructor(private prisma: PrismaService) {}

  @Get('health')
  @ApiOperation({ summary: 'API Gateway Health Check' })
  healthCheck() {
    return { status: 'OK', version: '1.0.0' };
  }

  @Get('loads')
  @ApiOperation({ summary: 'Get loads via API Gateway' })
  async getLoads(@Req() req: any) {
    // This is scoped by ApiKeyAuthGuard's attached companyId
    const loads = await this.prisma.runAsSystem(async (tx) =>
      tx.load.findMany({
        where: { companyId: req.companyId },
        take: 50,
      }),
    );
    return { data: loads };
  }
}
