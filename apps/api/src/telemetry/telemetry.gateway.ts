import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'; // Assume we have a WS version or we authenticate on connect

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: '/telemetry',
})
export class TelemetryGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(TelemetryGateway.name);

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);

    // In production, we extract the token from headers/query, verify JWT,
    // and then join the user to their company's room.
    const companyId = client.handshake.query.companyId as string;

    if (companyId) {
      client.join(`company_${companyId}`);
      this.logger.log(`Client ${client.id} joined room company_${companyId}`);
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  /**
   * Broadcast a telemetry update (location, speed, ETA) for a specific vehicle.
   * This is typically called internally by our TelemetryIngressService when
   * a truck's IoT device sends a ping via REST or MQTT.
   */
  broadcastVehicleUpdate(companyId: string, update: any) {
    // We broadcast to all clients joined in this company's room
    this.server.to(`company_${companyId}`).emit('vehicle_update', update);
  }

  /**
   * Broadcast an event stream item (e.g. Geofence entered, delayed)
   */
  broadcastEvent(companyId: string, event: any) {
    this.server.to(`company_${companyId}`).emit('event_stream', event);
  }

  /**
   * Broadcast an exception (e.g. Overspeeding, Late Delivery)
   */
  broadcastException(companyId: string, exception: any) {
    this.server.to(`company_${companyId}`).emit('exception_alert', exception);
  }

  @OnEvent('GpsPing.Received')
  handleGpsPingReceived(event: any) {
    const { tenantId, payload } = event;
    // Broadcast the full vehicle update (location, speed, etc.)
    this.broadcastVehicleUpdate(tenantId, payload);
  }

  @OnEvent('Geofence.Entered')
  handleGeofenceEntered(event: any) {
    const { tenantId, payload, timestamp } = event;
    this.broadcastEvent(tenantId, {
      type: 'GEOFENCE_ENTERED',
      vehicleId: payload.vehicleId,
      geofenceName: payload.geofenceName,
      timestamp,
    });
  }

  @OnEvent('Geofence.Exited')
  handleGeofenceExited(event: any) {
    const { tenantId, payload, timestamp } = event;
    this.broadcastEvent(tenantId, {
      type: 'GEOFENCE_EXITED',
      vehicleId: payload.vehicleId,
      geofenceName: payload.geofenceName,
      timestamp,
    });
  }

  @OnEvent('Alert.Triggered')
  handleAlertTriggered(event: any) {
    const { tenantId, payload, timestamp } = event;
    this.broadcastException(tenantId, {
      alertId: payload.alertId,
      ruleType: payload.ruleType,
      timestamp,
    });
  }
}
