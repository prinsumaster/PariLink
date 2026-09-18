import {
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { Logger } from '@nestjs/common';

@WebSocketGateway({ cors: true })
export class CommandCenterGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(CommandCenterGateway.name);

  constructor(private readonly jwtService: JwtService) {}

  async handleConnection(client: Socket) {
    this.logger.log(`Client attempting connection: ${client.id}`);

    try {
      const authHeader = client.handshake.headers.authorization;
      const token = authHeader?.split(' ')[1] || client.handshake.auth?.token;

      if (!token) {
        throw new Error('No token provided');
      }

      const decoded = this.jwtService.verify(token);
      const companyId = decoded.companyId;

      if (!companyId) {
        throw new Error('No companyId in token payload');
      }

      const roomName = `tenant_${companyId}`;
      client.join(roomName);
      
      // Store on client for convenience
      (client as any).companyId = companyId;

      this.logger.log(`Client ${client.id} joined room: ${roomName}`);
    } catch (error) {
      this.logger.warn(
        `Invalid connection attempt from ${client.id}: ${error.message}`,
      );
      client.disconnect(true);
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  broadcastToTenant(companyId: string, event: string, payload: any) {
    const roomName = `tenant_${companyId}`;
    this.server.to(roomName).emit(event, payload);
    this.logger.debug(`Broadcasted ${event} to ${roomName}`);
  }
}
