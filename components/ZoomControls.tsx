'use client';

import React from 'react';
import { AspectRatioFit } from '@/types/video';
import { ZoomIn, ZoomOut, RotateCcw, Maximize2, Move } from 'lucide-react';

interface ZoomControlsProps {
  zoomLevel: number;
  onZoomChange: (newZoom: number) => void;
  aspectFit: AspectRatioFit;
  onAspectFitChange: (newFit: AspectRatioFit) => void;
  onReset: () => void;
}

export default function ZoomControls({
  zoomLevel,
  onZoomChange,
  aspectFit,
  onAspectFitChange,
  onReset,
}: ZoomControlsProps) {
  const zoomPercent = Math.round(zoomLevel * 100);

  return (
    <div className="w-full glass-panel rounded-xl p-4 md:p-5 border border-zinc-800/60">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        {/* Aspect Ratio Fit Modes */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-zinc-200 flex items-center gap-1.5 uppercase tracking-wider">
            <Maximize2 className="w-3.5 h-3.5 text-pink-300" />
            Aspect Fit Mode
          </label>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => onAspectFitChange('contain')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all border ${
                aspectFit === 'contain'
                  ? 'bg-pink-500/20 border-pink-400 text-pink-300 shadow-sm shadow-pink-500/10'
                  : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-200'
              }`}
              title="Native 16:9 aspect ratio fit"
            >
              Fit (Native 16:9)
            </button>
            <button
              onClick={() => onAspectFitChange('cover')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all border ${
                aspectFit === 'cover'
                  ? 'bg-pink-500/20 border-pink-400 text-pink-300 shadow-sm shadow-pink-500/10'
                  : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-200'
              }`}
              title="Eliminates side black borders"
            >
              Fill (No Side Bars)
            </button>
            <button
              onClick={() => onAspectFitChange('fill')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all border ${
                aspectFit === 'fill'
                  ? 'bg-pink-500/20 border-pink-400 text-pink-300 shadow-sm shadow-pink-500/10'
                  : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-200'
              }`}
              title="Stretch to player bounds"
            >
              Stretch
            </button>
          </div>
        </div>

        {/* Custom Zoom Slider */}
        <div className="flex flex-col gap-1.5 w-full md:w-auto">
          <div className="flex items-center justify-between gap-4">
            <label className="text-xs font-bold text-zinc-200 flex items-center gap-1.5 uppercase tracking-wider">
              <ZoomIn className="w-3.5 h-3.5 text-pink-300" />
              Zoom Scale: <span className="text-pink-300 font-mono">{zoomPercent}%</span>
            </label>
            {zoomLevel > 1 && (
              <span className="text-[10px] text-zinc-400 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800 flex items-center gap-1">
                <Move className="w-3 h-3 text-pink-300" /> Drag video frame to pan
              </span>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => onZoomChange(Math.max(1, zoomLevel - 0.25))}
              disabled={zoomLevel <= 1}
              className="p-1.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              title="Zoom out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>

            <input
              type="range"
              min="1"
              max="3"
              step="0.05"
              value={zoomLevel}
              onChange={(e) => onZoomChange(parseFloat(e.target.value))}
              className="w-28 md:w-36 accent-pink-400"
            />

            <button
              onClick={() => onZoomChange(Math.min(3, zoomLevel + 0.25))}
              disabled={zoomLevel >= 3}
              className="p-1.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              title="Zoom in"
            >
              <ZoomIn className="w-4 h-4" />
            </button>

            <button
              onClick={onReset}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-zinc-900 border border-zinc-800 text-xs font-medium text-zinc-300 hover:text-pink-300 transition-colors"
              title="Reset Zoom & Fit"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
