import { Controller, Sse, MessageEvent, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { SseService } from './sse.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { GetUser } from '../../auth/decorators/get-user.decorator';
import type { AuthenticatedUser } from '../../auth/decorators/get-user.decorator';

@ApiTags('communications')
@ApiBearerAuth()
@Controller('communications/realtime')
export class SseController {
  constructor(private readonly sseService: SseService) {}

  @UseGuards(JwtAuthGuard)
  @Sse('stream')
  @ApiOperation({ summary: 'Real-time SSE stream for notifications and chat' })
  stream(@GetUser() user: AuthenticatedUser): Observable<MessageEvent> {
    return this.sseService.subscribe(user.userId).pipe(
      filter(
        (payload) =>
          payload.userId === user.userId ||
          payload.event.targetCompanyId === user.companyId,
      ),
      map((payload) => ({
        data: payload.event,
      })),
    );
  }
}
