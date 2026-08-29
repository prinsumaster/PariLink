'use client';

import { Trip } from '@/types/trips';
import { Card, CardContent } from '@/components/ui/card';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import 'maplibre-gl/dist/maplibre-gl.css';
import { rasterStyle } from '@/lib/map-style';

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

const INDIAN_CITIES: Record<string, [number, number]> = {
  Pune: [73.8567, 18.5204],
  Delhi: [77.1025, 28.7041],
  'New Delhi': [77.2090, 28.6139],
  Mumbai: [72.8777, 19.0760],
  BLR: [77.5946, 12.9716],
  Bengaluru: [77.5946, 12.9716],
  Bangalore: [77.5946, 12.9716],
  Anand: [72.9289, 22.5645],
  Jaipur: [75.7873, 26.9124],
  Nagpur: [79.0882, 21.1458],
  Chennai: [80.2707, 13.0827],
  Ahmedabad: [72.5714, 23.0225],
  Ahm: [72.5714, 23.0225],
  Surat: [72.8311, 21.1702],
  Rajkot: [70.8022, 22.3039],
  Hyderabad: [78.4867, 17.3850],
  Kolkata: [88.3639, 22.5726],
  Vadodara: [73.1812, 22.3072],
  Indore: [75.8577, 22.7196],
};

function getCityCoords(name?: string, fallback: [number, number] = [73.8567, 18.5204]): [number, number] {
  if (!name) return fallback;
  for (const [city, coords] of Object.entries(INDIAN_CITIES)) {
    if (name.toLowerCase().includes(city.toLowerCase())) return coords;
  }
  return fallback;
}

export function TripMap({ trip }: TripMapProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const mapStyle = rasterStyle(resolvedTheme === 'dark');

  const originName = trip?.origin?.name || trip?.loads?.[0]?.originCity || 'Pune MIDC Hub';
  const destName = trip?.destination?.name || trip?.loads?.[0]?.destinationCity || 'New Delhi Hub';

  const originCoords = trip?.origin?.lng && trip?.origin?.lat 
    ? [trip.origin.lng, trip.origin.lat] as [number, number]
    : getCityCoords(originName, [73.8567, 18.5204]);

  const destCoords = trip?.destination?.lng && trip?.destination?.lat 
    ? [trip.destination.lng, trip.destination.lat] as [number, number]
    : getCityCoords(destName, [77.1025, 28.7041]);

  const [originLng, originLat] = originCoords;
  const [destLng, destLat] = destCoords;

  // Calculate bounding box for origin and destination to fit map
  const minLng = Math.min(originLng, destLng);
  const maxLng = Math.max(originLng, destLng);
  const minLat = Math.min(originLat, destLat);
  const maxLat = Math.max(originLat, destLat);

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
                [minLng - 1.0, minLat - 1.0],
                [maxLng + 1.0, maxLat + 1.0]
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
                  'line-color': '#2563eb',
                  'line-width': 4,
                  'line-dasharray': [2, 2]
                }} 
              />
            </Source>
            
            <Marker longitude={originLng} latitude={originLat} anchor="bottom">
              <div className="flex flex-col items-center">
                <div className="bg-white dark:bg-gray-800 text-xs px-2.5 py-1 rounded shadow-md whitespace-nowrap mb-1 font-medium border border-gray-200 dark:border-gray-700">
                  Origin: {originName}
                </div>
                <div className="w-4 h-4 bg-emerald-600 border-2 border-white rounded-full shadow-lg"></div>
              </div>
            </Marker>
            
            <Marker longitude={destLng} latitude={destLat} anchor="bottom">
              <div className="flex flex-col items-center">
                <div className="bg-white dark:bg-gray-800 text-xs px-2.5 py-1 rounded shadow-md whitespace-nowrap mb-1 font-medium border border-gray-200 dark:border-gray-700">
                  Destination: {destName}
                </div>
                <div className="w-5 h-5 bg-blue-600 border-2 border-white rounded-full shadow-lg flex items-center justify-center">
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
