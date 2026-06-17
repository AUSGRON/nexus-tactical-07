/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Sparkles, AlertTriangle, Play, HelpCircle, Upload, VolumeX, Volume2, RefreshCw, Layers } from 'lucide-react';
import { LogEntry, SubsystemStatus, WeaponSys, GPSCoord } from './types';
import VideoEngine, { BUILTIN_VIDEOS } from './components/VideoEngine';
import TerminalPanel from './components/TerminalPanel';
import SystemGrid from './components/SystemGrid';
import TacticalHUD from './components/TacticalHUD';

// Futuristic Red & Black Animated Tactical Drone
const TacticalDrone = ({ className, delay = 0, scale = 1 }: { className?: string; delay?: number; scale?: number }) => {
  return (
    <motion.div
      initial={{ y: 0, rotate: 0 }}
      animate={{ 
        y: [-8, 8, -8], 
        rotate: [-1.5, 1.5, -1.5],
      }}
      transition={{ 
        duration: 5, 
        repeat: Infinity, 
        ease: "easeInOut",
        delay 
      }}
      style={{ scale }}
      className={`absolute pointer-events-none select-none z-20 ${className}`}
    >
      <div className="relative flex flex-col items-center">
        {/* Pulsing red laser pointer line pointing down from drone camera */}
        <div className="absolute top-[35px] h-[150px] w-[1px] bg-gradient-to-b from-red-600/50 via-red-650/5 to-transparent pointer-events-none animate-pulse" />

        <svg width="120" height="90" viewBox="0 0 120 90" fill="none" className="w-full h-full drop-shadow-[0_0_12px_rgba(239,68,68,0.5)]">
          {/* Symmetrical rotors styling spinning */}
          <motion.ellipse 
            cx="15" cy="15" rx="18" ry="3" 
            fill="none" stroke="#ef4444" strokeWidth="0.75" strokeDasharray="3 1"
            animate={{ rotate: 360 }}
            transition={{ duration: 0.35, repeat: Infinity, ease: "linear" }}
            style={{ originX: '15px', originY: '15px' }}
          />
          <rect x="11" y="12" width="8" height="6" rx="1" fill="#09090b" stroke="#3f3f46" />

          <motion.ellipse 
            cx="105" cy="15" rx="18" ry="3" 
            fill="none" stroke="#ef4444" strokeWidth="0.75" strokeDasharray="3 1"
            animate={{ rotate: -360 }}
            transition={{ duration: 0.35, repeat: Infinity, ease: "linear" }}
            style={{ originX: '105px', originY: '15px' }}
          />
          <rect x="101" y="12" width="8" height="6" rx="1" fill="#09090b" stroke="#3f3f46" />

          {/* Left Wing arm connection */}
          <path d="M15 15 L45 35 L38 42 L15 15 Z" fill="#18181b" stroke="#dc2626" strokeWidth="0.5" />
          {/* Right Wing arm connection */}
          <path d="M105 15 L75 35 L82 42 L105 15 Z" fill="#18181b" stroke="#dc2626" strokeWidth="0.5" />

          {/* Core Drone Fuselage Body */}
          <polygon points="40,35 60,20 80,35 72,55 48,55" fill="#09090b" stroke="#ef4444" strokeWidth="1" />
          <polygon points="45,37 60,26 75,37 68,50 52,50" fill="#18181b" />

          {/* Aggressive Glowing Central Red Tri-Lens / Visor */}
          <polygon points="55,32 65,32 60,39" fill="#ef4444" className="animate-pulse" />

          {/* Under-fuselage camera/target node with a red flare */}
          <circle cx="60" cy="48" r="3.5" fill="#ef4444" className="animate-ping" style={{ animationDuration: '3s' }} />
          <circle cx="60" cy="48" r="2" fill="#ef4444" />

          {/* Symmetrical Carbon landing fins below body */}
          <path d="M42 55 L35 72 L42 70 Z" fill="#09090b" stroke="#7f1d1d" strokeWidth="0.7" />
          <path d="M78 55 L85 72 L78 70 Z" fill="#09090b" stroke="#7f1d1d" strokeWidth="0.7" />
        </svg>

        {/* Small holographic designation label below the drone */}
        <div className="mt-1 font-mono text-[6px] text-red-500/80 tracking-[0.25em] uppercase select-none font-bold">
          SQUAD_DRONE.07
        </div>
      </div>
    </motion.div>
  );
};

export default function App() {
  // Video and backdrop feed configurations
  const [videoUrl, setVideoUrl] = useState<string>(BUILTIN_VIDEOS[0].url);
  const [videoOpacity, setVideoOpacity] = useState<number>(0.65); // High crisp contrast opacity matching screenshot
  const [videoBlur, setVideoBlur] = useState<number>(0); // 0 blur by default so the soldier looks incredibly sharp just like user's image
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [localVideoUrl, setLocalVideoUrl] = useState<string>('');
  const [isHoveringClear, setIsHoveringClear] = useState<boolean>(false);

  const backgroundVideoRef = useRef<HTMLVideoElement>(null);

  // High-fidelity active duration loop trimming to create an elite 4-5s looking-and-lighting action loop
  useEffect(() => {
    const video = backgroundVideoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      // Truncate playback of the soldier video to exactly loop between 0 and 4.7 seconds
      // keeping the robot focused, lighting his head/visor, looking towards the recruit, and looping cleanly
      if (videoUrl.includes('c2449ee6-06f2-4f56-8594-c7d21aa9358e.mp4') && video.currentTime >= 4.7) {
        video.currentTime = 0.05;
        video.play().catch(() => {});
      }
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, [videoUrl]);

  // Combat shield & telemetry flags
  const [activeTab, setActiveTab] = useState<'HOME' | 'LOADOUT' | 'BATTLEPASS' | 'LEADERBOARDS' | 'INTEL'>('HOME');
  const [isAlertActive, setIsAlertActive] = useState<boolean>(true);
  const [gpsCoords, setGpsCoords] = useState<GPSCoord>({
    lat: '35.6895° N',
    lng: '139.6917° E',
    alt: '340m',
    bearing: 'E 45°'
  });

  // Pulse coordinate drift in HUD
  useEffect(() => {
    const coordsInterval = setInterval(() => {
      setGpsCoords(prev => {
        const drift = (Math.random() - 0.5) * 0.0006;
        const currentLat = parseFloat(prev.lat.replace(/[^\d.-]/g, ''));
        const currentLng = parseFloat(prev.lng.replace(/[^\d.-]/g, ''));
        return {
          lat: `${(currentLat + drift).toFixed(4)}° N`,
          lng: `${(currentLng + (Math.random() - 0.5) * 0.0006).toFixed(4)}° E`,
          alt: `${Math.round(340 + (Math.random() - 0.5) * 6)}m`,
          bearing: prev.bearing
        };
      });
    }, 4000);
    return () => clearInterval(coordsInterval);
  }, []);

  // Preset weapons configuration
  const [weaponSystem, setWeaponSystem] = useState<WeaponSys>({
    name: 'VORTEX PRIME COIL',
    type: 'ELECTROMAGNETIC',
    ammoCurrent: 45,
    ammoMax: 45,
    fireMode: 'AUTO',
    heatLevel: 0,
    lockedOn: true
  });

  // Base subdivisions configs
  const [subsystems, setSubsystems] = useState<SubsystemStatus[]>([
    { id: 'nuclear-cell', name: 'Thermo-Reactor Battery', status: 'ONLINE', efficiency: 100, load: 30, temp: 45 },
    { id: 'neural-link', name: 'Neural Synapse Overhaul', status: 'ACTIVE', efficiency: 98, load: 42, temp: 37 }
  ]);

  // Periodic battery level decay logic (runs timely every 3 seconds)
  useEffect(() => {
    const batteryTimer = setInterval(() => {
      setSubsystems(prev => prev.map(sub => {
        if (sub.id === 'nuclear-cell') {
          // Decrement battery efficiency timely (by 1% every 3 seconds so it decays at a smooth, strategic pace)
          const nextEff = Math.max(0, sub.efficiency - 1);
          
          // Reset to 100% if it reaches 0% to loop the simulation
          const finalEff = nextEff === 0 ? 100 : nextEff;
          
          // Trigger EMERGENCY status if battery drops below 20%, otherwise ONLINE
          const nextStatus = finalEff < 20 ? 'EMERGENCY' : 'ONLINE';
          
          return {
            ...sub,
            efficiency: finalEff,
            status: nextStatus,
            load: Math.min(85, Math.max(20, sub.load + Math.round((Math.random() - 0.5) * 4))),
            temp: finalEff < 20 ? 78 : Math.min(80, Math.max(40, sub.temp + (Math.random() > 0.5 ? 1 : -1)))
          };
        }
        return sub;
      }));
    }, 3000);
    
    return () => clearInterval(batteryTimer);
  }, []);

  // Speak voice alarm when battery efficiency/charge drops below 20% (once per warning cycle)
  const isCriticalSpokenRef = useRef<boolean>(false);
  const currentBatteryLevel = subsystems.find(s => s.id === 'nuclear-cell')?.efficiency ?? 100;

  useEffect(() => {
    if (currentBatteryLevel < 20) {
      if (!isCriticalSpokenRef.current) {
        addLog('SYSTEM', 'WARNING: THERMO-REACTOR BATTERY EFFICIENCY CRITICAL. ENGAGE OPTIMIZATION IMMEDIATELY.', 'critical');
        if ('speechSynthesis' in window) {
          window.speechSynthesis.cancel();
          const utterance = new SpeechSynthesisUtterance("Caution. Thermo reactor battery is under twenty percent. Recommended recharge.");
          utterance.rate = 1.05;
          utterance.pitch = 0.85;
          utterance.volume = 0.35; // Significantly quieter as requested (default is 1.0)
          window.speechSynthesis.speak(utterance);
        }
        isCriticalSpokenRef.current = true;
      }
    } else {
      isCriticalSpokenRef.current = false;
    }
  }, [currentBatteryLevel]);

  // Terminal active states
  const [logs, setLogs] = useState<LogEntry[]>([
    { timestamp: '19:52:02', sender: 'SYSTEM', message: 'PING RE-ROUTE ENGAGED VIA CLOUD CONTAINER 3000', type: 'info' },
    { timestamp: '19:54:33', sender: 'SYSTEM', message: 'TACTICAL LINK CONFIRMED // LOCAL_DEV ENABLED', type: 'success' },
    { timestamp: '19:57:05', sender: 'SYSTEM', message: 'ORBITAL DROP SIGNALS INCOMING ON COLLAPSING SECTORS', type: 'warning' },
    { timestamp: '19:58:16', sender: 'SYSTEM', message: 'UNIT RECRUIT_07 ASSIGNED TO SECTOR G-12', type: 'success' },
  ]);

  const addLog = (sender: 'SYSTEM' | 'NEXUS-07' | 'HQ' | 'ERROR', message: string, type: 'info' | 'success' | 'warning' | 'critical') => {
    const timeStr = new Date().toTimeString().split(' ')[0];
    setLogs(prev => [...prev, { timestamp: timeStr, sender, message, type }]);
  };

  // Listen to Terminal Clears
  useEffect(() => {
    const handleClearLogs = () => {
      setLogs([
        { timestamp: new Date().toTimeString().split(' ')[0], sender: 'SYSTEM', message: 'COMS DIAGNOSTICS LOG ARCHIVES PURGED SUCCESSFULLY.', type: 'info' }
      ]);
    };
    window.addEventListener('clear-terminal-logs', handleClearLogs);
    return () => window.removeEventListener('clear-terminal-logs', handleClearLogs);
  }, []);

  return (
    <div className="relative min-h-screen bg-black text-neutral-200 flex flex-col font-sans select-none overflow-x-hidden">
      
      {/* 1. BACKGROUND DYNAMIC LAYERING */}
      {/* 1.1 Fullscreen Looping Video Background - Aligned to top-right using object-cover to completely eliminate black background from behind the navbar */}
      <div className="absolute top-0 right-0 h-full w-full lg:w-[65%] xl:w-[58%] z-0 pointer-events-none overflow-hidden bg-transparent flex items-start justify-end select-none lg:-translate-x-[10%] xl:-translate-x-[14%]">
        <div className="relative w-full h-full flex items-start justify-end">
          <video
            ref={backgroundVideoRef}
            key={videoUrl}
            autoPlay
            loop
            muted={isMuted}
            playsInline
            className={`w-full h-full object-cover transition-all duration-500 origin-top-right ${
              isHoveringClear 
                ? 'scale-[1.52] translate-y-[9%] lg:translate-y-[11%] -translate-x-[14%] filter brightness-[1.15] contrast-[1.25]' 
                : 'scale-[1.08] lg:scale-[1.12] translate-y-[2%] lg:translate-y-[3.5%]'
            }`}
            style={{
              opacity: videoOpacity,
              filter: `blur(${videoBlur}px)`
            }}
          >
            <source src={videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          {/* Heavy lock-on red circular weapons targeting reticle that triggers when hovering "/clear" */}
          <AnimatePresence>
            {isHoveringClear && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 z-30 pointer-events-none flex items-center justify-center bg-red-950/15"
              >
                <div className="relative w-64 h-64 flex items-center justify-center rounded-full border-2 border-red-650 border-double animate-spin" style={{ animationDuration: '40s' }}>
                  <div className="absolute inset-4 rounded-full border border-dashed border-red-500/50 animate-reverse-spin" style={{ animationDuration: '20s' }} />
                  <div className="absolute w-full h-[1.5px] bg-red-600/60" />
                  <div className="absolute h-full w-[1.5px] bg-red-600/60" />
                  
                  {/* Digital warning overlays */}
                  <span className="absolute top-4 text-[7px] font-mono text-red-500 bg-black/90 p-1 rounded font-black tracking-widest uppercase animate-pulse">
                    TARGET: CONSOLE_OPERATOR_7
                  </span>
                  <span className="absolute bottom-4 text-[7.5px] font-mono text-red-500 font-bold bg-black/95 px-1.5 py-0.5 rounded">
                    GUN CELL RE-ALIGNMENT: ENGAGED
                  </span>
                </div>
                
                {/* Floating crosshair details */}
                <div className="absolute top-2 left-6 text-red-500 font-mono text-[8px] flex flex-col gap-0.5 bg-black/95 p-1.5 border border-red-900/40 rounded">
                  <span className="text-white font-extrabold text-[8.5px] border-b border-red-950 pb-0.5 mb-0.5">WARNING: WEAPON LOCKED</span>
                  <span>MODE: COIL RIFLE STANCE</span>
                  <span>VELOCITY: 1,240 M/S</span>
                  <span>CHARGE STABILITY: 99.8%</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Edge blend gradients to fade the video boundaries seamlessly into pure black page canvas */}
          <div className="absolute inset-y-0 left-0 w-36 bg-gradient-to-r from-black via-black/85 to-transparent pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-black via-black/85 to-transparent pointer-events-none" />
          <div className="absolute inset-x-0 top-0 h-32 bg-transparent pointer-events-none" />
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black via-black/90 to-transparent pointer-events-none" />

          {/* Critical bottom corners watermark cover-ups (absolute sleek dark blurs to mask underlying text) */}
          <div className="absolute bottom-1 right-2 w-44 h-12 bg-black/98 filter blur-[4px] pointer-events-none" />
          <div className="absolute bottom-1 left-2 w-44 h-12 bg-black/98 filter blur-[4px] pointer-events-none" />
          
          {/* Beautiful Web-Native Premium watermark badge requested by the user */}
          <div className="absolute bottom-3 right-6 z-10 flex items-center gap-1.5 bg-black/95 border border-red-650/40 p-1.5 px-3 rounded font-mono text-[9px] text-red-500 tracking-[0.15em] select-none shadow-[0_0_12px_rgba(239,68,68,0.25)]">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            <span className="font-extrabold uppercase">DOMOAI RENDER CO-PROCESSOR</span>
            <span className="text-neutral-510 text-[8px]">// ACTIVE</span>
          </div>
        </div>
        
        {/* Horizontal Scanlines effect */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.3)_50%)] bg-[size:100%_4px] pointer-events-none opacity-40" />
        
        {/* High-speed vertical cyber matrix glowing scanning line */}
        <div className="absolute inset-x-0 top-0 h-[2px] bg-red-650/40 pointer-events-none animate-scan-line" />
      </div>

      {/* 1.2 Interactive Tactical Visor HUD Overlay */}
      <TacticalHUD 
        gps={gpsCoords} 
        isThreatDetected={isAlertActive} 
        batteryLevel={currentBatteryLevel} 
      />

      {/* 2. MAIN HEADER BAR */}
      <header id="nexus-header" className="relative z-30 bg-transparent border-none px-4 py-3">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 font-mono text-xs">
          
          {/* Brand Logo Group */}
          <div className="flex items-center gap-3">
            {/* SVG Logo icon reflecting the red chest-crest triangle from the KlingAI render */}
            <div className="relative w-8 h-8 rounded border border-red-600 bg-red-950/20 flex items-center justify-center shadow-[0_0_15px_rgba(239,68,68,0.2)]">
              <svg className="w-5 h-5 text-red-600" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="12,4 4,14 11,14 9,20 20,9 13,9" />
              </svg>
              <div className="absolute inset-0 border border-red-500/20 rounded scale-90 animate-ping" style={{ animationDuration: '4s' }} />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-white text-[13px] tracking-wider">V NEXUS</span>
                <span className="text-red-500 font-extrabold text-[12px] tracking-widest uppercase">PROJECT</span>
              </div>
              <p className="text-[9px] text-neutral-600 font-bold uppercase tracking-widest mt-0.5">
                OPERATIONAL HERO TERMINAL
              </p>
            </div>
            {/* DomoAI Header Watermark */}
            <div className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 bg-red-955/20 border border-red-600/35 rounded text-red-500 font-black tracking-widest text-[8px] select-none hover:bg-red-955/35 transition-all">
              <span className="w-1.0 h-1.0 rounded-full bg-red-500 animate-ping" />
              <span>DOMOAI GRAPHICS</span>
            </div>
          </div>

          {/* Center Tabs Navigation */}
          <nav className="flex items-center font-mono text-[10px] tracking-widest font-black text-neutral-400">
            {(['HOME', 'LOADOUT', 'BATTLEPASS', 'LEADERBOARDS', 'INTEL'] as const).map((tab, idx) => {
              const isSelected = activeTab === tab;
              return (
                <React.Fragment key={tab}>
                  {idx > 0 && <span className="text-neutral-800/40 mx-2 select-none">//</span>}
                  <button
                    id={`nav-tab-${tab.toLowerCase()}`}
                    onClick={() => {
                      setActiveTab(tab);
                      addLog('SYSTEM', `NAVIGATED INTERFACE FOCUS TO // [${tab}] SCREEN SUB-GRID`, 'info');
                    }}
                    className={`px-3 py-1.5 transition-all duration-200 cursor-pointer text-center whitespace-nowrap min-h-[38px] flex flex-col justify-center items-center relative gap-1 border border-transparent ${
                      isSelected 
                        ? 'text-white font-extrabold' 
                        : 'hover:text-white hover:bg-neutral-900/10'
                    }`}
                  >
                    <span>{tab}</span>
                    {isSelected && (
                      <span className="absolute bottom-1 left-2.5 right-2.5 h-[2px] bg-red-650 shadow-[0_0_8px_rgba(239,68,68,0.8)] rounded-full animate-pulse" />
                    )}
                  </button>
                </React.Fragment>
              );
            })}
          </nav>

          {/* Right User Box with level tags (fully transparent to prevent obstructing background scenery) */}
          <div className="flex items-center gap-3 bg-transparent border border-neutral-800/40 p-2 py-1.5 rounded min-h-[38px]">
            <div className="text-right">
              <p className="text-white font-black text-[10px] tracking-wider">RECRUIT_07</p>
              <p className="text-[8px] text-red-500 font-bold">4,250 XP // 7,500 XP</p>
            </div>
            <div className="bg-red-600/10 border border-red-650/45 text-red-400 font-black text-[10px] px-2 py-1 rounded select-none text-center hover:bg-red-600/20 transition-colors">
              LVL 09
            </div>
          </div>

        </div>
      </header>

      {/* 2.1 Drag-And-Drop Inline Notification Badge */}
      <div className="relative z-30 bg-red-950/30 border-b border-red-900/20 py-2.5 px-4 text-center font-mono text-[9px] text-neutral-400 uppercase tracking-widest flex items-center justify-center gap-3">
        <Upload className="w-3.5 h-3.5 text-red-500 animate-bounce" />
        <span>
          👋 DESIGN PROTOCOL: DRAG & DROP YOUR KLING AI BACKGROUND VIDEO DIRECTLY IN DISCORD-STYLE FEED OR OPEN CONFIG PANEL
        </span>
        <button
          onClick={() => {
            setIsAlertActive(!isAlertActive);
            addLog('SYSTEM', 'COGNITIVE RADAR STANDBY CONFIG CHANGED.', 'info');
          }}
          className="text-red-500 underline font-extrabold hover:text-white transition-all cursor-pointer select-none"
        >
          {isAlertActive ? 'DISABLE RADAR HUD' : 'ENABLE RADAR HUD'}
        </button>
      </div>

      {/* 3. CORE HERO PANEL GRID */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-4 flex-1 flex flex-col justify-center relative z-10 gap-5">
        
        {/* Floating Red & Black Tactical Drones on the left/center-left areas, avoiding the robot's face on the right */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          {/* Tactical drone flanking the main title on the far left */}
          <TacticalDrone className="left-[4%] top-[36%] hidden sm:block" delay={0.5} scale={1.0} />
          {/* A cool tactical drone floating nicely in the left-center background */}
          <TacticalDrone className="left-[25%] top-[14%] hidden lg:block" delay={2.0} scale={0.75} />
          {/* A squad drone positioned safely at center-left high altitude */}
          <TacticalDrone className="left-[42%] top-[5%] hidden md:block" delay={1.2} scale={0.65} />
        </div>
        
        {/* Upper Split row layout: Col-span-7 Left (Typography), Col-span-5 Right (Telemetry stats widgets) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          
          {/* LEFT TELEMETRY BLOCK: The BIG header typography */}
          <section id="hero-typography-details" className="lg:col-span-7 text-left space-y-4 relative z-10">
            
            {/* Header tag */}
            <div className="flex items-center gap-2">
              <span className="text-red-500 font-extrabold font-mono text-[11px] tracking-[0.2em]">
                // WELCOME TO THE FRONTIER
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-ping" />
            </div>

            {/* Futuristic Double Title line as requested exactly */}
            <div className="space-y-0.5">
              <h2 className="font-display font-black text-6xl sm:text-7.5xl md:text-8.5xl tracking-normal text-white uppercase leading-[0.95] select-text">
                FUTURE
              </h2>
              <h2 className="font-display font-black text-6xl sm:text-7.5xl md:text-8.5xl tracking-normal text-red-600 uppercase leading-[0.95] select-text">
                IS WAR
              </h2>
            </div>

            {/* Description text matches screenshot */}
            <p className="text-[12px] sm:text-[13px] md:text-[14px] text-neutral-400 font-medium font-sans uppercase leading-relaxed max-w-xl select-text">
              NEXUS PROJECT IS A FUTURISTIC FPS THAT THROWS YOU INTO RELENTLESS 6V6 COMBAT ACROSS COLLAPSING WORLDS. STRAP IN, PREPARE CORNER ENFORCEMENT PROTOCOLS, AND SECURE THE METROPOLIS.
            </p>

            {/* Custom crafted styled Action buttons */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              
              {/* Deploy solid slanted button with a custom clipPath polygon */}
              <button
                id="btn-deploy-solider-combat"
                onClick={() => {
                  addLog('NEXUS-07', 'COMMITTED COMMANDER TO THE FRONT LINES: DEPLOY NOW STACK TRIGGERED.', 'success');
                  setIsAlertActive(true);
                  if ('speechSynthesis' in window) {
                    window.speechSynthesis.cancel();
                    window.speechSynthesis.speak(new SpeechSynthesisUtterance("Deploying Operator 07... Prepare for combat drop."));
                  }
                }}
                className="bg-red-600 hover:bg-red-500 active:bg-red-700 text-white font-mono tracking-widest font-black px-6 py-3 text-xs uppercase cursor-pointer select-none transition-all duration-200 shadow-[0_0_20px_rgba(239,68,68,0.35)] hover:shadow-[0_0_25px_rgba(239,68,68,0.5)] flex items-center gap-2 min-h-[44px]"
                style={{
                  clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))'
                }}
              >
                <span>DEPLOY NOW</span>
                <span className="font-sans font-extrabold">&gt;</span>
              </button>

              {/* Watch trailer hollow button outlined style */}
              <button
                id="btn-watch-trailer-trigger"
                onClick={() => {
                  addLog('HQ', 'COM_FEED RE-ROUTING TRAILER SIGNAL COMS.', 'warning');
                  // Quick simulated link feedback
                  alert("RE-LINK STREAM: Opening direct battlefield training simulator trailer inside HQ comgrid.");
                }}
                className="bg-white/[0.03] hover:bg-red-650/10 hover:text-white border border-neutral-800 hover:border-red-600 text-neutral-300 font-mono tracking-widest font-bold px-5 py-3 text-xs uppercase cursor-pointer select-none transition-all duration-200 flex items-center gap-2 min-h-[44px]"
                style={{
                  clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))'
                }}
              >
                <Play className="w-3.5 h-3.5 text-red-500 fill-red-500/10" />
                <span>WATCH TRAILER</span>
              </button>

            </div>

          </section>

          {/* RIGHT COLUMNS: Overlaid telemetry boxes stacked vertically */}
          <section id="hero-telemetry-widgets" className="lg:col-span-5 space-y-4">
            
            {/* UNIT STATUS HERO WIDGET MATCHING SCREENSHOT EXACTLY */}
            <div id="stat-widget-unit-status" className="p-4 rounded bg-neutral-900/60 border border-neutral-800/80 backdrop-blur-md flex flex-col justify-between font-mono h-[116px] shadow-[0_0_25px_rgba(0,0,0,0.85)] max-w-sm ml-auto relative overflow-hidden group">
              <div className="absolute inset-x-0 top-0 h-[1.5px] bg-red-600/35 group-hover:bg-red-500/50 transition-all" />
              
              <div className="flex items-center justify-between text-neutral-400 text-[8px] sm:text-[9.5px] tracking-[0.18em] font-black uppercase">
                <span>// UNIT STATUS</span>
                <span className="text-red-500">- 100%</span>
              </div>

              <div className="flex items-center justify-between mt-1 flex-1">
                <div className="flex flex-col justify-center">
                  <div className="flex items-baseline font-black leading-none">
                    <span className="text-[44px] md:text-[48px] text-white tracking-tighter">100</span>
                    <span className="text-lg text-red-500 font-extrabold ml-0.5">%</span>
                  </div>
                  <span className="text-[9px] text-red-500 font-black tracking-[0.25em] uppercase mt-2.5 leading-none">
                    OPERATIONAL
                  </span>
                </div>

                {/* Sparkling SVG pulse generator representing the heartbeat pipeline */}
                <div className="w-[145px] h-12 flex items-center justify-center pointer-events-none opacity-90 pl-3">
                  <svg className="w-full h-full text-red-650 filter drop-shadow-[0_0_8px_rgba(239,68,68,0.7)]" viewBox="0 0 120 24" fill="none" preserveAspectRatio="none">
                    <path
                      d="M0,12 L30,12 L35,4 L40,20 L45,12 L50,12 L53,1 L57,23 L61,12 L70,12 L75,16 L80,8 L85,12 L120,12"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="animate-pulse"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* SYS_DIAGNOSTICS_CON terminal panel directly below aligned perfectly to the right side */}
            <div id="diagnostics-terminal-panel-wrapper" className="shadow-2xl max-w-sm ml-auto w-full">
              <TerminalPanel
                logs={logs}
                addLog={addLog}
                subsystems={subsystems}
                setSubsystems={setSubsystems}
                weaponSystem={weaponSystem}
                setWeaponSystem={setWeaponSystem}
                onHoverClearChange={setIsHoveringClear}
              />
            </div>

          </section>

        </div>

        {/* BOTTOM METRICS PANEL: BENTO DIAGNOSTICS */}
        <section id="bento-diagnostics-section" className="relative z-20 pt-2 pb-4">
          <SystemGrid
            gps={gpsCoords}
            weaponSystem={weaponSystem}
            subsystems={subsystems}
          />
        </section>

      </main>

      {/* 4. FOOTER CREDITS */}
      <footer id="nexus-footer" className="relative z-20 border-t border-neutral-900/60 p-4 bg-black/95 font-mono text-[9px] text-neutral-500 text-center">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2 text-neutral-600 uppercase tracking-widest">
          <p>© 2026 NEXUS DEFENSE CORP. SECURE MILITARY ENFORCEMENT NETWORKS ENGAGED ON CLOUDCONTAINERS.</p>
          <p className="flex items-center gap-1 text-[8.5px] font-black">
            <span>SYS_LINK: 100% OPERATIONAL</span>
          </p>
        </div>
      </footer>

      {/* Floating GPS compass/radar overlay indicator right side (Responsive, hides on smaller touch displays) */}
      <AnimatePresence>
        {isAlertActive && (
          <motion.div
            id="tactical-threat-warning-overlay"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className="fixed bottom-24 right-5 z-40 hidden md:flex flex-col gap-2 p-3 bg-neutral-950/95 border border-red-600/50 rounded shadow-2xl font-mono text-[9px] max-w-[210px] pointer-events-auto backdrop-blur-md"
          >
            <div className="flex items-center justify-between border-b border-red-950/40 pb-1.5 mb-1.5 font-bold text-white uppercase text-[10px]">
              <div className="flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 text-red-500 animate-pulse" />
                <span>RADAR WARNING</span>
              </div>
              <button
                onClick={() => setIsAlertActive(false)}
                className="text-neutral-500 hover:text-red-500 cursor-pointer text-[10px] pl-2 font-bold select-none"
              >
                ╳
              </button>
            </div>
            
            <p className="text-neutral-300 leading-relaxed uppercase">
              COGNITIVE DEFENSE MATRIX ACTIVE. DETECTED HOSTILE DROPS AT COORDINATES BEARING: {gpsCoords.bearing}.
            </p>

            <div className="flex gap-1.5 pt-1">
              <button
                id="btn-re-verify-radar"
                onClick={() => {
                  addLog('SYSTEM', 'RADAR SCAN STACK REGISTERED: SENSORS COLD CORES NOMINAL.', 'success');
                  if ('speechSynthesis' in window) {
                    window.speechSynthesis.cancel();
                    window.speechSynthesis.speak(new SpeechSynthesisUtterance("Scanning threat vector... Optimal deflection verified."));
                  }
                }}
                className="bg-red-600/20 hover:bg-red-600/30 border border-red-600/55 p-1 rounded font-bold text-red-400 hover:text-white cursor-pointer w-full text-center py-1.5"
              >
                RE-VERIFY radar
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
