import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { ProcessEngine } from '../platform/bpm/process.engine'; // E.g., for complex dispatch actions

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: '/command',
})
export class CommandGateway {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(CommandGateway.name);

  constructor(private readonly bpm?: ProcessEngine) {}

  @SubscribeMessage('dispatch_action')
  async handleDispatchAction(
    @MessageBody() payload: any,
    @ConnectedSocket() client: Socket,
  ) {
    this.logger.log(
      `Received dispatch command: ${payload.action} for vehicle ${payload.vehicleId}`,
    );

    // In production, we authenticate and authorize the socket client here.

    // Simulate action processing (e.g. assigning a driver or pausing a trip)
    // If we have a ProcessEngine, we might trigger a BPMN workflow here.

    // Acknowledge the command back to the sender
    client.emit('command_ack', {
      status: 'SUCCESS',
      action: payload.action,
      timestamp: new Date(),
    });

    // Broadcast the state change to the telemetry namespace so everyone sees the update immediately
    // Note: Cross-namespace emission requires the server reference or an event bus.
    // For now, we assume the command triggers a DB change which triggers an event bus emission to TelemetryGateway.
    return { status: 'ACCEPTED' };
  }
}
