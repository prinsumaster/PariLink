import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  GoldenRecordEngineService,
  SurvivorshipRule,
} from './golden-record-engine.service';
import { DataQualityEngineService } from './data-quality-engine.service';
import { ExternalIdentityMappingService } from './external-identity-mapping.service';
import { ReferenceDataService } from './reference-data.service';
import { MdmSearchService } from './mdm-search.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../auth/guards/permissions.guard';
import { RequirePermissions } from '../../auth/decorators/permissions.decorator';
import { GetUser } from '../../auth/decorators/get-user.decorator';
import type { AuthenticatedUser } from '../../auth/decorators/get-user.decorator';

@Controller('mdm')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class MdmController {
  constructor(
    private readonly goldenEngine: GoldenRecordEngineService,
    private readonly dqEngine: DataQualityEngineService,
    private readonly identityMap: ExternalIdentityMappingService,
    private readonly refData: ReferenceDataService,
    private readonly searchService: MdmSearchService,
  ) {}

  // ── 1. Golden Record APIs ────────────────────────────────────────────────

  @Post('records/:entityType')
  @RequirePermissions('mdm:record:write')
  async createGoldenRecord(
    @GetUser() user: AuthenticatedUser,
    @Param('entityType') entityType: string,
    @Body()
    payload: { masterData: Record<string, unknown>; sourceSystem: string },
  ) {
    return this.goldenEngine.createGoldenRecord(
      user.companyId,
      entityType,
      payload.masterData,
      payload.sourceSystem || 'API_MANUAL',
      user.userId,
    );
  }

  @Post('records/merge')
  @RequirePermissions('mdm:record:merge')
  async mergeRecords(
    @GetUser() user: AuthenticatedUser,
    @Body()
    payload: {
      primaryId: string;
      duplicateId: string;
      survivorshipRules: SurvivorshipRule[];
    },
  ) {
    return this.goldenEngine.mergeRecords(
      user.companyId,
      payload.primaryId,
      payload.duplicateId,
      payload.survivorshipRules || [],
      user.userId,
    );
  }

  // ── 2. Data Quality APIs ─────────────────────────────────────────────────

  @Post('quality/evaluate/:entityType')
  @RequirePermissions('mdm:quality:read')
  async evaluateQuality(
    @GetUser() user: AuthenticatedUser,
    @Param('entityType') entityType: string,
    @Body() payload: Record<string, unknown>,
  ) {
    return this.dqEngine.evaluateQuality(user.companyId, entityType, payload);
  }

  // ── 3. External Identity APIs ────────────────────────────────────────────

  @Get('identities/:sourceSystem/:externalId')
  @RequirePermissions('mdm:identity:read')
  async resolveIdentity(
    @Param('sourceSystem') sourceSystem: string,
    @Param('externalId') externalId: string,
  ) {
    const goldenId = await this.identityMap.resolveToGoldenId(
      sourceSystem,
      externalId,
    );
    return { goldenId };
  }

  // ── 4. Reference Data APIs (Public read, admin write) ───────────────────

  @Get('reference/:domain')
  async getReferenceData(@Param('domain') domain: string) {
    return this.refData.getReferenceData(domain);
  }

  @Post('reference/:domain')
  @RequirePermissions('mdm:reference:write')
  async upsertReferenceData(
    @Param('domain') domain: string,
    @Body()
    payload: {
      code: string;
      name: string;
      attributes?: Record<string, unknown>;
    },
  ) {
    return this.refData.upsertReferenceData(
      domain,
      payload.code,
      payload.name,
      payload.attributes,
    );
  }

  // ── 5. Enterprise Search APIs ────────────────────────────────────────────

  @Get('search')
  @RequirePermissions('mdm:search')
  async searchMasterRecords(
    @GetUser() user: AuthenticatedUser,
    @Query('query') query: string,
    @Query('entityType') entityType?: string,
    @Query('limit') limit?: string,
  ) {
    return this.searchService.searchMasterRecords({
      companyId: user.companyId,
      query,
      entityType,
      limit: limit ? parseInt(limit, 10) : 50,
    });
  }
}
