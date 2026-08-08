'use client';

import { LiveVehicle } from '@/types/dashboard';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { MapIcon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

// Dynamic import maplibre to avoid SSR issues
import dynamic from 'next/dynamic';
import 'maplibre-gl/dist/maplibre-gl.css';

const Map = dynamic(() => import('react-map-gl/maplibre'), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-gray-100 dark:bg-gray-800 animate-pulse flex items-center justify-center">Loading Map Engine...</div>
});

const Marker = dynamic(() => import('react-map-gl/maplibre').then(mod => mod.Marker), { ssr: false });

interface LiveMapProps {
  vehicles?: LiveVehicle[];
  isLoading: boolean;
}

export function LiveMap({ vehicles = [], isLoading }: LiveMapProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Standard OpenStreetMap base map for simplicity in this implementation without Mapbox tokens
  const mapStyle = resolvedTheme === 'dark' 
    ? 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json'
    : 'https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json';

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
              <span className="w-2 h-2 rounded-full bg-green-500 mr-1.5 animate-pulse"></span>
              Live
            </span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 p-0 relative">
        {mounted && (
          <Map
            initialViewState={{
              longitude: -98.5795, // Center of US roughly
              latitude: 39.8283,
              zoom: 3.5
            }}
            mapStyle={mapStyle}
            interactive={true}
          >
            {vehicles.map(vehicle => (
              <Marker
                key={vehicle.id}
                longitude={vehicle.lng}
                latitude={vehicle.lat}
                anchor="center"
              >
                <div 
                  className={`w-4 h-4 rounded-full border-2 border-white shadow-lg flex items-center justify-center transition-transform hover:scale-125
                    ${vehicle.status === 'IN_TRANSIT' ? 'bg-blue-500' : 
                      vehicle.status === 'IDLE' ? 'bg-yellow-500' : 'bg-red-500'}`}
                  title={`${vehicle.name} (${vehicle.status}) - ${vehicle.speed}mph`}
                  style={{ transform: `rotate(${vehicle.heading}deg)` }}
                >
                  {/* Directional indicator could go here */}
                  <div className="w-1 h-1 bg-white rounded-full"></div>
                </div>
              </Marker>
            ))}
          </Map>
        )}
      </CardContent>
    </Card>
  );
}
