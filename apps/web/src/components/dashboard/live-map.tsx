'use client';

import { LiveVehicle } from '@/types/dashboard';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { MapIcon, Truck } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import 'maplibre-gl/dist/maplibre-gl.css';
import { rasterStyle } from '@/lib/map-style';

// City coordinates for known freight hubs
const CITY_COORDS: Record<string, [number, number]> = {
  Mumbai: [72.8777, 19.076],
  Delhi: [77.1025, 28.7041],
  Bengaluru: [77.5946, 12.9716],
  Pune: [73.8567, 18.5204],
  Ahmedabad: [72.5714, 23.0225],
  Surat: [72.8311, 21.1702],
  Jaipur: [75.7873, 26.9124],
  Chennai: [80.2707, 13.0827],
  Nagpur: [79.0882, 21.1458],
  Anand: [72.9574, 22.5645],
};

// Seeded route pins for demo
const DEMO_ROUTES = [
  { from: 'Ahmedabad', to: 'Mumbai', status: 'IN_TRANSIT' as const },
  { from: 'Delhi', to: 'Ahmedabad', status: 'IN_TRANSIT' as const },
  { from: 'Mumbai', to: 'Bengaluru', status: 'IN_TRANSIT' as const },
  { from: 'Surat', to: 'Jaipur', status: 'PLANNED' as const },
  { from: 'Pune', to: 'Nagpur', status: 'IN_TRANSIT' as const },
  { from: 'Chennai', to: 'Bengaluru', status: 'IN_TRANSIT' as const },
];

const Map = dynamic(() => import('react-map-gl/maplibre'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 dark:from-gray-800 dark:to-gray-900 animate-pulse flex items-center justify-center">
      <div className="text-slate-500 text-sm">Loading Map Engine...</div>
    </div>
  ),
});

const Marker = dynamic(
  () => import('react-map-gl/maplibre').then(mod => mod.Marker),
  { ssr: false }
);

interface LiveMapProps {
  vehicles?: LiveVehicle[];
  isLoading: boolean;
}

// ── India SVG Fallback ─────────────────────────────────────────────────────
function IndiaFallback() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 relative overflow-hidden">
      {/* Simplified India outline SVG */}
      <svg
        viewBox="0 0 400 460"
        className="absolute inset-0 w-full h-full opacity-10"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path d="M 180 20 L 200 25 L 240 30 L 280 45 L 300 60 L 310 90 L 320 120 L 315 150 L 300 180 L 310 210 L 290 240 L 270 270 L 260 300 L 240 330 L 220 360 L 200 400 L 185 420 L 175 400 L 160 370 L 145 340 L 130 310 L 120 280 L 110 250 L 100 220 L 95 190 L 100 160 L 95 130 L 110 100 L 130 75 L 155 50 L 175 30 Z" />
      </svg>

      {/* City pin dots */}
      {DEMO_ROUTES.map((route, i) => {
        const fromCoords = CITY_COORDS[route.from];
        const toCoords = CITY_COORDS[route.to];
        if (!fromCoords || !toCoords) return null;

        // Rough geo-to-SVG projection (India spans ~68E–98E, 8N–37N)
        const project = (lng: number, lat: number) => ({
          x: ((lng - 68) / 30) * 320 + 40,
          y: ((37 - lat) / 29) * 400 + 30,
        });

        const from = project(fromCoords[0], fromCoords[1]);
        const to = project(toCoords[0], toCoords[1]);

        return (
          <svg key={i} viewBox="0 0 400 460" className="absolute inset-0 w-full h-full pointer-events-none">
            <line
              x1={from.x} y1={from.y}
              x2={to.x} y2={to.y}
              stroke={route.status === 'IN_TRANSIT' ? '#E4002B' : '#94a3b8'}
              strokeWidth="1.5"
              strokeDasharray={route.status === 'PLANNED' ? '4 3' : undefined}
              opacity={0.7}
            />
            <circle cx={from.x} cy={from.y} r="5" fill="#E4002B" />
            <circle cx={to.x} cy={to.y} r="5" fill="#111418" />
          </svg>
        );
      })}

      {/* City labels */}
      <div className="absolute inset-0 w-full h-full">
        {Object.entries(CITY_COORDS).map(([city, [lng, lat]]) => {
          const x = ((lng - 68) / 30) * 100;
          const y = ((37 - lat) / 29) * 100;
          return (
            <div
              key={city}
              className="absolute flex flex-col items-center"
              style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -50%)' }}
            >
              <div className="w-2 h-2 rounded-full bg-slate-500 dark:bg-slate-400" />
              <span className="text-[9px] font-medium text-slate-600 dark:text-slate-300 whitespace-nowrap mt-0.5 bg-white/70 dark:bg-gray-900/70 px-1 rounded">
                {city}
              </span>
            </div>
          );
        })}
      </div>

      {/* Truck icons for active routes */}
      {DEMO_ROUTES.filter(r => r.status === 'IN_TRANSIT').map((route, i) => {
        const fromCoords = CITY_COORDS[route.from];
        const toCoords = CITY_COORDS[route.to];
        if (!fromCoords || !toCoords) return null;
        const midLng = (fromCoords[0] + toCoords[0]) / 2;
        const midLat = (fromCoords[1] + toCoords[1]) / 2;
        const x = ((midLng - 68) / 30) * 100;
        const y = ((37 - midLat) / 29) * 100;

        return (
          <div
            key={`truck-${i}`}
            className="absolute"
            style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -50%)' }}
          >
            <div className="w-6 h-6 rounded-full bg-[#E4002B] flex items-center justify-center shadow-lg animate-pulse">
              <Truck className="w-3.5 h-3.5 text-white" />
            </div>
          </div>
        );
      })}

      <div className="absolute bottom-4 left-0 right-0 flex justify-center">
        <div className="bg-white/90 dark:bg-gray-900/90 rounded-full px-4 py-1.5 shadow text-xs font-medium text-slate-600 dark:text-slate-300 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          Live tracking — {DEMO_ROUTES.filter(r => r.status === 'IN_TRANSIT').length} vehicles in transit
        </div>
      </div>
    </div>
  );
}

// @ts-ignore: reserved
export function LiveMap({ vehicles = [], isLoading: _isLoading }: LiveMapProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [mapError, setMapError] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Fallback timer — if map tiles haven't loaded in 5s, show India SVG
    const timer = setTimeout(() => {
      setMapError(prev => prev); // no-op; actual error sets it
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  const mapStyle = rasterStyle(resolvedTheme === 'dark');

  // Build pins: prefer live vehicle positions; fill with demo city coords
  const pins = vehicles.length > 0
    ? vehicles.map(v => ({ id: v.id, lat: v.lat, lng: v.lng, status: v.status }))
    : DEMO_ROUTES.filter(r => r.status === 'IN_TRANSIT').map((r, i) => {
        const from = CITY_COORDS[r.from];
        const to = CITY_COORDS[r.to];
        if (!from || !to) return null;
        return {
          id: `demo-${i}`,
          lng: (from[0] + to[0]) / 2,
          lat: (from[1] + to[1]) / 2,
          status: 'IN_TRANSIT' as const,
        };
      }).filter(Boolean);

  return (
    <Card className="col-span-full h-[500px] flex flex-col overflow-hidden">
      <CardHeader className="pb-3 z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm absolute top-0 left-0 right-0 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-lg">
              <MapIcon className="h-5 w-5" /> Live Fleet Tracking
            </CardTitle>
            <CardDescription>Real-time vehicle telemetry across the network</CardDescription>
          </div>
          <div className="flex gap-2">
            <span className="flex items-center text-xs font-medium text-gray-500">
              <span className="w-2 h-2 rounded-full bg-green-500 mr-1.5 animate-pulse" />
              Live
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 h-full w-full p-0 relative pt-[73px]">
        {!mounted ? (
          <div className="w-full h-full bg-gray-100 dark:bg-gray-800 animate-pulse" />
        ) : mapError ? (
          <IndiaFallback />
        ) : (
          <Map
            initialViewState={{
              longitude: 78.9,
              latitude: 22.5,
              zoom: 4,
            }}
            mapStyle={mapStyle}
            style={{ width: '100%', height: '100%' }}
            interactive={true}
            onError={() => setMapError(true)}
          >
            {(pins as NonNullable<typeof pins[0]>[]).map(pin => (
              <Marker
                key={pin.id}
                longitude={pin.lng}
                latitude={pin.lat}
                anchor="center"
              >
                <div
                  className={`w-5 h-5 rounded-full border-2 border-white shadow-lg flex items-center justify-center
                    ${pin.status === 'IN_TRANSIT' ? 'bg-[#E4002B]' :
                      pin.status === 'IDLE' ? 'bg-yellow-500' : 'bg-red-500'}`}
                  title={`Vehicle (${pin.status})`}
                >
                  <Truck className="w-2.5 h-2.5 text-white" />
                </div>
              </Marker>
            ))}
          </Map>
        )}
      </CardContent>
    </Card>
  );
}
