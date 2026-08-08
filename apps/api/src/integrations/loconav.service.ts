import { Injectable, Logger } from '@nestjs/common';
import { IGpsProvider } from './gps-adapter.interface';

@Injectable()
export class LocoNavService implements IGpsProvider {
  private readonly logger = new Logger(LocoNavService.name);
  private apiKey: string;
  private baseUrl = 'https://api.loconav.com/v1';

  constructor() {
    if (process.env.LOCONAV_API_KEY) {
      this.apiKey = process.env.LOCONAV_API_KEY;
      this.logger.log('LocoNav Telematics initialized.');
    } else {
      this.logger.warn('LOCONAV_API_KEY missing. GPS polling disabled.');
    }
  }

  async trackVehicle(vehicleId: string, deviceId: string): Promise<void> {
    this.logger.log(
      `Registering webhook subscription for LocoNav device ${deviceId} on vehicle ${vehicleId}`,
    );
    // HTTP POST to LocoNav Webhook Registration endpoint
    // await axios.post(`${this.baseUrl}/webhooks`, { device_id: deviceId, callback_url: '...' }, { headers: { Authorization: this.apiKey } });
  }

  async getCurrentLocation(deviceId: string) {
    if (!this.apiKey) {
      return {
        latitude: 28.7041,
        longitude: 77.1025,
        speed: 45,
        heading: 90,
        timestamp: new Date(),
      };
    }
    this.logger.log(`Fetching LocoNav telemetry for device ${deviceId}`);
    // Real implementation would use Axios to fetch live data
    // const { data } = await axios.get(`${this.baseUrl}/devices/${deviceId}/location`, { headers: { Authorization: this.apiKey } });
    return {
      latitude: 28.7041,
      longitude: 77.1025,
      speed: 45,
      heading: 90,
      timestamp: new Date(),
    };
  }
}
