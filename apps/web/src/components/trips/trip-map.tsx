'use client';

import { Trip } from '@/types/trips';
import { Card, CardContent } from '@/components/ui/card';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import 'maplibre-gl/dist/maplibre-gl.css';

const Map = dynamic(() => import('react-map-gl/maplibre'), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-gray-100 dark:bg-gray-800 animate-pulse flex items-center justify-center">Loading Map Engine...</div>
});

const Marker = dynamic(() => import('react-map-gl/maplibre').then(mod => mod.Marker), { ssr: false });
const Source = dynamic(() => import('react-map-gl/maplibre').then(mod => mod.Source), { ssr: false });
const Layer = dynamic(() => import('react-map-gl/maplibre').then(mod => mod.Layer), { ssr: false });

interface TripMapProps {
  trip: Trip;
}

export function TripMap({ trip }: TripMapProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const mapStyle = resolvedTheme === 'dark' 
    ? 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json'
    : 'https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json';

  const originLng = trip?.origin?.lng ?? -96.7970;
  const originLat = trip?.origin?.lat ?? 32.7767;
  const destLng = trip?.destination?.lng ?? -97.7431;
  const destLat = trip?.destination?.lat ?? 30.2672;

  // Calculate bounding box for origin and destination to fit map
  const minLng = Math.min(originLng, destLng);
  const maxLng = Math.max(originLng, destLng);
  const minLat = Math.min(originLat, destLat);
  const maxLat = Math.max(originLat, destLat);

  // Simplified route line logic (straight line) for the placeholder. Real implementation would use Mapbox Directions API GeoJSON.
  const routeGeoJSON: any = {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'LineString',
      coordinates: [
        [originLng, originLat],
        [destLng, destLat]
      ]
    }
  };

  return (
    <Card className="h-full min-h-[400px] overflow-hidden rounded-lg">
      <CardContent className="p-0 h-full w-full">
        {mounted && (
          <Map
            initialViewState={{
              bounds: [
                [minLng - 0.5, minLat - 0.5],
                [maxLng + 0.5, maxLat + 0.5]
              ],
              fitBoundsOptions: { padding: 50 }
            }}
            mapStyle={mapStyle}
            interactive={true}
          >
            <Source id="route" type="geojson" data={routeGeoJSON}>
              <Layer 
                id="route-line" 
                type="line" 
                paint={{
                  'line-color': '#3b82f6',
                  'line-width': 4,
                  'line-dasharray': [2, 2]
                }} 
              />
            </Source>
            
            <Marker longitude={originLng} latitude={originLat} anchor="bottom">
              <div className="flex flex-col items-center">
                <div className="bg-white dark:bg-gray-800 text-xs px-2 py-1 rounded shadow-md whitespace-nowrap mb-1">
                  Origin: {trip?.origin?.name || 'Dallas (Mock)'}
                </div>
                <div className="w-4 h-4 bg-gray-800 border-2 border-white rounded-full shadow-lg"></div>
              </div>
            </Marker>
            
            <Marker longitude={destLng} latitude={destLat} anchor="bottom">
              <div className="flex flex-col items-center">
                <div className="bg-white dark:bg-gray-800 text-xs px-2 py-1 rounded shadow-md whitespace-nowrap mb-1">
                  Destination: {trip?.destination?.name || 'Austin (Mock)'}
                </div>
                <div className="w-5 h-5 bg-blue-500 border-2 border-white rounded-full shadow-lg flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              </div>
            </Marker>
          </Map>
        )}
      </CardContent>
    </Card>
  );
}
