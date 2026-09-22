'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { VideoItem } from '@/types/video';
import { getVideoStreamUrl, downloadVideoFile } from '@/lib/videos';
import { Play, Clock, HardDrive, ArrowRight, Shield, Download } from 'lucide-react';

interface VideoCardProps {
  video: VideoItem;
}

export default function VideoCard({ video }: VideoCardProps) {
  const [savedTime, setSavedTime] = useState<number | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(`sup_video_progress_${video.id}`);
      if (stored) {
        const time = parseFloat(stored);
        if (time > 5 && time < video.durationSeconds - 10) {
          setSavedTime(time);
        }
      }
    } catch (e) {
      console.error('Error loading saved time', e);
    }
  }, [video.id, video.durationSeconds]);

  const formatSavedTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const streamUrl = getVideoStreamUrl(video);
    downloadVideoFile(streamUrl, video.filename);
  };

  return (
    <div className="group relative rounded-xl glass-panel border border-zinc-800/60 hover:border-pink-400/50 transition-all duration-300 hover:shadow-xl hover:shadow-black/70 overflow-hidden flex flex-col h-full">
      {/* Top Media Aspect Box */}
      <div className="relative aspect-video w-full bg-black flex items-center justify-center overflow-hidden">
        {/* Subtle dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-0" />

        {/* Play Icon */}
        <Link
          href={`/watch/${video.id}`}
          className="relative z-10 w-12 h-12 rounded-full bg-pink-400 text-black hover:bg-pink-300 hover:scale-105 transition-all duration-200 flex items-center justify-center pl-0.5 shadow-lg shadow-pink-500/30"
        >
          <Play className="w-5 h-5 fill-black" />
        </Link>

        {/* Section Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10 pointer-events-none">
          <span className="px-2.5 py-0.5 rounded text-[10px] font-semibold bg-zinc-950/90 text-zinc-300 border border-zinc-800 backdrop-blur-md">
            {video.eventSection}
          </span>
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-pink-500/15 text-pink-300 border border-pink-400/30 backdrop-blur-md">
            1080p HD
          </span>
        </div>

        {/* Resume progress bar */}
        {savedTime && (
          <div className="absolute bottom-0 left-0 right-0 bg-black/90 p-2 z-10 border-t border-zinc-800">
            <div className="flex items-center justify-between text-[10px] text-pink-300 font-mono mb-1">
              <span>Resume available</span>
              <span>{formatSavedTime(savedTime)}</span>
            </div>
            <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-pink-400"
                style={{ width: `${(savedTime / video.durationSeconds) * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="p-5 flex flex-col flex-grow justify-between">
        <div>
          <h3 className="text-base font-bold text-zinc-100 group-hover:text-pink-300 transition-colors line-clamp-1 mb-1">
            {video.title}
          </h3>
          <p className="text-xs text-pink-300/90 font-medium mb-2">{video.subtitle}</p>
          <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed mb-4">
            {video.description}
          </p>
        </div>

        {/* Card Footer */}
        <div className="pt-3 border-t border-zinc-800/60 flex items-center justify-between text-xs text-zinc-400 font-medium">
          <div className="flex items-center gap-3 font-mono text-[11px]">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-zinc-500" />
              {video.duration}
            </span>
            <span className="flex items-center gap-1">
              <HardDrive className="w-3.5 h-3.5 text-zinc-500" />
              {video.size}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleDownload}
              className="flex items-center gap-1 text-[11px] font-medium text-zinc-400 hover:text-pink-300 transition-colors"
              title="Download Video File"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download</span>
            </button>

            <Link
              href={`/watch/${video.id}`}
              className="flex items-center gap-1 text-xs font-semibold text-pink-300 hover:text-pink-200 transition-colors"
            >
              <span>Watch</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
