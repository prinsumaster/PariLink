import { Controller, Sse, MessageEvent, UseGuards, Req } from '@nestjs/common';
import { RealtimeService } from './realtime.service';
import { Observable } from 'rxjs';
// import { JwtAuthGuard } from '../../auth/jwt-auth.guard'; // Assume auth guard exists, keeping simple for demo

@Controller('realtime')
export class RealtimeController {
  constructor(private readonly realtimeService: RealtimeService) {}

  @Sse('stream')
  // @UseGuards(JwtAuthGuard) // Commented out to avoid setup issues for this phase
  stream(@Req() req: any): Observable<MessageEvent> {
    // In a real app, we extract tenantId/userId from req.user
    // For this implementation, we use a global demo tenant
    const tenantId = req.user?.companyId || 'DEMO_COMPANY';

    return this.realtimeService.subscribeToCompanyEvents(tenantId);
  }
}
