'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import VideoPlayer from '@/components/VideoPlayer';
import FilterControls from '@/components/FilterControls';
import ZoomControls from '@/components/ZoomControls';
import { BIRTHDAY_VIDEOS, getVideoById, getVideoStreamUrl, downloadVideoFile } from '@/lib/videos';
import { VisualFilter, AspectRatioFit } from '@/types/video';
import { ArrowLeft, Clock, HardDrive, Film, Share2, Check, Download } from 'lucide-react';

export default function WatchPage() {
  const params = useParams();
  const router = useRouter();
  const videoId = params?.videoId as string;

  const [filter, setFilter] = useState<VisualFilter>('normal');
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [aspectFit, setAspectFit] = useState<AspectRatioFit>('contain');
  const [copiedLink, setCopiedLink] = useState(false);
  const [authed, setAuthed] = useState<boolean | null>(null);

  // Auth check
  useEffect(() => {
    fetch('/api/auth/check')
      .then((res) => res.json())
      .then((data) => {
        if (!data.authenticated) {
          router.push('/');
        } else {
          setAuthed(true);
        }
      })
      .catch(() => router.push('/'));
  }, [router]);

  const video = getVideoById(videoId);

  if (authed === null) {
    return (
      <div className="min-h-screen bg-[#050508] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-pink-400 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs text-zinc-400 font-medium">Verifying Session...</span>
        </div>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="min-h-screen bg-[#050508] flex items-center justify-center p-4">
        <div className="text-center glass-panel p-8 rounded-xl max-w-md border border-zinc-800">
          <Film className="w-10 h-10 text-pink-300 mx-auto mb-3" />
          <h2 className="text-base font-bold text-white mb-2">Video Not Found</h2>
          <p className="text-xs text-zinc-400 mb-4">
            The requested video memory could not be located in the library.
          </p>
          <Link
            href="/library"
            className="px-4 py-2 rounded-md bg-pink-400 text-black font-bold text-xs hover:bg-pink-300 transition-colors inline-block"
          >
            Back to Library
          </Link>
        </div>
      </div>
    );
  }

  const streamUrl = getVideoStreamUrl(video);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleDownload = () => {
    downloadVideoFile(streamUrl, video.filename);
  };

  const otherVideos = BIRTHDAY_VIDEOS.filter((v) => v.id !== video.id);

  return (
    <div className="flex-grow flex flex-col min-h-screen">
      <Header showLogout={true} />

      <main className="flex-grow max-w-7xl mx-auto w-full px-4 lg:px-8 py-6 md:py-8 space-y-6">
        {/* Navigation & Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-zinc-800/80">
          <div className="flex items-center gap-3">
            <Link
              href="/library"
              className="p-2 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800 transition-all"
              title="Return to Library"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase bg-pink-500/15 text-pink-300 border border-pink-400/30">
                  {video.eventSection}
                </span>
                <span className="text-xs text-zinc-500 font-mono">{video.date}</span>
              </div>
              <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight mt-0.5">
                {video.title}
              </h1>
            </div>
          </div>

          {/* Share & Download Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-pink-500/15 border border-pink-400/30 text-xs font-semibold text-pink-300 hover:bg-pink-400 hover:text-black transition-all shadow-sm shadow-pink-500/10"
              title="Download Video File"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download</span>
            </button>

            <button
              onClick={handleCopyLink}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-zinc-900 border border-zinc-800 text-xs font-medium text-zinc-300 hover:text-white hover:bg-zinc-800 transition-all"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-pink-300" /> : <Share2 className="w-3.5 h-3.5 text-zinc-400" />}
              <span>{copiedLink ? 'Link Copied' : 'Share'}</span>
            </button>
          </div>
        </div>

        {/* Video Player */}
        <VideoPlayer
          video={video}
          streamUrl={streamUrl}
          filter={filter}
          zoomLevel={zoomLevel}
          aspectFit={aspectFit}
        />

        {/* Zoom & Aspect Fit Controls */}
        <ZoomControls
          zoomLevel={zoomLevel}
          onZoomChange={setZoomLevel}
          aspectFit={aspectFit}
          onAspectFitChange={setAspectFit}
          onReset={() => {
            setZoomLevel(1);
            setAspectFit('contain');
          }}
        />

        {/* Filter Controls */}
        <FilterControls
          currentFilter={filter}
          onSelectFilter={setFilter}
        />

        {/* Video Info Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 glass-panel rounded-xl p-5 md:p-6 border border-zinc-800">
            <h3 className="text-sm font-bold text-white mb-1">{video.subtitle}</h3>
            <p className="text-xs text-zinc-400 leading-relaxed mb-4">
              {video.description}
            </p>

            <div className="flex flex-wrap items-center gap-1.5 pt-4 border-t border-zinc-800/80">
              <span className="text-xs font-medium text-zinc-500 mr-1">Tags:</span>
              {video.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded text-[11px] font-medium bg-zinc-950 text-pink-300/90 border border-zinc-800"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Details Panel */}
          <div className="glass-panel rounded-xl p-5 md:p-6 border border-zinc-800 flex flex-col justify-between">
            <h4 className="text-xs font-bold text-zinc-200 uppercase tracking-wider mb-3">
              Technical Details
            </h4>

            <div className="space-y-2 text-xs text-zinc-400 font-mono">
              <div className="flex justify-between py-1 border-b border-zinc-800/60">
                <span className="text-zinc-500 font-sans">Duration:</span>
                <span className="text-pink-300 font-bold">{video.duration}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-zinc-800/60">
                <span className="text-zinc-500 font-sans">File Size:</span>
                <span className="text-zinc-300">{video.size}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-zinc-800/60">
                <span className="text-zinc-500 font-sans">Resolution:</span>
                <span className="text-zinc-300">{video.resolution}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-zinc-800/60">
                <span className="text-zinc-500 font-sans">Aspect Ratio:</span>
                <span className="text-zinc-300">{video.aspectRatio}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-zinc-500 font-sans">File:</span>
                <span className="text-zinc-400 truncate max-w-[140px]" title={video.filename}>
                  {video.filename}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Up Next Section */}
        <div className="pt-6 border-t border-zinc-800/80">
          <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-4">
            More Videos in Vault
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {otherVideos.map((other) => (
              <Link
                key={other.id}
                href={`/watch/${other.id}`}
                className="group p-4 rounded-xl glass-panel border border-zinc-800 hover:border-pink-400/50 transition-all flex items-center justify-between"
              >
                <div>
                  <span className="text-[10px] font-semibold text-pink-300 uppercase tracking-wider block">
                    {other.eventSection}
                  </span>
                  <h4 className="text-xs font-bold text-white group-hover:text-pink-300 transition-colors line-clamp-1">
                    {other.title}
                  </h4>
                  <span className="text-[11px] text-zinc-500 font-mono">{other.duration} &bull; {other.size}</span>
                </div>
                <div className="w-8 h-8 rounded-lg bg-zinc-950 border border-zinc-800 flex items-center justify-center shrink-0 group-hover:bg-pink-400 transition-colors">
                  <Film className="w-4 h-4 text-zinc-400 group-hover:text-black" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
