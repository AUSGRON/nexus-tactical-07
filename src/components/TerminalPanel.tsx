/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Terminal, Send, Cpu, Radio, ShieldAlert, Sparkles, Volume2, RefreshCw, BatteryCharging } from 'lucide-react';
import { LogEntry, SubsystemStatus, WeaponSys } from '../types';

interface TerminalPanelProps {
  logs: LogEntry[];
  addLog: (sender: 'SYSTEM' | 'NEXUS-07' | 'HQ' | 'ERROR', message: string, type: 'info' | 'success' | 'warning' | 'critical') => void;
  subsystems: SubsystemStatus[];
  setSubsystems: React.Dispatch<React.SetStateAction<SubsystemStatus[]>>;
  weaponSystem: WeaponSys;
  setWeaponSystem: React.Dispatch<React.SetStateAction<WeaponSys>>;
  onHoverClearChange?: (hovering: boolean) => void;
}

export default function TerminalPanel({
  logs,
  addLog,
  subsystems,
  setSubsystems,
  weaponSystem,
  setWeaponSystem,
  onHoverClearChange,
}: TerminalPanelProps) {
  const [inputValue, setInputValue] = useState('');
  const logsEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom of logs
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  // Read terminal aloud
  const speakLog = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const cleanText = text.replace(/[\/\/\#\[\]\-\:\_]/g, ' ');
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 1.1;
      utterance.pitch = 0.85;
      
      const voices = window.speechSynthesis.getVoices();
      const engVoice = voices.find(voice => voice.lang.includes('en') && (voice.name.includes('Google') || voice.name.includes('Natural')));
      if (engVoice) {
        utterance.voice = engVoice;
      }
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleCommand = (cmdStr: string) => {
    const origCmd = cmdStr.trim();
    if (!origCmd) return;

    addLog('NEXUS-07', origCmd, 'info');
    const cmd = origCmd.toLowerCase();

    // Command Parser
    setTimeout(() => {
      if (cmd === '/help') {
        addLog('SYSTEM', 'DIRECTIVE OVERLAYS:\n  - /scan        Perform multi-spectral sector coordinate scan\n  - /weapon      Purge electromagnetic coils & chamber reload\n  - /hud         Re-calibrate HUD visualizers & overlays\n  - /battery     Optimize nuclear battery thermodynamic cells\n  - /speech      Activate text-to-speech engine of latest log\n  - /clear       Purge local terminal diagnostics buffer', 'info');
      } 
      else if (cmd === '/scan') {
        addLog('SYSTEM', 'INITIATING SCAN OVERLAY ON SECTOR GRID 47...', 'info');
        setTimeout(() => {
          addLog('SYSTEM', 'TACTICAL SCAN COMPLETE. DETECTED HOSTILE SECTOR ENFORCEMENT DRONES: 3. LAT: 35.6895, LNG: 139.6917', 'success');
          speakLog("Scanning complete. Hosts identified in Sector 47.");
        }, 600);
      } 
      else if (cmd === '/weapon') {
        addLog('SYSTEM', 'MUNITIONS STACK EXECUTED. LOADING BLUEPRINT...', 'warning');
        setTimeout(() => {
          setWeaponSystem(prev => ({
            ...prev,
            ammoCurrent: prev.ammoMax,
            heatLevel: 0,
            lockedOn: true
          }));
          addLog('SYSTEM', 'RIFLE RE-LOAD SECURED. VORTEX COILS HEAT REDUCED TO 0%. LOCK DEPLOYED.', 'success');
          speakLog("Weapon reload complete.");
        }, 500);
      } 
      else if (cmd === '/hud') {
        addLog('SYSTEM', 'RE-ALIGNING OPTICAL VISOR FILTERS...', 'info');
        setTimeout(() => {
          addLog('SYSTEM', 'VISOR RE-SYNC COMPLETE. DUAL MULTI-BAND COGNITIVE MODES LOADED.', 'success');
          speakLog("HUD synchronized.");
        }, 500);
      } 
      else if (cmd === '/battery') {
        addLog('SYSTEM', 'OPTIMIZING RE-REACTOR CORE CELLS...', 'warning');
        setTimeout(() => {
          setSubsystems(prev => prev.map(s => {
            if (s.id === 'nuclear-cell') {
              return { ...s, efficiency: 100, temp: 45, load: 30 };
            }
            return s;
          }));
          addLog('SYSTEM', 'BATTERY Micro-INTEGRATION SUCCESSFUL. FUEL ROD CAPACITY AT 100% EFFICIENCY.', 'success');
          speakLog("Main core battery fully balanced.");
        }, 600);
      } 
      else if (cmd === '/speech') {
        const lastRealLog = [...logs].reverse().find(l => l.sender !== 'NEXUS-07');
        if (lastRealLog) {
          addLog('SYSTEM', `AUDIO RE-ROUTE: SYNTHESIZING STATE ALOUD...`, 'info');
          speakLog(lastRealLog.message);
        } else {
          speakLog("Subsystem active operations online.");
        }
      } 
      else if (cmd === '/clear') {
        addLog('SYSTEM', 'PURGING SESSION LOG RECORDINGS...', 'warning');
        speakLog("Purged.");
        window.dispatchEvent(new CustomEvent('clear-terminal-logs'));
      } 
      else {
        addLog('ERROR', `UNRECOGNIZED TERMINAL DIRECTIVE: "${origCmd}". RUN "/help" TO UNLOCK DIRECTIVES.`, 'critical');
        speakLog("Directive unrecognized.");
      }
    }, 200);

    setInputValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCommand(inputValue);
    }
  };

  return (
    <div id="tactical-terminal-container" className="flex flex-col h-full bg-black/90 border border-neutral-900 rounded overflow-hidden shadow-2xl">
      {/* Title Header */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-neutral-950 border-b border-neutral-900 font-mono text-[9px]">
        <div className="flex items-center gap-1.5 text-red-500 font-black tracking-widest text-[9.5px]">
          <span className="w-1.5 h-1.5 bg-red-600 rounded-full animate-blink-status" />
          <span>// SYS_DIAGNOSTICS_CON</span>
        </div>
        <div className="text-neutral-500 font-medium tracking-wider">
          AUTO_POLLING: <span className="text-green-500 font-bold">ACTIVE</span>
        </div>
      </div>

      {/* Logs View Area */}
      <div className="flex-1 p-2.5 min-h-[105px] max-h-[135px] lg:max-h-[145px] overflow-y-auto space-y-1 font-mono text-[9px] select-text bg-neutral-950/40">
        {logs.map((log, index) => {
          const isMe = log.sender === 'NEXUS-07';
          
          let logBadge = 'COM';
          let badgeColor = 'bg-neutral-900 text-neutral-400';
          let textColor = 'text-neutral-300';
          
          if (log.type === 'success') {
            logBadge = 'SYS';
            badgeColor = 'bg-green-950/40 text-green-400';
            textColor = 'text-green-300/90';
          } else if (log.type === 'warning') {
            logBadge = 'WRN';
            badgeColor = 'bg-yellow-950/40 text-yellow-500';
            textColor = 'text-yellow-200/90';
          } else if (log.type === 'critical') {
            logBadge = 'ERR';
            badgeColor = 'bg-red-950/50 text-red-500 border border-red-900/30';
            textColor = 'text-red-400 font-bold';
          } else if (isMe) {
            logBadge = 'USR';
            badgeColor = 'bg-red-600/20 text-red-400';
            textColor = 'text-white font-medium';
          }

          return (
            <div key={index} className="flex items-start gap-1.5 leading-relaxed py-0.5 hover:bg-white/[0.02] px-1 rounded transition-colors">
              <span className="text-neutral-600 shrink-0 select-none">[{log.timestamp}]</span>
              <span className={`px-1 py-0.5 rounded text-[8px] font-bold tracking-widest shrink-0 uppercase select-none ${badgeColor}`}>
                {logBadge}
              </span>
              <div className="flex-1 min-w-0">
                <span className={`whitespace-pre-line break-words ${textColor}`}>
                  {log.message}
                </span>
              </div>
            </div>
          );
        })}
        <div ref={logsEndRef} />
      </div>

      {/* Commands Quick Row */}
      <div className="p-1 px-2 bg-neutral-950 border-t border-b border-neutral-900/60 flex flex-wrap gap-1 justify-start">
        <button
          id="btn-quick-help"
          onClick={() => handleCommand('/help')}
          className="text-[8.5px] font-mono font-bold text-neutral-500 hover:text-white border border-neutral-900 hover:border-red-500 bg-neutral-950 hover:bg-red-950/20 px-1.5 py-1 rounded cursor-pointer min-h-[26px] flex items-center gap-1 transition-all"
        >
          <Sparkles className="w-2.5 h-2.5 text-red-500" />
          <span>HELP</span>
        </button>
        <button
          id="btn-quick-scan"
          onClick={() => handleCommand('/scan')}
          className="text-[8.5px] font-mono font-bold text-neutral-500 hover:text-white border border-neutral-900 hover:border-red-500 bg-neutral-950 hover:bg-red-950/20 px-1.5 py-1 rounded cursor-pointer min-h-[26px] flex items-center gap-1 transition-all"
        >
          <Cpu className="w-2.5 h-2.5 text-neutral-400" />
          <span>SCAN</span>
        </button>
        <button
          id="btn-quick-weapon"
          onClick={() => handleCommand('/weapon')}
          className="text-[8.5px] font-mono font-bold text-neutral-500 hover:text-white border border-neutral-900 hover:border-red-500 bg-neutral-950 hover:bg-red-950/20 px-1.5 py-1 rounded cursor-pointer min-h-[26px] flex items-center gap-1 transition-all"
        >
          <Volume2 className="w-2.5 h-2.5 text-neutral-400" />
          <span>RELOAD</span>
        </button>
        <button
          id="btn-quick-speech"
          onClick={() => handleCommand('/speech')}
          className="text-[8.5px] font-mono font-bold text-neutral-500 hover:text-white border border-neutral-900 hover:border-red-500 bg-neutral-950 hover:bg-red-950/20 px-1.5 py-1 rounded cursor-pointer min-h-[26px] flex items-center gap-1 transition-all"
          title="Speak last system message aloud using speech synthesis"
        >
          <Volume2 className="w-2.5 h-2.5 text-red-500" />
          <span>SYNTH</span>
        </button>
        <button
          id="btn-quick-clear"
          onClick={() => handleCommand('/clear')}
          onMouseEnter={() => onHoverClearChange?.(true)}
          onMouseLeave={() => onHoverClearChange?.(false)}
          className="text-[8.5px] font-mono font-bold text-red-400 hover:text-white border border-neutral-900 hover:border-red-650 bg-neutral-950 hover:bg-red-950/20 px-1.5 py-1 rounded cursor-pointer min-h-[26px] flex items-center gap-1 transition-all"
          title="Hover to lock-on robot gun at cockpit, click to purge logs"
        >
          <RefreshCw className="w-2.5 h-2.5 text-neutral-400 animate-spin" style={{ animationDuration: '8s' }} />
          <span>/CLEAR</span>
        </button>
        <button
          id="btn-quick-recharge"
          onClick={() => handleCommand('/battery')}
          className="text-[8.5px] font-mono font-bold text-green-450 hover:text-white border border-neutral-900 hover:border-green-600 bg-neutral-950 hover:bg-green-950/20 px-1.5 py-1 rounded cursor-pointer min-h-[26px] flex items-center gap-1 transition-all"
          title="Optimize nuclear battery cells back to 100%"
        >
          <BatteryCharging className="w-2.5 h-2.5 text-green-500 animate-pulse" />
          <span>/RECHARGE</span>
        </button>
      </div>

      {/* Input box */}
      <div className="flex items-center gap-1.5 p-1.5 bg-neutral-950">
        <span className="text-red-600 font-black font-mono text-xs select-none pl-1 animate-pulse">$</span>
        <input
          id="terminal-command-input"
          type="text"
          placeholder="Execute command... (e.g. /scan, /help)"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent border-none outline-none font-mono text-[9.5px] text-white placeholder-neutral-700 h-7 focus:ring-0 focus:outline-none"
        />
        <button
          id="btn-send-command"
          onClick={() => handleCommand(inputValue)}
          className="p-1 px-2.5 h-7 flex items-center justify-center bg-red-600/10 hover:bg-red-600/25 text-red-500 hover:text-white rounded border border-red-950/80 hover:border-red-500 cursor-pointer transition-all"
        >
          <Send className="w-2.5 h-2.5" />
        </button>
      </div>
    </div>
  );
}
