/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Video, Upload, Link2, Eye, EyeOff, Sliders, Volume2, VolumeX, Sparkles, RefreshCw } from 'lucide-react';
import { VideoOption } from '../types';

interface VideoEngineProps {
  videoUrl: string;
  setVideoUrl: (url: string) => void;
  videoOpacity: number;
  setVideoOpacity: (val: number) => void;
  videoBlur: number;
  setVideoBlur: (val: number) => void;
  isMuted: boolean;
  setIsMuted: (val: boolean) => void;
  videoFile: File | null;
  setVideoFile: (file: File | null) => void;
  localVideoUrl: string;
  setLocalVideoUrl: (url: string) => void;
}

export const BUILTIN_VIDEOS: VideoOption[] = [
  {
    id: 'nexus-soldier-active-loop',
    name: 'Nexus Soldier Active Loop (HQ)',
    url: 'https://img.domoai.app/ai-artwork-video/c2449ee6-06f2-4f56-8594-c7d21aa9358e.mp4',
    category: 'Atmospheric',
    description: 'Highest-fidelity looping tactical simulation video generated using KlingAI render, with integrated multi-visor state animations.',
  },
  {
    id: 'circuit-grid',
    name: 'Tactical Cyber Matrix',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-digital-circuit-board-interface-background-42171-large.mp4',
    category: 'Circuit',
    description: 'Glowing circuitry and structural flows representing CPU interface telemetry.',
  },
  {
    id: 'cyber-space',
    name: 'Cosmic Quantum Stream',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-abstract-glowing-digital-particle-lines-background-47806-large.mp4',
    category: 'Grid',
    description: 'Fluid streams of vertical lines and data points forming high-speed visual structures.',
  },
  {
    id: 'nexus-terminal',
    name: 'Subway Nexus Node',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-futuristic-subway-station-with-neon-lights-and-screens-43950-large.mp4',
    category: 'Atmospheric',
    description: 'Immersive orange cyber tunnels linking futuristic combat hubs.',
  },
  {
    id: 'cyberpunk-neon',
    name: 'Metropolitan Terminal',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-cyberpunk-city-at-night-with-rain-and-neon-lights-42994-large.mp4',
    category: 'Ambient',
    description: 'Rainy futuristic cityscape glowing with high-density neon branding.',
  }
];

export default function VideoEngine({
  videoUrl,
  setVideoUrl,
  videoOpacity,
  setVideoOpacity,
  videoBlur,
  setVideoBlur,
  isMuted,
  setIsMuted,
  videoFile,
  setVideoFile,
  localVideoUrl,
  setLocalVideoUrl,
}: VideoEngineProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle Drag & Drop events
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('video/')) {
        processVideoFile(file);
      }
    }
  };

  const processVideoFile = (file: File) => {
    setVideoFile(file);
    const objectUrl = URL.createObjectURL(file);
    setLocalVideoUrl(objectUrl);
    setVideoUrl(objectUrl);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processVideoFile(e.target.files[0]);
    }
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (urlInput.trim()) {
      setVideoFile(null);
      setLocalVideoUrl('');
      setVideoUrl(urlInput.trim());
    }
  };

  const selectBuiltin = (option: VideoOption) => {
    setVideoFile(null);
    setLocalVideoUrl('');
    setVideoUrl(option.url);
  };

  return (
    <div id="video-engine-module" className="relative z-50">
      {/* Mini floating triggers */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          id="btn-toggle-engine-panel"
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded border text-xs font-mono transition-all duration-200 cursor-pointer ${
            isOpen 
              ? 'bg-red-600/20 border-red-500 text-red-400' 
              : 'bg-black/80 border-neutral-800 text-neutral-400 hover:border-red-600/50 hover:text-white'
          }`}
        >
          <Video className="w-3.5 h-3.5" />
          <span>VIDEO FEED PANEL</span>
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-blink-status ml-1"></span>
        </button>

        <button
          id="btn-toggle-engine-mute"
          onClick={() => setIsMuted(!isMuted)}
          className={`p-1.5 rounded border transition-all duration-200 cursor-pointer text-xs ${
            isMuted 
              ? 'border-neutral-800 text-neutral-500 bg-neutral-900/50 hover:border-neutral-700' 
              : 'border-red-600/30 text-red-500 bg-red-600/10 hover:border-red-500'
          }`}
          title={isMuted ? "Unmute tactical overlay" : "Mute tactical overlay"}
        >
          {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Control Drawer / Panel */}
      {isOpen && (
        <motion.div
          id="engine-control-panel-modal"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute right-0 top-full mt-3 w-80 sm:w-96 p-4 rounded bg-black/95 border border-red-600/40 shadow-2xl backdrop-blur-xl max-h-[85vh] overflow-y-auto font-mono text-xs text-neutral-300"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-red-950/60 pb-3.5 mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-red-500 animate-pulse" />
              <div>
                <h4 className="text-white font-bold tracking-wider text-xs">VIDEO BACKGROUND CONFIGURER</h4>
                <p className="text-[10px] text-neutral-500">FEED DYNAMIC KLING AI OR LOCAL STREAM</p>
              </div>
            </div>
            <button
              id="btn-close-video-panel"
              onClick={() => setIsOpen(false)}
              className="text-neutral-500 hover:text-red-500 hover:scale-110 transition-all font-bold p-1 cursor-pointer"
            >
              ╳
            </button>
          </div>

          <div className="space-y-4">
            {/* Custom file drag drop and selector */}
            <div>
              <span className="block text-[10px] text-red-500 uppercase tracking-widest font-bold mb-2">
                1. FEED YOUR OWN KLING AI VIDEO (.mp4, .webm)
              </span>
              <div
                id="video-dropzone"
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded p-4 text-center cursor-pointer transition-all duration-200 ${
                  isDragOver
                    ? 'border-red-500 bg-red-950/20 text-red-400'
                    : videoFile
                    ? 'border-green-600/45 bg-green-950/10 text-green-400'
                    : 'border-neutral-800 bg-neutral-900/40 text-neutral-500 hover:border-red-600/50 hover:bg-neutral-900/80 hover:text-neutral-300'
                }`}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="video/*"
                  className="hidden"
                />
                <Upload className="w-6 h-6 mx-auto mb-2 text-red-600/70" />
                {videoFile ? (
                  <div className="text-[10px]">
                    <p className="text-white font-semibold truncate">{videoFile.name}</p>
                    <p className="text-neutral-500 mt-1">{(videoFile.size / (1024 * 1024)).toFixed(2)} MB • Dynamic Hook Loaded</p>
                  </div>
                ) : (
                  <div>
                    <p className="font-semibold text-[10px] text-neutral-300">DRAG & DROP DYNAMIC HERO VIDEO</p>
                    <p className="text-[9px] text-neutral-500 mt-0.5">Click to browse your local KlingAI video</p>
                  </div>
                )}
              </div>
            </div>

            {/* Custom Video URL Stream Input */}
            <div>
              <span className="block text-[10px] text-red-500 uppercase tracking-widest font-bold mb-2">
                2. VIDEO WEB STREAM LINK
              </span>
              <form onSubmit={handleUrlSubmit} className="flex gap-1.5">
                <div className="relative flex-1">
                  <Link2 className="absolute left-2 top-2.5 w-3 h-3 text-neutral-600" />
                  <input
                    id="input-custom-video-url"
                    type="url"
                    placeholder="Paste direct .mp4 URL stream..."
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    className="w-full bg-neutral-900/90 border border-neutral-800 rounded px-2.5 py-2 pl-7 text-[11px] font-mono text-white placeholder-neutral-600 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600/30"
                  />
                </div>
                <button
                  id="btn-submit-video-url"
                  type="submit"
                  className="bg-red-700/80 hover:bg-red-600 border border-red-500 hover:border-red-400 text-white px-2.5 py-1.5 rounded cursor-pointer font-bold transition-all text-[10px]"
                >
                  LOAD
                </button>
              </form>
            </div>

            {/* Built-in fallback catalog */}
            <div>
              <span className="block text-[10px] text-red-500 uppercase tracking-widest font-bold mb-2">
                3. DEMO HIGH-TECH STOCK FEED
              </span>
              <div className="grid grid-cols-1 gap-1.5 max-h-40 overflow-y-auto pr-1">
                {BUILTIN_VIDEOS.map((opt) => {
                  const isActive = videoUrl === opt.url && !videoFile;
                  return (
                    <button
                      id={`btn-select-builtin-video-${opt.id}`}
                      key={opt.id}
                      onClick={() => selectBuiltin(opt)}
                      className={`text-left p-2 rounded border font-mono transition-all cursor-pointer ${
                        isActive
                          ? 'bg-red-950/20 border-red-500 text-white'
                          : 'bg-neutral-900/50 border-neutral-900 hover:border-neutral-800 hover:bg-neutral-900 text-neutral-400'
                      }`}
                    >
                      <div className="flex justify-between items-center text-[10px]">
                        <span className="font-bold tracking-wide">{opt.name}</span>
                        <span className="text-[8px] bg-neutral-950 px-1 py-0.5 rounded text-neutral-500">
                          {opt.category}
                        </span>
                      </div>
                      <p className="text-[9px] text-neutral-500 mt-1 font-sans line-clamp-1">
                        {opt.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Video Parameters sliders */}
            <div className="border-t border-neutral-900/70 pt-3">
              <span className="block text-[10px] text-red-500 uppercase tracking-widest font-bold mb-2.5">
                4. RENDERING ENGINE ADJUSTER
              </span>

              <div className="space-y-3">
                {/* Opacity slider */}
                <div>
                  <div className="flex justify-between text-[9px] mb-1">
                    <span>FEED OPACITY</span>
                    <span className="text-white font-bold">{(videoOpacity * 100).toFixed(0)}%</span>
                  </div>
                  <input
                    id="slider-video-opacity"
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={videoOpacity}
                    onChange={(e) => setVideoOpacity(parseFloat(e.target.value))}
                    className="w-full accent-red-600 bg-neutral-800 h-1 rounded-full cursor-pointer"
                  />
                </div>

                {/* Blur slider */}
                <div>
                  <div className="flex justify-between text-[9px] mb-1">
                    <span>FEED GAUSSIAN BLUR</span>
                    <span className="text-white font-bold">{videoBlur}px</span>
                  </div>
                  <input
                    id="slider-video-blur"
                    type="range"
                    min="0"
                    max="16"
                    step="1"
                    value={videoBlur}
                    onChange={(e) => setVideoBlur(parseInt(e.target.value))}
                    className="w-full accent-red-600 bg-neutral-800 h-1 rounded-full cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Quick Diagnostics */}
            <div className="bg-neutral-900/30 p-2 border border-neutral-900 rounded text-[9px] text-neutral-500 flex justify-between items-center">
              <div>
                <p>STATUS: <span className="text-green-500 animate-pulse font-bold">STREAM ONLINE</span></p>
                <p className="mt-0.5 text-[8px] truncate max-w-[200px]">SRC: {videoUrl}</p>
              </div>
              {videoFile && (
                <button
                  id="btn-reset-video-feed"
                  onClick={() => {
                    setVideoFile(null);
                    setLocalVideoUrl('');
                    setVideoUrl(BUILTIN_VIDEOS[0].url);
                  }}
                  className="bg-neutral-800 hover:bg-neutral-700 text-white p-1 rounded font-mono text-[8px] cursor-pointer"
                  title="Reset to default stream"
                >
                  <RefreshCw className="w-2.5 h-2.5" />
                </button>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
