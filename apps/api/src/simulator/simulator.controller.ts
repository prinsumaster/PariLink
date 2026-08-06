import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { SimulatorService } from './simulator.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import type { AuthenticatedUser } from '../auth/decorators/get-user.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Simulator')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('simulator')
export class SimulatorController {
  constructor(private readonly simulatorService: SimulatorService) {}

  @Post('start')
  @ApiOperation({ summary: 'Start end-to-end operational simulation' })
  startSimulation(
    @GetUser() user: AuthenticatedUser,
    @Body() body: { vehicles?: number; trips?: number; anomalies?: number },
  ) {
    return this.simulatorService.startSimulation(user.companyId, {
      vehicles: body.vehicles || 10,
      trips: body.trips || 20,
      anomalies: body.anomalies || 2,
    });
  }
}
