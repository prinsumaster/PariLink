'use client';

import React, { useMemo } from 'react';
import Map from 'react-map-gl/maplibre';
import DeckGL from '@deck.gl/react';
import { ScatterplotLayer, IconLayer } from '@deck.gl/layers';
import { useControlTowerStore } from '../../store/control-tower.store';
import 'maplibre-gl/dist/maplibre-gl.css';

const INITIAL_VIEW_STATE = {
  longitude: 78.9629, // Center of India
  latitude: 20.5937,
  zoom: 4,
  pitch: 45,
  bearing: 0,
};

export const LiveMap = () => {
  const vehicles = useControlTowerStore((state) => Object.values(state.vehicles));

  const layers = useMemo(() => {
    return [
      new ScatterplotLayer({
        id: 'vehicle-glow-layer',
        data: vehicles,
        getPosition: (d) => [d.longitude, d.latitude],
        getFillColor: (d) => {
          if (d.status === 'DELAYED') return [239, 68, 68, 200]; // Red
          if (d.status === 'IDLE') return [234, 179, 8, 200]; // Yellow
          return [34, 197, 94, 200]; // Green
        },
        getRadius: (d) => (d.status === 'DELAYED' ? 15000 : 8000), // Larger glow for delayed
        pickable: true,
        stroked: true,
        getLineColor: [255, 255, 255, 100],
        lineWidthMinPixels: 1,
        radiusMinPixels: 4,
        radiusMaxPixels: 20,
        transitions: {
          getPosition: 300, // Smooth interpolation between pings
        },
      }),
      // For thousands of trucks, IconLayer with an atlas is better, but Scatterplot is sufficient for a colored dot MVP.
    ];
  }, [vehicles]);

  return (
    <div className="w-full h-full relative">
      <DeckGL
        initialViewState={INITIAL_VIEW_STATE}
        controller={true}
        layers={layers}
        getTooltip={({ object }) => object && `Vehicle: ${object.id}\nSpeed: ${object.speed} km/h\nStatus: ${object.status}`}
      >
        <Map
          mapStyle="https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
          attributionControl={false}
        />
      </DeckGL>
    </div>
  );
};
