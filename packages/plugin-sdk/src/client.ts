import axios, { AxiosInstance } from 'axios';

export interface PariLinkClientOptions {
  apiKey: string;
  baseUrl?: string;
}

export class PariLinkClient {
  private api: AxiosInstance;

  constructor(options: PariLinkClientOptions) {
    this.api = axios.create({
      baseURL: options.baseUrl || 'https://api.parilink.com/v1',
      headers: {
        'Authorization': `Bearer ${options.apiKey}`,
        'Content-Type': 'application/json',
        'X-PariLink-SDK': '1.0.0'
      }
    });
  }

  // Common Platform Helpers
  async getCompanyProfile() {
    const res = await this.api.get('/company');
    return res.data;
  }

  async getTrips(params?: any) {
    const res = await this.api.get('/trips', { params });
    return res.data;
  }

  async getTrip(tripId: string) {
    const res = await this.api.get(`/trips/${tripId}`);
    return res.data;
  }

  // Extend with Order, Dispatch, Fleet, etc.
}
