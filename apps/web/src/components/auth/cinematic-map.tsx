'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Simplified SVG Path for contiguous US (Albers projection approximation)
const US_PATH = "M184.2,28.8L219,30.3l15,7.7l13.6,18l24.4,13.6L317.5,70l21,12l17,0l12-8l12-1l24,19l8.6,0l11.4,-8.6l10,-6l8,5l2,15l9,9l-5,5l13,11l-5,7l-3,17l-15,10l-16,4l-9,15l1,9l-14,3l-3,10l12,5l-1,10l-18,6l3,26l-11,26l6,14l30,-1l7,7l6,3l4,14l0,21l-7,7l-30,-2l-9,-12l-14,-9l-9,-1l-18,-15l-12,-1l-2,-9l-9,-3l-16,11l-11,17l-15,-1l-6,6l-14,0l-5,-7l-15,5l-32,3l-37,-9l-72,-5l-6,-7l-5,4l-9,5l-10,-5l-6,2l-8,8l-18,3l-11,5l-20,-7l-8,5l-13,0l-10,-10l-8,-7l2,-16l10,-17l-5,-21l-10,-24l2,-25l9,-23l-1,-18l7,-27l8,-13l3,-13l36,2l19,-7l9,4l4,-5L184.2,28.8z";

// Points on the SVG coordinate space (approximate)
const POINTS = [
  { x: 30, y: 150 },   // SF
  { x: 80, y: 170 },   // LA
  { x: 120, y: 180 },  // Phoenix
  { x: 230, y: 220 },  // Austin
  { x: 260, y: 200 },  // Dallas
  { x: 380, y: 120 },  // NY
];

export function CinematicMap() {
  const [progress, setProgress] = useState(0);
  const [skipAnimation, setSkipAnimation] = useState(false);

  useEffect(() => {
    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isReducedMotion || skipAnimation) {
      setProgress(1);
      return;
    }

    let start: number;
    const duration = 2500; // 2.5s drawing animation

    const animate = (timestamp: number) => {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;
      const p = Math.min(elapsed / duration, 1);
      
      const easeOutQuart = 1 - Math.pow(1 - p, 4);
      setProgress(easeOutQuart);

      if (p < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [skipAnimation]);

  // Generate the polyline points based on progress
  const generateRoutePoints = () => {
    if (progress === 0) return `${POINTS[0].x},${POINTS[0].y}`;
    if (progress === 1) return POINTS.map(p => `${p.x},${p.y}`).join(' ');

    const totalSegments = POINTS.length - 1;
    const currentSegmentProgress = progress * totalSegments;
    const segmentIndex = Math.floor(currentSegmentProgress);
    const pInsideSegment = currentSegmentProgress - segmentIndex;

    const coords = POINTS.slice(0, segmentIndex + 1).map(p => `${p.x},${p.y}`);
    
    if (segmentIndex < totalSegments) {
      const p1 = POINTS[segmentIndex];
      const p2 = POINTS[segmentIndex + 1];
      const currentX = p1.x + (p2.x - p1.x) * pInsideSegment;
      const currentY = p1.y + (p2.y - p1.y) * pInsideSegment;
      coords.push(`${currentX},${currentY}`);
    }
    
    return coords.join(' ');
  };

  return (
    <div className="absolute inset-0 z-0 bg-[#0A0A0A] overflow-hidden flex items-center justify-center">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(to right, #ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      {/* SVG Map Container */}
      <div className="relative w-[1200px] h-[800px] opacity-60 scale-125 lg:scale-150 transform-gpu translate-x-[200px] translate-y-[100px]">
        <svg viewBox="0 0 500 300" className="w-full h-full stroke-[#FAFAFA] fill-transparent stroke-[0.2px]">
          <path d={US_PATH} />
          
          {/* Glowing Route Line */}
          <polyline 
            points={generateRoutePoints()} 
            className="stroke-[#FF4500] fill-none" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            style={{ filter: 'drop-shadow(0 0 8px rgba(255,69,0,0.8))' }}
          />
          
          {/* Base Route Line (crisp center) */}
          <polyline 
            points={generateRoutePoints()} 
            className="stroke-white fill-none" 
            strokeWidth="0.5" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />

          {/* Location Nodes */}
          {POINTS.slice(0, Math.ceil(progress * POINTS.length)).map((p, i) => (
            <circle 
              key={i} 
              cx={p.x} 
              cy={p.y} 
              r="2" 
              className="fill-white" 
              style={{ filter: 'drop-shadow(0 0 4px rgba(255,255,255,1))' }}
            />
          ))}
        </svg>
      </div>

      {/* Overlay to dim the map slightly and add vignette */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A] via-[#0A0A0A]/50 to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-transparent to-[#0A0A0A]/90 pointer-events-none" />

      {/* Skip button for accessibility */}
      <AnimatePresence>
        {progress < 1 && !skipAnimation && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSkipAnimation(true)}
            className="absolute bottom-8 right-8 z-50 text-[10px] font-mono uppercase tracking-widest text-white/50 hover:text-white transition-colors glass px-4 py-2 border border-white/10 pointer-events-auto rounded-none"
          >
            Skip Animation
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
