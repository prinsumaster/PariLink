export interface IGpsProvider {
  /**
   * Initializes the webhook or polling mechanism for a given vehicle.
   */
  trackVehicle(vehicleId: string, deviceId: string): Promise<void>;

  /**
   * Fetches the current live coordinates from the provider's API.
   */
  getCurrentLocation(deviceId: string): Promise<{
    latitude: number;
    longitude: number;
    speed: number;
    heading: number;
    timestamp: Date;
  }>;
}
