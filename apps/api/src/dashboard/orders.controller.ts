import { Controller, Get, Req, UseGuards, Query } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  
  @Get()
  async getOrders(@Req() req: any, @Query() query: any) {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 20;
    
    // Return mock paginated orders for now
    return {
      data: [],
      meta: {
        total: 0,
        page,
        limit,
        totalPages: 0,
      }
    };
  }
}
