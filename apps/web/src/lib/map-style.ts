import type { StyleSpecification } from 'maplibre-gl';

/**
 * Raster basemap helper — uses OpenStreetMap tiles (100% free, no API key).
 * OSM is far more reliable than vector GL styles for demos.
 */
export function rasterStyle(dark = false): StyleSpecification {
  // OSM tile servers — completely free, no key required, no watermarks.
  // For dark mode we use a free dark OSM variant from CartoDB (no key needed for the basic raster).
  const lightTiles = [
    'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    'https://a.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png',
  ];
  const darkTiles = [
    'https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
    'https://b.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
  ];

  return {
    version: 8,
    sources: {
      base: {
        type: 'raster',
        tiles: dark ? darkTiles : lightTiles,
        tileSize: 256,
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        minzoom: 0,
        maxzoom: 19,
      },
    },
    layers: [
      {
        id: 'base',
        type: 'raster',
        source: 'base',
        minzoom: 0,
        maxzoom: 22,
      },
    ],
  } as StyleSpecification;
}

