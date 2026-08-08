'use client';

import { Vehicle } from '@/types/fleet';
import { Card, CardContent } from '@/components/ui/card';
import { useTheme } from 'next-themes';
import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import 'maplibre-gl/dist/maplibre-gl.css';

const Map = dynamic(() => import('react-map-gl/maplibre'), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-gray-100 dark:bg-gray-800 animate-pulse flex items-center justify-center">Loading Map...</div>
});

const Source = dynamic(() => import('react-map-gl/maplibre').then(mod => mod.Source), { ssr: false });
const Layer = dynamic(() => import('react-map-gl/maplibre').then(mod => mod.Layer), { ssr: false });

interface FleetMapProps {
  vehicles: Vehicle[];
  isLoading: boolean;
}

export function FleetMap({ vehicles, isLoading }: FleetMapProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const geoJsonData = React.useMemo(() => {
    return {
      type: 'FeatureCollection',
      features: vehicles.filter(v => v.location).map(v => ({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [v.location!.lng, v.location!.lat]
        },
        properties: {
          id: v.id,
          registrationNumber: v.registrationNumber,
          status: v.status,
          heading: v.location!.heading,
          color: v.status === 'IN_USE' ? '#3b82f6' : v.status === 'AVAILABLE' ? '#22c55e' : '#f97316'
        }
      }))
    };
  }, [vehicles]);

  const mapStyle = resolvedTheme === 'dark' 
    ? 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json'
    : 'https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json';

  const vehiclesWithLocation = vehicles.filter(v => v.location);

  return (
    <div className="relative w-full h-full">
      {mounted && (
        <Map
          initialViewState={{
            longitude: -98.5795,
            latitude: 39.8283,
            zoom: 3.5
          }}
          mapStyle={mapStyle}
          interactive={true}
        >
          <Source id="fleet-data" type="geojson" data={geoJsonData as any}>
            <Layer
              id="fleet-points"
              type="circle"
              paint={{
                'circle-radius': 6,
                'circle-color': ['get', 'color'],
                'circle-stroke-width': 2,
                'circle-stroke-color': '#ffffff'
              }}
            />
          </Source>
        </Map>
      )}
      
      {isLoading && (
        <div className="absolute inset-0 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      )}
      
      <div className="absolute bottom-4 left-4 right-4 flex gap-2">
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur px-3 py-2 rounded-md shadow-lg text-xs font-medium flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-500"></span> In Use
        </div>
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur px-3 py-2 rounded-md shadow-lg text-xs font-medium flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500"></span> Available
        </div>
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur px-3 py-2 rounded-md shadow-lg text-xs font-medium flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-orange-500"></span> Maintenance
        </div>
      </div>
    </div>
  );
}
