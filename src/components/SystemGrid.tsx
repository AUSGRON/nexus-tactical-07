/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Radio, Crosshair, Sparkles, Target, Zap, Shield, Cpu } from 'lucide-react';
import { GPSCoord, SubsystemStatus, WeaponSys } from '../types';

interface SystemGridProps {
  gps: GPSCoord;
  weaponSystem: WeaponSys;
  subsystems: SubsystemStatus[];
}

export default function SystemGrid({ gps, weaponSystem, subsystems }: SystemGridProps) {
  const [ticker, setTicker] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTicker(v => (v + 1) % 100);
    }, 1500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4">
      
      {/* 1. GLOBAL OPS PANEL (col-span-12 sm:col-span-6 lg:col-span-3) */}
      <div 
        id="bento-global-ops" 
        className="lg:col-span-3 p-4 rounded bg-neutral-950/80 border border-neutral-900/80 backdrop-blur-md flex flex-col justify-between font-mono min-h-[160px]"
      >
        <div>
          <span className="block text-[8px] text-neutral-500 tracking-widest font-black uppercase mb-1">
            // GLOBAL OPS
          </span>
          <div className="flex items-center justify-between text-[11px] text-white font-bold border-b border-neutral-900 pb-2 mb-2">
            <span>[ SECTOR_GRID_47 ]</span>
            <span className="flex items-center gap-1 text-red-500 text-[9px] font-black">
              <span className="w-1.5 h-1.5 bg-red-600 rounded-full animate-blink-status" />
              LIVE RELAY
            </span>
          </div>
        </div>

        <div className="space-y-1 text-[10px] text-neutral-400">
          <div className="flex justify-between">
            <span>LATITUDE:</span>
            <span className="text-white font-bold transition-all duration-300">{gps.lat}</span>
          </div>
          <div className="flex justify-between">
            <span>LONGITUDE:</span>
            <span className="text-white font-bold transition-all duration-300">{gps.lng}</span>
          </div>
          <div className="flex justify-between">
            <span>ALTITUDE:</span>
            <span className="text-white font-bold">{gps.alt}</span>
          </div>
        </div>

        <div className="mt-3 pt-2 border-t border-neutral-900/60 flex items-center justify-between text-[9px]">
          <span className="text-neutral-500">ZONE STATUS:</span>
          <span className="text-red-500 font-bold tracking-widest uppercase animate-pulse">
            WAR_ZONE ACTIVE
          </span>
        </div>
      </div>

      {/* 2. FACTION STATUS PANEL (col-span-12 sm:col-span-6 lg:col-span-3) */}
      <div 
        id="bento-faction-status" 
        className="lg:col-span-3 p-4 rounded bg-neutral-950/80 border border-neutral-900/80 backdrop-blur-md flex flex-col justify-between font-mono min-h-[160px]"
      >
        <div>
          <span className="block text-[8px] text-neutral-500 tracking-widest font-black uppercase mb-1">
            // FACTION STATUS
          </span>
          <div className="flex items-center justify-between text-[11px] text-white font-bold border-b border-neutral-900 pb-2 mb-2">
            <span>SECTOR CONTROL</span>
            <span className="text-neutral-500 text-[9px]">ACT_ENGAGED</span>
          </div>
        </div>

        <div className="flex items-center gap-4 py-1">
          {/* Radial concentric meter */}
          <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              {/* Helix Ring 42% (Red) */}
              <circle
                cx="18"
                cy="18"
                r="14"
                fill="none"
                stroke="#171717"
                strokeWidth="2.5"
              />
              <circle
                cx="18"
                cy="18"
                r="14"
                fill="none"
                stroke="#dc2626"
                strokeWidth="2.5"
                strokeDasharray="42, 100"
              />

              {/* Orion Ring 28% (White/Gray Inner Track) */}
              <circle
                cx="18"
                cy="18"
                r="10"
                fill="none"
                stroke="#171717"
                strokeWidth="2"
              />
              <circle
                cx="18"
                cy="18"
                r="10"
                fill="none"
                stroke="#737373"
                strokeWidth="2"
                strokeDasharray="28, 100"
              />
            </svg>
            <span className="absolute text-[9px] font-black text-red-500">V</span>
          </div>

          <div className="space-y-1.5 flex-1 text-[9px]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-bold">
                <span className="w-1.5 h-1.5 bg-red-600 rounded-sm" />
                <span className="text-white">HELIX</span>
              </div>
              <span className="font-bold text-red-400">42%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-bold">
                <span className="w-1.5 h-1.5 bg-neutral-500 rounded-sm" />
                <span className="text-neutral-300">ORION</span>
              </div>
              <span className="font-bold text-neutral-400">28%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-bold">
                <span className="w-1.5 h-1.5 bg-neutral-800 rounded-sm" />
                <span className="text-neutral-500">VOID</span>
              </div>
              <span className="font-bold text-neutral-600">30%</span>
            </div>
          </div>
        </div>

        <div className="text-[8px] text-neutral-600 uppercase tracking-widest">
          SYNC OVERLAY RATING: 100% SECURE
        </div>
      </div>

      {/* 3. YOUR INDEX / LIVE STATS (col-span-12 sm:col-span-6 lg:col-span-3) */}
      <div 
        id="bento-live-stats" 
        className="lg:col-span-3 p-4 rounded bg-neutral-950/80 border border-neutral-900/80 backdrop-blur-md flex flex-col justify-between font-mono min-h-[160px]"
      >
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-[8px] text-neutral-500 tracking-widest font-black uppercase">
              // YOUR INDEX
            </span>
            <span className="text-[8px] bg-red-600/10 text-red-500 border border-red-950 px-1 rounded font-bold uppercase select-none">
              SOX_ENGAGEMENT
            </span>
          </div>
          <div className="text-[11px] text-white font-bold border-b border-neutral-900 pb-2 mb-2 flex justify-between">
            <span>LIVE STATS</span>
            <span className="text-neutral-500 text-[9px] uppercase">DAY 47</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 py-1 text-center">
          <div>
            <span className="block text-[8px] text-neutral-500 mb-0.5">KILLS</span>
            <span className="text-sm font-black text-white">1,246</span>
          </div>
          <div>
            <span className="block text-[8px] text-neutral-500 mb-0.5">K/D RATIO</span>
            <span className="text-sm font-black text-white">2.38</span>
          </div>
          <div>
            <span className="block text-[8px] text-neutral-500 mb-0.5">SCORE</span>
            <span className="text-sm font-black text-white">15,890</span>
          </div>
        </div>

        <div className="text-[8px] text-neutral-600 mt-2 border-t border-neutral-900/65 pt-1.5 flex justify-between items-center">
          <span>RANK SECTOR SYNC:</span>
          <span className="text-green-500 font-bold">100% OPERATIONAL</span>
        </div>
      </div>

      {/* 4. LEVEL REWARDS Blueprints (col-span-12 sm:col-span-6 lg:col-span-3) */}
      <div 
        id="bento-level-rewards" 
        className="lg:col-span-3 p-4 rounded bg-neutral-950/80 border border-neutral-900/80 backdrop-blur-md flex flex-col justify-between font-mono min-h-[160px]"
      >
        <div>
          <span className="block text-[8px] text-neutral-500 tracking-widest font-black uppercase mb-1">
            // LEVEL REWARDS
          </span>
          <div className="flex items-center justify-between text-[11px] text-white font-bold border-b border-neutral-900 pb-2 mb-2">
            <span>NEXT REWARD</span>
            <span className="text-red-500 text-[9px] font-bold">LVL 10</span>
          </div>
        </div>

        {/* Custom Weapon Vector Blueprint drawing in SVG with red accents */}
        <div className="relative h-11 bg-neutral-950/90 border border-neutral-900/60 rounded p-1 flex items-center justify-center overflow-hidden my-1">
          {/* Futuristic grid background in SVG */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#0c0c0c_1px,transparent_1px),linear-gradient(to_bottom,#0c0c0c_1px,transparent_1px)] bg-[size:6px_6px] pointer-events-none opacity-40 ml-1" />
          
          <svg className="w-full h-full text-red-650" viewBox="0 0 160 40" fill="none">
            {/* Stock of the coil rifle */}
            <path d="M5 15 H20 C23 15 25 21 28 21 H38 L43 27 H5" stroke="#ef4444" strokeWidth="1" strokeLinecap="round" />
            <path d="M12 15 L8 24 H5" stroke="#ef4444" strokeWidth="0.8" />
            
            {/* Receiver & Frame */}
            <rect x="38" y="13" width="55" height="10" rx="1" fill="#000" stroke="#ef4444" strokeWidth="1.2" />
            <line x1="38" y1="18" x2="93" y2="18" stroke="#ef4444" strokeWidth="0.5" />
            
            {/* Magazine clip */}
            <path d="M55 23 L51 35 H42 L46 23 Z" fill="#000" stroke="#737373" strokeWidth="1" />
            
            {/* Grip handle and Trigger */}
            <path d="M42 23 L37 32 H31 L35 23" stroke="#ef4444" strokeWidth="1" strokeLinecap="round" />
            <path d="M46 25 Q48 28 45 28" stroke="#ef4444" strokeWidth="0.8" />
            
            {/* Upper Tactical Rail Scope */}
            <rect x="48" y="9" width="28" height="4" fill="#000" stroke="#ef4444" strokeWidth="0.8" />
            <line x1="52" y1="8" x2="72" y2="8" stroke="#ef4444" strokeWidth="0.8" />
            
            {/* Extended Barrel and Coils */}
            <line x1="93" y1="16" x2="148" y2="16" stroke="#ef4444" strokeWidth="1.4" strokeLinecap="round" />
            <line x1="93" y1="20" x2="142" y2="20" stroke="#ef4444" strokeWidth="1" strokeLinecap="round" />
            
            {/* Electromagnetic acceleration rings on barrel */}
            <rect x="102" y="14" width="3" height="4" fill="#ef4444" rx="0.5" />
            <rect x="114" y="14" width="3" height="4" fill="#ef4444" rx="0.5" />
            <rect x="126" y="14" width="3" height="4" fill="#ef4444" rx="0.5" />
            <rect x="138" y="14" width="3" height="4" fill="#ef4444" rx="0.5" />
            
            {/* Silencer/Muzzle brake */}
            <rect x="148" y="14" width="6" height="5" fill="#000" stroke="#737373" strokeWidth="0.8" />
            
            {/* Laser pointer line (glowing dot) */}
            <line x1="88" y1="22" x2="110" y2="22" stroke="#dc2626" strokeWidth="0.4" strokeDasharray="3 3" />
            <circle cx="110" cy="22" r="1" fill="#ef4444" className="animate-ping" />
          </svg>
        </div>

        <div className="text-[9px] flex justify-between items-center text-neutral-400 mt-1">
          <span className="font-bold text-white tracking-wide">VORTEX PRIME</span>
          <span className="text-[7.5px] text-neutral-500">WEAPON BLUEPRINT</span>
        </div>
      </div>

    </div>
  );
}
