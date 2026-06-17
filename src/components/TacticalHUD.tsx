/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Crosshair, Compass, Eye, Shield, Target, Radio, AlertOctagon } from 'lucide-react';
import { GPSCoord } from '../types';

interface TacticalHUDProps {
  gps: GPSCoord;
  isThreatDetected: boolean;
  batteryLevel?: number;
}

export default function TacticalHUD({ gps, isThreatDetected, batteryLevel = 100 }: TacticalHUDProps) {
  const [ticker, setTicker] = useState(0);
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);

  // Simple clock loop for simulated HUD coordinates variance
  useEffect(() => {
    const timer = setInterval(() => {
      setTicker(val => (val + 1) % 100);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const hotspots = [
    {
      id: 'helmet',
      label: 'HELMET HUD MODULE // V.07',
      top: '18%',
      left: '46%',
      status: 'CALIBRATED',
      desc: 'Active multispectral visor. Night vision and thermal lock online. Filter efficiency: 98.4%.',
      icon: <Eye className="w-3.5 h-3.5" />
    },
    {
      id: 'shoulder',
      label: 'CERAMIC EXOSKELETON // NEXUS',
      top: '55%',
      left: '75%',
      status: 'FULL STRENGTH',
      desc: 'Multi-layer composite armor. Deflection absorption metrics optimal. Structural health: 100%.',
      icon: <Shield className="w-3.5 h-3.5" />
    },
    {
      id: 'rifle',
      label: 'NEXUS AUTOMATIC COIL RIFLE',
      top: '68%',
      left: '35%',
      status: 'LOADED',
      desc: 'Electromagnetic accelerator. Ammo cell: 45/45. Thermal index: 21°C. System linked.',
      icon: <Target className="w-3.5 h-3.5" />
    }
  ];

  return (
    <div className="absolute inset-0 pointer-events-none select-none z-20">
      {/* Outer framing HUD elements */}
      <div className="absolute inset-2 sm:inset-4 md:inset-6 border border-red-500/10 pointer-events-none rounded transition-all">
        {/* Corners */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-red-600/60" />
        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-red-600/60" />
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-red-600/60" />
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-red-600/60" />

        {/* Ambient Grid Lines */}
        <div className="absolute left-1/2 top-4 -translate-x-1/2 h-1.5 w-24 border-b border-red-600/30 flex justify-between px-2 text-[7px] text-red-500 font-mono">
          <span>000</span>
          <span>180</span>
          <span>360</span>
        </div>

        {/* Floating System GPS Grid Tag */}
        <div className="absolute bottom-4 left-4 font-mono text-[8px] text-red-500 bg-black/60 p-2 border border-red-950/40 rounded flex flex-col gap-0.5 pointer-events-auto">
          <div className="flex items-center gap-1 font-bold text-white text-[9px] border-b border-red-950/60 pb-1 mb-1">
            <Radio className="w-3.5 h-3.5 text-red-500 animate-pulse" />
            <span>NEXUS TELEMETRY</span>
          </div>
          <div className="flex justify-between gap-4"><span>LAT:</span> <span className="text-white">{gps.lat}</span></div>
          <div className="flex justify-between gap-4"><span>LNG:</span> <span className="text-white">{gps.lng}</span></div>
          <div className="flex justify-between gap-4"><span>ALT:</span> <span className="text-white">{gps.alt}</span></div>
          <div className="flex justify-between gap-4"><span>BRG:</span> <span className="text-white">{gps.bearing}</span></div>
        </div>

        {/* Battery & Health Mini Bar */}
        <div className="absolute top-4 right-4 font-mono text-[8px] text-red-500 bg-black/60 p-2 border border-red-950/40 rounded pointer-events-auto flex flex-col gap-1.5">
          <div>
            <div className="flex justify-between gap-2 text-[9px] font-bold text-white">
              <span>THERMO BATT</span>
              <span className={batteryLevel < 20 ? 'text-red-500 animate-pulse font-black' : 'text-green-500'}>
                {batteryLevel}%
              </span>
            </div>
            <div className="w-24 bg-neutral-900 border border-neutral-800 h-1.5 rounded-full overflow-hidden mt-1">
              <div 
                className={`h-full rounded-full transition-all duration-300 ${batteryLevel < 20 ? 'bg-red-500 animate-pulse' : 'bg-red-600'}`} 
                style={{ width: `${batteryLevel}%` }} 
              />
            </div>
          </div>
          <div>
            <div className="flex justify-between gap-2 text-[9px]">
              <span>CORE SYNC</span>
              <span className="text-white font-bold">98.4%</span>
            </div>
            <div className="w-24 bg-neutral-900 border border-neutral-800 h-1.5 rounded-full overflow-hidden mt-1">
              <div className="bg-red-600 h-full rounded-full w-[88%]" />
            </div>
          </div>
        </div>
      </div>

      {/* Center Tactical Crosshair */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none flex flex-col items-center gap-1">
        <div className="relative w-16 h-16 flex items-center justify-center">
          {/* Compass ring tick indicator */}
          <div className="absolute inset-0 rounded-full border border-dashed border-red-600/35 animate-spin" style={{ animationDuration: '24s' }} />
          <div className="absolute inset-2 rounded-full border border-red-500/10" />
          <Crosshair className="w-5 h-5 text-red-500 animate-pulse" />
          
          {/* Pulsating corner targets */}
          <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-red-500" />
          <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-red-500" />
          <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-red-500" />
          <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-red-500" />
        </div>
        <span className="font-mono text-[7px] text-red-500 tracking-widest bg-black/45 px-1 py-0.5 rounded">
          COGNITIVE CENTER LOCK
        </span>
      </div>

      {/* Interactive tactical nodes overlayed on coordinates (Only visible when viewport allows - pointer-events active) */}
      <div className="absolute inset-0 pointer-events-none">
        {hotspots.map((spot) => {
          const isSelected = activeHotspot === spot.id;
          return (
            <div
              key={spot.id}
              className="absolute pointer-events-auto"
              style={{ top: spot.top, left: spot.left }}
            >
              {/* Trigger Dot (Requires larger touch target 44px+ bounding box for mobile compliance) */}
              <button
                id={`btn-hotspot-${spot.id}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveHotspot(isSelected ? null : spot.id);
                }}
                onMouseEnter={() => setActiveHotspot(spot.id)}
                onMouseLeave={() => setActiveHotspot(null)}
                className="relative w-8 h-8 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center group focus:outline-none cursor-pointer"
                title={spot.label}
              >
                {/* Sonar rings */}
                <span className="absolute inset-0.5 rounded-full border border-red-500/40 animate-sonar-ripple pointer-events-none" />
                <span className="absolute w-2 h-2 rounded-full bg-red-600 group-hover:bg-white group-hover:scale-125 transition-all duration-200" />
                {/* Aim bounding reticle */}
                <span className="absolute inset-1.5 border border-red-500/30 rounded-full group-hover:border-red-500 transition-colors" />
              </button>

              {/* Holographic Info Panel Card */}
              <AnimatePresence>
                {isSelected && (
                  <motion.div
                    id={`hotspot-details-card-${spot.id}`}
                    initial={{ opacity: 0, scale: 0.9, x: 10, y: -20 }}
                    animate={{ opacity: 1, scale: 1, x: 0, y: -20 }}
                    exit={{ opacity: 0, scale: 0.9, y: -20 }}
                    className="absolute z-40 top-0 left-6 w-56 p-3 bg-neutral-950/95 border border-red-500/60 rounded shadow-2xl backdrop-blur-md font-mono text-[9px] pointer-events-none text-neutral-300"
                  >
                    <div className="flex items-center gap-1.5 text-white font-bold tracking-wide border-b border-red-950/40 pb-1.5 mb-1.5">
                      {spot.icon}
                      <span>{spot.label}</span>
                    </div>
                    <div className="flex justify-between items-center text-[8px] bg-red-950/15 border border-red-900/30 px-1 py-0.5 rounded text-red-400 mb-1.5">
                      <span>TELEMETRY FEED</span>
                      <span className="font-bold">{spot.status}</span>
                    </div>
                    <p className="font-sans leading-relaxed text-neutral-400">
                      {spot.desc}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Dynamic scrolling visual threat scanning warnings */}
      {isThreatDetected && (
        <div className="absolute top-24 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-red-600/15 border border-red-600/40 px-3.5 py-1.5 rounded animate-bounce font-mono text-[9px] text-red-500 font-bold z-30">
          <AlertOctagon className="w-3.5 h-3.5 text-red-500 animate-blink-status shrink-0" />
          <span>COGNITIVE THREAT DETECTED CORE SHIELD IN PROCESS</span>
        </div>
      )}

      {/* Battery EMERGENCY HUD alert flash overlay */}
      {batteryLevel < 20 && (
        <div className="absolute inset-0 border-[3px] border-red-600/60 pointer-events-none animate-pulse z-40">
          <div className="absolute top-36 left-1/2 -translate-x-1/2 bg-black/95 border-2 border-red-600 p-2.5 px-6 rounded font-mono text-center flex flex-col items-center gap-1 shadow-[0_0_35px_rgba(239,68,68,0.75)] pointer-events-auto select-none">
            <div className="flex items-center gap-2 text-[10px] text-red-500 font-black tracking-widest uppercase animate-flash-fast">
              <span className="w-2 h-2 rounded-full bg-red-600 animate-ping shrink-0" />
              <span>⚠️ CRITICAL EXTREME POWER DRAIN ⚠️</span>
            </div>
            <span className="text-[9px] text-neutral-300 font-medium">
              THERMO-REACTOR BATTERY CORE AT: <span className="text-red-500 font-black animate-pulse">{batteryLevel}% EFFICIENCY</span>. RESTORE POWER CORE NOW WITH COMMAND: <span className="text-white font-bold bg-red-950/40 px-1 py-0.5 rounded tracking-wider">/BATTERY</span>.
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
