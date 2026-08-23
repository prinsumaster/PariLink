'use client';

import { useState, useEffect, useRef } from 'react';
import Map, { Marker, MapRef } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Navigation, Search, Filter, X, ChevronRight, Activity, Play } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { fleetService } from '@/services/fleet';

export default function DispatchPage() {
  const mapRef = useRef<MapRef>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);
  
  // Replay State
  const [locations, setLocations] = useState<any[]>([]);
  const [progress, setProgress] = useState(0);
  const loads = [{ id: 'LOD-9402', referenceNumber: 'LOD-9402', status: 'IN_TRANSIT', originCity: 'Austin, TX', destinationCity: 'Dallas, TX', rate: 1250 }];
  const vehicles = [
    { id: 'v1', licensePlate: 'TX-8492', make: 'Freightliner', model: 'Cascadia', status: 'IN_SERVICE' },
    { id: 'v2', licensePlate: 'CA-1122', make: 'Volvo', model: 'VNL', status: 'AVAILABLE' }
  ];

  // Fetch Replay Data
  useEffect(() => {
    let active = true;
    fleetService.getLocations().then((data) => {
      if (active && data && data.length > 0) {
        setLocations(data);
      }
    });
    return () => { active = false; };
  }, []);

  // Animate vehicles along the route (Replay Mode)
  useEffect(() => {
    if (locations.length < 2) return;
    
    let animationFrame: number;
    // We will sweep through all locations in about 20 seconds.
    // 0 -> 1 progress
    let startTimestamp: number | null = null;
    const DURATION_MS = 20000;
    
    const animate = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const elapsed = timestamp - startTimestamp;
      let currentProgress = (elapsed % DURATION_MS) / DURATION_MS;
      
      setProgress(currentProgress);
      animationFrame = requestAnimationFrame(animate);
    };
    
    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [locations]);

  // Removed camera flyTo to prevent WebGL context crash in headless Playwright


  return (
    <div className="-mx-4 sm:-mx-6 md:-mx-8 -my-6 h-[calc(100vh-64px)] relative overflow-hidden bg-[#0A0A0A] text-[#FAFAFA]">
      
      {/* Mobile Desktop-Recommended Overlay */}
      <div className="md:hidden absolute inset-0 z-50 bg-[#0A0A0A]/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
        <Activity className="h-12 w-12 text-[#FF4500] mb-4" />
        <h2 className="text-xl font-bold mb-2 font-mono tracking-wide text-white">Desktop Recommended</h2>
        <p className="text-gray-400 text-sm">The live dispatch workspace is optimized for larger screens to track fleets and analyze routes.</p>
        <button className="mt-6 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 font-mono text-xs text-white uppercase tracking-widest transition-colors" onClick={(e) => (e.currentTarget.parentElement as HTMLElement).style.display = 'none'}>
          Continue Anyway
        </button>
      </div>

      {/* Full Bleed Map */}
      <Map
        ref={mapRef}
        initialViewState={{
          longitude: -97.7431,
          latitude: 30.2672,
          zoom: 7
        }}
        mapStyle="https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
        interactiveLayerIds={['markers']}
      >
        {vehicles.map((v, i) => {
          if (locations.length < 2) return null;
          
          const segmentCount = locations.length - 1;
          const totalProgress = progress * segmentCount;
          const segmentIndex = Math.floor(totalProgress);
          const segmentProgress = totalProgress - segmentIndex;
          
          const p1 = locations[segmentIndex];
          const p2 = locations[Math.min(segmentIndex + 1, segmentCount)];
          
          const lng = p1.longitude + (p2.longitude - p1.longitude) * segmentProgress;
          const lat = p1.latitude + (p2.latitude - p1.latitude) * segmentProgress;
          
          // Use heading from db if available, otherwise calculate it
          let heading = p1.heading;
          if (heading === undefined || heading === null) {
            const dx = p2.longitude - p1.longitude;
            const dy = p2.latitude - p1.latitude;
            heading = Math.atan2(dx, dy) * (180 / Math.PI);
          }

          const isActive = v.status === 'IN_SERVICE';
          const isSelected = selectedVehicle === v.id;

          return (
            <Marker 
              key={v.id} 
              longitude={lng} 
              latitude={lat}
              onClick={e => {
                e.originalEvent.stopPropagation();
                setSelectedVehicle(v.id);
              }}
              style={{ cursor: 'pointer' }}
            >
              <div 
                data-vehicle-id={v.id}
                className="transition-colors duration-150"
                style={{
                  transform: `rotate(${heading}deg)`,
                  color: isSelected ? '#FFFFFF' : (isActive ? '#FF4500' : '#71717A'),
                  filter: isSelected ? 'drop-shadow(0 0 8px rgba(255,69,0,0.8))' : 'none'
                }}
              >
                <Navigation size={24} fill="currentColor" />
              </div>
            </Marker>
          );
        })}
      </Map>

      {/* Frosted Glass Chrome: Top Navigation / Search */}
      <div className="absolute top-0 left-0 right-0 p-4 pointer-events-none z-10 flex gap-4">
        <div className="glass rounded-none border border-white/10 px-4 py-2 flex items-center gap-3 w-80 pointer-events-auto">
          <Search size={14} className="text-gray-400" />
          <input 
            type="text" 
            placeholder="Search assets..." 
            className="bg-transparent border-none outline-none text-xs w-full placeholder:text-gray-500 text-white font-mono"
          />
        </div>
        <div className="glass rounded-none border border-white/10 px-3 py-2 flex items-center gap-2 pointer-events-auto cursor-pointer hover:bg-white/5 transition-colors">
          <Filter size={14} className="text-gray-400" />
          <span className="text-xs font-mono uppercase tracking-widest text-gray-400">Filter</span>
        </div>
        <div className="bg-red-500/20 border border-red-500/50 rounded-none px-3 py-2 flex items-center gap-2 pointer-events-auto">
          <Play size={14} className="text-red-400" />
          <span className="text-xs font-mono uppercase tracking-widest text-red-400 font-bold">REPLAY MODE</span>
        </div>
      </div>

      {/* Frosted Glass Chrome: Bottom Status Bar */}
      <div className="absolute bottom-0 left-0 right-0 p-4 pointer-events-none z-10">
        <div className="glass border border-white/10 px-4 py-2 flex items-center justify-between pointer-events-auto">
          <div className="flex gap-6">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#FF4500]"></div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-gray-400">Live Telemetry</span>
            </div>
            <div className="flex items-center gap-2">
              <Activity size={12} className="text-gray-500" />
              <span className="text-[10px] font-mono uppercase tracking-widest text-gray-400">
                {vehicles.filter(v => v.status === 'IN_SERVICE').length} Active Assets
              </span>
            </div>
          </div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-gray-500">PariLink OS v2.0</span>
        </div>
      </div>

      {/* Slide-in Context Panel */}
      <AnimatePresence>
        {selectedVehicle && (
          <motion.div 
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            transition={{ ease: "easeOut", duration: 0.2 }}
            className="absolute top-0 right-0 bottom-0 w-[400px] glass border-l border-white/10 flex flex-col z-20 pointer-events-auto"
          >
            {(() => {
              const v = vehicles.find(v => v.id === selectedVehicle);
              if (!v) return null;
              
              return (
                <>
                  <div className="p-6 border-b border-white/10 flex justify-between items-start">
                    <div>
                      <h2 className="text-xl font-medium tracking-tight mb-1">{v.licensePlate}</h2>
                      <p className="text-xs font-mono uppercase tracking-widest text-gray-500">{v.make} {v.model}</p>
                    </div>
                    <button 
                      onClick={() => setSelectedVehicle(null)}
                      className="p-1 hover:bg-white/10 rounded transition-colors text-gray-400 hover:text-white"
                    >
                      <X size={16} />
                    </button>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8">
                    {/* Status Block */}
                    <div className="space-y-2">
                      <p className="text-[10px] font-mono uppercase tracking-widest text-gray-500">Status</p>
                      <div className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#FF4500]"></div>
                        <span className="text-sm text-[#FF4500] uppercase tracking-wider font-mono">In Service</span>
                      </div>
                    </div>

                    {/* Telemetry Block */}
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-1">
                        <p className="text-[10px] font-mono uppercase tracking-widest text-gray-500">Speed</p>
                        <p className="text-2xl font-light">68 <span className="text-xs text-gray-500 font-mono">mph</span></p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-mono uppercase tracking-widest text-gray-500">Fuel</p>
                        <p className="text-2xl font-light">84 <span className="text-xs text-gray-500 font-mono">%</span></p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-mono uppercase tracking-widest text-gray-500">Heading</p>
                        <p className="text-2xl font-light">NNE</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-mono uppercase tracking-widest text-gray-500">Temp</p>
                        <p className="text-2xl font-light">-2 <span className="text-xs text-gray-500 font-mono">°C</span></p>
                      </div>
                    </div>

                    {/* Active Load Assignment (High Density Rows: 28px target) */}
                    <div className="space-y-3">
                      <p className="text-[10px] font-mono uppercase tracking-widest text-gray-500">Active Load</p>
                      <div className="border border-white/10 rounded-sm">
                        <div className="flex items-center justify-between p-3 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer">
                          <span className="text-xs font-mono">LOD-9402</span>
                          <span className="text-[10px] font-mono uppercase tracking-widest text-gray-400 flex items-center gap-1">View <ChevronRight size={12}/></span>
                        </div>
                        <div className="p-3 space-y-1">
                          <div className="flex justify-between items-center h-[28px]">
                            <span className="text-xs text-gray-500">Origin</span>
                            <span className="text-xs font-mono">Austin, TX</span>
                          </div>
                          <div className="flex justify-between items-center h-[28px]">
                            <span className="text-xs text-gray-500">Destination</span>
                            <span className="text-xs font-mono">Dallas, TX</span>
                          </div>
                          <div className="flex justify-between items-center h-[28px]">
                            <span className="text-xs text-gray-500">ETA</span>
                            <span className="text-xs font-mono text-[#FF4500]">14:30 CST</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              );
            })()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
