'use client';

import React, { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import DeckGL from '@deck.gl/react';
import { ScatterplotLayer, IconLayer } from '@deck.gl/layers';
import Map from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { api } from '@/services/api';
import { Loader2 } from 'lucide-react';
import { useTheme } from 'next-themes';

const INITIAL_VIEW_STATE = {
  longitude: -98.5795,
  latitude: 39.8283,
  zoom: 4,
  pitch: 0,
  bearing: 0
};

export function LiveFleetMap({ selectedTrip }: { selectedTrip: string | null }) {
  const { theme } = useTheme();

  const { data: mapData, isLoading } = useQuery({
    queryKey: ['occ', 'fleet-map'],
    queryFn: async () => {
      const res = await api.get('/intelligence/occ/fleet-map');
      return res.data;
    },
    refetchInterval: 5000,
  });

  const layers = useMemo(() => {
    if (!mapData) return [];
    
    // Process state which is JSONb: { location: { lat, lng } }
    const points = mapData
      .filter((d: any) => d.state?.location?.lat && d.state?.location?.lng)
      .map((d: any) => ({
        id: d.twinId,
        coordinates: [d.state.location.lng, d.state.location.lat],
        color: d.state.status === 'IN_TRANSIT' ? [16, 185, 129] : [244, 63, 94], // emerald / rose
      }));

    return [
      new ScatterplotLayer({
        id: 'fleet-layer',
        data: points,
        pickable: true,
        opacity: 0.8,
        stroked: true,
        filled: true,
        radiusScale: 6,
        radiusMinPixels: 4,
        radiusMaxPixels: 12,
        lineWidthMinPixels: 1,
        getPosition: (d: any) => d.coordinates,
        getFillColor: (d: any) => d.color,
        getLineColor: [255, 255, 255] as any,
      })
    ];
  }, [mapData]);

  const mapStyle = theme === 'dark' 
    ? 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json'
    : 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json';

  return (
    <div className="relative w-full h-full bg-slate-100 dark:bg-slate-900">
      {isLoading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
        </div>
      )}
      
      <DeckGL
        initialViewState={INITIAL_VIEW_STATE}
        controller={true}
        layers={layers}
        getTooltip={(info: any) => info.object && `Vehicle: ${info.object.id}`}
      >
        <Map mapStyle={mapStyle} />
      </DeckGL>

      {/* Map Overlay Stats */}
      <div className="absolute bottom-6 right-6 z-20 flex gap-2">
        <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur border border-slate-200 dark:border-slate-800 rounded-lg p-3 shadow-lg flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
            <span className="text-xs font-medium text-slate-700 dark:text-slate-300">In Transit</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]"></div>
            <span className="text-xs font-medium text-slate-700 dark:text-slate-300">Stopped/Delayed</span>
          </div>
          <div className="w-px h-4 bg-slate-300 dark:bg-slate-700 mx-1"></div>
          <div className="text-xs text-slate-500 font-mono">
            {mapData?.length || 0} active twins
          </div>
        </div>
      </div>
    </div>
  );
}
