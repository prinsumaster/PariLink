import { useRef, useState, useEffect, useMemo } from 'react';
'use client';
import { useQuery } from '@tanstack/react-query';
import DeckGL from '@deck.gl/react';
import { ScatterplotLayer, PathLayer } from '@deck.gl/layers';
import Map from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { api } from '@/services/api';
import { Loader2, Wifi, WifiOff, AlertTriangle } from 'lucide-react';
import { useTheme } from 'next-themes';
import { rasterStyle } from '@/lib/map-style';

// ── India-centered initial view (no hardcoded coordinates) ────────────────────
const INDIA_VIEW_STATE = {
  longitude: 78.9629,
  latitude: 20.5937,
  zoom: 5.0,
  pitch: 20,
  bearing: 0,
};

// ── Brand colors ─────────────────────────────────────────────────────────────
const COLOR_MOVING: [number, number, number, number] = [228, 0, 43, 230];  // PariLink Red
const COLOR_IDLE: [number, number, number, number]   = [120, 120, 130, 200]; // muted grey
const COLOR_ROUTE: [number, number, number, number]  = [228, 0, 43, 100];

const REPLAY_SPEED = 10; // 10× real-time

// ── Types ────────────────────────────────────────────────────────────────────
interface FleetVehicle {
  tripId: string;
  vehicleId: string;
  registration: string;
  driverName: string;
  origin: string;
  destination: string;
  latitude: number;
  longitude: number;
  speed: number;
  heading: number;
  lastUpdate: string;
  status: string;
  isSimulated: boolean;
}

interface TrailFix {
  latitude: number;
  longitude: number;
  speed: number;
  heading: number;
  gpsTimestamp: string;
}

// ── Interpolation helper ─────────────────────────────────────────────────────
function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function interpolatePosition(
  fixes: TrailFix[],
  virtualTimeMs: number,
): { lat: number; lng: number; heading: number; speed: number } | null {
  if (!fixes || fixes.length === 0) return null;

  const times = fixes.map((f) => new Date(f.gpsTimestamp).getTime());
  const startMs = times[0];
  const endMs = times[times.length - 1];

  if (virtualTimeMs <= startMs) {
    return { lat: fixes[0].latitude, lng: fixes[0].longitude, heading: fixes[0].heading, speed: fixes[0].speed };
  }
  if (virtualTimeMs >= endMs) {
    const last = fixes[fixes.length - 1];
    return { lat: last.latitude, lng: last.longitude, heading: last.heading, speed: last.speed };
  }

  // Binary search for the surrounding segment
  let lo = 0, hi = fixes.length - 2;
  while (lo < hi) {
    const mid = Math.floor((lo + hi + 1) / 2);
    if (times[mid] <= virtualTimeMs) lo = mid;
    else hi = mid - 1;
  }

  const t0 = times[lo], t1 = times[lo + 1];
  const t = (virtualTimeMs - t0) / (t1 - t0);
  const a = fixes[lo], b = fixes[lo + 1];

  return {
    lat: lerp(a.latitude, b.latitude, t),
    lng: lerp(a.longitude, b.longitude, t),
    heading: lerp(a.heading, b.heading, t),
    speed: lerp(a.speed, b.speed, t),
  };
}

// ── Main component ────────────────────────────────────────────────────────────
export function DispatchFleetMap({
  selectedVehicleId,
  onSelectVehicle,
}: {
  selectedVehicleId: string | null;
  onSelectVehicle: (vehicleId: string | null, tripId: string | null) => void;
}) {
  const { theme } = useTheme();
  const rafRef = useRef<number | null>(null);
  const replayStartWallRef = useRef<number>(Date.now());
  const [virtualTimeMs, setVirtualTimeMs] = useState<number>(0);
  const [interpolated, setInterpolated] = useState<
    Record<string, { lat: number; lng: number; heading: number; speed: number }>
  >({});

  // ── 1. Fetch live fleet map (positions from VehicleLocation via API) ─────
  const { data: fleetData, isLoading } = useQuery<FleetVehicle[]>({
    queryKey: ['dispatch', 'fleet-map'],
    queryFn: async () => {
      const res = await api.get('/dispatch/operations/live-fleet/map');
      return res.data;
    },
    refetchInterval: 5000,
  });

  if (typeof window !== 'undefined') {
    (window as any).__TEST_FLEET_DATA__ = fleetData;
  }

  // ── 2. Fetch trail for selected vehicle ──────────────────────────────────
  const { data: trailData } = useQuery<{ vehicleId: string; isSimulated: boolean; trail: TrailFix[] }>({
    queryKey: ['dispatch', 'trail', selectedVehicleId],
    queryFn: async () => {
      const res = await api.get(`/dispatch/operations/live-fleet/trail/${selectedVehicleId}`);
      return res.data;
    },
    enabled: !!selectedVehicleId,
  });

  const isAnySimulated = !!fleetData?.some((v) => v.isSimulated);

  // ── 3. 10× replay animation loop ────────────────────────────────────────
  useEffect(() => {
    if (!fleetData || fleetData.length === 0) return;

    // Get the earliest fix time across all vehicles as the replay start
    const earliestUpdate = Math.min(
      ...fleetData.map((v) => new Date(v.lastUpdate).getTime()),
    );
    // Virtual clock: wall time delta * REPLAY_SPEED added to earliest fix
    replayStartWallRef.current = Date.now();

    const tick = () => {
      const wallElapsed = Date.now() - replayStartWallRef.current;
      const vt = earliestUpdate + wallElapsed * REPLAY_SPEED;
      setVirtualTimeMs(vt);
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [fleetData]);

  // ── 4. Interpolate each vehicle ─────────────────────────────────────────
  // We use the last 2 fixes from fleetData to interpolate for non-selected vehicles
  // (full trail only fetched for selected vehicle)
  useEffect(() => {
    if (!fleetData) return;

    const next: Record<string, { lat: number; lng: number; heading: number; speed: number }> = {};

    for (const v of fleetData) {
      // For each vehicle we have only the latest fix from the map endpoint.
      // We approximate interpolation using the lastUpdate time.
      const fixTime = new Date(v.lastUpdate).getTime();
      const drift = (virtualTimeMs - fixTime) / 1000; // seconds ahead of last fix
      const speedMs = (v.speed * 1000) / 3600; // km/h → m/s
      const headingRad = (v.heading * Math.PI) / 180;

      // Simple dead-reckoning (1 degree ≈ 111km at equator)
      const dLat = (Math.cos(headingRad) * speedMs * drift) / 111000;
      const dLng =
        (Math.sin(headingRad) * speedMs * drift) /
        (111000 * Math.cos((v.latitude * Math.PI) / 180));

      next[v.vehicleId] = {
        lat: v.latitude + dLat,
        lng: v.longitude + dLng,
        heading: v.heading,
        speed: v.speed,
      };
    }

    // For selected vehicle with trail: use precise interpolation
    if (selectedVehicleId && trailData?.trail && trailData.trail.length > 1) {
      const pos = interpolatePosition(trailData.trail, virtualTimeMs);
      if (pos) {
        next[selectedVehicleId] = { lat: pos.lat, lng: pos.lng, heading: pos.heading, speed: pos.speed };
      }
    }

    setInterpolated(next);
  }, [virtualTimeMs, fleetData, trailData, selectedVehicleId]);

  if (typeof window !== 'undefined') {
    (window as any).__TEST_FLEET_POSITIONS__ = interpolated;
  }

  // ── 5. Build deck.gl layers ──────────────────────────────────────────────
  const layers = useMemo(() => {
    if (!fleetData) return [];

    const vehiclePoints = fleetData.map((v) => {
      const pos = interpolated[v.vehicleId];
      return {
        ...v,
        lat: pos?.lat ?? v.latitude,
        lng: pos?.lng ?? v.longitude,
        currentHeading: pos?.heading ?? v.heading,
        currentSpeed: pos?.speed ?? v.speed,
      };
    });

    const scatterLayer = new ScatterplotLayer({
      id: 'fleet-trucks',
      data: vehiclePoints,
      pickable: true,
      opacity: 0.95,
      stroked: true,
      filled: true,
      radiusMinPixels: 8,
      radiusMaxPixels: 16,
      lineWidthMinPixels: 2,
      getPosition: (d: any) => [d.lng, d.lat],
      getFillColor: (d: any) => (d.currentSpeed > 0 ? COLOR_MOVING : COLOR_IDLE),
      getLineColor: [255, 255, 255, 200],
      getRadius: (d: any) => (d.vehicleId === selectedVehicleId ? 14 : 9),
      onClick: (info: any) => {
        if (info.object) {
          onSelectVehicle(info.object.vehicleId, info.object.tripId);
        }
      },
      updateTriggers: {
        getPosition: interpolated,
        getFillColor: interpolated,
        getRadius: [selectedVehicleId],
      },
    });

    const routeLayer =
      selectedVehicleId && trailData?.trail && trailData.trail.length > 1
        ? new PathLayer({
            id: 'selected-route',
            data: [
              {
                path: trailData.trail.map((f: TrailFix) => [f.longitude, f.latitude]),
                color: COLOR_ROUTE,
              },
            ],
            pickable: false,
            widthMinPixels: 3,
            getPath: (d: any) => d.path,
            getColor: (d: any) => d.color,
          })
        : null;

    return [routeLayer, scatterLayer].filter(Boolean);
  }, [fleetData, interpolated, selectedVehicleId, trailData, onSelectVehicle]);

  const mapStyle = rasterStyle(theme === 'dark');

  return (
    <div className="relative w-full h-full">
      {/* ── DEMO MODE BANNER (non-dismissible) ─────────────────────────────── */}
      {isAnySimulated && (
        <div
          className="absolute top-0 left-0 right-0 z-30 flex items-center justify-center gap-2 py-2 px-4 text-white font-mono text-xs font-bold uppercase tracking-widest select-none"
          style={{ background: '#E4002B', borderBottom: '2px solid #c1001f' }}
          data-testid="demo-banner"
        >
          <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
          DEMO MODE — Simulated telemetry. Connect GPS devices for live tracking.
          <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
        </div>
      )}

      {/* ── Loading overlay ─────────────────────────────────────────────────── */}
      {isLoading && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      {/* ── DeckGL + MapLibre ────────────────────────────────────────────────── */}
      <DeckGL
        initialViewState={INDIA_VIEW_STATE}
        controller={true}
        layers={layers}
        getTooltip={(info: any) =>
          info.object
            ? {
                html: `
                  <div style="font-family:monospace;font-size:11px;line-height:1.6">
                    <b>${info.object.registration ?? info.object.vehicleId}</b><br/>
                    Driver: ${info.object.driverName}<br/>
                    ${info.object.origin} → ${info.object.destination}<br/>
                    Speed: ${Math.round(info.object.currentSpeed ?? 0)} km/h<br/>
                    ${info.object.isSimulated ? '<span style="color:#ff4500">⚠ SIMULATED</span>' : '<span style="color:#10b981">● LIVE</span>'}
                  </div>
                `,
              }
            : null
        }
      >
        <Map mapStyle={mapStyle} style={{ width: '100%', height: '100%' }} />
      </DeckGL>

      {/* ── Bottom-right stats ────────────────────────────────────────────────── */}
      <div className="absolute bottom-6 right-6 z-20 flex flex-col gap-2 items-end pointer-events-none">
        <div className="bg-black/80 backdrop-blur border border-white/10 rounded px-3 py-2 flex items-center gap-3 text-xs font-mono">
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full inline-block" style={{ background: '#E4002B' }} />
            <span className="text-white/80">Moving</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-slate-500 inline-block" />
            <span className="text-white/80">Idle</span>
          </span>
          <span className="w-px h-4 bg-white/20" />
          <span className="text-white/60">{fleetData?.length ?? 0} active</span>
          <span className="w-px h-4 bg-white/20" />
          <span className="text-white/40">10× replay</span>
        </div>

        {/* Connectivity indicator */}
        <div className="bg-black/80 backdrop-blur border border-white/10 rounded px-2 py-1 flex items-center gap-1.5 text-[10px] font-mono">
          {isAnySimulated ? (
            <>
              <WifiOff className="h-3 w-3 text-amber-400" />
              <span className="text-amber-400">DEMO DATA</span>
            </>
          ) : (
            <>
              <Wifi className="h-3 w-3 text-emerald-400" />
              <span className="text-emerald-400">LIVE GPS</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
