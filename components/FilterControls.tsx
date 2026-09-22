'use client';

import React from 'react';
import { VisualFilter } from '@/types/video';
import { VISUAL_FILTERS } from '@/lib/filters';
import { Sliders, Check } from 'lucide-react';

interface FilterControlsProps {
  currentFilter: VisualFilter;
  onSelectFilter: (filterId: VisualFilter) => void;
}

export default function FilterControls({
  currentFilter,
  onSelectFilter,
}: FilterControlsProps) {
  return (
    <div className="w-full glass-panel rounded-xl p-4 md:p-5 border border-zinc-800/60">
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-zinc-800/60">
        <Sliders className="w-4 h-4 text-pink-300" />
        <h4 className="text-xs font-bold text-zinc-200 uppercase tracking-wider">
          Visual Filters
        </h4>
        <span className="text-[11px] text-zinc-500 font-normal ml-auto hidden sm:inline">
          Client-Side Processing
        </span>
      </div>

      {/* Filter Selection Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-2">
        {VISUAL_FILTERS.map((filter) => {
          const isActive = currentFilter === filter.id;
          return (
            <button
              key={filter.id}
              onClick={() => onSelectFilter(filter.id)}
              className={`p-2.5 rounded-lg border text-left transition-all duration-150 flex flex-col justify-between ${
                isActive
                  ? 'bg-pink-500/20 border-pink-400/80 text-white shadow-sm shadow-pink-500/10'
                  : 'bg-zinc-900/60 border-zinc-800/60 text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold truncate">{filter.name}</span>
                {isActive && <Check className="w-3 h-3 text-pink-300 shrink-0" />}
              </div>
              <p className="text-[10px] text-zinc-500 line-clamp-1">
                {filter.description}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
