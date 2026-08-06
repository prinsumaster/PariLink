// ─────────────────────────────────────────────────────────────────────────────
// PariLink Mobile — Location Service
// Battery-efficient GPS tracking with adaptive sampling rates.
// When trip is active → 10s interval (high accuracy).
// When trip is idle   → 60s interval (low power).
// Pings are queued offline and flushed on reconnect.
// ─────────────────────────────────────────────────────────────────────────────

import Geolocation, { GeolocationResponse } from '@react-native-community/geolocation';
import NetInfo from '@react-native-community/netinfo';
import { MobileAPI } from '../api/client';
import { OfflineQueue } from '../../offline/OfflineQueue';
import { store } from '../../store';
import { setTracking } from '../../store/slices/tripsSlice';

const HIGH_ACCURACY_INTERVAL_MS = 10_000;
const LOW_POWER_INTERVAL_MS     = 60_000;
const _DISTANCE_FILTER_METERS   = 50; // Reserved for future GPS accuracy tuning

let watchId: ReturnType<typeof setInterval> | null = null;
let currentTripId: string | null = null;

async function sendPing(tripId: string, position: GeolocationResponse): Promise<void> {
  const payload = {
    tripId,
    latitude:   position.coords.latitude,
    longitude:  position.coords.longitude,
    speed:      position.coords.speed ?? undefined,
    heading:    position.coords.heading ?? undefined,
    accuracy:   position.coords.accuracy,
    timestamp:  new Date(position.timestamp).toISOString(),
  };

  const netState = await NetInfo.fetch();
  if (netState.isConnected) {
    await MobileAPI.pingLocation(payload);
  } else {
    await OfflineQueue.enqueue({
      action:    'LOCATION_PING',
      payload,
      timestamp: payload.timestamp,
    });
  }
}

function getCurrentPosition(): Promise<GeoPosition> {
  return new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      timeout:            10000,
      maximumAge:         5000,
    });
  });
}

export const LocationService = {
  start(tripId: string): void {
    if (watchId !== null) {LocationService.stop();}
    currentTripId = tripId;
    store.dispatch(setTracking(true));

    const activeTrip = store.getState().trips.activeTrip;
    const isActive   = activeTrip?.status === 'IN_PROGRESS';
    const interval   = isActive ? HIGH_ACCURACY_INTERVAL_MS : LOW_POWER_INTERVAL_MS;

    watchId = setInterval(async () => {
      try {
        const position = await getCurrentPosition();
        await sendPing(tripId, position);
      } catch (error) {
        // Geolocation failure (user revoked permission) — stop tracking
        console.warn('[LocationService] Geolocation error:', error);
        LocationService.stop();
      }
    }, interval) as unknown as ReturnType<typeof setInterval>;
  },

  stop(): void {
    if (watchId !== null) {
      clearInterval(watchId as unknown as number);
      watchId = null;
    }
    currentTripId = null;
    store.dispatch(setTracking(false));
  },

  isTracking(): boolean {
    return watchId !== null;
  },

  getCurrentTripId(): string | null {
    return currentTripId;
  },
};
